// Show existing test data in the database
import dataStore from './storage/dataStore.js';

console.log('\n📊 Current Database Contents\n');
console.log('='.repeat(60));

const schools = dataStore.getSchools();
const users = dataStore.getUsers();
const classes = dataStore.getClasses();
const subjects = dataStore.getSubjects();
const students = dataStore.getStudents();
const attendance = dataStore.getAttendance();

console.log(`\n🏫 Schools: ${schools.length}`);
schools.forEach(school => {
  console.log(`   - ${school.name} (${school.city}, ${school.state})`);
});

console.log(`\n👤 Users: ${users.length}`);
const admins = users.filter(u => u.role === 'admin');
const teachers = users.filter(u => u.role === 'teacher');
console.log(`   Admins: ${admins.length}`);
admins.forEach(admin => {
  console.log(`     - ${admin.fullName} (${admin.email})`);
});
console.log(`   Teachers: ${teachers.length}`);
teachers.forEach(teacher => {
  console.log(`     - ${teacher.fullName} (${teacher.email})`);
});

console.log(`\n🏫 Classes: ${classes.length}`);
classes.forEach(classData => {
  const teacher = users.find(u => u.id === classData.teacherId);
  const classStudents = students.filter(s => s.classId === classData.id);
  console.log(`   - ${classData.name} (${classData.attendanceMode}) - ${teacher?.fullName || 'No teacher'} - ${classStudents.length} students`);
});

console.log(`\n📖 Subjects: ${subjects.length}`);
subjects.forEach(subject => {
  const classData = classes.find(c => c.id === subject.classId);
  const teacher = users.find(u => u.id === subject.teacherId);
  console.log(`   - ${subject.name} (${classData?.name}) - ${teacher?.fullName || 'No teacher'}`);
});

console.log(`\n👨‍🎓 Students: ${students.length}`);
classes.forEach(classData => {
  const classStudents = students.filter(s => s.classId === classData.id);
  if (classStudents.length > 0) {
    console.log(`   ${classData.name}:`);
    classStudents.forEach(student => {
      console.log(`     - ${student.name} (${student.enrollmentNo})`);
    });
  }
});

console.log(`\n📋 Attendance Records: ${attendance.length}`);

console.log('\n' + '='.repeat(60));

if (schools.length === 0) {
  console.log('\n💡 Database is empty. Run: node seed-test-data.js');
} else {
  console.log('\n✅ Database has data. You can:');
  console.log('   1. Start backend: npm start');
  console.log('   2. Login with any teacher email and password: admin123');
  console.log('   3. Test attendance marking');
  console.log('\n💡 To reset database:');
  console.log('   1. Stop backend server');
  console.log('   2. Delete: backend/storage/education_assistant.db');
  console.log('   3. Run: node seed-test-data.js');
}

console.log('');
