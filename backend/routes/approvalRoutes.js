import express from 'express';
import { getPendingRequests, approveTeacher, rejectTeacher } from '../controllers/approvalController.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';

const router = express.Router();

// Protected routes - admin only
router.get('/pending', authenticateToken, requireRole('admin'), getPendingRequests);
router.post('/approve/:teacherId', authenticateToken, requireRole('admin'), approveTeacher);
router.post('/reject/:teacherId', authenticateToken, requireRole('admin'), rejectTeacher);

export default router;
