import express from 'express';
import { 
  getStudents, 
  getStudentById, 
  createStudent, 
  createStudentsBulk,
  updateStudent,
  deleteStudent 
} from '../controllers/studentController.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';

const router = express.Router();

// Protected routes - teacher and admin
router.get('/', authenticateToken, getStudents);
router.get('/:studentId', authenticateToken, getStudentById);
router.post('/', authenticateToken, requireRole('teacher', 'admin'), createStudent);
router.post('/bulk', authenticateToken, requireRole('teacher', 'admin'), createStudentsBulk);
router.put('/:studentId', authenticateToken, requireRole('teacher', 'admin'), updateStudent);
router.delete('/:studentId', authenticateToken, requireRole('admin'), deleteStudent);

export default router;
