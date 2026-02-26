// Show password hint for a user (tests common passwords)
import bcrypt from 'bcryptjs';
import pg from 'pg';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '.env') });

const { Pool } = pg;

async function showPasswordHint() {
  const email = process.argv[2];
  
  if (!email) {
    console.log('Usage: node show-password-hint.js <email>');
    console.log('Example: node show-password-hint.js gpp@gmail.com');
    return;
  }
  
  console.log(`🔍 Checking password for: ${email}\n`);
  
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    
    if (result.rows.length === 0) {
      console.log('❌ User not found');
      return;
    }
    
    const user = result.rows[0];
    console.log('✅ User found');
    console.log(`   Name: ${user.full_name}`);
    console.log(`   Role: ${user.role}`);
    console.log(`   Status: ${user.status}\n`);
    
    // Test common passwords
    console.log('🔐 Testing common passwords...\n');
    const commonPasswords = [
      '123456',
      'password',
      'password123',
      'admin',
      'admin123',
      '12345678',
      'qwerty',
      '123456789',
      'letmein',
      '1234567890'
    ];
    
    let found = false;
    for (const testPass of commonPasswords) {
      const isMatch = await bcrypt.compare(testPass, user.password);
      if (isMatch) {
        console.log(`✅ PASSWORD FOUND: "${testPass}"`);
        console.log(`\nYou can login with:`);
        console.log(`   Email: ${email}`);
        console.log(`   Password: ${testPass}`);
        found = true;
        break;
      }
    }
    
    if (!found) {
      console.log('❌ Password not in common list');
      console.log('   Use reset-password.js to set a new password:');
      console.log(`   node backend/reset-password.js ${email} newPassword123`);
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await pool.end();
  }
}

showPasswordHint();
