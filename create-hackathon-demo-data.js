/**
 * Hackathon Demo Data Generator
 * Creates 5 students with 3 days of attendance + 1 exam each
 * Demonstrates LOW, MEDIUM, and HIGH risk predictions
 */

import dotenv from 'dotenv';
import dataStore from './backend/storage/dataStore.js';

dotenv.config({ path: './backend/.env' });

const DEMO_DATA = {
  school: {
    name: 'Demo High School',
    address: '123 Education Street',
    city: 'Mumbai',
    state: 'Maharashtra',
    phone: '022-12345678',
    email: 'demo@school.com'
  },
  admin: {
    email: 'admin@demo.com',
    password: 'admin123',
    fullName: 'Demo Admin'
  },
  class: {
    name: '10-A',
    grade: 10,
    section: 'A',
    academicYear: '2025-2026'
  },
  subject: {
    name: 'Mathematics',
    code: 'MATH101'
  },
  exam: {
    name: 'Mathematics Mid-Term',
    type: 'midterm',
    totalMarks: 100,
    passingMarks: 40,
    date: '2026-02-20'
  },
  students: [
    {
      name: 'Rahul Kumar',
      rollNumber: '101',
      email: 'rahul@demo.com',
      phone: '9876543210',
      attendance: ['present', 'present', 'present'],  // 100% → LOW risk
      examScore: 85,
      expectedRisk: 'low',
      description: 'Excellent student - high attendance, good marks'
    },
    {
      name: 'Priya Sharma',
      rollNumber: '102', 
      email: 'priya@demo.com',
      phone: '9876543211',
      attendance: ['present', 'present', 'absent'],   // 66% → MEDIUM risk
      examScore: 65,
      expectedRisk: 'medium',
      description: 'Average student - decent attendance, average marks'
    },
    {
      name: 'Amit Patel',
      rollNumber: '103',
      email: 'amit@demo.com',
      phone: '9876543212',
      attendance: ['present', 'absent', 'absent'],    // 33% → HIGH risk
      examScore: 45,
      expectedRisk: 'high',
      description: 'At-risk student - poor attendance, low marks'
    },
    {
      name: 'Sneha Reddy',
      rollNumber: '104',
      email: 'sneha@demo.com',
      phone: '9876543213',
      attendance: ['present', 'present', 'present'],  // 100% → MEDIUM risk
      examScore: 50,
      expectedRisk: 'medium',
      description: 'Good attendance but struggling academically'
    },
    {
      name: 'Vikram Singh',
      rollNumber: '105',
      email: 'vikram@demo.com',
      phone: '9876543214',
      attendance: ['present', 'present', 'absent'],   // 66% → LOW risk
      examScore: 80,
      expectedRisk: 'low',
      description: 'Smart student - good marks despite some absences'
    }
  ]
};

