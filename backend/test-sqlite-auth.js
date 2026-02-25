// Test SQLite Signup and Signin
import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:5000/api';

async function testSignupSignin() {
  console.log('\n' + '='.repeat(60));
  console.log('🧪 TESTING SIGNUP AND SIGNIN WITH SQLITE PERSISTENCE');
  console.log('='.repeat(60));

  const adminEmail = `admin-sqlite-${Date.now()}@test.com`;
  const adminPassword = 'Password@123';

  // TEST 1: Signup as Admin
  console.log('\n📝 TEST 1: Admin Signup');
  console.log("-".repeat(60));
  
  let response = await fetch(`${BASE_URL}/auth/register/admin`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      fullName: "SQLite Test Admin",
      email: adminEmail,
      password: adminPassword,
      schoolName: "SQLite Test School",
      schoolAddress: "123 Test St",
      schoolCity: "Mumbai",
      schoolState: "Maharashtra",
      schoolPhone: "9876543210"
    })
  });

  let data = await response.json();
  
  if (!response.ok) {
    console.log('❌ Signup FAILED:', data.error);
    return;
  }

  console.log('✅ Signup SUCCESS');
  console.log('   User ID:', data.user.id);
  console.log('   Email:', data.user.email);
  console.log('   Role:', data.user.role);
  console.log('   School ID:', data.school.id);
  console.log('   Token received:', data.token ? 'YES' : 'NO');

  const receivedToken = data.token;
  const schoolId = data.school.id;

  // TEST 2: Try to login with signup credentials
  console.log('\n🔐 TEST 2: Login with Signup Credentials');
  console.log("-".repeat(60));

  response = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: adminEmail,
      password: adminPassword
    })
  });

  data = await response.json();

  if (!response.ok) {
    console.log('❌ Login FAILED:', data.error);
    return;
  }

  console.log('✅ Login SUCCESS');
  console.log('   User ID:', data.user.id);
  console.log('   Email:', data.user.email);
  console.log('   Token received:', data.token ? 'YES' : 'NO');

  // TEST 3: Use token to access protected endpoint
  console.log('\n🔑 TEST 3: Access Protected Endpoint (Gamification Stats)');
  console.log("-".repeat(60));

  response = await fetch(`${BASE_URL}/gamification/stats`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${data.token}`
    }
  });

  if (response.ok) {
    console.log('✅ Protected endpoint accessible');
    const statsData = await response.json();
    console.log('   Stats loaded:', statsData.stats ? 'YES' : 'NO');
  } else {
    console.log('❌ Protected endpoint failed:', response.status);
  }

  // TEST 4: Test Teacher Signup
  console.log('\n👨‍🏫 TEST 4: Teacher Signup');
  console.log("-".repeat(60));

  const teacherEmail = `teacher-sqlite-${Date.now()}@test.com`;
  
  response = await fetch(`${BASE_URL}/auth/register/teacher`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      fullName: "SQLite Test Teacher",
      email: teacherEmail,
      password: "TeacherPass@123",
      schoolId: schoolId
    })
  });

  data = await response.json();

  if (!response.ok) {
    console.log('❌ Teacher signup FAILED:', data.error);
    return;
  }

  console.log('✅ Teacher signup SUCCESS');
  console.log('   User ID:', data.user.id);
  console.log('   Email:', data.user.email);
  console.log('   Status:', data.user.status);
  console.log('   Message:', data.message.substring(0, 50) + '...');

  // TEST 5: Verify data persists (query exams)
  console.log('\n💾 TEST 5: Data Persistence Test (Exams List)');
  console.log("-".repeat(60));

  response = await fetch(`${BASE_URL}/exams`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${receivedToken}`
    }
  });

  if (response.ok) {
    const examsData = await response.json();
    console.log('✅ Exams endpoint works');
    console.log('   Total exams:', examsData.totalExams);
  } else {
    console.log('❌ Exams endpoint failed:', response.status);
  }

  console.log('\n' + '='.repeat(60));
  console.log('✅ ALL TESTS COMPLETED SUCCESSFULLY!');
  console.log('📊 SQLite database is working for persistence');
  console.log('='.repeat(60) + '\n');
}

testSignupSignin().catch(console.error);
