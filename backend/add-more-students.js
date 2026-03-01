import dotenv from 'dotenv';
import { getPostgresPool, connectPostgres } from './database/connection.js';

dotenv.config();

const schoolId = '1772109087175-iahaywyr4';

// Get existing classes
async function getClasses() {
  const pool = getPostgresPool();
  const result = await pool.query(
    'SELECT id, name FROM classes WHERE school_id = $1',
    [schoolId]
  );
  return result.rows;
}

// Generate realistic student data
function generateStudent(index, classId, className) {
  const timestamp = Date.now();
  const studentId = `${timestamp}-${Math.random().toString(36).substr(2, 9)}`;
  
  const firstNames = ['Rahul', 'Priya', 'Amit', 'Sneha', 'Rohan', 'Anjali', 'Vikram', 'Pooja', 'Arjun', 'Kavya',
                      'Siddharth', 'Neha', 'Aditya', 'Riya', 'Karan', 'Divya', 'Harsh', 'Ishita', 'Nikhil', 'Shreya',
                      'Varun', 'Tanvi', 'Akash', 'Meera', 'Yash', 'Sakshi', 'Manish', 'Nisha', 'Rajesh', 'Swati'];
  const lastNames = ['Sharma', 'Patel', 'Kumar', 'Singh', 'Reddy', 'Gupta', 'Joshi', 'Mehta', 'Desai', 'Rao'];
  
  const firstName = firstNames[index % firstNames.length];
  const lastName = lastNames[Math.floor(index / 3) % lastNames.length];
  const name = `${firstName} ${lastName}`;
  const rollNumber = `VES${className.replace('-', '')}${String(index + 100).padStart(3, '0')}`;
  
  // 40% will be at-risk or dropped out
  const isAtRisk = Math.random() < 0.4;
  
  return {
    id: studentId,
    name,
    rollNumber,
    classId,
    isAtRisk
  };
}

// Generate attendance records
function generateAttendance(studentId, isAtRisk) {
  const records = [];
  const daysToGenerate = 30 + Math.floor(Math.random() * 20); // 30-50 days
  const startDate = new Date('2025-01-01');
  
  // At-risk students: 50-70% attendance
  // Good students: 85-95% attendance
  const attendanceRate = isAtRisk 
    ? 0.5 + Math.random() * 0.2 
    : 0.85 + Math.random() * 0.1;
  
  for (let i = 0; i < daysToGenerate; i++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);
    
    // Skip weekends
    if (date.getDay() === 0 || date.getDay() === 6) continue;
    
    const attendanceId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const isPresent = Math.random() < attendanceRate;
    
    records.push({
      id: attendanceId,
      studentId,
      date: date.toISOString().split('T')[0],
      status: isPresent ? 'present' : 'absent'
    });
  }
  
  return records;
}

// Get existing exams for a class
async function getExams(classId) {
  const pool = getPostgresPool();
  const result = await pool.query(
    'SELECT id, name, total_marks FROM exams WHERE class_id = $1 LIMIT 5',
    [classId]
  );
  return result.rows;
}

// Generate exam marks
async function generateMarks(studentId, classId, isAtRisk) {
  const exams = await getExams(classId);
  
  if (exams.length === 0) {
    return []; // No exams for this class yet
  }
  
  const records = [];
  
  // At-risk students: 35-55% marks
  // Good students: 70-90% marks
  const basePercentage = isAtRisk 
    ? 35 + Math.random() * 20 
    : 70 + Math.random() * 20;
  
  for (const exam of exams) {
    const marksId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const percentage = basePercentage + (Math.random() * 10 - 5); // ±5% variation
    const marksObtained = Math.round((percentage / 100) * exam.total_marks);
    
    records.push({
      id: marksId,
      examId: exam.id,
      studentId,
      classId,
      marksObtained,
      percentage: Math.round((marksObtained / exam.total_marks) * 100)
    });
  }
  
  return records;
}

// Get a teacher for the school
async function getTeacher() {
  const pool = getPostgresPool();
  const result = await pool.query(
    "SELECT id FROM users WHERE school_id = $1 AND role = 'teacher' LIMIT 1",
    [schoolId]
  );
  return result.rows[0]?.id || null;
}

// Generate behavior records
async function generateBehavior(studentId, isAtRisk, teacherId) {
  const records = [];
  const incidentCount = isAtRisk 
    ? 3 + Math.floor(Math.random() * 5) // 3-7 incidents
    : 0 + Math.floor(Math.random() * 3); // 0-2 incidents
  
  const positiveActions = [
    { description: 'Helped classmate with homework', category: 'Academic Support' },
    { description: 'Participated actively in class', category: 'Class Participation' },
    { description: 'Completed project ahead of time', category: 'Academic Performance' },
    { description: 'Showed leadership in group activity', category: 'Leadership' }
  ];
  
  const negativeActions = [
    { description: 'Late to class', category: 'Attendance' },
    { description: 'Incomplete homework', category: 'Academic Performance' },
    { description: 'Disruptive behavior', category: 'Discipline' },
    { description: 'Not paying attention', category: 'Class Participation' },
    { description: 'Missing assignments', category: 'Academic Performance' }
  ];
  
  for (let i = 0; i < incidentCount; i++) {
    const behaviorId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const isNegative = isAtRisk ? Math.random() < 0.7 : Math.random() < 0.3;
    
    const date = new Date('2025-01-01');
    date.setDate(date.getDate() + Math.floor(Math.random() * 60));
    
    const action = isNegative 
      ? negativeActions[Math.floor(Math.random() * negativeActions.length)]
      : positiveActions[Math.floor(Math.random() * positiveActions.length)];
    
    records.push({
      id: behaviorId,
      studentId,
      teacherId,
      behaviorType: isNegative ? 'negative' : 'positive',
      category: action.category,
      description: action.description,
      date: date.toISOString().split('T')[0],
      severity: isNegative ? (Math.random() < 0.3 ? 'high' : 'medium') : 'low'
    });
  }
  
  return records;
}

