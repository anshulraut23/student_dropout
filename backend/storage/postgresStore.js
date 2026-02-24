// PostgreSQL Store for Supabase
import pg from 'pg';
const { Pool } = pg;

class PostgresStore {
  constructor() {
    this.pool = null;
    this.initialized = false;
  }

  async initialize() {
    if (this.initialized) return;

    const connectionString = process.env.DATABASE_URL;
    
    if (!connectionString) {
      throw new Error('DATABASE_URL environment variable is not set');
    }

    this.pool = new Pool({
      connectionString: connectionString,
      ssl: false,
      max: 1, // Only 1 connection at a time
      min: 0, // No minimum connections
      idleTimeoutMillis: 1000, // Close idle connections after 1 second
      connectionTimeoutMillis: 10000,
      allowExitOnIdle: true, // Allow process to exit when idle
    });

    this.pool.on('error', (err) => {
      console.error('Unexpected error on idle client', err);
    });

    // Test connection
    await this.testConnection();
    this.initialized = true;
  }

  async testConnection() {
    try {
      const result = await this.pool.query('SELECT NOW()');
      console.log('✅ PostgreSQL connected successfully');
      return true;
    } catch (error) {
      console.error('❌ PostgreSQL connection failed:', error.message);
      throw error;
    }
  }

  async query(text, params) {
    await this.initialize();
    
    const start = Date.now();
    try {
      const res = await this.pool.query(text, params);
      const duration = Date.now() - start;
      console.log('Executed query', { text: text.substring(0, 50) + '...', duration, rows: res.rowCount });
      return res;
    } catch (error) {
      console.error('Query error:', error);
      throw error;
    }
  }

  // Schools
  async addSchool(school) {
    const query = `
      INSERT INTO schools (id, name, address, city, state, phone, email, website, admin_id, created_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *
    `;
    const values = [
      school.id, school.name, school.address, school.city, school.state,
      school.phone, school.email || null, school.website || null,
      school.adminId || null, school.createdAt
    ];
    const result = await this.query(query, values);
    return result.rows[0];
  }

  async getSchools() {
    const result = await this.query('SELECT * FROM schools');
    return result.rows;
  }

  async getSchoolById(id) {
    const result = await this.query('SELECT * FROM schools WHERE id = $1', [id]);
    return result.rows[0];
  }

  async updateSchool(id, updates) {
    // Convert camelCase to snake_case for database columns
    const convertToSnakeCase = (str) => str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
    const fields = Object.keys(updates).map((key, i) => `${convertToSnakeCase(key)} = $${i + 2}`).join(', ');
    const values = [id, ...Object.values(updates)];
    const result = await this.query(`UPDATE schools SET ${fields} WHERE id = $1 RETURNING *`, values);
    return result.rows[0];
  }

  // Users
  async addUser(user) {
    const query = `
      INSERT INTO users (id, email, password, full_name, role, school_id, status, subject, created_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *
    `;
    const values = [
      user.id, user.email, user.password, user.fullName, user.role,
      user.schoolId, user.status, user.subject || null, user.createdAt
    ];
    const result = await this.query(query, values);
    return result.rows[0];
  }

  async getUsers() {
    const result = await this.query('SELECT * FROM users');
    return result.rows.map(row => ({
      ...row,
      fullName: row.full_name,
      schoolId: row.school_id,
      createdAt: row.created_at
    }));
  }

  async getUserById(id) {
    const result = await this.query('SELECT * FROM users WHERE id = $1', [id]);
    if (!result.rows[0]) return null;
    const row = result.rows[0];
    return {
      ...row,
      fullName: row.full_name,
      schoolId: row.school_id,
      createdAt: row.created_at
    };
  }

  async getUserByEmail(email) {
    const result = await this.query('SELECT * FROM users WHERE email = $1', [email]);
    if (!result.rows[0]) return null;
    const row = result.rows[0];
    return {
      ...row,
      fullName: row.full_name,
      schoolId: row.school_id,
      createdAt: row.created_at
    };
  }

  async updateUser(id, updates) {
    const fields = Object.keys(updates).map((key, i) => `${key} = $${i + 2}`).join(', ');
    const values = [id, ...Object.values(updates)];
    const result = await this.query(`UPDATE users SET ${fields} WHERE id = $1 RETURNING *`, values);
    return result.rows[0];
  }

  async getUsersByRole(role) {
    const result = await this.query('SELECT * FROM users WHERE role = $1', [role]);
    return result.rows.map(row => ({
      ...row,
      fullName: row.full_name,
      schoolId: row.school_id,
      createdAt: row.created_at
    }));
  }

  async getUsersBySchool(schoolId) {
    const result = await this.query('SELECT * FROM users WHERE school_id = $1', [schoolId]);
    return result.rows.map(row => ({
      ...row,
      fullName: row.full_name,
      schoolId: row.school_id,
      createdAt: row.created_at
    }));
  }

  // Requests
  async addRequest(request) {
    const query = `
      INSERT INTO requests (id, teacher_id, school_id, type, status, created_at)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `;
    const values = [request.id, request.teacherId, request.schoolId, request.type, request.status, request.createdAt];
    const result = await this.query(query, values);
    return result.rows[0];
  }

