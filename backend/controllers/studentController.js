import dataStore from '../storage/dataStore.js';
import { generateId } from '../utils/helpers.js';

// Get students (filtered by class if provided)
export const getStudents = async (req, res) => {
  try {
    console.log('getStudents called by user:', req.user);
    
    const { schoolId, role } = req.user;
    const { classId } = req.query;

    console.log('Fetching students for school:', schoolId, 'classId:', classId);

    let students = [];

    if (classId) {
      // Get students for specific class
      const classData = await dataStore.getClassById(classId);
      
      if (!classData) {
        return res.status(404).json({ 
          success: false, 
          error: 'Class not found' 
        });
      }

      // Verify class belongs to user's school
      if (classData.schoolId !== schoolId) {
        return res.status(403).json({ 
          success: false, 
          error: 'Access denied' 
        });
      }

      students = await dataStore.getStudentsByClass(classId);
    } else {
      // Get all students for the school
      console.log('Fetching all students...');
      const allStudents = await dataStore.getStudents();
      console.log('Total students in DB:', allStudents.length);
      
      const schoolClasses = await dataStore.getClassesBySchool(schoolId);
      console.log('School classes:', schoolClasses.length);
      
      const schoolClassIds = new Set(schoolClasses.map(c => c.id));
      
      students = allStudents.filter(s => schoolClassIds.has(s.classId));
      console.log('Filtered students for school:', students.length);
    }

    // Enrich with class information
    const enrichedStudents = await Promise.all(students.map(async student => {
      const classData = await dataStore.getClassById(student.classId);
      return {
        ...student,
        className: classData ? classData.name : null,
        grade: classData ? classData.grade : null,
        section: classData ? classData.section : null
      };
    }));

    console.log('Returning', enrichedStudents.length, 'students');

    res.json({
      success: true,
      students: enrichedStudents
    });
  } catch (error) {
    console.error('Get students error:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to get students',
      message: error.message
    });
  }
};

// Get single student by ID
export const getStudentById = async (req, res) => {
  try {
    const { studentId } = req.params;
    const { schoolId } = req.user;

    const student = await dataStore.getStudentById(studentId);

    if (!student) {
      return res.status(404).json({ 
        success: false, 
        error: 'Student not found' 
      });
    }

    // Verify student's class belongs to user's school
    const classData = await dataStore.getClassById(student.classId);
    if (!classData || classData.schoolId !== schoolId) {
      return res.status(403).json({ 
        success: false, 
        error: 'Access denied' 
      });
    }

    // Enrich with class information
    const enrichedStudent = {
      ...student,
      className: classData.name,
      grade: classData.grade,
      section: classData.section
    };

    res.json({
      success: true,
      student: enrichedStudent
    });
  } catch (error) {
    console.error('Get student error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to get student' 
    });
  }
};

// Create new student
export const createStudent = async (req, res) => {
  try {
    const { schoolId, userId, role } = req.user;
    const { 
      name, 
      enrollmentNo, 
      classId, 
      dateOfBirth, 
      gender, 
      contact, 
      email, 
      address,
      parentName,
      parentContact, 
      parentEmail 
    } = req.body;

    // Validation
    if (!name || !enrollmentNo || !classId) {
      return res.status(400).json({ 
        success: false, 
        error: 'Name, enrollment number, and class are required' 
      });
    }

    // Verify class exists and belongs to user's school
    const classData = await dataStore.getClassById(classId);
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

    // If teacher, verify they are authorized for this class
    if (role === 'teacher') {
      const allClasses = await dataStore.getClassesBySchool(schoolId);
      const allSubjects = await dataStore.getSubjectsBySchool(schoolId);
      
      const isIncharge = allClasses.some(cls => cls.id === classId && cls.teacherId === userId);
      const teachesInClass = allSubjects.some(sub => sub.classId === classId && sub.teacherId === userId);
      
      if (!isIncharge && !teachesInClass) {
        return res.status(403).json({ 
          success: false, 
          error: 'You are not authorized to add students to this class' 
        });
      }
    }

    // Check for duplicate enrollment number in the same school
    const allStudents = await dataStore.getStudents();
    const schoolClasses = await dataStore.getClassesBySchool(schoolId);
    const schoolClassIds = new Set(schoolClasses.map(c => c.id));
    
    const duplicateStudent = allStudents.find(s => 
      schoolClassIds.has(s.classId) && 
      s.enrollmentNo.toLowerCase() === enrollmentNo.toLowerCase()
    );

    if (duplicateStudent) {
      return res.status(400).json({ 
        success: false, 
        error: 'A student with this enrollment number already exists' 
      });
    }

    // Create student
    const studentId = generateId();
    const newStudent = {
      id: studentId,
      classId,
      name,
      enrollmentNo,
      dateOfBirth: dateOfBirth || null,
      gender: gender || null,
      contact: contact || null,
      email: email || null,
      address: address || null,
      parentName: parentName || null,
      parentContact: parentContact || null,
      parentEmail: parentEmail || null,
      status: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    await dataStore.addStudent(newStudent);

    res.status(201).json({
      success: true,
      message: 'Student added successfully',
      student: {
        ...newStudent,
        className: classData.name,
        grade: classData.grade,
        section: classData.section
      }
    });
  } catch (error) {
    console.error('Create student error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to create student' 
    });
  }
};

