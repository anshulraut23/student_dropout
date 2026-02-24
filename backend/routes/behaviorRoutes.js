import express from 'express';
import {
  getBehaviors,
  getBehaviorById,
  createBehavior,
  updateBehavior,
  deleteBehavior,
  getBehaviorsByStudent
} from '../controllers/behaviorController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// Get all behavior records (with filters)
router.get('/', getBehaviors);

// Get behavior records for a specific student
router.get('/student/:studentId', getBehaviorsByStudent);

// Get behavior record by ID
router.get('/:behaviorId', getBehaviorById);

// Create new behavior record
router.post('/', createBehavior);

// Update behavior record
router.put('/:behaviorId', updateBehavior);

// Delete behavior record
router.delete('/:behaviorId', deleteBehavior);

export default router;
