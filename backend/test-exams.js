// Test Exams Endpoint
import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:5000/api';

async function testExamsEndpoint() {
  console.log('\n🧪 Testing Exams Endpoint');
  console.log('='.repeat(50));
  
  // Step 1: Register and login as admin
  console.log('\n📝 Step 1: Register Admin...');
  const adminEmail = `admin-${Date.now()}@test.com`;
  const adminPassword = 'password123';
  
  const registerResponse = await fetch(`${BASE_URL}/auth/register/admin`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      fullName: "Test Admin",
      email: adminEmail,
      password: adminPassword,
      schoolName: "Test School",
      schoolAddress: "123 Test St",
      schoolCity: "Mumbai",
      schoolState: "Maharashtra",
      schoolPhone: "9876543210"
    })
  });

  const adminData = await registerResponse.json();
  if (!registerResponse.ok) {
    console.log('❌ Admin registration failed:', adminData.error);
    return;
  }

  const token = adminData.token;
  const schoolId = adminData.school.id;
  console.log('✅ Admin registered. School ID:', schoolId);

  // Step 2: Get exams (should be empty)
  console.log('\n🔍 Step 2: Get Exams (should be empty)...');
  try {
    const examsResponse = await fetch(`${BASE_URL}/exams`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    const examsData = await examsResponse.json();
    
    if (examsResponse.ok) {
      console.log('✅ Exams endpoint working!');
      console.log('   Total exams:', examsData.totalExams);
      console.log('   Exams:', examsData.exams.length);
    } else {
      console.log('❌ Failed to get exams:', examsData.error);
      console.log('   Status:', examsResponse.status);
    }
  } catch (error) {
    console.log('❌ Error calling exams endpoint:', error.message);
  }

  console.log('\n' + '='.repeat(50));
}

testExamsEndpoint();
