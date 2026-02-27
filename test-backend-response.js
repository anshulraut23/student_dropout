/**
 * Test Backend Response - Verify Missing Data is Returned
 */

import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

async function testBackendResponse() {
  console.log('\n' + '='.repeat(80));
  console.log('🧪 TESTING BACKEND RESPONSE FOR INSUFFICIENT DATA');
  console.log('='.repeat(80) + '\n');

  try {
    // Login as admin
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
    const students = studentsResponse.data;
    console.log(`   ✅ Found ${students.length} students\n`);

    if (students.length === 0) {
      console.log('   ⚠️  No students found. Please add a student first.\n');
      process.exit(1);
    }

    // Test prediction for first student
    const student = students[0];
    console.log(`3️⃣  Testing prediction for: ${student.name}`);
    console.log(`   Student ID: ${student.id}\n`);

    try {
      const predictionResponse = await axios.get(
        `${API_URL}/ml/risk/student/${student.id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log('   ✅ Prediction successful!');
      console.log('   Risk Level:', predictionResponse.data.prediction.risk_level);
      console.log('   Risk Score:', predictionResponse.data.prediction.risk_score);
      console.log('');
      
    } catch (error) {
      if (error.response?.status === 400) {
        console.log('   ℹ️  Insufficient data (expected for new students)\n');
        
        const errorData = error.response.data;
        console.log('📊 ERROR RESPONSE STRUCTURE:');
        console.log('='.repeat(80));
        console.log(JSON.stringify(errorData, null, 2));
        console.log('='.repeat(80) + '\n');

        // Check if missing data is present
        if (errorData.missing) {
          console.log('✅ BACKEND IS RETURNING MISSING DATA:');
          console.log(`   Current Days: ${errorData.missing.current_days}`);
          console.log(`   Current Exams: ${errorData.missing.current_exams}`);
          console.log(`   Days Needed: ${errorData.missing.days_needed}`);
          console.log(`   Exams Needed: ${errorData.missing.exams_needed}`);
          console.log('\n✅ Backend code is working correctly!');
          console.log('   Frontend should show smart messages.\n');
        } else {
          console.log('❌ MISSING DATA NOT FOUND IN RESPONSE!');
          console.log('   This means backend was NOT restarted after code changes.');
          console.log('\n🔧 FIX: Restart the backend:');
          console.log('   1. Stop backend (Ctrl+C)');
          console.log('   2. cd backend');
          console.log('   3. npm start\n');
        }
      } else {
        console.log('   ❌ Error:', error.message);
      }
    }

    console.log('='.repeat(80));
    console.log('TEST COMPLETE');
    console.log('='.repeat(80) + '\n');

    process.exit(0);
  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    if (error.response) {
      console.error('Response:', error.response.data);
    }
    process.exit(1);
  }
}

testBackendResponse();
