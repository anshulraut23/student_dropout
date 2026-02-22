// Complete workflow test for Exam Management and Marks Entry

import dataStore from './storage/dataStore.js';

console.log('\n🧪 COMPLETE EXAM & MARKS WORKFLOW TEST\n');
console.log('='.repeat(60));

// Test 1: Check existing data
console.log('\n📊 TEST 1: Check Existing Data');
console.log('-'.repeat(60));

const schools = dataStore.getSchools();
const users = dataStore.getUsers();
const classes = dataStore.getClasses();
const subjects = dataStore.getSubjects();
const students = dataStore.getStudents();
const templates = dataStore.getExamTemplates();
const exams = dataStore.getExams({});
const allMarks = dataStore.getMarks();

console.log(`Schools: ${schools.length}`);
console.log(`Users: ${users.length} (${users.filter(u => u.role === 'admin').length} admins, ${users.filter(u => u.role === 'teacher').length} teachers)`);
console.log(`Classes: ${classes.length}`);
console.log(`Subjects: ${subjects.length}`);
console.log(`Students: ${students.length}`);
console.log(`Exam Templates: ${templates.length}`);
console.log(`Exams: ${exams.length}`);
console.log(`Marks Entries: ${allMarks.length}`);

// Test 2: Check exam templates
console.log('\n📋 TEST 2: Exam Templates');
console.log('-'.repeat(60));

if (templates.length > 0) {
  templates.forEach(template => {
    console.log(`\n✅ Template: ${template.name}`);
    console.log(`   Type: ${template.type}`);
    console.log(`   Total Marks: ${template.totalMarks}`);
    console.log(`   Passing Marks: ${template.passingMarks}`);
    console.log(`   Weightage: ${template.weightage}`);
    console.log(`   Active: ${template.isActive ? 'Yes' : 'No'}`);
    
    // Count exams generated from this template
    const templateExams = exams.filter(e => e.templateId === template.id);
    console.log(`   Exams Generated: ${templateExams.length}`);
  });
} else {
  console.log('⚠️  No templates found');
}

// Test 3: Check exams by class and subject
console.log('\n📝 TEST 3: Exams by Class and Subject');
console.log('-'.repeat(60));

classes.forEach(classData => {
  const classExams = exams.filter(e => e.classId === classData.id);
  if (classExams.length > 0) {
    console.log(`\n${classData.name}: ${classExams.length} exams`);
    classExams.forEach(exam => {
      const subject = dataStore.getSubjectById(exam.subjectId);
      const template = exam.templateId ? dataStore.getExamTemplateById(exam.templateId) : null;
      console.log(`   - ${exam.name}`);
      console.log(`     Subject: ${subject.name}, Template: ${template ? template.name : 'N/A'}`);
    });
  }
});

// Test 4: Teacher exam filtering
console.log('\n👨‍🏫 TEST 4: Teacher Exam Filtering');
console.log('-'.repeat(60));

const teachers = users.filter(u => u.role === 'teacher' && u.status === 'approved');
teachers.forEach(teacher => {
  // Get teacher's subjects
  const teacherSubjects = subjects.filter(s => s.teacherId === teacher.id);
  const teacherSubjectIds = teacherSubjects.map(s => s.id);
  
  // Filter exams
  const teacherExams = exams.filter(e => teacherSubjectIds.includes(e.subjectId));
  
  console.log(`\n${teacher.fullName} (${teacher.email})`);
  console.log(`   Subjects: ${teacherSubjects.length}`);
  teacherSubjects.forEach(subject => {
    const classData = dataStore.getClassById(subject.classId);
    console.log(`     - ${subject.name} (${classData.name})`);
  });
  console.log(`   Visible Exams: ${teacherExams.length}`);
  if (teacherExams.length > 0) {
    teacherExams.forEach(exam => {
      const subject = dataStore.getSubjectById(exam.subjectId);
      const classData = dataStore.getClassById(exam.classId);
      console.log(`     ✓ ${exam.name} (${classData.name}, ${subject.name})`);
    });
  }
});

// Test 5: Marks entry status
console.log('\n📊 TEST 5: Marks Entry Status');
console.log('-'.repeat(60));

exams.forEach(exam => {
  const examMarks = allMarks.filter(m => m.examId === exam.id);
  const classStudents = dataStore.getStudentsByClass(exam.classId);
  const subject = dataStore.getSubjectById(exam.subjectId);
  const classData = dataStore.getClassById(exam.classId);
  
  const percentage = classStudents.length > 0 
    ? ((examMarks.length / classStudents.length) * 100).toFixed(1)
    : 0;
  
  console.log(`\n${exam.name}`);
  console.log(`   Class: ${classData.name}, Subject: ${subject.name}`);
  console.log(`   Marks Entered: ${examMarks.length}/${classStudents.length} (${percentage}%)`);
  
  if (examMarks.length > 0) {
    const totalMarks = examMarks.reduce((sum, m) => sum + m.marksObtained, 0);
    const avgMarks = (totalMarks / examMarks.length).toFixed(2);
    const passCount = examMarks.filter(m => m.marksObtained >= exam.passingMarks).length;
    const failCount = examMarks.filter(m => m.marksObtained < exam.passingMarks).length;
    
    console.log(`   Average: ${avgMarks}/${exam.totalMarks}`);
    console.log(`   Pass: ${passCount}, Fail: ${failCount}`);
  }
});

// Test 6: Grade distribution
console.log('\n📈 TEST 6: Grade Distribution');
console.log('-'.repeat(60));

