import express from 'express';
import {
  getInterventions,
  getInterventionById,
  createIntervention,
  updateIntervention,
  deleteIntervention,
  getInterventionsByStudent
} from '../controllers/interventionController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// Get all interventions (with filters)
router.get('/', getInterventions);

// Get interventions for a specific student
router.get('/student/:studentId', getInterventionsByStudent);

// Get intervention by ID
router.get('/:interventionId', getInterventionById);

// Create new intervention
router.post('/', createIntervention);

// Update intervention
router.put('/:interventionId', updateIntervention);

// Delete intervention
router.delete('/:interventionId', deleteIntervention);

export default router;
