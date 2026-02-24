import { connectPostgres, getPostgresPool } from '../database/connection.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function applyAttendanceMigration() {
  // Initialize database connection first
  await connectPostgres();
  const pool = getPostgresPool();
  
  try {
    console.log('🔄 Applying attendance columns migration...');
    
    // Read the migration file
    const migrationPath = path.join(__dirname, '../supabase/migrations/20260223170000_add_attendance_columns.sql');
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');
    
    // Execute the migration
    await pool.query(migrationSQL);
    
    console.log('✅ Migration applied successfully!');
    console.log('   Added columns: notes, updated_at, updated_by');
    
    // Verify the columns exist
    const checkQuery = `
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'attendance' 
        AND column_name IN ('notes', 'updated_at', 'updated_by')
      ORDER BY column_name;
    `;
    
    const result = await pool.query(checkQuery);
    console.log('\n📋 Verified columns:');
    result.rows.forEach(row => {
      console.log(`   - ${row.column_name}: ${row.data_type}`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    process.exit(1);
  }
}

applyAttendanceMigration();
