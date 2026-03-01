import express from 'express';
import dropoutTrackingController from '../controllers/dropoutTrackingController.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// Update student dropout status (admin only)
router.post(
  '/update-status',
  requireRole('admin'),
  dropoutTrackingController.updateDropoutStatus.bind(dropoutTrackingController)
);

// Get dropout statistics (admin and teachers)
router.get(
  '/statistics',
  dropoutTrackingController.getDropoutStatistics.bind(dropoutTrackingController)
);

// Get student dropout history
router.get(
  '/history/:studentId',
  dropoutTrackingController.getStudentDropoutHistory.bind(dropoutTrackingController)
);

// Get training data for ML model (admin only)
router.get(
  '/training-data',
  requireRole('admin'),
  dropoutTrackingController.getTrainingData.bind(dropoutTrackingController)
);

// Save model performance metrics (admin only)
router.post(
  '/model-performance',
  requireRole('admin'),
  dropoutTrackingController.saveModelPerformance.bind(dropoutTrackingController)
);

// Get model performance history (admin only)
router.get(
  '/model-performance',
  requireRole('admin'),
  dropoutTrackingController.getModelPerformance.bind(dropoutTrackingController)
);

export default router;
