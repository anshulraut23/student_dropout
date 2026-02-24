// Check what data was loaded into Supabase
import dotenv from 'dotenv';
import dataStore from './storage/dataStore.js';

dotenv.config();

console.log('\n📊 Checking Loaded Data...\n');

try {
  const schools = await dataStore.getSchools();
  console.log(`Schools: ${schools.length}`);
  
  const users = await dataStore.getUsers();
  console.log(`Users: ${users.length}`);
  console.log(`  - Admins: ${users.filter(u => u.role === 'admin').length}`);
  console.log(`  - Teachers: ${users.filter(u => u.role === 'teacher').length}`);
  console.log(`    - Approved: ${users.filter(u => u.role === 'teacher' && u.status === 'approved').length}`);
  console.log(`    - Pending: ${users.filter(u => u.role === 'teacher' && u.status === 'pending').length}`);
  
  const classes = await dataStore.getClasses();
  console.log(`Classes: ${classes.length}`);
  
  const students = await dataStore.getStudents();
  console.log(`Students: ${students.length}`);
  
  const subjects = await dataStore.getSubjects();
  console.log(`Subjects: ${subjects.length}`);
  
  const attendance = await dataStore.getAttendance();
  console.log(`Attendance Records: ${attendance.length}`);
  
  const templates = await dataStore.getExamTemplates();
  console.log(`Exam Templates: ${templates.length}`);
  
  console.log('\n✅ Data check complete!\n');
  
  process.exit(0);
} catch (error) {
  console.error('❌ Error checking data:', error.message);
  process.exit(1);
}
