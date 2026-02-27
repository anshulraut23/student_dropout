/**
 * Fetch Student Data Manually
 * Student ID: 1772218928257-1foho4xch
 */

import axios from 'axios';

const API_URL = 'http://localhost:5000/api';
const STUDENT_ID = '1772218928257-1foho4xch';

async function fetchStudentData() {
  console.log('\n' + '='.repeat(80));
  console.log('🔍 FETCHING DATA FOR STUDENT: ' + STUDENT_ID);
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

    // Get student info
    console.log('2️⃣  Fetching student info...');
    try {
      const studentResponse = await axios.get(`${API_URL}/students/${STUDENT_ID}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('   ✅ Student found:');
      console.log(`   Name: ${studentResponse.data.name}`);
      console.log(`   Enrollment: ${studentResponse.data.enrollmentNo}`);
      console.log(`   Class: ${studentResponse.data.className || 'N/A'}`);
      console.log('');
    } catch (error) {
      console.log(`   ❌ Error: ${error.message}`);
      console.log('');
    }

    // Get attendance data
    console.log('3️⃣  Fetching attendance data...');
    try {
      const attendanceResponse = await axios.get(
        `${API_URL}/attendance/student/${STUDENT_ID}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      const data = attendanceResponse.data;
      console.log('   ✅ Attendance data retrieved:');
      console.log(`   Total Days: ${data.statistics?.totalDays || 0}`);
      console.log(`   Present: ${data.statistics?.present || 0}`);
      console.log(`   Absent: ${data.statistics?.absent || 0}`);
      console.log(`   Attendance Rate: ${data.statistics?.attendanceRate ? Math.round(data.statistics.attendanceRate) + '%' : '0%'}`);
      console.log(`   Records: ${data.records?.length || 0}`);
      
      if (data.records && data.records.length > 0) {
        console.log('\n   Recent Records (last 5):');
        data.records.slice(0, 5).forEach((record, idx) => {
          console.log(`   ${idx + 1}. ${record.date}: ${record.status}`);
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

    // Get marks data
    console.log('4️⃣  Fetching marks/exam data...');
    try {
      const marksResponse = await axios.get(
        `${API_URL}/marks/student/${STUDENT_ID}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      const data = marksResponse.data;
      console.log('   ✅ Marks data retrieved:');
      console.log(`   Total Exams: ${data.marks?.length || 0}`);
      
      if (data.marks && data.marks.length > 0) {
        console.log('\n   Exam Records:');
        data.marks.forEach((mark, idx) => {
          const percentage = mark.totalMarks > 0 
            ? Math.round((mark.marksObtained / mark.totalMarks) * 100)
            : 0;
          console.log(`   ${idx + 1}. ${mark.examName || 'Exam'}: ${mark.marksObtained}/${mark.totalMarks} (${percentage}%)`);
        });
      } else {
        console.log('   No exam records found');
      }
      console.log('');
    } catch (error) {
      console.log(`   ❌ Error: ${error.message}`);
      if (error.response) {
        console.log(`   Response: ${JSON.stringify(error.response.data)}`);
      }
      console.log('');
    }

    // Get risk prediction
    console.log('5️⃣  Fetching risk prediction...');
    try {
      const riskResponse = await axios.get(
        `${API_URL}/ml/risk/student/${STUDENT_ID}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      console.log('   ✅ Risk prediction successful!');
      console.log(`   Risk Level: ${riskResponse.data.prediction.risk_level}`);
      console.log(`   Risk Score: ${(riskResponse.data.prediction.risk_score * 100).toFixed(1)}%`);
      console.log(`   Confidence: ${riskResponse.data.prediction.confidence}`);
      console.log('');
    } catch (error) {
      if (error.response?.status === 400) {
        console.log('   ℹ️  Insufficient data for prediction');
        
        if (error.response.data.missing) {
          const missing = error.response.data.missing;
          console.log(`   Current Days: ${missing.current_days || 0}`);
          console.log(`   Current Exams: ${missing.current_exams || 0}`);
          console.log(`   Days Needed: ${missing.days_needed || 0}`);
          console.log(`   Exams Needed: ${missing.exams_needed || 0}`);
        }
        
        if (error.response.data.features) {
          console.log('\n   Feature Extractor Data:');
          console.log(`   - days_tracked: ${error.response.data.features.days_tracked}`);
          console.log(`   - days_present: ${error.response.data.features.days_present}`);
          console.log(`   - days_absent: ${error.response.data.features.days_absent}`);
          console.log(`   - exams_completed: ${error.response.data.features.exams_completed}`);
          console.log(`   - data_tier: ${error.response.data.features.data_tier}`);
        }
        console.log('');
      } else {
        console.log(`   ❌ Error: ${error.message}`);
        if (error.response) {
          console.log(`   Status: ${error.response.status}`);
          console.log(`   Response: ${JSON.stringify(error.response.data).substring(0, 200)}`);
        }
        console.log('');
      }
    }

    console.log('='.repeat(80));
    console.log('✅ DATA FETCH COMPLETE');
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

fetchStudentData();
