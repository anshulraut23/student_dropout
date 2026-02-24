# Faculty Connect - Teacher Communication System

## Overview
Secure, school-internal messaging system enabling teachers to connect, collaborate, and communicate through one-on-one chat with file sharing capabilities.

## Features
- Invitation-based connections (like LinkedIn)
- One-on-one messaging
- File attachments (up to 1.5MB)
- Real-time message updates
- Connection management
- Search and discovery

## How It Works

### Connection Flow
1. **Discovery**: Browse teachers in your school
2. **Invitation**: Send connection request
3. **Acceptance**: Recipient accepts/rejects
4. **Chat**: Connected teachers can message

### Three-Step Process

#### Step 1: Find Teachers
- View all teachers in school
- Search by name, email, or subject
- See teacher profiles
- Filter and sort results

#### Step 2: Send Invitations
- Click "Send Invite" button
- Invitation status: Pending
- Recipient receives notification
- Can send multiple invitations

#### Step 3: Start Chatting
- Accept incoming invitations
- Click "Chat" button on connected teacher
- Send text messages
- Share files
- View conversation history

## User Interface

### Faculty Connect Page

#### Main Sections
1. **Search Bar**: Find teachers quickly
2. **Teacher List**: All school teachers
3. **Incoming Invitations**: Pending requests
4. **Sent Invitations**: Your pending requests
5. **Summary Cards**: Quick statistics

#### Teacher Card
- Name and email
- Subject taught
- Connection status
- Action buttons (Invite/Chat)

#### Invitation Card
- Sender/recipient info
- Accept/Reject buttons
- Timestamp
- Status indicator

### Faculty Chat Page

#### Layout
- **Left Sidebar**: Connected teachers list
- **Chat Area**: Message conversation
- **Input Box**: Type and send messages
- **Attachment Button**: Upload files

#### Message Features
- Text messages
- File attachments
- Timestamps
- Read receipts
- Auto-scroll to latest

## File Sharing

### Supported File Types
- Documents: PDF, DOC, DOCX, TXT
- Spreadsheets: XLS, XLSX
- Presentations: PPT, PPTX
- Images: PNG, JPG, JPEG

### File Limits
- Maximum size: 1.5MB per file
- One file per message
- Files stored as base64 in database
- Download available for recipients

### File Upload Process
1. Click attachment icon
2. Select file from device
3. File preview shown
4. Send message with attachment
5. Recipient can download

## Database Schema

### Tables

#### faculty_invites
```sql
- id (PK)
- sender_id (FK to users)
- recipient_id (FK to users)
- school_id (FK to schools)
- status (pending/accepted/rejected)
- created_at
- updated_at
```

#### faculty_messages
```sql
- id (PK)
- sender_id (FK to users)
- recipient_id (FK to users)
- school_id (FK to schools)
- text
- attachment_name
- attachment_type
- attachment_data (base64)
- created_at
```

## API Endpoints

### Connection Management
```
GET /api/faculty/teachers
- Get all teachers in school

POST /api/faculty/invites/send
- Send invitation
- Body: { recipientId }

GET /api/faculty/invites
- Get incoming and outgoing invitations

POST /api/faculty/invites/accept
- Accept invitation
- Body: { inviteId }

POST /api/faculty/invites/reject
- Reject invitation
- Body: { inviteId }

GET /api/faculty/connections
- Get accepted connections
```

### Messaging
```
POST /api/faculty/messages/send
- Send message
- Body: {
    recipientId,
    text,
    attachmentName,
    attachmentType,
    attachmentData
  }

GET /api/faculty/messages/conversation/:facultyId
- Get conversation history
- Query: ?limit=50
```

## Security Features

### Access Control
- Only teachers in same school can connect
- Authentication required for all endpoints
- Connection verification before messaging
- School-level data isolation

### Data Protection
- Messages encrypted in transit (HTTPS)
- File size limits prevent abuse
- No cross-school communication
- User-controlled connections

### Privacy
- Only connected teachers see messages
- No message broadcasting
- Delete invitation option
- Connection removal capability

## Real-Time Updates

### Polling Mechanism
- Checks for new messages every 3 seconds
- Automatic conversation refresh
- No page reload required
- Efficient database queries

### Update Triggers
- New message received
- Invitation accepted
- Connection established
- File uploaded

## Use Cases

### Collaboration
- Coordinate on student issues
- Share teaching resources
- Discuss class management
- Plan joint activities

### Quick Communication
- Ask quick questions
- Share updates
- Request information
- Provide feedback

### Resource Sharing
- Share lesson plans
- Exchange worksheets
- Send study materials
- Distribute schedules

## Setup Instructions

### 1. Database Migration
```bash
cd backend
node scripts/apply-faculty-migration.js
```

### 2. Verify Tables
```bash
node scripts/test-faculty-connect.js
```

### 3. Test System
- Log in as teacher
- Navigate to Faculty Connect
- Send test invitation
- Accept and start chatting

## Usage Guide

### For Teachers

#### Sending Invitations
1. Go to Faculty Connect page
2. Search for teacher
3. Click "Send Invite"
4. Wait for acceptance

#### Accepting Invitations
1. Check "Incoming Invitations" section
2. Review sender details
3. Click "Accept" or "Reject"
4. Start chatting if accepted

#### Messaging
1. Click "Open Chat" button
2. Select connected teacher
3. Type message in input box
4. Press Enter or click Send
5. Attach files if needed

#### File Sharing
1. Click attachment icon
2. Select file (max 1.5MB)
3. Preview file details
4. Send message
5. Recipient downloads file

### For Admins
- Monitor teacher connections
- View message statistics
- Ensure appropriate usage
- Handle reported issues

## Best Practices

### Communication Etiquette
- Professional language
- Timely responses
- Clear subject lines
- Appropriate file names

### Connection Management
- Connect with relevant teachers
- Accept genuine requests
- Remove inactive connections
- Keep contact list organized

### File Sharing
- Use descriptive file names
- Compress large files
- Verify file type
- Check file content before sending

## Troubleshooting

### Cannot Send Invitation
- Verify teacher is in same school
- Check if invitation already sent
- Ensure not already connected
- Refresh page and retry

### Messages Not Sending
- Check internet connection
- Verify connection is accepted
- Ensure file size under limit
- Check browser console for errors

### Files Not Uploading
- Verify file size (max 1.5MB)
- Check file type is supported
- Try different file
- Clear browser cache

### Conversation Not Loading
- Refresh page
- Check backend server status
- Verify database connection
- Clear browser cache

## Performance Optimization

### Message Loading
- Limit: 50 messages per load
- Pagination for older messages
- Efficient database queries
- Indexed conversation lookups

### File Storage
- Base64 encoding
- Database storage
- Size validation
- Type checking

### Real-Time Updates
- 3-second polling interval
- Conditional requests
- Efficient queries
- Minimal data transfer

## Future Enhancements
- Group chats
- Video calls
- Voice messages
- Message reactions
- Read receipts
- Typing indicators
- Message search
- Archive conversations
- Export chat history
- Mobile notifications
