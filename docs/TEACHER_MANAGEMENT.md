# Teacher Management System - Complete Documentation

## Overview

The Teacher Management System handles teacher registration, approval workflow, class assignments, and subject assignments. It integrates with the authentication system to provide role-based access control.

## Features

### ✅ Completed Features

- Teacher registration with approval workflow
- Admin approval/rejection of teachers
- Assign teachers to classes (as incharge)
- Assign teachers to subjects
- View teacher details
- Teacher-class relationships
- Teacher-subject relationships
- School-based isolation

## Database Schema

```sql
CREATE TABLE users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  fullName TEXT NOT NULL,
  role TEXT NOT NULL,              -- 'teacher'
  schoolId TEXT NOT NULL,
  status TEXT NOT NULL,            -- 'active', 'pending', 'rejected'
  phone TEXT,
  address TEXT,
  createdAt TEXT NOT NULL,
  updatedAt TEXT NOT NULL
);

CREATE TABLE approval_requests (
  id TEXT PRIMARY KEY,
  userId TEXT NOT NULL,
  requestType TEXT NOT NULL,       -- 'teacher_registration'
  status TEXT NOT NULL,            -- 'pending', 'approved', 'rejected'
  requestData TEXT,
  reviewedBy TEXT,
  reviewedAt TEXT,
  comments TEXT,
  createdAt TEXT NOT NULL
);
```

## API Endpoints

### Get All Teachers
```
GET /api/teachers
Authorization: Bearer <admin-token>

Response:
{
  "success": true,
  "teachers": [
    {
      "id": "teacher-123",
      "fullName": "John Doe",
      "email": "john@school.com",
      "phone": "+1234567890",
      "status": "active",
      "classesAsIncharge": ["Class 10-A"],
      "subjects": ["Mathematics", "Physics"]
    }
  ]
}
```

### Get Teacher's Classes
```
GET /api/teachers/my-classes
Authorization: Bearer <teacher-token>

Response:
{
  "success": true,
  "classes": [
    {
      "id": "class-123",
      "name": "Class 10-A",
      "grade": "10",
      "section": "A",
      "isIncharge": true,
      "role": "incharge",
      "subjects": [
        {
          "id": "subject-456",
          "name": "Mathematics"
        }
      ]
    }
  ]
}
```

### Get Pending Approval Requests
```
GET /api/approvals/pending
Authorization: Bearer <admin-token>

Response:
{
  "success": true,
  "requests": [
    {
      "id": "request-123",
      "userId": "teacher-789",
      "fullName": "Jane Smith",
      "email": "jane@school.com",
      "phone": "+1234567891",
      "address": "456 Oak Ave",
      "status": "pending",
      "createdAt": "2026-02-20T10:00:00Z"
    }
  ]
}
```

### Approve Teacher
```
POST /api/approvals/approve/:teacherId
Authorization: Bearer <admin-token>

Body (Optional):
{
  "classIds": ["class-123", "class-456"]
}

Response:
{
  "success": true,
  "message": "Teacher approved successfully",
  "user": {
    "id": "teacher-789",
    "status": "active"
  }
}
```

### Reject Teacher
```
POST /api/approvals/reject/:teacherId
Authorization: Bearer <admin-token>

Response:
{
  "success": true,
  "message": "Teacher rejected"
}
```

## Teacher Roles

### Class Incharge
- Assigned to one or more classes
- Can mark daily attendance for their classes
- Can mark subject-wise attendance for all subjects in their classes
- Oversees all students in their classes
- Primary point of contact for the class

### Subject Teacher
- Assigned to specific subjects in classes
- Can mark subject-wise attendance for their subjects only
- Enters exam scores for their subjects
- Focuses on subject-specific teaching

### Both Roles
- A teacher can be both incharge and subject teacher
- Different permissions for different classes
- Example: Incharge of Class 10-A, teaches Math in Class 10-B

## Usage Guide

### For Administrators

#### Approving Teacher Registrations

1. Login to admin dashboard
2. Navigate to "Approvals" section
3. See list of pending teacher requests
4. Review teacher details:
   - Name, email, phone
   - Address
   - Registration date
5. Click "Approve" or "Reject"
6. Optionally assign classes during approval
7. Teacher receives notification (future feature)
8. Teacher can now login

#### Assigning Teacher as Class Incharge

1. Navigate to "Classes" section
2. Select a class
3. Click "Edit" button
4. Select teacher from "Class Incharge" dropdown
5. Save changes
6. Teacher can now:
   - Mark attendance for this class
   - View all students
   - Access class reports

#### Assigning Teacher to Subjects

1. Navigate to "Subjects" section
2. Select a subject
3. Click "Edit" button
4. Select teacher from "Subject Teacher" dropdown
5. Save changes
6. Teacher can now:
   - Mark subject-wise attendance
   - Enter exam scores
   - View subject reports

#### Viewing Teacher Workload

1. Navigate to "Teachers" section
2. Select a teacher
3. View:
   - Classes as incharge
   - Subjects teaching
   - Total students
   - Workload summary

### For Teachers

#### After Registration

1. Register on teacher registration page
2. Wait for admin approval
3. Check email for approval notification (future)
4. Login after approval
5. Access teacher dashboard

#### Viewing Assigned Classes

1. Login to teacher dashboard
2. Navigate to "My Classes"
3. See list of classes:
   - Classes where you are incharge
   - Classes where you teach subjects
