// Test login functionality
import bcrypt from 'bcryptjs';
import pg from 'pg';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '.env') });

const { Pool } = pg;

async function testLogin() {
  const email = process.argv[2] || 'gpp@gmail.com';
  const password = process.argv[3] || 'password123';
  
  console.log(`🔐 Testing login for: ${email}\n`);
  
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    // Find user
    console.log('1️⃣ Looking up user...');
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    
    if (result.rows.length === 0) {
      console.log('❌ User not found');
      return;
    }
    
    const user = result.rows[0];
    console.log('✅ User found:', user.email);
    console.log('   Role:', user.role);
    console.log('   Status:', user.status);
    console.log('   Password hash:', user.password.substring(0, 20) + '...');
    
    // Test password
    console.log('\n2️⃣ Testing password...');
    console.log('   Input password:', password);
    
    const isValid = await bcrypt.compare(password, user.password);
    
    if (isValid) {
      console.log('✅ Password is CORRECT!');
      console.log('\n✅ Login should work!');
    } else {
      console.log('❌ Password is INCORRECT!');
      console.log('   The password you entered does not match the hash in database.');
      console.log('   Try the password you used during registration.');
      
      // Test common passwords
      console.log('\n🔍 Testing common passwords...');
      const commonPasswords = ['password', 'password123', '123456', 'admin', 'admin123'];
      for (const testPass of commonPasswords) {
        const testResult = await bcrypt.compare(testPass, user.password);
        if (testResult) {
          console.log(`   ✅ Password is: "${testPass}"`);
          break;
        }
      }
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await pool.end();
  }
}

testLogin();
