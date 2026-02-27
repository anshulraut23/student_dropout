// Marks Service - Business logic for marks operations

import dataStore from '../storage/dataStore.js';
import { generateId } from '../utils/helpers.js';
import { validateMarksData, checkDuplicateMarks } from '../utils/marksValidators.js';
import { calculatePercentage, calculateGrade, getDefaultGradeConfig } from '../utils/gradeCalculators.js';

/**
 * Enter marks for a single student
 */
export const enterMarks = async (marksData, userId) => {
  // Get exam details first (needed for validation)
  const exam = await dataStore.getExamById(marksData.examId);
  if (!exam) {
    throw new Error('Exam not found');
  }

  // Validate marks data
  const validation = validateMarksData(marksData, exam);
  if (!validation.valid) {
    console.error('❌ Marks validation failed:', validation.error);
    console.error('   Data:', marksData);
    throw new Error(validation.error);
  }

  // Verify student exists and belongs to the exam's class
  const student = await dataStore.getStudentById(marksData.studentId);
  if (!student) {
    throw new Error('Student not found');
  }

  if (student.classId !== exam.classId) {
    throw new Error('Student does not belong to this exam\'s class');
  }

  // Check for duplicate
  const duplicateCheck = await checkDuplicateMarks(dataStore, marksData.examId, marksData.studentId);
  if (duplicateCheck.isDuplicate) {
    throw new Error('Marks already entered for this student in this exam');
  }

  // Get grade configuration (use default for now)
  const gradeConfig = getDefaultGradeConfig();

  // Calculate percentage and grade
  let percentage = 0;
  let grade = null;
  let gradePoint = null;

  const scoredStatuses = ['submitted', 'verified', 'present'];
  const unscoredStatuses = ['pending', 'absent', 'exempted'];

  if (scoredStatuses.includes(marksData.status)) {
    percentage = calculatePercentage(marksData.marksObtained, exam.totalMarks);
    const gradeResult = calculateGrade(percentage, gradeConfig);
    if (gradeResult) {
      grade = gradeResult.grade;
      gradePoint = gradeResult.gradePoint;
    }
  }

  // Create marks record
  const marksId = generateId();
  const marks = {
    id: marksId,
    examId: marksData.examId,
    studentId: marksData.studentId,
    classId: exam.classId, // Add classId from exam
    marksObtained: scoredStatuses.includes(marksData.status) ? marksData.marksObtained : 0,
    grade,
    percentage,
    status: marksData.status || 'submitted',
    createdAt: new Date().toISOString()
  };

  await dataStore.addMarks(marks);

  return marks;
};

/**
 * Enter marks for multiple students (bulk)
 */
export const enterBulkMarks = async (bulkData, userId) => {
  const { examId, marks } = bulkData;

  // Verify exam exists
  const exam = await dataStore.getExamById(examId);
  if (!exam) {
    throw new Error('Exam not found');
  }

  const results = {
    entered: 0,
    failed: 0,
    records: [],
    errors: []
  };

  for (let i = 0; i < marks.length; i++) {
    const record = marks[i];

    try {
      // Check for duplicate - if exists, update instead of creating new
      const duplicateCheck = await checkDuplicateMarks(dataStore, examId, record.studentId);

      if (duplicateCheck.isDuplicate) {
        // Update existing marks
        const existingMarks = duplicateCheck.existingRecord;

        // Get grade configuration
        const gradeConfig = getDefaultGradeConfig();

        // Calculate percentage and grade
        let percentage = 0;
        let grade = null;
        let gradePoint = null;

        const scoredStatuses = ['submitted', 'verified', 'present'];
        if (scoredStatuses.includes(record.status)) {
          percentage = calculatePercentage(record.marksObtained, exam.totalMarks);
          const gradeResult = calculateGrade(percentage, gradeConfig);
          if (gradeResult) {
            grade = gradeResult.grade;
            gradePoint = gradeResult.gradePoint;
          }
        }

        const updates = {
          marksObtained: scoredStatuses.includes(record.status) ? record.marksObtained : 0,
          grade,
          gradePoint,
          percentage,
          status: record.status || 'submitted',
          remarks: record.remarks || null,
          updatedBy: userId,
          updatedAt: new Date().toISOString()
        };

        const updatedMarks = await dataStore.updateMarks(existingMarks.id, updates);
        results.records.push(updatedMarks);
        results.entered++;
      } else {
        // Create new marks
        const marksRecord = await enterMarks({
          examId,
          studentId: record.studentId,
          marksObtained: record.marksObtained,
          status: record.status || 'submitted',
          remarks: record.remarks || null
        }, userId);

        results.records.push(marksRecord);
        results.entered++;
      }

    } catch (error) {
      console.error(`❌ Failed to enter marks for student ${record.studentId}:`);
      console.error('   Error:', error);
      console.error('   Message:', error.message);
      console.error('   Stack:', error.stack);
      results.failed++;
      results.errors.push({
        studentId: record.studentId,
        error: error.message || error.toString()
      });
    }
  }

  return results;
};

/**
 * Update marks record
 */
