/**
 * Comprehensive Attendance System Testing Script
 * Tests all possible scenarios for attendance marking
 */

import dataStore from './storage/dataStore.js';
import * as attendanceService from './services/attendanceService.js';
import * as attendanceCalculator from './services/attendanceCalculator.js';

// ANSI color codes for better output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  magenta: '\x1b[35m'
};

let testsPassed = 0;
let testsFailed = 0;
const failedTests = [];

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function assert(condition, testName, errorMessage = '') {
  if (condition) {
    testsPassed++;
    log(`✓ ${testName}`, 'green');
    return true;
  } else {
    testsFailed++;
    failedTests.push({ test: testName, error: errorMessage });
    log(`✗ ${testName}`, 'red');
    if (errorMessage) {
      log(`  Error: ${errorMessage}`, 'red');
    }
    return false;
  }
}

function printSeparator() {
  log('\n' + '='.repeat(80), 'cyan');
}

function printTestSection(title) {
  printSeparator();
  log(`\n${title}\n`, 'magenta');
}

// Helper function to get test data
function getTestData() {
  const schools = dataStore.getSchools();
  const users = dataStore.getUsers();
  const classes = dataStore.getClasses();
  const subjects = dataStore.getSubjects();
  const students = dataStore.getStudents();

  const school = schools[0];
  const teacher = users.find(u => u.role === 'teacher');
  const dailyClass = classes.find(c => c.attendanceMode === 'daily');
  const subjectWiseClass = classes.find(c => c.attendanceMode === 'subject-wise' || c.attendanceMode === 'subject_wise');
  
  return {
    school,
    teacher,
    dailyClass,
    subjectWiseClass,
    classes,
    subjects,
    students
  };
}

// Step 1: Clear all attendance
function clearAllAttendance() {
  printTestSection('STEP 1: CLEARING ALL ATTENDANCE DATA');
  
  const attendanceBefore = dataStore.getAttendance();
  log(`Found ${attendanceBefore.length} attendance records`, 'yellow');
  
  // Clear all attendance
  attendanceBefore.forEach(record => {
    dataStore.deleteAttendance(record.id);
  });
  
  const attendanceAfter = dataStore.getAttendance();
  assert(
    attendanceAfter.length === 0,
    'All attendance records cleared',
    `Expected 0 records, found ${attendanceAfter.length}`
  );
  
  log(`Cleared ${attendanceBefore.length} attendance records`, 'green');
}

// Test Case 1: Mark attendance for daily class
async function testDailyAttendanceMarking() {
  printTestSection('TEST CASE 1: DAILY ATTENDANCE MARKING');
  
  const { teacher, dailyClass, students } = getTestData();
  
  if (!dailyClass) {
    log('⚠ No daily attendance class found, skipping test', 'yellow');
    return;
  }
  
  const classStudents = students.filter(s => s.classId === dailyClass.id);
  const date = '2026-02-20';
  
  log(`Testing with class: ${dailyClass.name}`, 'blue');
  log(`Students in class: ${classStudents.length}`, 'blue');
  
  // Test 1.1: Mark all students present
  const attendanceData = classStudents.map(s => ({
    studentId: s.id,
    status: 'present'
  }));
  
  const result = await attendanceService.markBulkAttendance({
    classId: dailyClass.id,
    subjectId: null,
    date: date,
    attendance: attendanceData
  }, teacher.id);
  
  assert(
    result.marked === classStudents.length,
    `1.1: Mark all students present (${classStudents.length} students)`,
    `Expected ${classStudents.length} marked, got ${result.marked}`
  );
  
  assert(
    result.failed === 0,
    '1.2: No failures when marking attendance',
    `Expected 0 failures, got ${result.failed}`
  );
  
  // Test 1.3: Verify attendance was saved
  const savedAttendance = dataStore.getAttendanceByDate(date, dailyClass.id, null);
  assert(
    savedAttendance.length === classStudents.length,
    `1.3: Attendance saved to database (${savedAttendance.length} records)`,
    `Expected ${classStudents.length} records, found ${savedAttendance.length}`
  );
  
  // Test 1.4: Verify all statuses are correct
  const allPresent = savedAttendance.every(a => a.status === 'present');
  assert(
    allPresent,
    '1.4: All students marked as present',
    'Some students have incorrect status'
  );
}

