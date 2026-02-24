import dataStore from '../storage/dataStore.js';
import { generateId } from '../utils/helpers.js';

/**
 * Get all behavior records with filters
 * GET /api/behavior
 */
export const getBehaviors = (req, res) => {
  try {
    const { userId, schoolId, role } = req.user;
    const { studentId, teacherId, behaviorType, severity, startDate, endDate } = req.query;

    const filters = {};
    
    // Teachers can only see their own behavior records or all for their school
    if (role === 'teacher') {
      // If no studentId specified, show only this teacher's records
      if (!studentId) {
        filters.teacherId = userId;
      }
    }

    if (studentId) filters.studentId = studentId;
    if (teacherId && role === 'admin') filters.teacherId = teacherId;
    if (behaviorType) filters.behaviorType = behaviorType;
    if (severity) filters.severity = severity;
    if (startDate) filters.startDate = startDate;
    if (endDate) filters.endDate = endDate;

    const behaviors = dataStore.getBehaviors(filters);

    // Filter by school
    const schoolBehaviors = behaviors.filter(b => {
      const student = dataStore.getStudentById(b.studentId);
      return student && student.schoolId === schoolId;
    });

    // Enrich with student and teacher details
    const enrichedBehaviors = schoolBehaviors.map(behavior => {
      const student = dataStore.getStudentById(behavior.studentId);
      const teacher = dataStore.getUserById(behavior.teacherId);
      
      return {
        ...behavior,
        studentName: student ? `${student.firstName} ${student.lastName}` : 'Unknown',
        teacherName: teacher ? teacher.fullName : 'Unknown',
        className: student?.className || 'Unknown'
      };
    });

    res.json({
      success: true,
      totalBehaviors: enrichedBehaviors.length,
      behaviors: enrichedBehaviors
    });
  } catch (error) {
    console.error('Get behaviors error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get behavior records'
    });
  }
};

/**
 * Get behavior record by ID
 * GET /api/behavior/:behaviorId
 */
export const getBehaviorById = (req, res) => {
  try {
    const { behaviorId } = req.params;
    const { schoolId } = req.user;

    const behavior = dataStore.getBehaviorById(behaviorId);

    if (!behavior) {
      return res.status(404).json({
        success: false,
        error: 'Behavior record not found'
      });
    }

    // Verify student belongs to user's school
    const student = dataStore.getStudentById(behavior.studentId);
    if (!student || student.schoolId !== schoolId) {
      return res.status(403).json({
        success: false,
        error: 'Access denied'
      });
    }

    // Enrich with details
    const teacher = dataStore.getUserById(behavior.teacherId);
    
    res.json({
      success: true,
      behavior: {
        ...behavior,
        studentName: `${student.firstName} ${student.lastName}`,
        teacherName: teacher ? teacher.fullName : 'Unknown',
        className: student.className
      }
    });
  } catch (error) {
    console.error('Get behavior by ID error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get behavior record'
    });
  }
};

/**
 * Create new behavior record
 * POST /api/behavior
 */
export const createBehavior = (req, res) => {
  try {
    const { userId, schoolId, role } = req.user;
    const behaviorData = req.body;

    // Only teachers and admins can create behavior records
    if (role !== 'teacher' && role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Only teachers and admins can create behavior records'
      });
    }

    // Validate required fields
    if (!behaviorData.studentId || !behaviorData.date || !behaviorData.behaviorType || 
        !behaviorData.severity || !behaviorData.category || !behaviorData.description) {
      return res.status(400).json({
        success: false,
        error: 'Student ID, date, behavior type, severity, category, and description are required'
      });
    }

    // Verify student exists and belongs to school
    const student = dataStore.getStudentById(behaviorData.studentId);
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

    const behavior = {
      id: generateId(),
      studentId: behaviorData.studentId,
      teacherId: userId,
      date: behaviorData.date,
      behaviorType: behaviorData.behaviorType, // 'positive' or 'negative'
      severity: behaviorData.severity, // 'low', 'medium', 'high'
      category: behaviorData.category,
      description: behaviorData.description,
      actionTaken: behaviorData.actionTaken || null,
      followUpRequired: behaviorData.followUpRequired || false,
      followUpDate: behaviorData.followUpDate || null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const createdBehavior = dataStore.addBehavior(behavior);

    res.status(201).json({
      success: true,
      message: 'Behavior record created successfully',
      behavior: createdBehavior
    });
  } catch (error) {
    console.error('Create behavior error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create behavior record'
    });
  }
};

