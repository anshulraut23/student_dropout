/**
 * Debug Attendance History Page Issue
 */

import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

async function debugAttendanceHistory() {
  console.log('\n' + '='.repeat(80));
  console.log('🔍 DEBUGGING ATTENDANCE HISTORY PAGE');
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
    console.log('2️⃣  Fetching teacher classes...');
    const classesResponse = await axios.get(`${API_URL}/classes/my-classes`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    const classes = classesResponse.data.classes || [];
    console.log(`   ✅ Found ${classes.length} classes\n`);

    if (classes.length === 0) {
      console.log('   ⚠️  No classes found for this teacher.\n');
      process.exit(1);
    }

    // Test each class
    for (const cls of classes) {
      console.log(`3️⃣  Testing class: ${cls.name} (ID: ${cls.id})`);
      console.log('-'.repeat(80));

      // Calculate date range (last 30 days)
      const endDate = new Date().toISOString().split('T')[0];
      const startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      
      console.log(`   Date Range: ${startDate} to ${endDate}`);

      try {
        const response = await axios.get(
          `${API_URL}/attendance/class/${cls.id}?startDate=${startDate}&endDate=${endDate}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        console.log(`   ✅ API Response:`);
        console.log(`   - Success: ${response.data.success}`);
        console.log(`   - Total Records: ${response.data.totalRecords || 0}`);
        console.log(`   - Attendance Array: ${response.data.attendance?.length || 0} records`);

        if (response.data.attendance && response.data.attendance.length > 0) {
          // Group by date
          const byDate = {};
          response.data.attendance.forEach(record => {
            if (!byDate[record.date]) {
              byDate[record.date] = [];
            }
            byDate[record.date].push(record);
          });

          const dates = Object.keys(byDate).sort().reverse();
          console.log(`   - Unique Dates: ${dates.length}`);
          console.log('');
          console.log('   Recent Dates (last 5):');
          dates.slice(0, 5).forEach(date => {
            const records = byDate[date];
            const present = records.filter(r => r.status === 'present').length;
            const absent = records.filter(r => r.status === 'absent').length;
            console.log(`   - ${date}: ${records.length} students (${present} present, ${absent} absent)`);
          });
          console.log('');
        } else {
          console.log('   ⚠️  No attendance records found for this class in the date range');
          console.log('');
          
          // Try without date filter
          console.log('   Trying without date filter...');
          const allResponse = await axios.get(
            `${API_URL}/attendance/class/${cls.id}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          
          console.log(`   - Total Records (all time): ${allResponse.data.attendance?.length || 0}`);
          
          if (allResponse.data.attendance && allResponse.data.attendance.length > 0) {
            console.log('   ✅ Found records without date filter!');
            console.log('   Issue: Records are outside the 30-day range');
            
            // Show date range of records
            const dates = allResponse.data.attendance.map(r => r.date).sort();
            console.log(`   Oldest record: ${dates[0]}`);
            console.log(`   Newest record: ${dates[dates.length - 1]}`);
          } else {
            console.log('   ❌ No records found even without date filter');
            console.log('   Issue: No attendance has been marked for this class');
          }
          console.log('');
        }
      } catch (error) {
        console.log(`   ❌ Error: ${error.message}`);
        if (error.response) {
          console.log(`   Response: ${JSON.stringify(error.response.data)}`);
        }
        console.log('');
      }
    }

    console.log('='.repeat(80));
    console.log('📋 SUMMARY');
    console.log('='.repeat(80));
    console.log('');
    console.log('If attendance shows in Risk tab but NOT in Attendance History:');
    console.log('1. Check if records are outside the 30-day date range');
    console.log('2. Check if student belongs to the correct class');
    console.log('3. Check if class ID matches between student and attendance records');
    console.log('4. Verify the attendance records have the correct date format');
    console.log('');
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

debugAttendanceHistory();
