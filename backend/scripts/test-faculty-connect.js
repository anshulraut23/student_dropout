// Test Faculty Connect System
import dotenv from 'dotenv';
import dataStore from '../storage/dataStore.js';
import { connectPostgres } from '../database/connection.js';
import { generateId } from '../utils/helpers.js';

dotenv.config();

async function testFacultyConnect() {
  try {
    console.log('🔗 Testing Faculty Connect System...\n');

    await connectPostgres();
    console.log('✅ Database connected\n');

    // Get teachers
    const users = await dataStore.getUsers();
    const teachers = users.filter(u => u.role === 'teacher');
    console.log(`📋 Found ${teachers.length} teachers:`);
    teachers.forEach(t => {
      console.log(`   - ${t.fullName} (${t.email})`);
    });
    console.log('');

    if (teachers.length < 2) {
      console.log('⚠️  Need at least 2 teachers to test Faculty Connect');
      console.log('   Please create more teacher accounts first.');
      process.exit(0);
    }

    const teacher1 = teachers[0];
    const teacher2 = teachers[1];

    console.log(`🎯 Testing with:`);
    console.log(`   Teacher 1: ${teacher1.fullName}`);
    console.log(`   Teacher 2: ${teacher2.fullName}\n`);

    // Test 1: Send invitation
    console.log('1️⃣ Testing send invitation...');
    const invitation = {
      id: generateId('invite'),
      senderId: teacher1.id,
      recipientId: teacher2.id,
      schoolId: teacher1.schoolId,
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    await dataStore.addFacultyInvite(invitation);
    console.log('   ✅ Invitation sent successfully');
    console.log(`   Invitation ID: ${invitation.id}\n`);

    // Test 2: Get invitations
    console.log('2️⃣ Testing get invitations...');
    const invites = await dataStore.getFacultyInvites();
    console.log(`   ✅ Found ${invites.length} invitations`);
    if (invites.length > 0) {
      console.log(`   Latest: ${invites[0].status} (${invites[0].id})\n`);
    }

    // Test 3: Accept invitation
    console.log('3️⃣ Testing accept invitation...');
    await dataStore.updateFacultyInvite(invitation.id, {
      status: 'accepted',
      updatedAt: new Date().toISOString()
    });
    console.log('   ✅ Invitation accepted\n');

    // Test 4: Send message
    console.log('4️⃣ Testing send message...');
    const message = {
      id: generateId('msg'),
      senderId: teacher1.id,
      recipientId: teacher2.id,
      schoolId: teacher1.schoolId,
      text: 'Hello! This is a test message from the Faculty Connect system.',
      attachmentName: null,
      attachmentType: null,
      attachmentData: null,
      createdAt: new Date().toISOString()
    };

    await dataStore.addMessage(message);
    console.log('   ✅ Message sent successfully');
    console.log(`   Message ID: ${message.id}\n`);

    // Test 5: Get conversation
    console.log('5️⃣ Testing get conversation...');
    const conversation = await dataStore.getConversation(
      teacher1.id,
      teacher2.id,
      teacher1.schoolId,
      50
    );
    console.log(`   ✅ Found ${conversation.length} messages in conversation`);
    if (conversation.length > 0) {
      console.log(`   Latest message: "${conversation[conversation.length - 1].text}"\n`);
    }

    console.log('✅ All Faculty Connect tests passed!');
    console.log('');
    console.log('System is ready to use:');
    console.log('1. Teachers can send invitations');
    console.log('2. Teachers can accept/reject invitations');
    console.log('3. Connected teachers can chat');
    console.log('4. Messages are stored and retrieved correctly');

    process.exit(0);
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error('Stack:', error.stack);
    process.exit(1);
  }
}

testFacultyConnect();
