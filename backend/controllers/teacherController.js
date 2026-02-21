import dataStore from '../storage/dataStore.js';

// Get all teachers for a school (admin only)
export const getAllTeachers = (req, res) => {
  try {
    const { schoolId } = req.user;

    // Verify user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ 
        success: false, 
        error: 'Only admins can view teachers' 
      });
    }

    // Get all users for this school with role 'teacher'
    const allUsers = dataStore.getUsers();
    console.log('All users:', allUsers.length);
    console.log('Admin schoolId:', schoolId);
    
    const teachers = allUsers.filter(u => u.schoolId === schoolId && u.role === 'teacher');
    console.log('Filtered teachers:', teachers.length);

    // Get all classes for this school to find incharge assignments
    const allClasses = dataStore.getClassesBySchool(schoolId);
    
    // Get all subjects for this school to find teaching assignments
    const allSubjects = dataStore.getSubjectsBySchool(schoolId);

    // Format response
    const formattedTeachers = teachers.map(teacher => {
      // Find the class where this teacher is the incharge
      const inchargeClass = allClasses.find(cls => cls.teacherId === teacher.id);
      
      // Find all subjects this teacher is teaching
      const teachingSubjects = allSubjects
        .filter(subject => subject.teacherId === teacher.id)
        .map(subject => subject.name);
      
      return {
        id: teacher.id,
        name: teacher.fullName,
        email: teacher.email,
        status: teacher.status,
        assignedClasses: teacher.assignedClasses || [],
        inchargeClass: inchargeClass ? inchargeClass.name : null,
        subjects: teachingSubjects,
        createdAt: teacher.createdAt
      };
    });

    res.json({
      success: true,
      teachers: formattedTeachers
    });
  } catch (error) {
    console.error('Get all teachers error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to get teachers' 
    });
  }
};

// Get teacher's own classes (for teacher dashboard)
export const getMyClasses = (req, res) => {
  try {
    const { userId, schoolId } = req.user;

    console.log('=== Get My Classes Debug ===');
    console.log('Teacher userId:', userId);
    console.log('Teacher schoolId:', schoolId);

    // Verify user is teacher
    if (req.user.role !== 'teacher') {
      return res.status(403).json({ 
        success: false, 
        error: 'Only teachers can view their classes' 
      });
    }

    // Get all classes and subjects for this school
    const allClasses = dataStore.getClassesBySchool(schoolId);
    const allSubjects = dataStore.getSubjectsBySchool(schoolId);

    console.log('Total classes in school:', allClasses.length);
    console.log('Total subjects in school:', allSubjects.length);

    // Find classes where teacher is incharge
    const inchargeClassIds = new Set(
      allClasses
        .filter(cls => {
          console.log(`Class ${cls.name} teacherId: ${cls.teacherId}, checking against: ${userId}`);
          return cls.teacherId === userId;
        })
        .map(cls => cls.id)
    );

    console.log('Incharge class IDs:', Array.from(inchargeClassIds));

    // Find subjects where teacher is assigned
    const teachingSubjects = allSubjects.filter(subject => {
      console.log(`Subject ${subject.name} teacherId: ${subject.teacherId}, checking against: ${userId}`);
      return subject.teacherId === userId;
    });

    console.log('Teaching subjects:', teachingSubjects.length);

    // Group subjects by class
    const subjectsByClass = new Map();
    teachingSubjects.forEach(subject => {
      if (!subjectsByClass.has(subject.classId)) {
        subjectsByClass.set(subject.classId, []);
      }
      subjectsByClass.get(subject.classId).push({
        id: subject.id,
        name: subject.name
      });
    });

    // Build the classes list
    const myClasses = [];

    // Get all unique class IDs (both incharge and subject teacher)
    const allClassIds = new Set([
      ...inchargeClassIds,
      ...subjectsByClass.keys()
    ]);

    console.log('All class IDs for teacher:', Array.from(allClassIds));

    allClassIds.forEach(classId => {
      const classData = dataStore.getClassById(classId);
      if (!classData) return;

      const isIncharge = inchargeClassIds.has(classId);
      const subjects = subjectsByClass.get(classId) || [];

      // Determine the primary role
      let role = 'subject_teacher';
      if (isIncharge && subjects.length > 0) {
        role = 'both'; // Teacher is both incharge and subject teacher
      } else if (isIncharge) {
        role = 'incharge';
      }

      myClasses.push({
        id: classData.id,
        name: classData.name,
        grade: classData.grade,
        section: classData.section,
        academicYear: classData.academicYear,
        attendanceMode: classData.attendanceMode,
        role: role,
        isIncharge: isIncharge,
        subjects: subjects
      });
    });

    console.log('Final classes for teacher:', myClasses.length);
    console.log('=== End Debug ===');

    res.json({
      success: true,
      classes: myClasses
    });
  } catch (error) {
    console.error('Get my classes error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to get classes' 
    });
  }
};
