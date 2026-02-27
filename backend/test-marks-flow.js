// Test marks save and retrieval flow
import pg from 'pg';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '.env') });

const { Pool } = pg;

async function testMarksFlow() {
  console.log('🧪 Testing Marks Flow\n');
  
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    // 1. Check if marks table exists
    console.log('1️⃣ Checking marks table...');
    const tableCheck = await pool.query(`
      SELECT COUNT(*) as count FROM information_schema.tables 
      WHERE table_schema = 'public' AND table_name = 'marks'
    `);
    
    if (parseInt(tableCheck.rows[0].count) === 0) {
      console.log('❌ Marks table does NOT exist!\n');
      return;
    }
    console.log('✅ Marks table exists\n');

    // 2. Check total marks count
    console.log('2️⃣ Checking marks count...');
    const countResult = await pool.query('SELECT COUNT(*) as count FROM marks');
    const totalMarks = parseInt(countResult.rows[0].count);
    console.log(`✅ Total marks in database: ${totalMarks}\n`);

    if (totalMarks === 0) {
      console.log('⚠️  No marks found in database. Please enter some marks first.\n');
      return;
    }

    // 3. Get sample marks with details
    console.log('3️⃣ Sample marks records:');
    const marksResult = await pool.query(`
      SELECT 
        m.id,
        m.exam_id,
        m.student_id,
        m.marks_obtained,
        m.percentage,
        m.grade,
        m.status,
        s.name as student_name,
        e.name as exam_name
      FROM marks m
      LEFT JOIN students s ON s.id = m.student_id
      LEFT JOIN exams e ON e.id = m.exam_id
      ORDER BY m.created_at DESC
      LIMIT 5
    `);

    marksResult.rows.forEach((mark, idx) => {
      console.log(`\n   ${idx + 1}. ${mark.student_name || 'Unknown Student'}`);
      console.log(`      Exam: ${mark.exam_name || 'Unknown Exam'}`);
      console.log(`      Marks: ${mark.marks_obtained} (${mark.percentage}%)`);
      console.log(`      Grade: ${mark.grade || 'N/A'}`);
      console.log(`      Status: ${mark.status}`);
    });
    console.log('');

    // 4. Test getMarksByStudent query
    console.log('4️⃣ Testing student marks retrieval...');
    const studentMarksResult = await pool.query(`
      SELECT 
        m.*,
        e.name as exam_name,
        e.total_marks,
        e.exam_date,
        sub.name as subject_name
      FROM marks m
      LEFT JOIN exams e ON e.id = m.exam_id
      LEFT JOIN subjects sub ON sub.id = e.subject_id
      WHERE m.student_id = (SELECT student_id FROM marks LIMIT 1)
      ORDER BY e.exam_date DESC
    `);

    if (studentMarksResult.rows.length > 0) {
      console.log(`✅ Found ${studentMarksResult.rows.length} marks for student`);
      console.log(`   Sample record structure:`);
      const sample = studentMarksResult.rows[0];
      console.log(`   - exam_id: ${sample.exam_id}`);
      console.log(`   - student_id: ${sample.student_id}`);
      console.log(`   - marks_obtained: ${sample.marks_obtained}`);
      console.log(`   - percentage: ${sample.percentage}`);
      console.log(`   - grade: ${sample.grade}`);
      console.log(`   - exam_name: ${sample.exam_name}`);
      console.log(`   - subject_name: ${sample.subject_name}`);
      console.log(`   - total_marks: ${sample.total_marks}`);
    } else {
      console.log('❌ No marks found for test student');
    }
    console.log('');

    // 5. Check for any NULL values that might cause issues
    console.log('5️⃣ Checking for data quality issues...');
    const nullCheck = await pool.query(`
      SELECT 
        COUNT(*) FILTER (WHERE exam_id IS NULL) as null_exam_id,
        COUNT(*) FILTER (WHERE student_id IS NULL) as null_student_id,
        COUNT(*) FILTER (WHERE marks_obtained IS NULL AND status = 'present') as null_marks
      FROM marks
    `);
    
    const nulls = nullCheck.rows[0];
    if (parseInt(nulls.null_exam_id) > 0) {
      console.log(`⚠️  ${nulls.null_exam_id} marks have NULL exam_id`);
    }
    if (parseInt(nulls.null_student_id) > 0) {
      console.log(`⚠️  ${nulls.null_student_id} marks have NULL student_id`);
    }
    if (parseInt(nulls.null_marks) > 0) {
      console.log(`⚠️  ${nulls.null_marks} present students have NULL marks`);
    }
    if (parseInt(nulls.null_exam_id) === 0 && parseInt(nulls.null_student_id) === 0 && parseInt(nulls.null_marks) === 0) {
      console.log('✅ No data quality issues found');
    }
    console.log('');

    console.log('✅ Marks flow test complete!');
    console.log('\nNext steps:');
    console.log('1. Check backend console logs when entering marks');
    console.log('2. Check browser console when viewing student profile');
    console.log('3. Verify API response format matches frontend expectations');

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error.stack);
  } finally {
    await pool.end();
  }
}

testMarksFlow();
