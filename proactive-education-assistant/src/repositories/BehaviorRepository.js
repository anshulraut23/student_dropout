// Behavior Repository
import BaseRepository from './BaseRepository';

class BehaviorRepository extends BaseRepository {
  constructor() {
    super('behavior');
  }

  /**
   * Find behavior records by student ID
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

    return await this.findAll(where + ' ORDER BY date DESC', params);
  }

  /**
   * Find behavior records by teacher ID
   */
  async findByTeacher(teacherId) {
    return await this.findAll('teacher_id = ? ORDER BY date DESC', [teacherId]);
  }

  /**
   * Find behavior records by type
   */
  async findByType(type, studentId = null) {
    const where = studentId 
      ? 'type = ? AND student_id = ?'
      : 'type = ?';
    const params = studentId ? [type, studentId] : [type];

    return await this.findAll(where + ' ORDER BY date DESC', params);
  }

  /**
   * Find behavior records by severity
   */
  async findBySeverity(severity) {
    return await this.findAll('severity = ? ORDER BY date DESC', [severity]);
  }

  /**
   * Get behavior statistics for a student
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
        COUNT(*) as total_records,
        SUM(CASE WHEN type = 'positive' THEN 1 ELSE 0 END) as positive_count,
        SUM(CASE WHEN type = 'negative' THEN 1 ELSE 0 END) as negative_count,
        SUM(CASE WHEN type = 'neutral' THEN 1 ELSE 0 END) as neutral_count,
        SUM(CASE WHEN severity = 'high' THEN 1 ELSE 0 END) as high_severity_count,
        SUM(CASE WHEN severity = 'medium' THEN 1 ELSE 0 END) as medium_severity_count,
        SUM(CASE WHEN severity = 'low' THEN 1 ELSE 0 END) as low_severity_count
      FROM behavior
      WHERE ${where}
    `;

    return await this.db.getOne(sql, params);
  }

  /**
   * Get recent behavior records
   */
  async getRecent(limit = 10, studentId = null) {
    const where = studentId ? 'WHERE student_id = ?' : '';
    const params = studentId ? [studentId, limit] : [limit];

    const sql = `
      SELECT 
        b.*,
        s.name as student_name,
        u.name as teacher_name
      FROM behavior b
      JOIN students s ON b.student_id = s.id
      JOIN users u ON b.teacher_id = u.id
      ${where}
      ORDER BY b.date DESC, b.created_at DESC
      LIMIT ?
    `;

    return await this.db.getAll(sql, params);
  }

  /**
   * Get behavior trends for a student
   */
  async getStudentTrends(studentId, days = 30) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const sql = `
      SELECT 
        date,
        type,
        COUNT(*) as count
      FROM behavior
      WHERE student_id = ? AND date >= ?
      GROUP BY date, type
      ORDER BY date ASC
    `;

    return await this.db.getAll(sql, [studentId, startDate.toISOString().split('T')[0]]);
  }
}

export default new BehaviorRepository();
