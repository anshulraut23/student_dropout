const featureExtractor = require('./featureExtractor');
const mlClient = require('./mlClient');
const { getPool } = require('../database/connection');

/**
 * Risk Controller - Orchestrates ML prediction workflow
 * This is the NEW isolated controller (does not modify existing controllers)
 */

class RiskController {
  /**
   * Get risk prediction for a single student
   * GET /api/ml/risk/:studentId
   */
  async getStudentRisk(req, res) {
    try {
      const { studentId } = req.params;
      const schoolId = req.user.school_id;
      
      // Step 1: Extract features from database
      const featureData = await featureExtractor.extractFeatures(studentId, schoolId);
      
      // Step 2: Check data tier (block if insufficient)
      if (featureData.features.data_tier === 0) {
        return res.status(400).json({
          error: 'Insufficient data for prediction',
          message: 'Student needs at least 14 days of attendance and 1 completed exam',
          data_tier: 0,
          features: featureData.features
        });
      }
      
      // Step 3: Get student metadata
      const studentMetadata = await this._getStudentMetadata(studentId, schoolId);
      
      // Step 4: Call ML service
      const mlPayload = {
        student_id: studentId,
        features: featureData.features,
        metadata: studentMetadata
      };
      
      const prediction = await mlClient.predictRisk(mlPayload);
      
      if (!prediction.success) {
        return res.status(503).json({
          error: 'ML service error',
          message: prediction.message || prediction.error
        });
      }
      
      // Step 5: Store prediction in database
      await this._storePrediction(studentId, schoolId, prediction.data);
      
      // Step 6: Return result
      return res.json({
        success: true,
        student_id: studentId,
        prediction: prediction.data.prediction,
        feature_importance: prediction.data.feature_importance,
        explanation: prediction.data.explanation,
        recommendations: prediction.data.recommendations,
        priority_actions: prediction.data.priority_actions,
        metadata: prediction.data.metadata
      });
      
    } catch (error) {
      console.error('Risk prediction error:', error);
      return res.status(500).json({
        error: 'Prediction failed',
        message: error.message
      });
    }
  }
  
  /**
   * Get risk predictions for all students in a class
   * GET /api/ml/risk/class/:classId
   */
  async getClassRisk(req, res) {
    try {
      const { classId } = req.params;
      const schoolId = req.user.school_id;
      
      // Get all students in class
      const pool = getPool();
      const studentsQuery = `
        SELECT student_id, name 
        FROM students 
        WHERE class_id = $1 AND school_id = $2 AND status = 'active'
      `;
      const studentsResult = await pool.query(studentsQuery, [classId, schoolId]);
      
      if (studentsResult.rows.length === 0) {
        return res.json({
          success: true,
          class_id: classId,
          predictions: []
        });
      }
      
      // Extract features for all students
      const studentIds = studentsResult.rows.map(s => s.student_id);
      const featuresData = await featureExtractor.extractBatchFeatures(studentIds, schoolId);
      
      // Filter students with sufficient data
      const validStudents = featuresData.filter(f => 
        !f.error && f.features.data_tier > 0
      );
      
      if (validStudents.length === 0) {
        return res.json({
          success: true,
          class_id: classId,
          predictions: [],
          message: 'No students have sufficient data for prediction'
        });
      }
      
      // Call ML service for batch prediction
      const mlPayload = validStudents.map(f => ({
        student_id: f.student_id,
        features: f.features
      }));
      
      const batchResult = await mlClient.batchPredict(mlPayload);
      
      if (!batchResult.success) {
        return res.status(503).json({
          error: 'ML service error',
          message: batchResult.error
        });
      }
      
      // Merge with student names
      const predictions = batchResult.data.predictions.map(pred => {
        const student = studentsResult.rows.find(s => s.student_id === pred.student_id);
        return {
          ...pred,
          student_name: student?.name
        };
      });
      
      return res.json({
        success: true,
        class_id: classId,
        total_students: studentsResult.rows.length,
        predictions_generated: predictions.length,
        predictions: predictions
      });
      
    } catch (error) {
      console.error('Class risk prediction error:', error);
      return res.status(500).json({
        error: 'Prediction failed',
        message: error.message
      });
    }
  }
  
