// In-memory data store (simulating localStorage for backend)
// This will be replaced with a database later

class DataStore {
  constructor() {
    this.schools = [];
    this.users = [];
    this.teacherRequests = [];
    this.classes = [];
  }

  // School operations
  getSchools() {
    return this.schools;
  }

  addSchool(school) {
    this.schools.push(school);
    return school;
  }

  getSchoolById(schoolId) {
    return this.schools.find(s => s.id === schoolId);
  }

  // User operations
  getUsers() {
    return this.users;
  }

  addUser(user) {
    this.users.push(user);
    return user;
  }

  getUserByEmail(email) {
    return this.users.find(u => u.email === email);
  }

  getUserById(userId) {
    return this.users.find(u => u.id === userId);
  }

  updateUser(userId, updates) {
    const index = this.users.findIndex(u => u.id === userId);
    if (index !== -1) {
      this.users[index] = { ...this.users[index], ...updates };
      return this.users[index];
    }
    return null;
  }

  // Teacher request operations
  getRequests() {
    return this.teacherRequests;
  }

  addRequest(request) {
    this.teacherRequests.push(request);
    return request;
  }

  getRequestsBySchool(schoolId) {
    return this.teacherRequests.filter(r => r.schoolId === schoolId && r.status === 'pending');
  }

  updateRequest(teacherId, updates) {
    const index = this.teacherRequests.findIndex(r => r.teacherId === teacherId);
    if (index !== -1) {
      this.teacherRequests[index] = { ...this.teacherRequests[index], ...updates };
      return this.teacherRequests[index];
    }
    return null;
  }

  // Class operations
  getClasses() {
    return this.classes;
  }

  addClass(classData) {
    this.classes.push(classData);
    return classData;
  }

  getClassById(classId) {
    return this.classes.find(c => c.id === classId);
  }

  getClassesBySchool(schoolId) {
    return this.classes.filter(c => c.schoolId === schoolId);
  }

  updateClass(classId, updates) {
    const index = this.classes.findIndex(c => c.id === classId);
    if (index !== -1) {
      this.classes[index] = { ...this.classes[index], ...updates };
      return this.classes[index];
    }
    return null;
  }

  deleteClass(classId) {
    const index = this.classes.findIndex(c => c.id === classId);
    if (index !== -1) {
      this.classes.splice(index, 1);
      return true;
    }
    return false;
  }
}

export default new DataStore();
