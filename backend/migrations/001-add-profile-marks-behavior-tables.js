import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Connect to database
const dbPath = path.join(__dirname, '../storage/education_assistant.db');
const db = new Database(dbPath);

// Enable foreign keys
db.pragma('foreign_keys = ON');

console.log('🔄 Running migration: Add profile, marks, and behavior tables...');

try {
  // Start transaction
  db.exec('BEGIN TRANSACTION');

  // 1. Add profile fields to users table
  console.log('📝 Adding profile fields to users table...');
  
  // Check if columns already exist before adding
  const userColumns = db.prepare("PRAGMA table_info(users)").all();
  const existingColumns = userColumns.map(col => col.name);
  
  if (!existingColumns.includes('phone')) {
    db.exec('ALTER TABLE users ADD COLUMN phone TEXT');
  }
  if (!existingColumns.includes('designation')) {
    db.exec('ALTER TABLE users ADD COLUMN designation TEXT');
  }
  if (!existingColumns.includes('address')) {
    db.exec('ALTER TABLE users ADD COLUMN address TEXT');
  }
  if (!existingColumns.includes('city')) {
    db.exec('ALTER TABLE users ADD COLUMN city TEXT');
  }
  if (!existingColumns.includes('state')) {
    db.exec('ALTER TABLE users ADD COLUMN state TEXT');
  }
  if (!existingColumns.includes('pincode')) {
    db.exec('ALTER TABLE users ADD COLUMN pincode TEXT');
  }
  if (!existingColumns.includes('profilePicture')) {
    db.exec('ALTER TABLE users ADD COLUMN profilePicture TEXT');
  }
  if (!existingColumns.includes('updatedAt')) {
    db.exec('ALTER TABLE users ADD COLUMN updatedAt TEXT');
  }

  console.log('✅ Profile fields added to users table');

  // 2. Create marks table (enhanced version)
  console.log('📝 Creating marks table...');
  
  // Drop existing marks table if it exists to recreate with new schema
  db.exec('DROP TABLE IF EXISTS marks');
  
  db.exec(`
    CREATE TABLE marks (
      id TEXT PRIMARY KEY,
      examId TEXT NOT NULL,
      studentId TEXT NOT NULL,
      marksObtained REAL NOT NULL,
      totalMarks REAL NOT NULL,
      percentage REAL,
      grade TEXT,
      status TEXT DEFAULT 'present',
      remarks TEXT,
      enteredBy TEXT NOT NULL,
      verifiedBy TEXT,
      isVerified INTEGER DEFAULT 0,
      createdAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL,
      FOREIGN KEY (examId) REFERENCES exams(id) ON DELETE CASCADE,
      FOREIGN KEY (studentId) REFERENCES students(id) ON DELETE CASCADE,
      FOREIGN KEY (enteredBy) REFERENCES users(id),
      FOREIGN KEY (verifiedBy) REFERENCES users(id),
      UNIQUE(examId, studentId)
    )
  `);

  // Create indexes for marks table
  db.exec(`
    CREATE INDEX IF NOT EXISTS idx_marks_exam ON marks(examId);
    CREATE INDEX IF NOT EXISTS idx_marks_student ON marks(studentId);
    CREATE INDEX IF NOT EXISTS idx_marks_grade ON marks(grade);
    CREATE INDEX IF NOT EXISTS idx_marks_verified ON marks(isVerified);
  `);

  console.log('✅ Marks table created');

  // 3. Create behavior table
  console.log('📝 Creating behavior table...');
  
  db.exec(`
    CREATE TABLE IF NOT EXISTS behavior (
      id TEXT PRIMARY KEY,
      studentId TEXT NOT NULL,
      teacherId TEXT NOT NULL,
      date TEXT NOT NULL,
      behaviorType TEXT NOT NULL CHECK (behaviorType IN ('positive', 'neutral', 'negative')),
      severity TEXT NOT NULL CHECK (severity IN ('low', 'medium', 'high')),
      category TEXT NOT NULL,
      description TEXT NOT NULL,
      actionTaken TEXT,
      followUpRequired INTEGER DEFAULT 0,
      followUpDate TEXT,
      createdAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL,
      FOREIGN KEY (studentId) REFERENCES students(id) ON DELETE CASCADE,
      FOREIGN KEY (teacherId) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  // Create indexes for behavior table
  db.exec(`
    CREATE INDEX IF NOT EXISTS idx_behavior_student ON behavior(studentId);
    CREATE INDEX IF NOT EXISTS idx_behavior_teacher ON behavior(teacherId);
    CREATE INDEX IF NOT EXISTS idx_behavior_date ON behavior(date);
    CREATE INDEX IF NOT EXISTS idx_behavior_type ON behavior(behaviorType);
    CREATE INDEX IF NOT EXISTS idx_behavior_severity ON behavior(severity);
  `);

  console.log('✅ Behavior table created');

  // 4. Add audit fields to tables missing them
  console.log('📝 Adding audit fields to tables...');

  // Check and add createdAt/updatedAt to schools table
  const schoolColumns = db.prepare("PRAGMA table_info(schools)").all();
  const schoolColumnNames = schoolColumns.map(col => col.name);
  
  if (!schoolColumnNames.includes('updatedAt')) {
    db.exec('ALTER TABLE schools ADD COLUMN updatedAt TEXT');
    // Backfill with current timestamp
    db.exec(`UPDATE schools SET updatedAt = createdAt WHERE updatedAt IS NULL`);
  }

  // Check and add to teacher_requests table
  const requestColumns = db.prepare("PRAGMA table_info(teacher_requests)").all();
  const requestColumnNames = requestColumns.map(col => col.name);
  
  if (!requestColumnNames.includes('createdAt')) {
    db.exec('ALTER TABLE teacher_requests ADD COLUMN createdAt TEXT');
    db.exec(`UPDATE teacher_requests SET createdAt = requestedAt WHERE createdAt IS NULL`);
  }
  if (!requestColumnNames.includes('updatedAt')) {
    db.exec('ALTER TABLE teacher_requests ADD COLUMN updatedAt TEXT');
    db.exec(`UPDATE teacher_requests SET updatedAt = requestedAt WHERE updatedAt IS NULL`);
  }

  console.log('✅ Audit fields added to tables');

  // Commit transaction
  db.exec('COMMIT');

  console.log('✅ Migration completed successfully!');
  console.log('\n📊 Summary:');
  console.log('  - Added profile fields to users table (phone, designation, address, city, state, pincode, profilePicture)');
  console.log('  - Created marks table with enhanced schema');
  console.log('  - Created behavior table');
  console.log('  - Added audit fields (createdAt, updatedAt) to tables');

} catch (error) {
  // Rollback on error
  db.exec('ROLLBACK');
  console.error('❌ Migration failed:', error.message);
  console.error(error);
  process.exit(1);
} finally {
  db.close();
}
