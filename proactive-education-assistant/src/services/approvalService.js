// Approval Service - Handles teacher approval and class assignment

const delay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

export const approvalService = {
  // Approve a teacher
  async approveTeacher(teacherId, assignedClasses = []) {
    await delay();
    console.log(`Approving teacher ${teacherId} with classes:`, assignedClasses);
    return {
      success: true,
      message: 'Teacher approved successfully',
      data: {
        id: teacherId,
        status: 'approved',
        assignedClasses,
        approvedAt: new Date().toISOString()
      }
    };
  },

  // Reject a teacher
  async rejectTeacher(teacherId, reason = '') {
    await delay();
    console.log(`Rejecting teacher ${teacherId}. Reason:`, reason);
    return {
      success: true,
      message: 'Teacher rejected',
      data: {
        id: teacherId,
        status: 'rejected',
        rejectionReason: reason,
        rejectedAt: new Date().toISOString()
      }
    };
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
