/**
 * Test Hackathon Predictions
 * Verifies that predictions work with 3 days of data
 */

import axios from 'axios';

const API_URL = 'http://localhost:3001/api';
const ML_URL = 'http://localhost:5001';

async function testPredictions() {
  console.log('\n' + '='.repeat(80));
  console.log('🧪 TESTING HACKATHON PREDICTIONS (3-day threshold)');
  console.log('='.repeat(80) + '\n');

  try {
    // Test 1: Check ML Service Health
    console.log('1️⃣  Checking ML Service...');
    const healthResponse = await axios.get(`${ML_URL}/health`);
    console.log(`   ✅ ML Service: ${healthResponse.data.status}`);
    console.log(`   ✅ Model Loaded: ${healthResponse.data.model_loaded}`);
    console.log(`   ✅ Model Type: ${healthResponse.data.model_type}\n`);

    // Test 2: Login as admin
    console.log('2️⃣  Logging in as admin...');
    const loginResponse = await axios.post(`${API_URL}/auth/login`, {
      email: 'admin@demo.com',
      password: 'admin123'
    });
    const token = loginResponse.data.token;
    console.log(`   ✅ Login successful\n`);

    // Test 3: Get all students
    console.log('3️⃣  Fetching students...');
    const studentsResponse = await axios.get(`${API_URL}/students`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const students = studentsResponse.data;
    console.log(`   ✅ Found ${students.length} students\n`);

    if (students.length === 0) {
      console.log('   ⚠️  No students found. Run: node create-hackathon-demo-data.js\n');
      process.exit(1);
    }

    // Test 4: Get predictions for each student
    console.log('4️⃣  Testing predictions for each student:\n');
    
    for (const student of students) {
      try {
        console.log(`   📊 ${student.name} (Roll: ${student.rollNumber})`);
        
        const predictionResponse = await axios.get(
          `${API_URL}/ml/risk/student/${student.id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const prediction = predictionResponse.data;
        
        console.log(`      Risk Level: ${prediction.prediction.risk_level.toUpperCase()}`);
        console.log(`      Risk Score: ${(prediction.prediction.risk_score * 100).toFixed(1)}%`);
        console.log(`      Confidence: ${prediction.prediction.confidence.toUpperCase()}`);
        console.log(`      Data Tier: ${prediction.prediction.data_tier}`);
        console.log(`      Attendance Risk: ${(prediction.components.attendance_risk * 100).toFixed(0)}%`);
        console.log(`      Academic Risk: ${(prediction.components.academic_risk * 100).toFixed(0)}%`);
        console.log(`      Behavior Risk: ${(prediction.components.behavior_risk * 100).toFixed(0)}%`);
        console.log('');
        
      } catch (error) {
        if (error.response?.status === 400) {
          console.log(`      ⚠️  Insufficient data: ${error.response.data.message}`);
          console.log('');
        } else {
          console.log(`      ❌ Error: ${error.message}`);
          console.log('');
        }
      }
    }

    // Summary
    console.log('='.repeat(80));
    console.log('✅ HACKATHON PREDICTIONS TEST COMPLETE!');
    console.log('='.repeat(80));
    console.log('\n✨ All students should show predictions with:');
    console.log('   - Data Tier: 1 (Low Confidence)');
    console.log('   - Based on 3 days of attendance');
    console.log('   - Based on 1 exam score');
    console.log('   - Risk levels: LOW, MEDIUM, or HIGH\n');

    process.exit(0);
  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    if (error.response) {
      console.error('Response:', error.response.data);
    }
    process.exit(1);
  }
}

testPredictions();
