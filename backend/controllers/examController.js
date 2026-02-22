// Exam Controller - API endpoint handlers

import dataStore from '../storage/dataStore.js';
import * as examService from '../services/examService.js';

/**
 * Create a new exam
 * POST /api/exams
 */
export const createExam = async (req, res) => {
  try {
    const examData = req.body;
    const { userId, role } = req.user;

    // Validation
    if (!examData.name || !examData.type || !examData.classId || !examData.subjectId || 
        !examData.totalMarks || !examData.passingMarks || !examData.examDate) {
      return res.status(400).json({
        success: false,
        error: 'Name, type, class, subject, total marks, passing marks, and exam date are required'
      });
    }

    // Authorization check (skip for admin)
    if (role !== 'admin') {
      // For teachers, verify they teach this subject
      const subject = dataStore.getSubjectById(examData.subjectId);
      if (!subject || subject.teacherId !== userId) {
        return res.status(403).json({
          success: false,
          error: 'You are not authorized to create exams for this subject'
        });
      }
    }

    // Create exam
    const exam = await examService.createExam(examData, userId);

    // Enrich response
    const classData = dataStore.getClassById(exam.classId);
    const subject = dataStore.getSubjectById(exam.subjectId);

    res.status(201).json({
      success: true,
      message: 'Exam created successfully',
      exam: {
        ...exam,
        className: classData ? classData.name : null,
        subjectName: subject ? subject.name : null,
        syllabusTopics: exam.syllabusTopics ? JSON.parse(exam.syllabusTopics) : []
      }
    });
  } catch (error) {
    console.error('Create exam error:', error);
    res.status(400).json({
      success: false,
      error: error.message || 'Failed to create exam'
    });
  }
};

/**
 * Get all exams with filters
 * GET /api/exams
 */
export const getExams = async (req, res) => {
  try {
    const { classId, subjectId, type, status, startDate, endDate } = req.query;
    const { schoolId, role, userId } = req.user;

    // Build filters
    const filters = { schoolId };
    if (classId) filters.classId = classId;
    if (subjectId) filters.subjectId = subjectId;
    if (type) filters.type = type;
    if (status) filters.status = status;
    if (startDate) filters.startDate = startDate;
    if (endDate) filters.endDate = endDate;

    // Get exams
    let exams = dataStore.getExams(filters);

    // For teachers, filter to only show exams for subjects they teach
    if (role === 'teacher') {
      const user = dataStore.getUserById(userId);
      const assignedClasses = user.assignedClasses || [];
      
      // Get all subject IDs the teacher teaches
      const teacherSubjectIds = assignedClasses
        .filter(assignment => assignment.subjectId)
        .map(assignment => assignment.subjectId);
      
      // Also get subjects where teacher is assigned directly
      const allSubjects = dataStore.getSubjects();
      const directSubjects = allSubjects.filter(s => s.teacherId === userId);
      directSubjects.forEach(s => {
        if (!teacherSubjectIds.includes(s.id)) {
          teacherSubjectIds.push(s.id);
        }
      });

      // Filter exams to only those for teacher's subjects
      exams = exams.filter(exam => teacherSubjectIds.includes(exam.subjectId));
    }

    // Enrich with class and subject names, and marks statistics
    const enrichedExams = exams.map(exam => {
      const classData = dataStore.getClassById(exam.classId);
      const subject = dataStore.getSubjectById(exam.subjectId);
      const marks = dataStore.getMarksByExam(exam.id);
      const students = dataStore.getStudentsByClass(exam.classId);

      return {
        id: exam.id,
        name: exam.name,
        type: exam.type,
        classId: exam.classId,
        subjectId: exam.subjectId,
        className: classData ? classData.name : 'Unknown',
        subjectName: subject ? subject.name : 'Unknown',
        examDate: exam.examDate,
        totalMarks: exam.totalMarks,
        passingMarks: exam.passingMarks,
        status: exam.status,
        marksEntered: marks.length,
        totalStudents: students.length,
        createdAt: exam.createdAt
      };
    });

    res.json({
      success: true,
      totalExams: enrichedExams.length,
      exams: enrichedExams
    });
  } catch (error) {
    console.error('Get exams error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get exams'
    });
  }
};

/**
 * Get exam by ID with details
 * GET /api/exams/:examId
 */
