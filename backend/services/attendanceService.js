// Attendance Service - Business logic for attendance operations

import dataStore from '../storage/dataStore.js';
import { generateId } from '../utils/helpers.js';
import { 
  validateAttendanceStatus, 
  validateAttendanceDate,
  checkDuplicateAttendance 
} from '../utils/attendanceValidators.js';

/**
 * Mark attendance for a single student
 */
export const markSingleAttendance = async (data, userId) => {
  const { studentId, classId, subjectId, date, status, notes } = data;
  
  // Validate status
  const statusValidation = validateAttendanceStatus(status);
  if (!statusValidation.valid) {
    throw new Error(statusValidation.error);
  }
  
  // Validate date
  const dateValidation = validateAttendanceDate(date);
  if (!dateValidation.valid) {
    throw new Error(dateValidation.error);
  }
  
  // Check for duplicate
  const duplicateCheck = checkDuplicateAttendance(
    dataStore, 
    studentId, 
    date, 
    classId, 
    subjectId
  );
  
  if (duplicateCheck.isDuplicate) {
    throw new Error('Attendance already marked for this student on this date');
  }
  
  // Verify student exists and belongs to the class
  const student = dataStore.getStudentById(studentId);
  if (!student) {
    throw new Error('Student not found');
  }
  
  if (student.classId !== classId) {
    throw new Error('Student does not belong to this class');
  }
  
  // Create attendance record
  const attendanceId = generateId();
  const attendance = {
    id: attendanceId,
    studentId,
    classId,
    subjectId: subjectId || null,
    date,
    status: status.toLowerCase(),
    markedBy: userId,
    markedAt: new Date().toISOString(),
    notes: notes || null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  dataStore.addAttendance(attendance);
  
  return attendance;
};

/**
 * Mark attendance for multiple students (bulk)
 * Handles both new attendance and updates to existing attendance
 */
export const markBulkAttendance = async (data, userId) => {
  const { classId, subjectId, date, attendance } = data;
  
  // Validate date
  const dateValidation = validateAttendanceDate(date);
  if (!dateValidation.valid) {
    throw new Error(dateValidation.error);
  }
  
  // Verify class exists
  const classData = dataStore.getClassById(classId);
  if (!classData) {
    throw new Error('Class not found');
  }
  
  const results = {
    marked: 0,
    failed: 0,
    records: [],
    errors: []
  };
  
  for (let i = 0; i < attendance.length; i++) {
    const record = attendance[i];
    
    try {
      // Validate status
      const statusValidation = validateAttendanceStatus(record.status);
      if (!statusValidation.valid) {
        throw new Error(statusValidation.error);
      }
      
      // Verify student exists and belongs to the class
      const student = dataStore.getStudentById(record.studentId);
      if (!student) {
        throw new Error('Student not found');
      }
      
      if (student.classId !== classId) {
        throw new Error('Student does not belong to this class');
      }
      
      // Check for duplicate - if exists, update instead of creating new
      const duplicateCheck = checkDuplicateAttendance(
        dataStore, 
        record.studentId, 
        date, 
        classId, 
        subjectId
      );
      
      if (duplicateCheck.isDuplicate) {
        // Update existing attendance record
        const existingRecord = duplicateCheck.existingRecord;
        const updates = {
          status: record.status.toLowerCase(),
          notes: record.notes || null,
          updatedAt: new Date().toISOString(),
          updatedBy: userId
        };
        
        const updatedRecord = dataStore.updateAttendance(existingRecord.id, updates);
        results.records.push(updatedRecord);
        results.marked++;
      } else {
        // Create new attendance record
        const attendanceId = generateId();
        const attendanceRecord = {
          id: attendanceId,
          studentId: record.studentId,
          classId,
          subjectId: subjectId || null,
          date,
          status: record.status.toLowerCase(),
          markedBy: userId,
          markedAt: new Date().toISOString(),
          notes: record.notes || null,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        
        dataStore.addAttendance(attendanceRecord);
        results.records.push(attendanceRecord);
        results.marked++;
      }
      
    } catch (error) {
      results.failed++;
      results.errors.push({
        studentId: record.studentId,
        error: error.message
      });
    }
  }
  
  return results;
};

/**
 * Update attendance record
 */
export const updateAttendanceRecord = async (attendanceId, updates, userId) => {
  const attendance = dataStore.getAttendanceById(attendanceId);
  
  if (!attendance) {
    throw new Error('Attendance record not found');
  }
  
  // Validate status if being updated
  if (updates.status) {
    const statusValidation = validateAttendanceStatus(updates.status);
    if (!statusValidation.valid) {
      throw new Error(statusValidation.error);
    }
    updates.status = updates.status.toLowerCase();
  }
  
  // Add update metadata
  updates.updatedAt = new Date().toISOString();
  updates.updatedBy = userId;
  
  const updatedAttendance = dataStore.updateAttendance(attendanceId, updates);
  
  return updatedAttendance;
};

/**
 * Check if teacher is authorized to mark attendance
 */
export const checkTeacherAuthorization = async (teacherId, classId, subjectId = null) => {
  const teacher = dataStore.getUserById(teacherId);
  
  if (!teacher || teacher.role !== 'teacher') {
    return false;
  }
  
  const classData = dataStore.getClassById(classId);
  
  if (!classData) {
    return false;
  }
  
  // Check if teacher's school matches class's school
  if (teacher.schoolId !== classData.schoolId) {
    return false;
  }
  
  // For daily attendance mode (no subjectId)
  if (!subjectId) {
    // Teacher must be the class incharge
    return classData.teacherId === teacherId;
  }
  
  // For subject-wise attendance mode
  const subject = dataStore.getSubjectById(subjectId);
  
  if (!subject) {
    return false;
  }
  
  // Teacher must be assigned to this subject
  return subject.teacherId === teacherId;
};
