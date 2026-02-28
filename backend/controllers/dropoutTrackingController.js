import { getPostgresPool } from '../database/connection.js';

/**
 * Dropout Tracking Controller
 * Manages student dropout status and historical tracking
 */

class DropoutTrackingController {
  /**
   * Update student dropout status
   * POST /api/dropout/update-status
   */
  async updateDropoutStatus(req, res) {
    try {
      const { studentId, dropoutStatus, dropoutDate, dropoutReason, dropoutNotes } = req.body;
      const schoolId = req.user.schoolId;
      const userId = req.user.userId;
      
      if (!studentId || !dropoutStatus) {
        return res.status(400).json({
          error: 'Missing required fields',
          message: 'studentId and dropoutStatus are required'
        });
      }
      
      // Validate dropout status
      const validStatuses = ['active', 'dropped_out', 'graduated', 'transferred'];
      if (!validStatuses.includes(dropoutStatus)) {
        return res.status(400).json({
          error: 'Invalid dropout status',
          message: `Status must be one of: ${validStatuses.join(', ')}`
        });
      }
      
      const pool = getPostgresPool();
      
      // Get current student status
      const currentQuery = `
        SELECT dropout_status, name 
        FROM students 
        WHERE id = $1 AND school_id = $2
      `;
      const currentResult = await pool.query(currentQuery, [studentId, schoolId]);
      
      if (currentResult.rows.length === 0) {
        return res.status(404).json({
          error: 'Student not found'
        });
      }
      
      const previousStatus = currentResult.rows[0].dropout_status || 'active';
      const studentName = currentResult.rows[0].name;
      
      // Update student status
      const updateQuery = `
        UPDATE students 
        SET 
          dropout_status = $1::VARCHAR,
          dropout_date = $2::DATE,
          dropout_reason = $3::TEXT,
          dropout_notes = $4::TEXT,
          status = CASE 
            WHEN $1 = 'active' THEN 'active'
            ELSE 'inactive'
          END
        WHERE id = $5 AND school_id = $6
        RETURNING *
      `;
      
      const updateResult = await pool.query(updateQuery, [
        dropoutStatus,
        dropoutDate ? new Date(dropoutDate).toISOString().split('T')[0] : null,
        dropoutReason || null,
        dropoutNotes || null,
        studentId,
        schoolId
      ]);
      
      // Record in history (use simpler approach without explicit casting)
      const historyId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const historyQuery = `
        INSERT INTO dropout_history (
          id, student_id, school_id, previous_status, new_status,
          dropout_date, dropout_reason, dropout_notes, changed_by
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        RETURNING *
      `;
      
      await pool.query(historyQuery, [
        historyId,
        studentId,
        schoolId,
        previousStatus,
        dropoutStatus,
        dropoutDate ? new Date(dropoutDate).toISOString().split('T')[0] : null,
        dropoutReason || null,
        dropoutNotes || null,
        userId
      ]);
      
      console.log(`Student ${studentName} status updated: ${previousStatus} → ${dropoutStatus}`);
      
      return res.json({
        success: true,
        message: `Student status updated to ${dropoutStatus}`,
        student: updateResult.rows[0]
      });
      
    } catch (error) {
      console.error('Update dropout status error:', error);
      return res.status(500).json({
        error: 'Failed to update status',
        message: error.message
      });
    }
  }
  
