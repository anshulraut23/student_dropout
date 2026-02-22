// Fix exam_templates schema - remove orderSequence requirement

import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, 'storage', 'education_assistant.db');
const db = new Database(dbPath);

console.log('\n🔧 Fixing exam_templates schema...\n');

try {
  // SQLite doesn't support ALTER COLUMN, so we need to recreate the table
  
  // 1. Create new table without orderSequence requirement
  console.log('1. Creating new exam_templates table...');
  db.exec(`
    CREATE TABLE IF NOT EXISTS exam_templates_new (
      id TEXT PRIMARY KEY,
      schoolId TEXT NOT NULL,
      name TEXT NOT NULL,
      type TEXT NOT NULL,
      description TEXT,
      totalMarks INTEGER NOT NULL,
      passingMarks INTEGER NOT NULL,
      weightage REAL NOT NULL,
      isActive INTEGER DEFAULT 1,
      createdAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL,
      FOREIGN KEY (schoolId) REFERENCES schools(id)
    )
  `);
  console.log('✅ New table created');

  // 2. Copy data from old table (if it exists and has data)
  console.log('\n2. Copying existing data...');
  const tableExists = db.prepare(`
    SELECT name FROM sqlite_master WHERE type='table' AND name='exam_templates'
  `).get();
  
  if (tableExists) {
    const count = db.prepare('SELECT COUNT(*) as count FROM exam_templates').get().count;
    console.log(`   Found ${count} existing templates`);
    
    if (count > 0) {
      db.exec(`
        INSERT INTO exam_templates_new (
          id, schoolId, name, type, description, totalMarks, passingMarks,
          weightage, isActive, createdAt, updatedAt
        )
        SELECT 
          id, schoolId, name, type, description, totalMarks, passingMarks,
          weightage, isActive, createdAt, updatedAt
        FROM exam_templates
      `);
      console.log(`✅ Copied ${count} templates`);
    } else {
      console.log('   No data to copy');
    }
    
    // 3. Drop old table
    console.log('\n3. Dropping old table...');
    db.exec('DROP TABLE exam_templates');
    console.log('✅ Old table dropped');
  } else {
    console.log('   No existing table found');
  }

  // 4. Rename new table
  console.log('\n4. Renaming new table...');
  db.exec('ALTER TABLE exam_templates_new RENAME TO exam_templates');
  console.log('✅ Table renamed');

  // 5. Recreate indexes
  console.log('\n5. Creating indexes...');
  db.exec(`
    CREATE INDEX IF NOT EXISTS idx_exam_templates_school ON exam_templates(schoolId);
    CREATE INDEX IF NOT EXISTS idx_exam_templates_active ON exam_templates(isActive);
  `);
  console.log('✅ Indexes created');

  // 6. Update addExamTemplate and updateExamTemplate methods
  console.log('\n6. Schema updated successfully!');
  console.log('\n✅ Migration complete!\n');
  
} catch (error) {
  console.error('❌ Migration failed:', error.message);
  process.exit(1);
} finally {
  db.close();
}
