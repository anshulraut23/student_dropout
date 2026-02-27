// Check exam and subject relationships
import pg from 'pg';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '.env') });

const { Pool } = pg;

async function checkExamSubjects() {
  console.log('🔍 Checking Exam-Subject Relationships\n');
  
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    // Check exams
    console.log('1️⃣ Checking exams...');
    const examsResult = await pool.query(`
      SELECT 
        e.id,
        e.name,
        e.class_id,
        e.subject_id,
        c.name as class_name,
        s.name as subject_name
      FROM exams e
      LEFT JOIN classes c ON c.id = e.class_id
      LEFT JOIN subjects s ON s.id = e.subject_id
      ORDER BY e.created_at DESC
      LIMIT 10
    `);

    console.log(`Found ${examsResult.rows.length} exams:\n`);
    examsResult.rows.forEach((exam, idx) => {
      console.log(`${idx + 1}. ${exam.name}`);
      console.log(`   Class: ${exam.class_name || 'NULL'} (ID: ${exam.class_id || 'NULL'})`);
      console.log(`   Subject: ${exam.subject_name || 'NULL'} (ID: ${exam.subject_id || 'NULL'})`);
      console.log('');
    });

    // Check subjects
    console.log('2️⃣ Checking subjects...');
    const subjectsResult = await pool.query(`
      SELECT 
        s.id,
        s.name,
        s.class_id,
        c.name as class_name
      FROM subjects s
      LEFT JOIN classes c ON c.id = s.class_id
      ORDER BY s.created_at DESC
      LIMIT 10
    `);

    console.log(`Found ${subjectsResult.rows.length} subjects:\n`);
    subjectsResult.rows.forEach((subject, idx) => {
      console.log(`${idx + 1}. ${subject.name}`);
      console.log(`   Class: ${subject.class_name || 'NULL'} (ID: ${subject.class_id || 'NULL'})`);
      console.log('');
    });

    // Check if exams have NULL subject_id
    const nullSubjectCount = await pool.query(`
      SELECT COUNT(*) as count FROM exams WHERE subject_id IS NULL
    `);
    
    if (parseInt(nullSubjectCount.rows[0].count) > 0) {
      console.log(`⚠️  ${nullSubjectCount.rows[0].count} exams have NULL subject_id`);
      console.log('   This will cause subject names to not appear in marks records\n');
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await pool.end();
  }
}

checkExamSubjects();
