/**
 * Test script to verify XAI (Explainable AI) response
 * Tests that backend returns features along with predictions
 */

import fetch from 'node-fetch';

const BACKEND_URL = 'http://localhost:5000';
const TEST_STUDENT_ID = '1772218928257-1foho4xch'; // Replace with actual student ID

async function testXAI() {
  console.log('🧪 Testing XAI Response...\n');
  
  try {
    // Login first
    console.log('1️⃣ Logging in...');
    const loginResponse = await fetch(`${BACKEND_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'admin@demo.com',
        password: 'admin123'
      })
    });
    
    const loginData = await loginResponse.json();
    if (!loginData.success) {
      console.error('❌ Login failed:', loginData.error);
      return;
    }
    
    const token = loginData.token;
    console.log('✅ Login successful\n');
    
    // Get risk prediction
    console.log('2️⃣ Fetching risk prediction with XAI data...');
    const riskResponse = await fetch(
      `${BACKEND_URL}/api/ml/risk/student/${TEST_STUDENT_ID}`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    const riskData = await riskResponse.json();
    
    if (!riskData.success) {
      console.error('❌ Risk prediction failed:', riskData.error);
      console.log('Response:', JSON.stringify(riskData, null, 2));
      return;
    }
    
    console.log('✅ Risk prediction successful\n');
    
    // Check XAI components
    console.log('3️⃣ Checking XAI Components:\n');
    
    console.log('📊 Features:', riskData.features ? '✅ Present' : '❌ Missing');
    if (riskData.features) {
      console.log('   Sample features:');
      console.log('   - Attendance Rate:', riskData.features.attendance_rate);
      console.log('   - Avg Marks:', riskData.features.avg_marks_percentage);
      console.log('   - Behavior Score:', riskData.features.behavior_score);
      console.log('   - Days Tracked:', riskData.features.days_tracked);
      console.log('   - Exams Completed:', riskData.features.exams_completed);
    }
    
    console.log('\n🧠 Feature Importance:', riskData.feature_importance ? '✅ Present' : '❌ Missing');
    if (riskData.feature_importance) {
      console.log('   Top 3 features:');
      const sorted = Object.entries(riskData.feature_importance)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 3);
      sorted.forEach(([name, importance], idx) => {
        console.log(`   ${idx + 1}. ${name}: ${(importance * 100).toFixed(1)}%`);
      });
    }
    
    console.log('\n📈 Prediction:', riskData.prediction ? '✅ Present' : '❌ Missing');
    if (riskData.prediction) {
      console.log('   - Risk Level:', riskData.prediction.risk_level);
      console.log('   - Risk Score:', (riskData.prediction.risk_score * 100).toFixed(1) + '%');
      console.log('   - Confidence:', riskData.prediction.confidence);
    }
    
    console.log('\n💡 Explanation:', riskData.explanation ? '✅ Present' : '❌ Missing');
    console.log('🎯 Recommendations:', riskData.recommendations ? '✅ Present' : '❌ Missing');
    
    console.log('\n✅ XAI Test Complete!');
    console.log('\n📋 Full Response Structure:');
    console.log(JSON.stringify(riskData, null, 2));
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testXAI();