async function generateDemoData() {
  console.log('\n' + '='.repeat(80));
  console.log('🎯 HACKATHON DEMO DATA GENERATOR');
  console.log('='.repeat(80));
  console.log('Creating 5 students with 3 days attendance + 1 exam each\n');

  try {
    // Step 1: Create School
    console.log('🏫 Step 1: Creating school...');
    const school = await dataStore.addSchool(DEMO_DATA.school);
    console.log(`✅ School created: ${school.name} (ID: ${school.id})`);

    // Step 2: Create Admin
    console.log('\n👤 Step 2: Creating admin user...');
    const admin = await dataStore.addUser({
      ...DEMO_DATA.admin,
      role: 'admin',
      schoolId: school.id,
      status: 'approved'
    });
    console.log(`✅ Admin created: ${admin.fullName} (${admin.email})`);

    // Update school with admin ID
    await dataStore.updateSchool(school.id, { adminId: admin.id });

    // Step 3: Create Class
    console.log('\n📚 Step 3: Creating class...');
    const classData = await dataStore.addClass({
      ...DEMO_DATA.class,
      schoolId: school.id
    });
    console.log(`✅ Class created: ${classData.name}`);

    // Step 4: Create Subject
    console.log('\n📖 Step 4: Creating subject...');
    const subject = await dataStore.addSubject({
      ...DEMO_DATA.subject,
      classId: classData.id,
      schoolId: school.id
    });
    console.log(`✅ Subject created: ${subject.name}`);

    // Step 5: Create Exam
    console.log('\n📝 Step 5: Creating exam...');
    const exam = await dataStore.addExam({
      ...DEMO_DATA.exam,
      classId: classData.id,
      subjectId: subject.id,
      schoolId: school.id,
      status: 'scheduled'
    });
    console.log(`✅ Exam created: ${exam.name} (${exam.totalMarks} marks)`);

    // Step 6: Create Students with Data
    console.log('\n👥 Step 6: Creating students with attendance and marks...\n');
    
    const dates = [
      '2026-02-25',
      '2026-02-26', 
      '2026-02-27'
    ];

    for (const studentData of DEMO_DATA.students) {
      console.log(`  📌 Creating: ${studentData.name}`);
      
      // Create student
      const student = await dataStore.addStudent({
        name: studentData.name,
        rollNumber: studentData.rollNumber,
        email: studentData.email,
        phone: studentData.phone,
        classId: classData.id,
        schoolId: school.id,
        status: 'active'
      });

      // Add 3 days of attendance
      for (let i = 0; i < 3; i++) {
        await dataStore.addAttendance({
          studentId: student.id,
          classId: classData.id,
          subjectId: subject.id,
          date: dates[i],
          status: studentData.attendance[i],
          markedBy: admin.id
        });
      }

      // Add exam marks
      await dataStore.addMarks({
        studentId: student.id,
        examId: exam.id,
        classId: classData.id,
        marksObtained: studentData.examScore,
        percentage: (studentData.examScore / exam.totalMarks) * 100,
        grade: getGrade(studentData.examScore, exam.totalMarks),
        status: 'verified'
      });

      const presentDays = studentData.attendance.filter(s => s === 'present').length;
      const attendanceRate = (presentDays / 3 * 100).toFixed(0);
      
      console.log(`     ✓ Attendance: ${presentDays}/3 days (${attendanceRate}%)`);
      console.log(`     ✓ Exam Score: ${studentData.examScore}/${exam.totalMarks}`);
      console.log(`     ✓ Expected Risk: ${studentData.expectedRisk.toUpperCase()}`);
      console.log(`     ✓ ${studentData.description}\n`);
    }

    // Summary
    console.log('='.repeat(80));
    console.log('✅ DEMO DATA CREATED SUCCESSFULLY!');
    console.log('='.repeat(80));
    console.log('\n📊 Summary:');
    console.log(`   School: ${school.name}`);
    console.log(`   Class: ${classData.name}`);
    console.log(`   Subject: ${subject.name}`);
    console.log(`   Exam: ${exam.name}`);
    console.log(`   Students: ${DEMO_DATA.students.length}`);
    console.log(`   Attendance Records: ${DEMO_DATA.students.length * 3}`);
    console.log(`   Exam Marks: ${DEMO_DATA.students.length}`);
    
    console.log('\n🔑 Login Credentials:');
    console.log(`   Email: ${DEMO_DATA.admin.email}`);
    console.log(`   Password: ${DEMO_DATA.admin.password}`);
    
    console.log('\n🎯 Next Steps:');
    console.log('   1. Start backend: cd backend && npm start');
    console.log('   2. Start ML service: cd ml-service && python app.py');
    console.log('   3. Start frontend: cd proactive-education-assistant && npm start');
    console.log('   4. Login and view student risk predictions!');
    console.log('\n' + '='.repeat(80) + '\n');

    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error creating demo data:', error.message);
    console.error(error);
    process.exit(1);
  }
}

function getGrade(marks, total) {
  const percentage = (marks / total) * 100;
  if (percentage >= 90) return 'A+';
  if (percentage >= 80) return 'A';
  if (percentage >= 70) return 'B+';
  if (percentage >= 60) return 'B';
  if (percentage >= 50) return 'C';
  if (percentage >= 40) return 'D';
  return 'F';
}

// Run the generator
generateDemoData();