// Test Case 2: Update existing attendance
async function testAttendanceUpdate() {
  printTestSection('TEST CASE 2: UPDATE EXISTING ATTENDANCE');
  
  const { teacher, dailyClass, students } = getTestData();
  
  if (!dailyClass) {
    log('⚠ No daily attendance class found, skipping test', 'yellow');
    return;
  }
  
  const classStudents = students.filter(s => s.classId === dailyClass.id);
  const date = '2026-02-20';
  
  // Test 2.1: Update attendance (mark some absent)
  const updatedAttendance = classStudents.map((s, index) => ({
    studentId: s.id,
    status: index < 2 ? 'absent' : 'present' // First 2 absent, rest present
  }));
  
  const result = await attendanceService.markBulkAttendance({
    classId: dailyClass.id,
    subjectId: null,
    date: date,
    attendance: updatedAttendance
  }, teacher.id);
  
  assert(
    result.marked === classStudents.length,
    `2.1: Update existing attendance (${classStudents.length} students)`,
    `Expected ${classStudents.length} updated, got ${result.marked}`
  );
  
  // Test 2.2: Verify updates were applied
  const savedAttendance = dataStore.getAttendanceByDate(date, dailyClass.id, null);
  const absentCount = savedAttendance.filter(a => a.status === 'absent').length;
  const presentCount = savedAttendance.filter(a => a.status === 'present').length;
  
  assert(
    absentCount === 2,
    '2.2: Correct number of absent students (2)',
    `Expected 2 absent, found ${absentCount}`
  );
  
  assert(
    presentCount === classStudents.length - 2,
    `2.3: Correct number of present students (${classStudents.length - 2})`,
    `Expected ${classStudents.length - 2} present, found ${presentCount}`
  );
}

// Test Case 3: Subject-wise attendance
async function testSubjectWiseAttendance() {
  printTestSection('TEST CASE 3: SUBJECT-WISE ATTENDANCE');
  
  const { teacher, subjectWiseClass, subjects, students } = getTestData();
  
  if (!subjectWiseClass) {
    log('⚠ No subject-wise attendance class found, skipping test', 'yellow');
    return;
  }
  
  const classSubjects = subjects.filter(s => s.classId === subjectWiseClass.id);
  const classStudents = students.filter(s => s.classId === subjectWiseClass.id);
  
  if (classSubjects.length === 0) {
    log('⚠ No subjects found for subject-wise class, skipping test', 'yellow');
    return;
  }
  
  const subject1 = classSubjects[0];
  const subject2 = classSubjects[1] || classSubjects[0];
  const date = '2026-02-21';
  
  log(`Testing with class: ${subjectWiseClass.name}`, 'blue');
  log(`Subject 1: ${subject1.name}`, 'blue');
  log(`Subject 2: ${subject2.name}`, 'blue');
  
  // Test 3.1: Mark attendance for subject 1
  const attendance1 = classStudents.map(s => ({
    studentId: s.id,
    status: 'present'
  }));
  
  const result1 = await attendanceService.markBulkAttendance({
    classId: subjectWiseClass.id,
    subjectId: subject1.id,
    date: date,
    attendance: attendance1
  }, teacher.id);
  
  assert(
    result1.marked === classStudents.length,
    `3.1: Mark attendance for ${subject1.name} (${classStudents.length} students)`,
    `Expected ${classStudents.length} marked, got ${result1.marked}`
  );
  
  // Test 3.2: Mark attendance for subject 2 (different subject, same date)
  const attendance2 = classStudents.map((s, index) => ({
    studentId: s.id,
    status: index === 0 ? 'absent' : 'present' // First student absent
  }));
  
  const result2 = await attendanceService.markBulkAttendance({
    classId: subjectWiseClass.id,
    subjectId: subject2.id,
    date: date,
    attendance: attendance2
  }, teacher.id);
  
  assert(
    result2.marked === classStudents.length,
    `3.2: Mark attendance for ${subject2.name} (${classStudents.length} students)`,
    `Expected ${classStudents.length} marked, got ${result2.marked}`
  );
  
  // Test 3.3: Verify subject 1 attendance is separate from subject 2
  const subject1Attendance = dataStore.getAttendanceByDate(date, subjectWiseClass.id, subject1.id);
  const subject2Attendance = dataStore.getAttendanceByDate(date, subjectWiseClass.id, subject2.id);
  
  assert(
    subject1Attendance.length === classStudents.length,
    `3.3: Subject 1 has ${classStudents.length} attendance records`,
    `Expected ${classStudents.length}, found ${subject1Attendance.length}`
  );
  
  assert(
    subject2Attendance.length === classStudents.length,
    `3.4: Subject 2 has ${classStudents.length} attendance records`,
    `Expected ${classStudents.length}, found ${subject2Attendance.length}`
  );
  
  // Test 3.5: Verify subject 1 all present
  const subject1AllPresent = subject1Attendance.every(a => a.status === 'present');
  assert(
    subject1AllPresent,
    '3.5: Subject 1 - all students present',
    'Some students have incorrect status'
  );
  
  // Test 3.6: Verify subject 2 has one absent
  const subject2AbsentCount = subject2Attendance.filter(a => a.status === 'absent').length;
  assert(
    subject2AbsentCount === 1,
    '3.6: Subject 2 - one student absent',
    `Expected 1 absent, found ${subject2AbsentCount}`
  );
}

