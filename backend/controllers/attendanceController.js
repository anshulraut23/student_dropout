// Attendance Controller - API endpoint handlers

import dataStore from '../storage/dataStore.js';
import * as attendanceService from '../services/attendanceService.js';
import * as attendanceCalculator from '../services/attendanceCalculator.js';
import { validateAttendanceDate, validateDateRange } from '../utils/attendanceValidators.js';

/**
 * Mark attendance for a single student
 * POST /api/attendance/mark
 */
export const markAttendance = async (req, res) => {
  try {
    const { studentId, classId, subjectId, date, status, notes } = req.body;
    const { userId, role } = req.user;

    // Validation
    if (!studentId || !classId || !date || !status) {
      return res.status(400).json({
        success: false,
        error: 'Student ID, class ID, date, and status are required'
      });
    }

    // Authorization check (skip for admin)
    if (role !== 'admin') {
      const isAuthorized = await attendanceService.checkTeacherAuthorization(
        userId,
        classId,
        subjectId
      );

      if (!isAuthorized) {
        return res.status(403).json({
          success: false,
          error: 'You are not authorized to mark attendance for this class'
        });
      }
    }

    // Mark attendance
    const attendance = await attendanceService.markSingleAttendance(
      { studentId, classId, subjectId, date, status, notes },
      userId
    );

    // Enrich response with names
    const student = dataStore.getStudentById(studentId);
    const classData = dataStore.getClassById(classId);
    const subject = subjectId ? dataStore.getSubjectById(subjectId) : null;
    const markedByUser = dataStore.getUserById(userId);

    res.status(201).json({
      success: true,
      message: 'Attendance marked successfully',
      attendance: {
        ...attendance,
        studentName: student ? student.name : null,
        className: classData ? classData.name : null,
        subjectName: subject ? subject.name : null,
        markedByName: markedByUser ? markedByUser.fullName : null
      }
    });
  } catch (error) {
    console.error('Mark attendance error:', error);
    res.status(400).json({
      success: false,
      error: error.message || 'Failed to mark attendance'
    });
  }
};

/**
 * Mark bulk attendance for a class
 * POST /api/attendance/mark-bulk
 */
export const markBulkAttendance = async (req, res) => {
  try {
    const { classId, subjectId, date, attendance } = req.body;
    const { userId, role } = req.user;

    // Validation
    if (!classId || !date || !attendance || !Array.isArray(attendance)) {
      return res.status(400).json({
        success: false,
        error: 'Class ID, date, and attendance array are required'
      });
    }

    // Authorization check (skip for admin)
    if (role !== 'admin') {
      const isAuthorized = await attendanceService.checkTeacherAuthorization(
        userId,
        classId,
        subjectId
      );

      if (!isAuthorized) {
        return res.status(403).json({
          success: false,
          error: 'You are not authorized to mark attendance for this class'
        });
      }
    }

    // Mark bulk attendance
    const results = await attendanceService.markBulkAttendance(
      { classId, subjectId, date, attendance },
      userId
    );

    res.status(201).json({
      success: true,
      message: `Bulk attendance marked: ${results.marked} successful, ${results.failed} failed`,
      marked: results.marked,
      failed: results.failed,
      records: results.records,
      errors: results.errors
    });
  } catch (error) {
    console.error('Mark bulk attendance error:', error);
    res.status(400).json({
      success: false,
      error: error.message || 'Failed to mark bulk attendance'
    });
  }
};

/**
 * Get attendance for a class
 * GET /api/attendance/class/:classId
 */
