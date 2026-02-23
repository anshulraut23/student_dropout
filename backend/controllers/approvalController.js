import dataStore from '../storage/dataStore.js';

// Get pending teacher requests for a school
export const getPendingRequests = async (req, res) => {
  try {
    const { schoolId } = req.user;

    // Verify user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ 
        success: false, 
        error: 'Only admins can view approval requests' 
      });
    }

    const requests = await dataStore.getRequestsBySchool(schoolId);
    
    // Enrich requests with user data
    const enrichedRequests = await Promise.all(requests.map(async request => {
      const user = await dataStore.getUserById(request.teacherId);
      return {
        ...request,
        teacherName: user ? user.fullName : 'Unknown',
        teacherEmail: user ? user.email : 'Unknown'
      };
    }));

    res.json({
      success: true,
      requests: enrichedRequests
    });
  } catch (error) {
    console.error('Get pending requests error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to get pending requests' 
    });
  }
};

// Approve teacher
export const approveTeacher = async (req, res) => {
  try {
    const { teacherId } = req.params;
    const { classIds = [] } = req.body;

    // Verify user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ 
        success: false, 
        error: 'Only admins can approve teachers' 
      });
    }

    // Update user status
    const user = await dataStore.updateUser(teacherId, {
      status: 'approved',
      assignedClasses: classIds
    });

    if (!user) {
      return res.status(404).json({ 
        success: false, 
        error: 'Teacher not found' 
      });
    }

    // If classIds provided, update those classes to have this teacher as incharge
    if (classIds.length > 0) {
      for (const classId of classIds) {
        const classData = await dataStore.getClassById(classId);
        if (classData && classData.schoolId === req.user.schoolId) {
          // Update class to have this teacher as incharge
          await dataStore.updateClass(classId, {
            teacherId: teacherId,
            updatedAt: new Date().toISOString()
          });
        }
      }
    }

    // Update request
    await dataStore.updateRequest(teacherId, {
      status: 'approved',
      processedAt: new Date().toISOString()
    });

    res.json({
      success: true,
      message: 'Teacher approved successfully',
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        status: user.status,
        assignedClasses: user.assignedClasses
      }
    });
  } catch (error) {
    console.error('Approve teacher error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to approve teacher' 
    });
  }
};

// Reject teacher
export const rejectTeacher = async (req, res) => {
  try {
    const { teacherId } = req.params;

    // Verify user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ 
        success: false, 
        error: 'Only admins can reject teachers' 
      });
    }

    // Update user status
    const user = await dataStore.updateUser(teacherId, {
      status: 'rejected'
    });

    if (!user) {
      return res.status(404).json({ 
        success: false, 
        error: 'Teacher not found' 
      });
    }

    // Update request
    await dataStore.updateRequest(teacherId, {
      status: 'rejected',
      processedAt: new Date().toISOString()
    });

    res.json({
      success: true,
      message: 'Teacher rejected',
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        status: user.status
      }
    });
  } catch (error) {
    console.error('Reject teacher error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to reject teacher' 
    });
  }
};
