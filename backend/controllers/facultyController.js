import dataStore from '../storage/dataStore.js';
import { generateId } from '../utils/helpers.js';

// Get all teachers in same school (faculty list)
export const getSchoolTeachers = async (req, res) => {
  try {
    const { schoolId, userId } = req.user;

    // Get all users for this school with role 'teacher'
    const allUsers = await dataStore.getUsers();
    const schoolTeachers = allUsers.filter(
      u => u.schoolId === schoolId && u.role === 'teacher' && u.id !== userId
    );

    // Format response
    const formattedTeachers = schoolTeachers.map(teacher => ({
      id: teacher.id,
      name: teacher.fullName,
      email: teacher.email,
      status: teacher.status,
      subject: teacher.subject || 'General',
      createdAt: teacher.createdAt
    }));

    res.json({
      success: true,
      teachers: formattedTeachers
    });
  } catch (error) {
    console.error('Get school teachers error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get teachers list'
    });
  }
};

// Send faculty invitation/request
export const sendFacultyInvite = async (req, res) => {
  try {
    const { schoolId, userId } = req.user;
    const { recipientId } = req.body;

    if (!recipientId) {
      return res.status(400).json({
        success: false,
        error: 'Recipient ID is required'
      });
    }

    if (userId === recipientId) {
      return res.status(400).json({
        success: false,
        error: 'Cannot send invitation to yourself'
      });
    }

    // Verify recipient is in same school
    const recipient = await dataStore.getUserById(recipientId);
    if (!recipient || recipient.schoolId !== schoolId) {
      return res.status(404).json({
        success: false,
        error: 'Recipient not found'
      });
    }

    // Check if invitation already exists (pending or accepted)
    const faculty_invites = await dataStore.getFacultyInvites();
    const existingInvite = faculty_invites?.find(
      inv =>
        (inv.senderId === userId && inv.recipientId === recipientId) ||
        (inv.senderId === recipientId && inv.recipientId === userId)
    );

    if (existingInvite && existingInvite.status !== 'rejected') {
      return res.status(400).json({
        success: false,
        error: 'Invitation already exists'
      });
    }

    // Create invitation
    const invitation = {
      id: generateId('invite'),
      senderId: userId,
      recipientId: recipientId,
      schoolId: schoolId,
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    await dataStore.addFacultyInvite(invitation);

    res.status(201).json({
      success: true,
      message: 'Invitation sent successfully',
      invitation
    });
  } catch (error) {
    console.error('Send faculty invite error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to send invitation'
    });
  }
};

// Get pending invitations for current user
export const getMyFacultyInvites = async (req, res) => {
  try {
    const { userId, schoolId } = req.user;

    const faculty_invites = await dataStore.getFacultyInvites();
    const allUsers = await dataStore.getUsers();
    const usersBySchool = allUsers.filter(u => u.schoolId === schoolId);

    // Get invites where user is recipient (incoming)
    const incoming = (faculty_invites || [])
      .filter(inv => inv.recipientId === userId && inv.status === 'pending')
      .map(inv => {
        const sender = usersBySchool.find(u => u.id === inv.senderId);
        return {
          id: inv.id,
          senderId: inv.senderId,
          senderName: sender?.fullName || 'Unknown',
          senderEmail: sender?.email || '',
          senderSubject: sender?.subject || 'General',
          status: inv.status,
          createdAt: inv.createdAt
        };
      });

    // Get invites where user is sender (outgoing)
    const outgoing = (faculty_invites || [])
      .filter(inv => inv.senderId === userId && inv.status === 'pending')
      .map(inv => {
        const recipient = usersBySchool.find(u => u.id === inv.recipientId);
        return {
          id: inv.id,
          recipientId: inv.recipientId,
          recipientName: recipient?.fullName || 'Unknown',
          recipientEmail: recipient?.email || '',
          recipientSubject: recipient?.subject || 'General',
          status: inv.status,
          createdAt: inv.createdAt
        };
      });

    res.json({
      success: true,
      incoming,
      outgoing
    });
  } catch (error) {
    console.error('Get faculty invites error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get invitations'
    });
  }
};

// Accept faculty invitation
export const acceptFacultyInvite = async (req, res) => {
  try {
    const { userId } = req.user;
    const { inviteId } = req.body;

    if (!inviteId) {
      return res.status(400).json({
        success: false,
        error: 'Invite ID is required'
      });
    }

    const faculty_invites = await dataStore.getFacultyInvites();
    const invitation = faculty_invites?.find(inv => inv.id === inviteId);

    if (!invitation) {
      return res.status(404).json({
        success: false,
        error: 'Invitation not found'
      });
    }

    if (invitation.recipientId !== userId) {
      return res.status(403).json({
        success: false,
        error: 'You cannot accept this invitation'
      });
    }

    if (invitation.status !== 'pending') {
      return res.status(400).json({
        success: false,
        error: 'This invitation cannot be accepted'
      });
    }

    // Update invitation status
    invitation.status = 'accepted';
    invitation.updatedAt = new Date().toISOString();
    await dataStore.updateFacultyInvite(inviteId, invitation);

    res.json({
      success: true,
      message: 'Invitation accepted',
      invitation
    });
  } catch (error) {
    console.error('Accept faculty invite error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to accept invitation'
    });
  }
};

