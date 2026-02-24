// Test Gamification API
import dotenv from 'dotenv';
import dataStore from '../storage/dataStore.js';
import { connectPostgres } from '../database/connection.js';

dotenv.config();

async function testGamificationAPI() {
  try {
    console.log('🧪 Testing Gamification API...\n');

    // Connect to database
    await connectPostgres();
    console.log('✅ Database connected\n');

    // Get all teachers
    const users = await dataStore.getUsers();
    const teachers = users.filter(u => u.role === 'teacher');
    console.log(`📋 Found ${teachers.length} teachers:`);
    teachers.forEach(t => {
      console.log(`  - ${t.fullName} (ID: ${t.id}, Email: ${t.email})`);
    });
    console.log('');

    if (teachers.length === 0) {
      console.log('❌ No teachers found. Please create a teacher account first.');
      process.exit(1);
    }

    // Test with first teacher
    const testTeacher = teachers[0];
    console.log(`🎯 Testing with teacher: ${testTeacher.fullName} (${testTeacher.id})\n`);

    // Check if teacher has gamification record
    console.log('1️⃣ Checking teacher_gamification record...');
    let stats = await dataStore.getTeacherGamification(testTeacher.id);
    if (!stats) {
      console.log('   ⚠️  No record found. Creating one...');
      stats = await dataStore.createTeacherGamification(testTeacher.id, {});
      console.log('   ✅ Record created:', stats);
    } else {
      console.log('   ✅ Record exists:', stats);
    }
    console.log('');

    // Test awarding XP
    console.log('2️⃣ Testing XP award...');
    try {
      await dataStore.addXPLog({
        teacherId: testTeacher.id,
        actionType: 'attendance',
        xpEarned: 20,
        createdAt: new Date().toISOString()
      });
      console.log('   ✅ XP log added successfully');

      // Update teacher stats
      const newTotalXP = stats.totalXP + 20;
      await dataStore.updateTeacherGamification(testTeacher.id, {
        totalXP: newTotalXP,
        tasksCompleted: stats.tasksCompleted + 1
      });
      console.log('   ✅ Teacher stats updated');

      // Verify update
      const updatedStats = await dataStore.getTeacherGamification(testTeacher.id);
      console.log('   📊 Updated stats:', updatedStats);
    } catch (error) {
      console.error('   ❌ Error awarding XP:', error.message);
      console.error('   Stack:', error.stack);
    }
    console.log('');

    // Test getting XP logs
    console.log('3️⃣ Testing XP logs retrieval...');
    try {
      const logs = await dataStore.getXPLogsForTeacher(testTeacher.id);
      console.log(`   ✅ Found ${logs.length} XP logs`);
      if (logs.length > 0) {
        console.log('   Latest log:', logs[0]);
      }
    } catch (error) {
      console.error('   ❌ Error getting logs:', error.message);
    }
    console.log('');

    // Test badge definitions
    console.log('4️⃣ Testing badge definitions...');
    try {
      const badges = await dataStore.getBadgeDefinitions();
      console.log(`   ✅ Found ${badges.length} badge definitions`);
      badges.forEach(b => {
        console.log(`   - ${b.title} (${b.badgeId})`);
      });
    } catch (error) {
      console.error('   ❌ Error getting badges:', error.message);
    }
    console.log('');

    console.log('✅ All tests completed!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error('Stack:', error.stack);
    process.exit(1);
  }
}

testGamificationAPI();
