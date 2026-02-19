// Approval Service - Handles teacher approval and class assignment
import apiService from './apiService';

const delay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

export const approvalService = {
  // Get pending teacher requests
  async getPendingRequests() {
    try {
      return await apiService.getPendingRequests();
    } catch (error) {
      console.error('Get pending requests error:', error);
      return {
        success: false,
        error: error.message || 'Failed to get pending requests'
      };
    }
  },

  // Approve a teacher
  async approveTeacher(teacherId, assignedClasses = []) {
    try {
      return await apiService.approveTeacher(teacherId, assignedClasses);
    } catch (error) {
      console.error('Approve teacher error:', error);
      return {
        success: false,
        error: error.message || 'Failed to approve teacher'
      };
    }
  },

  // Reject a teacher
  async rejectTeacher(teacherId, reason = '') {
    try {
      return await apiService.rejectTeacher(teacherId);
    } catch (error) {
      console.error('Reject teacher error:', error);
      return {
        success: false,
        error: error.message || 'Failed to reject teacher'
      };
    }
  },

  // Assign classes to a teacher
  async assignClasses(teacherId, classIds) {
    await delay();
    console.log(`Assigning classes to teacher ${teacherId}:`, classIds);
    return {
      success: true,
      message: 'Classes assigned successfully',
      data: {
        teacherId,
        assignedClasses: classIds,
        updatedAt: new Date().toISOString()
      }
    };
  },

  // Update teacher status
  async updateTeacherStatus(teacherId, status) {
    await delay();
    console.log(`Updating teacher ${teacherId} status to:`, status);
    return {
      success: true,
      message: 'Status updated successfully',
      data: {
        id: teacherId,
        status,
        updatedAt: new Date().toISOString()
      }
    };
  }
};
