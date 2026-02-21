import dataStore from '../storage/dataStore.js';
import { generateId } from '../utils/helpers.js';

// Get all subjects for a school
export const getSubjects = (req, res) => {
  try {
    const { schoolId } = req.user;

    // Verify user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ 
        success: false, 
        error: 'Only admins can view subjects' 
      });
    }

    const subjects = dataStore.getSubjectsBySchool(schoolId);

    // Enrich with class and teacher names
    const enrichedSubjects = subjects.map(subject => {
      const classData = dataStore.getClassById(subject.classId);
      const teacher = subject.teacherId ? dataStore.getUserById(subject.teacherId) : null;
      
      return {
        ...subject,
        className: classData ? classData.name : 'Unknown',
        teacherName: teacher ? teacher.fullName : null
      };
    });

    res.json({
      success: true,
      subjects: enrichedSubjects
    });
  } catch (error) {
    console.error('Get subjects error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to get subjects' 
    });
  }
};

// Get subjects by class
export const getSubjectsByClass = (req, res) => {
  try {
    const { classId } = req.params;
    const { schoolId, role, userId } = req.user;  // Changed from 'id: userId' to 'userId'

    console.log('getSubjectsByClass called:', { classId, schoolId, role, userId });

    // Verify class exists and belongs to user's school
    const classData = dataStore.getClassById(classId);
    console.log('Class data:', classData);
    
    if (!classData || classData.schoolId !== schoolId) {
      return res.status(403).json({ 
        success: false, 
        error: 'Access denied' 
      });
    }

    // Teachers can view subjects for classes they teach
    // Admins can view all subjects in their school
    if (role === 'teacher') {
      const user = dataStore.getUserById(userId);
      console.log('User data:', user);
      console.log('Assigned classes:', user?.assignedClasses);
      
      const hasAccess = user?.assignedClasses?.some(
        assignment => assignment.classId === classId
      );
      
      console.log('Has access:', hasAccess);
      
      if (!hasAccess) {
        return res.status(403).json({ 
          success: false, 
          error: 'You do not have access to this class' 
        });
      }
    }

    const subjects = dataStore.getSubjectsByClass(classId);
    console.log('Subjects found:', subjects.length);

    // Enrich with teacher names
    const enrichedSubjects = subjects.map(subject => {
      const teacher = subject.teacherId ? dataStore.getUserById(subject.teacherId) : null;
      
      return {
        ...subject,
        teacherName: teacher ? teacher.fullName : null
      };
    });

    res.json({
      success: true,
      subjects: enrichedSubjects
    });
  } catch (error) {
    console.error('Get subjects by class error:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to get subjects',
      details: error.message
    });
  }
};

// Create new subject
export const createSubject = (req, res) => {
  try {
    const { schoolId } = req.user;
    const { name, classId, teacherId } = req.body;

    // Verify user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ 
        success: false, 
        error: 'Only admins can create subjects' 
      });
    }

    // Validation
    if (!name || !classId) {
      return res.status(400).json({ 
        success: false, 
        error: 'Subject name and class are required' 
      });
    }

    // Verify class exists and belongs to admin's school
    const classData = dataStore.getClassById(classId);
    if (!classData) {
      return res.status(400).json({ 
        success: false, 
        error: 'Class not found' 
      });
    }
    if (classData.schoolId !== schoolId) {
      return res.status(403).json({ 
        success: false, 
        error: 'Access denied' 
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
    }

    // Create subject
    const subjectId = generateId();
    const newSubject = {
      id: subjectId,
      schoolId,
      classId,
      name,
      teacherId: teacherId || null,
      status: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    dataStore.addSubject(newSubject);

    // Get teacher name for response
    const teacher = teacherId ? dataStore.getUserById(teacherId) : null;

    res.status(201).json({
      success: true,
      message: 'Subject created successfully',
      subject: {
        ...newSubject,
        className: classData.name,
        teacherName: teacher ? teacher.fullName : null
      }
    });
  } catch (error) {
    console.error('Create subject error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to create subject' 
    });
  }
};

// Update subject
export const updateSubject = (req, res) => {
  try {
    const { subjectId } = req.params;
    const { schoolId } = req.user;
    const { name, teacherId, status } = req.body;

    // Verify user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ 
        success: false, 
        error: 'Only admins can update subjects' 
      });
    }

    const existingSubject = dataStore.getSubjectById(subjectId);

    if (!existingSubject) {
      return res.status(404).json({ 
        success: false, 
        error: 'Subject not found' 
      });
    }

    // Verify subject belongs to admin's school
    if (existingSubject.schoolId !== schoolId) {
      return res.status(403).json({ 
        success: false, 
        error: 'Access denied' 
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
    }

    // Update subject
    const updates = {
      ...(name && { name }),
      ...(teacherId !== undefined && { teacherId }),
      ...(status && { status }),
      updatedAt: new Date().toISOString()
    };

    const updatedSubject = dataStore.updateSubject(subjectId, updates);

    // Get class and teacher names for response
    const classData = dataStore.getClassById(updatedSubject.classId);
    const teacher = updatedSubject.teacherId ? dataStore.getUserById(updatedSubject.teacherId) : null;

    res.json({
      success: true,
      message: 'Subject updated successfully',
      subject: {
        ...updatedSubject,
        className: classData ? classData.name : 'Unknown',
        teacherName: teacher ? teacher.fullName : null
      }
    });
  } catch (error) {
    console.error('Update subject error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to update subject' 
    });
  }
};

// Delete subject
export const deleteSubject = (req, res) => {
  try {
    const { subjectId } = req.params;
    const { schoolId } = req.user;

    // Verify user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ 
        success: false, 
        error: 'Only admins can delete subjects' 
      });
    }

    const existingSubject = dataStore.getSubjectById(subjectId);

    if (!existingSubject) {
      return res.status(404).json({ 
        success: false, 
        error: 'Subject not found' 
      });
    }

    // Verify subject belongs to admin's school
    if (existingSubject.schoolId !== schoolId) {
      return res.status(403).json({ 
        success: false, 
        error: 'Access denied' 
      });
    }

    dataStore.deleteSubject(subjectId);

    res.json({
      success: true,
      message: 'Subject deleted successfully'
    });
  } catch (error) {
    console.error('Delete subject error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to delete subject' 
    });
  }
};
