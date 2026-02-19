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

    // Format response
    const formattedTeachers = teachers.map(teacher => {
      // Find the class where this teacher is the incharge
      const inchargeClass = allClasses.find(cls => cls.teacherId === teacher.id);
      
      return {
        id: teacher.id,
        name: teacher.fullName,
        email: teacher.email,
        status: teacher.status,
        assignedClasses: teacher.assignedClasses || [],
        inchargeClass: inchargeClass ? inchargeClass.name : null,
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
