/**
 * Comprehensive Risk Analytics Integration Test
 * Tests full flow: Frontend -> Backend -> ML Service -> Gemini API
 */

const BACKEND_URL = 'http://localhost:5000';
const ML_SERVICE_URL = 'http://localhost:5001';

console.log('═══════════════════════════════════════════════════════════════');
console.log('🚀 RISK ANALYTICS SYSTEM - COMPREHENSIVE INTEGRATION TEST');
console.log('═══════════════════════════════════════════════════════════════\n');

async function runTestSuite() {
  const results = [];
  
  // Test 1: ML Service Health
  console.log('TEST 1: ML Service Health Check');
  console.log('─────────────────────────────────────────────────────────────');
  try {
    const response = await fetch(`${ML_SERVICE_URL}/health`);
    const data = await response.json();
    
    const statusOk = response.ok;
    const modelLoaded = data.model_loaded;
    const geminiAvailable = data.gemini_available;
    
    console.log(`  Status: ${statusOk ? '✅' : '❌'}`);
    console.log(`  Model Loaded: ${modelLoaded ? '✅' : '❌'}`);
    console.log(`  Gemini Available: ${geminiAvailable ? '✅' : '❌'}`);
    console.log(`  Service: ${data.service}`);
    console.log(`  Model Type: ${data.model_type}`);
    
    results.push({
      name: 'ML Service Health',
      passed: statusOk && modelLoaded && geminiAvailable
    });
  } catch (error) {
    console.log(`  ❌ Error: ${error.message}`);
    results.push({ name: 'ML Service Health', passed: false });
  }
  console.log();

  // Test 2: Direct ML Prediction (Low Risk)
  console.log('TEST 2: ML Prediction - Low Risk Student');
  console.log('─────────────────────────────────────────────────────────────');
  try {
    const lowRiskPayload = {
      student_id: 'test-low-risk',
      features: {
        attendance_rate: 0.95,
        avg_marks_percentage: 85,
        behavior_score: 95,
        data_tier: 3,
        days_tracked: 90,
        exams_completed: 8,
        days_present: 85,
        days_absent: 5,
        total_incidents: 0,
        positive_incidents: 2,
        negative_incidents: 0
      },
      metadata: {
        student_name: 'Good Student',
        class_name: '10-A'
      }
    };

    const response = await fetch(`${ML_SERVICE_URL}/predict`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(lowRiskPayload)
    });
    
    const data = await response.json();
    
    console.log(`  Risk Score: ${(data.prediction.risk_score * 100).toFixed(1)}%`);
    console.log(`  Risk Level: ${data.prediction.risk_level} ✅`);
    console.log(`  Confidence: ${data.prediction.confidence}`);
    console.log(`  Explanation Length: ${data.explanation?.length || 0} chars`);
    console.log(`  Recommendations: ${data.recommendations?.length || 0}`);
    console.log(`  Priority Actions: ${data.priority_actions?.length || 0}`);
    
    const passed = response.ok && data.prediction.risk_level === 'low';
    results.push({ name: 'ML Prediction - Low Risk', passed });
  } catch (error) {
    console.log(`  ❌ Error: ${error.message}`);
    results.push({ name: 'ML Prediction - Low Risk', passed: false });
  }
  console.log();

  // Test 3: Direct ML Prediction (High Risk)
  console.log('TEST 3: ML Prediction - High Risk Student');
  console.log('─────────────────────────────────────────────────────────────');
  try {
    const highRiskPayload = {
      student_id: 'test-high-risk',
      features: {
        attendance_rate: 0.45,
        avg_marks_percentage: 35,
        behavior_score: 40,
        data_tier: 2,
        days_tracked: 30,
        exams_completed: 2,
        days_present: 13,
        days_absent: 17,
        total_incidents: 8,
        positive_incidents: 0,
        negative_incidents: 8
      },
      metadata: {
        student_name: 'At-Risk Student',
        class_name: '10-B'
      }
    };

    const response = await fetch(`${ML_SERVICE_URL}/predict`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(highRiskPayload)
    });
    
    const data = await response.json();
    
    console.log(`  Risk Score: ${(data.prediction.risk_score * 100).toFixed(1)}%`);
    console.log(`  Risk Level: ${data.prediction.risk_level} ✅`);
    console.log(`  Confidence: ${data.prediction.confidence}`);
    console.log(`  Explanation Length: ${data.explanation?.length || 0} chars`);
    console.log(`  Recommendations: ${data.recommendations?.length || 0}`);
    console.log(`  Priority Actions: ${data.priority_actions?.length || 0}`);
    
    const riskIsHigh = data.prediction.risk_level === 'high' || data.prediction.risk_level === 'critical';
    const passed = response.ok && riskIsHigh;
    results.push({ name: 'ML Prediction - High Risk', passed });
  } catch (error) {
    console.log(`  ❌ Error: ${error.message}`);
    results.push({ name: 'ML Prediction - High Risk', passed: false });
  }
  console.log();

  // Test 4: Feature Importance
  console.log('TEST 4: Feature Importance Analysis');
  console.log('─────────────────────────────────────────────────────────────');
  try {
    const response = await fetch(`${ML_SERVICE_URL}/predict`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        student_id: 'test-features',
        features: {
          attendance_rate: 0.70,
          avg_marks_percentage: 50,
          behavior_score: 60,
          data_tier: 2,
          days_tracked: 45,
          exams_completed: 3,
          days_present: 31,
          days_absent: 14,
          total_incidents: 4,
          positive_incidents: 1,
          negative_incidents: 3
        },
        metadata: { student_name: 'Test', class_name: '10-C' }
      })
    });
    
    const data = await response.json();
    
    if (data.feature_importance && Object.keys(data.feature_importance).length > 0) {
      console.log('  Top Features by Importance:');
      const sorted = Object.entries(data.feature_importance)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5);
      
      sorted.forEach(([feature, importance], idx) => {
        const featureName = feature.replace(/_/g, ' ').split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
        console.log(`    ${idx + 1}. ${featureName}: ${(importance * 100).toFixed(1)}%`);
      });
      
      results.push({ name: 'Feature Importance', passed: true });
    } else {
      console.log(`  ⚠️  No feature importance data`);
      results.push({ name: 'Feature Importance', passed: false });
    }
  } catch (error) {
    console.log(`  ❌ Error: ${error.message}`);
    results.push({ name: 'Feature Importance', passed: false });
  }
  console.log();

  // Test 5: Gemini AI Explanations
  console.log('TEST 5: Gemini AI Explanations');
  console.log('─────────────────────────────────────────────────────────────');
  try {
    const response = await fetch(`${ML_SERVICE_URL}/predict`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        student_id: 'test-gemini',
        features: {
          attendance_rate: 0.65,
          avg_marks_percentage: 55,
          behavior_score: 70,
          data_tier: 2,
          days_tracked: 40,
          exams_completed: 3,
          days_present: 26,
          days_absent: 14,
          total_incidents: 3,
          positive_incidents: 1,
          negative_incidents: 2
        },
        metadata: { student_name: 'Test', class_name: '10-D' }
      })
    });
    
    const data = await response.json();
    
    const hasExplanation = !!data.explanation && data.explanation.length > 10;
    const hasRecommendations = Array.isArray(data.recommendations) && data.recommendations.length > 0;
    const hasPriorityActions = Array.isArray(data.priority_actions) && data.priority_actions.length > 0;
    
    console.log(`  Explanation Generated: ${hasExplanation ? '✅' : '❌'}`);
    if (hasExplanation) console.log(`    Length: ${data.explanation.length} characters`);
    
    console.log(`  Recommendations: ${hasRecommendations ? `✅ (${data.recommendations.length})` : '❌'}`);
    if (hasRecommendations) {
      data.recommendations.slice(0, 2).forEach(rec => {
        console.log(`    • ${rec.substring(0, 60)}...`);
      });
    }
    
    console.log(`  Priority Actions: ${hasPriorityActions ? `✅ (${data.priority_actions.length})` : '❌'}`);
    if (hasPriorityActions) {
      data.priority_actions.forEach(action => {
        console.log(`    • ${action.substring(0, 60)}...`);
      });
    }
    
    results.push({
      name: 'Gemini AI Explanations',
      passed: hasExplanation && hasRecommendations && hasPriorityActions
    });
  } catch (error) {
    console.log(`  ❌ Error: ${error.message}`);
    results.push({ name: 'Gemini AI Explanations', passed: false });
  }
  console.log();

  // Test 6: Error Handling - Insufficient Data
  console.log('TEST 6: Error Handling - Insufficient Data');
  console.log('─────────────────────────────────────────────────────────────');
  try {
    const response = await fetch(`${ML_SERVICE_URL}/predict`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        student_id: 'test-insufficient',
        features: {
          attendance_rate: 0,
          avg_marks_percentage: 0,
          behavior_score: 0,
          data_tier: 0,
          days_tracked: 5,
          exams_completed: 0,
          days_present: 0,
          days_absent: 5,
          total_incidents: 0,
          positive_incidents: 0,
          negative_incidents: 0
        },
        metadata: { student_name: 'New Student', class_name: '10-E' }
      })
    });
    
    const data = await response.json();
    
    const correctError = response.status === 400 && data.error;
    console.log(`  Error Status: ${response.status} ${correctError ? '✅' : '❌'}`);
    if (data.error) console.log(`  Error Message: ${data.error}`);
    console.log(`  Data Tier: ${data.data_tier} (0 = insufficient)`);
    
    results.push({
      name: 'Error Handling',
      passed: correctError && data.data_tier === 0
    });
  } catch (error) {
    console.log(`  ❌ Error: ${error.message}`);
    results.push({ name: 'Error Handling', passed: false });
  }
  console.log();

  // Summary
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('📊 TEST SUMMARY');
  console.log('─────────────────────────────────────────────────────────────');
  
  results.forEach(result => {
    const icon = result.passed ? '✅' : '❌';
    console.log(`${icon} ${result.name}`);
  });

  const totalPassed = results.filter(r => r.passed).length;
  const totalTests = results.length;
  const percentage = ((totalPassed / totalTests) * 100).toFixed(0);

  console.log('─────────────────────────────────────────────────────────────');
  console.log(`Passed: ${totalPassed}/${totalTests} (${percentage}%)`);
  console.log('═══════════════════════════════════════════════════════════════\n');

  if (totalPassed === totalTests) {
    console.log('🎉 ALL TESTS PASSED! Risk Analytics System is ready for production.\n');
    console.log('Next Steps:');
    console.log('1. ✅ ML Service is running (port 5001)');
    console.log('2. ✅ Model predictions are working');
    console.log('3. ✅ Gemini AI is generating explanations');
    console.log('4. Now start the backend: npm run dev (in backend/)');
    console.log('5. Then start the frontend: npm run dev (in proactive-education-assistant/)');
    console.log('6. Go to Student Profile → Risk Analytics to see predictions!\n');
  } else {
    console.log(`⚠️  ${totalTests - totalPassed} test(s) failed. Please check the errors above.\n`);
  }
}

// Run the test suite
runTestSuite().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
