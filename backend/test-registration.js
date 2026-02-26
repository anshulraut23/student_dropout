// Test script for registration endpoints
import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:5000/api/auth';

// Test Admin Registration
async function testAdminRegistration() {
  console.log('\n🧪 Testing Admin Registration...');
  
  const adminData = {
    fullName: "Test Admin",
    email: `admin-${Date.now()}@test.com`,
    password: "password123",
    schoolName: "Demo High School",
    schoolAddress: "123 Main St",
    schoolCity: "Mumbai",
    schoolState: "Maharashtra",
    schoolPhone: "1234567890"
  };

  try {
    const response = await fetch(`${BASE_URL}/register/admin`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(adminData)
    });

    const data = await response.json();
    
    if (response.ok) {
      console.log('✅ Admin Registration SUCCESS');
      console.log('   User ID:', data.user.id);
      console.log('   School ID:', data.school.id);
      console.log('   Token:', data.token ? 'Generated' : 'Missing');
      return data.school.id;
    } else {
      console.log('❌ Admin Registration FAILED');
      console.log('   Error:', data.error);
      return null;
    }
  } catch (error) {
    console.log('❌ Admin Registration ERROR');
    console.log('   ', error.message);
    return null;
  }
}

// Test Teacher Registration
async function testTeacherRegistration(schoolId) {
  console.log('\n🧪 Testing Teacher Registration...');
  
  if (!schoolId) {
    console.log('⚠️  Skipping - No school ID available');
    return;
  }

  const teacherData = {
    fullName: "Test Teacher",
    email: `teacher-${Date.now()}@test.com`,
    password: "password123",
    schoolId: schoolId
  };

  try {
    const response = await fetch(`${BASE_URL}/register/teacher`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(teacherData)
    });

    const data = await response.json();
    
    if (response.ok) {
      console.log('✅ Teacher Registration SUCCESS');
      console.log('   User ID:', data.user.id);
      console.log('   Status:', data.user.status);
      console.log('   Message:', data.message);
    } else {
      console.log('❌ Teacher Registration FAILED');
      console.log('   Error:', data.error);
    }
  } catch (error) {
    console.log('❌ Teacher Registration ERROR');
    console.log('   ', error.message);
  }
}

// Run tests
async function runTests() {
  console.log('🚀 Starting Registration Tests...');
  console.log('================================\n');
  
  const schoolId = await testAdminRegistration();
  await testTeacherRegistration(schoolId);
  
  console.log('\n================================');
  console.log('✅ Tests Complete!\n');
}

runTests().catch(console.error);
