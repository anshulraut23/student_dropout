/**
 * Debug Attendance Mismatch
 * Compare what the attendance API returns vs what the feature extractor sees
 */

import axios from 'axios';
import pg from 'pg';
const { Pool } = pg;

const API_URL = 'http://localhost:5000/api';

// Database connection (from backend/.env)
const pool = new Pool({
  host: 'localhost',
  port: 5432,
  database: 'student_dropout',
  user: 'postgres',
  password: 'postgres'
});

async function debugAttendanceMismatch() {
  console.log('\n' + '='.repeat(80));
  console.log('🔍 DEBUGGING ATTENDANCE MISMATCH');
  console.log('='.repeat(80) + '\n');

  try {
    // Login
    console.log('1️⃣  Logging in...');
    const loginResponse = await axios.post(`${API_URL}/auth/login`, {
      email: 'admin@demo.com',
      password: 'admin123'
    });
    const token = loginResponse.data.token;
    console.log('   ✅ Login successful\n');

    // Get students
    console.log('2️⃣  Fetching students...');
    const studentsResponse = await axios.get(`${API_URL}/students`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    let students = studentsResponse.data;
    if (students.students) students = students.students;
    if (!Array.isArray(students)) students = [];
    
    console.log(`   ✅ Found ${students.length} students\n`);

    if (students.length === 0) {
      console.log('   ⚠️  No students found.\n');
      process.exit(1);
    }

    // Pick first student
    const student = students[0];
    console.log(`3️⃣  Testing student: ${student.name}`);
    console.log(`   Student ID: ${student.id}\n`);

    // Test 1: Get attendance via API
    console.log('📊 TEST 1: Attendance API');
    console.log('-'.repeat(80));
    try {
      const attendanceResponse = await axios.get(
        `${API_URL}/attendance/student/${student.id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      const data = attendanceResponse.data;
      console.log(`   Success: ${data.success}`);
      console.log(`   Total Days: ${data.statistics?.totalDays || 0}`);
      console.log(`   Present: ${data.statistics?.present || 0}`);
      console.log(`   Absent: ${data.statistics?.absent || 0}`);
      console.log(`   Records: ${data.records?.length || 0}`);
      console.log('');
    } catch (error) {
      console.log(`   ❌ Error: ${error.message}`);
      console.log('');
    }

    // Test 2: Direct database query (same as feature extractor)
    console.log('📊 TEST 2: Direct Database Query (Feature Extractor Logic)');
    console.log('-'.repeat(80));
    const query = `
      SELECT 
        COUNT(*) FILTER (WHERE status IS NOT NULL) as days_tracked,
        COUNT(*) FILTER (WHERE status = 'present') as days_present,
        COUNT(*) FILTER (WHERE status = 'absent') as days_absent
      FROM attendance
      WHERE student_id = $1 
        AND status IS NOT NULL
    `;
    
    const result = await pool.query(query, [student.id]);
    const row = result.rows[0];
    
    console.log(`   Days Tracked: ${row.days_tracked}`);
    console.log(`   Days Present: ${row.days_present}`);
    console.log(`   Days Absent: ${row.days_absent}`);
    console.log('');

    // Test 3: Check what's actually in the attendance table
    console.log('📊 TEST 3: Raw Attendance Table Data');
    console.log('-'.repeat(80));
    const rawQuery = `
      SELECT id, student_id, date, status, created_at
      FROM attendance
      WHERE student_id = $1
      ORDER BY date DESC
      LIMIT 10
    `;
    
    const rawResult = await pool.query(rawQuery, [student.id]);
    console.log(`   Total Records: ${rawResult.rows.length}`);
    
    if (rawResult.rows.length > 0) {
      console.log('\n   Sample Records:');
      rawResult.rows.forEach((record, idx) => {
        console.log(`   ${idx + 1}. Date: ${record.date}, Status: ${record.status}, ID: ${record.id.substring(0, 8)}...`);
      });
    } else {
      console.log('   ⚠️  No records found in attendance table!');
    }
    console.log('');

    // Test 4: Check if student_id format matches
    console.log('📊 TEST 4: Student ID Format Check');
    console.log('-'.repeat(80));
    console.log(`   Student ID from API: ${student.id}`);
    console.log(`   Student ID type: ${typeof student.id}`);
    console.log(`   Student ID length: ${student.id.length}`);
    
    // Check if there are ANY attendance records
    const anyRecordsQuery = `SELECT COUNT(*) as total FROM attendance`;
    const anyRecordsResult = await pool.query(anyRecordsQuery);
    console.log(`   Total attendance records in DB: ${anyRecordsResult.rows[0].total}`);
    
    // Check unique student IDs in attendance table
    const uniqueStudentsQuery = `SELECT DISTINCT student_id FROM attendance LIMIT 5`;
    const uniqueStudentsResult = await pool.query(uniqueStudentsQuery);
    console.log(`   Unique student IDs in attendance table:`);
    uniqueStudentsResult.rows.forEach((row, idx) => {
        console.log(`   ${idx + 1}. ${row.student_id}`);
    });
    console.log('');

    // Summary
    console.log('='.repeat(80));
    console.log('📋 SUMMARY');
    console.log('='.repeat(80));
    
    const apiDays = 0; // We'll need to capture this from Test 1
    const dbDays = parseInt(row.days_tracked) || 0;
    
    if (dbDays === 0) {
      console.log('❌ ISSUE: No attendance records found in database for this student');
      console.log('   Possible causes:');
      console.log('   1. Attendance was not saved properly');
      console.log('   2. Student ID mismatch between systems');
      console.log('   3. Attendance records are for a different student');
    } else if (dbDays > 0) {
      console.log(`✅ Database has ${dbDays} days of attendance`);
      console.log('   Feature extractor should be finding this data');
      console.log('   If risk prediction shows 0, backend needs to be restarted');
    }
    console.log('');
    console.log('='.repeat(80));
    console.log('');

    await pool.end();
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    console.error('Stack:', error.stack);
    await pool.end();
    process.exit(1);
  }
}

debugAttendanceMismatch();
