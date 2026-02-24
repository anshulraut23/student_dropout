import dataStore from '../storage/dataStore.js';
import { generateId } from '../utils/helpers.js';

/**
 * Get all interventions with filters
 * GET /api/interventions
 */
export const getInterventions = async (req, res) => {
  try {
    const { userId, schoolId, role } = req.user;
    const { studentId, teacherId, status, priority, startDate, endDate } = req.query;

    const filters = {};
    
    // Teachers can only see their own interventions or all for their school
    if (role === 'teacher') {
      if (!studentId) {
        filters.initiatedBy = userId;
      }
    }

    if (studentId) filters.studentId = studentId;
    if (teacherId && role === 'admin') filters.initiatedBy = teacherId;
    if (status) filters.status = status;
    if (priority) filters.priority = priority;
    if (startDate) filters.startDate = startDate;
    if (endDate) filters.endDate = endDate;

    const interventions = await dataStore.getInterventions(filters);

    // Filter by school
    const schoolInterventions = [];
    for (const intervention of interventions) {
      const student = await dataStore.getStudentById(intervention.studentId);
      if (student && student.schoolId === schoolId) {
        schoolInterventions.push(intervention);
      }
    }

    // Enrich with student and teacher details
    const enrichedInterventions = await Promise.all(
      schoolInterventions.map(async (intervention) => {
        const student = await dataStore.getStudentById(intervention.studentId);
        const teacher = await dataStore.getUserById(intervention.initiatedBy);
        
        return {
          ...intervention,
          studentName: student ? student.name : 'Unknown',
          teacherName: teacher ? teacher.fullName : 'Unknown',
          className: student?.className || 'Unknown'
        };
      })
    );

    res.json({
      success: true,
      totalInterventions: enrichedInterventions.length,
      interventions: enrichedInterventions
    });
  } catch (error) {
    console.error('Get interventions error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get interventions'
    });
  }
};

/**
 * Get intervention by ID
 * GET /api/interventions/:interventionId
 */
export const getInterventionById = async (req, res) => {
  try {
    const { interventionId } = req.params;
    const { schoolId } = req.user;

    const intervention = await dataStore.getInterventionById(interventionId);

    if (!intervention) {
      return res.status(404).json({
        success: false,
        error: 'Intervention not found'
      });
    }

    // Verify student belongs to user's school
    const student = await dataStore.getStudentById(intervention.studentId);
    if (!student || student.schoolId !== schoolId) {
      return res.status(403).json({
        success: false,
        error: 'Access denied'
      });
    }

    // Enrich with details
    const teacher = await dataStore.getUserById(intervention.initiatedBy);
    
    res.json({
      success: true,
      intervention: {
        ...intervention,
        studentName: student.name,
        teacherName: teacher ? teacher.fullName : 'Unknown',
        className: student.className
      }
    });
  } catch (error) {
    console.error('Get intervention by ID error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get intervention'
    });
  }
};

/**
 * Create new intervention
 * POST /api/interventions
 */
export const createIntervention = async (req, res) => {
  try {
    const { userId, schoolId, role } = req.user;
    const interventionData = req.body;

    // Only teachers and admins can create interventions
    if (role !== 'teacher' && role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Only teachers and admins can create interventions'
      });
    }

    // Validate required fields
    if (!interventionData.studentId || !interventionData.interventionType || 
        !interventionData.title || !interventionData.description) {
      return res.status(400).json({
        success: false,
        error: 'Student ID, intervention type, title, and description are required'
      });
    }

    // Verify student exists and belongs to school
    const student = await dataStore.getStudentById(interventionData.studentId);
    if (!student) {
      return res.status(404).json({
        success: false,
        error: 'Student not found'
      });
    }

    if (student.schoolId !== schoolId) {
      return res.status(403).json({
        success: false,
        error: 'Student does not belong to your school'
      });
    }

    const intervention = {
      id: generateId(),
      studentId: interventionData.studentId,
      initiatedBy: userId,
      interventionType: interventionData.interventionType,
      priority: interventionData.priority || 'medium',
      title: interventionData.title,
      description: interventionData.description,
      actionPlan: interventionData.actionPlan || null,
      expectedOutcome: interventionData.expectedOutcome || null,
      startDate: interventionData.startDate || new Date().toISOString().split('T')[0],
      targetDate: interventionData.targetDate || null,
      endDate: interventionData.endDate || null,
      status: interventionData.status || 'planned',
      outcome: interventionData.outcome || null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const createdIntervention = await dataStore.addIntervention(intervention);

    res.status(201).json({
      success: true,
      message: 'Intervention created successfully',
      intervention: createdIntervention
    });
  } catch (error) {
    console.error('Create intervention error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create intervention'
    });
  }
};