  /**
   * Get dropout statistics for school
   * GET /api/dropout/statistics
   */
  async getDropoutStatistics(req, res) {
    try {
      const schoolId = req.user.schoolId;
      const pool = getPostgresPool();
      
      // Get counts by status
      const statsQuery = `
        SELECT 
          dropout_status,
          COUNT(*) as count
        FROM students
        WHERE school_id = $1
        GROUP BY dropout_status
      `;
      
      const statsResult = await pool.query(statsQuery, [schoolId]);
      
      // Get recent dropouts
      const recentQuery = `
        SELECT 
          s.id,
          s.name,
          s.roll_number,
          c.name as class_name,
          s.dropout_status,
          s.dropout_date,
          s.dropout_reason,
          s.dropout_notes
        FROM students s
        LEFT JOIN classes c ON s.class_id = c.id
        WHERE s.school_id = $1 
          AND s.dropout_status IN ('dropped_out', 'transferred')
        ORDER BY s.dropout_date DESC NULLS LAST
        LIMIT 20
      `;
      
      const recentResult = await pool.query(recentQuery, [schoolId]);
      
      // Calculate dropout rate
      const totalStudents = statsResult.rows.reduce((sum, row) => sum + parseInt(row.count), 0);
      const droppedOut = statsResult.rows.find(r => r.dropout_status === 'dropped_out')?.count || 0;
      const dropoutRate = totalStudents > 0 ? (droppedOut / totalStudents * 100).toFixed(2) : 0;
      
      return res.json({
        success: true,
        statistics: {
          total_students: totalStudents,
          by_status: statsResult.rows.reduce((acc, row) => {
            acc[row.dropout_status] = parseInt(row.count);
            return acc;
          }, {}),
          dropout_rate: parseFloat(dropoutRate),
          recent_dropouts: recentResult.rows
        }
      });
      
    } catch (error) {
      console.error('Get dropout statistics error:', error);
      return res.status(500).json({
        error: 'Failed to get statistics',
        message: error.message
      });
    }
  }
  
  /**
   * Get dropout history for a student
   * GET /api/dropout/history/:studentId
   */
  async getStudentDropoutHistory(req, res) {
    try {
      const { studentId } = req.params;
      const schoolId = req.user.schoolId;
      const pool = getPostgresPool();
      
      const query = `
        SELECT 
          dh.*,
          u.full_name as changed_by_name
        FROM dropout_history dh
        LEFT JOIN users u ON dh.changed_by = u.id
        WHERE dh.student_id = $1 AND dh.school_id = $2
        ORDER BY dh.changed_at DESC
      `;
      
      const result = await pool.query(query, [studentId, schoolId]);
      
      return res.json({
        success: true,
        history: result.rows
      });
      
    } catch (error) {
      console.error('Get dropout history error:', error);
      return res.status(500).json({
        error: 'Failed to get history',
        message: error.message
      });
    }
  }
  