export const getExamById = async (req, res) => {
  try {
    const { examId } = req.params;
    const { schoolId } = req.user;

    const examDetails = await examService.getExamDetails(examId);

    // Verify exam belongs to user's school
    if (examDetails.schoolId !== schoolId) {
      return res.status(403).json({
        success: false,
        error: 'Access denied'
      });
    }

    // Enrich with names
    const classData = dataStore.getClassById(examDetails.classId);
    const subject = dataStore.getSubjectById(examDetails.subjectId);
    const createdByUser = dataStore.getUserById(examDetails.createdBy);

    res.json({
      success: true,
      exam: {
        ...examDetails,
        className: classData ? classData.name : 'Unknown',
        subjectName: subject ? subject.name : 'Unknown',
        createdByName: createdByUser ? createdByUser.fullName : 'Unknown'
      }
    });
  } catch (error) {
    console.error('Get exam by ID error:', error);
    res.status(error.message === 'Exam not found' ? 404 : 500).json({
      success: false,
      error: error.message || 'Failed to get exam details'
    });
  }
};

/**
 * Update exam
 * PUT /api/exams/:examId
 */
export const updateExam = async (req, res) => {
  try {
    const { examId } = req.params;
    const updates = req.body;
    const { userId, role, schoolId } = req.user;

    // Get existing exam
    const existingExam = dataStore.getExamById(examId);
    if (!existingExam) {
      return res.status(404).json({
        success: false,
        error: 'Exam not found'
      });
    }

    // Verify exam belongs to user's school
    if (existingExam.schoolId !== schoolId) {
      return res.status(403).json({
        success: false,
        error: 'Access denied'
      });
    }

    // Authorization check (skip for admin)
    if (role !== 'admin') {
      const isAuthorized = await examService.checkTeacherAuthorization(userId, examId);
      if (!isAuthorized) {
        return res.status(403).json({
          success: false,
          error: 'You are not authorized to update this exam'
        });
      }
    }

    // Update exam
    const updatedExam = await examService.updateExam(examId, updates, userId);

    // Enrich response
    const classData = dataStore.getClassById(updatedExam.classId);
    const subject = dataStore.getSubjectById(updatedExam.subjectId);

    res.json({
      success: true,
      message: 'Exam updated successfully',
      exam: {
        ...updatedExam,
        className: classData ? classData.name : null,
        subjectName: subject ? subject.name : null,
        syllabusTopics: updatedExam.syllabusTopics ? JSON.parse(updatedExam.syllabusTopics) : []
      }
    });
  } catch (error) {
    console.error('Update exam error:', error);
    res.status(400).json({
      success: false,
      error: error.message || 'Failed to update exam'
    });
  }
};

/**
 * Delete exam
 * DELETE /api/exams/:examId
 */
export const deleteExam = async (req, res) => {
  try {
    const { examId } = req.params;
    const { userId, role, schoolId } = req.user;

    // Only admins can delete exams
    if (role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Only admins can delete exams'
      });
    }

    // Get existing exam
    const existingExam = dataStore.getExamById(examId);
    if (!existingExam) {
      return res.status(404).json({
        success: false,
        error: 'Exam not found'
      });
    }

    // Verify exam belongs to user's school
    if (existingExam.schoolId !== schoolId) {
      return res.status(403).json({
        success: false,
        error: 'Access denied'
      });
    }

    // Delete exam
    await examService.deleteExam(examId, userId);

    res.json({
      success: true,
      message: 'Exam deleted successfully'
    });
  } catch (error) {
    console.error('Delete exam error:', error);
    res.status(400).json({
      success: false,
      error: error.message || 'Failed to delete exam'
    });
  }
};

/**
 * Change exam status
 * POST /api/exams/:examId/status
 */
export const changeExamStatus = async (req, res) => {
  try {
    const { examId } = req.params;
    const { status } = req.body;
    const { userId, role, schoolId } = req.user;

    if (!status) {
      return res.status(400).json({
        success: false,
        error: 'Status is required'
      });
    }

    // Get existing exam
    const existingExam = dataStore.getExamById(examId);
    if (!existingExam) {
      return res.status(404).json({
        success: false,
        error: 'Exam not found'
      });
    }

    // Verify exam belongs to user's school
    if (existingExam.schoolId !== schoolId) {
      return res.status(403).json({
        success: false,
        error: 'Access denied'
      });
    }

    // Authorization check (skip for admin)
    if (role !== 'admin') {
      const isAuthorized = await examService.checkTeacherAuthorization(userId, examId);
      if (!isAuthorized) {
        return res.status(403).json({
          success: false,
          error: 'You are not authorized to change this exam status'
        });
      }
    }

    // Change status
    const updatedExam = await examService.changeExamStatus(examId, status, userId);

    res.json({
      success: true,
      message: `Exam status updated to ${status}`,
      exam: updatedExam
    });
  } catch (error) {
    console.error('Change exam status error:', error);
    res.status(400).json({
      success: false,
      error: error.message || 'Failed to change exam status'
    });
  }
};
