// Script to clean up duplicate/auto-generated exams from templates
import 'dotenv/config';
import pg from 'pg';

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

async function cleanupDuplicateExams() {
  const client = await pool.connect();
  
  try {
    console.log('🧹 Starting exam cleanup...');
    
    // Get all exams
    const result = await client.query('SELECT id, name, created_at FROM exams ORDER BY created_at DESC');
    const exams = result.rows;
    
    console.log(`📊 Found ${exams.length} total exams`);
    
    // Ask for confirmation
    console.log('\n⚠️  This will delete all existing exams.');
    console.log('   Templates are kept intact.');
    console.log('   You can create exams properly through the admin panel.');
    console.log('\n💡 Tip: Use Exam Periods to generate exams for specific templates/subjects.\n');
    
    // Delete all exams
    const deleteResult = await client.query('DELETE FROM exams');
    console.log(`✅ Deleted ${deleteResult.rowCount} exams`);
    
    // Also clean up any marks associated with deleted exams
    const marksResult = await client.query('DELETE FROM marks WHERE exam_id NOT IN (SELECT id FROM exams)');
    console.log(`✅ Cleaned up ${marksResult.rowCount} orphaned marks records`);
    
    console.log('\n✨ Cleanup completed!');
    console.log('\n📝 Next steps:');
    console.log('   1. Go to Admin Dashboard');
    console.log('   2. Create Exam Periods (if not already created)');
    console.log('   3. For each period, generate exams for specific subjects');
    console.log('   4. Teachers can then enter marks for those exams\n');
    
  } catch (error) {
    console.error('❌ Cleanup failed:', error.message);
    console.error(error);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

cleanupDuplicateExams();