export const getClassAttendance = async (req, res) => {
  try {
    const { classId } = req.params;
    const { date, startDate, endDate, subjectId } = req.query;
    const { schoolId } = req.user;

    // Verify class belongs to user's school
    const classData = dataStore.getClassById(classId);
    if (!classData) {
      return res.status(404).json({
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

    // If specific date requested, get attendance for that date
    if (date) {
      const attendanceData = attendanceCalculator.getAttendanceForDate(
        classId,
        date,
        subjectId
      );

      const subject = subjectId ? dataStore.getSubjectById(subjectId) : null;

      return res.json({
        success: true,
        classId,
        className: classData.name,
        date,
        subjectId: subjectId || null,
        subjectName: subject ? subject.name : null,
        totalStudents: attendanceData.summary.totalStudents,
        marked: attendanceData.summary.marked,
        unmarked: attendanceData.summary.unmarked,
        present: attendanceData.summary.present,
        absent: attendanceData.summary.absent,
        late: attendanceData.summary.late,
        excused: attendanceData.summary.excused,
        attendance: attendanceData.attendance
      });
    }

    // Otherwise, get attendance for date range
    const filters = {};
    if (startDate) filters.startDate = startDate;
    if (endDate) filters.endDate = endDate;
    if (subjectId) filters.subjectId = subjectId;

    const records = dataStore.getAttendanceByClass(classId, filters);

    // Enrich records with student names
    const enrichedRecords = records.map(record => {
      const student = dataStore.getStudentById(record.studentId);
      const subject = record.subjectId ? dataStore.getSubjectById(record.subjectId) : null;

      return {
        id: record.id,
        date: record.date,
        studentId: record.studentId,
        studentName: student ? student.name : 'Unknown',
        enrollmentNo: student ? student.enrollmentNo : 'N/A',
        status: record.status,
        subjectName: subject ? subject.name : null,
        markedAt: record.markedAt,
        notes: record.notes
      };
    });

    res.json({
      success: true,
      classId,
      className: classData.name,
      totalRecords: enrichedRecords.length,
      attendance: enrichedRecords
    });
  } catch (error) {
    console.error('Get class attendance error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get class attendance'
    });
  }
};

/**
 * Get attendance for a student
 * GET /api/attendance/student/:studentId
 */
export const getStudentAttendance = async (req, res) => {
  try {
    const { studentId } = req.params;
    const { startDate, endDate, subjectId } = req.query;
    const { schoolId } = req.user;

    // Verify student exists and belongs to user's school
    const student = dataStore.getStudentById(studentId);
    if (!student) {
      return res.status(404).json({
        success: false,
        error: 'Student not found'
      });
    }

    const classData = dataStore.getClassById(student.classId);
    if (!classData || classData.schoolId !== schoolId) {
      return res.status(403).json({
        success: false,
        error: 'Access denied'
      });
    }

    // Get attendance summary
    const summary = attendanceCalculator.getStudentAttendanceSummary(
      studentId,
      startDate,
      endDate,
      subjectId
    );

    res.json({
      success: true,
      studentId: summary.student.id,
      studentName: summary.student.name,
      enrollmentNo: summary.student.enrollmentNo,
      classId: summary.student.classId,
      className: classData.name,
      period: summary.period,
      statistics: summary.statistics,
      records: summary.records
    });
  } catch (error) {
    console.error('Get student attendance error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to get student attendance'
    });
  }
};

/**
 * Update attendance record
 * PUT /api/attendance/:attendanceId
 */
export const updateAttendance = async (req, res) => {
  try {
    const { attendanceId } = req.params;
    const { status, notes } = req.body;
    const { userId, role, schoolId } = req.user;

    // Get existing attendance record
    const existingAttendance = dataStore.getAttendanceById(attendanceId);
    if (!existingAttendance) {
      return res.status(404).json({
        success: false,
        error: 'Attendance record not found'
      });
    }

    // Verify class belongs to user's school
    const classData = dataStore.getClassById(existingAttendance.classId);
    if (!classData || classData.schoolId !== schoolId) {
      return res.status(403).json({
        success: false,
        error: 'Access denied'
      });
    }

    // Authorization check (skip for admin)
    if (role !== 'admin') {
      const isAuthorized = await attendanceService.checkTeacherAuthorization(
        userId,
        existingAttendance.classId,
        existingAttendance.subjectId
      );

      if (!isAuthorized) {
        return res.status(403).json({
          success: false,
          error: 'You are not authorized to update this attendance record'
        });
      }
    }

    // Update attendance
    const updates = {};
    if (status) updates.status = status;
    if (notes !== undefined) updates.notes = notes;

    const updatedAttendance = await attendanceService.updateAttendanceRecord(
      attendanceId,
      updates,
      userId
    );

    // Enrich response
    const student = dataStore.getStudentById(updatedAttendance.studentId);
    const subject = updatedAttendance.subjectId 
      ? dataStore.getSubjectById(updatedAttendance.subjectId) 
      : null;

    res.json({
      success: true,
      message: 'Attendance updated successfully',
      attendance: {
        ...updatedAttendance,
        studentName: student ? student.name : null,
        className: classData.name,
        subjectName: subject ? subject.name : null
      }
    });
  } catch (error) {
    console.error('Update attendance error:', error);
    res.status(400).json({
      success: false,
      error: error.message || 'Failed to update attendance'
    });
  }
};

/**
 * Delete attendance record
 * DELETE /api/attendance/:attendanceId
 */
export const deleteAttendance = async (req, res) => {
  try {
    const { attendanceId } = req.params;
    const { role, schoolId } = req.user;

    // Only admins can delete attendance records
    if (role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Only admins can delete attendance records'
      });
    }

    // Get existing attendance record
    const existingAttendance = dataStore.getAttendanceById(attendanceId);
    if (!existingAttendance) {
      return res.status(404).json({
        success: false,
        error: 'Attendance record not found'
      });
    }

    // Verify class belongs to user's school
    const classData = dataStore.getClassById(existingAttendance.classId);
    if (!classData || classData.schoolId !== schoolId) {
      return res.status(403).json({
        success: false,
        error: 'Access denied'
      });
    }

    // Delete attendance
    dataStore.deleteAttendance(attendanceId);

    res.json({
      success: true,
      message: 'Attendance record deleted successfully'
    });
  } catch (error) {
    console.error('Delete attendance error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete attendance record'
    });
  }
};

