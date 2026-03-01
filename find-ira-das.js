import dotenv from 'dotenv';
import { getPostgresPool, connectPostgres } from './backend/database/connection.js';

dotenv.config({ path: './backend/.env' });

async function findStudent() {
  await connectPostgres();
  const pool = getPostgresPool();
  
  try {
    console.log('🔍 Searching for students with "Ira" or "Das" or "N3"...\n');
    
    const query = `
      SELECT 
        s.id,
        s.name,
        s.roll_number,
        c.name as class_name,
        s.status,
        COUNT(DISTINCT a.id) as attendance_count
      FROM students s
      LEFT JOIN classes c ON s.class_id = c.id
      LEFT JOIN attendance a ON s.id = a.student_id
      WHERE 
        s.name ILIKE '%Ira%' OR 
        s.name ILIKE '%Das%' OR 
        s.roll_number ILIKE '%N3%'
      GROUP BY s.id, s.name, s.roll_number, c.name, s.status
      ORDER BY s.name
    `;
    
    const result = await pool.query(query);
    
    if (result.rows.length === 0) {
      console.log('❌ No students found matching "Ira Das" or "N3"');
      console.log('\n💡 Let me show you all students in the database:\n');
      
      const allStudentsQuery = `
        SELECT 
          s.name,
          s.roll_number,
          c.name as class_name
        FROM students s
        LEFT JOIN classes c ON s.class_id = c.id
        ORDER BY s.name
        LIMIT 10
      `;
      
      const allResult = await pool.query(allStudentsQuery);
      console.log('First 10 students:');
      console.log('Name                    | Roll Number | Class');
      console.log('------------------------|-------------|-------');
      allResult.rows.forEach(s => {
        console.log(`${s.name.padEnd(23)} | ${(s.roll_number || 'N/A').padEnd(11)} | ${s.class_name || 'N/A'}`);
      });
      
    } else {
      console.log(`✅ Found ${result.rows.length} matching student(s):\n`);
      console.log('Name                    | Roll Number | Class      | Status | Attendance Records');
      console.log('------------------------|-------------|------------|--------|-------------------');
      
      result.rows.forEach(s => {
        console.log(
          `${s.name.padEnd(23)} | ${(s.roll_number || 'N/A').padEnd(11)} | ${(s.class_name || 'N/A').padEnd(10)} | ${s.status.padEnd(6)} | ${s.attendance_count}`
        );
      });
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

findStudent();
