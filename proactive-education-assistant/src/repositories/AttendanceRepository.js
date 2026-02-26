// Attendance Repository
import BaseRepository from './BaseRepository';

class AttendanceRepository extends BaseRepository {
  constructor() {
    super('attendance');
  }

  /**
   * Find attendance by student ID
   */
  async findByStudent(studentId, startDate = null, endDate = null) {
    let where = 'student_id = ?';
    const params = [studentId];

    if (startDate) {
      where += ' AND date >= ?';
      params.push(startDate);
    }

    if (endDate) {
      where += ' AND date <= ?';
      params.push(endDate);
    }

    return await this.findAll(where, params);
  }

  /**
   * Find attendance by class ID
   */
  async findByClass(classId, date = null) {
    const where = date 
      ? 'class_id = ? AND date = ?'
      : 'class_id = ?';
    const params = date ? [classId, date] : [classId];

    return await this.findAll(where, params);
  }

  /**
   * Find attendance by date
   */
  async findByDate(date, classId = null) {
    const where = classId 
      ? 'date = ? AND class_id = ?'
      : 'date = ?';
    const params = classId ? [date, classId] : [date];

    return await this.findAll(where, params);
  }

  /**
   * Check if attendance exists for student on date
   */
  async existsForStudentOnDate(studentId, date, subjectId = null) {
    const where = subjectId
      ? 'student_id = ? AND date = ? AND subject_id = ?'
      : 'student_id = ? AND date = ? AND subject_id IS NULL';
    const params = subjectId ? [studentId, date, subjectId] : [studentId, date];

    return await this.exists(where, params);
  }

  /**
   * Mark attendance for a student
   */
  async markAttendance(data) {
    // Check if attendance already exists
    const exists = await this.existsForStudentOnDate(
      data.student_id,
      data.date,
      data.subject_id
    );

    if (exists) {
      // Update existing record
      const existing = await this.findOne(
        data.subject_id
          ? 'student_id = ? AND date = ? AND subject_id = ?'
          : 'student_id = ? AND date = ? AND subject_id IS NULL',
        data.subject_id 
          ? [data.student_id, data.date, data.subject_id]
          : [data.student_id, data.date]
      );

      return await this.update(existing.id, {
        status: data.status,
        remarks: data.remarks,
      });
    } else {
      // Create new record
      return await this.create(data);
    }
  }

  /**
   * Bulk mark attendance
   */
  async bulkMarkAttendance(records) {
    const statements = [];

    for (const data of records) {
      const exists = await this.existsForStudentOnDate(
        data.student_id,
        data.date,
        data.subject_id
      );

      if (exists) {
        // Update
        const existing = await this.findOne(
          data.subject_id
            ? 'student_id = ? AND date = ? AND subject_id = ?'
            : 'student_id = ? AND date = ? AND subject_id IS NULL',
          data.subject_id 
            ? [data.student_id, data.date, data.subject_id]
            : [data.student_id, data.date]
        );

        statements.push({
          sql: `UPDATE attendance SET status = ?, remarks = ?, updated_at = ? WHERE id = ?`,
          params: [data.status, data.remarks, this.now(), existing.id],
        });
      } else {
        // Insert
        const record = {
          id: this.generateId(),
          ...data,
          created_at: this.now(),
        };

        const keys = Object.keys(record);
        const values = Object.values(record);
        const placeholders = keys.map(() => '?').join(', ');

        statements.push({
          sql: `INSERT INTO attendance (${keys.join(', ')}) VALUES (${placeholders})`,
          params: values,
        });
      }
    }

    await this.db.transaction(statements);
    return { success: true, count: records.length };
  }

  /**
   * Get attendance statistics for a student
   */
  async getStudentStatistics(studentId, startDate = null, endDate = null) {
    let where = 'student_id = ?';
    const params = [studentId];

    if (startDate) {
      where += ' AND date >= ?';
      params.push(startDate);
    }

    if (endDate) {
      where += ' AND date <= ?';
      params.push(endDate);
    }

    const sql = `
      SELECT 
        COUNT(*) as total_days,
        SUM(CASE WHEN status = 'present' THEN 1 ELSE 0 END) as present_days,
        SUM(CASE WHEN status = 'absent' THEN 1 ELSE 0 END) as absent_days,
        SUM(CASE WHEN status = 'late' THEN 1 ELSE 0 END) as late_days,
        SUM(CASE WHEN status = 'excused' THEN 1 ELSE 0 END) as excused_days,
        ROUND(
          (SUM(CASE WHEN status = 'present' THEN 1 ELSE 0 END) * 100.0) / COUNT(*),
          2
        ) as attendance_percentage
      FROM attendance
      WHERE ${where}
    `;

    return await this.db.getOne(sql, params);
  }

  /**
   * Get attendance statistics for a class
   */
  async getClassStatistics(classId, date = null) {
    const where = date 
      ? 'class_id = ? AND date = ?'
      : 'class_id = ?';
    const params = date ? [classId, date] : [classId];

    const sql = `
      SELECT 
        COUNT(DISTINCT student_id) as total_students,
        SUM(CASE WHEN status = 'present' THEN 1 ELSE 0 END) as present_count,
        SUM(CASE WHEN status = 'absent' THEN 1 ELSE 0 END) as absent_count,
        SUM(CASE WHEN status = 'late' THEN 1 ELSE 0 END) as late_count,
        ROUND(
          (SUM(CASE WHEN status = 'present' THEN 1 ELSE 0 END) * 100.0) / COUNT(*),
          2
        ) as attendance_percentage
      FROM attendance
      WHERE ${where}
    `;

    return await this.db.getOne(sql, params);
  }
}

export default new AttendanceRepository();