/**
 * Get attendance statistics for a class
 * GET /api/attendance/statistics/class/:classId
 */
export const getAttendanceStatistics = async (req, res) => {
  try {
    const { classId } = req.params;
    const { startDate, endDate, subjectId } = req.query;
    const { schoolId } = req.user;

    // Verify class belongs to user's school
    const classData = dataStore.getClassById(classId);
    if (!classData) {
      return res.status(404).json({
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

    // Validate date range if provided
    if (startDate && endDate) {
      const validation = validateDateRange(startDate, endDate);
      if (!validation.valid) {
        return res.status(400).json({
          success: false,
          error: validation.error
        });
      }
    }

    // Get statistics
    const statistics = attendanceCalculator.getAttendanceStatistics(
      classId,
      startDate,
      endDate,
      subjectId
    );

    const subject = subjectId ? dataStore.getSubjectById(subjectId) : null;

    res.json({
      success: true,
      classId,
      className: classData.name,
      subjectId: subjectId || null,
      subjectName: subject ? subject.name : null,
      period: {
        startDate: startDate || null,
        endDate: endDate || null
      },
      overall: statistics.overall,
      studentWise: statistics.studentWise
    });
  } catch (error) {
    console.error('Get attendance statistics error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get attendance statistics'
    });
  }
};

/**
 * Get attendance report
 * GET /api/attendance/report
 */
export const getAttendanceReport = async (req, res) => {
  try {
    const { classId, studentId, startDate, endDate, subjectId, format } = req.query;
    const { schoolId } = req.user;

    // Validate required parameters
    if (!startDate || !endDate) {
      return res.status(400).json({
        success: false,
        error: 'Start date and end date are required'
      });
    }

    // Validate date range
    const validation = validateDateRange(startDate, endDate);
    if (!validation.valid) {
      return res.status(400).json({
        success: false,
        error: validation.error
      });
    }

    // Verify access to requested data
    if (classId) {
      const classData = dataStore.getClassById(classId);
      if (!classData || classData.schoolId !== schoolId) {
        return res.status(403).json({
          success: false,
          error: 'Access denied'
        });
      }
    }

    if (studentId) {
      const student = dataStore.getStudentById(studentId);
      if (!student) {
        return res.status(404).json({
          success: false,
          error: 'Student not found'
        });
      }
      const classData = dataStore.getClassById(student.classId);
      if (!classData || classData.schoolId !== schoolId) {
        return res.status(403).json({
          success: false,
          error: 'Access denied'
        });
      }
    }

    // Generate report
    const report = attendanceCalculator.generateAttendanceReport({
      classId,
      studentId,
      startDate,
      endDate,
      subjectId
    });

    // Return CSV format if requested
    if (format === 'csv') {
      const csv = convertToCSV(report.data);
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename="attendance_report.csv"');
      return res.send(csv);
    }

    // Return JSON format
    res.json({
      success: true,
      report
    });
  } catch (error) {
    console.error('Get attendance report error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate attendance report'
    });
  }
};

/**
 * Helper function to convert report data to CSV
 */
const convertToCSV = (data) => {
  if (data.length === 0) {
    return 'No data available';
  }

  // CSV headers
  const headers = [
    'Date',
    'Student Name',
    'Enrollment No',
    'Class',
    'Subject',
    'Status',
    'Marked By',
    'Marked At',
    'Notes'
  ];

  // CSV rows
  const rows = data.map(record => [
    record.date,
    record.studentName,
    record.enrollmentNo,
    record.className,
    record.subjectName,
    record.status,
    record.markedBy,
    record.markedAt,
    record.notes
  ]);

  // Combine headers and rows
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
  ].join('\n');

  return csvContent;
};
