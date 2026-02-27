import featureExtractor from './featureExtractor.js';
import mlClient from './mlClient.js';
import { getPostgresPool } from '../database/connection.js';
import { canTeacherAccessClass, canTeacherAccessStudent } from '../utils/teacherAccessControl.js';
import dataStore from '../storage/dataStore.js';

/**
 * Risk Controller - Orchestrates ML prediction workflow
 * This is the NEW isolated controller (does not modify existing controllers)
 */

class RiskController {
  /**
   * Get risk prediction for a single student
   * GET /api/ml/risk/student/:studentId
   */
  async getStudentRisk(req, res) {
    try {
      const { studentId } = req.params;
      const schoolId = req.user.schoolId;
      const role = req.user.role;
      const userId = req.user.userId;
      
      // For teachers, verify they have access to this student
      if (role === 'teacher') {
        const hasAccess = await canTeacherAccessStudent(dataStore, userId, studentId, schoolId);
        if (!hasAccess) {
          return res.status(403).json({
            error: 'Access denied',
            message: 'You do not have access to this student'
          });
        }
      }
      
      // Step 1: Extract features from database
      const featureData = await featureExtractor.extractFeatures(studentId, schoolId);
      
      // Step 2: Check data tier (block if insufficient)
      if (featureData.features.data_tier === 0) {
        const daysTracked = featureData.features.days_tracked || 0;
        const examsCompleted = featureData.features.exams_completed || 0;
        const daysNeeded = Math.max(0, 3 - daysTracked);
        const examsNeeded = Math.max(0, 1 - examsCompleted);
        
        return res.status(400).json({
          error: 'Insufficient data for prediction',
          message: 'Student needs at least 3 days of attendance and 1 completed exam',
          data_tier: 0,
          features: featureData.features,
          missing: {
            days_needed: daysNeeded,
            exams_needed: examsNeeded,
            current_days: daysTracked,
            current_exams: examsCompleted
          }
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
      
      // Step 6: Calculate risk breakdown components
      const components = this._calculateRiskBreakdown(featureData.features, prediction.data.prediction);
      
      // Step 7: Return result
      return res.json({
        success: true,
        student_id: studentId,
        prediction: prediction.data.prediction,
        components: components,
        features: featureData.features, // Include features for XAI
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
      const schoolId = req.user.schoolId;
      const role = req.user.role;
      const userId = req.user.userId;
      
      // For teachers, verify they have access to this class
      if (role === 'teacher') {
        const hasAccess = await canTeacherAccessClass(dataStore, userId, classId, schoolId);
        if (!hasAccess) {
          return res.status(403).json({
            error: 'Access denied',
            message: 'You do not have access to this class'
          });
        }
      }
      
      // Get all students in class
      const pool = getPostgresPool();
      const studentsQuery = `
        SELECT id as student_id, name 
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
   * GET /api/ml/risk/statistics
   */
  async getRiskDashboard(req, res) {
    try {
      const schoolId = req.user.schoolId;
      const pool = getPostgresPool();
      
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
        by_level: {
          critical: 0,
          high: 0,
          medium: 0,
          low: 0
        },
        critical_students: []
      };
      
      result.rows.forEach(row => {
        const count = parseInt(row.count);
        stats.total += count;
        stats.by_level[row.risk_level] = count;
      });
      
      // Get critical students list
      const criticalQuery = `
        SELECT 
          rp.student_id,
          s.name as student_name,
          c.name as class_name,
          rp.risk_score,
          rp.risk_level,
          rp.confidence,
          rp.created_at
        FROM risk_predictions rp
        JOIN students s ON rp.student_id = s.id
        JOIN classes c ON s.class_id = c.id
        WHERE rp.school_id = $1 
          AND (rp.risk_level = 'critical' OR rp.risk_level = 'high')
          AND rp.created_at > NOW() - INTERVAL '7 days'
        ORDER BY rp.risk_score DESC
        LIMIT 10
      `;
      
      const criticalResult = await pool.query(criticalQuery, [schoolId]);
      stats.critical_students = criticalResult.rows;
      
      return res.json({
        success: true,
        total: stats.total,
        by_level: stats.by_level,
        critical_students: stats.critical_students
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
   * Retrain ML model with latest data
   * POST /api/ml/retrain
   */
  async retrainModel(req, res) {
    try {
      const schoolId = req.user.schoolId;
      const userId = req.user.userId;
      
      console.log('Retrain request from user:', userId, 'school:', schoolId);
      
      // Step 1: Fetch all students with sufficient data
      const pool = getPostgresPool();
      const studentsQuery = `
        SELECT id as student_id, name
        FROM students
        WHERE school_id = $1 AND status = 'active'
      `;
      const studentsResult = await pool.query(studentsQuery, [schoolId]);
      
      console.log(`Found ${studentsResult.rows.length} active students for school ${schoolId}`);
      
      if (studentsResult.rows.length === 0) {
        return res.status(400).json({
          success: false,
          error: 'No students found',
          message: 'No active students in your school. Please add students first before retraining the model.'
        });
      }
      
      // Step 2: Extract features for all students
      const studentIds = studentsResult.rows.map(s => s.student_id);
      console.log('Extracting features for', studentIds.length, 'students...');
      
      const featuresData = await featureExtractor.extractBatchFeatures(studentIds, schoolId);
      
      // Step 3: Filter students with sufficient data (Tier 1+)
      const validFeatures = featuresData.filter(f => 
        !f.error && f.features && f.features.data_tier >= 1
      );
      
      console.log(`${validFeatures.length} students have sufficient data (Tier 1+)`);
      
      if (validFeatures.length < 50) {
        return res.status(400).json({
          success: false,
          error: 'Insufficient training data',
          message: `Need at least 50 students with sufficient data to retrain the model. Currently have ${validFeatures.length} students with 3+ days attendance and 1+ exam. Please add more student data.`
        });
      }
      
      // Step 4: Format training data for ML service
      // Note: We don't have actual dropout labels, so we'll use a proxy
      // In a real system, you'd have historical dropout data
      const trainingData = validFeatures.map(f => ({
        ...f.features,
        dropped_out: 0 // Placeholder - in production, use actual historical data
      }));
      
      console.log('Sending', trainingData.length, 'records to ML service for retraining...');
      
      // Step 5: Call ML service to retrain
      const result = await mlClient.retrainModel(trainingData);
      
      if (!result.success) {
        console.error('ML retrain failed:', result);
        return res.status(503).json({
          success: false,
          error: result.error || 'Retrain failed',
          message: result.message || 'ML service returned an error'
        });
      }
      
      console.log('Model retrained successfully with', trainingData.length, 'records');
      
      return res.json({
        success: true,
        message: `Model retrained successfully with ${trainingData.length} student records`,
        data: {
          ...result.data,
          students_used: trainingData.length
        }
      });
      
    } catch (error) {
      console.error('Retrain error:', error);
      return res.status(500).json({
        success: false,
        error: 'Retrain failed',
        message: error.message
      });
    }
  }
  
  /**
   * Get student metadata for ML context
   */
  async _getStudentMetadata(studentId, schoolId) {
    const pool = getPostgresPool();
    const query = `
      SELECT 
        s.name as student_name,
        s.roll_number,
        c.name as class_name,
        c.section
      FROM students s
      JOIN classes c ON s.class_id = c.id
      WHERE s.id = $1 AND s.school_id = $2
    `;
    
    const result = await pool.query(query, [studentId, schoolId]);
    return result.rows[0] || {};
  }
  
  /**
   * Store prediction result in database
   */
  async _storePrediction(studentId, schoolId, predictionData) {
    const pool = getPostgresPool();
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

  /**
   * Calculate risk breakdown components from features
   * Returns attendance_risk, academic_risk, behavior_risk (0-1 scale)
   */
  _calculateRiskBreakdown(features, prediction) {
    // Attendance risk: inverse of attendance rate
    const attendance_risk = 1 - (features.attendance_rate / 100);
    
    // Academic risk: inverse of average marks percentage
    const academic_risk = 1 - (features.avg_marks_percentage / 100);
    
    // Behavior risk: inverse of behavior score
    const behavior_risk = 1 - (features.behavior_score / 100);
    
    return {
      attendance_risk: Math.round(attendance_risk * 100) / 100,
      academic_risk: Math.round(academic_risk * 100) / 100,
      behavior_risk: Math.round(behavior_risk * 100) / 100
    };
  }
}

export default new RiskController();
