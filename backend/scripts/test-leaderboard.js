// Test Leaderboard API
import dotenv from 'dotenv';
import dataStore from '../storage/dataStore.js';
import { connectPostgres } from '../database/connection.js';

dotenv.config();

async function testLeaderboard() {
  try {
    console.log('🏆 Testing Leaderboard...\n');

    await connectPostgres();
    console.log('✅ Database connected\n');

    // Test all-time leaderboard
    console.log('1️⃣ Testing all-time leaderboard...');
    const allTimeLeaderboard = await dataStore.getLeaderboard({
      start: null,
      end: null,
      useLogs: false
    });
    console.log(`   ✅ Found ${allTimeLeaderboard.length} teachers`);
    console.log('   Top 5:');
    allTimeLeaderboard.slice(0, 5).forEach((teacher, index) => {
      console.log(`   ${index + 1}. ${teacher.name} - ${teacher.totalXP} XP (Level ${teacher.level}, ${teacher.badgesCount} badges)`);
    });
    console.log('');

    // Test weekly leaderboard
    console.log('2️⃣ Testing weekly leaderboard...');
    const now = new Date();
    const weekStart = new Date(now);
    const day = weekStart.getDay();
    const diff = (day === 0 ? 6 : day - 1);
    weekStart.setDate(weekStart.getDate() - diff);
    weekStart.setHours(0, 0, 0, 0);
    
    const weekEnd = new Date(now);
    weekEnd.setHours(23, 59, 59, 999);

    const weeklyLeaderboard = await dataStore.getLeaderboard({
      start: weekStart,
      end: weekEnd,
      useLogs: true
    });
    console.log(`   ✅ Found ${weeklyLeaderboard.length} teachers with activity this week`);
    console.log('   Top 5:');
    weeklyLeaderboard.slice(0, 5).forEach((teacher, index) => {
      console.log(`   ${index + 1}. ${teacher.name} - ${teacher.totalXP} XP (Level ${teacher.level})`);
    });
    console.log('');

    // Test today's leaderboard
    console.log('3️⃣ Testing today\'s leaderboard...');
    const todayStart = new Date(now);
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date(now);
    todayEnd.setHours(23, 59, 59, 999);

    const todayLeaderboard = await dataStore.getLeaderboard({
      start: todayStart,
      end: todayEnd,
      useLogs: true
    });
    console.log(`   ✅ Found ${todayLeaderboard.length} teachers with activity today`);
    console.log('   Top 5:');
    todayLeaderboard.slice(0, 5).forEach((teacher, index) => {
      console.log(`   ${index + 1}. ${teacher.name} - ${teacher.totalXP} XP`);
    });
    console.log('');

    console.log('✅ All leaderboard tests completed!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error('Stack:', error.stack);
    process.exit(1);
  }
}

testLeaderboard();
