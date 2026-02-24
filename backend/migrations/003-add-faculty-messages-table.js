import dotenv from 'dotenv';
import dataStore from '../storage/dataStore.js';

// Load env variables before initializing store
dotenv.config();

console.log('\n🚀 Running Migration: Add Faculty Messages Table\n');

try {
  // Initialize the store to get connection
  await dataStore.initialize();

  // Create faculty_messages table
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS faculty_messages (
      id TEXT PRIMARY KEY,
      sender_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      recipient_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      school_id TEXT NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
      text TEXT NOT NULL,
      attachment_name VARCHAR(255),
      attachment_type VARCHAR(100),
      attachment_data BYTEA,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;

  await dataStore.query(createTableQuery);
  console.log('✅ Created faculty_messages table');

  // Create indexes
  const createIndexes = [
    'CREATE INDEX IF NOT EXISTS idx_faculty_messages_sender_id ON faculty_messages(sender_id)',
    'CREATE INDEX IF NOT EXISTS idx_faculty_messages_recipient_id ON faculty_messages(recipient_id)',
    'CREATE INDEX IF NOT EXISTS idx_faculty_messages_school_id ON faculty_messages(school_id)',
    'CREATE INDEX IF NOT EXISTS idx_faculty_messages_created_at ON faculty_messages(created_at)'
  ];

  for (const indexQuery of createIndexes) {
    await dataStore.query(indexQuery);
  }
  console.log('✅ Created indexes for faculty_messages table');

  console.log('\n✅ Migration completed successfully!\n');
  process.exit(0);
} catch (error) {
  console.error('❌ Migration failed:', error.message);
  process.exit(1);
}
