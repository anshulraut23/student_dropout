// Complete Authentication Flow Test
import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:5000/api';

// Test 1: Admin Registration
async function testAdminFlow() {
  console.log('\n🧪 TEST 1: Admin Registration and Login Flow');
  console.log('='.repeat(50));
  
  const adminEmail = `admin-${Date.now()}@test.com`;
  const adminPassword = 'password123';
  
  // Step 1: Register Admin
  console.log('\n📝 Step 1: Register Admin...');
  const registerResponse = await fetch(`${BASE_URL}/auth/register/admin`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      fullName: "Test Admin",
      email: adminEmail,
      password: adminPassword,
      schoolName: "Test High School",
      schoolAddress: "123 Test St",
      schoolCity: "Mumbai",
      schoolState: "Maharashtra",
      schoolPhone: "9876543210"
    })
  });

  const registerData = await registerResponse.json();
  
  if (!registerResponse.ok) {
    console.log('❌ Registration Failed:', registerData.error);
    return null;
  }

  console.log('✅ Admin Registered Successfully');
  console.log('   User ID:', registerData.user.id);
  console.log('   School ID:', registerData.school.id);
  console.log('   Token Received:', registerData.token ? 'Yes' : 'No');

  // Step 2: Test authenticated request with token
  console.log('\n🔐 Step 2: Test Authenticated Request...');
  const statsResponse = await fetch(`${BASE_URL}/gamification/stats`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${registerData.token}`
    }
  });

  if (statsResponse.ok) {
    const statsData = await statsResponse.json();
    console.log('✅ Authenticated Request Successful');
    console.log('   Stats loaded:', statsData.stats ? 'Yes' : 'No');
  } else {
    console.log('❌ Authenticated Request Failed:', statsResponse.status);
  }

  return { token: registerData.token, schoolId: registerData.school.id, email: adminEmail, password: adminPassword };
}

// Test 2: Teacher Registration
async function testTeacherFlow(schoolId) {
  console.log('\n🧪 TEST 2: Teacher Registration Flow');
  console.log('='.repeat(50));
  
  if (!schoolId) {
    console.log('⚠️  Skipped - No school ID available');
    return;
  }

  const teacherEmail = `teacher-${Date.now()}@test.com`;
  const teacherPassword = 'password123';

  // Step 1: Register Teacher
  console.log('\n📝 Step 1: Register Teacher...');
  const registerResponse = await fetch(`${BASE_URL}/auth/register/teacher`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      fullName: "Test Teacher",
      email: teacherEmail,
      password: teacherPassword,
      schoolId: schoolId
    })
  });

  const registerData = await registerResponse.json();
  
  if (!registerResponse.ok) {
    console.log('❌ Registration Failed:', registerData.error);
    return;
  }

  console.log('✅ Teacher Registered Successfully');
  console.log('   User ID:', registerData.user.id);
  console.log('   Status:', registerData.user.status);
  console.log('   Message:', registerData.message);

  // Step 2: Try to login (should fail - pending approval)
  console.log('\n🔐 Step 2: Try to Login (Should be Pending)...');
  const loginResponse = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: teacherEmail,
      password: teacherPassword
    })
  });

  const loginData = await loginResponse.json();
  
  if (loginData.success && loginData.user.status === 'pending') {
    console.log('✅ Login Correctly Blocked - Waiting for Approval');
  } else if (loginData.success) {
    console.log('⚠️  Login Succeeded - Status:', loginData.user.status);
  } else {
    console.log('✅ Login Failed as Expected:', loginData.error);
  }
}

// Test 3: Login Flow
async function testLoginFlow(email, password) {
  console.log('\n🧪 TEST 3: Login Flow');
  console.log('='.repeat(50));
  
  if (!email || !password) {
    console.log('⚠️  Skipped - No credentials available');
    return;
  }

  console.log('\n🔐 Logging in...');
  const loginResponse = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });

  const loginData = await loginResponse.json();
  
  if (loginResponse.ok) {
    console.log('✅ Login Successful');
    console.log('   User ID:', loginData.user.id);
    console.log('   Role:', loginData.user.role);
    console.log('   Token Received:', loginData.token ? 'Yes' : 'No');
  } else {
    console.log('❌ Login Failed:', loginData.error);
  }
}

// Run all tests
async function runAllTests() {
  console.log('\n🚀 STARTING COMPLETE AUTHENTICATION FLOW TESTS');
  console.log('='.repeat(50));
  
  try {
    // Test admin flow
    const adminData = await testAdminFlow();
    
    // Test teacher flow
    if (adminData) {
      await testTeacherFlow(adminData.schoolId);
      
      // Test login
      await testLoginFlow(adminData.email, adminData.password);
    }
    
    console.log('\n' + '='.repeat(50));
    console.log('✅ ALL TESTS COMPLETED!');
    console.log('='.repeat(50) + '\n');
  } catch (error) {
    console.error('\n❌ Test Error:', error.message);
  }
}

runAllTests();
