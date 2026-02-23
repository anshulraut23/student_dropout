// Profile Service - Business logic for user profile operations

import dataStore from '../storage/dataStore.js';

/**
 * Get user profile with school data
 */
export const getUserProfile = async (userId) => {
  const user = dataStore.getUserById(userId);
  
  if (!user) {
    throw new Error('User not found');
  }
  
  // Remove password from response
  const { password, ...userWithoutPassword } = user;
  
  // Get school data if user has a schoolId
  let school = null;
  if (user.schoolId) {
    school = dataStore.getSchoolById(user.schoolId);
  }
  
  return {
    ...userWithoutPassword,
    school
  };
};

/**
 * Update user profile
 */
export const updateUserProfile = async (userId, updates) => {
  const user = dataStore.getUserById(userId);
  
  if (!user) {
    throw new Error('User not found');
  }
  
  // Validate profile data
  const validation = validateProfileData(updates);
  if (!validation.isValid) {
    throw new Error(validation.errors.join(', '));
  }
  
  // Prepare updates - only allow specific fields to be updated
  const allowedFields = [
    'fullName',
    'email',
    'phone',
    'designation',
    'address',
    'city',
    'state',
    'pincode',
    'profilePicture'
  ];
  
  const filteredUpdates = {};
  for (const field of allowedFields) {
    if (updates[field] !== undefined) {
      filteredUpdates[field] = updates[field];
    }
  }
  
  // Add updatedAt timestamp
  filteredUpdates.updatedAt = new Date().toISOString();
  
  // Update user in database
  const updatedUser = dataStore.updateUser(userId, filteredUpdates);
  
  if (!updatedUser) {
    throw new Error('Failed to update user profile');
  }
  
  // Remove password from response
  const { password, ...userWithoutPassword } = updatedUser;
  
  // Get school data
  let school = null;
  if (updatedUser.schoolId) {
    school = dataStore.getSchoolById(updatedUser.schoolId);
  }
  
  return {
    ...userWithoutPassword,
    school
  };
};

/**
 * Validate profile data
 */
export const validateProfileData = (data) => {
  const errors = [];
  
  // Validate fullName
  if (data.fullName !== undefined) {
    if (!data.fullName || data.fullName.trim().length === 0) {
      errors.push('Full name is required');
    } else if (data.fullName.trim().length < 2) {
      errors.push('Full name must be at least 2 characters');
    }
  }
  
  // Validate email
  if (data.email !== undefined) {
    if (!data.email || data.email.trim().length === 0) {
      errors.push('Email is required');
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(data.email)) {
        errors.push('Invalid email format');
      }
    }
  }
  
  // Validate phone (optional but must be valid if provided)
  if (data.phone !== undefined && data.phone !== null && data.phone.trim().length > 0) {
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(data.phone.replace(/[\s\-\(\)]/g, ''))) {
      errors.push('Phone number must be 10 digits');
    }
  }
  
  // Validate pincode (optional but must be valid if provided)
  if (data.pincode !== undefined && data.pincode !== null && data.pincode.trim().length > 0) {
    const pincodeRegex = /^[0-9]{6}$/;
    if (!pincodeRegex.test(data.pincode)) {
      errors.push('Pincode must be 6 digits');
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Transform user data for response
 */
export const transformUserData = (user, school = null) => {
  if (!user) return null;
  
  const { password, ...userWithoutPassword } = user;
  
  return {
    ...userWithoutPassword,
    school
  };
};
