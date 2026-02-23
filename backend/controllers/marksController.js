// Marks Controller - API endpoint handlers

import dataStore from '../storage/dataStore.js';
import * as marksService from '../services/marksService.js';
import * as examService from '../services/examService.js';

/**
 * Enter marks for a single student
 * POST /api/marks
 */
export const enterSingleMarks = async (req, res) => {
  try {
    const { examId, studentId, marksObtained, status, remarks } = req.body;
    const { userId, role } = req.user;

    // Validation
    if (!examId || !studentId) {
      return res.status(400).json({
        success: false,
        error: 'Exam ID and student ID are required'
      });
    }

    if (status === 'present' && (marksObtained === undefined || marksObtained === null)) {
      return res.status(400).json({
        success: false,
        error: 'Marks obtained is required for present students'
      });
    }

    // Authorization check (skip for admin)
    if (role !== 'admin') {
      const isAuthorized = await examService.checkTeacherAuthorization(userId, examId);
      if (!isAuthorized) {
        return res.status(403).json({
          success: false,
          error: 'You are not authorized to enter marks for this exam'
        });
      }
    }

    // Enter marks
    const marks = await marksService.enterMarks(
      { examId, studentId, marksObtained, status, remarks },
      userId
    );

    // Enrich response
    const student = await dataStore.getStudentById(studentId);
    const exam = await dataStore.getExamById(examId);
    const subject = exam ? await dataStore.getSubjectById(exam.subjectId) : null;

    res.status(201).json({
      success: true,
      message: 'Marks entered successfully',
      marks: {
        ...marks,
        studentName: student ? student.name : null,
        examName: exam ? exam.name : null,
        subjectName: subject ? subject.name : null
      }
    });
  } catch (error) {
    console.error('Enter single marks error:', error);
    res.status(400).json({
      success: false,
      error: error.message || 'Failed to enter marks'
    });
  }
};

/**
 * Enter marks for multiple students (bulk)
 * POST /api/marks/bulk
 */
export const enterBulkMarks = async (req, res) => {
  try {
    const { examId, marks } = req.body;
    const { userId, role } = req.user;

    // Validation
    if (!examId || !marks || !Array.isArray(marks)) {
      return res.status(400).json({
        success: false,
        error: 'Exam ID and marks array are required'
      });
    }

    // Authorization check (skip for admin)
    if (role !== 'admin') {
      const isAuthorized = await examService.checkTeacherAuthorization(userId, examId);
      if (!isAuthorized) {
        return res.status(403).json({
          success: false,
          error: 'You are not authorized to enter marks for this exam'
        });
      }
    }

    // Enter bulk marks
    const results = await marksService.enterBulkMarks({ examId, marks }, userId);

    res.status(201).json({
      success: true,
      message: `Bulk marks entered: ${results.entered} successful, ${results.failed} failed`,
      entered: results.entered,
      failed: results.failed,
      records: results.records,
      errors: results.errors
    });
  } catch (error) {
    console.error('Enter bulk marks error:', error);
    res.status(400).json({
      success: false,
      error: error.message || 'Failed to enter bulk marks'
    });
  }
};

/**
 * Get marks for an exam
 * GET /api/marks/exam/:examId
 */
export const getMarksByExam = async (req, res) => {
  try {
    const { examId } = req.params;
    const { schoolId } = req.user;

    // Get exam
    const exam = await dataStore.getExamById(examId);
    if (!exam) {
      return res.status(404).json({
        success: false,
        error: 'Exam not found'
      });
    }

    // Verify exam belongs to user's school
    if (exam.schoolId !== schoolId) {
      return res.status(403).json({
        success: false,
        error: 'Access denied'
      });
    }

    // Get marks
    const marks = await dataStore.getMarksByExam(examId);

    // Get students in the class
    const students = await dataStore.getStudentsByClass(exam.classId);

    // Enrich marks with student details
    const enrichedMarks = await Promise.all(marks.map(async m => {
      const student = await dataStore.getStudentById(m.studentId);
      return {
        id: m.id,
        studentId: m.studentId,
        studentName: student ? student.name : 'Unknown',
        enrollmentNo: student ? student.enrollmentNo : 'N/A',
        marksObtained: m.marksObtained,
        percentage: m.percentage,
        grade: m.grade,
        gradePoint: m.gradePoint,
        status: m.status,
        remarks: m.remarks,
        enteredAt: m.enteredAt,
        verifiedBy: m.verifiedBy,
        verifiedAt: m.verifiedAt
      };
    }));

    // Calculate statistics
    const presentMarks = marks.filter(m => m.status === 'present');
    const totalMarksObtained = presentMarks.reduce((sum, m) => sum + m.marksObtained, 0);
    const totalPercentage = presentMarks.reduce((sum, m) => sum + m.percentage, 0);
    const averageMarks = presentMarks.length > 0 ? totalMarksObtained / presentMarks.length : 0;
    const averagePercentage = presentMarks.length > 0 ? totalPercentage / presentMarks.length : 0;
    const highestMarks = presentMarks.length > 0 ? Math.max(...presentMarks.map(m => m.marksObtained)) : 0;
    const lowestMarks = presentMarks.length > 0 ? Math.min(...presentMarks.map(m => m.marksObtained)) : 0;
    const passCount = presentMarks.filter(m => m.marksObtained >= exam.passingMarks).length;
    const failCount = presentMarks.filter(m => m.marksObtained < exam.passingMarks).length;

    res.json({
      success: true,
      exam: {
        id: exam.id,
        name: exam.name,
        totalMarks: exam.totalMarks,
        passingMarks: exam.passingMarks
      },
      marks: enrichedMarks,
      statistics: {
        totalStudents: students.length,
        marksEntered: marks.length,
        pending: students.length - marks.length,
        averageMarks: parseFloat(averageMarks.toFixed(2)),
        averagePercentage: parseFloat(averagePercentage.toFixed(2)),
        highestMarks,
        lowestMarks,
        passCount,
        failCount,
        absentCount: marks.filter(m => m.status === 'absent').length,
        exemptedCount: marks.filter(m => m.status === 'exempted').length
      }
    });
  } catch (error) {
    console.error('Get marks by exam error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get marks'
    });
  }
};

