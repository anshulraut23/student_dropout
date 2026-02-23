import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Connect to database
const dbPath = path.join(__dirname, '../storage/education_assistant.db');
const db = new Database(dbPath);

console.log('🔍 Verifying database schema...\n');

try {
  // Check users table columns
  console.log('📋 Checking users table...');
  const userColumns = db.prepare("PRAGMA table_info(users)").all();
  const userColumnNames = userColumns.map(col => col.name);
  
  const requiredUserColumns = ['phone', 'designation', 'address', 'city', 'state', 'pincode', 'profilePicture', 'updatedAt'];
  const missingUserColumns = requiredUserColumns.filter(col => !userColumnNames.includes(col));
  
  if (missingUserColumns.length === 0) {
    console.log('✅ All profile fields present in users table');
  } else {
    console.log('❌ Missing columns in users table:', missingUserColumns.join(', '));
  }

  // Check marks table
  console.log('\n📋 Checking marks table...');
  const marksTableExists = db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='marks'").get();
  
  if (marksTableExists) {
    console.log('✅ Marks table exists');
    
    const marksColumns = db.prepare("PRAGMA table_info(marks)").all();
    const marksColumnNames = marksColumns.map(col => col.name);
    
    const requiredMarksColumns = ['id', 'examId', 'studentId', 'marksObtained', 'totalMarks', 'percentage', 'grade', 'status', 'remarks', 'enteredBy', 'verifiedBy', 'isVerified', 'createdAt', 'updatedAt'];
    const missingMarksColumns = requiredMarksColumns.filter(col => !marksColumnNames.includes(col));
    
    if (missingMarksColumns.length === 0) {
      console.log('✅ All required columns present in marks table');
    } else {
      console.log('❌ Missing columns in marks table:', missingMarksColumns.join(', '));
    }

    // Check indexes
    const marksIndexes = db.prepare("SELECT name FROM sqlite_master WHERE type='index' AND tbl_name='marks'").all();
    console.log('📊 Marks table indexes:', marksIndexes.map(i => i.name).join(', '));
  } else {
    console.log('❌ Marks table does not exist');
  }

  // Check behavior table
  console.log('\n📋 Checking behavior table...');
  const behaviorTableExists = db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='behavior'").get();
  
  if (behaviorTableExists) {
    console.log('✅ Behavior table exists');
    
    const behaviorColumns = db.prepare("PRAGMA table_info(behavior)").all();
    const behaviorColumnNames = behaviorColumns.map(col => col.name);
    
    const requiredBehaviorColumns = ['id', 'studentId', 'teacherId', 'date', 'behaviorType', 'severity', 'category', 'description', 'actionTaken', 'followUpRequired', 'followUpDate', 'createdAt', 'updatedAt'];
    const missingBehaviorColumns = requiredBehaviorColumns.filter(col => !behaviorColumnNames.includes(col));
    
    if (missingBehaviorColumns.length === 0) {
      console.log('✅ All required columns present in behavior table');
    } else {
      console.log('❌ Missing columns in behavior table:', missingBehaviorColumns.join(', '));
    }

    // Check indexes
    const behaviorIndexes = db.prepare("SELECT name FROM sqlite_master WHERE type='index' AND tbl_name='behavior'").all();
    console.log('📊 Behavior table indexes:', behaviorIndexes.map(i => i.name).join(', '));
  } else {
    console.log('❌ Behavior table does not exist');
  }

  // Check audit fields in other tables
  console.log('\n📋 Checking audit fields in other tables...');
  
  const schoolColumns = db.prepare("PRAGMA table_info(schools)").all();
  const schoolColumnNames = schoolColumns.map(col => col.name);
  if (schoolColumnNames.includes('updatedAt')) {
    console.log('✅ schools table has updatedAt field');
  } else {
    console.log('❌ schools table missing updatedAt field');
  }

  const requestColumns = db.prepare("PRAGMA table_info(teacher_requests)").all();
  const requestColumnNames = requestColumns.map(col => col.name);
  if (requestColumnNames.includes('createdAt') && requestColumnNames.includes('updatedAt')) {
    console.log('✅ teacher_requests table has audit fields');
  } else {
    console.log('❌ teacher_requests table missing audit fields');
  }

  console.log('\n✅ Schema verification complete!');

} catch (error) {
  console.error('❌ Verification failed:', error.message);
  console.error(error);
  process.exit(1);
} finally {
  db.close();
}
