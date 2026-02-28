import express from 'express';
import { authenticateToken, requireRole } from '../middleware/auth.js';
import {
  getPlatformStats,
  getAllSchoolsWithSummary,
  getAllSchoolAdmins,
  getPendingAdminRequests,
  approveAdminRegistration,
  rejectAdminRegistration,
  updateSchoolStatus,
  getSchoolSummary,
  getSchoolUpdates,
  getSchoolHighRiskStudents
} from '../controllers/superAdminController.js';

const router = express.Router();

router.use(authenticateToken, requireRole('super_admin'));

router.get('/platform-stats', getPlatformStats);
router.get('/schools', getAllSchoolsWithSummary);
router.get('/admins', getAllSchoolAdmins);
router.get('/admin-requests/pending', getPendingAdminRequests);
router.post('/admin-requests/:adminId/approve', approveAdminRegistration);
router.post('/admin-requests/:adminId/reject', rejectAdminRegistration);
router.patch('/schools/:schoolId/status', updateSchoolStatus);
router.get('/schools/:schoolId/summary', getSchoolSummary);
router.get('/schools/:schoolId/updates', getSchoolUpdates);
router.get('/schools/:schoolId/high-risk-students', getSchoolHighRiskStudents);

export default router;
