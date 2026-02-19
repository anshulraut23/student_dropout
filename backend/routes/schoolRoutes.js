import express from 'express';
import { getAllSchools, getSchoolById } from '../controllers/schoolController.js';

const router = express.Router();

// Public routes - schools list needed for teacher registration
router.get('/', getAllSchools);
router.get('/:schoolId', getSchoolById);

export default router;
