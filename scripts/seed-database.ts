// Script to seed the database with real UDSM journal data
import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

// Load environment variables
const SUPABASE_URL = process.env.VITE_SUPABASE_URL || '';
const SUPABASE_KEY = process.env.VITE_SUPABASE_PUBLISHABLE_KEY || '';

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('❌ Missing Supabase credentials in .env file');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function seedDatabase() {
  console.log('🌱 Starting database seeding...\n');

  try {
    // Read the migration file
    const migrationPath = path.join(process.cwd(), 'supabase', 'migrations', '20260213050000_seed_real_data.sql');
    const sqlContent = fs.readFileSync(migrationPath, 'utf-8');

    // Split into individual statements
    const statements = sqlContent
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'));

    console.log(`📝 Found ${statements.length} SQL statements to execute\n`);

    // Execute each statement
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      console.log(`Executing statement ${i + 1}/${statements.length}...`);
      
      const { error } = await supabase.rpc('exec_sql', { sql: statement + ';' });
      
      if (error) {
        console.error(`❌ Error executing statement ${i + 1}:`, error.message);
        // Continue with other statements
      } else {
        console.log(`✅ Statement ${i + 1} executed successfully`);
      }
    }

    // Verify the data
    console.log('\n🔍 Verifying seeded data...\n');

    const { data: articles, error: articlesError } = await supabase
      .from('articles')
      .select('*', { count: 'exact' });

    if (articlesError) {
      console.error('❌ Error fetching articles:', articlesError.message);
    } else {
      console.log(`✅ Articles in database: ${articles?.length || 0}`);
    }

    const { data: countries, error: countriesError } = await supabase
      .from('country_stats')
      .select('*', { count: 'exact' });

    if (countriesError) {
      console.error('❌ Error fetching countries:', countriesError.message);
    } else {
      console.log(`✅ Countries in database: ${countries?.length || 0}`);
    }

    const { data: events, error: eventsError } = await supabase
      .from('reader_events')
      .select('*', { count: 'exact' });

    if (eventsError) {
      console.error('❌ Error fetching events:', eventsError.message);
    } else {
      console.log(`✅ Reader events in database: ${events?.length || 0}`);
    }

    console.log('\n✨ Database seeding completed!\n');
    console.log('🎉 You can now visit http://localhost:8080/ to see the data\n');

  } catch (error) {
    console.error('❌ Fatal error:', error);
    process.exit(1);
  }
}

seedDatabase();