// Test Case 4: Multiple dates
async function testMultipleDates() {
  printTestSection('TEST CASE 4: MULTIPLE DATES');
  
  const { teacher, dailyClass, students } = getTestData();
  
  if (!dailyClass) {
    log('⚠ No daily attendance class found, skipping test', 'yellow');
    return;
  }
  
  const classStudents = students.filter(s => s.classId === dailyClass.id);
  const dates = ['2026-02-18', '2026-02-19', '2026-02-20'];
  
  // Test 4.1: Mark attendance for multiple dates
  for (let i = 0; i < dates.length; i++) {
    const attendance = classStudents.map((s, index) => ({
      studentId: s.id,
      status: index === i ? 'absent' : 'present' // Different student absent each day
    }));
    
    await attendanceService.markBulkAttendance({
      classId: dailyClass.id,
      subjectId: null,
      date: dates[i],
      attendance: attendance
    }, teacher.id);
  }
  
  // Test 4.2: Verify each date has separate records
  for (let i = 0; i < dates.length; i++) {
    const dateAttendance = dataStore.getAttendanceByDate(dates[i], dailyClass.id, null);
    assert(
      dateAttendance.length === classStudents.length,
      `4.${i + 1}: Date ${dates[i]} has ${classStudents.length} records`,
      `Expected ${classStudents.length}, found ${dateAttendance.length}`
    );
  }
}

// Test Case 5: Attendance statistics
async function testAttendanceStatistics() {
  printTestSection('TEST CASE 5: ATTENDANCE STATISTICS');
  
  const { dailyClass, students } = getTestData();
  
  if (!dailyClass) {
    log('⚠ No daily attendance class found, skipping test', 'yellow');
    return;
  }
  
  const classStudents = students.filter(s => s.classId === dailyClass.id);
  
  // Test 5.1: Get statistics for a date range
  const stats = attendanceCalculator.getAttendanceStatistics(
    dailyClass.id,
    '2026-02-18',
    '2026-02-20',
    null
  );
  
  assert(
    stats.overall.totalStudents === classStudents.length,
    `5.1: Statistics show correct total students (${classStudents.length})`,
    `Expected ${classStudents.length}, got ${stats.overall.totalStudents}`
  );
  
  assert(
    stats.overall.totalRecords > 0,
    '5.2: Statistics show attendance records exist',
    `Expected > 0 records, got ${stats.overall.totalRecords}`
  );
  
  assert(
    stats.studentWise.length === classStudents.length,
    `5.3: Student-wise statistics for all students (${classStudents.length})`,
    `Expected ${classStudents.length}, got ${stats.studentWise.length}`
  );
  
  // Test 5.4: Verify percentage calculations
  const allHavePercentage = stats.studentWise.every(s => 
    typeof s.percentage === 'number' && s.percentage >= 0 && s.percentage <= 100
  );
  assert(
    allHavePercentage,
    '5.4: All students have valid attendance percentage (0-100)',
    'Some students have invalid percentage'
  );
}

// Test Case 6: Attendance for specific date
async function testAttendanceForDate() {
  printTestSection('TEST CASE 6: GET ATTENDANCE FOR SPECIFIC DATE');
  
  const { dailyClass } = getTestData();
  
  if (!dailyClass) {
    log('⚠ No daily attendance class found, skipping test', 'yellow');
    return;
  }
  
  const date = '2026-02-20';
  
  // Test 6.1: Get attendance for date
  const attendanceData = attendanceCalculator.getAttendanceForDate(
    dailyClass.id,
    date,
    null
  );
  
  assert(
    attendanceData.date === date,
    `6.1: Correct date returned (${date})`,
    `Expected ${date}, got ${attendanceData.date}`
  );
  
  assert(
    attendanceData.summary.marked > 0,
    '6.2: Summary shows marked attendance',
    `Expected > 0 marked, got ${attendanceData.summary.marked}`
  );
  
  assert(
    attendanceData.attendance.length > 0,
    '6.3: Attendance array contains records',
    `Expected > 0 records, got ${attendanceData.attendance.length}`
  );
  
  // Test 6.4: Verify summary counts match actual records
  const presentCount = attendanceData.attendance.filter(a => a.status === 'present').length;
  const absentCount = attendanceData.attendance.filter(a => a.status === 'absent').length;
  
  assert(
    attendanceData.summary.present === presentCount,
    `6.4: Summary present count matches (${presentCount})`,
    `Expected ${presentCount}, got ${attendanceData.summary.present}`
  );
  
  assert(
    attendanceData.summary.absent === absentCount,
    `6.5: Summary absent count matches (${absentCount})`,
    `Expected ${absentCount}, got ${attendanceData.summary.absent}`
  );
}

