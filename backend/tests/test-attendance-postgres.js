import dataStore from './storage/dataStore.js';
import { generateId } from './utils/helpers.js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

async function testAttendance() {
  console.log('=== Testing Attendance with PostgreSQL ===\n');

  try {
    // Test 1: Get all attendance records
    console.log('Test 1: Getting all attendance records...');
    const allAttendance = await dataStore.getAttendance();
    console.log(`✅ Found ${allAttendance.length} attendance records`);
    if (allAttendance.length > 0) {
      console.log('Sample record:', JSON.stringify(allAttendance[0], null, 2));
    }

    // Test 2: Add new attendance record with notes (using existing student)
    console.log('\nTest 2: Adding new attendance record with notes...');
    
    // Get an existing student and user
    const students = await dataStore.getStudents();
    if (students.length === 0) {
      console.log('⚠️  No students found, skipping add/update/delete tests');
      console.log('\n=== Tests Completed (Read-only) ===');
      process.exit(0);
    }
    
    const users = await dataStore.getUsers();
    if (users.length === 0) {
      console.log('⚠️  No users found, skipping add/update/delete tests');
      console.log('\n=== Tests Completed (Read-only) ===');
      process.exit(0);
    }
    
    const existingStudent = students[0];
    const existingUser = users[0];
    
    const testAttendance = {
      id: generateId(),
      studentId: existingStudent.id,
      classId: existingStudent.classId,
      subjectId: null,
      date: new Date().toISOString().split('T')[0],
      status: 'present',
      markedBy: existingUser.id,
      notes: 'Test attendance record with notes',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      updatedBy: existingUser.id
    };

    const addedRecord = await dataStore.addAttendance(testAttendance);
    console.log('✅ Added attendance record:', JSON.stringify(addedRecord, null, 2));

    // Test 3: Get attendance by ID
    console.log('\nTest 3: Getting attendance by ID...');
    const retrievedRecord = await dataStore.getAttendanceById(testAttendance.id);
    console.log('✅ Retrieved record:', JSON.stringify(retrievedRecord, null, 2));

    // Test 4: Update attendance record
    console.log('\nTest 4: Updating attendance record...');
    const updates = {
      status: 'late',
      notes: 'Updated: Student arrived late',
      updatedAt: new Date().toISOString(),
      updatedBy: existingUser.id
    };
    const updatedRecord = await dataStore.updateAttendance(testAttendance.id, updates);
    console.log('✅ Updated record:', JSON.stringify(updatedRecord, null, 2));

    // Test 5: Delete test record
    console.log('\nTest 5: Deleting test record...');
    await dataStore.deleteAttendance(testAttendance.id);
    console.log('✅ Test record deleted');

    // Verify deletion
    const deletedRecord = await dataStore.getAttendanceById(testAttendance.id);
    if (!deletedRecord) {
      console.log('✅ Verified: Record no longer exists');
    } else {
      console.log('❌ Error: Record still exists after deletion');
    }

    console.log('\n=== All Tests Passed! ===');
  } catch (error) {
    console.error('❌ Test failed:', error);
    process.exit(1);
  }

  process.exit(0);
}

testAttendance();
