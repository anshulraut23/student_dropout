/**
 * Teacher Access Control Utility
 * 
 * This module provides functions to check if a teacher has access to specific classes and students.
 * Teachers can only access:
 * 1. Classes where they are assigned as incharge (classes.teacherId)
 * 2. Classes where they teach subjects (subjects.teacherId)
 */

/**
 * Get all class IDs that a teacher has access to
 * @param {Object} dataStore - The data store instance
 * @param {string} teacherId - The teacher's user ID
 * @param {string} schoolId - The school ID
 * @returns {Promise<Set<string>>} Set of class IDs the teacher has access to
 */
export async function getTeacherAccessibleClassIds(dataStore, teacherId, schoolId) {
  // Get all classes and subjects for the school
  const allClasses = await dataStore.getClassesBySchool(schoolId);
  const allSubjects = await dataStore.getSubjectsBySchool(schoolId);

  const accessibleClassIds = new Set();

  // Add classes where teacher is incharge
  allClasses.forEach(cls => {
    if (cls.teacherId === teacherId) {
      accessibleClassIds.add(cls.id);
    }
  });

  // Add classes where teacher teaches subjects
  allSubjects.forEach(subject => {
    if (subject.teacherId === teacherId) {
      accessibleClassIds.add(subject.classId);
    }
  });

  return accessibleClassIds;
}

/**
 * Check if a teacher has access to a specific class
 * @param {Object} dataStore - The data store instance
 * @param {string} teacherId - The teacher's user ID
 * @param {string} classId - The class ID to check
 * @param {string} schoolId - The school ID
 * @returns {Promise<boolean>} True if teacher has access
 */
export async function canTeacherAccessClass(dataStore, teacherId, classId, schoolId) {
  const accessibleClassIds = await getTeacherAccessibleClassIds(dataStore, teacherId, schoolId);
  return accessibleClassIds.has(classId);
}

/**
 * Check if a teacher has access to a specific student
 * @param {Object} dataStore - The data store instance
 * @param {string} teacherId - The teacher's user ID
 * @param {string} studentId - The student ID to check
 * @param {string} schoolId - The school ID
 * @returns {Promise<boolean>} True if teacher has access
 */
export async function canTeacherAccessStudent(dataStore, teacherId, studentId, schoolId) {
  const student = await dataStore.getStudentById(studentId);
  if (!student) {
    return false;
  }

  return await canTeacherAccessClass(dataStore, teacherId, student.classId, schoolId);
}

/**
 * Filter students to only those accessible by the teacher
 * @param {Object} dataStore - The data store instance
 * @param {Array} students - Array of student objects
 * @param {string} teacherId - The teacher's user ID
 * @param {string} schoolId - The school ID
 * @returns {Promise<Array>} Filtered array of students
 */
export async function filterStudentsByTeacherAccess(dataStore, students, teacherId, schoolId) {
  const accessibleClassIds = await getTeacherAccessibleClassIds(dataStore, teacherId, schoolId);
  return students.filter(student => accessibleClassIds.has(student.classId));
}

/**
 * Get detailed access information for a teacher
 * @param {Object} dataStore - The data store instance
 * @param {string} teacherId - The teacher's user ID
 * @param {string} schoolId - The school ID
 * @returns {Promise<Object>} Object containing access details
 */
export async function getTeacherAccessDetails(dataStore, teacherId, schoolId) {
  const allClasses = await dataStore.getClassesBySchool(schoolId);
  const allSubjects = await dataStore.getSubjectsBySchool(schoolId);

  const inchargeClasses = allClasses.filter(cls => cls.teacherId === teacherId);
  const teachingSubjects = allSubjects.filter(subject => subject.teacherId === teacherId);

  // Get unique class IDs from subjects
  const subjectClassIds = new Set(teachingSubjects.map(s => s.classId));
  const subjectClasses = allClasses.filter(cls => subjectClassIds.has(cls.id));

  return {
    inchargeClasses,
    teachingSubjects,
    subjectClasses,
    allAccessibleClassIds: await getTeacherAccessibleClassIds(dataStore, teacherId, schoolId)
  };
}
