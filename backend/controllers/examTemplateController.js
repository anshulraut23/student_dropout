// Exam Template Controller - API endpoint handlers

import * as examTemplateService from '../services/examTemplateService.js';

/**
 * Get all exam templates
 * GET /api/exam-templates
 */
export const getTemplates = async (req, res) => {
  try {
    const { schoolId, role } = req.user;
    const { isActive, type } = req.query;

    // Only admins can view templates
    if (role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Only admins can view exam templates'
      });
    }

    const filters = {};
    if (isActive !== undefined) filters.isActive = isActive === 'true';
    if (type) filters.type = type;

    const templates = examTemplateService.getTemplates(schoolId, filters);

    // Get usage statistics for each template
    const templatesWithUsage = templates.map(template => {
      const usage = examTemplateService.getTemplateUsage(template.id);
      return {
        ...template,
        periodsCount: usage.periodsCount,
        examsCount: usage.examsCount,
        isUsed: usage.isUsed
      };
    });

    res.json({
      success: true,
      totalTemplates: templatesWithUsage.length,
      templates: templatesWithUsage
    });
  } catch (error) {
    console.error('Get templates error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get templates'
    });
  }
};

/**
 * Get template by ID
 * GET /api/exam-templates/:templateId
 */
export const getTemplateById = async (req, res) => {
  try {
    const { templateId } = req.params;
    const { schoolId, role } = req.user;

    // Only admins can view templates
    if (role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Only admins can view exam templates'
      });
    }

    const template = examTemplateService.getTemplateById(templateId);

    // Verify template belongs to user's school
    if (template.schoolId !== schoolId) {
      return res.status(403).json({
        success: false,
        error: 'Access denied'
      });
    }

    // Get usage statistics
    const usage = examTemplateService.getTemplateUsage(templateId);

    res.json({
      success: true,
      template: {
        ...template,
        ...usage
      }
    });
  } catch (error) {
    console.error('Get template by ID error:', error);
    res.status(error.message === 'Template not found' ? 404 : 500).json({
      success: false,
      error: error.message || 'Failed to get template'
    });
  }
};

/**
 * Create new exam template
 * POST /api/exam-templates
 */
export const createTemplate = async (req, res) => {
  try {
    const { schoolId, userId, role } = req.user;
    const templateData = req.body;

    // Only admins can create templates
    if (role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Only admins can create exam templates'
      });
    }

    // Validate template data
    const validation = examTemplateService.validateTemplateData(templateData);
    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        error: validation.errors.join(', ')
      });
    }

    // Add schoolId
    templateData.schoolId = schoolId;

    const result = await examTemplateService.createTemplate(templateData, userId);

    res.status(201).json({
      success: true,
      message: `Exam template created successfully. ${result.generatedExamsCount} exams generated automatically.`,
      template: result.template,
      generatedExamsCount: result.generatedExamsCount,
      generatedExams: result.generatedExams
    });
  } catch (error) {
    console.error('Create template error:', error);
    res.status(400).json({
      success: false,
      error: error.message || 'Failed to create template'
    });
  }
};

/**
 * Update exam template
 * PUT /api/exam-templates/:templateId
 */
export const updateTemplate = async (req, res) => {
  try {
    const { templateId } = req.params;
    const updates = req.body;
    const { schoolId, userId, role } = req.user;

    console.log('🔄 Update template controller:', {
      templateId,
      updates,
      schoolId,
      userId,
      role
    });

    // Only admins can update templates
    if (role !== 'admin') {
      console.log('❌ Access denied: not admin');
      return res.status(403).json({
        success: false,
        error: 'Only admins can update exam templates'
      });
    }

    const existingTemplate = examTemplateService.getTemplateById(templateId);
    console.log('📋 Existing template:', existingTemplate);

    // Verify template belongs to user's school
    if (existingTemplate.schoolId !== schoolId) {
      console.log('❌ Access denied: wrong school');
      return res.status(403).json({
        success: false,
        error: 'Access denied'
      });
    }

    const updatedTemplate = await examTemplateService.updateTemplate(templateId, updates, userId);
    console.log('✅ Template updated:', updatedTemplate);

    res.json({
      success: true,
      message: 'Template updated successfully',
      template: updatedTemplate
    });
  } catch (error) {
    console.error('❌ Update template error:', error);
    res.status(400).json({
      success: false,
      error: error.message || 'Failed to update template'
    });
  }
};

/**
 * Delete exam template
 * DELETE /api/exam-templates/:templateId
 */
export const deleteTemplate = async (req, res) => {
  try {
    const { templateId } = req.params;
    const { schoolId, userId, role } = req.user;

    // Only admins can delete templates
    if (role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Only admins can delete exam templates'
      });
    }

    const template = examTemplateService.getTemplateById(templateId);

    // Verify template belongs to user's school
    if (template.schoolId !== schoolId) {
      return res.status(403).json({
        success: false,
        error: 'Access denied'
      });
    }

    const result = await examTemplateService.deleteTemplate(templateId, userId);

    res.json({
      success: true,
      message: result.message
    });
  } catch (error) {
    console.error('Delete template error:', error);
    res.status(400).json({
      success: false,
      error: error.message || 'Failed to delete template'
    });
  }
};

/**
 * Toggle template active status
 * POST /api/exam-templates/:templateId/toggle
 */
export const toggleTemplateStatus = async (req, res) => {
  try {
    const { templateId } = req.params;
    const { schoolId, userId, role } = req.user;

    // Only admins can toggle template status
    if (role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Only admins can toggle template status'
      });
    }

    const template = examTemplateService.getTemplateById(templateId);

    // Verify template belongs to user's school
    if (template.schoolId !== schoolId) {
      return res.status(403).json({
        success: false,
        error: 'Access denied'
      });
    }

    const updatedTemplate = await examTemplateService.toggleTemplateStatus(templateId, userId);

    res.json({
      success: true,
      message: `Template ${updatedTemplate.isActive ? 'activated' : 'deactivated'} successfully`,
      template: updatedTemplate
    });
  } catch (error) {
    console.error('Toggle template status error:', error);
    res.status(400).json({
      success: false,
      error: error.message || 'Failed to toggle template status'
    });
  }
};
