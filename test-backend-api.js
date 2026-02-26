// Test Backend API Endpoints

const API_URL = 'https://student-dropout-alpha.vercel.app/api';

async function testLogin() {
  console.log('\n🔐 Testing Login...');
  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'darshan@gmail.com',
        password: '123456'
      })
    });
    
    const data = await response.json();
    console.log('Status:', response.status);
    console.log('Response:', JSON.stringify(data, null, 2));
    
    if (data.success && data.token) {
      console.log('✅ Login successful!');
      return data.token;
    } else {
      console.log('❌ Login failed!');
      return null;
    }
  } catch (error) {
    console.error('❌ Login error:', error.message);
    return null;
  }
}

async function testGetMyClasses(token) {
  console.log('\n📚 Testing Get My Classes...');
  try {
    const response = await fetch(`${API_URL}/teachers/my-classes`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('Status:', response.status);
    
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      const data = await response.json();
      console.log('Response:', JSON.stringify(data, null, 2));
      
      if (data.success) {
        console.log(`✅ Got ${data.classes?.length || 0} classes`);
      } else {
        console.log('❌ Failed:', data.error);
      }
    } else {
      const text = await response.text();
      console.log('❌ Non-JSON response:');
      console.log(text.substring(0, 500));
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

async function testGetStudents(token) {
  console.log('\n👥 Testing Get Students...');
  try {
    const response = await fetch(`${API_URL}/students`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('Status:', response.status);
    
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      const data = await response.json();
      console.log('Response:', JSON.stringify(data, null, 2));
      
      if (data.success) {
        console.log(`✅ Got ${data.students?.length || 0} students`);
      } else {
        console.log('❌ Failed:', data.error);
      }
    } else {
      const text = await response.text();
      console.log('❌ Non-JSON response:');
      console.log(text.substring(0, 500));
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

async function runTests() {
  console.log('🧪 Testing Backend API');
  console.log('='.repeat(50));
  
  const token = await testLogin();
  
  if (token) {
    await testGetMyClasses(token);
    await testGetStudents(token);
  }
  
  console.log('\n' + '='.repeat(50));
  console.log('✅ Tests complete!');
}

runTests();
