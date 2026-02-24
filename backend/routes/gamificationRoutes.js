// Gamification Routes

import express from 'express';
import {
  getTeacherStats,
  awardXP,
  updateLoginStreak,
  checkBadges,
  updateMetrics,
  getLeaderboard,
  getTeacherRank,
  downloadCertificate
} from '../controllers/gamificationController.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';

const router = express.Router();

// Stats
router.get('/stats', authenticateToken, requireRole('teacher', 'admin'), getTeacherStats);

// Award XP
router.post('/award-xp', authenticateToken, requireRole('teacher', 'admin'), awardXP);

// Update login streak
router.post('/update-streak', authenticateToken, requireRole('teacher', 'admin'), updateLoginStreak);

// Check badges
router.post('/check-badges', authenticateToken, requireRole('teacher', 'admin'), checkBadges);

// Update gamification metrics
router.post('/metrics', authenticateToken, requireRole('teacher', 'admin'), updateMetrics);

// Leaderboard
router.get('/leaderboard', authenticateToken, requireRole('teacher', 'admin'), getLeaderboard);
router.get('/rank', authenticateToken, requireRole('teacher', 'admin'), getTeacherRank);

// Download certificate
router.get('/certificate/:certificateId', authenticateToken, requireRole('teacher', 'admin'), downloadCertificate);

export default router;
