// Add Test Data to Existing Database
// Creates: 4 teachers, 4 classes (2 daily, 2 subject-wise), subjects, 20 students (5 per class)
// Uses existing school

import dataStore from './storage/dataStore.js';
import bcrypt from 'bcryptjs';

console.log('\n🌱 Adding Test Data to Database...\n');

// Get existing school (use first one)
const schools = dataStore.getSchools();
if (schools.length === 0) {
  console.log('❌ No school found in database!');
  console.log('   Please create a school first or delete the database and run seed-test-data.js');
  process.exit(1);
}

const school = schools[0];
console.log(`✅ Using school: ${school.name}\n`);

// Helper to generate IDs
const generateId = (prefix) => `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

// 1. Create 4 Teachers
console.log('👨‍🏫 Creating 4 teachers...');
const teachers = [];
const teacherNames = [
  { name: 'Rajesh Kumar', email: `rajesh.${Date.now()}@sunrise.edu` },
  { name: 'Priya Sharma', email: `priya.${Date.now()}@sunrise.edu` },
  { name: 'Amit Patel', email: `amit.${Date.now()}@sunrise.edu` },
  { name: 'Sneha Desai', email: `sneha.${Date.now()}@sunrise.edu` }
];

const hashedPassword = await bcrypt.hash('admin123', 10);

for (const teacherData of teacherNames) {
  const teacher = {
    id: generateId('user'),
    email: teacherData.email,
    password: hashedPassword,
    fullName: teacherData.name,
    role: 'teacher',
    schoolId: school.id,
    status: 'active',
    assignedClasses: [],
    createdAt: new Date().toISOString()
  };
  dataStore.addUser(teacher);
  teachers.push(teacher);
  console.log(`✅ ${teacher.fullName} (${teacher.email} / admin123)`);
}

// 2. Create 4 Classes (2 daily, 2 subject-wise)
console.log('\n🏫 Creating 4 classes...');
const classes = [];

// Class 1: Grade 8A - Daily Attendance
const class1 = {
  id: generateId('class'),
  schoolId: school.id,
  name: 'Class 8A',
  grade: '8',
  section: 'A',
  academicYear: '2025-2026',
  teacherId: teachers[0].id,
  attendanceMode: 'daily',
  status: 'active',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
};
dataStore.addClass(class1);
classes.push(class1);
console.log(`✅ ${class1.name} - Daily Attendance - Teacher: ${teachers[0].fullName}`);

// Class 2: Grade 8B - Subject-wise Attendance
const class2 = {
  id: generateId('class'),
  schoolId: school.id,
  name: 'Class 8B',
  grade: '8',
  section: 'B',
  academicYear: '2025-2026',
  teacherId: teachers[1].id,
  attendanceMode: 'subject-wise',
  status: 'active',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
};
dataStore.addClass(class2);
classes.push(class2);
console.log(`✅ ${class2.name} - Subject-wise Attendance - Teacher: ${teachers[1].fullName}`);

// Class 3: Grade 9A - Daily Attendance
const class3 = {
  id: generateId('class'),
  schoolId: school.id,
  name: 'Class 9A',
  grade: '9',
  section: 'A',
  academicYear: '2025-2026',
  teacherId: teachers[2].id,
  attendanceMode: 'daily',
  status: 'active',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
};
dataStore.addClass(class3);
classes.push(class3);
console.log(`✅ ${class3.name} - Daily Attendance - Teacher: ${teachers[2].fullName}`);

// Class 4: Grade 9B - Subject-wise Attendance
const class4 = {
  id: generateId('class'),
  schoolId: school.id,
  name: 'Class 9B',
  grade: '9',
  section: 'B',
  academicYear: '2025-2026',
  teacherId: teachers[3].id,
  attendanceMode: 'subject-wise',
  status: 'active',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
};
dataStore.addClass(class4);
classes.push(class4);
console.log(`✅ ${class4.name} - Subject-wise Attendance - Teacher: ${teachers[3].fullName}`);

// Update teachers with assigned classes
dataStore.updateUser(teachers[0].id, { assignedClasses: [{ classId: class1.id, role: 'incharge' }] });
dataStore.updateUser(teachers[1].id, { assignedClasses: [{ classId: class2.id, role: 'incharge' }] });
dataStore.updateUser(teachers[2].id, { assignedClasses: [{ classId: class3.id, role: 'incharge' }] });
dataStore.updateUser(teachers[3].id, { assignedClasses: [{ classId: class4.id, role: 'incharge' }] });

// 3. Create Subjects for Subject-wise Classes
console.log('\n📖 Creating subjects for subject-wise classes...');
const subjects = [];

// Subjects for Class 8B (subject-wise)
const class8BSubjects = ['Mathematics', 'Science', 'English', 'Hindi', 'Social Studies'];
for (let i = 0; i < class8BSubjects.length; i++) {
  const subject = {
    id: generateId('subject'),
    schoolId: school.id,
    classId: class2.id,
    name: class8BSubjects[i],
    teacherId: i < 2 ? teachers[1].id : teachers[0].id,
    status: 'active',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  dataStore.addSubject(subject);
  subjects.push(subject);
  console.log(`✅ ${class2.name} - ${subject.name} (Teacher: ${i < 2 ? teachers[1].fullName : teachers[0].fullName})`);
}

// Subjects for Class 9B (subject-wise)
const class9BSubjects = ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'English'];
for (let i = 0; i < class9BSubjects.length; i++) {
  const subject = {
    id: generateId('subject'),
    schoolId: school.id,
    classId: class4.id,
    name: class9BSubjects[i],
    teacherId: i < 3 ? teachers[3].id : teachers[2].id,
    status: 'active',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  dataStore.addSubject(subject);
  subjects.push(subject);
  console.log(`✅ ${class4.name} - ${subject.name} (Teacher: ${i < 3 ? teachers[3].fullName : teachers[2].fullName})`);
}

// Update teachers with subject assignments
const teacher0Subjects = subjects.filter(s => s.teacherId === teachers[0].id).map(s => ({ classId: s.classId, subjectId: s.id, role: 'subject' }));
const teacher2Subjects = subjects.filter(s => s.teacherId === teachers[2].id).map(s => ({ classId: s.classId, subjectId: s.id, role: 'subject' }));

dataStore.updateUser(teachers[0].id, { 
  assignedClasses: [
    { classId: class1.id, role: 'incharge' },
    ...teacher0Subjects
  ] 
});

dataStore.updateUser(teachers[2].id, { 
  assignedClasses: [
    { classId: class3.id, role: 'incharge' },
    ...teacher2Subjects
  ] 
});

// 4. Create 5 Students per Class (20 total)
console.log('\n👨‍🎓 Creating 5 students per class (20 total)...');
const students = [];

const studentFirstNames = ['Aarav', 'Vivaan', 'Aditya', 'Arjun', 'Sai', 'Diya', 'Ananya', 'Isha', 'Kavya', 'Riya'];
const studentLastNames = ['Sharma', 'Patel', 'Kumar', 'Singh', 'Reddy', 'Gupta', 'Verma', 'Joshi', 'Mehta', 'Nair'];

let enrollmentCounter = 1001;

for (const classData of classes) {
  console.log(`\n  Creating students for ${classData.name}:`);
  for (let i = 0; i < 5; i++) {
    const firstName = studentFirstNames[Math.floor(Math.random() * studentFirstNames.length)];
    const lastName = studentLastNames[Math.floor(Math.random() * studentLastNames.length)];
    const fullName = `${firstName} ${lastName}`;
    
    const student = {
      id: generateId('student'),
      classId: classData.id,
      name: fullName,
      enrollmentNo: `ENR${enrollmentCounter++}`,
      dateOfBirth: `200${8 + Math.floor(Math.random() * 3)}-${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`,
      gender: Math.random() > 0.5 ? 'Male' : 'Female',
      contact: `98${Math.floor(10000000 + Math.random() * 90000000)}`,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@student.sunrise.edu`,
      address: `${Math.floor(Math.random() * 500) + 1}, Street ${Math.floor(Math.random() * 50) + 1}, Mumbai`,
      parentName: `${lastName} Parent`,
      parentContact: `97${Math.floor(10000000 + Math.random() * 90000000)}`,
      parentEmail: `parent.${lastName.toLowerCase()}@gmail.com`,
      status: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    dataStore.addStudent(student);
    students.push(student);
    console.log(`  ✅ ${student.name} (${student.enrollmentNo})`);
  }
}