  async getRequests() {
    const result = await this.query('SELECT * FROM requests');
    return result.rows.map(row => ({
      ...row,
      teacherId: row.teacher_id,
      schoolId: row.school_id,
      createdAt: row.created_at,
      processedAt: row.processed_at
    }));
  }

  async getRequestsBySchool(schoolId) {
    const result = await this.query('SELECT * FROM requests WHERE school_id = $1', [schoolId]);
    return result.rows.map(row => ({
      ...row,
      teacherId: row.teacher_id,
      schoolId: row.school_id,
      createdAt: row.created_at,
      processedAt: row.processed_at
    }));
  }

  async updateRequest(id, updates) {
    const fields = Object.keys(updates).map((key, i) => `${key} = $${i + 2}`).join(', ');
    const values = [id, ...Object.values(updates)];
    const result = await this.query(`UPDATE requests SET ${fields} WHERE id = $1 RETURNING *`, values);
    return result.rows[0];
  }

  // Classes
  async addClass(classData) {
    const query = `
      INSERT INTO classes (id, school_id, name, grade, section, academic_year, teacher_id, attendance_mode, status, created_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *
    `;
    const values = [
      classData.id, classData.schoolId, classData.name, classData.grade, classData.section,
      classData.academicYear, classData.teacherId || null, classData.attendanceMode,
      classData.status, classData.createdAt
    ];
    const result = await this.query(query, values);
    return result.rows[0];
  }

  async getClasses() {
    const result = await this.query('SELECT * FROM classes');
    return result.rows.map(row => ({
      ...row,
      schoolId: row.school_id,
      teacherId: row.teacher_id,
      academicYear: row.academic_year,
      attendanceMode: row.attendance_mode,
      createdAt: row.created_at
    }));
  }

  async getClassById(id) {
    const result = await this.query('SELECT * FROM classes WHERE id = $1', [id]);
    if (!result.rows[0]) return null;
    const row = result.rows[0];
    return {
      ...row,
      schoolId: row.school_id,
      teacherId: row.teacher_id,
      academicYear: row.academic_year,
      attendanceMode: row.attendance_mode,
      createdAt: row.created_at
    };
  }

  async getClassesBySchool(schoolId) {
    const result = await this.query('SELECT * FROM classes WHERE school_id = $1', [schoolId]);
    return result.rows.map(row => ({
      ...row,
      schoolId: row.school_id,
      teacherId: row.teacher_id,
      academicYear: row.academic_year,
      attendanceMode: row.attendance_mode,
      createdAt: row.created_at
    }));
  }

  async updateClass(id, updates) {
    const fields = Object.keys(updates).map((key, i) => `${key} = $${i + 2}`).join(', ');
    const values = [id, ...Object.values(updates)];
    const result = await this.query(`UPDATE classes SET ${fields} WHERE id = $1 RETURNING *`, values);
    return result.rows[0];
  }

  async deleteClass(id) {
    await this.query('DELETE FROM classes WHERE id = $1', [id]);
    return true;
  }

  // Subjects
  async addSubject(subject) {
    const query = `
      INSERT INTO subjects (id, name, code, class_id, school_id, teacher_id, created_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `;
    const values = [
      subject.id, subject.name, subject.code || null, subject.classId,
      subject.schoolId, subject.teacherId || null, subject.createdAt
    ];
    const result = await this.query(query, values);
    return result.rows[0];
  }

  async getSubjects() {
    const result = await this.query('SELECT * FROM subjects');
    return result.rows.map(row => ({
      ...row,
      classId: row.class_id,
      schoolId: row.school_id,
      teacherId: row.teacher_id,
      createdAt: row.created_at
    }));
  }

  async getSubjectById(id) {
    const result = await this.query('SELECT * FROM subjects WHERE id = $1', [id]);
    if (!result.rows[0]) return null;
    const row = result.rows[0];
    return {
      ...row,
      classId: row.class_id,
      schoolId: row.school_id,
      teacherId: row.teacher_id,
      createdAt: row.created_at
    };
  }

  async getSubjectsBySchool(schoolId) {
    const result = await this.query('SELECT * FROM subjects WHERE school_id = $1', [schoolId]);
    return result.rows.map(row => ({
      ...row,
      classId: row.class_id,
      schoolId: row.school_id,
      teacherId: row.teacher_id,
      createdAt: row.created_at
    }));
  }

  async getSubjectsByClass(classId) {
    const result = await this.query('SELECT * FROM subjects WHERE class_id = $1', [classId]);
    return result.rows.map(row => ({
      ...row,
      classId: row.class_id,
      schoolId: row.school_id,
      teacherId: row.teacher_id,
      createdAt: row.created_at
    }));
  }

  async updateSubject(id, updates) {
    const fields = Object.keys(updates).map((key, i) => `${key} = $${i + 2}`).join(', ');
    const values = [id, ...Object.values(updates)];
    const result = await this.query(`UPDATE subjects SET ${fields} WHERE id = $1 RETURNING *`, values);
    return result.rows[0];
  }

