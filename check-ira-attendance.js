import dotenv from 'dotenv';
import { getPostgresPool, connectPostgres } from './backend/database/connection.js';

dotenv.config({ path: './backend/.env' });

async function checkIraAttendance() {
  await connectPostgres();
  const pool = getPostgresPool();
  
  try {
    // Get last week's date range
    const today = new Date();
    const lastWeekStart = new Date(today);
    lastWeekStart.setDate(today.getDate() - 7);
    
    console.log('🔍 Searching for Ira Das N3...\n');
    
    // Find student
    const studentQuery = `
      SELECT s.id, s.name, s.roll_number, c.name as class_name
      FROM students s
      LEFT JOIN classes c ON s.class_id = c.id
      WHERE s.name ILIKE '%Ira Das%' OR s.roll_number ILIKE '%N3%'
    `;
    
    const studentResult = await pool.query(studentQuery);
    
    if (studentResult.rows.length === 0) {
      console.log('❌ Student "Ira Das N3" not found in database');
      console.log('\nTip: Check the exact name and roll number in your database');
      return;
    }
    
    const student = studentResult.rows[0];
    console.log(`✅ Found: ${student.name} (${student.roll_number})`);
    console.log(`   Class: ${student.class_name}\n`);
    
    // Get last week's attendance
    const attendanceQuery = `
      SELECT 
        date,
        status,
        TO_CHAR(date, 'Day') as day_name
      FROM attendance
      WHERE student_id = $1
        AND date >= $2
        AND date <= $3
      ORDER BY date DESC
    `;
    
    const attendanceResult = await pool.query(attendanceQuery, [
      student.id,
      lastWeekStart.toISOString().split('T')[0],
      today.toISOString().split('T')[0]
    ]);
    
    if (attendanceResult.rows.length === 0) {
      console.log('📅 No attendance records found for last week');
      return;
    }
    
    console.log('📊 Last Week\'s Attendance:\n');
    console.log('Date       | Day       | Status');
    console.log('-----------|-----------|--------');
    
    let presentCount = 0;
    let absentCount = 0;
    
    attendanceResult.rows.forEach(record => {
      const date = new Date(record.date).toLocaleDateString('en-US', {
        month: 'short',
        day: '2-digit',
        year: 'numeric'
      });
      const status = record.status === 'present' ? '✅ Present' : '❌ Absent';
      
      console.log(`${date} | ${record.day_name.trim().padEnd(9)} | ${status}`);
      
      if (record.status === 'present') presentCount++;
      else absentCount++;
    });
    
    console.log('\n📈 Summary:');
    console.log(`   Total Days: ${attendanceResult.rows.length}`);
    console.log(`   Present: ${presentCount} days`);
    console.log(`   Absent: ${absentCount} days`);
    console.log(`   Attendance Rate: ${((presentCount / attendanceResult.rows.length) * 100).toFixed(1)}%`);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

checkIraAttendance();
