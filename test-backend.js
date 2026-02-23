// Quick test to check if backend is running
const http = require('http');

const options = {
  hostname: 'localhost',
  port: 5000,
  path: '/api/health',
  method: 'GET'
};

console.log('Testing backend server...');

const req = http.request(options, (res) => {
  console.log(`✅ Backend is running! Status: ${res.statusCode}`);
  
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    console.log('Response:', data);
  });
});

req.on('error', (error) => {
  console.log('❌ Backend is NOT running!');
  console.log('Error:', error.message);
  console.log('\nTo start the backend:');
  console.log('  cd backend');
  console.log('  npm start');
});

req.end();