  async deleteSubject(id) {
    await this.query('DELETE FROM subjects WHERE id = $1', [id]);
    return true;
  }

  // Students
  async addStudent(student) {
    // Get schoolId from classId if not provided
    let schoolId = student.schoolId;
    if (!schoolId && student.classId) {
      const classData = await this.getClassById(student.classId);
      schoolId = classData ? classData.schoolId : null;
    }

    const query = `
      INSERT INTO students (id, school_id, class_id, name, roll_number, enrollment_no, date_of_birth, gender, father_name, mother_name, contact_number, address, status, created_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
      RETURNING *
    `;
    const values = [
      student.id, schoolId, student.classId || null, student.name,
      student.rollNumber || null, student.enrollmentNo || null, student.dateOfBirth || null,
      student.gender || null, student.fatherName || student.parentName || null, 
      student.motherName || null,
      student.contactNumber || student.contact || student.parentContact || null, 
      student.address || null, student.status, student.createdAt
    ];
    const result = await this.query(query, values);
    const row = result.rows[0];
    return {
      ...row,
      schoolId: row.school_id,
      classId: row.class_id,
      rollNumber: row.roll_number,
      enrollmentNo: row.enrollment_no,
      dateOfBirth: row.date_of_birth,
      fatherName: row.father_name,
      motherName: row.mother_name,
      contactNumber: row.contact_number,
      createdAt: row.created_at
    };
  }

  async getStudents() {
    const result = await this.query('SELECT * FROM students');
    return result.rows.map(row => ({
      ...row,
      schoolId: row.school_id,
      classId: row.class_id,
      rollNumber: row.roll_number,
      enrollmentNo: row.enrollment_no,
      dateOfBirth: row.date_of_birth,
      fatherName: row.father_name,
      motherName: row.mother_name,
      contactNumber: row.contact_number,
      createdAt: row.created_at
    }));
  }

  async getStudentById(id) {
    const result = await this.query('SELECT * FROM students WHERE id = $1', [id]);
    if (!result.rows[0]) return null;
    const row = result.rows[0];
    return {
      ...row,
      schoolId: row.school_id,
      classId: row.class_id,
      rollNumber: row.roll_number,
      enrollmentNo: row.enrollment_no,
      dateOfBirth: row.date_of_birth,
      fatherName: row.father_name,
      motherName: row.mother_name,
      contactNumber: row.contact_number,
      createdAt: row.created_at
    };
  }

  async getStudentsByClass(classId) {
    const result = await this.query('SELECT * FROM students WHERE class_id = $1', [classId]);
    return result.rows.map(row => ({
      ...row,
      schoolId: row.school_id,
      classId: row.class_id,
      rollNumber: row.roll_number,
      enrollmentNo: row.enrollment_no,
      dateOfBirth: row.date_of_birth,
      fatherName: row.father_name,
      motherName: row.mother_name,
      contactNumber: row.contact_number,
      createdAt: row.created_at
    }));
  }

  async updateStudent(id, updates) {
    const fields = Object.keys(updates).map((key, i) => `${key} = $${i + 2}`).join(', ');
    const values = [id, ...Object.values(updates)];
    const result = await this.query(`UPDATE students SET ${fields} WHERE id = $1 RETURNING *`, values);
    return result.rows[0];
  }

  async deleteStudent(id) {
    await this.query('DELETE FROM students WHERE id = $1', [id]);
    return true;
  }

  // Attendance
  async addAttendance(attendance) {
    const query = `
      INSERT INTO attendance (id, student_id, class_id, subject_id, date, status, marked_by, notes, created_at, updated_at, updated_by)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING *
    `;
    const values = [
      attendance.id, 
      attendance.studentId, 
      attendance.classId, 
      attendance.subjectId || null,
      attendance.date, 
      attendance.status, 
      attendance.markedBy || null, 
      attendance.notes || null,
      attendance.createdAt,
      attendance.updatedAt || attendance.createdAt,
      attendance.updatedBy || attendance.markedBy || null
    ];
    const result = await this.query(query, values);
    return result.rows[0];
  }

  async getAttendance() {
    const result = await this.query('SELECT * FROM attendance');
    return result.rows.map(row => ({
      ...row,
      studentId: row.student_id,
      classId: row.class_id,
      subjectId: row.subject_id,
      markedBy: row.marked_by,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      updatedBy: row.updated_by,
      notes: row.notes
    }));
  }

  async getAttendanceByStudent(studentId, filters = {}) {
    let query = 'SELECT * FROM attendance WHERE student_id = $1';
    const values = [studentId];
    let paramIndex = 2;

    if (filters.startDate) {
      query += ` AND date >= $${paramIndex}`;
      values.push(filters.startDate);
      paramIndex++;
    }
    if (filters.endDate) {
      query += ` AND date <= $${paramIndex}`;
      values.push(filters.endDate);
      paramIndex++;
    }
    if (filters.subjectId) {
      query += ` AND subject_id = $${paramIndex}`;
      values.push(filters.subjectId);
      paramIndex++;
    }
    if (filters.classId) {
      query += ` AND class_id = $${paramIndex}`;
      values.push(filters.classId);
    }

    const result = await this.query(query, values);
    return result.rows.map(row => ({
      ...row,
      studentId: row.student_id,
      classId: row.class_id,
      subjectId: row.subject_id,
      markedBy: row.marked_by,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      updatedBy: row.updated_by,
      notes: row.notes
    }));
  }

