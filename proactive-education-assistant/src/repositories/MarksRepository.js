// Marks Repository
import BaseRepository from './BaseRepository';

class MarksRepository extends BaseRepository {
  constructor() {
    super('marks');
  }

  /**
   * Find marks by student ID
   */
  async findByStudent(studentId) {
    return await this.findAll('student_id = ?', [studentId]);
  }

  /**
   * Find marks by exam ID
   */
  async findByExam(examId) {
    return await this.findAll('exam_id = ?', [examId]);
  }

  /**
   * Find marks for a student in an exam
   */
  async findByStudentAndExam(studentId, examId) {
    return await this.findOne('student_id = ? AND exam_id = ?', [studentId, examId]);
  }

  /**
   * Check if marks exist for student in exam
   */
  async existsForStudentInExam(studentId, examId) {
    return await this.exists('student_id = ? AND exam_id = ?', [studentId, examId]);
  }

  /**
   * Enter marks for a student
   */
  async enterMarks(data) {
    // Check if marks already exist
    const exists = await this.existsForStudentInExam(data.student_id, data.exam_id);

    if (exists) {
      // Update existing marks
      const existing = await this.findByStudentAndExam(data.student_id, data.exam_id);
      return await this.update(existing.id, {
        marks_obtained: data.marks_obtained,
        remarks: data.remarks,
      });
    } else {
      // Create new marks record
      return await this.create(data);
    }
  }

  /**
   * Bulk enter marks
   */
  async bulkEnterMarks(examId, marksData) {
    const statements = [];

    for (const data of marksData) {
      const exists = await this.existsForStudentInExam(data.student_id, examId);

      if (exists) {
        // Update
        const existing = await this.findByStudentAndExam(data.student_id, examId);
        statements.push({
          sql: `UPDATE marks SET marks_obtained = ?, remarks = ?, updated_at = ? WHERE id = ?`,
          params: [data.marks_obtained, data.remarks, this.now(), existing.id],
        });
      } else {
        // Insert
        const record = {
          id: this.generateId(),
          student_id: data.student_id,
          exam_id: examId,
          marks_obtained: data.marks_obtained,
          remarks: data.remarks,
          teacher_id: data.teacher_id,
          verified: 0,
          created_at: this.now(),
        };

        const keys = Object.keys(record);
        const values = Object.values(record);
        const placeholders = keys.map(() => '?').join(', ');

        statements.push({
          sql: `INSERT INTO marks (${keys.join(', ')}) VALUES (${placeholders})`,
          params: values,
        });
      }
    }

    await this.db.transaction(statements);
    return { success: true, count: marksData.length };
  }

  /**
   * Verify marks
   */
  async verifyMarks(marksId) {
    return await this.update(marksId, { verified: 1 });
  }

  /**
   * Get student marks statistics
   */
  async getStudentStatistics(studentId) {
    const sql = `
      SELECT 
        COUNT(*) as total_exams,
        AVG(marks_obtained) as average_marks,
        MAX(marks_obtained) as highest_marks,
        MIN(marks_obtained) as lowest_marks,
        SUM(CASE WHEN verified = 1 THEN 1 ELSE 0 END) as verified_count
      FROM marks
      WHERE student_id = ?
    `;

    return await this.db.getOne(sql, [studentId]);
  }

  /**
   * Get exam marks statistics
   */
  async getExamStatistics(examId) {
    const sql = `
      SELECT 
        COUNT(*) as total_students,
        AVG(marks_obtained) as average_marks,
        MAX(marks_obtained) as highest_marks,
        MIN(marks_obtained) as lowest_marks,
        SUM(CASE WHEN verified = 1 THEN 1 ELSE 0 END) as verified_count
      FROM marks
      WHERE exam_id = ?
    `;

    return await this.db.getOne(sql, [examId]);
  }

  /**
   * Get marks with exam details
   */
  async findWithExamDetails(studentId) {
    const sql = `
      SELECT 
        m.*,
        e.name as exam_name,
        e.exam_date,
        e.total_marks,
        e.passing_marks,
        s.name as subject_name
      FROM marks m
      JOIN exams e ON m.exam_id = e.id
      JOIN subjects s ON e.subject_id = s.id
      WHERE m.student_id = ?
      ORDER BY e.exam_date DESC
    `;

    return await this.db.getAll(sql, [studentId]);
  }
}

export default new MarksRepository();
