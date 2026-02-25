// Test database connection and check if tables exist
import pg from 'pg';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '.env') });

const { Pool } = pg;

async function testConnection() {
  console.log('🧪 Testing Supabase Connection...\n');
  
  const connectionString = process.env.DATABASE_URL;
  console.log('📍 Connection String:', connectionString ? 'Found' : 'Missing');
  
  if (!connectionString) {
    console.error('❌ DATABASE_URL not found in .env file');
    process.exit(1);
  }

  const pool = new Pool({
    connectionString: connectionString,
    ssl: { rejectUnauthorized: false },
    max: 5,
    min: 1,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 20000,
    allowExitOnIdle: false
  });

  try {
    // Test basic connection
    console.log('1️⃣ Testing basic connection...');
    const result = await pool.query('SELECT NOW() as current_time, version()');
    console.log('✅ Connection successful!');
    console.log('   Time:', result.rows[0].current_time);
    console.log('   Version:', result.rows[0].version.substring(0, 50) + '...\n');

    // Check if tables exist
    console.log('2️⃣ Checking if tables exist...');
    const tablesQuery = `
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_type = 'BASE TABLE'
      ORDER BY table_name;
    `;
    const tablesResult = await pool.query(tablesQuery);
    
    if (tablesResult.rows.length === 0) {
      console.log('❌ No tables found in database!');
      console.log('   You need to run the schema migration.');
      console.log('   Run: node backend/run-supabase-migration.js\n');
    } else {
      console.log(`✅ Found ${tablesResult.rows.length} tables:`);
      tablesResult.rows.forEach(row => {
        console.log(`   - ${row.table_name}`);
      });
      console.log('');
    }

    // Check for users table specifically
    console.log('3️⃣ Checking users table...');
    const usersCheck = await pool.query(`
      SELECT COUNT(*) as count FROM information_schema.tables 
      WHERE table_schema = 'public' AND table_name = 'users'
    `);
    
    if (parseInt(usersCheck.rows[0].count) === 0) {
      console.log('❌ Users table does NOT exist!');
      console.log('   Schema migration is required.\n');
    } else {
      console.log('✅ Users table exists');
      
      // Check if there are any users
      const userCountResult = await pool.query('SELECT COUNT(*) as count FROM users');
      const userCount = parseInt(userCountResult.rows[0].count);
      console.log(`   Total users in database: ${userCount}`);
      
      if (userCount > 0) {
        const usersResult = await pool.query('SELECT id, email, role, status FROM users LIMIT 5');
        console.log('   Sample users:');
        usersResult.rows.forEach(user => {
          console.log(`   - ${user.email} (${user.role}, ${user.status})`);
        });
      }
      console.log('');
    }

    // Check schools table
    console.log('4️⃣ Checking schools table...');
    const schoolsCheck = await pool.query(`
      SELECT COUNT(*) as count FROM information_schema.tables 
      WHERE table_schema = 'public' AND table_name = 'schools'
    `);
    
    if (parseInt(schoolsCheck.rows[0].count) === 0) {
      console.log('❌ Schools table does NOT exist!\n');
    } else {
      console.log('✅ Schools table exists');
      const schoolCountResult = await pool.query('SELECT COUNT(*) as count FROM schools');
      const schoolCount = parseInt(schoolCountResult.rows[0].count);
      console.log(`   Total schools in database: ${schoolCount}\n`);
    }

    console.log('✅ Database connection test complete!');
    
  } catch (error) {
    console.error('❌ Database error:', error.message);
    console.error('   Code:', error.code);
    if (error.code === 'ENOTFOUND') {
      console.error('   The database host could not be found. Check your DATABASE_URL.');
    } else if (error.code === '42P01') {
      console.error('   Table does not exist. Run the schema migration.');
    }
  } finally {
    await pool.end();
  }
}

testConnection();
