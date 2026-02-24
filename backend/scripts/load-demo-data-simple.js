// Simplified Demo Data Loading Script
// Creates essential data with fewer attendance records to avoid connection issues

import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import dataStore from '../storage/dataStore.js';

// Load environment variables
dotenv.config();

const generateId = (prefix) => `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;

console.log('\n🎓 Loading Demo Data (Simplified)\n');
console.log('='.repeat(60));

const now = new Date().toISOString();
const hashedPassword = await bcrypt.hash('demo123', 10);

// 1. SCHOOL
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

await dataStore.addSchool(school);
console.log(`   ✓ School: ${school.name}`);

// 2. ADMIN USER
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

await dataStore.addUser(admin);
await dataStore.updateSchool(school.id, { adminId: admin.id });
console.log(`   ✓ Admin: ${admin.fullName} (${admin.email})`);

// 3. TEACHERS
console.log('\n👨‍🏫 Creating Teachers...');
const teachersData = [
  { name: 'Mrs. Priya Sharma', email: 'priya.sharma@greenwood.edu', status: 'approved', subject: 'Mathematics' },
  { name: 'Mr. Amit Kumar', email: 'amit.kumar@greenwood.edu', status: 'approved', subject: 'Science' },
  { name: 'Ms. Sneha Patel', email: 'sneha.patel@greenwood.edu', status: 'approved', subject: 'English' },
  { name: 'Mr. Rahul Desai', email: 'rahul.desai@greenwood.edu', status: 'approved', subject: 'Hindi' },
  { name: 'Mrs. Anjali Verma', email: 'anjali.verma@greenwood.edu', status: 'approved', subject: 'Social Studies' },
  { name: 'Mr. Vikram Singh', email: 'vikram.singh@greenwood.edu', status: 'approved', subject: 'Computer Science' },
  { name: 'Ms. Kavita Reddy', email: 'kavita.reddy@greenwood.edu', status: 'pending', subject: 'Art' },
  { name: 'Mr. Suresh Nair', email: 'suresh.nair@greenwood.edu', status: 'pending', subject: 'Physical Education' },
];

const teachers = [];
for (const teacherData of teachersData) {
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
    createdAt: now
  };
  
  await dataStore.addUser(teacher);
  teachers.push(teacher);
  
  if (teacherData.status === 'pending') {
    await dataStore.addRequest({
      id: generateId('request'),
      teacherId: teacher.id,
      schoolId: school.id,
      type: 'teacher_approval',
      status: 'pending',
      createdAt: teacher.createdAt
    });
  }
  
  console.log(`   ✓ ${teacherData.status.toUpperCase()}: ${teacher.fullName} - ${teacherData.subject}`);
}

// 4. CLASSES
console.log('\n🏫 Creating Classes...');
const classesData = [
  { name: 'Class 8-A', grade: 8, section: 'A', mode: 'daily', teacherIndex: 0 },
  { name: 'Class 9-A', grade: 9, section: 'A', mode: 'daily', teacherIndex: 1 },
  { name: 'Class 10-A', grade: 10, section: 'A', mode: 'subject', teacherIndex: 2 },
];

const classes = [];
for (const classData of classesData) {
  const classObj = {
    id: generateId('class'),
    name: classData.name,
    grade: classData.grade,
    section: classData.section,
    academicYear: '2024-25',
    schoolId: school.id,
    teacherId: teachers[classData.teacherIndex].id,
    attendanceMode: classData.mode,
    status: 'active',
    createdAt: now
  };
  
  await dataStore.addClass(classObj);
  classes.push(classObj);
  console.log(`   ✓ ${classObj.name} (${classData.mode} mode)`);
}

// 5. SUBJECTS (For subject-wise class)
console.log('\n📖 Creating Subjects...');
const subjectsData = ['Mathematics', 'Science', 'English', 'Hindi', 'Social Studies', 'Computer Science'];
const subjects = [];

for (const classObj of classes) {
  if (classObj.attendanceMode === 'subject') {
    for (let i = 0; i < subjectsData.length; i++) {
      const subject = {
        id: generateId('subject'),
        name: subjectsData[i],
        code: `${classObj.grade}${classObj.section}-${subjectsData[i].substring(0, 3).toUpperCase()}`,
        classId: classObj.id,
        schoolId: school.id,
        teacherId: teachers[i % teachers.length].id,
        createdAt: now
      };
      
      await dataStore.addSubject(subject);
      subjects.push(subject);
    }
    console.log(`   ✓ ${subjectsData.length} subjects for ${classObj.name}`);
  }
}

// 6. STUDENTS
console.log('\n👨‍🎓 Creating Students...');
const firstNames = ['Aarav', 'Vivaan', 'Aditya', 'Arjun', 'Sai', 'Aadhya', 'Ananya', 'Diya'];
const lastNames = ['Sharma', 'Patel', 'Kumar', 'Singh', 'Reddy', 'Nair', 'Gupta', 'Joshi'];

const students = [];
for (let classIndex = 0; classIndex < classes.length; classIndex++) {
  const classObj = classes[classIndex];
  
  for (let i = 0; i < 8; i++) {
    const firstName = firstNames[i];
    const lastName = lastNames[i];
    const rollNo = (i + 1).toString().padStart(2, '0');
    
    const student = {
      id: generateId('student'),
      name: `${firstName} ${lastName}`,
      rollNumber: `${classObj.grade}${classObj.section}${rollNo}`,
      enrollmentNo: `GW${classObj.grade}${classObj.section}${rollNo}2024`,
      classId: classObj.id,
      schoolId: school.id,
      dateOfBirth: `2009-0${(i % 12) + 1}-15`,
      gender: i % 2 === 0 ? 'Male' : 'Female',
      fatherName: `Mr. ${lastName}`,
      motherName: `Mrs. ${lastName}`,
      contactNumber: `98765${43210 + (classIndex * 8 + i)}`,
      address: `${i + 1}, Student Colony, Mumbai`,
      status: 'active',
      createdAt: now
    };
    
    await dataStore.addStudent(student);
    students.push(student);
  }
  
  console.log(`   ✓ 8 students for ${classObj.name}`);
}

// 7. ATTENDANCE RECORDS (Last 7 days only)
console.log('\n📅 Creating Attendance Records (last 7 days)...');
const today = new Date();
let attendanceCount = 0;

for (let dayOffset = 7; dayOffset >= 0; dayOffset--) {
  const date = new Date(today);
  date.setDate(date.getDate() - dayOffset);
  
  // Skip weekends
  if (date.getDay() === 0 || date.getDay() === 6) continue;
  
  const dateStr = date.toISOString().split('T')[0];
  
  for (const classObj of classes) {
    const classStudents = students.filter(s => s.classId === classObj.id);
    
    if (classObj.attendanceMode === 'daily') {
      // Daily attendance
      for (let i = 0; i < classStudents.length; i++) {
        const student = classStudents[i];
        let status = 'present';
        if (i < 2) {
          status = Math.random() > 0.6 ? 'present' : 'absent';
        } else {
          status = Math.random() > 0.95 ? 'absent' : 'present';
        }
        
        await dataStore.addAttendance({
          id: generateId('attendance'),
          studentId: student.id,
          classId: classObj.id,
          subjectId: null,
          date: dateStr,
          status: status,
          markedBy: classObj.teacherId,
          createdAt: new Date(date.getTime() + 9 * 60 * 60 * 1000).toISOString()
        });
        attendanceCount++;
      }
    } else {
      // Subject-wise attendance (only 2 subjects per day to reduce records)
      const classSubjects = subjects.filter(s => s.classId === classObj.id).slice(0, 2);
      
      for (const student of classStudents) {
        for (const subject of classSubjects) {
          const status = Math.random() > 0.9 ? 'absent' : 'present';
          
          await dataStore.addAttendance({
            id: generateId('attendance'),
            studentId: student.id,
            classId: classObj.id,
            subjectId: subject.id,
            date: dateStr,
            status: status,
            markedBy: subject.teacherId,
            createdAt: new Date(date.getTime() + 10 * 60 * 60 * 1000).toISOString()
          });
          attendanceCount++;
        }
      }
    }
  }
}

console.log(`   ✓ ${attendanceCount} attendance records`);

// 8. EXAM TEMPLATES
console.log('\n📝 Creating Exam Templates...');
const examTemplates = [
  {
    name: 'Unit Test',
    description: 'Monthly unit test',
    type: 'unit_test',
    subjects: ['Mathematics', 'Science', 'English'],
    totalMarks: 25,
    passingMarks: 10
  },
  {
    name: 'Mid-Term Examination',
    description: 'Half-yearly examination',
    type: 'mid_term',
    subjects: ['Mathematics', 'Science', 'English', 'Hindi', 'Social Studies', 'Computer Science'],
    totalMarks: 80,
    passingMarks: 33
  }
];

for (const template of examTemplates) {
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
  
  await dataStore.addExamTemplate(examTemplate);
  console.log(`   ✓ ${template.name}`);
}

console.log('\n' + '='.repeat(60));
console.log('✅ DEMO DATA LOADED SUCCESSFULLY!');
console.log('='.repeat(60));

console.log('\n📊 Summary:');
console.log(`   Schools: 1`);
console.log(`   Admin: 1`);
console.log(`   Teachers: ${teachers.length} (${teachers.filter(t => t.status === 'approved').length} approved, ${teachers.filter(t => t.status === 'pending').length} pending)`);
console.log(`   Classes: ${classes.length}`);
console.log(`   Subjects: ${subjects.length}`);
console.log(`   Students: ${students.length}`);
console.log(`   Attendance Records: ${attendanceCount}`);
console.log(`   Exam Templates: ${examTemplates.length}`);

console.log('\n🔐 Login: admin@greenwood.edu / demo123\n');

process.exit(0);
