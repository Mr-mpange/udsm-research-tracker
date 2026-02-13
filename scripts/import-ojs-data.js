/**
 * Import OJS Database to Supabase
 * This script reads the tjpsd32 SQL file and imports it to Supabase in chunks
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';

// ES module equivalents for __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read environment variables from .env file
function loadEnv() {
  const envPath = path.join(__dirname, '..', '.env');
  if (!fs.existsSync(envPath)) {
    console.error('❌ .env file not found');
    process.exit(1);
  }
  
  const envContent = fs.readFileSync(envPath, 'utf8');
  const env = {};
  
  envContent.split('\n').forEach(line => {
    line = line.trim();
    if (!line || line.startsWith('#')) return;
    
    const equalIndex = line.indexOf('=');
    if (equalIndex === -1) return;
    
    const key = line.substring(0, equalIndex).trim();
    let value = line.substring(equalIndex + 1).trim();
    
    // Remove quotes
    if ((value.startsWith('"') && value.endsWith('"')) || 
        (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    
    env[key] = value;
  });
  
  return env;
}

const env = loadEnv();
const SUPABASE_URL = env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = env.VITE_SUPABASE_ANON_KEY || env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error('❌ Missing Supabase credentials in .env file');
  console.error('Please set VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY');
  console.error('Found in .env:', Object.keys(env));
  process.exit(1);
}

// Initialize Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

/**
 * Parse INSERT statements from SQL file
 */
function parseInsertStatements(sqlContent, tableName) {
  const insertPattern = new RegExp(
    `INSERT INTO \`${tableName}\` \\([^)]+\\) VALUES\\s*([^;]+);`,
    'gi'
  );
  
  const matches = [];
  let match;
  
  while ((match = insertPattern.exec(sqlContent)) !== null) {
    matches.push(match[0]);
  }
  
  return matches;
}

/**
 * Extract column names from INSERT statement
 */
function extractColumns(insertStatement) {
  const columnMatch = insertStatement.match(/INSERT INTO `[^`]+` \(([^)]+)\)/);
  if (!columnMatch) return [];
  
  return columnMatch[1]
    .split(',')
    .map(col => col.trim().replace(/`/g, ''));
}

/**
 * Parse VALUES from INSERT statement
 */
function parseValues(insertStatement) {
  const valuesMatch = insertStatement.match(/VALUES\s*(.+);$/s);
  if (!valuesMatch) return [];
  
  const valuesString = valuesMatch[1];
  const rows = [];
  
  // Split by ),( to get individual rows
  const rowMatches = valuesString.split(/\),\s*\(/);
  
  for (let i = 0; i < rowMatches.length; i++) {
    let row = rowMatches[i];
    
    // Clean up first and last rows
    if (i === 0) row = row.replace(/^\(/, '');
    if (i === rowMatches.length - 1) row = row.replace(/\)$/, '');
    
    rows.push(row);
  }
  
  return rows;
}

/**
 * Parse a single row of values
 */
function parseRow(rowString, columns) {
  const values = [];
  let current = '';
  let inString = false;
  let escapeNext = false;
  
  for (let i = 0; i < rowString.length; i++) {
    const char = rowString[i];
    
    if (escapeNext) {
      current += char;
      escapeNext = false;
      continue;
    }
    
    if (char === '\\') {
      escapeNext = true;
      continue;
    }
    
    if (char === "'" && !escapeNext) {
      inString = !inString;
      continue;
    }
    
    if (char === ',' && !inString) {
      values.push(parseValue(current.trim()));
      current = '';
      continue;
    }
    
    current += char;
  }
  
  // Add last value
  if (current.trim()) {
    values.push(parseValue(current.trim()));
  }
  
  // Create object from columns and values
  const obj = {};
  columns.forEach((col, idx) => {
    obj[col] = values[idx];
  });
  
  return obj;
}

/**
 * Parse individual value
 */
