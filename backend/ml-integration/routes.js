import express from 'express';
import riskController from './riskController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

/**
 * ML Risk Prediction Routes (Isolated)
 * All routes require authentication
 */

// Get risk prediction for a single student
router.get('/risk/student/:studentId', authenticateToken, (req, res) => {
  riskController.getStudentRisk(req, res);
});

// Get risk predictions for all students in a class
router.get('/risk/class/:classId', authenticateToken, (req, res) => {
  riskController.getClassRisk(req, res);
});

// Get school-wide risk statistics
router.get('/risk/statistics', authenticateToken, (req, res) => {
  riskController.getRiskDashboard(req, res);
});

// Retrain ML model with latest data
router.post('/retrain', authenticateToken, (req, res) => {
  riskController.retrainModel(req, res);
});

export default router;

