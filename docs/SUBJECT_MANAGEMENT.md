# Subject Management System - Complete Documentation

## Overview

The Subject Management System allows administrators to create and manage subjects, assign them to classes, and designate subject teachers. It's essential for subject-wise attendance and performance tracking.

## Features

### ✅ Completed Features

- Create and manage subjects
- Assign subjects to classes
- Assign subject teachers
- Subject-class mapping
- Subject-teacher relationships
- School-based isolation

## Database Schema

```sql
CREATE TABLE subjects (
  id TEXT PRIMARY KEY,
  schoolId TEXT NOT NULL,
  classId TEXT NOT NULL,
  name TEXT NOT NULL,
  code TEXT,
  teacherId TEXT,
  description TEXT,
  credits INTEGER,
  isOptional BOOLEAN DEFAULT 0,
  createdAt TEXT NOT NULL,
  updatedAt TEXT NOT NULL
);
```

## API Endpoints

### Create Subject
```
POST /api/subjects
Authorization: Bearer <admin-token>

Body:
{
  "name": "Mathematics",
  "code": "MATH101",
  "classId": "class-123",
  "teacherId": "teacher-456",
  "credits": 4,
  "isOptional": false,
  "description": "Advanced Mathematics"
}

Response:
{
  "success": true,
  "message": "Subject created successfully",
  "subject": { ... }
}
```

### Get All Subjects
```
GET /api/subjects
Authorization: Bearer <token>

Response:
{
  "success": true,
  "subjects": [
    {
      "id": "subject-123",
      "name": "Mathematics",
      "code": "MATH101",
      "className": "Class 10-A",
      "teacherName": "John Doe",
      "credits": 4
    }
  ]
}
```

### Get Subjects by Class
```
GET /api/subjects/class/:classId
Authorization: Bearer <token>

Response:
{
  "success": true,
  "subjects": [
    {
      "id": "subject-123",
      "name": "Mathematics",
      "teacherId": "teacher-456",
      "teacherName": "John Doe"
    }
  ]
}
```

### Update Subject
```
PUT /api/subjects/:subjectId
Authorization: Bearer <admin-token>

Body:
{
  "name": "Advanced Mathematics",
  "teacherId": "teacher-789",
  "credits": 5
}

Response:
{
  "success": true,
  "message": "Subject updated successfully",
  "subject": { ... }
}
```

### Delete Subject
```
DELETE /api/subjects/:subjectId
Authorization: Bearer <admin-token>

Response:
{
  "success": true,
  "message": "Subject deleted successfully"
}
```

## Subject Types

### Core Subjects
- Required for all students
- `isOptional: false`
- Examples: Mathematics, Science, English

### Optional Subjects
- Students can choose
- `isOptional: true`
- Examples: Art, Music, Computer Science

## Usage Guide

### For Administrators

#### Creating a Subject

1. Login to admin dashboard
2. Navigate to "Subjects" section
3. Click "Add Subject" button
4. Fill in subject details:
   - Name (e.g., "Mathematics")
   - Code (e.g., "MATH101")
   - Select class
   - Select teacher
   - Set credits
   - Mark as optional if applicable
5. Click "Save"
6. Subject is now available for the class

#### Assigning Subject Teacher

1. Go to subject details
2. Click "Edit" button
3. Select teacher from dropdown
4. Save changes
5. Teacher can now:
   - Mark attendance for this subject
   - Enter performance data
   - View subject reports

#### Managing Subject-Class Mapping

1. Each subject belongs to one class
2. Same subject can be created for multiple classes
3. Example:
   - Mathematics for Class 10-A
   - Mathematics for Class 10-B
4. Each has different teacher and students

### For Teachers

#### Viewing Assigned Subjects

1. Login to teacher dashboard
2. Navigate to "My Subjects"
3. See list of subjects you teach
4. View students enrolled in each subject

#### Subject Teacher Responsibilities

- Mark subject-wise attendance
- Enter exam scores
- Track student performance
- Provide subject-specific feedback

## Authorization

### Admin Permissions
- Create subjects
- Update subjects
- Delete subjects
- Assign subject teachers
- Manage subject-class mapping

### Teacher Permissions
- View assigned subjects
- View subject students
- Mark attendance for subject
- Enter performance data
- View subject reports

## Validation Rules

### Subject Creation
- Name is required
- Class must exist
- Teacher must exist and belong to same school
- Credits must be positive number
- Code must be unique within school (if provided)

### Subject Update
- Cannot change schoolId or classId
- Teacher must belong to same school
- Cannot change to optional if students enrolled

### Subject Deletion
- Cannot delete if attendance records exist
- Cannot delete if exam records exist
- Must archive data first

## Best Practices

### Naming Convention
- Use clear, descriptive names
- Examples: "Mathematics", "English Literature", "Physics"
- Avoid abbreviations in names
- Use code field for abbreviations

### Subject Codes
- Use standard codes if available
- Format: [SUBJECT][GRADE][NUMBER]
- Examples: MATH10A, ENG10B, SCI10C
- Helps with reporting and analytics

### Teacher Assignment
- Assign qualified teachers
- Consider teacher workload
- Balance subjects per teacher
- Ensure subject expertise

### Credits System
- Assign appropriate credits
- Core subjects: Higher credits
- Optional subjects: Lower credits
- Affects GPA calculations

## Troubleshooting

### Issue: Cannot create subject

**Cause**: Missing required fields or invalid data

**Solution**:
- Ensure name and class are provided
- Verify class exists
- Check teacher belongs to same school

---

### Issue: Cannot assign teacher

**Cause**: Teacher doesn't belong to same school

**Solution**:
- Verify teacher's school
- Use teacher from same school
- Contact admin for teacher transfer

---

### Issue: Cannot delete subject

**Cause**: Attendance or exam records exist

**Solution**:
- Archive attendance records
- Archive exam records
- Then delete subject

---

### Issue: Subject not showing in attendance

**Cause**: Class not in subject-wise mode

**Solution**:
- Check class attendance mode
- Change to subject-wise if needed
- Subjects only used in subject-wise mode

---

## Integration with Other Systems

### Class Management
- Subjects belong to classes
- Class attendance mode determines subject usage
- Subject-wise mode requires subjects

### Attendance System
- Subject-wise attendance uses subjects
- Teachers mark attendance per subject
- Multiple attendance records per day

### Performance Management
- Exams are conducted per subject
- Scores tracked by subject
- Subject-wise analytics available

### Teacher Management
- Teachers assigned to subjects
- Subject teachers have specific permissions
- Workload calculated by subjects

---

## Common Scenarios

### Scenario 1: Setting up a new class

1. Create class with subject-wise attendance
2. Create all required subjects for the class
3. Assign teachers to each subject
4. Enroll students in the class
5. Teachers can now mark subject-wise attendance

### Scenario 2: Changing subject teacher

1. Go to subject details
2. Click "Edit"
3. Select new teacher
4. Save changes
5. New teacher gets access immediately
6. Old teacher loses access

### Scenario 3: Adding optional subject

1. Create subject with `isOptional: true`
2. Assign teacher
3. Students can opt-in during enrollment
4. Track separately from core subjects

---

**Last Updated**: February 21, 2026  
**Status**: Production Ready ✅
