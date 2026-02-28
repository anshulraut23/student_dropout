import 'dotenv/config';
import bcrypt from 'bcryptjs';
import dataStore from '../storage/dataStore.js';
import { generateId } from '../utils/helpers.js';

async function ensureSuperAdminSchema() {
  if (typeof dataStore.query !== 'function') {
    return;
  }

  await dataStore.query('ALTER TABLE users DROP CONSTRAINT IF EXISTS users_role_check', []);
  await dataStore.query("ALTER TABLE users ADD CONSTRAINT users_role_check CHECK (role IN ('super_admin', 'admin', 'teacher'))", []);
  await dataStore.query('ALTER TABLE users ALTER COLUMN school_id DROP NOT NULL', []);
  await dataStore.query('ALTER TABLE schools ADD COLUMN IF NOT EXISTS is_active BOOLEAN NOT NULL DEFAULT true', []);
}

async function seedSuperAdmin() {
  try {
    const email = process.env.SUPER_ADMIN_EMAIL || 'ngo.superadmin@demo.com';
    const password = process.env.SUPER_ADMIN_PASSWORD || 'superadmin123';
    const fullName = process.env.SUPER_ADMIN_NAME || 'NGO Super Admin';

    await ensureSuperAdminSchema();

    const existing = await dataStore.getUserByEmail(email);
    if (existing) {
      console.log('✅ Super admin already exists:', email);
      return;
    }

    // Super admin doesn't belong to any specific school
    const schoolId = null;

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = {
      id: generateId(),
      email,
      password: hashedPassword,
      fullName,
      role: 'super_admin',
      schoolId,
      status: 'approved',
      createdAt: new Date().toISOString()
    };

    await dataStore.addUser(user);

    console.log('✅ Super admin seeded successfully');
    console.log('   Email:', email);
    console.log('   Password:', password);
  } catch (error) {
    console.error('❌ Failed to seed super admin:', error.message);
    process.exit(1);
  }
}

seedSuperAdmin();
