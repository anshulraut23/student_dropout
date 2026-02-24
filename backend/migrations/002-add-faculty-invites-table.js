import dotenv from 'dotenv';
import dataStore from '../storage/dataStore.js';

// Load env variables before initializing store
dotenv.config();

console.log('\n🚀 Running Migration: Add Faculty Invites Table\n');

try {
  // Initialize the store to get connection
  await dataStore.initialize();

  // Create faculty_invites table
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS faculty_invites (
      id TEXT PRIMARY KEY,
      sender_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      recipient_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      school_id TEXT NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
      status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected')),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;

  await dataStore.query(createTableQuery);
  console.log('✅ Created faculty_invites table');

  // Create indexes
  const createIndexes = [
    'CREATE INDEX IF NOT EXISTS idx_faculty_invites_sender_id ON faculty_invites(sender_id)',
    'CREATE INDEX IF NOT EXISTS idx_faculty_invites_recipient_id ON faculty_invites(recipient_id)',
    'CREATE INDEX IF NOT EXISTS idx_faculty_invites_school_id ON faculty_invites(school_id)',
    'CREATE INDEX IF NOT EXISTS idx_faculty_invites_status ON faculty_invites(status)'
  ];

  for (const indexQuery of createIndexes) {
    await dataStore.query(indexQuery);
  }
  console.log('✅ Created indexes for faculty_invites table');

  console.log('\n✅ Migration completed successfully!\n');
  process.exit(0);
} catch (error) {
  console.error('❌ Migration failed:', error.message);
  process.exit(1);
}
