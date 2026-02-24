import dataStore from './storage/dataStore.js';
import dotenv from 'dotenv';

dotenv.config();

async function testExamTemplates() {
  console.log('=== Testing Exam Templates with PostgreSQL ===\n');

  try {
    // Get all schools
    const schools = await dataStore.getSchools();
    if (schools.length === 0) {
      console.log('❌ No schools found');
      process.exit(1);
    }

    const testSchool = schools[0];
    console.log(`✅ Found test school: ${testSchool.name} (${testSchool.id})`);

    // Test getting exam templates
    console.log('\nTest: Getting exam templates...');
    const templates = await dataStore.getExamTemplates(testSchool.id);
    console.log(`✅ Retrieved ${templates.length} exam templates`);
    
    if (templates.length > 0) {
      console.log('\nSample template:');
      console.log(JSON.stringify(templates[0], null, 2));
    } else {
      console.log('ℹ️  No exam templates found for this school');
    }

    console.log('\n=== Test Completed Successfully! ===');
    process.exit(0);
  } catch (error) {
    console.error('❌ Test failed:', error);
    console.error('Stack:', error.stack);
    process.exit(1);
  }
}

testExamTemplates();
