import dataStore from './storage/dataStore.js';
import { generateId } from './utils/helpers.js';

async function testBehaviorAndInterventions() {
  console.log('🧪 Testing Behavior and Interventions Implementation\n');

  try {
    // Initialize the store
    await dataStore.initialize();
    console.log('✅ Database connection established\n');

    // Test 1: Check if behavior methods exist
    console.log('📋 Test 1: Checking behavior methods...');
    const behaviorMethods = ['addBehavior', 'getBehaviors', 'getBehaviorById', 'updateBehavior', 'deleteBehavior'];
    for (const method of behaviorMethods) {
      if (typeof dataStore[method] === 'function') {
        console.log(`  ✅ ${method} exists`);
      } else {
        console.log(`  ❌ ${method} missing`);
      }
    }
    console.log('');

    // Test 2: Check if intervention methods exist
    console.log('📋 Test 2: Checking intervention methods...');
    const interventionMethods = ['addIntervention', 'getInterventions', 'getInterventionById', 'updateIntervention', 'deleteIntervention'];
    for (const method of interventionMethods) {
      if (typeof dataStore[method] === 'function') {
        console.log(`  ✅ ${method} exists`);
      } else {
        console.log(`  ❌ ${method} missing`);
      }
    }
    console.log('');

    // Test 3: Try to get behaviors (should work even if empty)
    console.log('📋 Test 3: Testing getBehaviors...');
    try {
      const behaviors = await dataStore.getBehaviors();
      console.log(`  ✅ getBehaviors works - found ${behaviors.length} records`);
    } catch (error) {
      console.log(`  ❌ getBehaviors failed: ${error.message}`);
    }
    console.log('');

    // Test 4: Try to get interventions (should work even if empty)
    console.log('📋 Test 4: Testing getInterventions...');
    try {
      const interventions = await dataStore.getInterventions();
      console.log(`  ✅ getInterventions works - found ${interventions.length} records`);
    } catch (error) {
      console.log(`  ❌ getInterventions failed: ${error.message}`);
    }
    console.log('');

    console.log('🎉 All tests completed!\n');
    console.log('Next steps:');
    console.log('1. Run the migration: node run-behavior-intervention-migration.js');
    console.log('2. Start the backend server: npm start');
    console.log('3. Test the frontend behavior and interventions tabs');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error(error);
  } finally {
    process.exit(0);
  }
}

testBehaviorAndInterventions();
