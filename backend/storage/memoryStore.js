// In-Memory Data Store - Perfect for development and testing
// No external dependencies required

class MemoryStore {
  constructor() {
    this.schools = [];
    this.users = [];
    this.requests = [];
    this.classes = [];
    this.subjects = [];
    this.students = [];
    this.attendance = [];
    this.examTemplates = [];
    this.examPeriods = [];
    this.exams = [];
    this.marks = [];
  }

  // Schools
  addSchool(school) {
    this.schools.push(school);
    return school;
  }

  getSchools() {
    return [...this.schools];
  }

  getSchoolById(id) {
    return this.schools.find(s => s.id === id);
  }

  updateSchool(id, updates) {
    const school = this.schools.find(s => s.id === id);
    if (school) {
      Object.assign(school, updates);
    }
    return school;
  }

  // Users
  addUser(user) {
    this.users.push(user);
    return user;
  }

  getUsers() {
    return [...this.users];
  }

  getUserById(id) {
    return this.users.find(u => u.id === id);
  }

  getUserByEmail(email) {
    return this.users.find(u => u.email === email);
  }

  updateUser(id, updates) {
    const user = this.users.find(u => u.id === id);
    if (user) {
      Object.assign(user, updates);
    }
    return user;
  }

  getUsersByRole(role) {
    return this.users.filter(u => u.role === role);
  }

  getUsersBySchool(schoolId) {
    return this.users.filter(u => u.schoolId === schoolId);
  }

  // Requests (for approvals)
  addRequest(request) {
    this.requests.push(request);
    return request;
  }

  getRequests() {
    return [...this.requests];
  }

  getRequestById(id) {
    return this.requests.find(r => r.id === id);
  }

  getRequestsByStatus(status) {
    return this.requests.filter(r => r.status === status);
  }

  getRequestsByType(type) {
    return this.requests.filter(r => r.type === type);
  }

  updateRequest(id, updates) {
    const request = this.requests.find(r => r.id === id);
    if (request) {
      Object.assign(request, updates);
    }
    return request;
  }

  // Classes
  addClass(classData) {
    this.classes.push(classData);
    return classData;
  }

  getClasses() {
    return [...this.classes];
  }

  getClassById(id) {
    return this.classes.find(c => c.id === id);
  }

  getClassesBySchool(schoolId) {
    return this.classes.filter(c => c.schoolId === schoolId);
  }

  updateClass(id, updates) {
    const classData = this.classes.find(c => c.id === id);
    if (classData) {
      Object.assign(classData, updates);
    }
    return classData;
  }

  deleteClass(id) {
    this.classes = this.classes.filter(c => c.id !== id);
    return true;
  }

  // Subjects
  addSubject(subject) {
    this.subjects.push(subject);
    return subject;
  }

  getSubjects() {
    return [...this.subjects];
  }

  getSubjectById(id) {
    return this.subjects.find(s => s.id === id);
  }

  getSubjectsBySchool(schoolId) {
    return this.subjects.filter(s => s.schoolId === schoolId);
  }

  getSubjectsByClass(classId) {
    return this.subjects.filter(s => s.classId === classId);
  }

  updateSubject(id, updates) {
    const subject = this.subjects.find(s => s.id === id);
    if (subject) {
      Object.assign(subject, updates);
    }
    return subject;
  }

  deleteSubject(id) {
    this.subjects = this.subjects.filter(s => s.id !== id);
    return true;
  }

  // Students
  addStudent(student) {
    this.students.push(student);
    return student;
  }

  getStudents() {
    return [...this.students];
  }

  getStudentById(id) {
    return this.students.find(s => s.id === id);
  }

  getStudentsByClass(classId) {
    return this.students.filter(s => s.classId === classId);
  }

  updateStudent(id, updates) {
    const student = this.students.find(s => s.id === id);
    if (student) {
      Object.assign(student, updates);
    }
    return student;
  }

  deleteStudent(id) {
    this.students = this.students.filter(s => s.id !== id);
    return true;
  }

  // Attendance
  addAttendance(attendance) {
    this.attendance.push(attendance);
    return attendance;
  }

  getAttendance() {
    return [...this.attendance];
  }

  getAttendanceById(id) {
    return this.attendance.find(a => a.id === id);
  }

  getAttendanceByStudent(studentId, filters = {}) {
    let records = this.attendance.filter(a => a.studentId === studentId);
    
    if (filters.startDate) {
      records = records.filter(a => new Date(a.date) >= new Date(filters.startDate));
    }
    if (filters.endDate) {
      records = records.filter(a => new Date(a.date) <= new Date(filters.endDate));
    }
    if (filters.subjectId) {
      records = records.filter(a => a.subjectId === filters.subjectId);
    }
    if (filters.classId) {
      records = records.filter(a => a.classId === filters.classId);
    }
    
    return records;
  }

