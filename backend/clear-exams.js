// Clear all exams, marks, templates, and periods data

import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, 'storage', 'education_assistant.db');
const db = new Database(dbPath);

console.log('\n🗑️  Clearing Exams and Templates Data...\n');

try {
  // Get counts before deletion
  const examCount = db.prepare('SELECT COUNT(*) as count FROM exams').get().count;
  const marksCount = db.prepare('SELECT COUNT(*) as count FROM marks').get().count;
  const templateCount = db.prepare('SELECT COUNT(*) as count FROM exam_templates').get().count;
  const periodCount = db.prepare('SELECT COUNT(*) as count FROM exam_periods').get().count;

  console.log('📊 Current Data:');
  console.log(`   Exams: ${examCount}`);
  console.log(`   Marks: ${marksCount}`);
  console.log(`   Templates: ${templateCount}`);
  console.log(`   Periods: ${periodCount}\n`);

  // Delete in correct order (respecting foreign keys)
  console.log('🗑️  Deleting data...');

  // 1. Delete marks first (depends on exams)
  db.prepare('DELETE FROM marks').run();
  console.log('   ✅ Deleted all marks');

  // 2. Delete exams (depends on templates and periods)
  db.prepare('DELETE FROM exams').run();
  console.log('   ✅ Deleted all exams');

  // 3. Delete periods (depends on templates)
  db.prepare('DELETE FROM exam_periods').run();
  console.log('   ✅ Deleted all exam periods');

  // 4. Delete templates (no dependencies)
  db.prepare('DELETE FROM exam_templates').run();
  console.log('   ✅ Deleted all exam templates');

  // 5. Delete grade configs (optional)
  db.prepare('DELETE FROM grade_config').run();
  console.log('   ✅ Deleted all grade configs');

  console.log('\n✅ All exam-related data cleared!\n');
  console.log('📊 Summary:');
  console.log(`   ${examCount} exams deleted`);
  console.log(`   ${marksCount} marks deleted`);
  console.log(`   ${templateCount} templates deleted`);
  console.log(`   ${periodCount} periods deleted\n`);

  console.log('🎯 Next Steps:');
  console.log('   1. Login as admin');
  console.log('   2. Go to Exam Templates');
  console.log('   3. Create new templates');
  console.log('   4. System will auto-generate exams\n');

} catch (error) {
  console.error('\n❌ Error:', error.message);
  console.error(error.stack);
  process.exit(1);
} finally {
  db.close();
}
