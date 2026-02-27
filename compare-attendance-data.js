/**
 * Compare Attendance Data
 * Compare what attendance API returns vs what risk prediction API returns
 */

import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

async function compareAttendanceData() {
  console.log('\n' + '='.repeat(80));
  console.log('🔍 COMPARING ATTENDANCE DATA');
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

    // Test 1: Get attendance via Attendance API
    console.log('📊 TEST 1: Attendance History API');
    console.log('-'.repeat(80));
    let attendanceDays = 0;
    try {
      const attendanceResponse = await axios.get(
        `${API_URL}/attendance/student/${student.id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      const data = attendanceResponse.data;
      attendanceDays = data.statistics?.totalDays || 0;
      
      console.log(`   ✅ Success: ${data.success}`);
      console.log(`   Total Days: ${attendanceDays}`);
      console.log(`   Present: ${data.statistics?.present || 0}`);
      console.log(`   Absent: ${data.statistics?.absent || 0}`);
      console.log(`   Records: ${data.records?.length || 0}`);
      
      if (data.records && data.records.length > 0) {
        console.log('\n   Sample Records (first 3):');
        data.records.slice(0, 3).forEach((record, idx) => {
          console.log(`   ${idx + 1}. Date: ${record.date}, Status: ${record.status}`);
        });
      }
      console.log('');
    } catch (error) {
      console.log(`   ❌ Error: ${error.message}`);
      if (error.response) {
        console.log(`   Response: ${JSON.stringify(error.response.data)}`);
      }
      console.log('');
    }

    // Test 2: Get risk prediction (which uses feature extractor)
    console.log('📊 TEST 2: Risk Prediction API (Feature Extractor)');
    console.log('-'.repeat(80));
    let riskDays = 0;
    let riskExams = 0;
    try {
      const riskResponse = await axios.get(
        `${API_URL}/ml/risk/student/${student.id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      console.log('   ✅ Prediction successful!');
      console.log(`   Risk Level: ${riskResponse.data.prediction.risk_level}`);
      console.log(`   Risk Score: ${(riskResponse.data.prediction.risk_score * 100).toFixed(1)}%`);
      console.log('');
    } catch (error) {
      if (error.response?.status === 400 && error.response?.data?.missing) {
        const missing = error.response.data.missing;
        riskDays = missing.current_days || 0;
        riskExams = missing.current_exams || 0;
        
        console.log('   ℹ️  Insufficient data (expected)');
        console.log(`   Days Found: ${riskDays}`);
        console.log(`   Exams Found: ${riskExams}`);
        console.log(`   Days Needed: ${missing.days_needed || 0}`);
        console.log(`   Exams Needed: ${missing.exams_needed || 0}`);
        
        if (error.response.data.features) {
          console.log('\n   Feature Extractor Details:');
          console.log(`   - days_tracked: ${error.response.data.features.days_tracked}`);
          console.log(`   - days_present: ${error.response.data.features.days_present}`);
          console.log(`   - days_absent: ${error.response.data.features.days_absent}`);
          console.log(`   - exams_completed: ${error.response.data.features.exams_completed}`);
        }
        console.log('');
      } else {
        console.log(`   ❌ Error: ${error.message}`);
        if (error.response) {
          console.log(`   Response: ${JSON.stringify(error.response.data).substring(0, 200)}`);
        }
        console.log('');
      }
    }

    // Comparison
    console.log('='.repeat(80));
    console.log('📋 COMPARISON RESULTS');
    console.log('='.repeat(80));
    console.log(`   Attendance API shows: ${attendanceDays} days`);
    console.log(`   Risk Prediction shows: ${riskDays} days`);
    console.log('');

    if (attendanceDays === riskDays) {
      console.log('✅ MATCH! Both systems see the same data.');
      console.log('   The system is working correctly.');
    } else if (attendanceDays > 0 && riskDays === 0) {
      console.log('❌ MISMATCH! Attendance API has data but Risk Prediction sees 0.');
      console.log('');
      console.log('   Possible causes:');
      console.log('   1. Backend was not restarted after code changes');
      console.log('   2. Feature extractor is querying wrong table/column');
      console.log('   3. Student ID format mismatch');
      console.log('');
      console.log('   Solutions:');
      console.log('   1. Restart backend: cd backend && npm start');
      console.log('   2. Check backend console for SQL errors');
      console.log('   3. Verify student ID format matches in both APIs');
    } else if (attendanceDays === 0 && riskDays === 0) {
      console.log('⚠️  Both systems show 0 days.');
      console.log('   This means attendance was not saved to the database.');
      console.log('');
      console.log('   Solutions:');
      console.log('   1. Mark attendance for this student');
      console.log('   2. Check browser console for save errors');
      console.log('   3. Verify backend is receiving attendance data');
    } else {
      console.log(`⚠️  Different values: ${attendanceDays} vs ${riskDays}`);
      console.log('   This suggests a data synchronization issue.');
    }
    console.log('');
    console.log('='.repeat(80));
    console.log('');

    process.exit(0);
  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    if (error.response) {
      console.error('Response:', error.response.data);
    }
    process.exit(1);
  }
}

compareAttendanceData();
