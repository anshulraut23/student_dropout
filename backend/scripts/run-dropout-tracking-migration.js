import dotenv from 'dotenv';
import { getPostgresPool, connectPostgres } from '../database/connection.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from backend/.env
dotenv.config({ path: path.join(__dirname, '../.env') });

async function runMigration() {
  try {
    console.log('🚀 Starting dropout tracking migration...\n');
    
    // Initialize database connection
    await connectPostgres();
    const pool = getPostgresPool();
    
    // Read migration SQL file
    const migrationPath = path.join(__dirname, '../database/migrations/add-dropout-tracking.sql');
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');
    
    // Execute migration
    await pool.query(migrationSQL);
    
    console.log('\n✅ Migration completed successfully!');
    console.log('\nNew fields added to students table:');
    console.log('  - dropout_status (active/dropped_out/graduated/transferred)');
    console.log('  - dropout_date');
    console.log('  - dropout_reason');
    console.log('  - dropout_notes');
    console.log('  - last_attendance_date');
    console.log('\nNew tables created:');
    console.log('  - dropout_history (tracks status changes)');
    console.log('  - model_performance (tracks ML model metrics)');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

runMigration();
