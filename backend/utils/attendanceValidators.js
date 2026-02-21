// Attendance Validation Utilities

const VALID_STATUSES = ['present', 'absent', 'late', 'excused'];

/**
 * Validate attendance status
 */
export const validateAttendanceStatus = (status) => {
  if (!status) {
    return { valid: false, error: 'Status is required' };
  }
  
  if (!VALID_STATUSES.includes(status.toLowerCase())) {
    return { 
      valid: false, 
      error: `Invalid status. Must be one of: ${VALID_STATUSES.join(', ')}` 
    };
  }
  
  return { valid: true };
};

/**
 * Validate attendance date
 */
export const validateAttendanceDate = (date) => {
  if (!date) {
    return { valid: false, error: 'Date is required' };
  }
  
  // Check date format (YYYY-MM-DD)
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(date)) {
    return { 
      valid: false, 
      error: 'Invalid date format. Use YYYY-MM-DD' 
    };
  }
  
  const attendanceDate = new Date(date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  // Check if date is valid
  if (isNaN(attendanceDate.getTime())) {
    return { valid: false, error: 'Invalid date' };
  }
  
  // Check if date is not in the future
  if (attendanceDate > today) {
    return { 
      valid: false, 
      error: 'Cannot mark attendance for future dates' 
    };
  }
  
  // Check if date is not too old (more than 30 days)
  const thirtyDaysAgo = new Date(today);
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  
  if (attendanceDate < thirtyDaysAgo) {
    return { 
      valid: false, 
      error: 'Cannot mark attendance for dates older than 30 days' 
    };
  }
  
  return { valid: true };
};

/**
 * Validate bulk attendance data
 */
export const validateBulkAttendance = (attendanceArray) => {
  if (!Array.isArray(attendanceArray)) {
    return { 
      valid: false, 
      error: 'Attendance data must be an array' 
    };
  }
  
  if (attendanceArray.length === 0) {
    return { 
      valid: false, 
      error: 'Attendance array cannot be empty' 
    };
  }
  
  const errors = [];
  
  attendanceArray.forEach((record, index) => {
    if (!record.studentId) {
      errors.push({ 
        index, 
        error: 'Student ID is required' 
      });
    }
    
    if (!record.status) {
      errors.push({ 
        index, 
        error: 'Status is required' 
      });
    } else {
      const statusValidation = validateAttendanceStatus(record.status);
      if (!statusValidation.valid) {
        errors.push({ 
          index, 
          error: statusValidation.error 
        });
      }
    }
  });
  
  if (errors.length > 0) {
    return { 
      valid: false, 
      errors 
    };
  }
  
  return { valid: true };
};

/**
 * Check for duplicate attendance
 */
export const checkDuplicateAttendance = (dataStore, studentId, date, classId, subjectId = null) => {
  const existing = dataStore.getAttendanceByDate(date, classId, subjectId);
  const duplicate = existing.find(a => a.studentId === studentId);
  
  if (duplicate) {
    return { 
      isDuplicate: true, 
      existingRecord: duplicate 
    };
  }
  
  return { isDuplicate: false };
};

/**
 * Validate date range
 */
export const validateDateRange = (startDate, endDate) => {
  if (!startDate || !endDate) {
    return { valid: false, error: 'Start date and end date are required' };
  }
  
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    return { valid: false, error: 'Invalid date format' };
  }
  
  if (start > end) {
    return { 
      valid: false, 
      error: 'Start date must be before or equal to end date' 
    };
  }
  
  // Check if range is not too large (max 365 days)
  const daysDiff = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
  if (daysDiff > 365) {
    return { 
      valid: false, 
      error: 'Date range cannot exceed 365 days' 
    };
  }
  
  return { valid: true };
};