  async getAttendanceByClass(classId, filters = {}) {
    let query = 'SELECT * FROM attendance WHERE class_id = $1';
    const values = [classId];
    let paramIndex = 2;

    if (filters.date) {
      query += ` AND date = $${paramIndex}`;
      values.push(filters.date);
      paramIndex++;
    }
    if (filters.startDate) {
      query += ` AND date >= $${paramIndex}`;
      values.push(filters.startDate);
      paramIndex++;
    }
    if (filters.endDate) {
      query += ` AND date <= $${paramIndex}`;
      values.push(filters.endDate);
      paramIndex++;
    }
    if (filters.subjectId) {
      query += ` AND subject_id = $${paramIndex}`;
      values.push(filters.subjectId);
      paramIndex++;
    }
    if (filters.status) {
      query += ` AND status = $${paramIndex}`;
      values.push(filters.status);
    }

    const result = await this.query(query, values);
    return result.rows.map(row => ({
      ...row,
      studentId: row.student_id,
      classId: row.class_id,
      subjectId: row.subject_id,
      markedBy: row.marked_by,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      updatedBy: row.updated_by,
      notes: row.notes
    }));
  }

  async getAttendanceByDate(date, classId, subjectId = null) {
    let query = 'SELECT * FROM attendance WHERE date = $1 AND class_id = $2';
    const values = [date, classId];

    if (subjectId) {
      query += ' AND subject_id = $3';
      values.push(subjectId);
    } else {
      query += ' AND subject_id IS NULL';
    }

    const result = await this.query(query, values);
    return result.rows.map(row => ({
      ...row,
      studentId: row.student_id,
      classId: row.class_id,
      subjectId: row.subject_id,
      markedBy: row.marked_by,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      updatedBy: row.updated_by,
      notes: row.notes
    }));
  }

  // Exam Templates (stub methods - implement as needed)
  async addExamTemplate(template) {
    const query = `
      INSERT INTO exam_templates (id, name, description, type, school_id, subjects, is_active, created_by, created_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *
    `;
    const values = [
      template.id, template.name, template.description || null, template.type,
      template.schoolId, JSON.stringify(template.subjects), template.isActive,
      template.createdBy || null, template.createdAt
    ];
    const result = await this.query(query, values);
    return result.rows[0];
  }

  async getExamTemplates(schoolId, filters = {}) {
    let query = 'SELECT * FROM exam_templates WHERE school_id = $1';
    const values = [schoolId];
    let paramIndex = 2;

    if (filters.isActive !== undefined) {
      query += ` AND is_active = $${paramIndex}`;
      values.push(filters.isActive);
      paramIndex++;
    }

    if (filters.type) {
      query += ` AND type = $${paramIndex}`;
      values.push(filters.type);
      paramIndex++;
    }

    const result = await this.query(query, values);
    return result.rows.map(row => ({
      ...row,
      schoolId: row.school_id,
      isActive: row.is_active,
      createdBy: row.created_by,
      createdAt: row.created_at
    }));
  }

  async getExamTemplateById(id) {
    const result = await this.query('SELECT * FROM exam_templates WHERE id = $1', [id]);
    if (!result.rows[0]) return null;
    const row = result.rows[0];
    return {
      ...row,
      schoolId: row.school_id,
      isActive: row.is_active,
      createdBy: row.created_by,
      createdAt: row.created_at
    };
  }

  async updateExamTemplate(id, updates) {
    const fields = [];
    const values = [id];
    let paramIndex = 2;

    const fieldMap = {
      name: 'name',
      description: 'description',
      type: 'type',
      totalMarks: 'total_marks',
      passingMarks: 'passing_marks',
      weightage: 'weightage',
      isActive: 'is_active',
      updatedAt: 'updated_at'
    };

    for (const [key, dbField] of Object.entries(fieldMap)) {
      if (updates[key] !== undefined) {
        fields.push(`${dbField} = $${paramIndex}`);
        values.push(updates[key]);
        paramIndex++;
      }
    }

    if (fields.length === 0) return null;

    const query = `UPDATE exam_templates SET ${fields.join(', ')} WHERE id = $1 RETURNING *`;
    const result = await this.query(query, values);
    return result.rows[0];
  }

  async deleteExamTemplate(id) {
    await this.query('DELETE FROM exam_templates WHERE id = $1', [id]);
    return true;
  }

  async toggleExamTemplateStatus(id) {
    const query = `UPDATE exam_templates SET is_active = NOT is_active WHERE id = $1 RETURNING *`;
    const result = await this.query(query, [id]);
    return result.rows[0];
  }

