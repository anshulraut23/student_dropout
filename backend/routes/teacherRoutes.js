import express from 'express';
import { getAllTeachers } from '../controllers/teacherController.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';

const router = express.Router();

// Protected routes - admin only
router.get('/', authenticateToken, requireRole('admin'), getAllTeachers);

export default router;
