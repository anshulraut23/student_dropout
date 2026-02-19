import express from 'express';
import { registerAdmin, registerTeacher, login, getCurrentUser } from '../controllers/authController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.post('/register/admin', registerAdmin);
router.post('/register/teacher', registerTeacher);
router.post('/login', login);

// Protected routes
router.get('/me', authenticateToken, getCurrentUser);

export default router;
