// Exam Service - Business logic for exam operations

import dataStore from '../storage/dataStore.js';
import { generateId } from '../utils/helpers.js';
import {
  validateExamType,
  validateExamDate,
  validateMarksRange,
  validateWeightage,
  validateDuration,
  validateExamStatus,
  validateExamData
} from '../utils/examValidators.js';

/**
 * Create a new exam
 */
export const createExam = async (examData, userId) => {
  // Validate exam data
  const validation = validateExamData(examData);
  if (!validation.valid) {
    throw new Error(validation.error);
  }

  // Verify class exists
  const classData = dataStore.getClassById(examData.classId);
  if (!classData) {
    throw new Error('Class not found');
  }

  // Verify subject exists
  const subject = dataStore.getSubjectById(examData.subjectId);
  if (!subject) {
    throw new Error('Subject not found');
  }

  // Get user to verify school
  const user = dataStore.getUserById(userId);
  if (!user) {
    throw new Error('User not found');
  }

  // Verify class belongs to user's school
  if (classData.schoolId !== user.schoolId) {
    throw new Error('Class does not belong to your school');
  }

  // Create exam
  const examId = generateId();
  const exam = {
    id: examId,
    schoolId: user.schoolId,
    name: examData.name,
    type: examData.type,
    classId: examData.classId,
    subjectId: examData.subjectId,
    totalMarks: examData.totalMarks,
    passingMarks: examData.passingMarks,
    weightage: examData.weightage || 1.0,
    examDate: examData.examDate,
    duration: examData.duration || null,
    instructions: examData.instructions || null,
    syllabusTopics: examData.syllabusTopics ? JSON.stringify(examData.syllabusTopics) : null,
    createdBy: userId,
    status: 'scheduled',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  dataStore.addExam(exam);

  return exam;
};

/**
 * Update exam details
 */
export const updateExam = async (examId, updates, userId) => {
  const exam = dataStore.getExamById(examId);

  if (!exam) {
    throw new Error('Exam not found');
  }

  // Check if marks have been entered
  const marks = dataStore.getMarksByExam(examId);
  if (marks.length > 0) {
    // Don't allow changing critical fields if marks are entered
    if (updates.totalMarks && updates.totalMarks !== exam.totalMarks) {
      throw new Error('Cannot change total marks after marks have been entered');
    }
    if (updates.classId && updates.classId !== exam.classId) {
      throw new Error('Cannot change class after marks have been entered');
    }
    if (updates.subjectId && updates.subjectId !== exam.subjectId) {
      throw new Error('Cannot change subject after marks have been entered');
    }
  }

  // Validate updates
  if (updates.type) {
    const typeValidation = validateExamType(updates.type);
    if (!typeValidation.valid) {
      throw new Error(typeValidation.error);
    }
  }

  if (updates.examDate) {
    const dateValidation = validateExamDate(updates.examDate);
    if (!dateValidation.valid) {
      throw new Error(dateValidation.error);
    }
  }

  if (updates.totalMarks && updates.passingMarks) {
    const marksValidation = validateMarksRange(updates.totalMarks, updates.passingMarks);
    if (!marksValidation.valid) {
      throw new Error(marksValidation.error);
    }
  }

  if (updates.weightage) {
    const weightageValidation = validateWeightage(updates.weightage);
    if (!weightageValidation.valid) {
      throw new Error(weightageValidation.error);
    }
  }

  if (updates.duration) {
    const durationValidation = validateDuration(updates.duration);
    if (!durationValidation.valid) {
      throw new Error(durationValidation.error);
    }
  }

  // Handle syllabusTopics array
  if (updates.syllabusTopics) {
    updates.syllabusTopics = JSON.stringify(updates.syllabusTopics);
  }

  // Add update metadata
  updates.updatedAt = new Date().toISOString();

  const updatedExam = dataStore.updateExam(examId, updates);

  return updatedExam;
};

/**
 * Delete exam
 */
export const deleteExam = async (examId, userId) => {
  const exam = dataStore.getExamById(examId);

  if (!exam) {
    throw new Error('Exam not found');
  }

  // Check if marks have been entered
  const marks = dataStore.getMarksByExam(examId);
  if (marks.length > 0) {
    throw new Error('Cannot delete exam with marks entered. Cancel the exam instead.');
  }

  dataStore.deleteExam(examId);

  return true;
};

/**
 * Change exam status
 */
export const changeExamStatus = async (examId, newStatus, userId) => {
  const exam = dataStore.getExamById(examId);

  if (!exam) {
    throw new Error('Exam not found');
  }

  // Validate status
  const statusValidation = validateExamStatus(newStatus);
  if (!statusValidation.valid) {
    throw new Error(statusValidation.error);
  }

  const updatedExam = dataStore.updateExam(examId, {
    status: newStatus,
    updatedAt: new Date().toISOString()
  });

  return updatedExam;
};

/**
 * Get exam details with statistics
 */
export const getExamDetails = async (examId) => {
  const exam = dataStore.getExamById(examId);

  if (!exam) {
    throw new Error('Exam not found');
  }

  // Get all marks for this exam
  const marks = dataStore.getMarksByExam(examId);

  // Get students in the class
  const students = dataStore.getStudentsByClass(exam.classId);

  // Calculate statistics
  const presentMarks = marks.filter(m => m.status === 'present');
  const totalMarksObtained = presentMarks.reduce((sum, m) => sum + m.marksObtained, 0);
  const averageMarks = presentMarks.length > 0 ? totalMarksObtained / presentMarks.length : 0;
  const highestMarks = presentMarks.length > 0 ? Math.max(...presentMarks.map(m => m.marksObtained)) : 0;
  const lowestMarks = presentMarks.length > 0 ? Math.min(...presentMarks.map(m => m.marksObtained)) : 0;
  const passCount = presentMarks.filter(m => m.marksObtained >= exam.passingMarks).length;
  const failCount = presentMarks.filter(m => m.marksObtained < exam.passingMarks).length;

  return {
    ...exam,
    syllabusTopics: exam.syllabusTopics ? JSON.parse(exam.syllabusTopics) : [],
    statistics: {
      totalStudents: students.length,
      marksEntered: marks.length,
      pending: students.length - marks.length,
      averageMarks: parseFloat(averageMarks.toFixed(2)),
      highestMarks,
      lowestMarks,
      passCount,
      failCount,
      absentCount: marks.filter(m => m.status === 'absent').length,
      exemptedCount: marks.filter(m => m.status === 'exempted').length
    }
  };
};

/**
 * Check if teacher is authorized to manage exam
 */
export const checkTeacherAuthorization = async (teacherId, examId) => {
  const teacher = dataStore.getUserById(teacherId);

  if (!teacher || teacher.role !== 'teacher') {
    return false;
  }

  const exam = dataStore.getExamById(examId);

  if (!exam) {
    return false;
  }

  // Check if teacher's school matches exam's school
  if (teacher.schoolId !== exam.schoolId) {
    return false;
  }

  // Check if teacher is assigned to this subject
  const subject = dataStore.getSubjectById(exam.subjectId);

  if (!subject) {
    return false;
  }

  return subject.teacherId === teacherId;
};
