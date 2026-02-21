// Exam Routes

import express from 'express';
import {
  createExam,
  getExams,
  getExamById,
  updateExam,
  deleteExam,
  changeExamStatus
} from '../controllers/examController.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';

const router = express.Router();

// Create exam - Teacher and Admin
router.post('/', authenticateToken, requireRole('teacher', 'admin'), createExam);

// Get all exams - Teacher and Admin
router.get('/', authenticateToken, getExams);

// Get exam by ID - Teacher and Admin
router.get('/:examId', authenticateToken, getExamById);

// Update exam - Teacher and Admin
router.put('/:examId', authenticateToken, requireRole('teacher', 'admin'), updateExam);

// Delete exam - Admin only
router.delete('/:examId', authenticateToken, requireRole('admin'), deleteExam);

// Change exam status - Teacher and Admin
router.post('/:examId/status', authenticateToken, requireRole('teacher', 'admin'), changeExamStatus);

export default router;
