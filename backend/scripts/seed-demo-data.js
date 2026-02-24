/**
 * Demo Data Seeding Script
 * Creates 4 specific student personas to demonstrate ML predictions
 * 
 * Usage: node backend/scripts/seed-demo-data.js
 */

import dotenv from 'dotenv';
import pg from 'pg';
import bcrypt from 'bcrypt';
import { nanoid } from 'nanoid';

dotenv.config();

const { Pool } = pg;

// Database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// Helper function to generate IDs
const generateId = () => nanoid(16);

// Helper function to generate dates
const getDateDaysAgo = (days) => {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date.toISOString().split('T')[0];
};

// Color codes for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  blue: '\x1b[34m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m'
};

const log = {
  header: (msg) => console.log(`\n${colors.bright}${colors.cyan}${'='.repeat(60)}${colors.reset}`),
  title: (msg) => console.log(`${colors.bright}${colors.blue}${msg}${colors.reset}`),
  success: (msg) => console.log(`${colors.green}✓ ${msg}${colors.reset}`),
  info: (msg) => console.log(`${colors.cyan}ℹ ${msg}${colors.reset}`),
  warning: (msg) => console.log(`${colors.yellow}⚠ ${msg}${colors.reset}`),
  error: (msg) => console.log(`${colors.red}✗ ${msg}${colors.reset}`),
  data: (label, value) => console.log(`  ${colors.bright}${label}:${colors.reset} ${value}`)
};