/**
 * Update intervention
 * PUT /api/interventions/:interventionId
 */
export const updateIntervention = async (req, res) => {
  try {
    const { interventionId } = req.params;
    const updates = req.body;
    const { userId, schoolId, role } = req.user;

    const intervention = await dataStore.getInterventionById(interventionId);

    if (!intervention) {
      return res.status(404).json({
        success: false,
        error: 'Intervention not found'
      });
    }

    // Verify student belongs to user's school
    const student = await dataStore.getStudentById(intervention.studentId);
    if (!student || student.schoolId !== schoolId) {
      return res.status(403).json({
        success: false,
        error: 'Access denied'
      });
    }

    // Teachers can only update their own interventions, admins can update any
    if (role === 'teacher' && intervention.initiatedBy !== userId) {
      return res.status(403).json({
        success: false,
        error: 'You can only update your own interventions'
      });
    }

    // Prevent updating immutable fields
    const { id, studentId, initiatedBy, createdAt, ...allowedUpdates } = updates;
    allowedUpdates.updatedAt = new Date().toISOString();

    const updatedIntervention = await dataStore.updateIntervention(interventionId, allowedUpdates);

    res.json({
      success: true,
      message: 'Intervention updated successfully',
      intervention: updatedIntervention
    });
  } catch (error) {
    console.error('Update intervention error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update intervention'
    });
  }
};

/**
 * Delete intervention
 * DELETE /api/interventions/:interventionId
 */
export const deleteIntervention = async (req, res) => {
  try {
    const { interventionId } = req.params;
    const { userId, schoolId, role } = req.user;

    const intervention = await dataStore.getInterventionById(interventionId);

    if (!intervention) {
      return res.status(404).json({
        success: false,
        error: 'Intervention not found'
      });
    }

    // Verify student belongs to user's school
    const student = await dataStore.getStudentById(intervention.studentId);
    if (!student || student.schoolId !== schoolId) {
      return res.status(403).json({
        success: false,
        error: 'Access denied'
      });
    }

    // Teachers can only delete their own interventions, admins can delete any
    if (role === 'teacher' && intervention.initiatedBy !== userId) {
      return res.status(403).json({
        success: false,
        error: 'You can only delete your own interventions'
      });
    }

    const deleted = await dataStore.deleteIntervention(interventionId);

    if (!deleted) {
      return res.status(500).json({
        success: false,
        error: 'Failed to delete intervention'
      });
    }

    res.json({
      success: true,
      message: 'Intervention deleted successfully'
    });
  } catch (error) {
    console.error('Delete intervention error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete intervention'
    });
  }
};

/**
 * Get interventions for a specific student
 * GET /api/interventions/student/:studentId
 */
export const getInterventionsByStudent = async (req, res) => {
  try {
    const { studentId } = req.params;
    const { schoolId } = req.user;
    const { startDate, endDate, status, priority } = req.query;

    const student = await dataStore.getStudentById(studentId);

    if (!student) {
      return res.status(404).json({
        success: false,
        error: 'Student not found'
      });
    }

    if (student.schoolId !== schoolId) {
      return res.status(403).json({
        success: false,
        error: 'Access denied'
      });
    }

    const filters = { studentId };
    if (startDate) filters.startDate = startDate;
    if (endDate) filters.endDate = endDate;
    if (status) filters.status = status;
    if (priority) filters.priority = priority;

    const interventions = await dataStore.getInterventions(filters);

    // Enrich with teacher details
    const enrichedInterventions = await Promise.all(
      interventions.map(async (intervention) => {
        const teacher = await dataStore.getUserById(intervention.initiatedBy);
        return {
          ...intervention,
          teacherName: teacher ? teacher.fullName : 'Unknown'
        };
      })
    );

    res.json({
      success: true,
      studentId,
      studentName: student.name,
      totalInterventions: enrichedInterventions.length,
      interventions: enrichedInterventions
    });
  } catch (error) {
    console.error('Get interventions by student error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get student interventions'
    });
  }
};