  async isTemplateUsed(templateId) {
    const result = await this.query('SELECT COUNT(*) as count FROM exam_periods WHERE template_id = $1', [templateId]);
    return parseInt(result.rows[0].count) > 0;
  }

  async getExamsCountByPeriod(periodId) {
    const result = await this.query('SELECT COUNT(*) as count FROM exams WHERE period_id = $1', [periodId]);
    return parseInt(result.rows[0].count);
  }

  async getExamPeriods(schoolId, filters = {}) {
    let query = 'SELECT * FROM exam_periods WHERE school_id = $1';
    const values = [schoolId];
    let paramIndex = 2;

    if (filters.templateId) {
      query += ` AND template_id = $${paramIndex}`;
      values.push(filters.templateId);
      paramIndex++;
    }

    const result = await this.query(query, values);
    return result.rows;
  }

  // Placeholder methods for exams and marks
  async getExams(filters = {}) {
    let query = 'SELECT * FROM exams WHERE 1=1';
    const values = [];
    let paramIndex = 1;

    if (filters.schoolId) {
      query += ` AND school_id = $${paramIndex}`;
      values.push(filters.schoolId);
      paramIndex++;
    }
    if (filters.classId) {
      query += ` AND class_id = $${paramIndex}`;
      values.push(filters.classId);
      paramIndex++;
    }
    if (filters.subjectId) {
      query += ` AND subject_id = $${paramIndex}`;
      values.push(filters.subjectId);
      paramIndex++;
    }
    if (filters.type) {
      query += ` AND type = $${paramIndex}`;
      values.push(filters.type);
      paramIndex++;
    }
    if (filters.status) {
      query += ` AND status = $${paramIndex}`;
      values.push(filters.status);
      paramIndex++;
    }
    if (filters.startDate) {
      query += ` AND exam_date >= $${paramIndex}`;
      values.push(filters.startDate);
      paramIndex++;
    }
    if (filters.endDate) {
      query += ` AND exam_date <= $${paramIndex}`;
      values.push(filters.endDate);
    }

    const result = await this.query(query, values);
    return result.rows.map(row => ({
      ...row,
      schoolId: row.school_id,
      classId: row.class_id,
      subjectId: row.subject_id,
      examDate: row.exam_date,
      totalMarks: row.total_marks,
      passingMarks: row.passing_marks,
      createdBy: row.created_by,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    }));
  }

  async getExamById(id) {
    const result = await this.query('SELECT * FROM exams WHERE id = $1', [id]);
    if (!result.rows[0]) return null;
    const row = result.rows[0];
    return {
      ...row,
      schoolId: row.school_id,
      classId: row.class_id,
      subjectId: row.subject_id,
      examDate: row.exam_date,
      totalMarks: row.total_marks,
      passingMarks: row.passing_marks,
      createdBy: row.created_by,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    };
  }

  async addExam(exam) {
    const query = `
      INSERT INTO exams (id, school_id, class_id, subject_id, name, type, exam_date, total_marks, passing_marks, status, created_by, created_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      RETURNING *
    `;
    const values = [
      exam.id, exam.schoolId, exam.classId, exam.subjectId, exam.name,
      exam.type, exam.examDate, exam.totalMarks, exam.passingMarks,
      exam.status || 'scheduled', exam.createdBy || null, exam.createdAt
    ];
    const result = await this.query(query, values);
    const row = result.rows[0];
    return {
      ...row,
      schoolId: row.school_id,
      classId: row.class_id,
      subjectId: row.subject_id,
      examDate: row.exam_date,
      totalMarks: row.total_marks,
      passingMarks: row.passing_marks,
      createdBy: row.created_by,
      createdAt: row.created_at
    };
  }

  async updateExam(id, updates) {
    const fields = [];
    const values = [id];
    let paramIndex = 2;

    const fieldMap = {
      name: 'name',
      type: 'type',
      examDate: 'exam_date',
      totalMarks: 'total_marks',
      passingMarks: 'passing_marks',
      status: 'status',
      updatedAt: 'updated_at'
    };

    for (const [key, dbField] of Object.entries(fieldMap)) {
      if (updates[key] !== undefined) {
        fields.push(`${dbField} = $${paramIndex}`);
        values.push(updates[key]);
        paramIndex++;
      }
    }

    if (fields.length === 0) return null;

    const query = `UPDATE exams SET ${fields.join(', ')} WHERE id = $1 RETURNING *`;
    const result = await this.query(query, values);
    if (!result.rows[0]) return null;
    const row = result.rows[0];
    return {
      ...row,
      schoolId: row.school_id,
      classId: row.class_id,
      subjectId: row.subject_id,
      examDate: row.exam_date,
      totalMarks: row.total_marks,
      passingMarks: row.passing_marks,
      createdBy: row.created_by,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    };
  }

  async deleteExam(id) {
    await this.query('DELETE FROM exams WHERE id = $1', [id]);
    return true;
  }

