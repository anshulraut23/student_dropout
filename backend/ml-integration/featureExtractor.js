import { getPostgresPool } from '../database/connection.js';

/**
 * Feature Extractor for ML Dropout Prediction
 * Extracts student features from PostgreSQL using raw SQL
 * Enforces strict business rules: NULL vs ZERO handling
 */

class FeatureExtractor {
  /**
   * Extract features for a single student
   * @param {string} studentId - Student UUID
   * @param {string} schoolId - School UUID
   * @returns {Promise<Object>} Features object with data_tier
   */
  async extractFeatures(studentId, schoolId) {
    const pool = getPostgresPool();
    
    try {
      // Extract all features in parallel
      const [attendanceData, marksData, behaviorData] = await Promise.all([
        this._extractAttendanceFeatures(pool, studentId, schoolId),
        this._extractAcademicFeatures(pool, studentId, schoolId),
        this._extractBehaviorFeatures(pool, studentId, schoolId)
      ]);
      
      // Calculate data tier
      const dataTier = this._calculateDataTier(
        attendanceData.days_tracked,
        marksData.exams_completed
      );
      
      return {
        student_id: studentId,
        features: {
          // Attendance features
          attendance_rate: attendanceData.attendance_rate,
          days_tracked: attendanceData.days_tracked,
          days_present: attendanceData.days_present,
          days_absent: attendanceData.days_absent,
          
          // Academic features
          avg_marks_percentage: marksData.avg_marks_percentage,
          exams_completed: marksData.exams_completed,
          total_marks_obtained: marksData.total_marks_obtained,
          total_marks_possible: marksData.total_marks_possible,
          
          // Behavior features
          behavior_score: behaviorData.behavior_score,
          total_incidents: behaviorData.total_incidents,
          positive_incidents: behaviorData.positive_incidents,
          negative_incidents: behaviorData.negative_incidents,
          
          // Data quality
          data_tier: dataTier
        },
        metadata: {
          extracted_at: new Date().toISOString(),
          data_tier_label: this._getDataTierLabel(dataTier)
        }
      };
    } catch (error) {
      console.error('Feature extraction error:', error);
      throw new Error(`Failed to extract features: ${error.message}`);
    }
  }
  
  /**
   * Extract attendance features
   * RULE: Only count days that are actually marked (not NULL)
   */
  async _extractAttendanceFeatures(pool, studentId, schoolId) {
    const query = `
      SELECT 
        COUNT(*) FILTER (WHERE status IS NOT NULL) as days_tracked,
        COUNT(*) FILTER (WHERE status = 'present') as days_present,
        COUNT(*) FILTER (WHERE status = 'absent') as days_absent,
        CASE 
          WHEN COUNT(*) FILTER (WHERE status IS NOT NULL) > 0 
          THEN CAST(COUNT(*) FILTER (WHERE status = 'present') AS FLOAT) / 
               COUNT(*) FILTER (WHERE status IS NOT NULL)
          ELSE 0
        END as attendance_rate
      FROM attendance
      WHERE student_id = $1 
        AND status IS NOT NULL
    `;
    
    const result = await pool.query(query, [studentId]);
    const row = result.rows[0];
    
    return {
      attendance_rate: parseFloat(row.attendance_rate) || 0,
      days_tracked: parseInt(row.days_tracked) || 0,
      days_present: parseInt(row.days_present) || 0,
      days_absent: parseInt(row.days_absent) || 0
    };
  }
  
  /**
   * Extract academic features
   * RULE: Only count exams with status IN ('submitted', 'verified')
   */
  async _extractAcademicFeatures(pool, studentId, schoolId) {
    const query = `
      SELECT 
        COUNT(*) as exams_completed,
        COALESCE(SUM(m.marks_obtained), 0) as total_marks_obtained,
        COALESCE(SUM(e.total_marks), 0) as total_marks_possible,
        CASE 
          WHEN SUM(e.total_marks) > 0 
          THEN (CAST(SUM(m.marks_obtained) AS FLOAT) / SUM(e.total_marks)) * 100
          ELSE 0
        END as avg_marks_percentage
      FROM marks m
      JOIN exams e ON m.exam_id = e.id
      WHERE m.student_id = $1 
        AND e.school_id = $2
        AND m.status IN ('submitted', 'verified')
        AND m.marks_obtained IS NOT NULL
        AND e.total_marks > 0
    `;
    
    const result = await pool.query(query, [studentId, schoolId]);
    const row = result.rows[0];
    
    return {
      exams_completed: parseInt(row.exams_completed) || 0,
      total_marks_obtained: parseFloat(row.total_marks_obtained) || 0,
      total_marks_possible: parseFloat(row.total_marks_possible) || 0,
      avg_marks_percentage: parseFloat(row.avg_marks_percentage) || 0
    };
  }
  
  /**
   * Extract behavior features
   * RULE: No behavior records = positive signal (score = 100, not error)
   */
  async _extractBehaviorFeatures(pool, studentId, schoolId) {
    const query = `
      SELECT 
        COUNT(*) as total_incidents,
        COUNT(*) FILTER (WHERE behavior_type = 'positive') as positive_incidents,
        COUNT(*) FILTER (WHERE behavior_type = 'negative') as negative_incidents,
        CASE 
          WHEN COUNT(*) = 0 THEN 100
          ELSE GREATEST(0, 100 - (COUNT(*) FILTER (WHERE behavior_type = 'negative') * 10))
        END as behavior_score
      FROM behavior
      WHERE student_id = $1
    `;
    
    const result = await pool.query(query, [studentId]);
    const row = result.rows[0];
    
    return {
      behavior_score: parseFloat(row.behavior_score) || 100,
      total_incidents: parseInt(row.total_incidents) || 0,
      positive_incidents: parseInt(row.positive_incidents) || 0,
      negative_incidents: parseInt(row.negative_incidents) || 0
    };
  }
  
  /**
   * Calculate data tier based on completeness
   * Tier 0: Insufficient data (block prediction)
   * Tier 1: Low confidence (14-30 days, 1-2 exams)
   * Tier 2: Medium confidence (30-60 days, 3-5 exams)
   * Tier 3: High confidence (60+ days, 5+ exams)
   */
  _calculateDataTier(daysTracked, examsCompleted) {
    // Tier 0: Insufficient data
    if (daysTracked < 14 || examsCompleted < 1) {
      return 0;
    }
    
    // Tier 3: High confidence
    if (daysTracked >= 60 && examsCompleted >= 5) {
      return 3;
    }
    
    // Tier 2: Medium confidence
    if (daysTracked >= 30 && examsCompleted >= 3) {
      return 2;
    }
    
    // Tier 1: Low confidence
    return 1;
  }
  
  _getDataTierLabel(tier) {
    const labels = {
      0: 'Insufficient Data',
      1: 'Low Confidence',
      2: 'Medium Confidence',
      3: 'High Confidence'
    };
    return labels[tier] || 'Unknown';
  }
  
  /**
   * Extract features for multiple students (batch)
   */
  async extractBatchFeatures(studentIds, schoolId) {
    const results = await Promise.all(
      studentIds.map(studentId => 
        this.extractFeatures(studentId, schoolId)
          .catch(error => ({
            student_id: studentId,
            error: error.message
          }))
      )
    );
    
    return results;
  }
}

export default new FeatureExtractor();
