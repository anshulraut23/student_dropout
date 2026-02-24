/**
 * Test Script: Add a New "Good Boy" Student
 * Creates a student with excellent attendance, high marks, and positive behavior
 * 
 * Usage: node backend/scripts/add-good-student.js
 */

import dotenv from 'dotenv';
import pg from 'pg';
import { nanoid } from 'nanoid';

dotenv.config();

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

const generateId = () => nanoid(16);

const getDateDaysAgo = (days) => {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date.toISOString().split('T')[0];
};

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

const log = {
  header: () => console.log(`\n${colors.bright}${colors.cyan}${'='.repeat(60)}${colors.reset}`),
  title: (msg) => console.log(`${colors.bright}${colors.blue}${msg}${colors.reset}`),
  success: (msg) => console.log(`${colors.green}✓ ${msg}${colors.reset}`),
  info: (msg) => console.log(`${colors.cyan}ℹ ${msg}${colors.reset}`),
  data: (label, value) => console.log(`  ${colors.bright}${label}:${colors.reset} ${value}`)
};

async function addGoodStudent() {
  const client = await pool.connect();
  
  try {
    log.header();
    log.title('🎓 ADDING NEW "GOOD BOY" STUDENT');
    log.header();
    
    await client.query('BEGIN');
    
    // Get existing school, class, exam, and teacher data
    log.title('\n📋 Step 1: Fetching Existing Data');
    
    const schoolResult = await client.query('SELECT id FROM schools LIMIT 1');
    if (schoolResult.rows.length === 0) {
      throw new Error('No school found. Please run seed-demo-data.js first.');
    }
    const schoolId = schoolResult.rows[0].id;
    log.success(`Found school: ${schoolId}`);
    
    const classResult = await client.query('SELECT id, name FROM classes WHERE school_id = $1 LIMIT 1', [schoolId]);
    if (classResult.rows.length === 0) {
      throw new Error('No class found. Please run seed-demo-data.js first.');
    }
    const classId = classResult.rows[0].id;
    const className = classResult.rows[0].name;
    log.success(`Found class: ${className} (${classId})`);
    
    const teacherResult = await client.query('SELECT id FROM users WHERE school_id = $1 AND role = $2 LIMIT 1', [schoolId, 'teacher']);
    if (teacherResult.rows.length === 0) {
      throw new Error('No teacher found. Please run seed-demo-data.js first.');
    }
    const teacherId = teacherResult.rows[0].id;
    log.success(`Found teacher: ${teacherId}`);
    
    const examResult = await client.query('SELECT id, name FROM exams WHERE school_id = $1 AND status = $2 LIMIT 1', [schoolId, 'completed']);
    if (examResult.rows.length === 0) {
      throw new Error('No completed exam found. Please run seed-demo-data.js first.');
    }
    const examId = examResult.rows[0].id;
    const examName = examResult.rows[0].name;
    log.success(`Found exam: ${examName} (${examId})`);
    
    // Create the new student
    log.title('\n👨‍🎓 Step 2: Creating New Student');
    
    const studentId = generateId();
    const studentName = 'Vikram Mehta';
    const enrollmentNo = 'EN2025005';
    
    await client.query(`
      INSERT INTO students (id, school_id, class_id, name, roll_number, enrollment_no, date_of_birth, gender, status, created_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, CURRENT_TIMESTAMP)
    `, [
      studentId,
      schoolId,
      classId,
      studentName,
      '005',
      enrollmentNo,
      '2010-04-25',
      'male',
      'active'
    ]);
    
    log.success(`Student created: ${studentName}`);
    log.data('Student ID', studentId);
    log.data('Enrollment No', enrollmentNo);
    log.data('Roll Number', '005');
    
    // Add excellent attendance (18 present, 2 absent = 90%)
    log.title('\n📅 Step 3: Adding Attendance Records (90% rate)');
    
    const attendanceRecords = [];
    for (let i = 0; i < 20; i++) {
      // 18 present, 2 absent (days 5 and 12)
      const status = (i === 5 || i === 12) ? 'absent' : 'present';
      attendanceRecords.push(`('${generateId()}', '${studentId}', '${classId}', '${getDateDaysAgo(20 - i)}', '${status}', '${teacherId}', CURRENT_TIMESTAMP)`);
    }
    
    await client.query(`
      INSERT INTO attendance (id, student_id, class_id, date, status, marked_by, created_at)
      VALUES ${attendanceRecords.join(', ')}
    `);
    
    log.success('20 attendance records created (18 present, 2 absent)');
    log.data('Attendance Rate', '90%');
    
    // Add high exam marks (85-95%)
    log.title('\n📝 Step 4: Adding Exam Marks (Excellent grades)');
    
    await client.query(`
      INSERT INTO marks (id, exam_id, student_id, class_id, marks_obtained, percentage, grade, status, created_at)
      VALUES 
        ('${generateId()}', '${examId}', '${studentId}', '${classId}', 85, 85.00, 'A', 'submitted', CURRENT_TIMESTAMP),
        ('${generateId()}', '${examId}', '${studentId}', '${classId}', 90, 90.00, 'A+', 'submitted', CURRENT_TIMESTAMP),
        ('${generateId()}', '${examId}', '${studentId}', '${classId}', 95, 95.00, 'A+', 'submitted', CURRENT_TIMESTAMP)
    `);
    
    log.success('3 exam marks created (85%, 90%, 95% - All Excellent)');
    log.data('Average Marks', '90%');
    
    // Add positive behavior records
    log.title('\n⭐ Step 5: Adding Behavior Records (Positive)');
    
    await client.query(`
      INSERT INTO behavior (id, student_id, teacher_id, date, behavior_type, category, severity, description, created_at)
      VALUES 
        ('${generateId()}', '${studentId}', '${teacherId}', '${getDateDaysAgo(10)}', 'positive', 'Academic', 'low', 'Consistently completes homework on time', CURRENT_TIMESTAMP),
        ('${generateId()}', '${studentId}', '${teacherId}', '${getDateDaysAgo(5)}', 'positive', 'Leadership', 'low', 'Volunteered to lead group project', CURRENT_TIMESTAMP)
    `);
    
    log.success('2 positive behavior incidents created');
    log.data('Behavior Type', 'Positive (Academic & Leadership)');
    
    // Commit transaction
    await client.query('COMMIT');
    
    // Summary
    log.header();
    log.title('✅ STUDENT ADDED SUCCESSFULLY!');
    log.header();
    
    console.log(`
  ${colors.bright}Student Profile:${colors.reset}
    Name: ${studentName}
    Enrollment: ${enrollmentNo}
    Class: ${className}
    
  ${colors.bright}Data Summary:${colors.reset}
    • 20 Attendance records (90% present)
    • 3 Exam marks (Average: 90%)
    • 2 Positive behavior incidents
    
  ${colors.green}${colors.bright}Expected ML Prediction: 🟢 Low Risk (<0.3)${colors.reset}
    
  ${colors.bright}Next Steps:${colors.reset}
    1. Refresh your browser
    2. Go to Students List page
    3. Find "${studentName}" in the list
    4. Click to view profile and see ML risk prediction
    5. Should show ${colors.green}Low Risk${colors.reset} with excellent metrics
    `);
    
    log.header();
    
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('\n❌ Error adding student:', error.message);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

// Run the script
addGoodStudent()
  .then(() => {
    console.log('\n✨ Script completed successfully!\n');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Script failed!');
    console.error(error);
    process.exit(1);
  });
