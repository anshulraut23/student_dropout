// Demo Data Loading Script
// Creates comprehensive test data for one school with all variations

import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import dataStore from './storage/dataStore.js';

// Load environment variables
dotenv.config();

const generateId = (prefix) => `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;

console.log('\n🎓 Loading Demo Data for Education Assistant\n');
console.log('='.repeat(60));

const now = new Date().toISOString();
const hashedPassword = await bcrypt.hash('demo123', 10);

// ============================================================================
// 1. SCHOOL
// ============================================================================
console.log('\n📚 Creating School...');

const school = {
  id: generateId('school'),
  name: 'Greenwood International School',
  address: '456 Knowledge Avenue, Education District',
  city: 'Mumbai',
  state: 'Maharashtra',
  phone: '022-98765432',
  email: 'info@greenwood.edu',
  website: 'www.greenwood.edu',
  adminId: null,
  createdAt: now
};

dataStore.addSchool(school);
console.log(`   ✓ School: ${school.name}`);

// ============================================================================
// 2. ADMIN USER
// ============================================================================
console.log('\n👤 Creating Admin...');

const admin = {
  id: generateId('user'),
  email: 'admin@greenwood.edu',
  password: hashedPassword,
  fullName: 'Dr. Rajesh Mehta',
  role: 'admin',
  schoolId: school.id,
  status: 'approved',
  assignedClasses: [],
  createdAt: now
};

dataStore.addUser(admin);
dataStore.updateSchool(school.id, { adminId: admin.id });
console.log(`   ✓ Admin: ${admin.fullName} (${admin.email})`);

// ============================================================================
// 3. TEACHERS (Mix of approved, pending, rejected)
// ============================================================================
console.log('\n👨‍🏫 Creating Teachers...');

const teachersData = [
  // Approved Teachers
  { name: 'Mrs. Priya Sharma', email: 'priya.sharma@greenwood.edu', status: 'approved', subject: 'Mathematics' },
  { name: 'Mr. Amit Kumar', email: 'amit.kumar@greenwood.edu', status: 'approved', subject: 'Science' },
  { name: 'Ms. Sneha Patel', email: 'sneha.patel@greenwood.edu', status: 'approved', subject: 'English' },
  { name: 'Mr. Rahul Desai', email: 'rahul.desai@greenwood.edu', status: 'approved', subject: 'Hindi' },
  { name: 'Mrs. Anjali Verma', email: 'anjali.verma@greenwood.edu', status: 'approved', subject: 'Social Studies' },
  { name: 'Mr. Vikram Singh', email: 'vikram.singh@greenwood.edu', status: 'approved', subject: 'Computer Science' },
  
  // Pending Approval
  { name: 'Ms. Kavita Reddy', email: 'kavita.reddy@greenwood.edu', status: 'pending', subject: 'Art' },
  { name: 'Mr. Suresh Nair', email: 'suresh.nair@greenwood.edu', status: 'pending', subject: 'Physical Education' },
  { name: 'Mrs. Deepa Joshi', email: 'deepa.joshi@greenwood.edu', status: 'pending', subject: 'Music' },
  
  // Rejected (for testing)
  { name: 'Mr. Test Rejected', email: 'rejected@greenwood.edu', status: 'rejected', subject: 'N/A' }
];

const teachers = [];
teachersData.forEach((teacherData, index) => {
  const teacher = {
    id: generateId('user'),
    email: teacherData.email,
    password: hashedPassword,
    fullName: teacherData.name,
    role: 'teacher',
    schoolId: school.id,
    status: teacherData.status,
    assignedClasses: [],
    subject: teacherData.subject,
    createdAt: new Date(Date.now() - (10 - index) * 24 * 60 * 60 * 1000).toISOString() // Stagger dates
  };
  
  dataStore.addUser(teacher);
  teachers.push(teacher);
  
  // Create approval request for pending teachers
  if (teacherData.status === 'pending') {
    dataStore.addRequest({
      id: generateId('request'),
      teacherId: teacher.id,
      schoolId: school.id,
      type: 'teacher_approval',
      status: 'pending',
      createdAt: teacher.createdAt
    });
  }
  
  console.log(`   ✓ ${teacherData.status.toUpperCase()}: ${teacher.fullName} - ${teacherData.subject}`);
});

// ============================================================================
// 4. CLASSES (Mix of daily and subject-wise attendance modes)
// ============================================================================
console.log('\n🏫 Creating Classes...');

const classesData = [
  // Daily Attendance Mode
  { name: 'Class 8-A', grade: 8, section: 'A', mode: 'daily', teacherIndex: 0, year: '2024-25' },
  { name: 'Class 9-A', grade: 9, section: 'A', mode: 'daily', teacherIndex: 1, year: '2024-25' },
  { name: 'Class 10-A', grade: 10, section: 'A', mode: 'daily', teacherIndex: 2, year: '2024-25' },
  
  // Subject-wise Attendance Mode
  { name: 'Class 8-B', grade: 8, section: 'B', mode: 'subject', teacherIndex: 3, year: '2024-25' },
  { name: 'Class 9-B', grade: 9, section: 'B', mode: 'subject', teacherIndex: 4, year: '2024-25' },
  { name: 'Class 10-B', grade: 10, section: 'B', mode: 'subject', teacherIndex: 5, year: '2024-25' }
];

const classes = [];
classesData.forEach(classData => {
  const classObj = {
    id: generateId('class'),
    name: classData.name,
    grade: classData.grade,
    section: classData.section,
    academicYear: classData.year,
    schoolId: school.id,
    teacherId: teachers[classData.teacherIndex].id, // Assign incharge
    attendanceMode: classData.mode,
    status: 'active',
    createdAt: now
  };
  
  dataStore.addClass(classObj);
  classes.push(classObj);
  console.log(`   ✓ ${classObj.name} (${classData.mode} mode) - Incharge: ${teachers[classData.teacherIndex].fullName}`);
});

// ============================================================================
// 5. SUBJECTS (For subject-wise classes)
// ============================================================================
console.log('\n📖 Creating Subjects...');

const subjectsData = [
  'Mathematics', 'Science', 'English', 'Hindi', 'Social Studies', 'Computer Science'
];

const subjects = [];
classes.forEach(classObj => {
  if (classObj.attendanceMode === 'subject') {
    subjectsData.forEach((subjectName, index) => {
      const subject = {
        id: generateId('subject'),
        name: subjectName,
        code: `${classObj.grade}${classObj.section}-${subjectName.substring(0, 3).toUpperCase()}`,
        classId: classObj.id,
        schoolId: school.id,
        teacherId: teachers[index % 6].id, // Rotate through first 6 teachers
        createdAt: now
      };
      
      dataStore.addSubject(subject);
      subjects.push(subject);
    });
    console.log(`   ✓ ${subjectsData.length} subjects for ${classObj.name}`);
  }
});

// ============================================================================
// 6. STUDENTS (Mix of different risk levels and attendance patterns)
// ============================================================================
console.log('\n👨‍🎓 Creating Students...');

const firstNames = ['Aarav', 'Vivaan', 'Aditya', 'Arjun', 'Sai', 'Aadhya', 'Ananya', 'Diya', 'Isha', 'Kavya'];
const lastNames = ['Sharma', 'Patel', 'Kumar', 'Singh', 'Reddy', 'Nair', 'Gupta', 'Joshi', 'Mehta', 'Desai'];

let studentCount = 0;
const students = [];

classes.forEach((classObj, classIndex) => {
  const studentsPerClass = 8; // 8 students per class
  
  for (let i = 0; i < studentsPerClass; i++) {
    const firstName = firstNames[i % firstNames.length];
    const lastName = lastNames[(classIndex + i) % lastNames.length];
    const rollNo = (i + 1).toString().padStart(2, '0');
    
    const student = {
      id: generateId('student'),
      name: `${firstName} ${lastName}`,
      rollNumber: `${classObj.grade}${classObj.section}${rollNo}`,
      enrollmentNo: `GW${classObj.grade}${classObj.section}${rollNo}${new Date().getFullYear()}`,
      classId: classObj.id,
      schoolId: school.id,
      dateOfBirth: `200${9 - (classObj.grade - 8)}-0${(i % 12) + 1}-15`,
      gender: i % 2 === 0 ? 'Male' : 'Female',
      fatherName: `Mr. ${lastName}`,
      motherName: `Mrs. ${lastName}`,
      contactNumber: `98765${43210 + studentCount}`,
      address: `${i + 1}, Student Colony, Mumbai`,
      status: 'active',
      createdAt: now
    };
    
    dataStore.addStudent(student);
    students.push(student);
    studentCount++;
  }
  
  console.log(`   ✓ ${studentsPerClass} students for ${classObj.name}`);
});

// ============================================================================
// 7. ATTENDANCE RECORDS (Last 30 days with variations)
// ============================================================================
console.log('\n📅 Creating Attendance Records...');

const today = new Date();
const daysToGenerate = 30;
let attendanceCount = 0;

for (let dayOffset = daysToGenerate; dayOffset >= 0; dayOffset--) {
  const date = new Date(today);
  date.setDate(date.getDate() - dayOffset);
  
  // Skip weekends
  if (date.getDay() === 0 || date.getDay() === 6) continue;
  
  const dateStr = date.toISOString().split('T')[0];
  
  classes.forEach(classObj => {
    const classStudents = students.filter(s => s.classId === classObj.id);
    
    if (classObj.attendanceMode === 'daily') {
      // Daily attendance - one record per student per day
      classStudents.forEach((student, index) => {
        // Create attendance patterns: some students have poor attendance
        let status = 'present';
        if (index === 0 || index === 1) {
          // High-risk students - 60% attendance
          status = Math.random() > 0.6 ? 'present' : (Math.random() > 0.5 ? 'absent' : 'late');
        } else if (index === 2 || index === 3) {
          // Medium-risk students - 75% attendance
          status = Math.random() > 0.75 ? 'present' : (Math.random() > 0.7 ? 'absent' : 'late');
        } else {
          // Good students - 95% attendance
          status = Math.random() > 0.95 ? 'absent' : 'present';
        }
        
        dataStore.addAttendance({
          id: generateId('attendance'),
          studentId: student.id,
          classId: classObj.id,
          subjectId: null,
          date: dateStr,
          status: status,
          markedBy: classObj.teacherId,
          createdAt: new Date(date.getTime() + 9 * 60 * 60 * 1000).toISOString() // 9 AM
        });
        attendanceCount++;
      });
    } else {
      // Subject-wise attendance - one record per student per subject per day
      const classSubjects = subjects.filter(s => s.classId === classObj.id);
      
      classStudents.forEach((student, index) => {
        classSubjects.forEach(subject => {
          let status = 'present';
          if (index === 0 || index === 1) {
            status = Math.random() > 0.6 ? 'present' : (Math.random() > 0.5 ? 'absent' : 'late');
          } else if (index === 2 || index === 3) {
            status = Math.random() > 0.75 ? 'present' : (Math.random() > 0.7 ? 'absent' : 'late');
          } else {
            status = Math.random() > 0.95 ? 'absent' : 'present';
          }
          
          dataStore.addAttendance({
            id: generateId('attendance'),
            studentId: student.id,
            classId: classObj.id,
            subjectId: subject.id,
            date: dateStr,
            status: status,
            markedBy: subject.teacherId,
            createdAt: new Date(date.getTime() + 10 * 60 * 60 * 1000).toISOString() // 10 AM
          });
          attendanceCount++;
        });
      });
    }
  });
}

console.log(`   ✓ ${attendanceCount} attendance records (last ${daysToGenerate} days)`);

// ============================================================================
// 8. EXAM TEMPLATES
// ============================================================================
console.log('\n📝 Creating Exam Templates...');

const examTemplates = [
  {
    name: 'Unit Test',
    description: 'Monthly unit test for continuous evaluation',
    type: 'unit_test',
    subjects: ['Mathematics', 'Science', 'English', 'Hindi', 'Social Studies'],
    totalMarks: 25,
    passingMarks: 10
  },
  {
    name: 'Mid-Term Examination',
    description: 'Half-yearly examination covering first semester',
    type: 'mid_term',
    subjects: ['Mathematics', 'Science', 'English', 'Hindi', 'Social Studies', 'Computer Science'],
    totalMarks: 80,
    passingMarks: 33
  },
  {
    name: 'Final Examination',
    description: 'Annual examination covering full syllabus',
    type: 'final',
    subjects: ['Mathematics', 'Science', 'English', 'Hindi', 'Social Studies', 'Computer Science'],
    totalMarks: 100,
    passingMarks: 40
  }
];

examTemplates.forEach(template => {
  const examTemplate = {
    id: generateId('exam-template'),
    name: template.name,
    description: template.description,
    type: template.type,
    schoolId: school.id,
    subjects: template.subjects.map(subjectName => ({
      name: subjectName,
      totalMarks: template.totalMarks,
      passingMarks: template.passingMarks
    })),
    isActive: true,
    createdBy: admin.id,
    createdAt: now
  };
  
  dataStore.addExamTemplate(examTemplate);
  console.log(`   ✓ ${template.name} (${template.subjects.length} subjects, ${template.totalMarks} marks)`);
});

// ============================================================================
// SUMMARY
// ============================================================================
console.log('\n' + '='.repeat(60));
console.log('✅ DEMO DATA LOADED SUCCESSFULLY!');
console.log('='.repeat(60));

console.log('\n📊 Data Summary:');
console.log(`   Schools: 1`);
console.log(`   Admin: 1`);
console.log(`   Teachers: ${teachers.length} (${teachers.filter(t => t.status === 'approved').length} approved, ${teachers.filter(t => t.status === 'pending').length} pending)`);
console.log(`   Classes: ${classes.length} (${classes.filter(c => c.attendanceMode === 'daily').length} daily, ${classes.filter(c => c.attendanceMode === 'subject').length} subject-wise)`);
console.log(`   Subjects: ${subjects.length}`);
console.log(`   Students: ${students.length} (${Math.floor(students.length / classes.length)} per class)`);
console.log(`   Attendance Records: ${attendanceCount}`);
console.log(`   Exam Templates: ${examTemplates.length}`);

console.log('\n🔐 Login Credentials:');
console.log('   Password for all users: demo123');
console.log('\n   Admin:');
console.log(`     Email: ${admin.email}`);
console.log('\n   Sample Teachers (Approved):');
teachers.filter(t => t.status === 'approved').slice(0, 3).forEach(t => {
  console.log(`     ${t.fullName}: ${t.email}`);
});

console.log('\n📈 Data Variations Included:');
console.log('   ✓ Approved, Pending, and Rejected teachers');
console.log('   ✓ Daily and Subject-wise attendance modes');
console.log('   ✓ Students with varying attendance patterns (high/medium/low risk)');
console.log('   ✓ 30 days of attendance history');
console.log('   ✓ Multiple exam templates (Unit Test, Mid-Term, Final)');
console.log('   ✓ Realistic Indian names and data');

console.log('\n🚀 Next Steps:');
console.log('   1. Start the backend: npm run dev');
console.log('   2. Login with admin credentials');
console.log('   3. Explore all features with realistic data');
console.log('   4. Test teacher approval workflow');
console.log('   5. View attendance analytics and risk assessment\n');