  /**
   * Get risk dashboard statistics
   * GET /api/ml/risk/dashboard
   */
  async getRiskDashboard(req, res) {
    try {
      const schoolId = req.user.school_id;
      const pool = getPool();
      
      // Get recent predictions with risk breakdown
      const query = `
        SELECT 
          risk_level,
          COUNT(*) as count,
          AVG(risk_score) as avg_score
        FROM risk_predictions
        WHERE school_id = $1 
          AND created_at > NOW() - INTERVAL '30 days'
        GROUP BY risk_level
        ORDER BY 
          CASE risk_level
            WHEN 'critical' THEN 1
            WHEN 'high' THEN 2
            WHEN 'medium' THEN 3
            WHEN 'low' THEN 4
          END
      `;
      
      const result = await pool.query(query, [schoolId]);
      
      const stats = {
        total: 0,
        by_level: {},
        critical_students: []
      };
      
      result.rows.forEach(row => {
        stats.total += parseInt(row.count);
        stats.by_level[row.risk_level] = {
          count: parseInt(row.count),
          avg_score: parseFloat(row.avg_score).toFixed(3)
        };
      });
      
      // Get critical students list
      const criticalQuery = `
        SELECT 
          rp.student_id,
          s.name as student_name,
          c.name as class_name,
          rp.risk_score,
          rp.confidence,
          rp.created_at
        FROM risk_predictions rp
        JOIN students s ON rp.student_id = s.student_id
        JOIN classes c ON s.class_id = c.class_id
        WHERE rp.school_id = $1 
          AND rp.risk_level = 'critical'
          AND rp.created_at > NOW() - INTERVAL '7 days'
        ORDER BY rp.risk_score DESC
        LIMIT 10
      `;
      
      const criticalResult = await pool.query(criticalQuery, [schoolId]);
      stats.critical_students = criticalResult.rows;
      
      return res.json({
        success: true,
        stats: stats
      });
      
    } catch (error) {
      console.error('Dashboard error:', error);
      return res.status(500).json({
        error: 'Failed to load dashboard',
        message: error.message
      });
    }
  }
  
  /**
   * Get student metadata for ML context
   */
  async _getStudentMetadata(studentId, schoolId) {
    const pool = getPool();
    const query = `
      SELECT 
        s.name as student_name,
        s.roll_number,
        c.name as class_name,
        c.section
      FROM students s
      JOIN classes c ON s.class_id = c.class_id
      WHERE s.student_id = $1 AND s.school_id = $2
    `;
    
    const result = await pool.query(query, [studentId, schoolId]);
    return result.rows[0] || {};
  }
  
  /**
   * Store prediction result in database
   */
  async _storePrediction(studentId, schoolId, predictionData) {
    const pool = getPool();
    const query = `
      INSERT INTO risk_predictions (
        student_id, school_id, risk_score, risk_level, 
        confidence, data_tier, component_scores, 
        recommendations, created_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW())
      ON CONFLICT (student_id, school_id) 
      DO UPDATE SET
        risk_score = EXCLUDED.risk_score,
        risk_level = EXCLUDED.risk_level,
        confidence = EXCLUDED.confidence,
        data_tier = EXCLUDED.data_tier,
        component_scores = EXCLUDED.component_scores,
        recommendations = EXCLUDED.recommendations,
        updated_at = NOW()
    `;
    
    // Store feature importance in component_scores field
    const componentScores = {
      feature_importance: predictionData.feature_importance || {},
      model_type: predictionData.prediction.model_type || 'RandomForest'
    };
    
    await pool.query(query, [
      studentId,
      schoolId,
      predictionData.prediction.risk_score,
      predictionData.prediction.risk_level,
      predictionData.prediction.confidence,
      predictionData.prediction.data_tier,
      JSON.stringify(componentScores),
      JSON.stringify(predictionData.recommendations)
    ]);
  }
}

module.exports = new RiskController();