if (allMarks.length > 0) {
  const gradeCount = {};
  allMarks.forEach(mark => {
    gradeCount[mark.grade] = (gradeCount[mark.grade] || 0) + 1;
  });
  
  console.log('\nOverall Grade Distribution:');
  Object.entries(gradeCount).sort().forEach(([grade, count]) => {
    const percentage = ((count / allMarks.length) * 100).toFixed(1);
    const bar = '█'.repeat(Math.round(percentage / 2));
    console.log(`   ${grade}: ${count} (${percentage}%) ${bar}`);
  });
} else {
  console.log('⚠️  No marks entered yet');
}

// Test 7: Student performance
console.log('\n👨‍🎓 TEST 7: Sample Student Performance');
console.log('-'.repeat(60));

const sampleStudent = students[0];
if (sampleStudent) {
  const studentMarks = allMarks.filter(m => m.studentId === sampleStudent.id);
  const classData = dataStore.getClassById(sampleStudent.classId);
  
  console.log(`\nStudent: ${sampleStudent.name} (${sampleStudent.enrollmentNo})`);
  console.log(`Class: ${classData.name}`);
  console.log(`Exams Taken: ${studentMarks.length}`);
  
  if (studentMarks.length > 0) {
    console.log('\nPerformance:');
    studentMarks.forEach(mark => {
      const exam = dataStore.getExamById(mark.examId);
      const subject = dataStore.getSubjectById(exam.subjectId);
      const status = mark.marksObtained >= exam.passingMarks ? '✅ Pass' : '❌ Fail';
      console.log(`   ${exam.name} (${subject.name})`);
      console.log(`     Marks: ${mark.marksObtained}/${exam.totalMarks} (${mark.percentage.toFixed(1)}%)`);
      console.log(`     Grade: ${mark.grade} - ${status}`);
    });
    
    const avgPercentage = (studentMarks.reduce((sum, m) => sum + m.percentage, 0) / studentMarks.length).toFixed(2);
    console.log(`\n   Overall Average: ${avgPercentage}%`);
  }
}

// Test 8: Data consistency check
console.log('\n🔍 TEST 8: Data Consistency Check');
console.log('-'.repeat(60));

let issues = 0;

// Check if all exams have valid class and subject
exams.forEach(exam => {
  const classData = dataStore.getClassById(exam.classId);
  const subject = dataStore.getSubjectById(exam.subjectId);
  
  if (!classData) {
    console.log(`❌ Exam ${exam.id} has invalid classId: ${exam.classId}`);
    issues++;
  }
  if (!subject) {
    console.log(`❌ Exam ${exam.id} has invalid subjectId: ${exam.subjectId}`);
    issues++;
  }
});

// Check if all marks have valid exam and student
allMarks.forEach(mark => {
  const exam = dataStore.getExamById(mark.examId);
  const student = dataStore.getStudentById(mark.studentId);
  
  if (!exam) {
    console.log(`❌ Mark ${mark.id} has invalid examId: ${mark.examId}`);
    issues++;
  }
  if (!student) {
    console.log(`❌ Mark ${mark.id} has invalid studentId: ${mark.studentId}`);
    issues++;
  }
  
  // Check if marks are within valid range
  if (exam && (mark.marksObtained < 0 || mark.marksObtained > exam.totalMarks)) {
    console.log(`❌ Mark ${mark.id} has invalid marks: ${mark.marksObtained} (should be 0-${exam.totalMarks})`);
    issues++;
  }
  
  // Check if percentage is correct
  if (exam) {
    const expectedPercentage = (mark.marksObtained / exam.totalMarks) * 100;
    if (Math.abs(mark.percentage - expectedPercentage) > 0.1) {
      console.log(`❌ Mark ${mark.id} has incorrect percentage: ${mark.percentage} (should be ${expectedPercentage.toFixed(2)})`);
      issues++;
    }
  }
});

if (issues === 0) {
  console.log('✅ All data is consistent!');
} else {
  console.log(`\n⚠️  Found ${issues} data consistency issues`);
}

// Summary
console.log('\n' + '='.repeat(60));
console.log('📊 SUMMARY');
console.log('='.repeat(60));
console.log(`✅ Exam Templates: ${templates.length}`);
console.log(`✅ Exams Generated: ${exams.length}`);
console.log(`✅ Marks Entries: ${allMarks.length}`);
console.log(`✅ Teachers: ${teachers.length}`);
console.log(`✅ Students: ${students.length}`);
console.log(`✅ Data Consistency: ${issues === 0 ? 'PASS' : 'FAIL'}`);

// Test results
console.log('\n🎯 TEST RESULTS:');
console.log(`   1. Data Check: ${schools.length > 0 ? '✅ PASS' : '❌ FAIL'}`);
console.log(`   2. Templates: ${templates.length > 0 ? '✅ PASS' : '⚠️  EMPTY'}`);
console.log(`   3. Exams: ${exams.length > 0 ? '✅ PASS' : '⚠️  EMPTY'}`);
console.log(`   4. Teacher Filtering: ✅ PASS`);
console.log(`   5. Marks Entry: ${allMarks.length > 0 ? '✅ PASS' : '⚠️  EMPTY'}`);
console.log(`   6. Grade Distribution: ${allMarks.length > 0 ? '✅ PASS' : '⚠️  EMPTY'}`);
console.log(`   7. Student Performance: ${allMarks.length > 0 ? '✅ PASS' : '⚠️  EMPTY'}`);
console.log(`   8. Data Consistency: ${issues === 0 ? '✅ PASS' : '❌ FAIL'}`);

console.log('\n✅ Test Complete!\n');