// Test Case 7: Edge cases
async function testEdgeCases() {
  printTestSection('TEST CASE 7: EDGE CASES');
  
  const { teacher, dailyClass, students } = getTestData();
  
  if (!dailyClass) {
    log('⚠ No daily attendance class found, skipping test', 'yellow');
    return;
  }
  
  const classStudents = students.filter(s => s.classId === dailyClass.id);
  
  // Test 7.1: Mark attendance with invalid status (should fail)
  try {
    await attendanceService.markSingleAttendance({
      studentId: classStudents[0].id,
      classId: dailyClass.id,
      subjectId: null,
      date: '2026-02-22',
      status: 'invalid_status'
    }, teacher.id);
    assert(false, '7.1: Invalid status should throw error', 'No error was thrown');
  } catch (error) {
    assert(true, '7.1: Invalid status throws error', '');
  }
  
  // Test 7.2: Mark attendance for non-existent student (should fail)
  try {
    await attendanceService.markSingleAttendance({
      studentId: 'non-existent-student',
      classId: dailyClass.id,
      subjectId: null,
      date: '2026-02-22',
      status: 'present'
    }, teacher.id);
    assert(false, '7.2: Non-existent student should throw error', 'No error was thrown');
  } catch (error) {
    assert(true, '7.2: Non-existent student throws error', '');
  }
  
  // Test 7.3: Mark attendance for future date (should fail)
  try {
    await attendanceService.markSingleAttendance({
      studentId: classStudents[0].id,
      classId: dailyClass.id,
      subjectId: null,
      date: '2027-12-31',
      status: 'present'
    }, teacher.id);
    assert(false, '7.3: Future date should throw error', 'No error was thrown');
  } catch (error) {
    assert(true, '7.3: Future date throws error', '');
  }
}

// Main test runner
async function runAllTests() {
  log('\n╔════════════════════════════════════════════════════════════════════════════╗', 'cyan');
  log('║         ATTENDANCE SYSTEM COMPREHENSIVE TEST SUITE                        ║', 'cyan');
  log('╚════════════════════════════════════════════════════════════════════════════╝\n', 'cyan');
  
  const startTime = Date.now();
  
  try {
    // Step 1: Clear all attendance
    clearAllAttendance();
    
    // Run all test cases
    await testDailyAttendanceMarking();
    await testAttendanceUpdate();
    await testSubjectWiseAttendance();
    await testMultipleDates();
    await testAttendanceStatistics();
    await testAttendanceForDate();
    await testEdgeCases();
    
    // Print summary
    printSeparator();
    log('\n📊 TEST SUMMARY\n', 'magenta');
    
    const totalTests = testsPassed + testsFailed;
    const passRate = totalTests > 0 ? ((testsPassed / totalTests) * 100).toFixed(1) : 0;
    
    log(`Total Tests: ${totalTests}`, 'blue');
    log(`Passed: ${testsPassed}`, 'green');
    log(`Failed: ${testsFailed}`, testsFailed > 0 ? 'red' : 'green');
    log(`Pass Rate: ${passRate}%`, passRate >= 90 ? 'green' : passRate >= 70 ? 'yellow' : 'red');
    
    const endTime = Date.now();
    const duration = ((endTime - startTime) / 1000).toFixed(2);
    log(`\nDuration: ${duration}s`, 'cyan');
    
    if (failedTests.length > 0) {
      log('\n❌ FAILED TESTS:', 'red');
      failedTests.forEach((test, index) => {
        log(`\n${index + 1}. ${test.test}`, 'red');
        if (test.error) {
          log(`   ${test.error}`, 'yellow');
        }
      });
    }
    
    printSeparator();
    
    if (testsFailed === 0) {
      log('\n🎉 ALL TESTS PASSED! 🎉\n', 'green');
    } else {
      log(`\n⚠️  ${testsFailed} TEST(S) FAILED\n`, 'red');
    }
    
  } catch (error) {
    log('\n❌ TEST SUITE ERROR:', 'red');
    log(error.message, 'red');
    console.error(error);
  }
}

// Run the tests
runAllTests().then(() => {
  process.exit(testsFailed > 0 ? 1 : 0);
}).catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