  async getMarks(filters = {}) {
    let query = 'SELECT * FROM marks WHERE 1=1';
    const values = [];
    let paramIndex = 1;

    if (filters.examId) {
      query += ` AND exam_id = $${paramIndex}`;
      values.push(filters.examId);
      paramIndex++;
    }
    if (filters.studentId) {
      query += ` AND student_id = $${paramIndex}`;
      values.push(filters.studentId);
      paramIndex++;
    }
    if (filters.status) {
      query += ` AND status = $${paramIndex}`;
      values.push(filters.status);
    }

    const result = await this.query(query, values);
    return result.rows.map(row => ({
      ...row,
      examId: row.exam_id,
      studentId: row.student_id,
      marksObtained: row.marks_obtained,
      gradePoint: row.grade_point,
      enteredBy: row.entered_by,
      enteredAt: row.entered_at,
      verifiedBy: row.verified_by,
      verifiedAt: row.verified_at
    }));
  }

  async getMarksById(id) {
    const result = await this.query('SELECT * FROM marks WHERE id = $1', [id]);
    if (!result.rows[0]) return null;
    const row = result.rows[0];
    return {
      ...row,
      examId: row.exam_id,
      studentId: row.student_id,
      marksObtained: row.marks_obtained,
      gradePoint: row.grade_point,
      enteredBy: row.entered_by,
      enteredAt: row.entered_at,
      verifiedBy: row.verified_by,
      verifiedAt: row.verified_at
    };
  }

  async getMarksByExam(examId) {
    return this.getMarks({ examId });
  }

  async getMarksByStudent(studentId) {
    return this.getMarks({ studentId });
  }

  async getMarksByExamAndStudent(examId, studentId) {
    const result = await this.query(
      'SELECT * FROM marks WHERE exam_id = $1 AND student_id = $2',
      [examId, studentId]
    );
    if (!result.rows[0]) return null;
    const row = result.rows[0];
    return {
      id: row.id,
      examId: row.exam_id,
      studentId: row.student_id,
      marksObtained: row.marks_obtained,
      percentage: row.percentage,
      grade: row.grade,
      gradePoint: row.grade_point,
      status: row.status,
      remarks: row.remarks,
      enteredBy: row.entered_by,
      enteredAt: row.entered_at,
      updatedBy: row.updated_by,
      updatedAt: row.updated_at,
      verifiedBy: row.verified_by,
      verifiedAt: row.verified_at
    };
  }

  async addMarks(marks) {
    const query = `
      INSERT INTO marks (id, exam_id, student_id, marks_obtained, percentage, grade, grade_point, status, remarks, entered_by, entered_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING *
    `;
    const values = [
      marks.id, marks.examId, marks.studentId, marks.marksObtained || null,
      marks.percentage || null, marks.grade || null, marks.gradePoint || null,
      marks.status, marks.remarks || null, marks.enteredBy || null, marks.enteredAt
    ];
    const result = await this.query(query, values);
    const row = result.rows[0];
    return {
      ...row,
      examId: row.exam_id,
      studentId: row.student_id,
      marksObtained: row.marks_obtained,
      gradePoint: row.grade_point,
      enteredBy: row.entered_by,
      enteredAt: row.entered_at
    };
  }

  async updateMarks(id, updates) {
    const fields = [];
    const values = [id];
    let paramIndex = 2;

    const fieldMap = {
      marksObtained: 'marks_obtained',
      percentage: 'percentage',
      grade: 'grade',
      gradePoint: 'grade_point',
      status: 'status',
      remarks: 'remarks',
      verifiedBy: 'verified_by',
      verifiedAt: 'verified_at'
    };

    for (const [key, dbField] of Object.entries(fieldMap)) {
      if (updates[key] !== undefined) {
        fields.push(`${dbField} = $${paramIndex}`);
        values.push(updates[key]);
        paramIndex++;
      }
    }

    if (fields.length === 0) return null;

    const query = `UPDATE marks SET ${fields.join(', ')} WHERE id = $1 RETURNING *`;
    const result = await this.query(query, values);
    if (!result.rows[0]) return null;
    const row = result.rows[0];
    return {
      ...row,
      examId: row.exam_id,
      studentId: row.student_id,
      marksObtained: row.marks_obtained,
      gradePoint: row.grade_point,
      enteredBy: row.entered_by,
      enteredAt: row.entered_at,
      verifiedBy: row.verified_by,
      verifiedAt: row.verified_at
    };
  }

  async deleteMarks(id) {
    await this.query('DELETE FROM marks WHERE id = $1', [id]);
    return true;
  }

  async getAttendanceById(id) {
    const result = await this.query('SELECT * FROM attendance WHERE id = $1', [id]);
    if (!result.rows[0]) return null;
    const row = result.rows[0];
    return {
      ...row,
      studentId: row.student_id,
      classId: row.class_id,
      subjectId: row.subject_id,
      markedBy: row.marked_by,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      updatedBy: row.updated_by,
      notes: row.notes
    };
  }

