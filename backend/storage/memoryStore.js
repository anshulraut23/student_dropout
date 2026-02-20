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

  // Clear all data
  clear() {
    this.schools = [];
    this.users = [];
    this.requests = [];
    this.classes = [];
    this.subjects = [];
    this.students = [];
  }
}

// Export a singleton instance
export default new MemoryStore();
