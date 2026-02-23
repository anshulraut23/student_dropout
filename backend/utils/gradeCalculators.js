// Grade Calculation Utilities

/**
 * Calculate percentage from marks
 */
export const calculatePercentage = (marksObtained, totalMarks) => {
  if (totalMarks === 0) {
    return 0;
  }
  return parseFloat(((marksObtained / totalMarks) * 100).toFixed(2));
};

/**
 * Calculate grade based on percentage and grade configuration
 */
export const calculateGrade = (percentage, gradeConfig) => {
  if (!gradeConfig || !gradeConfig.grades) {
    return null;
  }

  for (const gradeRule of gradeConfig.grades) {
    if (percentage >= gradeRule.minPercentage && percentage <= gradeRule.maxPercentage) {
      return {
        grade: gradeRule.grade,
        gradePoint: gradeRule.gradePoint,
        description: gradeRule.description
      };
    }
  }

  return null;
};

/**
 * Calculate GPA for a subject (weighted average of all exams)
 */
export const calculateSubjectGPA = (exams) => {
  if (!exams || exams.length === 0) {
    return 0;
  }

  let totalWeightedGP = 0;
  let totalWeight = 0;

  exams.forEach(exam => {
    if (exam.gradePoint !== null && exam.gradePoint !== undefined) {
      const weight = exam.weightage || 1.0;
      totalWeightedGP += exam.gradePoint * weight;
      totalWeight += weight;
    }
  });

  return totalWeight > 0 ? parseFloat((totalWeightedGP / totalWeight).toFixed(2)) : 0;
};

/**
 * Calculate overall GPA across all subjects
 */
export const calculateOverallGPA = (subjects) => {
  if (!subjects || subjects.length === 0) {
    return 0;
  }

  let totalGP = 0;
  let totalSubjects = 0;

  subjects.forEach(subject => {
    if (subject.gpa !== null && subject.gpa !== undefined && subject.gpa > 0) {
      totalGP += subject.gpa;
      totalSubjects++;
    }
  });

  return totalSubjects > 0 ? parseFloat((totalGP / totalSubjects).toFixed(2)) : 0;
};

/**
 * Calculate weighted average percentage
 */
export const calculateWeightedAverage = (exams) => {
  if (!exams || exams.length === 0) {
    return 0;
  }

  let totalWeightedPercentage = 0;
  let totalWeight = 0;

  exams.forEach(exam => {
    if (exam.percentage !== null && exam.percentage !== undefined) {
      const weight = exam.weightage || 1.0;
      totalWeightedPercentage += exam.percentage * weight;
      totalWeight += weight;
    }
  });

  return totalWeight > 0 ? parseFloat((totalWeightedPercentage / totalWeight).toFixed(2)) : 0;
};

/**
 * Get default CBSE-style grade configuration
 */
export const getDefaultGradeConfig = () => {
  return {
    name: 'CBSE Grading',
    grades: [
      {
        grade: 'A+',
        minPercentage: 91,
        maxPercentage: 100,
        gradePoint: 10.0,
        description: 'Outstanding'
      },
      {
        grade: 'A',
        minPercentage: 81,
        maxPercentage: 90,
        gradePoint: 9.0,
        description: 'Excellent'
      },
      {
        grade: 'B+',
        minPercentage: 71,
        maxPercentage: 80,
        gradePoint: 8.0,
        description: 'Very Good'
      },
      {
        grade: 'B',
        minPercentage: 61,
        maxPercentage: 70,
        gradePoint: 7.0,
        description: 'Good'
      },
      {
        grade: 'C+',
        minPercentage: 51,
        maxPercentage: 60,
        gradePoint: 6.0,
        description: 'Satisfactory'
      },
      {
        grade: 'C',
        minPercentage: 41,
        maxPercentage: 50,
        gradePoint: 5.0,
        description: 'Adequate'
      },
      {
        grade: 'D',
        minPercentage: 33,
        maxPercentage: 40,
        gradePoint: 4.0,
        description: 'Pass'
      },
      {
        grade: 'E',
        minPercentage: 0,
        maxPercentage: 32,
        gradePoint: 0.0,
        description: 'Fail'
      }
    ]
  };
};
