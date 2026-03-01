import pg from 'pg';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const { Pool } = pg;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

async function runMigration() {
  const connectionString = process.env.DATABASE_URL;
  
  if (!connectionString) {
    console.error('❌ DATABASE_URL environment variable is not set');
    process.exit(1);
  }

  console.log('🔌 Connecting to Supabase PostgreSQL...');

  const pool = new Pool({
    connectionString: connectionString,
    ssl: { rejectUnauthorized: false }
  });

  try {
    // Test connection
    const testResult = await pool.query('SELECT NOW()');
    console.log('✅ Connected to database');
    console.log('   Current time:', testResult.rows[0].now);

    const migrationFiles = (process.env.MIGRATION_FILES
      ? process.env.MIGRATION_FILES.split(',').map(name => name.trim()).filter(Boolean)
      : ['20260228120000_add_intervention_email_tables.sql']);

    for (const migrationFile of migrationFiles) {
      const migrationPath = path.join(__dirname, 'supabase', 'migrations', migrationFile);
      console.log('\n📄 Reading migration file:', migrationPath);

      const migrationSQL = fs.readFileSync(migrationPath, 'utf8');

      console.log(`🚀 Running migration: ${migrationFile}`);
      await pool.query(migrationSQL);
    }

    console.log('✅ Migrations completed successfully!');
    
    // Verify tables were created
    console.log('\n🔍 Verifying tables...');
    const expectedTables = migrationFiles.includes('20260225150000_add_behavior_interventions.sql')
      ? ['behaviors', 'interventions', 'intervention_messages']
      : ['interventions', 'intervention_messages'];

    const tablesResult = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name = ANY($1::text[])
      ORDER BY table_name
    `, [expectedTables]);
    
    console.log('   Tables found:', tablesResult.rows.map(r => r.table_name).join(', '));
    
    if (tablesResult.rows.length === expectedTables.length) {
      console.log('\n✨ All tables created successfully!');
    } else {
      console.log('\n⚠️  Warning: Not all tables were created');
    }

  } catch (error) {
    console.error('\n❌ Migration failed:', error.message);
    console.error('   Details:', error);
    process.exit(1);
  } finally {
    await pool.end();
    console.log('\n👋 Database connection closed');
  }
}

runMigration();
