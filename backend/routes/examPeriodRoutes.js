// Exam Period Routes

import express from 'express';
import * as examPeriodController from '../controllers/examPeriodController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// Get all periods
router.get('/', examPeriodController.getPeriods);

// Get period by ID
router.get('/:periodId', examPeriodController.getPeriodById);

// Create new period (with auto-generation)
router.post('/', examPeriodController.createPeriod);

// Update period
router.put('/:periodId', examPeriodController.updatePeriod);

// Delete period
router.delete('/:periodId', examPeriodController.deletePeriod);

// Manually trigger exam generation
router.post('/:periodId/generate-exams', examPeriodController.generateExams);

// Get exams for a period
router.get('/:periodId/exams', examPeriodController.getExamsByPeriod);

export default router;
