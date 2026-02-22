// Exam Period Controller - API endpoint handlers

import * as examPeriodService from '../services/examPeriodService.js';

/**
 * Get all exam periods
 * GET /api/exam-periods
 */
export const getPeriods = async (req, res) => {
  try {
    const { schoolId, role } = req.user;
    const { academicYear, templateId, status } = req.query;

    // Only admins can view periods
    if (role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Only admins can view exam periods'
      });
    }

    const filters = {};
    if (academicYear) filters.academicYear = academicYear;
    if (templateId) filters.templateId = templateId;
    if (status) filters.status = status;

    const periods = examPeriodService.getPeriods(schoolId, filters);

    // Get statistics for each period
    const periodsWithStats = periods.map(period => {
      const stats = examPeriodService.getPeriodStatistics(period.id);
      const details = examPeriodService.getPeriodById(period.id);
      
      return {
        ...period,
        templateName: details.template ? details.template.name : 'Unknown',
        examsCount: stats.totalExams,
        marksEntered: stats.marksEntered,
        totalStudents: stats.totalStudents,
        completionPercentage: stats.completionPercentage
      };
    });

    res.json({
      success: true,
      totalPeriods: periodsWithStats.length,
      periods: periodsWithStats
    });
  } catch (error) {
    console.error('Get periods error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get periods'
    });
  }
};

/**
 * Get period by ID with details
 * GET /api/exam-periods/:periodId
 */
export const getPeriodById = async (req, res) => {
  try {
    const { periodId } = req.params;
    const { schoolId, role } = req.user;

    // Only admins can view periods
    if (role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Only admins can view exam periods'
      });
    }

    const periodDetails = examPeriodService.getPeriodById(periodId);

    // Verify period belongs to user's school
    if (periodDetails.schoolId !== schoolId) {
      return res.status(403).json({
        success: false,
        error: 'Access denied'
      });
    }

    // Get statistics
    const stats = examPeriodService.getPeriodStatistics(periodId);

    res.json({
      success: true,
      period: {
        ...periodDetails,
        ...stats
      }
    });
  } catch (error) {
    console.error('Get period by ID error:', error);
    res.status(error.message === 'Period not found' ? 404 : 500).json({
      success: false,
      error: error.message || 'Failed to get period'
    });
  }
};

/**
 * Create new exam period (with auto-generation)
 * POST /api/exam-periods
 */
export const createPeriod = async (req, res) => {
  try {
    const { schoolId, userId, role } = req.user;
    const periodData = req.body;
    const autoGenerate = req.body.autoGenerate !== false; // Default true

    // Only admins can create periods
    if (role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Only admins can create exam periods'
      });
    }

    // Validate period data
    const validation = examPeriodService.validatePeriodData(periodData);
    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        error: validation.errors.join(', ')
      });
    }

    // Add schoolId
    periodData.schoolId = schoolId;

    const result = await examPeriodService.createPeriod(periodData, userId, autoGenerate);

    res.status(201).json({
      success: true,
      message: `Exam period created successfully. ${result.generatedExamsCount} exams generated.`,
      period: result.period,
      generatedExamsCount: result.generatedExamsCount,
      generatedExams: result.generatedExams
    });
  } catch (error) {
    console.error('Create period error:', error);
    res.status(400).json({
      success: false,
      error: error.message || 'Failed to create period'
    });
  }
};

/**
 * Update exam period
 * PUT /api/exam-periods/:periodId
 */
export const updatePeriod = async (req, res) => {
  try {
    const { periodId } = req.params;
    const updates = req.body;
    const { schoolId, userId, role } = req.user;

    // Only admins can update periods
    if (role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Only admins can update exam periods'
      });
    }

    const existingPeriod = examPeriodService.getPeriodById(periodId);

    // Verify period belongs to user's school
    if (existingPeriod.schoolId !== schoolId) {
      return res.status(403).json({
        success: false,
        error: 'Access denied'
      });
    }

    const updatedPeriod = await examPeriodService.updatePeriod(periodId, updates, userId);

    res.json({
      success: true,
      message: 'Period updated successfully',
      period: updatedPeriod
    });
  } catch (error) {
    console.error('Update period error:', error);
    res.status(400).json({
      success: false,
      error: error.message || 'Failed to update period'
    });
  }
};

/**
 * Delete exam period
 * DELETE /api/exam-periods/:periodId
 */
export const deletePeriod = async (req, res) => {
  try {
    const { periodId } = req.params;
    const { schoolId, userId, role } = req.user;

    // Only admins can delete periods
    if (role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Only admins can delete exam periods'
      });
    }

    const period = examPeriodService.getPeriodById(periodId);

    // Verify period belongs to user's school
    if (period.schoolId !== schoolId) {
      return res.status(403).json({
        success: false,
        error: 'Access denied'
      });
    }

    const result = await examPeriodService.deletePeriod(periodId, userId);

    res.json({
      success: true,
      message: result.message
    });
  } catch (error) {
    console.error('Delete period error:', error);
    res.status(400).json({
      success: false,
      error: error.message || 'Failed to delete period'
    });
  }
};

/**
 * Manually trigger exam generation for a period
 * POST /api/exam-periods/:periodId/generate-exams
 */
export const generateExams = async (req, res) => {
  try {
    const { periodId } = req.params;
    const { schoolId, userId, role } = req.user;

    // Only admins can generate exams
    if (role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Only admins can generate exams'
      });
    }

    const period = examPeriodService.getPeriodById(periodId);

    // Verify period belongs to user's school
    if (period.schoolId !== schoolId) {
      return res.status(403).json({
        success: false,
        error: 'Access denied'
      });
    }

    const generatedExams = await examPeriodService.autoGenerateExams(periodId, userId);

    res.json({
      success: true,
      message: `${generatedExams.length} exams generated successfully`,
      generatedExamsCount: generatedExams.length,
      generatedExams
    });
  } catch (error) {
    console.error('Generate exams error:', error);
    res.status(400).json({
      success: false,
      error: error.message || 'Failed to generate exams'
    });
  }
};

/**
 * Get exams for a period
 * GET /api/exam-periods/:periodId/exams
 */
export const getExamsByPeriod = async (req, res) => {
  try {
    const { periodId } = req.params;
    const { schoolId, role } = req.user;

    // Admins and teachers can view exams
    const period = examPeriodService.getPeriodById(periodId);

    // Verify period belongs to user's school
    if (period.schoolId !== schoolId) {
      return res.status(403).json({
        success: false,
        error: 'Access denied'
      });
    }

    const exams = examPeriodService.getExamsByPeriod(periodId);

    res.json({
      success: true,
      totalExams: exams.length,
      period: {
        id: period.id,
        templateName: period.template ? period.template.name : 'Unknown',
        academicYear: period.academicYear,
        startDate: period.startDate,
        endDate: period.endDate,
        status: period.status
      },
      exams
    });
  } catch (error) {
    console.error('Get exams by period error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to get exams'
    });
  }
};