async function addStudents() {
  await connectPostgres();
  const pool = getPostgresPool();
  
  try {
    console.log('🎓 Adding 30 more students to VES College...\n');
    
    const classes = await getClasses();
    console.log(`Found ${classes.length} classes\n`);
    
    const teacherId = await getTeacher();
    if (!teacherId) {
      console.log('❌ No teacher found for this school. Cannot add behavior records.');
      return;
    }
    console.log(`Using teacher ID: ${teacherId}\n`);
    
    let studentsAdded = 0;
    let droppedOutCount = 0;
    
    for (let i = 0; i < 30; i++) {
      const classInfo = classes[i % classes.length];
      const student = generateStudent(i + 50, classInfo.id, classInfo.name);
      
      // Determine dropout status (30% of at-risk students will be marked as dropped out)
      const dropoutStatus = student.isAtRisk && Math.random() < 0.3 ? 'dropped_out' : 'active';
      const dropoutDate = dropoutStatus === 'dropped_out' ? '2025-02-15' : null;
      const dropoutReason = dropoutStatus === 'dropped_out' 
        ? ['Financial difficulties', 'Poor academic performance', 'Family issues', 'Health problems'][Math.floor(Math.random() * 4)]
        : null;
      
      // Insert student
      await pool.query(
        `INSERT INTO students (id, school_id, class_id, name, roll_number, status, dropout_status, dropout_date, dropout_reason)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
        [student.id, schoolId, student.classId, student.name, student.rollNumber, 
         dropoutStatus === 'dropped_out' ? 'inactive' : 'active', 
         dropoutStatus, dropoutDate, dropoutReason]
      );
      
      // Generate and insert attendance
      const attendanceRecords = generateAttendance(student.id, student.isAtRisk);
      for (const record of attendanceRecords) {
        await pool.query(
          `INSERT INTO attendance (id, student_id, class_id, date, status)
           VALUES ($1, $2, $3, $4, $5)`,
          [record.id, record.studentId, student.classId, record.date, record.status]
        );
      }
      
      // Generate and insert marks
      const marksRecords = await generateMarks(student.id, student.classId, student.isAtRisk);
      for (const record of marksRecords) {
        await pool.query(
          `INSERT INTO marks (id, exam_id, student_id, class_id, marks_obtained, percentage, status)
           VALUES ($1, $2, $3, $4, $5, $6, 'verified')`,
          [record.id, record.examId, record.studentId, record.classId, 
           record.marksObtained, record.percentage]
        );
      }
      
      // Generate and insert behavior
      const behaviorRecords = await generateBehavior(student.id, student.isAtRisk, teacherId);
      for (const record of behaviorRecords) {
        await pool.query(
          `INSERT INTO behavior (id, student_id, teacher_id, behavior_type, category, description, date, severity)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
          [record.id, record.studentId, record.teacherId, record.behaviorType, 
           record.category, record.description, record.date, record.severity]
        );
      }
      
      studentsAdded++;
      if (dropoutStatus === 'dropped_out') droppedOutCount++;
      
      console.log(`✅ Added: ${student.name} (${student.rollNumber}) - ${dropoutStatus === 'dropped_out' ? '❌ DROPPED OUT' : '✓ Active'}`);
      console.log(`   Attendance: ${attendanceRecords.length} days, Exams: ${marksRecords.length}, Behavior: ${behaviorRecords.length} incidents`);
    }
    
    console.log('\n' + '='.repeat(60));
    console.log(`✅ Successfully added ${studentsAdded} students`);
    console.log(`   - Dropped out: ${droppedOutCount}`);
    console.log(`   - Active: ${studentsAdded - droppedOutCount}`);
    console.log('='.repeat(60));
    
    // Show total counts
    const totalResult = await pool.query(
      'SELECT COUNT(*) as total FROM students WHERE school_id = $1',
      [schoolId]
    );
    const dropoutResult = await pool.query(
      "SELECT COUNT(*) as total FROM students WHERE school_id = $1 AND dropout_status = 'dropped_out'",
      [schoolId]
    );
    
    console.log(`\n📊 Total VES College Students: ${totalResult.rows[0].total}`);
    console.log(`   - Total Dropouts: ${dropoutResult.rows[0].total}`);
    console.log(`   - Active Students: ${totalResult.rows[0].total - dropoutResult.rows[0].total}`);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

addStudents();
