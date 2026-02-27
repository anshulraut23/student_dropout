// Migration script to add exam template columns to PostgreSQL database
import 'dotenv/config';
import pg from 'pg';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const { Pool } = pg;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

async function runMigration() {
  const client = await pool.connect();
  
  try {
    console.log('📦 Starting exam template columns migration...');
    
    // Read the SQL migration file
    const sqlFile = join(__dirname, 'database', 'add-exam-template-columns.sql');
    const sql = readFileSync(sqlFile, 'utf-8');
    
    // Execute the migration
    await client.query(sql);
    
    console.log('✅ Migration completed successfully!');
    console.log('');
    console.log('📋 Added columns to exam_templates:');
    console.log('   - total_marks (INTEGER)');
    console.log('   - passing_marks (INTEGER)');
    console.log('   - weightage (DECIMAL)');
    console.log('   - order_sequence (INTEGER)');
    console.log('   - updated_at (TIMESTAMP)');
    console.log('');
    
    // Verify the columns were added
    const result = await client.query(`
      SELECT column_name, data_type, column_default
      FROM information_schema.columns
      WHERE table_name = 'exam_templates'
      AND column_name IN ('total_marks', 'passing_marks', 'weightage', 'order_sequence', 'updated_at')
      ORDER BY column_name
    `);
    
    console.log('🔍 Verified columns:');
    result.rows.forEach(row => {
      console.log(`   ✓ ${row.column_name} (${row.data_type})`);
    });
    
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    console.error(error);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

runMigration();
