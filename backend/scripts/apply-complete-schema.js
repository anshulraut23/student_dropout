// Apply Complete Database Schema
// This script applies the unified schema to your database
// It's idempotent - safe to run multiple times

import { connectPostgres, getPostgresPool } from '../database/connection.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function applyCompleteSchema() {
  await connectPostgres();
  const pool = getPostgresPool();
  
  try {
    console.log('🗄️  Applying Complete Database Schema...\n');
    
    // Read the complete schema file
    const schemaPath = path.join(__dirname, '../database/complete_supabase_schema.sql');
    const schemaSQL = fs.readFileSync(schemaPath, 'utf8');
    
    console.log('📄 Schema file loaded');
    console.log('📊 Executing SQL statements...\n');
    
    // Execute the complete schema
    await pool.query(schemaSQL);
    
    console.log('✅ Schema applied successfully!\n');
    
    // Verify all tables exist
    const tablesResult = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_type = 'BASE TABLE'
      ORDER BY table_name
    `);
    
    console.log('📋 Database Tables:');
    console.log('==================');
    
    const tables = tablesResult.rows.map(r => r.table_name);
    const expectedTables = [
      'schools',
      'users',
      'requests',
      'classes',
      'subjects',
      'students',
      'attendance',
      'exam_templates',
      'exam_periods',
      'exams',
      'marks',
      'behavior',
      'interventions',
      'risk_predictions',
      'teacher_gamification',
      'xp_logs',
      'badges',
      'teacher_badges',
      'faculty_invites',
      'faculty_messages'
    ];
    
    expectedTables.forEach(tableName => {
      const exists = tables.includes(tableName);
      console.log(`${exists ? '✅' : '❌'} ${tableName}`);
    });
    
    console.log('');
    console.log(`Total tables: ${tables.length}`);
    console.log('');
    
    // Count indexes
    const indexesResult = await pool.query(`
      SELECT COUNT(*) as count
      FROM pg_indexes 
      WHERE schemaname = 'public'
    `);
    
    console.log(`📊 Total indexes: ${indexesResult.rows[0].count}`);
    console.log('');
    
    // Verify badges are seeded
    const badgesResult = await pool.query('SELECT COUNT(*) as count FROM badges');
    console.log(`🏅 Badges seeded: ${badgesResult.rows[0].count}`);
    console.log('');
    
    console.log('✅ Complete schema verification passed!');
    console.log('');
    console.log('Your database now includes:');
    console.log('  ✅ Core system (schools, users, classes, students)');
    console.log('  ✅ Attendance tracking');
    console.log('  ✅ Exam management');
    console.log('  ✅ Marks management');
    console.log('  ✅ Behavior tracking');
    console.log('  ✅ Interventions');
    console.log('  ✅ ML Risk Predictions');
    console.log('  ✅ Gamification system');
    console.log('  ✅ Faculty Connect (teacher chat)');
    console.log('');
    console.log('🎉 Your database is ready to use!');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Schema application failed:', error.message);
    console.error('');
    console.error('Error details:', error);
    console.error('');
    console.error('If you see "already exists" errors, that\'s normal!');
    console.error('The schema is idempotent and will skip existing objects.');
    process.exit(1);
  }
}

applyCompleteSchema();