// Reject faculty invitation
export const rejectFacultyInvite = async (req, res) => {
  try {
    const { userId } = req.user;
    const { inviteId } = req.body;

    if (!inviteId) {
      return res.status(400).json({
        success: false,
        error: 'Invite ID is required'
      });
    }

    const faculty_invites = await dataStore.getFacultyInvites();
    const invitation = faculty_invites?.find(inv => inv.id === inviteId);

    if (!invitation) {
      return res.status(404).json({
        success: false,
        error: 'Invitation not found'
      });
    }

    if (invitation.recipientId !== userId) {
      return res.status(403).json({
        success: false,
        error: 'You cannot reject this invitation'
      });
    }

    if (invitation.status !== 'pending') {
      return res.status(400).json({
        success: false,
        error: 'This invitation cannot be rejected'
      });
    }

    // Update invitation status
    invitation.status = 'rejected';
    invitation.updatedAt = new Date().toISOString();
    await dataStore.updateFacultyInvite(inviteId, invitation);

    res.json({
      success: true,
      message: 'Invitation rejected',
      invitation
    });
  } catch (error) {
    console.error('Reject faculty invite error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to reject invitation'
    });
  }
};

// Get accepted connections (for chat)
export const getAcceptedConnections = async (req, res) => {
  try {
    const { userId, schoolId } = req.user;

    const faculty_invites = await dataStore.getFacultyInvites();
    const allUsers = await dataStore.getUsers();
    const usersBySchool = allUsers.filter(u => u.schoolId === schoolId);

    // Get accepted invitations
    const accepted = (faculty_invites || [])
      .filter(inv => inv.status === 'accepted')
      .filter(inv => inv.senderId === userId || inv.recipientId === userId)
      .map(inv => {
        const otherUserId = inv.senderId === userId ? inv.recipientId : inv.senderId;
        const otherUser = usersBySchool.find(u => u.id === otherUserId);
        return {
          id: otherUserId,
          name: otherUser?.fullName || 'Unknown',
          email: otherUser?.email || '',
          subject: otherUser?.subject || 'General',
          status: 'connected'
        };
      });

    res.json({
      success: true,
      connections: accepted
    });
  } catch (error) {
    console.error('Get accepted connections error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get connections'
    });
  }
};

// Send message
export const sendMessage = async (req, res) => {
  try {
    const { userId, schoolId } = req.user;
    const { recipientId, text, attachmentName, attachmentType, attachmentData } = req.body;

    if (!recipientId) {
      return res.status(400).json({
        success: false,
        error: 'Recipient ID is required'
      });
    }

    if (!text && !attachmentData) {
      return res.status(400).json({
        success: false,
        error: 'Message text or attachment is required'
      });
    }

    // Verify connection exists
    const faculty_invites = await dataStore.getFacultyInvites();
    const isConnected = (faculty_invites || []).some(
      inv =>
        inv.status === 'accepted' &&
        ((inv.senderId === userId && inv.recipientId === recipientId) ||
          (inv.senderId === recipientId && inv.recipientId === userId))
    );

    if (!isConnected) {
      return res.status(403).json({
        success: false,
        error: 'You are not connected with this faculty member'
      });
    }

    const message = {
      id: generateId('msg'),
      senderId: userId,
      recipientId: recipientId,
      schoolId: schoolId,
      text: text || null,
      attachmentName: attachmentName || null,
      attachmentType: attachmentType || null,
      attachmentData: attachmentData || null,
      createdAt: new Date().toISOString()
    };

    await dataStore.addMessage(message);

    res.status(201).json({
      success: true,
      message: message
    });
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to send message'
    });
  }
};

// Get conversation messages
export const getConversation = async (req, res) => {
  try {
    const { userId, schoolId } = req.user;
    const { facultyId } = req.params;
    const limit = Math.min(parseInt(req.query.limit) || 50, 100);

    if (!facultyId) {
      return res.status(400).json({
        success: false,
        error: 'Faculty ID is required'
      });
    }

    // Verify connection exists
    const faculty_invites = await dataStore.getFacultyInvites();
    const isConnected = (faculty_invites || []).some(
      inv =>
        inv.status === 'accepted' &&
        ((inv.senderId === userId && inv.recipientId === facultyId) ||
          (inv.senderId === facultyId && inv.recipientId === userId))
    );

    if (!isConnected) {
      return res.status(403).json({
        success: false,
        error: 'You are not connected with this faculty member'
      });
    }

    const messages = await dataStore.getConversation(userId, facultyId, schoolId, limit);

    res.json({
      success: true,
      messages: messages
    });
  } catch (error) {
    console.error('Get conversation error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get conversation'
    });
  }
};
