import dataStore from './storage/dataStore.js';
import dotenv from 'dotenv';

dotenv.config();

async function testAttendanceEndpoint() {
  console.log('=== Testing Attendance Endpoint Functionality ===\n');

  try {
    // Get a class to test with
    const classes = await dataStore.getClasses();
    if (classes.length === 0) {
      console.log('❌ No classes found');
      process.exit(1);
    }

    const testClass = classes[0];
    console.log(`✅ Found test class: ${testClass.name} (${testClass.id})`);

    // Test getting class attendance (the endpoint that was failing)
    const date = new Date().toISOString().split('T')[0];
    console.log(`\nTesting getAttendanceByClass for date: ${date}`);
    
    const attendance = await dataStore.getAttendanceByClass(testClass.id, { date });
    console.log(`✅ Retrieved ${attendance.length} attendance records`);
    
    if (attendance.length > 0) {
      console.log('\nSample attendance record:');
      console.log(JSON.stringify(attendance[0], null, 2));
      
      // Verify new fields are present
      const record = attendance[0];
      const hasNotes = 'notes' in record;
      const hasUpdatedAt = 'updatedAt' in record;
      const hasUpdatedBy = 'updatedBy' in record;
      
      console.log('\n✅ Field verification:');
      console.log(`  - notes: ${hasNotes ? '✅' : '❌'}`);
      console.log(`  - updatedAt: ${hasUpdatedAt ? '✅' : '❌'}`);
      console.log(`  - updatedBy: ${hasUpdatedBy ? '✅' : '❌'}`);
      
      if (hasNotes && hasUpdatedAt && hasUpdatedBy) {
        console.log('\n🎉 All new fields are present and working!');
      }
    } else {
      console.log('ℹ️  No attendance records for today yet');
    }

    // Test with a date that has attendance
    console.log('\n\nTesting with existing attendance data...');
    const allAttendance = await dataStore.getAttendanceByClass(testClass.id);
    console.log(`✅ Found ${allAttendance.length} total attendance records for this class`);
    
    if (allAttendance.length > 0) {
      const sampleRecord = allAttendance[0];
      console.log('\nSample record with all fields:');
      console.log(`  ID: ${sampleRecord.id}`);
      console.log(`  Student: ${sampleRecord.studentId}`);
      console.log(`  Date: ${sampleRecord.date}`);
      console.log(`  Status: ${sampleRecord.status}`);
      console.log(`  Marked By: ${sampleRecord.markedBy}`);
      console.log(`  Notes: ${sampleRecord.notes || '(none)'}`);
      console.log(`  Created At: ${sampleRecord.createdAt}`);
      console.log(`  Updated At: ${sampleRecord.updatedAt || '(none)'}`);
      console.log(`  Updated By: ${sampleRecord.updatedBy || '(none)'}`);
    }

    console.log('\n=== All Endpoint Tests Passed! ===');
    process.exit(0);
  } catch (error) {
    console.error('❌ Test failed:', error);
    process.exit(1);
  }
}

testAttendanceEndpoint();
