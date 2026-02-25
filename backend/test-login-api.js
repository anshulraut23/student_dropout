// Test the login API endpoint
import fetch from 'node-fetch';

async function testLoginAPI() {
  const email = process.argv[2] || 'gpp@gmail.com';
  const password = process.argv[3] || '123456';
  
  console.log(`🧪 Testing Login API\n`);
  console.log(`Email: ${email}`);
  console.log(`Password: ${password}\n`);
  
  try {
    console.log('📡 Sending POST request to http://localhost:5000/api/auth/login...\n');
    
    const response = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password })
    });
    
    const data = await response.json();
    
    console.log(`Status: ${response.status} ${response.statusText}\n`);
    
    if (response.ok) {
      console.log('✅ Login successful!\n');
      console.log('Response:');
      console.log(JSON.stringify(data, null, 2));
    } else {
      console.log('❌ Login failed!\n');
      console.log('Error:');
      console.log(JSON.stringify(data, null, 2));
    }
    
  } catch (error) {
    console.error('❌ Request failed:', error.message);
    console.error('\nMake sure the backend server is running on port 5000');
    console.error('Run: npm start (in backend directory)');
  }
}

testLoginAPI();