  async updateAttendance(id, updates) {
    const fields = [];
    const values = [id];
    let paramIndex = 2;

    const fieldMap = {
      status: 'status',
      notes: 'notes',
      markedBy: 'marked_by',
      updatedAt: 'updated_at',
      updatedBy: 'updated_by'
    };

    for (const [key, dbField] of Object.entries(fieldMap)) {
      if (updates[key] !== undefined) {
        fields.push(`${dbField} = $${paramIndex}`);
        values.push(updates[key]);
        paramIndex++;
      }
    }

    if (fields.length === 0) return null;

    const query = `UPDATE attendance SET ${fields.join(', ')} WHERE id = $1 RETURNING *`;
    const result = await this.query(query, values);
    if (!result.rows[0]) return null;
    const row = result.rows[0];
    return {
      ...row,
      studentId: row.student_id,
      classId: row.class_id,
      subjectId: row.subject_id,
      markedBy: row.marked_by,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      updatedBy: row.updated_by
    };
  }

  async deleteAttendance(id) {
    await this.query('DELETE FROM attendance WHERE id = $1', [id]);
    return true;
  }

  async getSubjects() {
    const result = await this.query('SELECT * FROM subjects');
    return result.rows.map(row => ({
      ...row,
      classId: row.class_id,
      schoolId: row.school_id,
      teacherId: row.teacher_id,
      createdAt: row.created_at
    }));
  }

  // ==================== BEHAVIOR METHODS ====================

  async addBehavior(behavior) {
    const query = `
      INSERT INTO behavior (id, student_id, teacher_id, date, behavior_type, category, severity, description, action_taken, follow_up_required, follow_up_date, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
      RETURNING *
    `;
    const values = [
      behavior.id,
      behavior.studentId,
      behavior.teacherId,
      behavior.date,
      behavior.behaviorType,
      behavior.category,
      behavior.severity,
      behavior.description,
      behavior.actionTaken || null,
      behavior.followUpRequired || false,
      behavior.followUpDate || null,
      behavior.createdAt,
      behavior.updatedAt
    ];
    const result = await this.query(query, values);
    const row = result.rows[0];
    return {
      ...row,
      studentId: row.student_id,
      teacherId: row.teacher_id,
      behaviorType: row.behavior_type,
      actionTaken: row.action_taken,
      followUpRequired: row.follow_up_required,
      followUpDate: row.follow_up_date,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    };
  }

  async getBehaviors(filters = {}) {
    let query = 'SELECT * FROM behavior WHERE 1=1';
    const values = [];
    let paramIndex = 1;

    if (filters.studentId) {
      query += ` AND student_id = $${paramIndex}`;
      values.push(filters.studentId);
      paramIndex++;
    }
    if (filters.teacherId) {
      query += ` AND teacher_id = $${paramIndex}`;
      values.push(filters.teacherId);
      paramIndex++;
    }
    if (filters.behaviorType) {
      query += ` AND behavior_type = $${paramIndex}`;
      values.push(filters.behaviorType);
      paramIndex++;
    }
    if (filters.severity) {
      query += ` AND severity = $${paramIndex}`;
      values.push(filters.severity);
      paramIndex++;
    }
    if (filters.startDate) {
      query += ` AND date >= $${paramIndex}`;
      values.push(filters.startDate);
      paramIndex++;
    }
    if (filters.endDate) {
      query += ` AND date <= $${paramIndex}`;
      values.push(filters.endDate);
      paramIndex++;
    }

    query += ' ORDER BY date DESC';

    const result = await this.query(query, values);
    return result.rows.map(row => ({
      ...row,
      studentId: row.student_id,
      teacherId: row.teacher_id,
      behaviorType: row.behavior_type,
      actionTaken: row.action_taken,
      followUpRequired: row.follow_up_required,
      followUpDate: row.follow_up_date,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    }));
  }

  async getBehaviorById(id) {
    const result = await this.query('SELECT * FROM behavior WHERE id = $1', [id]);
    if (!result.rows[0]) return null;
    const row = result.rows[0];
    return {
      ...row,
      studentId: row.student_id,
      teacherId: row.teacher_id,
      behaviorType: row.behavior_type,
      actionTaken: row.action_taken,
      followUpRequired: row.follow_up_required,
      followUpDate: row.follow_up_date,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    };
  }

  async updateBehavior(id, updates) {
    const fields = [];
    const values = [id];
    let paramIndex = 2;

    const fieldMap = {
      date: 'date',
      behaviorType: 'behavior_type',
      category: 'category',
      severity: 'severity',
      description: 'description',
      actionTaken: 'action_taken',
      followUpRequired: 'follow_up_required',
      followUpDate: 'follow_up_date',
      updatedAt: 'updated_at'
    };

    for (const [key, dbField] of Object.entries(fieldMap)) {
      if (updates[key] !== undefined) {
        fields.push(`${dbField} = $${paramIndex}`);
        values.push(updates[key]);
        paramIndex++;
      }
    }

    if (fields.length === 0) return null;

    const query = `UPDATE behavior SET ${fields.join(', ')} WHERE id = $1 RETURNING *`;
    const result = await this.query(query, values);
    if (!result.rows[0]) return null;
    const row = result.rows[0];
    return {
      ...row,
      studentId: row.student_id,
      teacherId: row.teacher_id,
      behaviorType: row.behavior_type,
      actionTaken: row.action_taken,
      followUpRequired: row.follow_up_required,
      followUpDate: row.follow_up_date,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    };
  }