// Summary
console.log('\n' + '='.repeat(60));
console.log('✅ TEST DATA ADDED SUCCESSFULLY!');
console.log('='.repeat(60));
console.log('\n📊 Summary:');
console.log(`   🏫 School: ${school.name}`);
console.log(`   👨‍🏫 Teachers Added: ${teachers.length}`);
console.log(`   🏫 Classes Added: ${classes.length} (2 daily, 2 subject-wise)`);
console.log(`   📖 Subjects Added: ${subjects.length}`);
console.log(`   👨‍🎓 Students Added: ${students.length} (5 per class)`);

console.log('\n📋 Teacher Login Credentials (password: admin123):');
teachers.forEach((teacher, index) => {
  const classData = classes[index];
  console.log(`   ${teacher.fullName}`);
  console.log(`     Email: ${teacher.email}`);
  console.log(`     Class: ${classData.name} (${classData.attendanceMode})`);
});

console.log('\n📚 Class Details:');
classes.forEach((classData, index) => {
  const teacher = teachers[index];
  const classStudents = students.filter(s => s.classId === classData.id);
  const classSubjects = subjects.filter(s => s.classId === classData.id);
  
  console.log(`\n   ${classData.name}:`);
  console.log(`     - Attendance Mode: ${classData.attendanceMode}`);
  console.log(`     - Class Teacher: ${teacher.fullName}`);
  console.log(`     - Students: ${classStudents.length}`);
  if (classSubjects.length > 0) {
    console.log(`     - Subjects: ${classSubjects.map(s => s.name).join(', ')}`);
    console.log(`     - Subject Teachers:`);
    classSubjects.forEach(sub => {
      const subTeacher = teachers.find(t => t.id === sub.teacherId);
      console.log(`       * ${sub.name}: ${subTeacher.fullName}`);
    });
  }
});

console.log('\n🎯 Next Steps:');
console.log('   1. Start the backend server: npm start');
console.log('   2. Login with any teacher credentials above');
console.log('   3. Test attendance marking:');
console.log('      - Daily classes (8A, 9A): Mark attendance without selecting subject');
console.log('      - Subject-wise classes (8B, 9B): Select subject before marking');

console.log('\n💡 Testing Tips:');
console.log('   - Teachers see classes where they are incharge or subject teacher');
console.log('   - Rajesh Kumar teaches Class 8A (incharge) + subjects in 8B');
console.log('   - Priya Sharma teaches Class 8B (incharge)');
console.log('   - Amit Patel teaches Class 9A (incharge) + subjects in 9B');
console.log('   - Sneha Desai teaches Class 9B (incharge)');
console.log('   - Data persists in: backend/storage/education_assistant.db\n');
