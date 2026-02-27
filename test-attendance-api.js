/**
 * Test Attendance API - Check if attendance data is being saved and retrieved
 */

import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

async function testAttendanceAPI() {
  console.log('\n' + '='.repeat(80));
  console.log('🧪 TESTING ATTENDANCE API');
  console.log('='.repeat(80) + '\n');

  try {
    // Login
    console.log('1️⃣  Logging in...');
    const loginResponse = await axios.post(`${API_URL}/auth/login`, {
      email: 'admin@demo.com',
      password: 'admin123'
    });
    const token = loginResponse.data.token;
    console.log('   ✅ Login successful\n');

    // Get classes
    console.log('2️⃣  Fetching classes...');
    const classesResponse = await axios.get(`${API_URL}/classes/my-classes`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    const classes = classesResponse.data.classes || [];
    console.log(`   ✅ Found ${classes.length} classes\n`);

    if (classes.length === 0) {
      console.log('   ⚠️  No classes found.\n');
      process.exit(1);
    }

    // Test attendance for first class
    const firstClass = classes[0];
    console.log(`3️⃣  Testing attendance for class: ${firstClass.name}`);
    console.log(`   Class ID: ${firstClass.id}\n`);

    // Get attendance for last 30 days
    const endDate = new Date().toISOString().split('T')[0];
    const startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    console.log(`   Date Range: ${startDate} to ${endDate}\n`);

    const attendanceResponse = await axios.get(
      `${API_URL}/attendance/class/${firstClass.id}?startDate=${startDate}&endDate=${endDate}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    const attendanceData = attendanceResponse.data;
    
    console.log('📊 ATTENDANCE DATA:');
    console.log('-'.repeat(80));
    console.log(`   Success: ${attendanceData.success}`);
    console.log(`   Class: ${attendanceData.className}`);
    console.log(`   Total Records: ${attendanceData.totalRecords || 0}`);
    console.log(`   Attendance Array Length: ${attendanceData.attendance?.length || 0}`);
    console.log('');

    if (attendanceData.attendance && attendanceData.attendance.length > 0) {
      console.log('✅ ATTENDANCE RECORDS FOUND!');
      console.log('');
      
      // Group by date
      const byDate = {};
      attendanceData.attendance.forEach(record => {
        if (!byDate[record.date]) {
          byDate[record.date] = {
            date: record.date,
            students: []
          };
        }
        byDate[record.date].students.push({
          name: record.studentName,
          status: record.status
        });
      });

      const dates = Object.keys(byDate).sort().reverse();
      console.log(`   Unique Dates: ${dates.length}`);
      console.log('');

      // Show last 5 dates
      console.log('   Recent Attendance (last 5 dates):');
      dates.slice(0, 5).forEach(date => {
        const dateData = byDate[date];
        const present = dateData.students.filter(s => s.status === 'present').length;
        const absent = dateData.students.filter(s => s.status === 'absent').length;
        const total = dateData.students.length;
        const percentage = total > 0 ? Math.round((present / total) * 100) : 0;
        
        console.log(`   - ${date}: ${present}/${total} present (${percentage}%) - ${absent} absent`);
      });
      console.log('');

      // Show sample records
      console.log('   Sample Records (first 5):');
      attendanceData.attendance.slice(0, 5).forEach(record => {
        console.log(`   - ${record.date}: ${record.studentName} (${record.enrollmentNo}) - ${record.status}`);
      });
    } else {
      console.log('❌ NO ATTENDANCE RECORDS FOUND!');
      console.log('');
      console.log('   This means:');
      console.log('   1. No attendance has been marked for this class, OR');
      console.log('   2. Attendance was marked but not saved to database, OR');
      console.log('   3. There\'s a date range issue');
      console.log('');
      console.log('   Try:');
      console.log('   - Mark attendance for a student');
      console.log('   - Check the browser console for errors');
      console.log('   - Run this test again');
    }

    console.log('');
    console.log('='.repeat(80));
    console.log('TEST COMPLETE');
    console.log('='.repeat(80));
    console.log('');

    process.exit(0);
  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    if (error.response) {
      console.error('Response:', error.response.data);
    }
    process.exit(1);
  }
}

testAttendanceAPI();
