// Clear All Data from Database
// This script clears all data from the in-memory store

import dataStore from './storage/dataStore.js';

console.log('\n🗑️  Clearing All Data from Database...\n');

// Get current data counts
const schools = dataStore.getSchools();
const users = dataStore.getUsers();
const classes = dataStore.getClasses();
const subjects = dataStore.getSubjects();
const students = dataStore.getStudents();
const attendance = dataStore.getAttendance();

console.log('📊 Current Data:');
console.log(`   Schools: ${schools.length}`);
console.log(`   Users: ${users.length}`);
console.log(`   Classes: ${classes.length}`);
console.log(`   Subjects: ${subjects.length}`);
console.log(`   Students: ${students.length}`);
console.log(`   Attendance Records: ${attendance.length}`);

// Clear all data
dataStore.schools = [];
dataStore.users = [];
dataStore.requests = [];
dataStore.classes = [];
dataStore.subjects = [];
dataStore.students = [];
dataStore.attendance = [];
dataStore.exams = [];
dataStore.examPeriods = [];
dataStore.examTemplates = [];
dataStore.marks = [];

console.log('\n✅ All data cleared successfully!');
console.log('\n💡 Note: Since you are using in-memory storage,');
console.log('   data will be cleared automatically when you restart the server.');
console.log('\n🚀 To start fresh:');
console.log('   1. Restart the backend server: npm start');
console.log('   2. Register a new school and admin');
console.log('   3. Start using the application\n');
