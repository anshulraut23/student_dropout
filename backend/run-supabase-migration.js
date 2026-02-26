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

    // Read the migration file
    const migrationPath = path.join(__dirname, 'supabase', 'migrations', '20260225150000_add_behavior_interventions.sql');
    console.log('\n📄 Reading migration file:', migrationPath);
    
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');
    
    console.log('\n🚀 Running migration...');
    await pool.query(migrationSQL);
    
    console.log('✅ Migration completed successfully!');
    
    // Verify tables were created
    console.log('\n🔍 Verifying tables...');
    const tablesResult = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name IN ('behaviors', 'interventions')
      ORDER BY table_name
    `);
    
    console.log('   Tables found:', tablesResult.rows.map(r => r.table_name).join(', '));
    
    if (tablesResult.rows.length === 2) {
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