export const updateMarks = async (marksId, updates, userId) => {
  const marks = await dataStore.getMarksById(marksId);

  if (!marks) {
    throw new Error('Marks record not found');
  }

  // Don't allow updates if marks are verified
  if (marks.verifiedBy) {
    throw new Error('Cannot update verified marks. Please contact admin.');
  }

  // Get exam details for recalculation
  const exam = await dataStore.getExamById(marks.examId);
  if (!exam) {
    throw new Error('Exam not found');
  }

  // Validate marks if being updated
  if (updates.marksObtained !== undefined) {
    if (updates.marksObtained < 0 || updates.marksObtained > exam.totalMarks) {
      throw new Error(`Marks must be between 0 and ${exam.totalMarks}`);
    }
  }

  // Recalculate percentage and grade if marks or status changed
  if (updates.marksObtained !== undefined || updates.status) {
    const gradeConfig = getDefaultGradeConfig();
    const newMarks = updates.marksObtained !== undefined ? updates.marksObtained : marks.marksObtained;
    const newStatus = updates.status || marks.status;

    if (newStatus === 'submitted' || newStatus === 'verified' || newStatus === 'present') {
      updates.percentage = calculatePercentage(newMarks, exam.totalMarks);
      const gradeResult = calculateGrade(updates.percentage, gradeConfig);
      if (gradeResult) {
        updates.grade = gradeResult.grade;
        updates.gradePoint = gradeResult.gradePoint;
      }
    } else if (newStatus === 'pending' || newStatus === 'absent' || newStatus === 'exempted') {
      updates.marksObtained = 0;
      updates.percentage = 0;
      updates.grade = null;
      updates.gradePoint = null;
    }
  }

  // Add update metadata
  updates.updatedBy = userId;
  updates.updatedAt = new Date().toISOString();

  const updatedMarks = await dataStore.updateMarks(marksId, updates);

  return updatedMarks;
};

/**
 * Verify marks (admin only)
 */
export const verifyMarks = async (marksId, userId) => {
  const marks = await dataStore.getMarksById(marksId);

  if (!marks) {
    throw new Error('Marks record not found');
  }

  if (marks.verifiedBy) {
    throw new Error('Marks already verified');
  }

  const updatedMarks = await dataStore.verifyMarks(marksId, userId);

  return updatedMarks;
};

/**
 * Delete marks record
 */
export const deleteMarks = async (marksId, userId) => {
  const marks = await dataStore.getMarksById(marksId);

  if (!marks) {
    throw new Error('Marks record not found');
  }

  // Don't allow deletion if marks are verified
  if (marks.verifiedBy) {
    throw new Error('Cannot delete verified marks. Please contact admin.');
  }

  await dataStore.deleteMarks(marksId);

  return true;
};

/**
 * Get student performance summary
 */
export const getStudentPerformance = async (studentId, filters = {}) => {
  const student = await dataStore.getStudentById(studentId);
  if (!student) {
    throw new Error('Student not found');
  }

  // Get all marks for the student
  let marks = await dataStore.getMarksByStudent(studentId);

  // Apply filters
  if (filters.subjectId) {
    const filteredMarks = [];
    for (const m of marks) {
      const exam = await dataStore.getExamById(m.examId);
      if (exam && exam.subjectId === filters.subjectId) {
        filteredMarks.push(m);
      }
    }
    marks = filteredMarks;
  }

  if (filters.startDate || filters.endDate) {
    const filteredMarks = [];
    for (const m of marks) {
      const exam = await dataStore.getExamById(m.examId);
      if (!exam) continue;

      if (filters.startDate && exam.examDate < filters.startDate) continue;
      if (filters.endDate && exam.examDate > filters.endDate) continue;

      filteredMarks.push(m);
    }
    marks = filteredMarks;
  }

  // Calculate summary
  const submittedMarks = marks.filter(m => m.status === 'submitted' || m.status === 'verified' || m.status === 'present');
  const totalPercentage = submittedMarks.reduce((sum, m) => sum + m.percentage, 0);
  const totalGradePoints = submittedMarks.reduce((sum, m) => sum + (m.gradePoint || 0), 0);

  const summary = {
    totalExams: marks.length,
    examsAppeared: submittedMarks.length,
    averagePercentage: submittedMarks.length > 0 ? parseFloat((totalPercentage / submittedMarks.length).toFixed(2)) : 0,
    averageGradePoint: submittedMarks.length > 0 ? parseFloat((totalGradePoints / submittedMarks.length).toFixed(2)) : 0
  };

  // Assign overall grade based on average percentage
  if (summary.averagePercentage > 0) {
    const gradeConfig = getDefaultGradeConfig();
    const gradeResult = calculateGrade(summary.averagePercentage, gradeConfig);
    if (gradeResult) {
      summary.overallGrade = gradeResult.grade;
    }
  }

  // Enrich marks with exam details
  const enrichedMarks = await Promise.all(marks.map(async m => {
    const exam = await dataStore.getExamById(m.examId);
    const subject = exam ? await dataStore.getSubjectById(exam.subjectId) : null;

    return {
      ...m,
      examName: exam ? exam.name : 'Unknown',
      examType: exam ? exam.type : 'Unknown',
      examDate: exam ? exam.examDate : null,
      subjectName: subject ? subject.name : 'Unknown',
      totalMarks: exam ? exam.totalMarks : 0
    };
  }));

  return {
    student: {
      id: student.id,
      name: student.name,
      enrollmentNo: student.enrollmentNo,
      classId: student.classId
    },
    summary,
    marks: enrichedMarks
  };
};
