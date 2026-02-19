import dataStore from '../storage/dataStore.js';
import { generateId } from '../utils/helpers.js';

// Get all classes for a school
export const getClasses = (req, res) => {
  try {
    const { schoolId } = req.user;

    // Verify user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ 
        success: false, 
        error: 'Only admins can view classes' 
      });
    }

    const classes = dataStore.getClassesBySchool(schoolId);

    // Enrich with teacher names
    const enrichedClasses = classes.map(cls => {
      const teacher = cls.teacherId ? dataStore.getUserById(cls.teacherId) : null;
      return {
        ...cls,
        inchargeName: teacher ? teacher.fullName : null
      };
    });

    res.json({
      success: true,
      classes: enrichedClasses
    });
  } catch (error) {
    console.error('Get classes error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to get classes' 
    });
  }
};

// Get single class by ID
export const getClassById = (req, res) => {
  try {
    const { classId } = req.params;
    const { schoolId } = req.user;

    const classData = dataStore.getClassById(classId);

    if (!classData) {
      return res.status(404).json({ 
        success: false, 
        error: 'Class not found' 
      });
    }

    // Verify class belongs to admin's school
    if (classData.schoolId !== schoolId) {
      return res.status(403).json({ 
        success: false, 
        error: 'Access denied' 
      });
    }

    // Enrich with teacher name
    const teacher = classData.teacherId ? dataStore.getUserById(classData.teacherId) : null;
    const enrichedClass = {
      ...classData,
      inchargeName: teacher ? teacher.fullName : null
    };

    res.json({
      success: true,
      class: enrichedClass
    });
  } catch (error) {
    console.error('Get class error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to get class' 
    });
  }
};

// Create new class
export const createClass = (req, res) => {
  try {
    const { schoolId } = req.user;
    const { name, grade, section, academicYear, teacherId, attendanceMode } = req.body;

    // Verify user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ 
        success: false, 
        error: 'Only admins can create classes' 
      });
    }

    // Validation
    if (!name || !grade || !academicYear || !attendanceMode) {
      return res.status(400).json({ 
        success: false, 
        error: 'Name, grade, academic year, and attendance mode are required' 
      });
    }

    // Validate attendance mode
    if (!['daily', 'subject_wise'].includes(attendanceMode)) {
      return res.status(400).json({ 
        success: false, 
        error: 'Invalid attendance mode. Must be "daily" or "subject_wise"' 
      });
    }

    // If teacherId provided, verify teacher exists and is approved
    if (teacherId) {
      const teacher = dataStore.getUserById(teacherId);
      if (!teacher) {
        return res.status(400).json({ 
          success: false, 
          error: 'Teacher not found' 
        });
      }
      if (teacher.role !== 'teacher') {
        return res.status(400).json({ 
          success: false, 
          error: 'Selected user is not a teacher' 
        });
      }
      if (teacher.status !== 'approved') {
        return res.status(400).json({ 
          success: false, 
          error: 'Teacher is not approved yet' 
        });
      }
      if (teacher.schoolId !== schoolId) {
        return res.status(400).json({ 
          success: false, 
          error: 'Teacher does not belong to your school' 
        });
      }

      // Check if teacher is already incharge of another class
      const existingClass = dataStore.getClassesBySchool(schoolId).find(
        cls => cls.teacherId === teacherId && cls.status === 'active'
      );
      if (existingClass) {
        return res.status(400).json({ 
          success: false, 
          error: `Teacher is already assigned as incharge of ${existingClass.name}` 
        });
      }
    }

    // Create class
    const classId = generateId();
    const newClass = {
      id: classId,
      schoolId,
      name,
      grade,
      section: section || null,
      academicYear,
      teacherId: teacherId || null,
      attendanceMode,
      status: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    dataStore.addClass(newClass);

    // Get teacher name for response
    const teacher = teacherId ? dataStore.getUserById(teacherId) : null;

    res.status(201).json({
      success: true,
      message: 'Class created successfully',
      class: {
        ...newClass,
        inchargeName: teacher ? teacher.fullName : null
      }
    });
  } catch (error) {
    console.error('Create class error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to create class' 
    });
  }
};

// Update class
export const updateClass = (req, res) => {
  try {
    const { classId } = req.params;
    const { schoolId } = req.user;
    const { name, grade, section, academicYear, teacherId, attendanceMode, status } = req.body;

    // Verify user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ 
        success: false, 
        error: 'Only admins can update classes' 
      });
    }

    const existingClass = dataStore.getClassById(classId);

    if (!existingClass) {
      return res.status(404).json({ 
        success: false, 
        error: 'Class not found' 
      });
    }

    // Verify class belongs to admin's school
    if (existingClass.schoolId !== schoolId) {
      return res.status(403).json({ 
        success: false, 
        error: 'Access denied' 
      });
    }

    // Validate attendance mode if provided
    if (attendanceMode && !['daily', 'subject_wise'].includes(attendanceMode)) {
      return res.status(400).json({ 
        success: false, 
        error: 'Invalid attendance mode. Must be "daily" or "subject_wise"' 
      });
    }

    // If teacherId provided, verify teacher
    if (teacherId) {
      const teacher = dataStore.getUserById(teacherId);
      if (!teacher) {
        return res.status(400).json({ 
          success: false, 
          error: 'Teacher not found' 
        });
      }
      if (teacher.role !== 'teacher' || teacher.status !== 'approved' || teacher.schoolId !== schoolId) {
        return res.status(400).json({ 
          success: false, 
          error: 'Invalid teacher selection' 
        });
      }

      // Check if teacher is already incharge of another class (excluding current class)
      const existingClass = dataStore.getClassesBySchool(schoolId).find(
        cls => cls.teacherId === teacherId && cls.id !== classId && cls.status === 'active'
      );
      if (existingClass) {
        return res.status(400).json({ 
          success: false, 
          error: `Teacher is already assigned as incharge of ${existingClass.name}` 
        });
      }
    }

    // Update class
    const updates = {
      ...(name && { name }),
      ...(grade && { grade }),
      ...(section !== undefined && { section }),
      ...(academicYear && { academicYear }),
      ...(teacherId !== undefined && { teacherId }),
      ...(attendanceMode && { attendanceMode }),
      ...(status && { status }),
      updatedAt: new Date().toISOString()
    };

    const updatedClass = dataStore.updateClass(classId, updates);

    // Get teacher name for response
    const teacher = updatedClass.teacherId ? dataStore.getUserById(updatedClass.teacherId) : null;

    res.json({
      success: true,
      message: 'Class updated successfully',
      class: {
        ...updatedClass,
        inchargeName: teacher ? teacher.fullName : null
      }
    });
  } catch (error) {
    console.error('Update class error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to update class' 
    });
  }
};

// Delete class
export const deleteClass = (req, res) => {
  try {
    const { classId } = req.params;
    const { schoolId } = req.user;

    // Verify user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ 
        success: false, 
        error: 'Only admins can delete classes' 
      });
    }

    const existingClass = dataStore.getClassById(classId);

    if (!existingClass) {
      return res.status(404).json({ 
        success: false, 
        error: 'Class not found' 
      });
    }

    // Verify class belongs to admin's school
    if (existingClass.schoolId !== schoolId) {
      return res.status(403).json({ 
        success: false, 
        error: 'Access denied' 
      });
    }

    dataStore.deleteClass(classId);

    res.json({
      success: true,
      message: 'Class deleted successfully'
    });
  } catch (error) {
    console.error('Delete class error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to delete class' 
    });
  }
};
