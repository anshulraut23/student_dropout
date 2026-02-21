// Marks Validators

/**
 * Validate marks obtained
 */
export const validateMarksObtained = (marksObtained, totalMarks) => {
  if (marksObtained < 0) {
    return {
      valid: false,
      error: 'Marks cannot be negative'
    };
  }
  
  if (marksObtained > totalMarks) {
    return {
      valid: false,
      error: `Marks cannot exceed total marks (${totalMarks})`
    };
  }
  
  // Check decimal places (max 2)
  const decimalPlaces = (marksObtained.toString().split('.')[1] || '').length;
  if (decimalPlaces > 2) {
    return {
      valid: false,
      error: 'Marks can have maximum 2 decimal places'
    };
  }
  
  return { valid: true };
};

/**
 * Validate marks status
 */
export const validateMarksStatus = (status) => {
  const validStatuses = ['present', 'absent', 'exempted'];
  
  if (!validStatuses.includes(status)) {
    return {
      valid: false,
      error: `Invalid status. Must be one of: ${validStatuses.join(', ')}`
    };
  }
  
  return { valid: true };
};

/**
 * Validate marks data
 */
export const validateMarksData = (data, exam) => {
  const errors = [];
  
  // Required fields
  if (!data.examId) {
    errors.push('Exam ID is required');
  }
  
  if (!data.studentId) {
    errors.push('Student ID is required');
  }
  
  if (!data.status) {
    errors.push('Status is required');
  } else {
    const statusValidation = validateMarksStatus(data.status);
    if (!statusValidation.valid) {
      errors.push(statusValidation.error);
    }
  }
  
  // Validate marks only if status is 'present'
  if (data.status === 'present') {
    if (data.marksObtained === undefined || data.marksObtained === null) {
      errors.push('Marks obtained is required for present students');
    } else if (exam) {
      const marksValidation = validateMarksObtained(data.marksObtained, exam.totalMarks);
      if (!marksValidation.valid) {
        errors.push(marksValidation.error);
      }
    }
  }
  
  // Cannot enter marks for absent/exempted students
  if ((data.status === 'absent' || data.status === 'exempted') && data.marksObtained > 0) {
    errors.push('Cannot enter marks for absent or exempted students');
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
};

/**
 * Check for duplicate marks entry
 */
export const checkDuplicateMarks = (dataStore, examId, studentId) => {
  const existing = dataStore.getMarksByExamAndStudent(examId, studentId);
  
  return {
    isDuplicate: !!existing,
    existingMarks: existing
  };
};
