// Reset user password
import bcrypt from 'bcryptjs';
import pg from 'pg';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '.env') });

const { Pool } = pg;

async function resetPassword() {
  const email = process.argv[2];
  const newPassword = process.argv[3];
  
  if (!email || !newPassword) {
    console.log('Usage: node reset-password.js <email> <new-password>');
    console.log('Example: node reset-password.js gpp@gmail.com myNewPassword123');
    return;
  }
  
  console.log(`🔐 Resetting password for: ${email}\n`);
  
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    // Check if user exists
    const userResult = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    
    if (userResult.rows.length === 0) {
      console.log('❌ User not found');
      return;
    }
    
    const user = userResult.rows[0];
    console.log('✅ User found:', user.email);
    console.log('   Name:', user.full_name);
    console.log('   Role:', user.role);
    
    // Hash new password
    console.log('\n🔐 Hashing new password...');
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    // Update password
    console.log('💾 Updating password in database...');
    await pool.query('UPDATE users SET password = $1 WHERE email = $2', [hashedPassword, email]);
    
    console.log('✅ Password updated successfully!');
    console.log(`\nYou can now login with:`);
    console.log(`   Email: ${email}`);
    console.log(`   Password: ${newPassword}`);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await pool.end();
  }
}

resetPassword();
