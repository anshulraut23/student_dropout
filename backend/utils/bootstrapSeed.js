import bcrypt from 'bcryptjs';
import dataStore from '../storage/dataStore.js';

const generateId = (prefix) => `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;

export async function seedDefaultDataIfEmpty() {
  const existingSchools = dataStore.getSchools();
  const existingUsers = dataStore.getUsers();

  if (existingSchools.length > 0 || existingUsers.length > 0) {
    return { seeded: false };
  }

  const now = new Date().toISOString();
  const hashedPassword = await bcrypt.hash('admin123', 10);

  const school = {
    id: generateId('school'),
    name: 'Sunrise High School',
    address: '123 Education Street',
    city: 'Mumbai',
    state: 'Maharashtra',
    phone: '022-12345678',
    adminId: null,
    createdAt: now
  };

  const admin = {
    id: generateId('user'),
    email: 'admin@sunrise.edu',
    password: hashedPassword,
    fullName: 'Admin User',
    role: 'admin',
    schoolId: school.id,
    status: 'active',
    assignedClasses: [],
    createdAt: now
  };

  dataStore.addSchool(school);
  dataStore.addUser(admin);
  dataStore.updateSchool(school.id, { adminId: admin.id });

  const teachers = [
    { name: 'Rajesh Kumar', email: 'rajesh@sunrise.edu' },
    { name: 'Priya Sharma', email: 'priya@sunrise.edu' },
    { name: 'Amit Patel', email: 'amit@sunrise.edu' },
    { name: 'Sneha Desai', email: 'sneha@sunrise.edu' }
  ];

  for (const teacherData of teachers) {
    dataStore.addUser({
      id: generateId('user'),
      email: teacherData.email,
      password: hashedPassword,
      fullName: teacherData.name,
      role: 'teacher',
      schoolId: school.id,
      status: 'active',
      assignedClasses: [],
      createdAt: now
    });
  }

  return {
    seeded: true,
    school: school.name,
    credentials: {
      password: 'admin123',
      teachers: teachers.map(t => t.email),
      admin: admin.email
    }
  };
}
