// Check if specific user exists
import pg from 'pg';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '.env') });

const { Pool } = pg;

async function checkUser() {
  const email = process.argv[2] || 'gpp@gmail.com';
  
  console.log(`🔍 Checking for user: ${email}\n`);
  
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    
    if (result.rows.length === 0) {
      console.log('❌ User NOT found in database!');
      console.log('   This means the registration did not save to Supabase.\n');
      
      // Check all users
      const allUsers = await pool.query('SELECT email, role, status, created_at FROM users ORDER BY created_at DESC LIMIT 10');
      console.log('📋 Recent users in database:');
      allUsers.rows.forEach(user => {
        console.log(`   - ${user.email} (${user.role}, ${user.status}) - ${user.created_at}`);
      });
    } else {
      console.log('✅ User found!');
      const user = result.rows[0];
      console.log('   ID:', user.id);
      console.log('   Email:', user.email);
      console.log('   Name:', user.full_name);
      console.log('   Role:', user.role);
      console.log('   Status:', user.status);
      console.log('   School ID:', user.school_id);
      console.log('   Created:', user.created_at);
      
      // Check if school exists
      if (user.school_id) {
        const schoolResult = await pool.query('SELECT * FROM schools WHERE id = $1', [user.school_id]);
        if (schoolResult.rows.length > 0) {
          console.log('\n🏫 School:');
          console.log('   Name:', schoolResult.rows[0].name);
          console.log('   City:', schoolResult.rows[0].city);
        }
      }
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await pool.end();
  }
}

checkUser();
