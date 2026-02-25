// Test submitting marks
import fetch from 'node-fetch';

async function testSubmitMarks() {
  console.log('🧪 Testing Marks Submission\n');
  
  // Login
  console.log('1️⃣ Logging in...');
  const loginResponse = await fetch('http://localhost:5000/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'gpp@gmail.com', password: '123456' })
  });
  
  const loginData = await loginResponse.json();
  if (!loginData.success) {
    console.log('❌ Login failed');
    return;
  }
  
  const token = loginData.token;
  console.log('✅ Login successful\n');
  
  // Use exam from list
  console.log('2️⃣ Getting exams list...');
  const examsListResponse = await fetch('http://localhost:5000/api/exams', {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  
  const examsListData = await examsListResponse.json();
  if (!examsListData.success || examsListData.exams.length === 0) {
    console.log('❌ No exams found');
    return;
  }
  
  const examData = { exam: examsListData.exams[0] };
  const examId = examData.exam.id;
  
  console.log(`✅ Exam: ${examData.exam.name}`);
  console.log(`   Class: ${examData.exam.className}`);
  console.log(`   Total marks: ${examData.exam.totalMarks}\n`);
  
  // Get students
  console.log('3️⃣ Getting students...');
  const studentsResponse = await fetch(`http://localhost:5000/api/students?classId=${examData.exam.classId}`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  
  const studentsData = await studentsResponse.json();
  if (!studentsData.success || studentsData.students.length === 0) {
    console.log('❌ No students found');
    return;
  }
  
  console.log(`✅ Found ${studentsData.students.length} students\n`);
  
  // Prepare marks for first 3 students
  const marks = studentsData.students.slice(0, 3).map((student, idx) => ({
    studentId: student.id,
    marksObtained: 20 + (idx * 3), // 20, 23, 26
    status: 'submitted', // Changed from 'present' to 'submitted'
    remarks: 'Test marks'
  }));
  
  console.log('4️⃣ Submitting marks...');
  console.log(`   Students: ${marks.length}`);
  marks.forEach((m, idx) => {
    const student = studentsData.students[idx];
    console.log(`   - ${student.name}: ${m.marksObtained}/${examData.exam.totalMarks}`);
  });
  console.log('');
  
  const submitResponse = await fetch('http://localhost:5000/api/marks/bulk', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      examId: examId,
      marks: marks
    })
  });
  
  const submitData = await submitResponse.json();
  
  console.log('5️⃣ Submission result:');
  if (submitData.success) {
    console.log(`✅ Success!`);
    console.log(`   Entered: ${submitData.entered}`);
    console.log(`   Failed: ${submitData.failed}`);
    if (submitData.errors && submitData.errors.length > 0) {
      console.log(`   Errors:`);
      submitData.errors.forEach(err => {
        console.log(`   - Student ${err.studentId}: ${err.error}`);
      });
    }
  } else {
    console.log(`❌ Failed: ${submitData.error}`);
  }
  console.log('');
  
  // Verify marks were saved
  console.log('6️⃣ Verifying marks were saved...');
  const verifyResponse = await fetch(`http://localhost:5000/api/marks/exam/${examId}`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  
  const verifyData = await verifyResponse.json();
  if (verifyData.success) {
    console.log(`✅ Marks count: ${verifyData.marks.length}`);
    console.log(`   Average: ${verifyData.statistics.averagePercentage}%`);
    console.log(`   Pass count: ${verifyData.statistics.passCount}`);
  } else {
    console.log(`❌ Failed to verify`);
  }
}

testSubmitMarks().catch(console.error);
