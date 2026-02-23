// Attendance Routes

import express from 'express';
import {
  markAttendance,
  markBulkAttendance,
  getClassAttendance,
  getStudentAttendance,
  updateAttendance,
  deleteAttendance,
  getAttendanceStatistics,
  getAttendanceReport
} from '../controllers/attendanceController.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';

const router = express.Router();

// Mark attendance (single student) - Teacher and Admin
router.post('/mark', authenticateToken, requireRole('teacher', 'admin'), markAttendance);

// Mark bulk attendance (entire class) - Teacher and Admin
router.post('/mark-bulk', authenticateToken, requireRole('teacher', 'admin'), markBulkAttendance);

// Get attendance for a class - Teacher and Admin
router.get('/class/:classId', authenticateToken, getClassAttendance);

// Get attendance for a student - Teacher and Admin
router.get('/student/:studentId', authenticateToken, getStudentAttendance);

// Update attendance record - Teacher and Admin
router.put('/:attendanceId', authenticateToken, requireRole('teacher', 'admin'), updateAttendance);

// Delete attendance record - Admin only
router.delete('/:attendanceId', authenticateToken, requireRole('admin'), deleteAttendance);

// Get attendance statistics for a class - Teacher and Admin
router.get('/statistics/class/:classId', authenticateToken, getAttendanceStatistics);

// Get attendance report - Teacher and Admin
router.get('/report', authenticateToken, getAttendanceReport);

export default router;
