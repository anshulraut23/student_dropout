import express from 'express';
import { getClasses, getClassById, createClass, updateClass, deleteClass } from '../controllers/classController.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';

const router = express.Router();

// Protected routes - admin only
router.get('/', authenticateToken, requireRole('admin'), getClasses);
router.get('/:classId', authenticateToken, requireRole('admin'), getClassById);
router.post('/', authenticateToken, requireRole('admin'), createClass);
router.put('/:classId', authenticateToken, requireRole('admin'), updateClass);
router.delete('/:classId', authenticateToken, requireRole('admin'), deleteClass);

export default router;