  /**
   * Get training data for ML model
   * GET /api/dropout/training-data
   */
  async getTrainingData(req, res) {
    try {
      const schoolId = req.user.schoolId;
      const pool = getPostgresPool();
      
      // Get all students with their features and dropout status
      const query = `
        SELECT 
          s.id as student_id,
          s.name,
          s.dropout_status,
          s.dropout_date,
          s.dropout_reason,
          COUNT(DISTINCT a.id) as total_attendance_records,
          COUNT(DISTINCT CASE WHEN a.status = 'present' THEN a.id END) as days_present,
          COUNT(DISTINCT CASE WHEN a.status = 'absent' THEN a.id END) as days_absent,
          COUNT(DISTINCT m.id) as exams_completed,
          AVG(CASE WHEN m.total_marks > 0 THEN (m.marks_obtained::FLOAT / m.total_marks * 100) END) as avg_marks_percentage,
          COUNT(DISTINCT b.id) as total_behavior_incidents,
          COUNT(DISTINCT CASE WHEN b.behavior_type = 'positive' THEN b.id END) as positive_incidents,
          COUNT(DISTINCT CASE WHEN b.behavior_type = 'negative' THEN b.id END) as negative_incidents
        FROM students s
        LEFT JOIN attendance a ON s.id = a.student_id
        LEFT JOIN marks m ON s.id = m.student_id
        LEFT JOIN behavior b ON s.id = b.student_id
        WHERE s.school_id = $1
        GROUP BY s.id, s.name, s.dropout_status, s.dropout_date, s.dropout_reason
        HAVING COUNT(DISTINCT a.id) >= 3 AND COUNT(DISTINCT m.id) >= 1
      `;
      
      const result = await pool.query(query, [schoolId]);
      
      // Format for ML training
      const trainingData = result.rows.map(row => {
        const attendanceRate = row.total_attendance_records > 0 
          ? row.days_present / row.total_attendance_records 
          : 0;
        
        const behaviorScore = row.total_behavior_incidents > 0
          ? ((row.positive_incidents - row.negative_incidents) / row.total_behavior_incidents * 50 + 50)
          : 80;
        
        return {
          student_id: row.student_id,
          student_name: row.name,
          attendance_rate: attendanceRate,
          avg_marks_percentage: row.avg_marks_percentage || 0,
          behavior_score: Math.max(0, Math.min(100, behaviorScore)),
          days_tracked: row.total_attendance_records,
          exams_completed: row.exams_completed,
          days_present: row.days_present,
          days_absent: row.days_absent,
          total_incidents: row.total_behavior_incidents,
          positive_incidents: row.positive_incidents,
          negative_incidents: row.negative_incidents,
          dropped_out: row.dropout_status === 'dropped_out' ? 1 : 0,
          dropout_date: row.dropout_date,
          dropout_reason: row.dropout_reason
        };
      });
      
      return res.json({
        success: true,
        total_records: trainingData.length,
        dropped_out_count: trainingData.filter(d => d.dropped_out === 1).length,
        active_count: trainingData.filter(d => d.dropped_out === 0).length,
        training_data: trainingData
      });
      
    } catch (error) {
      console.error('Get training data error:', error);
      return res.status(500).json({
        error: 'Failed to get training data',
        message: error.message
      });
    }
  }
  
  /**
   * Save model performance metrics
   * POST /api/dropout/model-performance
   */
  async saveModelPerformance(req, res) {
    try {
      const {
        modelVersion,
        trainingSamples,
        testSamples,
        accuracy,
        precision,
        recall,
        f1Score,
        confusionMatrix,
        featureImportance,
        notes
      } = req.body;
      
      const schoolId = req.user.schoolId;
      const pool = getPostgresPool();
      
      const performanceId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const query = `
        INSERT INTO model_performance (
          id, school_id, model_version, training_date, training_samples, test_samples,
          accuracy, precision_score, recall_score, f1_score,
          confusion_matrix, feature_importance, notes
        ) VALUES ($1, $2, $3, NOW(), $4, $5, $6, $7, $8, $9, $10, $11, $12)
        RETURNING *
      `;
      
      const result = await pool.query(query, [
        performanceId,
        schoolId,
        modelVersion,
        trainingSamples,
        testSamples,
        accuracy,
        precision,
        recall,
        f1Score,
        JSON.stringify(confusionMatrix),
        JSON.stringify(featureImportance),
        notes
      ]);
      
      console.log(`Model performance saved: Accuracy=${accuracy}, F1=${f1Score}`);
      
      return res.json({
        success: true,
        performance: result.rows[0]
      });
      
    } catch (error) {
      console.error('Save model performance error:', error);
      return res.status(500).json({
        error: 'Failed to save performance',
        message: error.message
      });
    }
  }
  
  /**
   * Get model performance history
   * GET /api/dropout/model-performance
   */
  async getModelPerformance(req, res) {
    try {
      const schoolId = req.user.schoolId;
      const pool = getPostgresPool();
      
      const query = `
        SELECT *
        FROM model_performance
        WHERE school_id = $1
        ORDER BY training_date DESC
        LIMIT 10
      `;
      
      const result = await pool.query(query, [schoolId]);
      
      return res.json({
        success: true,
        performance_history: result.rows
      });
      
    } catch (error) {
      console.error('Get model performance error:', error);
      return res.status(500).json({
        error: 'Failed to get performance',
        message: error.message
      });
    }
  }
}

export default new DropoutTrackingController();
