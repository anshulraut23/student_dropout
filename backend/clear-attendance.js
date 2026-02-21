/**
 * Clear All Attendance Records
 * Simple script to delete all attendance data from the database
 */

import dataStore from './storage/dataStore.js';

console.log('\n╔════════════════════════════════════════════════════════════════╗');
console.log('║         CLEAR ALL ATTENDANCE RECORDS                           ║');
console.log('╚════════════════════════════════════════════════════════════════╝\n');

// Get all attendance records
const attendanceRecords = dataStore.getAttendance();

console.log(`Found ${attendanceRecords.length} attendance records in database`);

if (attendanceRecords.length === 0) {
  console.log('\n✓ No attendance records to clear\n');
  process.exit(0);
}

// Delete all attendance records
let deleted = 0;
attendanceRecords.forEach(record => {
  try {
    dataStore.deleteAttendance(record.id);
    deleted++;
  } catch (error) {
    console.error(`Failed to delete record ${record.id}:`, error.message);
  }
});

// Verify deletion
const remainingRecords = dataStore.getAttendance();

console.log(`\n✓ Deleted ${deleted} attendance records`);
console.log(`✓ Remaining records: ${remainingRecords.length}`);

if (remainingRecords.length === 0) {
  console.log('\n✅ All attendance records cleared successfully!\n');
} else {
  console.log(`\n⚠️  Warning: ${remainingRecords.length} records could not be deleted\n`);
}
