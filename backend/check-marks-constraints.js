// Check marks table constraints
import pg from 'pg';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '.env') });

const { Pool } = pg;

async function checkMarksConstraints() {
  console.log('🔍 Checking Marks Table Constraints\n');
  
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    const result = await pool.query(`
      SELECT 
        conname as constraint_name,
        pg_get_constraintdef(oid) as constraint_definition
      FROM pg_constraint
      WHERE conrelid = 'marks'::regclass
    `);

    console.log(`Found ${result.rows.length} constraints:\n`);
    result.rows.forEach((constraint, idx) => {
      console.log(`${idx + 1}. ${constraint.constraint_name}`);
      console.log(`   ${constraint.constraint_definition}\n`);
    });

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await pool.end();
  }
}

checkMarksConstraints();
