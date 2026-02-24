const express = require('express');
const router = express.Router();
const riskController = require('./riskController');
const { authenticateToken } = require('../middleware/auth');

/**
 * ML Risk Prediction Routes (Isolated)
 * All routes require authentication
 */

// Get risk prediction for a single student
router.get('/risk/:studentId', authenticateToken, (req, res) => {
  riskController.getStudentRisk(req, res);
});

// Get risk predictions for all students in a class
router.get('/risk/class/:classId', authenticateToken, (req, res) => {
  riskController.getClassRisk(req, res);
});

// Get risk dashboard statistics
router.get('/risk/dashboard', authenticateToken, (req, res) => {
  riskController.getRiskDashboard(req, res);
});

module.exports = router;
