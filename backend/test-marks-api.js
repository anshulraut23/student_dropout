// Test marks API endpoints
import fetch from 'node-fetch';

async function testMarksAPI() {
  console.log('🧪 Testing Marks API Endpoints\n');
  
  // First, login to get token
  console.log('1️⃣ Logging in...');
  const loginResponse = await fetch('http://localhost:5000/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'gpp@gmail.com', password: '123456' })
  });
  
  const loginData = await loginResponse.json();
  if (!loginData.success) {
    console.log('❌ Login failed:', loginData.error);
    return;
  }
  
  const token = loginData.token;
  console.log('✅ Login successful\n');
  
  // Get exams
  console.log('2️⃣ Getting exams...');
  const examsResponse = await fetch('http://localhost:5000/api/exams', {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  
  const examsData = await examsResponse.json();
  if (!examsData.success || !examsData.exams || examsData.exams.length === 0) {
    console.log('❌ No exams found');
    return;
  }
  
  console.log(`✅ Found ${examsData.exams.length} exams:`);
  examsData.exams.forEach((exam, idx) => {
    console.log(`   ${idx + 1}. ${exam.name} (ID: ${exam.id})`);
    console.log(`      Class: ${exam.className || 'N/A'}`);
    console.log(`      Subject: ${exam.subjectName || 'N/A'}`);
  });
  console.log('');
  
  // Test getMarksByExam for each exam
  for (const exam of examsData.exams) {
    console.log(`3️⃣ Getting marks for exam: ${exam.name}`);
    const marksResponse = await fetch(`http://localhost:5000/api/marks/exam/${exam.id}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    const marksData = await marksResponse.json();
    
    if (marksData.success) {
      console.log(`✅ Response successful`);
      console.log(`   Total students: ${marksData.statistics?.totalStudents || 0}`);
      console.log(`   Marks entered: ${marksData.statistics?.marksEntered || 0}`);
      console.log(`   Average: ${marksData.statistics?.averagePercentage || 0}%`);
      console.log(`   Pass count: ${marksData.statistics?.passCount || 0}`);
      console.log(`   Marks array length: ${marksData.marks?.length || 0}`);
      
      if (marksData.marks && marksData.marks.length > 0) {
        console.log(`   Sample mark:`);
        const sample = marksData.marks[0];
        console.log(`   - Student: ${sample.studentName}`);
        console.log(`   - Marks: ${sample.marksObtained}`);
        console.log(`   - Percentage: ${sample.percentage}%`);
        console.log(`   - Grade: ${sample.grade}`);
      }
    } else {
      console.log(`❌ Failed: ${marksData.error}`);
    }
    console.log('');
  }
  
  // Test getMarksByStudent
  console.log('4️⃣ Getting marks for a student...');
  const studentsResponse = await fetch('http://localhost:5000/api/students', {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  
  const studentsData = await studentsResponse.json();
  if (studentsData.success && studentsData.students && studentsData.students.length > 0) {
    const studentId = studentsData.students[0].id;
    console.log(`   Testing with student: ${studentsData.students[0].name} (${studentId})`);
    
    const studentMarksResponse = await fetch(`http://localhost:5000/api/marks/student/${studentId}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    const studentMarksData = await studentMarksResponse.json();
    
    if (studentMarksData.success) {
      console.log(`✅ Response successful`);
      console.log(`   Total exams: ${studentMarksData.summary?.totalExams || 0}`);
      console.log(`   Average: ${studentMarksData.summary?.averagePercentage || 0}%`);
      console.log(`   Marks array length: ${studentMarksData.marks?.length || 0}`);
      
      if (studentMarksData.marks && studentMarksData.marks.length > 0) {
        console.log(`   Sample mark:`);
        const sample = studentMarksData.marks[0];
        console.log(`   - Exam: ${sample.examName}`);
        console.log(`   - Subject: ${sample.subjectName}`);
        console.log(`   - Marks: ${sample.marksObtained}`);
        console.log(`   - Percentage: ${sample.percentage}%`);
      }
    } else {
      console.log(`❌ Failed: ${studentMarksData.error}`);
    }
  }
}

testMarksAPI().catch(console.error);
