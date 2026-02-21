// Marks Routes

import express from 'express';
import {
  enterSingleMarks,
  enterBulkMarks,
  getMarksByExam,
  getMarksByStudent,
  updateMarks,
  deleteMarks,
  verifyMarks
} from '../controllers/marksController.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';

const router = express.Router();

// Enter single student marks - Teacher and Admin
router.post('/', authenticateToken, requireRole('teacher', 'admin'), enterSingleMarks);

// Enter bulk marks - Teacher and Admin
router.post('/bulk', authenticateToken, requireRole('teacher', 'admin'), enterBulkMarks);

// Get marks for an exam - Teacher and Admin
router.get('/exam/:examId', authenticateToken, getMarksByExam);

// Get marks for a student - Teacher and Admin
router.get('/student/:studentId', authenticateToken, getMarksByStudent);

// Update marks - Teacher and Admin
router.put('/:marksId', authenticateToken, requireRole('teacher', 'admin'), updateMarks);

// Delete marks - Admin only
router.delete('/:marksId', authenticateToken, requireRole('admin'), deleteMarks);

// Verify marks - Admin only
router.post('/:marksId/verify', authenticateToken, requireRole('admin'), verifyMarks);

export default router;
