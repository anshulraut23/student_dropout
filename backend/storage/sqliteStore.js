import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create database file in the storage directory
const dbPath = path.join(__dirname, 'education_assistant.db');
const db = new Database(dbPath);

// Enable foreign keys
db.pragma('foreign_keys = ON');

// Initialize database tables
function initializeDatabase() {
  // Schools table
  db.exec(`
    CREATE TABLE IF NOT EXISTS schools (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      address TEXT NOT NULL,
      city TEXT NOT NULL,
      state TEXT NOT NULL,
      phone TEXT NOT NULL,
      adminId TEXT,
      createdAt TEXT NOT NULL
    )
  `);

  // Users table
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      fullName TEXT NOT NULL,
      role TEXT NOT NULL,
      schoolId TEXT NOT NULL,
      status TEXT NOT NULL,
      assignedClasses TEXT,
      createdAt TEXT NOT NULL,
      FOREIGN KEY (schoolId) REFERENCES schools(id)
    )
  `);

  // Teacher requests table
  db.exec(`
    CREATE TABLE IF NOT EXISTS teacher_requests (
      teacherId TEXT PRIMARY KEY,
      schoolId TEXT NOT NULL,
      status TEXT NOT NULL,
      requestedAt TEXT NOT NULL,
      processedAt TEXT,
      FOREIGN KEY (teacherId) REFERENCES users(id),
      FOREIGN KEY (schoolId) REFERENCES schools(id)
    )
  `);

  // Classes table
  db.exec(`
    CREATE TABLE IF NOT EXISTS classes (
      id TEXT PRIMARY KEY,
      schoolId TEXT NOT NULL,
      name TEXT NOT NULL,
      grade TEXT NOT NULL,
      section TEXT,
      academicYear TEXT NOT NULL,
      teacherId TEXT,
      attendanceMode TEXT NOT NULL,
      status TEXT NOT NULL,
      createdAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL,
      FOREIGN KEY (schoolId) REFERENCES schools(id),
      FOREIGN KEY (teacherId) REFERENCES users(id)
    )
  `);

  // Subjects table
  db.exec(`
    CREATE TABLE IF NOT EXISTS subjects (
      id TEXT PRIMARY KEY,
      schoolId TEXT NOT NULL,
      classId TEXT NOT NULL,
      name TEXT NOT NULL,
      teacherId TEXT,
      status TEXT NOT NULL,
      createdAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL,
      FOREIGN KEY (schoolId) REFERENCES schools(id),
      FOREIGN KEY (classId) REFERENCES classes(id),
      FOREIGN KEY (teacherId) REFERENCES users(id)
    )
  `);

  // Students table
  db.exec(`
    CREATE TABLE IF NOT EXISTS students (
      id TEXT PRIMARY KEY,
      classId TEXT NOT NULL,
      name TEXT NOT NULL,
      enrollmentNo TEXT,
      dateOfBirth TEXT,
      gender TEXT,
      contact TEXT,
      email TEXT,
      address TEXT,
      parentName TEXT,
      parentContact TEXT,
      parentEmail TEXT,
      status TEXT NOT NULL,
      createdAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL,
      FOREIGN KEY (classId) REFERENCES classes(id)
    )
  `);

  // Attendance table
  db.exec(`
    CREATE TABLE IF NOT EXISTS attendance (
      id TEXT PRIMARY KEY,
      studentId TEXT NOT NULL,
      classId TEXT NOT NULL,
      subjectId TEXT,
      date TEXT NOT NULL,
      status TEXT NOT NULL,
      markedBy TEXT NOT NULL,
      markedAt TEXT NOT NULL,
      notes TEXT,
      createdAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL,
      FOREIGN KEY (studentId) REFERENCES students(id),
      FOREIGN KEY (classId) REFERENCES classes(id),
      FOREIGN KEY (subjectId) REFERENCES subjects(id),
      FOREIGN KEY (markedBy) REFERENCES users(id)
    )
  `);

  console.log('✅ SQLite database initialized at:', dbPath);
}

// Initialize on import
initializeDatabase();

class SQLiteStore {
  // School operations
  getSchools() {
    const stmt = db.prepare('SELECT * FROM schools');
    return stmt.all();
  }

  addSchool(school) {
    const stmt = db.prepare(`
      INSERT INTO schools (id, name, address, city, state, phone, adminId, createdAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);
    stmt.run(school.id, school.name, school.address, school.city, school.state, school.phone, school.adminId, school.createdAt);
    return school;
  }

  getSchoolById(schoolId) {
    const stmt = db.prepare('SELECT * FROM schools WHERE id = ?');
    return stmt.get(schoolId);
  }

  updateSchool(schoolId, updates) {
    const school = this.getSchoolById(schoolId);
    if (!school) return null;

    const updatedSchool = { ...school, ...updates };
    
    const stmt = db.prepare(`
      UPDATE schools 
      SET name = ?, address = ?, city = ?, state = ?, phone = ?, adminId = ?
      WHERE id = ?
    `);
    stmt.run(
      updatedSchool.name,
      updatedSchool.address,
      updatedSchool.city,
      updatedSchool.state,
      updatedSchool.phone,
      updatedSchool.adminId,
      schoolId
    );
    
    return this.getSchoolById(schoolId);
  }

  // User operations
  getUsers() {
    const stmt = db.prepare('SELECT * FROM users');
    const users = stmt.all();
    return users.map(user => ({
      ...user,
      assignedClasses: user.assignedClasses ? JSON.parse(user.assignedClasses) : []
    }));
  }

  addUser(user) {
    const stmt = db.prepare(`
      INSERT INTO users (id, email, password, fullName, role, schoolId, status, assignedClasses, createdAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    stmt.run(
      user.id, 
      user.email, 
      user.password, 
      user.fullName, 
      user.role, 
      user.schoolId, 
      user.status,
      JSON.stringify(user.assignedClasses || []),
      user.createdAt
    );
    return user;
  }

  getUserByEmail(email) {
    const stmt = db.prepare('SELECT * FROM users WHERE email = ?');
    const user = stmt.get(email);
    if (user) {
      user.assignedClasses = user.assignedClasses ? JSON.parse(user.assignedClasses) : [];
    }
    return user;
  }

  getUserById(userId) {
    const stmt = db.prepare('SELECT * FROM users WHERE id = ?');
    const user = stmt.get(userId);
    if (user) {
      user.assignedClasses = user.assignedClasses ? JSON.parse(user.assignedClasses) : [];
    }
    return user;
  }

  updateUser(userId, updates) {
    const user = this.getUserById(userId);
    if (!user) return null;

    const updatedUser = { ...user, ...updates };
    
    const stmt = db.prepare(`
      UPDATE users 
      SET email = ?, password = ?, fullName = ?, role = ?, schoolId = ?, status = ?, assignedClasses = ?
      WHERE id = ?
    `);
    stmt.run(
      updatedUser.email,
      updatedUser.password,
      updatedUser.fullName,
      updatedUser.role,
      updatedUser.schoolId,
      updatedUser.status,
      JSON.stringify(updatedUser.assignedClasses || []),
      userId
    );
    
    return this.getUserById(userId);
  }

  // Teacher request operations
  getRequests() {
    const stmt = db.prepare('SELECT * FROM teacher_requests');
    return stmt.all();
  }

  addRequest(request) {
    const stmt = db.prepare(`
      INSERT INTO teacher_requests (teacherId, schoolId, status, requestedAt, processedAt)
      VALUES (?, ?, ?, ?, ?)
    `);
    stmt.run(request.teacherId, request.schoolId, request.status, request.requestedAt, request.processedAt);
    return request;
  }

  getRequestsBySchool(schoolId) {
    const stmt = db.prepare('SELECT * FROM teacher_requests WHERE schoolId = ? AND status = ?');
    return stmt.all(schoolId, 'pending');
  }

  updateRequest(teacherId, updates) {
    const stmt = db.prepare(`
      UPDATE teacher_requests 
      SET status = ?, processedAt = ?
      WHERE teacherId = ?
    `);
    stmt.run(updates.status, updates.processedAt, teacherId);
    
    const getStmt = db.prepare('SELECT * FROM teacher_requests WHERE teacherId = ?');
    return getStmt.get(teacherId);
  }

  // Class operations
  getClasses() {
    const stmt = db.prepare('SELECT * FROM classes');
    return stmt.all();
  }

  addClass(classData) {
    const stmt = db.prepare(`
      INSERT INTO classes (id, schoolId, name, grade, section, academicYear, teacherId, attendanceMode, status, createdAt, updatedAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    stmt.run(
      classData.id,
      classData.schoolId,
      classData.name,
      classData.grade,
      classData.section,
      classData.academicYear,
      classData.teacherId,
      classData.attendanceMode,
      classData.status,
      classData.createdAt,
      classData.updatedAt
    );
    return classData;
  }

  getClassById(classId) {
    const stmt = db.prepare('SELECT * FROM classes WHERE id = ?');
    return stmt.get(classId);
  }

  getClassesBySchool(schoolId) {
    const stmt = db.prepare('SELECT * FROM classes WHERE schoolId = ?');
    return stmt.all(schoolId);
  }

  updateClass(classId, updates) {
    const classData = this.getClassById(classId);
    if (!classData) return null;

    const updatedClass = { ...classData, ...updates };
    
    const stmt = db.prepare(`
      UPDATE classes 
      SET name = ?, grade = ?, section = ?, academicYear = ?, teacherId = ?, attendanceMode = ?, status = ?, updatedAt = ?
      WHERE id = ?
    `);
    stmt.run(
      updatedClass.name,
      updatedClass.grade,
      updatedClass.section,
      updatedClass.academicYear,
      updatedClass.teacherId,
      updatedClass.attendanceMode,
      updatedClass.status,
      updatedClass.updatedAt,
      classId
    );
    
    return this.getClassById(classId);
  }

  deleteClass(classId) {
    const stmt = db.prepare('DELETE FROM classes WHERE id = ?');
    const result = stmt.run(classId);
    return result.changes > 0;
  }

  // Subject operations
  getSubjects() {
    const stmt = db.prepare('SELECT * FROM subjects');
    return stmt.all();
  }

  addSubject(subjectData) {
    const stmt = db.prepare(`
      INSERT INTO subjects (id, schoolId, classId, name, teacherId, status, createdAt, updatedAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);
    stmt.run(
      subjectData.id,
      subjectData.schoolId,
      subjectData.classId,
      subjectData.name,
      subjectData.teacherId,
      subjectData.status,
      subjectData.createdAt,
      subjectData.updatedAt
    );
    return subjectData;
  }

  getSubjectById(subjectId) {
    const stmt = db.prepare('SELECT * FROM subjects WHERE id = ?');
    return stmt.get(subjectId);
  }

  getSubjectsByClass(classId) {
    const stmt = db.prepare('SELECT * FROM subjects WHERE classId = ?');
    return stmt.all(classId);
  }

  getSubjectsBySchool(schoolId) {
    const stmt = db.prepare('SELECT * FROM subjects WHERE schoolId = ?');
    return stmt.all(schoolId);
  }

  updateSubject(subjectId, updates) {
    const subject = this.getSubjectById(subjectId);
    if (!subject) return null;

    const updatedSubject = { ...subject, ...updates };
    
    const stmt = db.prepare(`
      UPDATE subjects 
      SET name = ?, teacherId = ?, status = ?, updatedAt = ?
      WHERE id = ?
    `);
    stmt.run(
      updatedSubject.name,
      updatedSubject.teacherId,
      updatedSubject.status,
      updatedSubject.updatedAt,
      subjectId
    );
    
    return this.getSubjectById(subjectId);
  }

  deleteSubject(subjectId) {
    const stmt = db.prepare('DELETE FROM subjects WHERE id = ?');
    const result = stmt.run(subjectId);
    return result.changes > 0;
  }

  // Student operations
  getStudents() {
    const stmt = db.prepare('SELECT * FROM students');
    return stmt.all();
  }

  addStudent(studentData) {
    const stmt = db.prepare(`
      INSERT INTO students (id, classId, name, enrollmentNo, dateOfBirth, gender, contact, email, address, parentName, parentContact, parentEmail, status, createdAt, updatedAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    stmt.run(
      studentData.id,
      studentData.classId,
      studentData.name,
      studentData.enrollmentNo,
      studentData.dateOfBirth,
      studentData.gender,
      studentData.contact,
      studentData.email,
      studentData.address,
      studentData.parentName,
      studentData.parentContact,
      studentData.parentEmail,
      studentData.status,
      studentData.createdAt,
      studentData.updatedAt
    );
    return studentData;
  }

  getStudentById(studentId) {
    const stmt = db.prepare('SELECT * FROM students WHERE id = ?');
    return stmt.get(studentId);
  }

  getStudentsByClass(classId) {
    const stmt = db.prepare('SELECT * FROM students WHERE classId = ?');
    return stmt.all(classId);
  }

  updateStudent(studentId, updates) {
    const student = this.getStudentById(studentId);
    if (!student) return null;

    const updatedStudent = { ...student, ...updates };
    
    const stmt = db.prepare(`
      UPDATE students 
      SET classId = ?, name = ?, enrollmentNo = ?, dateOfBirth = ?, gender = ?, contact = ?, email = ?, address = ?, parentName = ?, parentContact = ?, parentEmail = ?, status = ?, updatedAt = ?
      WHERE id = ?
    `);
    stmt.run(
      updatedStudent.classId,
      updatedStudent.name,
      updatedStudent.enrollmentNo,
      updatedStudent.dateOfBirth,
      updatedStudent.gender,
      updatedStudent.contact,
      updatedStudent.email,
      updatedStudent.address,
      updatedStudent.parentName,
      updatedStudent.parentContact,
      updatedStudent.parentEmail,
      updatedStudent.status,
      updatedStudent.updatedAt,
      studentId
    );
    
    return this.getStudentById(studentId);
  }

  deleteStudent(studentId) {
    const stmt = db.prepare('DELETE FROM students WHERE id = ?');
    const result = stmt.run(studentId);
    return result.changes > 0;
  }

  // Attendance operations
  getAttendance() {
    const stmt = db.prepare('SELECT * FROM attendance');
    return stmt.all();
  }

  addAttendance(attendanceData) {
    const stmt = db.prepare(`
      INSERT INTO attendance (id, studentId, classId, subjectId, date, status, markedBy, markedAt, notes, createdAt, updatedAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    stmt.run(
      attendanceData.id,
      attendanceData.studentId,
      attendanceData.classId,
      attendanceData.subjectId,
      attendanceData.date,
      attendanceData.status,
      attendanceData.markedBy,
      attendanceData.markedAt,
      attendanceData.notes,
      attendanceData.createdAt,
      attendanceData.updatedAt
    );
    return attendanceData;
  }

  getAttendanceById(attendanceId) {
    const stmt = db.prepare('SELECT * FROM attendance WHERE id = ?');
    return stmt.get(attendanceId);
  }

  getAttendanceByStudent(studentId, filters = {}) {
    let query = 'SELECT * FROM attendance WHERE studentId = ?';
    const params = [studentId];
    
    if (filters.startDate) {
      query += ' AND date >= ?';
      params.push(filters.startDate);
    }
    if (filters.endDate) {
      query += ' AND date <= ?';
      params.push(filters.endDate);
    }
    if (filters.subjectId) {
      query += ' AND subjectId = ?';
      params.push(filters.subjectId);
    }
    if (filters.classId) {
      query += ' AND classId = ?';
      params.push(filters.classId);
    }
    
    const stmt = db.prepare(query);
    return stmt.all(...params);
  }

  getAttendanceByClass(classId, filters = {}) {
    let query = 'SELECT * FROM attendance WHERE classId = ?';
    const params = [classId];
    
    if (filters.date) {
      query += ' AND date = ?';
      params.push(filters.date);
    }
    if (filters.startDate) {
      query += ' AND date >= ?';
      params.push(filters.startDate);
    }
    if (filters.endDate) {
      query += ' AND date <= ?';
      params.push(filters.endDate);
    }
    if (filters.subjectId) {
      query += ' AND subjectId = ?';
      params.push(filters.subjectId);
    }
    if (filters.status) {
      query += ' AND status = ?';
      params.push(filters.status);
    }
    
    const stmt = db.prepare(query);
    return stmt.all(...params);
  }

  getAttendanceByDate(date, classId, subjectId = null) {
    let query = 'SELECT * FROM attendance WHERE date = ? AND classId = ?';
    const params = [date, classId];
    
    if (subjectId) {
      query += ' AND subjectId = ?';
      params.push(subjectId);
    } else {
      query += ' AND subjectId IS NULL';
    }
    
    const stmt = db.prepare(query);
    return stmt.all(...params);
  }

  updateAttendance(attendanceId, updates) {
    const attendance = this.getAttendanceById(attendanceId);
    if (!attendance) return null;

    const updatedAttendance = { ...attendance, ...updates };
    
    const stmt = db.prepare(`
      UPDATE attendance 
      SET studentId = ?, classId = ?, subjectId = ?, date = ?, status = ?, markedBy = ?, markedAt = ?, notes = ?, updatedAt = ?
      WHERE id = ?
    `);
    stmt.run(
      updatedAttendance.studentId,
      updatedAttendance.classId,
      updatedAttendance.subjectId,
      updatedAttendance.date,
      updatedAttendance.status,
      updatedAttendance.markedBy,
      updatedAttendance.markedAt,
      updatedAttendance.notes,
      updatedAttendance.updatedAt,
      attendanceId
    );
    
    return this.getAttendanceById(attendanceId);
  }

  deleteAttendance(attendanceId) {
    const stmt = db.prepare('DELETE FROM attendance WHERE id = ?');
    const result = stmt.run(attendanceId);
    return result.changes > 0;
  }
}

export default new SQLiteStore();
