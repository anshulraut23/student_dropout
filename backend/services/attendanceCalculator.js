// Attendance Calculator - Statistics and calculations

import dataStore from '../storage/dataStore.js';

/**
 * Calculate attendance percentage for a student
 */
export const calculateAttendancePercentage = (studentId, startDate, endDate, subjectId = null) => {
  const filters = { startDate, endDate };
  if (subjectId) {
    filters.subjectId = subjectId;
  }
  
  const records = dataStore.getAttendanceByStudent(studentId, filters);
  
  if (records.length === 0) {
    return {
      totalDays: 0,
      present: 0,
      absent: 0,
      late: 0,
      excused: 0,
      percentage: 0
    };
  }
  
  const stats = {
    totalDays: records.length,
    present: records.filter(r => r.status === 'present').length,
    absent: records.filter(r => r.status === 'absent').length,
    late: records.filter(r => r.status === 'late').length,
    excused: records.filter(r => r.status === 'excused').length
  };
  
  // Calculate percentage (present + late + excused count as attended)
  const attended = stats.present + stats.late + stats.excused;
  stats.percentage = stats.totalDays > 0 
    ? Math.round((attended / stats.totalDays) * 100 * 10) / 10 
    : 0;
  
  return stats;
};

/**
 * Get attendance statistics for a class
 */
export const getAttendanceStatistics = (classId, startDate, endDate, subjectId = null) => {
  const filters = { startDate, endDate };
  if (subjectId) {
    filters.subjectId = subjectId;
  }
  
  const records = dataStore.getAttendanceByClass(classId, filters);
  
  // Get all students in the class
  const students = dataStore.getStudentsByClass(classId);
  
  // Calculate overall statistics
  const overall = {
    totalStudents: students.length,
    totalRecords: records.length,
    present: records.filter(r => r.status === 'present').length,
    absent: records.filter(r => r.status === 'absent').length,
    late: records.filter(r => r.status === 'late').length,
    excused: records.filter(r => r.status === 'excused').length
  };
  
  // Calculate average attendance percentage
  const attended = overall.present + overall.late + overall.excused;
  overall.averageAttendance = overall.totalRecords > 0
    ? Math.round((attended / overall.totalRecords) * 100 * 10) / 10
    : 0;
  
  // Calculate student-wise statistics
  const studentWise = students.map(student => {
    const studentRecords = records.filter(r => r.studentId === student.id);
    
    const stats = {
      studentId: student.id,
      studentName: student.name,
      enrollmentNo: student.enrollmentNo,
      present: studentRecords.filter(r => r.status === 'present').length,
      absent: studentRecords.filter(r => r.status === 'absent').length,
      late: studentRecords.filter(r => r.status === 'late').length,
      excused: studentRecords.filter(r => r.status === 'excused').length,
      totalDays: studentRecords.length
    };
    
    const attended = stats.present + stats.late + stats.excused;
    stats.percentage = stats.totalDays > 0
      ? Math.round((attended / stats.totalDays) * 100 * 10) / 10
      : 0;
    
    // Determine risk level based on attendance
    stats.riskLevel = determineRiskLevel(stats.percentage);
    
    return stats;
  });
  
  // Sort by percentage (lowest first to highlight at-risk students)
  studentWise.sort((a, b) => a.percentage - b.percentage);
  
  return {
    overall,
    studentWise
  };
};

/**
 * Get attendance summary for a student
 */
export const getStudentAttendanceSummary = (studentId, startDate, endDate, subjectId = null) => {
  const student = dataStore.getStudentById(studentId);
  
  if (!student) {
    throw new Error('Student not found');
  }
  
  const filters = { startDate, endDate };
  if (subjectId) {
    filters.subjectId = subjectId;
  }
  
  const records = dataStore.getAttendanceByStudent(studentId, filters);
  
  // Calculate statistics
  const statistics = calculateAttendancePercentage(studentId, startDate, endDate, subjectId);
  
  // Enrich records with additional information
  const enrichedRecords = records.map(record => {
    const classData = dataStore.getClassById(record.classId);
    const subject = record.subjectId ? dataStore.getSubjectById(record.subjectId) : null;
    const markedByUser = dataStore.getUserById(record.markedBy);
    
    return {
      id: record.id,
      date: record.date,
      status: record.status,
      className: classData ? classData.name : null,
      subjectName: subject ? subject.name : null,
      markedBy: markedByUser ? markedByUser.fullName : null,
      markedAt: record.markedAt,
      notes: record.notes
    };
  });
  
  // Sort by date (most recent first)
  enrichedRecords.sort((a, b) => new Date(b.date) - new Date(a.date));
  
  return {
    student: {
      id: student.id,
      name: student.name,
      enrollmentNo: student.enrollmentNo,
      classId: student.classId
    },
    period: {
      startDate,
      endDate
    },
    statistics,
    records: enrichedRecords
  };
};

