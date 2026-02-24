import { connectPostgres, getPostgresPool } from '../database/connection.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function applyGamificationMigration() {
  // Initialize database connection first
  await connectPostgres();
  const pool = getPostgresPool();
  
  try {
    console.log('🎮 Applying gamification tables migration...\n');
    
    // Read the FIXED migration file (TEXT IDs instead of UUID)
    const migrationPath = path.join(__dirname, '../supabase/migrations/20260225130000_add_gamification_tables_fixed.sql');
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');
    
    // Execute the migration
    await pool.query(migrationSQL);
    
    console.log('✅ Migration applied successfully!\n');
    
    // Verify the tables exist
    const tablesQuery = `
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_name IN ('teacher_gamification', 'xp_logs', 'badges', 'teacher_badges')
      ORDER BY table_name;
    `;
    
    const tablesResult = await pool.query(tablesQuery);
    console.log('📋 Created tables:');
    tablesResult.rows.forEach(row => {
      console.log(`   ✓ ${row.table_name}`);
    });
    
    // Verify badges were seeded
    const badgesQuery = `SELECT badge_id, title, icon FROM badges ORDER BY badge_id;`;
    const badgesResult = await pool.query(badgesQuery);
    
    console.log('\n🏆 Seeded badges:');
    badgesResult.rows.forEach(badge => {
      console.log(`   ${badge.icon} ${badge.title} (${badge.badge_id})`);
    });
    
    console.log('\n✨ Gamification system is ready!');
    console.log('\nNext steps:');
    console.log('1. Integrate XP awards in data entry pages');
    console.log('2. Connect frontend to real API endpoints');
    console.log('3. Test badge earning and level progression');
    console.log('\nSee GAMIFICATION_TEACHER_INTEGRATION_PLAN.md for details.');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    console.error('\nDetails:', error);
    process.exit(1);
  }
}

applyGamificationMigration();
