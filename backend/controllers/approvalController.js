import dataStore from '../storage/dataStore.js';

// Get pending teacher requests for a school
export const getPendingRequests = (req, res) => {
  try {
    const { schoolId } = req.user;

    // Verify user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ 
        success: false, 
        error: 'Only admins can view approval requests' 
      });
    }

    const requests = dataStore.getRequestsBySchool(schoolId);
    
    // Enrich requests with user data
    const enrichedRequests = requests.map(request => {
      const user = dataStore.getUserById(request.teacherId);
      return {
        ...request,
        teacherName: user ? user.fullName : 'Unknown',
        teacherEmail: user ? user.email : 'Unknown'
      };
    });

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
export const approveTeacher = (req, res) => {
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
    const user = dataStore.updateUser(teacherId, {
      status: 'approved',
      assignedClasses: classIds
    });

    if (!user) {
      return res.status(404).json({ 
        success: false, 
        error: 'Teacher not found' 
      });
    }

    // Update request
    dataStore.updateRequest(teacherId, {
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
export const rejectTeacher = (req, res) => {
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
    const user = dataStore.updateUser(teacherId, {
      status: 'rejected'
    });

    if (!user) {
      return res.status(404).json({ 
        success: false, 
        error: 'Teacher not found' 
      });
    }

    // Update request
    dataStore.updateRequest(teacherId, {
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