// Create multiple students (bulk upload)
export const createStudentsBulk = async (req, res) => {
  try {
    const { schoolId, userId, role } = req.user;
    const { students, classId } = req.body;

    // Validation
    if (!students || !Array.isArray(students) || students.length === 0) {
      return res.status(400).json({ 
        success: false, 
        error: 'Students array is required' 
      });
    }

    if (!classId) {
      return res.status(400).json({ 
        success: false, 
        error: 'Class ID is required' 
      });
    }

    // Verify class exists and belongs to user's school
    const classData = await dataStore.getClassById(classId);
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

    // If teacher, verify they are authorized for this class
    if (role === 'teacher') {
      const allClasses = await dataStore.getClassesBySchool(schoolId);
      const allSubjects = await dataStore.getSubjectsBySchool(schoolId);
      
      const isIncharge = allClasses.some(cls => cls.id === classId && cls.teacherId === userId);
      const teachesInClass = allSubjects.some(sub => sub.classId === classId && sub.teacherId === userId);
      
      if (!isIncharge && !teachesInClass) {
        return res.status(403).json({ 
          success: false, 
          error: 'You are not authorized to add students to this class' 
        });
      }
    }

    // Get existing enrollment numbers for this school
    const allStudents = await dataStore.getStudents();
    const schoolClasses = await dataStore.getClassesBySchool(schoolId);
    const schoolClassIds = new Set(schoolClasses.map(c => c.id));
    const existingEnrollmentNos = new Set(
      allStudents
        .filter(s => schoolClassIds.has(s.classId))
        .map(s => s.enrollmentNo.toLowerCase())
    );

    const createdStudents = [];
    const errors = [];

    for (const [index, studentData] of students.entries()) {
      try {
        // Validate required fields
        if (!studentData.name || !studentData.enrollmentNo) {
          errors.push({
            row: index + 1,
            error: 'Name and enrollment number are required'
          });
          continue;
        }

        // Check for duplicate enrollment number
        if (existingEnrollmentNos.has(studentData.enrollmentNo.toLowerCase())) {
          errors.push({
            row: index + 1,
            enrollmentNo: studentData.enrollmentNo,
            error: 'Enrollment number already exists'
          });
          continue;
        }

        // Create student
        const studentId = generateId();
        const newStudent = {
          id: studentId,
          classId,
          name: studentData.name,
          enrollmentNo: studentData.enrollmentNo,
          dateOfBirth: studentData.dateOfBirth || null,
          gender: studentData.gender || null,
          contact: studentData.contact || null,
          email: studentData.email || null,
          address: studentData.address || null,
          parentName: studentData.parentName || null,
          parentContact: studentData.parentContact || null,
          parentEmail: studentData.parentEmail || null,
          status: 'active',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };

        await dataStore.addStudent(newStudent);
        existingEnrollmentNos.add(studentData.enrollmentNo.toLowerCase());
        createdStudents.push(newStudent);
      } catch (err) {
        errors.push({
          row: index + 1,
          error: err.message
        });
      }
    }

    res.status(201).json({
      success: true,
      message: `Successfully added ${createdStudents.length} students`,
      created: createdStudents.length,
      failed: errors.length,
      students: createdStudents,
      errors: errors
    });
  } catch (error) {
    console.error('Bulk create students error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to create students' 
    });
  }
};

// Update student
export const updateStudent = async (req, res) => {
  try {
    const { studentId } = req.params;
    const { schoolId, userId, role } = req.user;
    const updates = req.body;

    const student = await dataStore.getStudentById(studentId);

    if (!student) {
      return res.status(404).json({ 
        success: false, 
        error: 'Student not found' 
      });
    }

    // Verify student's class belongs to user's school
    const classData = await dataStore.getClassById(student.classId);
    if (!classData || classData.schoolId !== schoolId) {
      return res.status(403).json({ 
        success: false, 
        error: 'Access denied' 
      });
    }

    // If teacher, verify they are authorized for this class
    if (role === 'teacher') {
      const allClasses = await dataStore.getClassesBySchool(schoolId);
      const allSubjects = await dataStore.getSubjectsBySchool(schoolId);
      
      const isIncharge = allClasses.some(cls => cls.id === student.classId && cls.teacherId === userId);
      const teachesInClass = allSubjects.some(sub => sub.classId === student.classId && sub.teacherId === userId);
      
      if (!isIncharge && !teachesInClass) {
        return res.status(403).json({ 
          success: false, 
          error: 'You are not authorized to update this student' 
        });
      }
    }

    // Update student
    const updatedStudent = await dataStore.updateStudent(studentId, {
      ...updates,
      updatedAt: new Date().toISOString()
    });

    res.json({
      success: true,
      message: 'Student updated successfully',
      student: {
        ...updatedStudent,
        className: classData.name,
        grade: classData.grade,
        section: classData.section
      }
    });
  } catch (error) {
    console.error('Update student error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to update student' 
    });
  }
};

// Delete student
export const deleteStudent = async (req, res) => {
  try {
    const { studentId } = req.params;
    const { schoolId } = req.user;

    const student = await dataStore.getStudentById(studentId);

    if (!student) {
      return res.status(404).json({ 
        success: false, 
        error: 'Student not found' 
      });
    }

    // Verify student's class belongs to user's school
    const classData = await dataStore.getClassById(student.classId);
    if (!classData || classData.schoolId !== schoolId) {
      return res.status(403).json({ 
        success: false, 
        error: 'Access denied' 
      });
    }

    // For now, we'll just mark as inactive instead of deleting
    await dataStore.updateStudent(studentId, {
      status: 'inactive',
      updatedAt: new Date().toISOString()
    });

    res.json({
      success: true,
      message: 'Student deleted successfully'
    });
  } catch (error) {
    console.error('Delete student error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to delete student' 
    });
  }
};