async function seedDatabase() {
  const client = await pool.connect();
  
  try {
    log.header();
    log.title('🌱 DEMO DATA SEEDING SCRIPT');
    log.header();
    
    await client.query('BEGIN');
    
    // ========================================
    // 1. CREATE SCHOOL
    // ========================================
    log.title('\n📚 Step 1: Creating School');
    
    const schoolId = generateId();
    await client.query(`
      INSERT INTO schools (id, name, address, city, state, phone, email, website, created_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, CURRENT_TIMESTAMP)
    `, [
      schoolId,
      'Demo High School',
      '123 Education Street',
      'Mumbai',
      'Maharashtra',
      '+91-9876543210',
      'admin@demohighschool.edu',
      'https://demohighschool.edu'
    ]);
    
    log.success('School created');
    log.data('School ID', schoolId);
    log.data('Name', 'Demo High School');
    
    // ========================================
    // 2. CREATE ADMIN USER
    // ========================================
    log.title('\n👤 Step 2: Creating Admin User');
    
    const adminId = generateId();
    const adminPassword = await bcrypt.hash('admin123', 10);
    
    await client.query(`
      INSERT INTO users (id, email, password, full_name, role, school_id, status, created_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, CURRENT_TIMESTAMP)
    `, [
      adminId,
      'admin@demo.com',
      adminPassword,
      'Admin User',
      'admin',
      schoolId,
      'approved'
    ]);
    
    log.success('Admin user created');
    log.data('Email', 'admin@demo.com');
    log.data('Password', 'admin123');
    
    // ========================================
    // 3. CREATE TEACHERS
    // ========================================
    log.title('\n👨‍🏫 Step 3: Creating Teachers');
    
    const teacher1Id = generateId();
    const teacher2Id = generateId();
    const teacherPassword = await bcrypt.hash('teacher123', 10);
    
    await client.query(`
      INSERT INTO users (id, email, password, full_name, role, school_id, status, subject, created_at)
      VALUES 
        ($1, $2, $3, $4, $5, $6, $7, $8, CURRENT_TIMESTAMP),
        ($9, $10, $11, $12, $13, $14, $15, $16, CURRENT_TIMESTAMP)
    `, [
      teacher1Id, 'teacher1@demo.com', teacherPassword, 'Rajesh Kumar', 'teacher', schoolId, 'approved', 'Mathematics',
      teacher2Id, 'teacher2@demo.com', teacherPassword, 'Priya Sharma', 'teacher', schoolId, 'approved', 'Science'
    ]);
    
    log.success('2 teachers created');
    log.data('Teacher 1', 'teacher1@demo.com (Mathematics)');
    log.data('Teacher 2', 'teacher2@demo.com (Science)');
    log.data('Password', 'teacher123');
    
    // ========================================
    // 4. CREATE CLASS
    // ========================================
    log.title('\n🏫 Step 4: Creating Class');
    
    const classId = generateId();
    await client.query(`
      INSERT INTO classes (id, school_id, name, grade, section, academic_year, teacher_id, attendance_mode, status, created_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, CURRENT_TIMESTAMP)
    `, [
      classId,
      schoolId,
      'Grade 10-A',
      10,
      'A',
      '2025-2026',
      teacher1Id,
      'daily',
      'active'
    ]);
    
    log.success('Class created');
    log.data('Class', 'Grade 10-A');
    log.data('Class ID', classId);
    
    // ========================================
    // 5. CREATE SUBJECTS
    // ========================================
    log.title('\n📖 Step 5: Creating Subjects');
    
    const mathSubjectId = generateId();
    const scienceSubjectId = generateId();
    const englishSubjectId = generateId();
    
    await client.query(`
      INSERT INTO subjects (id, name, code, class_id, school_id, teacher_id, created_at)
      VALUES 
        ($1, $2, $3, $4, $5, $6, CURRENT_TIMESTAMP),
        ($7, $8, $9, $10, $11, $12, CURRENT_TIMESTAMP),
        ($13, $14, $15, $16, $17, $18, CURRENT_TIMESTAMP)
    `, [
      mathSubjectId, 'Mathematics', 'MATH101', classId, schoolId, teacher1Id,
      scienceSubjectId, 'Science', 'SCI101', classId, schoolId, teacher2Id,
      englishSubjectId, 'English', 'ENG101', classId, schoolId, teacher1Id
    ]);
    
    log.success('3 subjects created');
    log.data('Subjects', 'Mathematics, Science, English');
    
    // ========================================
    // 6. CREATE EXAM
    // ========================================
    log.title('\n📝 Step 6: Creating Exam');
    
    const examId = generateId();
    const examDate = getDateDaysAgo(10);
    
    await client.query(`
      INSERT INTO exams (id, name, type, class_id, school_id, total_marks, passing_marks, exam_date, status, created_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, CURRENT_TIMESTAMP)
    `, [
      examId,
      'Mid-Term Examination',
      'mid-term',
      classId,
      schoolId,
      100,
      35,
      examDate,
      'completed'
    ]);
    
    log.success('Exam created');
    log.data('Exam', 'Mid-Term Examination');
    log.data('Date', examDate);
    log.data('Total Marks', '100');
    
    // ========================================
    // 7. CREATE 4 STUDENT PERSONAS
    // ========================================
    log.title('\n👨‍🎓 Step 7: Creating 4 Student Personas');
    log.header();
    
    const students = [];
    
    // ========================================
    // PERSONA 1: THE HIGH RISK STUDENT 🔴
    // ========================================
    log.title('\n🔴 Persona 1: "The High Risk Student"');
    log.info('Expected ML Output: Critical Risk (>0.8)');
    
    const student1Id = generateId();
    await client.query(`
      INSERT INTO students (id, school_id, class_id, name, roll_number, enrollment_no, date_of_birth, gender, status, created_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, CURRENT_TIMESTAMP)
    `, [
      student1Id,
      schoolId,
      classId,
      'Arjun Patel',
      '001',
      'EN2025001',
      '2010-03-15',
      'male',
      'active'
    ]);
    
    students.push({ id: student1Id, name: 'Arjun Patel', persona: 'High Risk' });
    log.success('Student created: Arjun Patel');
    
    // Attendance: 50% (10 present, 10 absent)
    log.info('Creating attendance records (50% rate)...');
    const attendanceRecords1 = [];
    for (let i = 0; i < 20; i++) {
      const status = i < 10 ? 'present' : 'absent';
      attendanceRecords1.push(`('${generateId()}', '${student1Id}', '${classId}', '${getDateDaysAgo(20 - i)}', '${status}', '${teacher1Id}', CURRENT_TIMESTAMP)`);
    }
    await client.query(`
      INSERT INTO attendance (id, student_id, class_id, date, status, marked_by, created_at)
      VALUES ${attendanceRecords1.join(', ')}
    `);
    log.success('20 attendance records created (10 present, 10 absent)');
    
    // Marks: Failing grades (<35%)
    log.info('Creating exam marks (failing grades)...');
    await client.query(`
      INSERT INTO marks (id, exam_id, student_id, class_id, marks_obtained, percentage, grade, status, created_at)
      VALUES 
        ('${generateId()}', '${examId}', '${student1Id}', '${classId}', 25, 25.00, 'F', 'submitted', CURRENT_TIMESTAMP),
        ('${generateId()}', '${examId}', '${student1Id}', '${classId}', 30, 30.00, 'F', 'submitted', CURRENT_TIMESTAMP),
        ('${generateId()}', '${examId}', '${student1Id}', '${classId}', 28, 28.00, 'F', 'submitted', CURRENT_TIMESTAMP)
    `);
    log.success('3 exam marks created (25%, 30%, 28% - All Failing)');
    
    // Behavior: 2 negative incidents (high severity)
    log.info('Creating behavior records (negative)...');
    await client.query(`
      INSERT INTO behavior (id, student_id, teacher_id, date, behavior_type, category, severity, description, action_taken, created_at)
      VALUES 
        ('${generateId()}', '${student1Id}', '${teacher1Id}', '${getDateDaysAgo(15)}', 'negative', 'Discipline', 'high', 'Repeated disruption in class', 'Parent meeting scheduled', CURRENT_TIMESTAMP),
        ('${generateId()}', '${student1Id}', '${teacher1Id}', '${getDateDaysAgo(8)}', 'negative', 'Academic', 'high', 'Not submitting assignments', 'Warning issued', CURRENT_TIMESTAMP)
    `);
    log.success('2 negative behavior incidents created (high severity)');
    
    // ========================================
    // PERSONA 2: THE GOOD STUDENT 🟢
    // ========================================
    log.title('\n🟢 Persona 2: "The Good Student"');
    log.info('Expected ML Output: Low Risk (<0.3)');
    
    const student2Id = generateId();
    await client.query(`
      INSERT INTO students (id, school_id, class_id, name, roll_number, enrollment_no, date_of_birth, gender, status, created_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, CURRENT_TIMESTAMP)
    `, [
      student2Id,
      schoolId,
      classId,
      'Priya Desai',
      '002',
      'EN2025002',
      '2010-05-22',
      'female',
      'active'
    ]);
    
    students.push({ id: student2Id, name: 'Priya Desai', persona: 'Good Student' });
    log.success('Student created: Priya Desai');
    
    // Attendance: 95% (19 present, 1 absent)
    log.info('Creating attendance records (95% rate)...');
    const attendanceRecords2 = [];
    for (let i = 0; i < 20; i++) {
      const status = i === 10 ? 'absent' : 'present';
      attendanceRecords2.push(`('${generateId()}', '${student2Id}', '${classId}', '${getDateDaysAgo(20 - i)}', '${status}', '${teacher1Id}', CURRENT_TIMESTAMP)`);
    }
    await client.query(`
      INSERT INTO attendance (id, student_id, class_id, date, status, marked_by, created_at)
      VALUES ${attendanceRecords2.join(', ')}
    `);
    log.success('20 attendance records created (19 present, 1 absent)');
    
    // Marks: High grades (>85%)
    log.info('Creating exam marks (excellent grades)...');
    await client.query(`
      INSERT INTO marks (id, exam_id, student_id, class_id, marks_obtained, percentage, grade, status, created_at)
      VALUES 
        ('${generateId()}', '${examId}', '${student2Id}', '${classId}', 92, 92.00, 'A+', 'submitted', CURRENT_TIMESTAMP),
        ('${generateId()}', '${examId}', '${student2Id}', '${classId}', 88, 88.00, 'A', 'submitted', CURRENT_TIMESTAMP),
        ('${generateId()}', '${examId}', '${student2Id}', '${classId}', 90, 90.00, 'A+', 'submitted', CURRENT_TIMESTAMP)
    `);
    log.success('3 exam marks created (92%, 88%, 90% - All Excellent)');
    
    // Behavior: 1 positive incident
    log.info('Creating behavior records (positive)...');
    await client.query(`
      INSERT INTO behavior (id, student_id, teacher_id, date, behavior_type, category, severity, description, created_at)
      VALUES 
        ('${generateId()}', '${student2Id}', '${teacher1Id}', '${getDateDaysAgo(12)}', 'positive', 'Academic', 'low', 'Helped classmates with difficult concepts', CURRENT_TIMESTAMP)
    `);
    log.success('1 positive behavior incident created');
    
    // ========================================
    // PERSONA 3: THE BORDERLINE STUDENT 🟡
    // ========================================
    log.title('\n🟡 Persona 3: "The Borderline Student"');
    log.info('Expected ML Output: Medium Risk (0.3-0.6)');
    
    const student3Id = generateId();
    await client.query(`
      INSERT INTO students (id, school_id, class_id, name, roll_number, enrollment_no, date_of_birth, gender, status, created_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, CURRENT_TIMESTAMP)
    `, [
      student3Id,
      schoolId,
      classId,
      'Rahul Singh',
      '003',
      'EN2025003',
      '2010-07-10',
      'male',
      'active'
    ]);
    
    students.push({ id: student3Id, name: 'Rahul Singh', persona: 'Borderline' });
    log.success('Student created: Rahul Singh');
    
    // Attendance: 80% (16 present, 4 absent)
    log.info('Creating attendance records (80% rate)...');
    const attendanceRecords3 = [];
    for (let i = 0; i < 20; i++) {
      const status = (i === 5 || i === 10 || i === 15 || i === 18) ? 'absent' : 'present';
      attendanceRecords3.push(`('${generateId()}', '${student3Id}', '${classId}', '${getDateDaysAgo(20 - i)}', '${status}', '${teacher1Id}', CURRENT_TIMESTAMP)`);
    }
    await client.query(`
      INSERT INTO attendance (id, student_id, class_id, date, status, marked_by, created_at)
      VALUES ${attendanceRecords3.join(', ')}
    `);
    log.success('20 attendance records created (16 present, 4 absent)');
    
    // Marks: Average grades (50-60%)
    log.info('Creating exam marks (average grades)...');
    await client.query(`
      INSERT INTO marks (id, exam_id, student_id, class_id, marks_obtained, percentage, grade, status, created_at)
      VALUES 
        ('${generateId()}', '${examId}', '${student3Id}', '${classId}', 55, 55.00, 'C', 'submitted', CURRENT_TIMESTAMP),
        ('${generateId()}', '${examId}', '${student3Id}', '${classId}', 52, 52.00, 'C', 'submitted', CURRENT_TIMESTAMP),
        ('${generateId()}', '${examId}', '${student3Id}', '${classId}', 58, 58.00, 'C', 'submitted', CURRENT_TIMESTAMP)
    `);
    log.success('3 exam marks created (55%, 52%, 58% - All Average)');
    
    log.info('No behavior records (defaults to 100 positive score)');
    
    // ========================================
    // PERSONA 4: THE NEW STUDENT ⏳
    // ========================================
    log.title('\n⏳ Persona 4: "The New Student"');
    log.info('Expected ML Output: Insufficient Data (Tier 0)');
    
    const student4Id = generateId();
    await client.query(`
      INSERT INTO students (id, school_id, class_id, name, roll_number, enrollment_no, date_of_birth, gender, status, created_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, CURRENT_TIMESTAMP)
    `, [
      student4Id,
      schoolId,
      classId,
      'Ananya Reddy',
      '004',
      'EN2025004',
      '2010-09-18',
      'female',
      'active'
    ]);
    
    students.push({ id: student4Id, name: 'Ananya Reddy', persona: 'New Student' });
    log.success('Student created: Ananya Reddy');
    
    // Attendance: Only 5 records (all present)
    log.info('Creating attendance records (only 5 days)...');
    const attendanceRecords4 = [];
    for (let i = 0; i < 5; i++) {
      attendanceRecords4.push(`('${generateId()}', '${student4Id}', '${classId}', '${getDateDaysAgo(5 - i)}', 'present', '${teacher1Id}', CURRENT_TIMESTAMP)`);
    }
    await client.query(`
      INSERT INTO attendance (id, student_id, class_id, date, status, marked_by, created_at)
      VALUES ${attendanceRecords4.join(', ')}
    `);
    log.success('5 attendance records created (all present)');
    
    log.info('No exam marks (insufficient data)');
    log.info('No behavior records');
    
    // ========================================
    // COMMIT TRANSACTION
    // ========================================
    await client.query('COMMIT');
    
    // ========================================
    // SUMMARY
    // ========================================
    log.header();
    log.title('✅ SEEDING COMPLETED SUCCESSFULLY!');
    log.header();
    
    log.title('\n📊 Summary:');
    console.log(`
  ${colors.bright}Created:${colors.reset}
    • 1 School (Demo High School)
    • 1 Admin User
    • 2 Teachers
    • 1 Class (Grade 10-A)
    • 3 Subjects (Math, Science, English)
    • 1 Exam (Mid-Term)
    • 4 Students with distinct personas
    • 65 Attendance records
    • 9 Exam marks
    • 3 Behavior incidents
    `);
    
    log.title('🔐 Login Credentials:');
    console.log(`
  ${colors.bright}Admin:${colors.reset}
    Email: admin@demo.com
    Password: admin123
    
  ${colors.bright}Teachers:${colors.reset}
    Email: teacher1@demo.com
    Password: teacher123
    
    Email: teacher2@demo.com
    Password: teacher123
    `);
    
    log.title('👨‍🎓 Student Personas:');
    console.log(`
  ${colors.red}🔴 Arjun Patel${colors.reset} - The High Risk Student
     Attendance: 50% | Marks: 25-30% | Behavior: 2 negative (high)
     ${colors.bright}Expected: Critical Risk (>0.8)${colors.reset}
     
  ${colors.green}🟢 Priya Desai${colors.reset} - The Good Student
     Attendance: 95% | Marks: 88-92% | Behavior: 1 positive
     ${colors.bright}Expected: Low Risk (<0.3)${colors.reset}
     
  ${colors.yellow}🟡 Rahul Singh${colors.reset} - The Borderline Student
     Attendance: 80% | Marks: 52-58% | Behavior: None
     ${colors.bright}Expected: Medium Risk (0.3-0.6)${colors.reset}
     
  ${colors.cyan}⏳ Ananya Reddy${colors.reset} - The New Student
     Attendance: 5 days only | Marks: None | Behavior: None
     ${colors.bright}Expected: Insufficient Data${colors.reset}
    `);
    
    log.title('🚀 Next Steps:');
    console.log(`
  1. Start the ML service: ${colors.cyan}python ml-service/app.py${colors.reset}
  2. Start the backend: ${colors.cyan}cd backend && npm start${colors.reset}
  3. Start the frontend: ${colors.cyan}cd proactive-education-assistant && npm run dev${colors.reset}
  4. Login as teacher1@demo.com
  5. View the dashboard to see all 4 students
  6. Click on each student to see their ML risk predictions
    `);
    
    log.header();
    
  } catch (error) {
    await client.query('ROLLBACK');
    log.error('Seeding failed!');
    console.error(error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

// Run the seeding script
seedDatabase()
  .then(() => {
    log.success('\n✨ Database seeding completed successfully!\n');
    process.exit(0);
  })
  .catch((error) => {
    log.error('\n❌ Database seeding failed!');
    console.error(error);
    process.exit(1);
  });
