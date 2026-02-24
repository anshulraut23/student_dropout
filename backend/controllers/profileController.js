import dataStore from '../storage/dataStore.js';

// Get current user profile
export const getProfile = (req, res) => {
  try {
    const { userId } = req.user;

    const user = dataStore.getUserById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    // Get school data
    const school = dataStore.getSchoolById(user.schoolId);

    // Remove password from response
    const { password, ...userWithoutPassword } = user;

    res.json({
      success: true,
      user: userWithoutPassword,
      school: school ? {
        id: school.id,
        name: school.name,
        address: school.address,
        city: school.city,
        state: school.state,
        phone: school.phone
      } : null
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get profile'
    });
  }
};

// Update current user profile
export const updateProfile = (req, res) => {
  try {
    const { userId } = req.user;
    const updates = req.body;

    const user = dataStore.getUserById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    // Validate required fields if provided
    if (updates.email !== undefined && !updates.email) {
      return res.status(400).json({
        success: false,
        error: 'Email is required'
      });
    }

    if (updates.fullName !== undefined && !updates.fullName) {
      return res.status(400).json({
        success: false,
        error: 'Full name is required'
      });
    }

    // Prevent updating sensitive fields
    const { password, role, id, schoolId, status, createdAt, ...allowedUpdates } = updates;

    // Update user profile
    const updatedUser = dataStore.updateUser(userId, {
      ...allowedUpdates,
      updatedAt: new Date().toISOString()
    });

    // Get school data
    const school = dataStore.getSchoolById(updatedUser.schoolId);

    // Remove password from response
    const { password: pwd, ...userWithoutPassword } = updatedUser;

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user: userWithoutPassword,
      school: school ? {
        id: school.id,
        name: school.name,
        address: school.address,
        city: school.city,
        state: school.state,
        phone: school.phone
      } : null
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update profile'
    });
  }
};

// Get user profile by ID (admin only)
export const getProfileById = (req, res) => {
  try {
    const { userId } = req.params;
    const { role: requestorRole, schoolId: requestorSchoolId } = req.user;

    // Only admins can view other users' profiles
    if (requestorRole !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Only admins can view other user profiles'
      });
    }

    const user = dataStore.getUserById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    // Verify user belongs to same school
    if (user.schoolId !== requestorSchoolId) {
      return res.status(403).json({
        success: false,
        error: 'Access denied'
      });
    }

    // Get school data
    const school = dataStore.getSchoolById(user.schoolId);

    // Remove password from response
    const { password, ...userWithoutPassword } = user;

    res.json({
      success: true,
      user: userWithoutPassword,
      school: school ? {
        id: school.id,
        name: school.name,
        address: school.address,
        city: school.city,
        state: school.state,
        phone: school.phone
      } : null
    });
  } catch (error) {
    console.error('Get profile by ID error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get profile'
    });
  }
};