  getAttendanceByClass(classId, filters = {}) {
    let records = this.attendance.filter(a => a.classId === classId);
    
    if (filters.date) {
      records = records.filter(a => a.date === filters.date);
    }
    if (filters.startDate) {
      records = records.filter(a => new Date(a.date) >= new Date(filters.startDate));
    }
    if (filters.endDate) {
      records = records.filter(a => new Date(a.date) <= new Date(filters.endDate));
    }
    if (filters.subjectId) {
      records = records.filter(a => a.subjectId === filters.subjectId);
    }
    if (filters.status) {
      records = records.filter(a => a.status === filters.status);
    }
    
    return records;
  }

  getAttendanceByDate(date, classId, subjectId = null) {
    return this.attendance.filter(a => 
      a.date === date && 
      a.classId === classId && 
      (subjectId ? a.subjectId === subjectId : a.subjectId === null)
    );
  }

  updateAttendance(id, updates) {
    const attendance = this.attendance.find(a => a.id === id);
    if (attendance) {
      Object.assign(attendance, updates);
    }
    return attendance;
  }

  deleteAttendance(id) {
    this.attendance = this.attendance.filter(a => a.id !== id);
    return true;
  }

  // Exam Templates
  addExamTemplate(template) {
    this.examTemplates.push(template);
    return template;
  }

  getExamTemplates() {
    return [...this.examTemplates];
  }

  getExamTemplateById(id) {
    return this.examTemplates.find(t => t.id === id);
  }

  getExamTemplatesBySchool(schoolId) {
    return this.examTemplates.filter(t => t.schoolId === schoolId);
  }

  updateExamTemplate(id, updates) {
    const template = this.examTemplates.find(t => t.id === id);
    if (template) {
      Object.assign(template, updates);
    }
    return template;
  }

  deleteExamTemplate(id) {
    this.examTemplates = this.examTemplates.filter(t => t.id !== id);
    return true;
  }

  toggleExamTemplateStatus(id) {
    const template = this.examTemplates.find(t => t.id === id);
    if (template) {
      template.isActive = !template.isActive;
    }
    return template;
  }

  // Exam Periods
  addExamPeriod(period) {
    this.examPeriods.push(period);
    return period;
  }

  getExamPeriods() {
    return [...this.examPeriods];
  }

  getExamPeriodById(id) {
    return this.examPeriods.find(p => p.id === id);
  }

  getExamPeriodsBySchool(schoolId) {
    return this.examPeriods.filter(p => p.schoolId === schoolId);
  }

  updateExamPeriod(id, updates) {
    const period = this.examPeriods.find(p => p.id === id);
    if (period) {
      Object.assign(period, updates);
    }
    return period;
  }

  deleteExamPeriod(id) {
    this.examPeriods = this.examPeriods.filter(p => p.id !== id);
    return true;
  }

  // Exams
  addExam(exam) {
    this.exams.push(exam);
    return exam;
  }

  getExams(filters = {}) {
    let results = [...this.exams];
    
    if (filters.classId) {
      results = results.filter(e => e.classId === filters.classId);
    }
    if (filters.subjectId) {
      results = results.filter(e => e.subjectId === filters.subjectId);
    }
    if (filters.schoolId) {
      results = results.filter(e => e.schoolId === filters.schoolId);
    }
    if (filters.status) {
      results = results.filter(e => e.status === filters.status);
    }
    
    return results;
  }

  getExamById(id) {
    return this.exams.find(e => e.id === id);
  }

  updateExam(id, updates) {
    const exam = this.exams.find(e => e.id === id);
    if (exam) {
      Object.assign(exam, updates);
    }
    return exam;
  }

  deleteExam(id) {
    this.exams = this.exams.filter(e => e.id !== id);
    return true;
  }

  // Marks
  addMarks(marks) {
    this.marks.push(marks);
    return marks;
  }

  getMarks(filters = {}) {
    let results = [...this.marks];
    
    if (filters.examId) {
      results = results.filter(m => m.examId === filters.examId);
    }
    if (filters.studentId) {
      results = results.filter(m => m.studentId === filters.studentId);
    }
    if (filters.classId) {
      results = results.filter(m => m.classId === filters.classId);
    }
    
    return results;
  }

  getMarksById(id) {
    return this.marks.find(m => m.id === id);
  }

  updateMarks(id, updates) {
    const marks = this.marks.find(m => m.id === id);
    if (marks) {
      Object.assign(marks, updates);
    }
    return marks;
  }

  deleteMarks(id) {
    this.marks = this.marks.filter(m => m.id !== id);
    return true;
  }

  // Clear all data
  clear() {
    this.schools = [];
    this.users = [];
    this.requests = [];
    this.classes = [];
    this.subjects = [];
    this.students = [];
    this.attendance = [];
    this.examTemplates = [];
    this.examPeriods = [];
    this.exams = [];
    this.marks = [];
  }
}


// Export a singleton instance
export default new MemoryStore();
