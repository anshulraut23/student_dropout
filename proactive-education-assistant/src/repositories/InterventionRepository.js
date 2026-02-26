// Intervention Repository
import BaseRepository from './BaseRepository';

class InterventionRepository extends BaseRepository {
  constructor() {
    super('interventions');
  }

  /**
   * Find interventions by student ID
   */
  async findByStudent(studentId, status = null) {
    const where = status 
      ? 'student_id = ? AND status = ?'
      : 'student_id = ?';
    const params = status ? [studentId, status] : [studentId];

    return await this.findAll(where + ' ORDER BY date DESC', params);
  }

  /**
   * Find interventions by teacher ID
   */
  async findByTeacher(teacherId, status = null) {
    const where = status 
      ? 'teacher_id = ? AND status = ?'
      : 'teacher_id = ?';
    const params = status ? [teacherId, status] : [teacherId];

    return await this.findAll(where + ' ORDER BY date DESC', params);
  }

  /**
   * Find interventions by status
   */
  async findByStatus(status) {
    return await this.findAll('status = ? ORDER BY date DESC', [status]);
  }

  /**
   * Find pending interventions
   */
  async findPending() {
    return await this.findByStatus('pending');
  }

  /**
   * Find active interventions (pending or in_progress)
   */
  async findActive(studentId = null) {
    const where = studentId
      ? "status IN ('pending', 'in_progress') AND student_id = ?"
      : "status IN ('pending', 'in_progress')";
    const params = studentId ? [studentId] : [];

    return await this.findAll(where + ' ORDER BY date DESC', params);
  }

  /**
   * Find interventions due for follow-up
   */
  async findDueForFollowUp(date = null) {
    const checkDate = date || new Date().toISOString().split('T')[0];
    
    const sql = `
      SELECT 
        i.*,
        s.name as student_name,
        u.name as teacher_name
      FROM interventions i
      JOIN students s ON i.student_id = s.id
      JOIN users u ON i.teacher_id = u.id
      WHERE i.follow_up_date <= ? AND i.status IN ('pending', 'in_progress')
      ORDER BY i.follow_up_date ASC
    `;

    return await this.db.getAll(sql, [checkDate]);
  }

  /**
   * Update intervention status
   */
  async updateStatus(interventionId, status, actionTaken = null) {
    const updates = { status };
    
    if (actionTaken) {
      updates.action_taken = actionTaken;
    }

    return await this.update(interventionId, updates);
  }

  /**
   * Complete an intervention
   */
  async complete(interventionId, actionTaken) {
    return await this.updateStatus(interventionId, 'completed', actionTaken);
  }

  /**
   * Cancel an intervention
   */
  async cancel(interventionId) {
    return await this.updateStatus(interventionId, 'cancelled');
  }

  /**
   * Get intervention statistics for a student
   */
  async getStudentStatistics(studentId) {
    const sql = `
      SELECT 
        COUNT(*) as total_interventions,
        SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending_count,
        SUM(CASE WHEN status = 'in_progress' THEN 1 ELSE 0 END) as in_progress_count,
        SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed_count,
        SUM(CASE WHEN status = 'cancelled' THEN 1 ELSE 0 END) as cancelled_count
      FROM interventions
      WHERE student_id = ?
    `;

    return await this.db.getOne(sql, [studentId]);
  }

  /**
   * Get recent interventions with details
   */
  async getRecentWithDetails(limit = 10, teacherId = null) {
    const where = teacherId ? 'WHERE i.teacher_id = ?' : '';
    const params = teacherId ? [teacherId, limit] : [limit];

    const sql = `
      SELECT 
        i.*,
        s.name as student_name,
        s.class_id,
        c.name as class_name,
        u.name as teacher_name
      FROM interventions i
      JOIN students s ON i.student_id = s.id
      JOIN classes c ON s.class_id = c.id
      JOIN users u ON i.teacher_id = u.id
      ${where}
      ORDER BY i.date DESC, i.created_at DESC
      LIMIT ?
    `;

    return await this.db.getAll(sql, params);
  }

  /**
   * Get intervention summary by type
   */
  async getSummaryByType(startDate = null, endDate = null) {
    let where = '1=1';
    const params = [];

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
        type,
        COUNT(*) as count,
        SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed_count
      FROM interventions
      WHERE ${where}
      GROUP BY type
      ORDER BY count DESC
    `;

    return await this.db.getAll(sql, params);
  }
}

export default new InterventionRepository();
