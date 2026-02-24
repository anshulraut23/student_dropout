// Apply Faculty Connect Migration
import { connectPostgres, getPostgresPool } from '../database/connection.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function applyFacultyMigration() {
  // Initialize database connection first
  await connectPostgres();
  const pool = getPostgresPool();
  
  try {
    console.log('🔗 Applying Faculty Connect migration...\n');
    
    // Read migration file
    const migrationPath = path.join(__dirname, '../supabase/migrations/20260225140000_add_faculty_connect_tables.sql');
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');
    
    // Execute the migration
    await pool.query(migrationSQL);
    
    console.log('✅ Migration applied successfully!\n');

    // Verify tables
    const tablesResult = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name IN ('faculty_invites', 'faculty_messages')
      ORDER BY table_name
    `);

    console.log('📋 Created tables:');
    tablesResult.rows.forEach(row => {
      console.log(`   - ${row.table_name}`);
    });
    console.log('');

    // Verify indexes
    const indexesResult = await pool.query(`
      SELECT indexname 
      FROM pg_indexes 
      WHERE schemaname = 'public' 
      AND tablename IN ('faculty_invites', 'faculty_messages')
      ORDER BY indexname
    `);

    console.log('📊 Created indexes:');
    indexesResult.rows.forEach(row => {
      console.log(`   - ${row.indexname}`);
    });
    console.log('');

    console.log('✅ Faculty Connect migration completed successfully!');
    console.log('');
    console.log('Next steps:');
    console.log('1. Restart your backend server');
    console.log('2. Log in as a teacher');
    console.log('3. Go to Faculty Connect page');
    console.log('4. Send invitations to other teachers');
    console.log('5. Accept invitations and start chatting!');

    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    console.error('Details:', error);
    process.exit(1);
  }
}

applyFacultyMigration();
