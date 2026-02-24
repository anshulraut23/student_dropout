import express from 'express';
import {
  getSchoolTeachers,
  sendFacultyInvite,
  getMyFacultyInvites,
  acceptFacultyInvite,
  rejectFacultyInvite,
  getAcceptedConnections,
  sendMessage,
  getConversation
} from '../controllers/facultyController.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';

const router = express.Router();

// Protected routes - teachers only
router.get('/teachers', authenticateToken, requireRole('teacher'), getSchoolTeachers);
router.get('/invites', authenticateToken, requireRole('teacher'), getMyFacultyInvites);
router.get('/connections', authenticateToken, requireRole('teacher'), getAcceptedConnections);

// Invitation management
router.post('/invites/send', authenticateToken, requireRole('teacher'), sendFacultyInvite);
router.post('/invites/accept', authenticateToken, requireRole('teacher'), acceptFacultyInvite);
router.post('/invites/reject', authenticateToken, requireRole('teacher'), rejectFacultyInvite);

// Message endpoints
router.post('/messages/send', authenticateToken, requireRole('teacher'), sendMessage);
router.get('/messages/conversation/:facultyId', authenticateToken, requireRole('teacher'), getConversation);

export default router;
