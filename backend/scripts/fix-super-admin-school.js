import 'dotenv/config';
import dataStore from '../storage/dataStore.js';

async function fixSuperAdminSchoolId() {
  try {
    const email = 'ngo.superadmin@demo.com';
    
    console.log('🔧 Making school_id column nullable...');
    await dataStore.query(
      'ALTER TABLE users ALTER COLUMN school_id DROP NOT NULL',
      []
    );
    console.log('✅ Schema updated');
    
    console.log('🔧 Fixing super admin schoolId...');
    
    // Update super admin to have null schoolId
    const result = await dataStore.query(
      'UPDATE users SET school_id = NULL WHERE email = $1 AND role = $2 RETURNING *',
      [email, 'super_admin']
    );
    
    if (result.rows.length > 0) {
      console.log('✅ Super admin schoolId fixed successfully');
      console.log('   Email:', email);
      console.log('   School ID: null');
    } else {
      console.log('❌ Super admin not found');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Failed to fix super admin:', error.message);
    process.exit(1);
  }
}

fixSuperAdminSchoolId();
