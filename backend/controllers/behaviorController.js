import dataStore from '../storage/dataStore.js';
import { generateId } from '../utils/helpers.js';
import { getTeacherAccessibleClassIds, canTeacherAccessStudent } from '../utils/teacherAccessControl.js';

/**
 * Get all behavior records with filters
 * GET /api/behavior
 */
export const getBehaviors = async (req, res) => {
  try {
    const { userId, schoolId, role } = req.user;
    const { studentId, teacherId, behaviorType, severity, startDate, endDate } = req.query;

    const filters = {};
    
    if (studentId) filters.studentId = studentId;
    if (teacherId && role === 'admin') filters.teacherId = teacherId;
    if (behaviorType) filters.behaviorType = behaviorType;
    if (severity) filters.severity = severity;
    if (startDate) filters.startDate = startDate;
    if (endDate) filters.endDate = endDate;

    const behaviors = await dataStore.getBehaviors(filters);

    // Filter by school and teacher access
    const schoolBehaviors = [];
    let teacherAccessibleClassIds = null;
    
    // For teachers, get their accessible class IDs once
    if (role === 'teacher') {
      teacherAccessibleClassIds = await getTeacherAccessibleClassIds(dataStore, userId, schoolId);
    }
    
    for (const behavior of behaviors) {
      const student = await dataStore.getStudentById(behavior.studentId);
      if (student && student.classId) {
        const classData = await dataStore.getClassById(student.classId);
        if (classData && classData.schoolId === schoolId) {
          // For teachers, check if they have access to the student's class
          if (role === 'teacher' && !teacherAccessibleClassIds.has(student.classId)) {
            continue; // Skip this behavior record
          }
          schoolBehaviors.push(behavior);
        }
      }
    }

    // Enrich with student and teacher details
    const enrichedBehaviors = await Promise.all(
      schoolBehaviors.map(async (behavior) => {
        const student = await dataStore.getStudentById(behavior.studentId);
        const teacher = await dataStore.getUserById(behavior.teacherId);
        
        return {
          ...behavior,
          studentName: student ? student.name : 'Unknown',
          teacherName: teacher ? teacher.fullName : 'Unknown',
          className: student?.className || 'Unknown'
        };
      })
    );

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
export const getBehaviorById = async (req, res) => {
  try {
    const { behaviorId } = req.params;
    const { schoolId, role, userId } = req.user;

    const behavior = await dataStore.getBehaviorById(behaviorId);

    if (!behavior) {
      return res.status(404).json({
        success: false,
        error: 'Behavior record not found'
      });
    }

    // Verify student belongs to user's school
    const student = await dataStore.getStudentById(behavior.studentId);
    if (!student) {
      return res.status(404).json({
        success: false,
        error: 'Student not found'
      });
    }

    // Check school via class
    if (student.classId) {
      const classData = await dataStore.getClassById(student.classId);
      if (!classData || classData.schoolId !== schoolId) {
        return res.status(403).json({
          success: false,
          error: 'Access denied'
        });
      }
      
      // For teachers, check if they have access to this student's class
      if (role === 'teacher') {
        const hasAccess = await canTeacherAccessStudent(dataStore, userId, behavior.studentId, schoolId);
        if (!hasAccess) {
          return res.status(403).json({
            success: false,
            error: 'You do not have access to this behavior record'
          });
        }
      }
    }

    // Enrich with details
    const teacher = await dataStore.getUserById(behavior.teacherId);
    
    res.json({
      success: true,
      behavior: {
        ...behavior,
        studentName: student.name,
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
export const createBehavior = async (req, res) => {
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
    const student = await dataStore.getStudentById(behaviorData.studentId);
    if (!student) {
      return res.status(404).json({
        success: false,
        error: 'Student not found'
      });
    }

    // Check if student belongs to teacher's school by checking the class
    if (student.classId) {
      const classData = await dataStore.getClassById(student.classId);
      if (!classData || classData.schoolId !== schoolId) {
        return res.status(403).json({
          success: false,
          error: 'Student does not belong to your school'
        });
      }
      
      // For teachers, verify they have access to this student's class
      if (role === 'teacher') {
        const hasAccess = await canTeacherAccessStudent(dataStore, userId, behaviorData.studentId, schoolId);
        if (!hasAccess) {
          return res.status(403).json({
            success: false,
            error: 'You do not have access to this student'
          });
        }
      }
    } else {
      // If no classId, check schoolId directly (if it exists on student)
      if (student.schoolId && student.schoolId !== schoolId) {
        return res.status(403).json({
          success: false,
          error: 'Student does not belong to your school'
        });
      }
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

    const createdBehavior = await dataStore.addBehavior(behavior);

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
export const updateBehavior = async (req, res) => {
  try {
    const { behaviorId } = req.params;
    const updates = req.body;
    const { userId, schoolId, role } = req.user;

    const behavior = await dataStore.getBehaviorById(behaviorId);

    if (!behavior) {
      return res.status(404).json({
        success: false,
        error: 'Behavior record not found'
      });
    }

    // Verify student belongs to user's school
    const student = await dataStore.getStudentById(behavior.studentId);
    if (!student) {
      return res.status(404).json({
        success: false,
        error: 'Student not found'
      });
    }

    // Check school via class
    if (student.classId) {
      const classData = await dataStore.getClassById(student.classId);
      if (!classData || classData.schoolId !== schoolId) {
        return res.status(403).json({
          success: false,
          error: 'Access denied'
        });
      }
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
    allowedUpdates.updatedAt = new Date().toISOString();

    const updatedBehavior = await dataStore.updateBehavior(behaviorId, allowedUpdates);

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
export const deleteBehavior = async (req, res) => {
  try {
    const { behaviorId } = req.params;
    const { userId, schoolId, role } = req.user;

    const behavior = await dataStore.getBehaviorById(behaviorId);

    if (!behavior) {
      return res.status(404).json({
        success: false,
        error: 'Behavior record not found'
      });
    }

    // Verify student belongs to user's school
    const student = await dataStore.getStudentById(behavior.studentId);
    if (!student) {
      return res.status(404).json({
        success: false,
        error: 'Student not found'
      });
    }

    // Check school via class
    if (student.classId) {
      const classData = await dataStore.getClassById(student.classId);
      if (!classData || classData.schoolId !== schoolId) {
        return res.status(403).json({
          success: false,
          error: 'Access denied'
        });
      }
    }

    // Teachers can only delete their own records, admins can delete any
    if (role === 'teacher' && behavior.teacherId !== userId) {
      return res.status(403).json({
        success: false,
        error: 'You can only delete your own behavior records'
      });
    }

    const deleted = await dataStore.deleteBehavior(behaviorId);

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
export const getBehaviorsByStudent = async (req, res) => {
  try {
    const { studentId } = req.params;
    const { schoolId } = req.user;
    const { startDate, endDate, behaviorType, severity } = req.query;

    const student = await dataStore.getStudentById(studentId);

    if (!student) {
      return res.status(404).json({
        success: false,
        error: 'Student not found'
      });
    }

    // Check school via class
    if (student.classId) {
      const classData = await dataStore.getClassById(student.classId);
      if (!classData || classData.schoolId !== schoolId) {
        return res.status(403).json({
          success: false,
          error: 'Access denied'
        });
      }
    }

    const filters = { studentId };
    if (startDate) filters.startDate = startDate;
    if (endDate) filters.endDate = endDate;
    if (behaviorType) filters.behaviorType = behaviorType;
    if (severity) filters.severity = severity;

    const behaviors = await dataStore.getBehaviors(filters);

    // Enrich with teacher details
    const enrichedBehaviors = await Promise.all(
      behaviors.map(async (behavior) => {
        const teacher = await dataStore.getUserById(behavior.teacherId);
        return {
          ...behavior,
          teacherName: teacher ? teacher.fullName : 'Unknown'
        };
      })
    );

    res.json({
      success: true,
      studentId,
      studentName: student.name,
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