  async deleteBehavior(id) {
    await this.query('DELETE FROM behavior WHERE id = $1', [id]);
    return true;
  }

  // ==================== INTERVENTION METHODS ====================

  async addIntervention(intervention) {
    const query = `
      INSERT INTO interventions (id, student_id, initiated_by, intervention_type, priority, title, description, action_plan, expected_outcome, start_date, target_date, end_date, status, outcome, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
      RETURNING *
    `;
    const values = [
      intervention.id,
      intervention.studentId,
      intervention.initiatedBy,
      intervention.interventionType,
      intervention.priority || 'medium',
      intervention.title,
      intervention.description,
      intervention.actionPlan || null,
      intervention.expectedOutcome || null,
      intervention.startDate || null,
      intervention.targetDate || null,
      intervention.endDate || null,
      intervention.status || 'planned',
      intervention.outcome || null,
      intervention.createdAt,
      intervention.updatedAt
    ];
    const result = await this.query(query, values);
    const row = result.rows[0];
    return {
      ...row,
      studentId: row.student_id,
      initiatedBy: row.initiated_by,
      interventionType: row.intervention_type,
      actionPlan: row.action_plan,
      expectedOutcome: row.expected_outcome,
      startDate: row.start_date,
      targetDate: row.target_date,
      endDate: row.end_date,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    };
  }

  async getInterventions(filters = {}) {
    let query = 'SELECT * FROM interventions WHERE 1=1';
    const values = [];
    let paramIndex = 1;

    if (filters.studentId) {
      query += ` AND student_id = $${paramIndex}`;
      values.push(filters.studentId);
      paramIndex++;
    }
    if (filters.initiatedBy) {
      query += ` AND initiated_by = $${paramIndex}`;
      values.push(filters.initiatedBy);
      paramIndex++;
    }
    if (filters.status) {
      query += ` AND status = $${paramIndex}`;
      values.push(filters.status);
      paramIndex++;
    }
    if (filters.priority) {
      query += ` AND priority = $${paramIndex}`;
      values.push(filters.priority);
      paramIndex++;
    }
    if (filters.startDate) {
      query += ` AND start_date >= $${paramIndex}`;
      values.push(filters.startDate);
      paramIndex++;
    }
    if (filters.endDate) {
      query += ` AND (end_date <= $${paramIndex} OR end_date IS NULL)`;
      values.push(filters.endDate);
      paramIndex++;
    }

    query += ' ORDER BY created_at DESC';

    const result = await this.query(query, values);
    return result.rows.map(row => ({
      ...row,
      studentId: row.student_id,
      initiatedBy: row.initiated_by,
      interventionType: row.intervention_type,
      actionPlan: row.action_plan,
      expectedOutcome: row.expected_outcome,
      startDate: row.start_date,
      targetDate: row.target_date,
      endDate: row.end_date,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    }));
  }

  async getInterventionById(id) {
    const result = await this.query('SELECT * FROM interventions WHERE id = $1', [id]);
    if (!result.rows[0]) return null;
    const row = result.rows[0];
    return {
      ...row,
      studentId: row.student_id,
      initiatedBy: row.initiated_by,
      interventionType: row.intervention_type,
      actionPlan: row.action_plan,
      expectedOutcome: row.expected_outcome,
      startDate: row.start_date,
      targetDate: row.target_date,
      endDate: row.end_date,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    };
  }

  async updateIntervention(id, updates) {
    const fields = [];
    const values = [id];
    let paramIndex = 2;

    const fieldMap = {
      interventionType: 'intervention_type',
      priority: 'priority',
      title: 'title',
      description: 'description',
      actionPlan: 'action_plan',
      expectedOutcome: 'expected_outcome',
      startDate: 'start_date',
      targetDate: 'target_date',
      endDate: 'end_date',
      status: 'status',
      outcome: 'outcome',
      updatedAt: 'updated_at'
    };

    for (const [key, dbField] of Object.entries(fieldMap)) {
      if (updates[key] !== undefined) {
        fields.push(`${dbField} = $${paramIndex}`);
        values.push(updates[key]);
        paramIndex++;
      }
    }

    if (fields.length === 0) return null;

    const query = `UPDATE interventions SET ${fields.join(', ')} WHERE id = $1 RETURNING *`;
    const result = await this.query(query, values);
    if (!result.rows[0]) return null;
    const row = result.rows[0];
    return {
      ...row,
      studentId: row.student_id,
      initiatedBy: row.initiated_by,
      interventionType: row.intervention_type,
      actionPlan: row.action_plan,
      expectedOutcome: row.expected_outcome,
      startDate: row.start_date,
      targetDate: row.target_date,
      endDate: row.end_date,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    };
  }

  async deleteIntervention(id) {
    await this.query('DELETE FROM interventions WHERE id = $1', [id]);
    return true;
  }
}

export default new PostgresStore();
