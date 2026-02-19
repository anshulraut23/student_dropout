import express from 'express';
import { 
  getSubjects, 
  getSubjectsByClass, 
  createSubject, 
  updateSubject, 
  deleteSubject 
} from '../controllers/subjectController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// Get all subjects for school
router.get('/', getSubjects);

// Get subjects by class
router.get('/class/:classId', getSubjectsByClass);

// Create subject
router.post('/', createSubject);

// Update subject
router.put('/:subjectId', updateSubject);

// Delete subject
router.delete('/:subjectId', deleteSubject);

export default router;
