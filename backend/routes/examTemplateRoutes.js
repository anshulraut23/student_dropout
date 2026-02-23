// Exam Template Routes

import express from 'express';
import * as examTemplateController from '../controllers/examTemplateController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// Get all templates
router.get('/', examTemplateController.getTemplates);

// Get template by ID
router.get('/:templateId', examTemplateController.getTemplateById);

// Create new template
router.post('/', examTemplateController.createTemplate);

// Update template
router.put('/:templateId', (req, res, next) => {
  console.log('📝 Template update route hit:', {
    templateId: req.params.templateId,
    bodyKeys: Object.keys(req.body),
    userId: req.user?.userId
  });
  next();
}, examTemplateController.updateTemplate);

// Delete template
router.delete('/:templateId', examTemplateController.deleteTemplate);

// Toggle template status
router.post('/:templateId/toggle', examTemplateController.toggleTemplateStatus);

export default router;
