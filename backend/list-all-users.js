// List all users with their details
import pg from 'pg';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '.env') });

const { Pool } = pg;

async function listUsers() {
  console.log('👥 All Users in Database\n');
  
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    const result = await pool.query(`
      SELECT u.id, u.email, u.full_name, u.role, u.status, u.created_at, s.name as school_name
      FROM users u
      LEFT JOIN schools s ON s.id = u.school_id
      ORDER BY u.created_at DESC
    `);
    
    console.log(`Found ${result.rows.length} users:\n`);
    
    result.rows.forEach((user, index) => {
      console.log(`${index + 1}. ${user.email}`);
      console.log(`   Name: ${user.full_name}`);
      console.log(`   Role: ${user.role}`);
      console.log(`   Status: ${user.status}`);
      console.log(`   School: ${user.school_name || 'N/A'}`);
      console.log(`   Created: ${user.created_at}`);
      console.log('');
    });
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await pool.end();
  }
}

listUsers();
