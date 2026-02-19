import express from 'express';
import { getAllTeachers, getMyClasses } from '../controllers/teacherController.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';

const router = express.Router();

// Protected routes - admin only
router.get('/', authenticateToken, requireRole('admin'), getAllTeachers);

// Protected routes - teacher only
router.get('/my-classes', authenticateToken, requireRole('teacher'), getMyClasses);

export default router;
