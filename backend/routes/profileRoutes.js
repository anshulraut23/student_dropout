import express from 'express';
import { getProfile, updateProfile, getProfileById } from '../controllers/profileController.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';

const router = express.Router();

// Protected routes - all authenticated users
router.get('/', authenticateToken, getProfile);
router.put('/', authenticateToken, updateProfile);

// Protected routes - admin only
router.get('/:userId', authenticateToken, requireRole('admin'), getProfileById);

export default router;
