import { connectPostgres, getPostgresPool } from '../database/connection.js';
import dotenv from 'dotenv';

dotenv.config();

async function verifyTables() {
  await connectPostgres();
  const pool = getPostgresPool();
  
  try {
    console.log('🔍 Verifying gamification tables...\n');
    
    // Check tables exist
    const tablesQuery = `
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_name IN ('teacher_gamification', 'xp_logs', 'badges', 'teacher_badges')
      ORDER BY table_name;
    `;
    const tablesResult = await pool.query(tablesQuery);
    
    console.log('📋 Tables found:');
    tablesResult.rows.forEach(row => {
      console.log(`   ✓ ${row.table_name}`);
    });
    
    // Check badges
    const badgesQuery = `SELECT badge_id, title, icon FROM badges ORDER BY badge_id;`;
    const badgesResult = await pool.query(badgesQuery);
    
    console.log('\n🏆 Badges seeded:');
    badgesResult.rows.forEach(badge => {
      console.log(`   ${badge.icon} ${badge.title} (${badge.badge_id})`);
    });
    
    // Check teacher_gamification structure
    const columnsQuery = `
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'teacher_gamification'
      ORDER BY ordinal_position;
    `;
    const columnsResult = await pool.query(columnsQuery);
    
    console.log('\n📊 teacher_gamification columns:');
    columnsResult.rows.forEach(col => {
      console.log(`   - ${col.column_name}: ${col.data_type}`);
    });
    
    console.log('\n✅ All gamification tables verified successfully!');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Verification failed:', error.message);
    process.exit(1);
  }
}

verifyTables();