/**
 * Identify students with low attendance
 */
export const identifyLowAttendanceStudents = (classId, threshold = 75, startDate, endDate) => {
  const students = dataStore.getStudentsByClass(classId);
  const lowAttendanceStudents = [];
  
  students.forEach(student => {
    const stats = calculateAttendancePercentage(student.id, startDate, endDate);
    
    if (stats.percentage < threshold && stats.totalDays > 0) {
      lowAttendanceStudents.push({
        studentId: student.id,
        studentName: student.name,
        enrollmentNo: student.enrollmentNo,
        attendancePercentage: stats.percentage,
        totalDays: stats.totalDays,
        present: stats.present,
        absent: stats.absent,
        riskLevel: determineRiskLevel(stats.percentage)
      });
    }
  });
  
  // Sort by percentage (lowest first)
  lowAttendanceStudents.sort((a, b) => a.attendancePercentage - b.attendancePercentage);
  
  return lowAttendanceStudents;
};

/**
 * Generate attendance report data
 */
export const generateAttendanceReport = (filters) => {
  const { classId, studentId, startDate, endDate, subjectId } = filters;
  
  let records = [];
  
  if (studentId) {
    // Student-specific report
    const studentFilters = { startDate, endDate };
    if (subjectId) studentFilters.subjectId = subjectId;
    records = dataStore.getAttendanceByStudent(studentId, studentFilters);
  } else if (classId) {
    // Class-specific report
    const classFilters = { startDate, endDate };
    if (subjectId) classFilters.subjectId = subjectId;
    records = dataStore.getAttendanceByClass(classId, classFilters);
  } else {
    // All attendance records
    records = dataStore.getAttendance().filter(r => {
      const recordDate = new Date(r.date);
      const start = new Date(startDate);
      const end = new Date(endDate);
      return recordDate >= start && recordDate <= end;
    });
  }
  
  // Enrich records with names
  const enrichedRecords = records.map(record => {
    const student = dataStore.getStudentById(record.studentId);
    const classData = dataStore.getClassById(record.classId);
    const subject = record.subjectId ? dataStore.getSubjectById(record.subjectId) : null;
    const markedByUser = dataStore.getUserById(record.markedBy);
    
    return {
      date: record.date,
      studentName: student ? student.name : 'Unknown',
      enrollmentNo: student ? student.enrollmentNo : 'N/A',
      className: classData ? classData.name : 'Unknown',
      subjectName: subject ? subject.name : 'N/A',
      status: record.status,
      markedBy: markedByUser ? markedByUser.fullName : 'Unknown',
      markedAt: record.markedAt,
      notes: record.notes || ''
    };
  });
  
  // Sort by date (most recent first)
  enrichedRecords.sort((a, b) => new Date(b.date) - new Date(a.date));
  
  return {
    generatedAt: new Date().toISOString(),
    period: { startDate, endDate },
    totalRecords: enrichedRecords.length,
    data: enrichedRecords
  };
};

/**
 * Determine risk level based on attendance percentage
 */
export const determineRiskLevel = (percentage) => {
  if (percentage >= 90) return 'low';
  if (percentage >= 75) return 'medium';
  if (percentage >= 60) return 'high';
  return 'critical';
};

/**
 * Get attendance for a specific date
 */
export const getAttendanceForDate = (classId, date, subjectId = null) => {
  const records = dataStore.getAttendanceByDate(date, classId, subjectId);
  const students = dataStore.getStudentsByClass(classId);
  
  // Create a map of student attendance
  const attendanceMap = new Map();
  records.forEach(record => {
    attendanceMap.set(record.studentId, record);
  });
  
  // Build response with all students
  const attendance = students.map(student => {
    const record = attendanceMap.get(student.id);
    
    return {
      studentId: student.id,
      studentName: student.name,
      enrollmentNo: student.enrollmentNo,
      status: record ? record.status : null,
      notes: record ? record.notes : null,
      markedAt: record ? record.markedAt : null,
      attendanceId: record ? record.id : null
    };
  });
  
  // Calculate summary
  const summary = {
    totalStudents: students.length,
    marked: records.length,
    unmarked: students.length - records.length,
    present: records.filter(r => r.status === 'present').length,
    absent: records.filter(r => r.status === 'absent').length,
    late: records.filter(r => r.status === 'late').length,
    excused: records.filter(r => r.status === 'excused').length
  };
  
  return {
    date,
    classId,
    subjectId,
    summary,
    attendance
  };
};
