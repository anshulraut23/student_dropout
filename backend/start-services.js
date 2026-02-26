// Start both Node.js backend and Python ML service
import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ML_SERVICE_PORT = process.env.ML_SERVICE_PORT || 5001;
const BACKEND_PORT = process.env.PORT || 5000;

console.log('🚀 Starting combined services...');
console.log(`📊 Backend will run on port ${BACKEND_PORT}`);
console.log(`🤖 ML Service will run on port ${ML_SERVICE_PORT}`);

// Start Python ML service
const mlServicePath = path.join(__dirname, '..', 'ml-service');
const mlService = spawn('gunicorn', [
  '--bind', `0.0.0.0:${ML_SERVICE_PORT}`,
  '--workers', '2',
  '--timeout', '120',
  'app:app'
], {
  cwd: mlServicePath,
  env: {
    ...process.env,
    PORT: ML_SERVICE_PORT,
    PYTHONUNBUFFERED: '1'
  },
  stdio: 'inherit'
});

mlService.on('error', (err) => {
  console.error('❌ Failed to start ML service:', err);
  process.exit(1);
});

mlService.on('exit', (code) => {
  console.log(`🤖 ML service exited with code ${code}`);
  if (code !== 0) {
    console.error('❌ ML service crashed, shutting down...');
    process.exit(1);
  }
});

// Wait a bit for ML service to start
setTimeout(() => {
  console.log('✅ ML service started');
  console.log('🚀 Starting Node.js backend...');
  
  // Start Node.js backend
  import('./server.js').catch(err => {
    console.error('❌ Failed to start backend:', err);
    mlService.kill();
    process.exit(1);
  });
}, 3000);

// Handle shutdown gracefully
process.on('SIGTERM', () => {
  console.log('📴 Shutting down services...');
  mlService.kill();
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('📴 Shutting down services...');
  mlService.kill();
  process.exit(0);
});