/**
 * Get marks for a student
 * GET /api/marks/student/:studentId
 */
export const getMarksByStudent = async (req, res) => {
  try {
    const { studentId } = req.params;
    const { subjectId, startDate, endDate } = req.query;
    const { schoolId } = req.user;

    // Verify student exists and belongs to user's school
    const student = await dataStore.getStudentById(studentId);
    if (!student) {
      return res.status(404).json({
        success: false,
        error: 'Student not found'
      });
    }

    const classData = await dataStore.getClassById(student.classId);
    if (!classData || classData.schoolId !== schoolId) {
      return res.status(403).json({
        success: false,
        error: 'Access denied'
      });
    }

    // Get student performance
    const performance = await marksService.getStudentPerformance(studentId, {
      subjectId,
      startDate,
      endDate
    });

    res.json({
      success: true,
      studentId: performance.student.id,
      studentName: performance.student.name,
      enrollmentNo: performance.student.enrollmentNo,
      classId: performance.student.classId,
      className: classData.name,
      summary: performance.summary,
      marks: performance.marks
    });
  } catch (error) {
    console.error('Get marks by student error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to get student marks'
    });
  }
};

/**
 * Update marks
 * PUT /api/marks/:marksId
 */
export const updateMarks = async (req, res) => {
  try {
    const { marksId } = req.params;
    const updates = req.body;
    const { userId, role, schoolId } = req.user;

    // Get existing marks
    const existingMarks = await dataStore.getMarksById(marksId);
    if (!existingMarks) {
      return res.status(404).json({
        success: false,
        error: 'Marks record not found'
      });
    }

    // Get exam to verify school
    const exam = await dataStore.getExamById(existingMarks.examId);
    if (!exam || exam.schoolId !== schoolId) {
      return res.status(403).json({
        success: false,
        error: 'Access denied'
      });
    }

    // Authorization check (skip for admin)
    if (role !== 'admin') {
      const isAuthorized = await examService.checkTeacherAuthorization(userId, existingMarks.examId);
      if (!isAuthorized) {
        return res.status(403).json({
          success: false,
          error: 'You are not authorized to update these marks'
        });
      }
    }

    // Update marks
    const updatedMarks = await marksService.updateMarks(marksId, updates, userId);

    // Enrich response
    const student = await dataStore.getStudentById(updatedMarks.studentId);

    res.json({
      success: true,
      message: 'Marks updated successfully',
      marks: {
        ...updatedMarks,
        studentName: student ? student.name : null,
        examName: exam.name
      }
    });
  } catch (error) {
    console.error('Update marks error:', error);
    res.status(400).json({
      success: false,
      error: error.message || 'Failed to update marks'
    });
  }
};

/**
 * Delete marks
 * DELETE /api/marks/:marksId
 */
export const deleteMarks = async (req, res) => {
  try {
    const { marksId } = req.params;
    const { userId, role, schoolId } = req.user;

    // Only admins can delete marks
    if (role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Only admins can delete marks'
      });
    }

    // Get existing marks
    const existingMarks = await dataStore.getMarksById(marksId);
    if (!existingMarks) {
      return res.status(404).json({
        success: false,
        error: 'Marks record not found'
      });
    }

    // Get exam to verify school
    const exam = await dataStore.getExamById(existingMarks.examId);
    if (!exam || exam.schoolId !== schoolId) {
      return res.status(403).json({
        success: false,
        error: 'Access denied'
      });
    }

    // Delete marks
    await marksService.deleteMarks(marksId, userId);

    res.json({
      success: true,
      message: 'Marks deleted successfully'
    });
  } catch (error) {
    console.error('Delete marks error:', error);
    res.status(400).json({
      success: false,
      error: error.message || 'Failed to delete marks'
    });
  }
};

/**
 * Verify marks (admin only)
 * POST /api/marks/:marksId/verify
 */
export const verifyMarks = async (req, res) => {
  try {
    const { marksId } = req.params;
    const { userId, role, schoolId } = req.user;

    // Only admins can verify marks
    if (role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Only admins can verify marks'
      });
    }

    // Get existing marks
    const existingMarks = await dataStore.getMarksById(marksId);
    if (!existingMarks) {
      return res.status(404).json({
        success: false,
        error: 'Marks record not found'
      });
    }

    // Get exam to verify school
    const exam = await dataStore.getExamById(existingMarks.examId);
    if (!exam || exam.schoolId !== schoolId) {
      return res.status(403).json({
        success: false,
        error: 'Access denied'
      });
    }

    // Verify marks
    const verifiedMarks = await marksService.verifyMarks(marksId, userId);

    res.json({
      success: true,
      message: 'Marks verified successfully',
      marks: verifiedMarks
    });
  } catch (error) {
    console.error('Verify marks error:', error);
    res.status(400).json({
      success: false,
      error: error.message || 'Failed to verify marks'
    });
  }
};
