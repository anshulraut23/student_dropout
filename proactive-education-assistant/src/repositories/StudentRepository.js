// Student Repository
import BaseRepository from './BaseRepository';

class StudentRepository extends BaseRepository {
  constructor() {
    super('students');
  }

  /**
   * Find students by class ID
   */
  async findByClass(classId) {
    return await this.findAll('class_id = ?', [classId]);
  }

  /**
   * Find students by school ID
   */
  async findBySchool(schoolId) {
    return await this.findAll('school_id = ?', [schoolId]);
  }

  /**
   * Search students by name
   */
  async searchByName(name) {
    return await this.findAll('name LIKE ?', [`%${name}%`]);
  }

  /**
   * Find student by roll number
   */
  async findByRollNumber(rollNumber, classId) {
    return await this.findOne('roll_number = ? AND class_id = ?', [rollNumber, classId]);
  }

  /**
   * Get students with risk predictions
   */
  async findWithRiskPredictions(classId = null) {
    const where = classId 
      ? `WHERE s.class_id = '${classId}'`
      : '';

    const sql = `
      SELECT 
        s.*,
        r.risk_level,
        r.risk_score,
        r.factors,
        r.last_updated as risk_last_updated
      FROM students s
      LEFT JOIN risk_predictions r ON s.id = r.student_id
      ${where}
      ORDER BY s.name
    `;

    return await this.db.getAll(sql);
  }

  /**
   * Get student statistics
   */
  async getStatistics(studentId) {
    const sql = `
      SELECT 
        (SELECT COUNT(*) FROM attendance WHERE student_id = ? AND status = 'present') as total_present,
        (SELECT COUNT(*) FROM attendance WHERE student_id = ? AND status = 'absent') as total_absent,
        (SELECT AVG(marks_obtained) FROM marks WHERE student_id = ?) as avg_marks,
        (SELECT COUNT(*) FROM behavior WHERE student_id = ? AND type = 'positive') as positive_behavior,
        (SELECT COUNT(*) FROM behavior WHERE student_id = ? AND type = 'negative') as negative_behavior,
        (SELECT COUNT(*) FROM interventions WHERE student_id = ?) as total_interventions
    `;

    return await this.db.getOne(sql, [studentId, studentId, studentId, studentId, studentId, studentId]);
  }
}

export default new StudentRepository();
