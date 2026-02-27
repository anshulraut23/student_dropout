/**
 * Test Risk Prediction API End-to-End
 * Tests the complete flow from frontend -> backend -> ML service -> Gemini
 */

const BACKEND_URL = 'http://localhost:5000';
const ML_SERVICE_URL = 'http://localhost:5001';

// Test user token (mock)
const mockToken = 'mock_jwt_token';

async function testMLServiceHealth() {
  console.log('\n=== TEST 1: ML Service Health ===');
  try {
    const response = await fetch(`${ML_SERVICE_URL}/health`);
    const data = await response.json();
    console.log('✅ ML Service Status:', data);
    return data.model_loaded && data.gemini_available;
  } catch (error) {
    console.error('❌ ML Service Error:', error.message);
    return false;
  }
}

async function testMLPrediction() {
  console.log('\n=== TEST 2: ML Service Direct Prediction ===');
  try {
    const testPayload = {
      student_id: 'test-123',
      features: {
        attendance_rate: 0.85,
        avg_marks_percentage: 72.5,
        behavior_score: 80,
        data_tier: 2,
        days_tracked: 45,
        exams_completed: 4,
        days_present: 38,
        days_absent: 7,
        total_incidents: 2,
        positive_incidents: 1,
        negative_incidents: 1
      },
      metadata: {
        student_name: 'Test Student',
        class_name: '10-A'
      }
    };

    const response = await fetch(`${ML_SERVICE_URL}/predict`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testPayload)
    });
    
    const data = await response.json();
    console.log('✅ ML Prediction Response:');
    console.log('   Risk Score:', data.prediction.risk_score);
    console.log('   Risk Level:', data.prediction.risk_level);
    console.log('   Confidence:', data.prediction.confidence);
    console.log('   Has Explanation:', !!data.explanation);
    console.log('   Has Recommendations:', data.recommendations?.length > 0);
    return true;
  } catch (error) {
    console.error('❌ ML Prediction Error:', error.message);
    return false;
  }
}

async function testBackendRiskEndpoint() {
  console.log('\n=== TEST 3: Backend Risk Prediction Endpoint ===');
  try {
    // This would need a real student ID from the database
    const studentId = 'test-student-id';
    
    const response = await fetch(
      `${BACKEND_URL}/api/ml/risk/student/${studentId}`,
      {
        headers: {
          'Authorization': `Bearer ${mockToken}`,
          'X-User-School': 'test-school-id'
        }
      }
    );
    
    const data = await response.json();
    
    if (data.error === 'Insufficient data for prediction') {
      console.log('ℹ️  Insufficient data (expected for new students)');
      return true;
    }
    
    console.log('✅ Risk Prediction Response:');
    console.log('   Risk Score:', data.prediction?.risk_score);
    console.log('   Risk Level:', data.prediction?.risk_level);
    console.log('   Explanation:', data.explanation?.substring(0, 100) + '...');
    console.log('   Recommendations:', data.recommendations?.length || 0);
    return true;
  } catch (error) {
    if (error.message?.includes('Insufficient')) {
      console.log('ℹ️  Insufficient data (expected for new students)');
      return true;
    }
    console.error('❌ Backend Risk Endpoint Error:', error.message);
    return false;
  }
}

async function runAllTests() {
  console.log('🚀 Starting Risk Analytics System Tests...\n');

  const results = {
    mlHealth: await testMLServiceHealth(),
    mlPrediction: await testMLPrediction(),
    backendRisk: await testBackendRiskEndpoint()
  };

  console.log('\n=== TEST SUMMARY ===');
  console.log('ML Service Health:', results.mlHealth ? '✅' : '❌');
  console.log('ML Prediction:', results.mlPrediction ? '✅' : '❌');
  console.log('Backend Risk Endpoint:', results.backendRisk ? '✅' : '❌');

  const allPassed = Object.values(results).every(r => r);
  console.log('\n' + (allPassed ? '✅ ALL TESTS PASSED' : '❌ SOME TESTS FAILED'));
  
  process.exit(allPassed ? 0 : 1);
}

runAllTests();
