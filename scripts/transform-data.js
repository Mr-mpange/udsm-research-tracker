/**
 * Transform OJS Data to Dashboard Format
 * Runs the transformation functions in Supabase
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
  process.exit(1);
}

// Initialize Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function main() {
  console.log('🔄 Starting data transformation...\n');
  
  try {
    // Step 1: Transform OJS to Dashboard
    console.log('📊 Step 1: Transforming OJS publications to dashboard articles...');
    const { data: transformData, error: transformError } = await supabase
      .rpc('transform_ojs_to_dashboard');
    
    if (transformError) {
      console.error('❌ Transformation error:', transformError.message);
      console.error('Details:', transformError);
    } else {
      console.log('✅ Transformation complete!');
    }
    
    // Step 2: Aggregate country stats
    console.log('\n📊 Step 2: Aggregating country statistics...');
    const { data: aggregateData, error: aggregateError } = await supabase
      .rpc('aggregate_country_stats');
    
    if (aggregateError) {
      console.error('❌ Aggregation error:', aggregateError.message);
      console.error('Details:', aggregateError);
    } else {
      console.log('✅ Aggregation complete!');
    }
    
    // Step 3: Verify results
    console.log('\n📊 Step 3: Verifying results...');
    
    const { count: articlesCount } = await supabase
      .from('articles')
      .select('*', { count: 'exact', head: true });
    
    const { count: eventsCount } = await supabase
      .from('reader_events')
      .select('*', { count: 'exact', head: true });
    
    const { count: countriesCount } = await supabase
      .from('country_stats')
      .select('*', { count: 'exact', head: true });
    
    console.log('\n' + '='.repeat(60));
    console.log('📊 TRANSFORMATION SUMMARY');
    console.log('='.repeat(60));
    console.log(`Articles:        ${articlesCount || 0} rows`);
    console.log(`Reader Events:   ${eventsCount || 0} rows`);
    console.log(`Country Stats:   ${countriesCount || 0} rows`);
    console.log('='.repeat(60));
    
    if (articlesCount > 0) {
      console.log('\n✅ Transformation successful!');
      console.log('\n📝 Next steps:');
      console.log('1. Visit http://localhost:8080/');
      console.log('2. See your real UDSM data in action!');
      console.log('3. Check the world map for geographic distribution');
      console.log('4. View download statistics and trends\n');
    } else {
      console.log('\n⚠️  No articles were created. Check the errors above.\n');
    }
    
  } catch (err) {
    console.error('❌ Fatal error:', err.message);
    process.exit(1);
  }
}

main();