4. Click on class to view details

#### Viewing Assigned Subjects

1. Navigate to "My Subjects"
2. See list of subjects you teach
3. View students enrolled in each subject
4. Access subject-specific features

## Authorization

### Admin Permissions
- View all teachers
- Approve/reject teacher registrations
- Assign teachers as class incharge
- Assign teachers to subjects
- View teacher workload
- Deactivate teachers

### Teacher Permissions
- View own profile
- View assigned classes
- View assigned subjects
- Mark attendance (based on role)
- Enter performance data
- View reports for assigned classes/subjects

## Teacher Access Control

### Class Incharge Access
```javascript
// Can mark daily attendance
if (teacher.isIncharge(classId)) {
  allowDailyAttendance();
}

// Can mark all subjects in subject-wise mode
if (teacher.isIncharge(classId) && class.mode === 'subject-wise') {
  allowAllSubjects();
}
```

### Subject Teacher Access
```javascript
// Can only mark attendance for assigned subjects
if (teacher.teachesSubject(subjectId)) {
  allowSubjectAttendance(subjectId);
}

// Cannot mark daily attendance
if (!teacher.isIncharge(classId)) {
  denyDailyAttendance();
}
```

## Validation Rules

### Teacher Registration
- Email is required and must be unique
- Password is required (min 6 characters)
- Full name is required
- School must exist
- Phone must be valid format (if provided)

### Teacher Approval
- Only admins can approve/reject
- Teacher must be in 'pending' status
- Cannot approve already active teachers
- Cannot reject already rejected teachers

### Class Assignment
- Teacher must be active
- Class must exist and belong to same school
- One class can have only one incharge
- Teacher can be incharge of multiple classes

### Subject Assignment
- Teacher must be active
- Subject must exist and belong to same school
- One subject can have only one teacher
- Teacher can teach multiple subjects

## Best Practices

### Approval Process
- Review teacher credentials carefully
- Verify contact information
- Check qualifications (future feature)
- Approve within 24-48 hours
- Communicate rejection reasons

### Class Assignment
- Assign experienced teachers as incharge
- Balance workload across teachers
- Consider teacher expertise
- Limit classes per teacher (recommended: 2-3)

### Subject Assignment
- Match teacher expertise with subjects
- Balance subjects per teacher
- Consider teacher availability
- Avoid overloading teachers

### Workload Management
- Monitor teacher workload regularly
- Redistribute if imbalanced
- Consider teacher feedback
- Plan for teacher absences

## Troubleshooting

### Issue: Teacher cannot login

**Cause**: Account not approved or rejected

**Solution**:
- Check teacher status in admin panel
- If pending: Approve the teacher
- If rejected: Re-register or contact admin
- If active: Check credentials

---

### Issue: Teacher cannot see classes

**Cause**: Not assigned to any classes

**Solution**:
- Assign teacher as class incharge, OR
- Assign teacher to subjects in classes
- Teacher needs at least one assignment

---

### Issue: Teacher cannot mark attendance

**Cause**: Insufficient permissions for the class/subject

**Solution**:
- For daily attendance: Must be class incharge
- For subject-wise: Must be incharge OR subject teacher
- Verify teacher assignments

---

### Issue: Cannot assign teacher to class

**Cause**: Teacher doesn't belong to same school

**Solution**:
- Verify teacher's school
- Use teacher from same school
- Cannot assign cross-school

---

## Integration with Other Systems

### Authentication System
- Teacher registration creates user account
- Approval workflow activates account
- JWT tokens include teacher role
- Role-based access control

### Class Management
- Teachers assigned as class incharge
- One incharge per class
- Incharge has full class access

### Subject Management
- Teachers assigned to subjects
- One teacher per subject
- Subject teacher has subject-specific access

### Attendance System
- Class incharge marks daily attendance
- Subject teachers mark subject-wise attendance
- Authorization checked before marking

### Performance Management
- Teachers enter exam scores
- Subject teachers for their subjects
- Class incharge can view all scores

## Common Scenarios

### Scenario 1: New Teacher Onboarding

1. Teacher registers on website
2. Admin receives notification
3. Admin reviews and approves
4. Admin assigns to classes/subjects
5. Teacher logs in
6. Teacher views assignments
7. Teacher begins marking attendance

### Scenario 2: Teacher Transfer

1. Admin removes old class assignments
2. Admin assigns new classes
3. Admin updates subject assignments
4. Teacher sees new assignments
5. Old class gets new incharge
6. Smooth transition

### Scenario 3: Teacher Workload Balancing

1. Admin reviews teacher workload
2. Identifies overloaded teachers
3. Redistributes classes/subjects
4. Updates assignments
5. Monitors new distribution
6. Adjusts as needed

### Scenario 4: Teacher Leave

1. Identify substitute teacher
2. Temporarily assign classes to substitute
3. Substitute marks attendance
4. Original teacher returns
5. Reassign classes back
6. Update records

---

## Reporting

### Teacher Reports
- Classes assigned
- Subjects teaching
- Total students
- Attendance marking rate
- Performance entry rate
- Workload summary

### Admin Reports
- Total teachers
- Active vs pending
- Teachers per class
- Teachers per subject
- Workload distribution
- Approval timeline

---

**Last Updated**: February 21, 2026  
**Status**: Production Ready ✅