function parseValue(value) {
  if (value === 'NULL') return null;
  if (value === "''") return '';
  if (/^\d+$/.test(value)) return parseInt(value);
  if (/^\d+\.\d+$/.test(value)) return parseFloat(value);
  
  // Remove quotes
  if (value.startsWith("'") && value.endsWith("'")) {
    return value.slice(1, -1).replace(/\\'/g, "'").replace(/\\\\/g, "\\");
  }
  
  return value;
}

/**
 * Import data to Supabase table
 */
async function importToTable(tableName, data, batchSize = 100) {
  console.log(`\n📥 Importing ${data.length} rows to ${tableName}...`);
  
  let imported = 0;
  let errors = 0;
  
  // Import in batches
  for (let i = 0; i < data.length; i += batchSize) {
    const batch = data.slice(i, i + batchSize);
    
    try {
      const { error } = await supabase
        .from(tableName)
        .insert(batch);
      
      if (error) {
        console.error(`❌ Error in batch ${i / batchSize + 1}:`, error.message);
        errors += batch.length;
      } else {
        imported += batch.length;
        process.stdout.write(`\r   Progress: ${imported}/${data.length} rows`);
      }
    } catch (err) {
      console.error(`❌ Exception in batch ${i / batchSize + 1}:`, err.message);
      errors += batch.length;
    }
  }
  
  console.log(`\n✅ Imported ${imported} rows, ${errors} errors`);
  return { imported, errors };
}

/**
 * Main import function
 */
async function main() {
  console.log('🚀 Starting OJS Database Import...\n');
  
  // Read SQL file
  const sqlFilePath = path.join(__dirname, '..', 'tjpsd32 (1) (1).sql');
  
  if (!fs.existsSync(sqlFilePath)) {
    console.error('❌ SQL file not found:', sqlFilePath);
    console.error('Please ensure tjpsd32 (1) (1).sql is in the project root');
    process.exit(1);
  }
  
  console.log('📖 Reading SQL file...');
  const sqlContent = fs.readFileSync(sqlFilePath, 'utf8');
  console.log(`✅ File size: ${(sqlContent.length / 1024 / 1024).toFixed(2)} MB\n`);
  
  // Tables to import (in order to respect dependencies)
  const tables = [
    { name: 'ojs_publications', batch: 50 },
    { name: 'ojs_authors', batch: 100 },
    { name: 'ojs_publication_settings', batch: 200 },
    { name: 'ojs_author_settings', batch: 200 },
    { name: 'ojs_metrics', batch: 500 }
  ];
  
  const results = {};
  
  for (const table of tables) {
    console.log(`\n${'='.repeat(60)}`);
    console.log(`Processing table: ${table.name}`);
    console.log('='.repeat(60));
    
    try {
      // Find the MySQL table name (without ojs_ prefix)
      const mysqlTableName = table.name.replace('ojs_', '');
      
      console.log(`🔍 Parsing INSERT statements for ${mysqlTableName}...`);
      const insertStatements = parseInsertStatements(sqlContent, mysqlTableName);
      
      if (insertStatements.length === 0) {
        console.log(`⚠️  No INSERT statements found for ${mysqlTableName}`);
        continue;
      }
      
      console.log(`✅ Found ${insertStatements.length} INSERT statement(s)`);
      
      // Parse all data
      const allData = [];
      
      for (const statement of insertStatements) {
        const columns = extractColumns(statement);
        const valueRows = parseValues(statement);
        
        for (const row of valueRows) {
          try {
            const obj = parseRow(row, columns);
            allData.push(obj);
          } catch (err) {
            console.error('Error parsing row:', err.message);
          }
        }
      }
      
      console.log(`📊 Parsed ${allData.length} rows`);
      
      if (allData.length > 0) {
        // Import to Supabase
        const result = await importToTable(table.name, allData, table.batch);
        results[table.name] = result;
      }
      
    } catch (err) {
      console.error(`❌ Error processing ${table.name}:`, err.message);
      results[table.name] = { imported: 0, errors: -1 };
    }
  }
  
  // Summary
  console.log('\n\n' + '='.repeat(60));
  console.log('📊 IMPORT SUMMARY');
  console.log('='.repeat(60));
  
  let totalImported = 0;
  let totalErrors = 0;
  
  for (const [table, result] of Object.entries(results)) {
    console.log(`${table.padEnd(30)} ${result.imported} rows (${result.errors} errors)`);
    totalImported += result.imported;
    totalErrors += result.errors;
  }
  
  console.log('='.repeat(60));
  console.log(`Total: ${totalImported} rows imported, ${totalErrors} errors\n`);
  
  if (totalImported > 0) {
    console.log('✅ Import complete!');
    console.log('\n📝 Next steps:');
    console.log('1. Run transformation: SELECT public.transform_ojs_to_dashboard();');
    console.log('2. Aggregate stats: SELECT public.aggregate_country_stats();');
    console.log('3. Check your dashboard at http://localhost:8080/\n');
  } else {
    console.log('❌ No data was imported. Please check the errors above.\n');
  }
}

// Run the import
main().catch(err => {
  console.error('❌ Fatal error:', err);
  process.exit(1);
});