/**
 * Update behavior record
 * PUT /api/behavior/:behaviorId
 */
export const updateBehavior = (req, res) => {
  try {
    const { behaviorId } = req.params;
    const updates = req.body;
    const { userId, schoolId, role } = req.user;

    const behavior = dataStore.getBehaviorById(behaviorId);

    if (!behavior) {
      return res.status(404).json({
        success: false,
        error: 'Behavior record not found'
      });
    }

    // Verify student belongs to user's school
    const student = dataStore.getStudentById(behavior.studentId);
    if (!student || student.schoolId !== schoolId) {
      return res.status(403).json({
        success: false,
        error: 'Access denied'
      });
    }

    // Teachers can only update their own records, admins can update any
    if (role === 'teacher' && behavior.teacherId !== userId) {
      return res.status(403).json({
        success: false,
        error: 'You can only update your own behavior records'
      });
    }

    // Prevent updating immutable fields
    const { id, studentId, teacherId, createdAt, ...allowedUpdates } = updates;

    const updatedBehavior = dataStore.updateBehavior(behaviorId, allowedUpdates);

    res.json({
      success: true,
      message: 'Behavior record updated successfully',
      behavior: updatedBehavior
    });
  } catch (error) {
    console.error('Update behavior error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update behavior record'
    });
  }
};

/**
 * Delete behavior record
 * DELETE /api/behavior/:behaviorId
 */
export const deleteBehavior = (req, res) => {
  try {
    const { behaviorId } = req.params;
    const { userId, schoolId, role } = req.user;

    const behavior = dataStore.getBehaviorById(behaviorId);

    if (!behavior) {
      return res.status(404).json({
        success: false,
        error: 'Behavior record not found'
      });
    }

    // Verify student belongs to user's school
    const student = dataStore.getStudentById(behavior.studentId);
    if (!student || student.schoolId !== schoolId) {
      return res.status(403).json({
        success: false,
        error: 'Access denied'
      });
    }

    // Teachers can only delete their own records, admins can delete any
    if (role === 'teacher' && behavior.teacherId !== userId) {
      return res.status(403).json({
        success: false,
        error: 'You can only delete your own behavior records'
      });
    }

    const deleted = dataStore.deleteBehavior(behaviorId);

    if (!deleted) {
      return res.status(500).json({
        success: false,
        error: 'Failed to delete behavior record'
      });
    }

    res.json({
      success: true,
      message: 'Behavior record deleted successfully'
    });
  } catch (error) {
    console.error('Delete behavior error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete behavior record'
    });
  }
};

/**
 * Get behavior records for a specific student
 * GET /api/behavior/student/:studentId
 */
export const getBehaviorsByStudent = (req, res) => {
  try {
    const { studentId } = req.params;
    const { schoolId } = req.user;
    const { startDate, endDate, behaviorType, severity } = req.query;

    const student = dataStore.getStudentById(studentId);

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
    if (behaviorType) filters.behaviorType = behaviorType;
    if (severity) filters.severity = severity;

    const behaviors = dataStore.getBehaviors(filters);

    // Enrich with teacher details
    const enrichedBehaviors = behaviors.map(behavior => {
      const teacher = dataStore.getUserById(behavior.teacherId);
      return {
        ...behavior,
        teacherName: teacher ? teacher.fullName : 'Unknown'
      };
    });

    res.json({
      success: true,
      studentId,
      studentName: `${student.firstName} ${student.lastName}`,
      totalBehaviors: enrichedBehaviors.length,
      behaviors: enrichedBehaviors
    });
  } catch (error) {
    console.error('Get behaviors by student error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get student behavior records'
    });
  }
};
