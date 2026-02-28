import express from 'express';
import { handleAIQuery, handleGeneralQuery, getAISuggestions } from '../controllers/aiAssistantController.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';

const router = express.Router();

// AI Assistant routes - teachers only
router.post('/query', authenticateToken, requireRole('teacher'), handleAIQuery);
router.post('/general', authenticateToken, requireRole('teacher'), handleGeneralQuery);
router.get('/suggestions', authenticateToken, requireRole('teacher'), getAISuggestions);

export default router;
