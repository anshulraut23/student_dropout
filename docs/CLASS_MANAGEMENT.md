# Class Management System - Complete Documentation

## Overview

The Class Management System allows administrators to create, manage, and organize classes within their school. It supports both daily and subject-wise attendance modes, class incharge assignment, and student enrollment.

## Features

### ✅ Completed Features

- Create and manage classes
- Assign class incharge (teacher)
- Set attendance mode (daily/subject-wise)
- Grade and section management
- Student capacity tracking
- Class-teacher relationships
- School-based isolation

## Database Schema

```sql
CREATE TABLE classes (
  id TEXT PRIMARY KEY,
  schoolId TEXT NOT NULL,
  name TEXT NOT NULL,
  grade TEXT NOT NULL,
  section TEXT,
  teacherId TEXT,                -- Class incharge
  attendanceMode TEXT NOT NULL,  -- 'daily' or 'subject-wise'
  capacity INTEGER,
  academicYear TEXT,
  description TEXT,
  createdAt TEXT NOT NULL,
  updatedAt TEXT NOT NULL
);
```

## API Endpoints

### Create Class
```
POST /api/classes
Authorization: Bearer <admin-token>

Body:
{
  "name": "Class 10-A",
  "grade": "10",
  "section": "A",
  "teacherId": "teacher-123",
  "attendanceMode": "daily",
  "capacity": 40,
  "academicYear": "2025-2026"
}

Response:
{
  "success": true,
  "message": "Class created successfully",
  "class": { ... }
}
```

### Get All Classes
```
GET /api/classes
Authorization: Bearer <token>

Response:
{
  "success": true,
  "classes": [
    {
      "id": "class-123",
      "name": "Class 10-A",
      "grade": "10",
      "section": "A",
      "teacherName": "John Doe",
      "attendanceMode": "daily",
      "studentCount": 35,
      "capacity": 40
    }
  ]
}
```

### Get Class by ID
```
GET /api/classes/:classId
Authorization: Bearer <token>

Response:
{
  "success": true,
  "class": {
    "id": "class-123",
    "name": "Class 10-A",
    "grade": "10",
    "section": "A",
    "teacherId": "teacher-123",
    "teacherName": "John Doe",
    "attendanceMode": "daily",
    "capacity": 40,
    "studentCount": 35,
    "subjects": [...],
    "students": [...]
  }
}
```

### Update Class
```
PUT /api/classes/:classId
Authorization: Bearer <admin-token>

Body:
{
  "name": "Class 10-A Updated",
  "teacherId": "teacher-456",
  "capacity": 45
}

Response:
{
  "success": true,
  "message": "Class updated successfully",
  "class": { ... }
}
```

### Delete Class
```
DELETE /api/classes/:classId
Authorization: Bearer <admin-token>

Response:
{
  "success": true,
  "message": "Class deleted successfully"
}
```

## Attendance Modes

### Daily Attendance
- Class incharge marks attendance once per day
- No subject selection required
- All students marked together
- Suitable for primary classes

### Subject-Wise Attendance
- Attendance marked per subject
- Subject teachers mark for their subjects
- Class incharge can mark for all subjects
- Multiple attendance records per day
- Suitable for secondary/higher classes

## Usage Guide

### For Administrators

#### Creating a Class

1. Login to admin dashboard
2. Navigate to "Classes" section
3. Click "Add Class" button
4. Fill in class details:
   - Name (e.g., "Class 10-A")
   - Grade (e.g., "10")
   - Section (e.g., "A")
   - Select class incharge
   - Choose attendance mode
   - Set capacity
5. Click "Save"
6. Class is now available for student enrollment

#### Assigning Class Incharge

1. Go to class details
2. Click "Edit" button
3. Select teacher from dropdown
4. Save changes
5. Teacher can now mark attendance for this class

#### Changing Attendance Mode

1. Go to class details
2. Click "Edit" button
3. Select attendance mode:
   - Daily: For simple daily attendance
   - Subject-wise: For subject-specific attendance
4. Save changes
5. Mode affects how teachers mark attendance

### For Teachers

#### Viewing Assigned Classes

1. Login to teacher dashboard
2. Navigate to "My Classes"
3. See list of classes where you are:
   - Class incharge
   - Subject teacher

#### Class Incharge Responsibilities

- Mark daily attendance (if daily mode)
- View all students in class
- Access class reports
- Coordinate with subject teachers

## Authorization

### Admin Permissions
- Create classes
- Update classes
- Delete classes
- Assign class incharge
- Change attendance mode

### Teacher Permissions
- View assigned classes
- View class students
- Mark attendance (if incharge or subject teacher)
- View class reports

## Validation Rules

### Class Creation
- Name is required
- Grade is required
- Attendance mode must be 'daily' or 'subject-wise'
- Teacher must exist and belong to same school
- Capacity must be positive number

### Class Update
- Cannot change schoolId
- Teacher must belong to same school
- Attendance mode change affects existing attendance

### Class Deletion
- Cannot delete if students are enrolled
- Cannot delete if attendance records exist
- Must transfer students first

## Best Practices

### Naming Convention
- Use format: "Class [Grade]-[Section]"
- Examples: "Class 10-A", "Class 5-B"
- Consistent naming helps with sorting and filtering

### Attendance Mode Selection
- **Daily**: Primary classes (1-5)
- **Subject-wise**: Secondary classes (6-12)
- Consider teacher availability
- Consider subject complexity

### Capacity Planning
- Set realistic capacity
- Consider classroom size
- Leave buffer for transfers
- Monitor enrollment vs capacity

## Troubleshooting

### Issue: Cannot create class

**Cause**: Missing required fields or invalid data

**Solution**:
- Ensure all required fields are filled
- Verify teacher exists
- Check attendance mode is valid

---

### Issue: Cannot assign teacher as incharge

**Cause**: Teacher doesn't belong to same school

**Solution**:
- Verify teacher's school
- Use teacher from same school
- Contact admin if teacher needs transfer

---

### Issue: Cannot delete class

**Cause**: Students enrolled or attendance records exist

**Solution**:
- Transfer students to another class
- Archive attendance records
- Then delete class

---

## Integration with Other Systems

### Student Management
- Students are assigned to classes
- Class determines student's grade level
- Class incharge oversees student progress

### Subject Management
- Subjects are assigned to classes
- Subject-wise attendance requires subjects
- Subject teachers linked to classes

### Attendance System
- Attendance mode determines marking process
- Class incharge can mark daily attendance
- Subject teachers mark subject-wise attendance

### Performance Management
- Exams are conducted per class
- Performance tracked by class
- Class-wise analytics available

---

**Last Updated**: February 21, 2026  
**Status**: Production Ready ✅
