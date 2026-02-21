// Exam Validators

/**
 * Validate exam type
 */
export const validateExamType = (type) => {
  const validTypes = ['unit_test', 'midterm', 'final', 'assignment', 'project', 'practical', 'quiz', 'oral'];
  
  if (!validTypes.includes(type)) {
    return {
      valid: false,
      error: `Invalid exam type. Must be one of: ${validTypes.join(', ')}`
    };
  }
  
  return { valid: true };
};

/**
 * Validate exam date
 */
export const validateExamDate = (date) => {
  const examDate = new Date(date);
  const now = new Date();
  const oneYearAgo = new Date();
  oneYearAgo.setFullYear(now.getFullYear() - 1);
  const oneYearAhead = new Date();
  oneYearAhead.setFullYear(now.getFullYear() + 1);
  
  if (isNaN(examDate.getTime())) {
    return {
      valid: false,
      error: 'Invalid date format'
    };
  }
  
  if (examDate < oneYearAgo) {
    return {
      valid: false,
      error: 'Exam date cannot be more than 1 year in the past'
    };
  }
  
  if (examDate > oneYearAhead) {
    return {
      valid: false,
      error: 'Exam date cannot be more than 1 year in the future'
    };
  }
  
  return { valid: true };
};

/**
 * Validate marks range
 */
export const validateMarksRange = (totalMarks, passingMarks) => {
  if (totalMarks <= 0 || totalMarks > 1000) {
    return {
      valid: false,
      error: 'Total marks must be between 1 and 1000'
    };
  }
  
  if (passingMarks <= 0 || passingMarks > totalMarks) {
    return {
      valid: false,
      error: 'Passing marks must be between 1 and total marks'
    };
  }
  
  return { valid: true };
};

/**
 * Validate weightage
 */
export const validateWeightage = (weightage) => {
  if (weightage < 0.1 || weightage > 5.0) {
    return {
      valid: false,
      error: 'Weightage must be between 0.1 and 5.0'
    };
  }
  
  return { valid: true };
};

/**
 * Validate duration
 */
export const validateDuration = (duration) => {
  if (duration < 15 || duration > 300) {
    return {
      valid: false,
      error: 'Duration must be between 15 and 300 minutes'
    };
  }
  
  return { valid: true };
};

/**
 * Validate exam status
 */
export const validateExamStatus = (status) => {
  const validStatuses = ['scheduled', 'ongoing', 'completed', 'cancelled'];
  
  if (!validStatuses.includes(status)) {
    return {
      valid: false,
      error: `Invalid status. Must be one of: ${validStatuses.join(', ')}`
    };
  }
  
  return { valid: true };
};

/**
 * Validate complete exam data
 */
export const validateExamData = (data) => {
  const errors = [];
  
  // Required fields
  if (!data.name || data.name.trim() === '') {
    errors.push('Exam name is required');
  }
  
  if (!data.type) {
    errors.push('Exam type is required');
  } else {
    const typeValidation = validateExamType(data.type);
    if (!typeValidation.valid) {
      errors.push(typeValidation.error);
    }
  }
  
  if (!data.classId) {
    errors.push('Class ID is required');
  }
  
  if (!data.subjectId) {
    errors.push('Subject ID is required');
  }
  
  if (!data.totalMarks) {
    errors.push('Total marks is required');
  }
  
  if (!data.passingMarks) {
    errors.push('Passing marks is required');
  }
  
  if (data.totalMarks && data.passingMarks) {
    const marksValidation = validateMarksRange(data.totalMarks, data.passingMarks);
    if (!marksValidation.valid) {
      errors.push(marksValidation.error);
    }
  }
  
  if (!data.examDate) {
    errors.push('Exam date is required');
  } else {
    const dateValidation = validateExamDate(data.examDate);
    if (!dateValidation.valid) {
      errors.push(dateValidation.error);
    }
  }
  
  if (data.weightage !== undefined && data.weightage !== null) {
    const weightageValidation = validateWeightage(data.weightage);
    if (!weightageValidation.valid) {
      errors.push(weightageValidation.error);
    }
  }
  
  if (data.duration !== undefined && data.duration !== null) {
    const durationValidation = validateDuration(data.duration);
    if (!durationValidation.valid) {
      errors.push(durationValidation.error);
    }
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
};
