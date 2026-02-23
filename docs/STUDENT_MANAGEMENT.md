# Student Management System - Complete Documentation

## Overview

The Student Management System allows administrators and teachers to manage student information, enrollment, and class assignments. It supports individual student addition and bulk import via CSV/Excel files.

## Features

### ✅ Completed Features

- Add individual students
- Bulk student import (CSV/Excel)
- Update student information
- Delete students
- Assign students to classes
- Student enrollment management
- Parent/guardian information
- School-based isolation

## Database Schema

```sql
CREATE TABLE students (
  id TEXT PRIMARY KEY,
  schoolId TEXT NOT NULL,
  classId TEXT NOT NULL,
  enrollmentNo TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  dateOfBirth TEXT,
  gender TEXT,
  email TEXT,
  phone TEXT,
  address TEXT,
  parentName TEXT,
  parentPhone TEXT,
  parentEmail TEXT,
  admissionDate TEXT,
  status TEXT DEFAULT 'active',    -- 'active', 'inactive', 'transferred'
  createdAt TEXT NOT NULL,
  updatedAt TEXT NOT NULL
);
```

## API Endpoints

### Add Student
```
POST /api/students
Authorization: Bearer <admin-token>

Body:
{
  "name": "John Smith",
  "enrollmentNo": "2024001",
  "classId": "class-123",
  "dateOfBirth": "2010-05-15",
  "gender": "male",
  "email": "john.smith@email.com",
  "phone": "+1234567890",
  "address": "123 Main St",
  "parentName": "Robert Smith",
  "parentPhone": "+1234567891",
  "parentEmail": "robert.smith@email.com",
  "admissionDate": "2024-01-15"
}

Response:
{
  "success": true,
  "message": "Student added successfully",
  "student": { ... }
}
```

### Bulk Add Students
```
POST /api/students/bulk
Authorization: Bearer <admin-token>

Body:
{
  "classId": "class-123",
  "students": [
    {
      "name": "John Smith",
      "enrollmentNo": "2024001",
      "dateOfBirth": "2010-05-15",
      ...
    },
    {
      "name": "Jane Doe",
      "enrollmentNo": "2024002",
      ...
    }
  ]
}

Response:
{
  "success": true,
  "message": "5 students added successfully",
  "added": 5,
  "failed": 0,
  "students": [...],
  "errors": []
}
```

### Get All Students
```
GET /api/students?classId=class-123
Authorization: Bearer <token>

Response:
{
  "success": true,
  "students": [
    {
      "id": "student-123",
      "name": "John Smith",
      "enrollmentNo": "2024001",
      "className": "Class 10-A",
      "status": "active"
    }
  ]
}
```

### Get Student by ID
```
GET /api/students/:studentId
Authorization: Bearer <token>

Response:
{
  "success": true,
  "student": {
    "id": "student-123",
    "name": "John Smith",
    "enrollmentNo": "2024001",
    "classId": "class-123",
    "className": "Class 10-A",
    "dateOfBirth": "2010-05-15",
    "gender": "male",
    "email": "john.smith@email.com",
    "phone": "+1234567890",
    "address": "123 Main St",
    "parentName": "Robert Smith",
    "parentPhone": "+1234567891",
    "parentEmail": "robert.smith@email.com",
    "admissionDate": "2024-01-15",
    "status": "active"
  }
}
```

### Update Student
```
PUT /api/students/:studentId
Authorization: Bearer <admin-token>

Body:
{
  "name": "John Smith Jr.",
  "phone": "+1234567899",
  "classId": "class-456"
}

Response:
{
  "success": true,
  "message": "Student updated successfully",
  "student": { ... }
}
```

### Delete Student
```
DELETE /api/students/:studentId
Authorization: Bearer <admin-token>

Response:
{
  "success": true,
  "message": "Student deleted successfully"
}
```

## Bulk Import

### CSV/Excel Format

Required columns:
- Name
- Enrollment No
- Date of Birth (YYYY-MM-DD)
- Gender
- Parent Name
- Parent Phone

Optional columns:
- Email
- Phone
- Address
- Parent Email
- Admission Date

### Example CSV
```csv
Name,Enrollment No,Date of Birth,Gender,Parent Name,Parent Phone,Email,Phone,Address
John Smith,2024001,2010-05-15,male,Robert Smith,+1234567891,john@email.com,+1234567890,123 Main St
Jane Doe,2024002,2010-08-20,female,Mary Doe,+1234567892,jane@email.com,+1234567893,456 Oak Ave
```

### Import Process

1. Download template from UI
2. Fill in student data
3. Upload file
4. System validates data
5. Shows preview with errors
6. Confirm import
7. Students added to class

## Usage Guide

### For Administrators

#### Adding Individual Student

1. Login to admin dashboard
2. Navigate to "Students" section
3. Click "Add Student" button
4. Fill in student details:
   - Basic info (name, enrollment no, DOB, gender)
   - Contact info (email, phone, address)
   - Parent info (name, phone, email)
   - Select class
   - Set admission date
5. Click "Save"
6. Student is now enrolled

#### Bulk Import Students

1. Navigate to "Students" section
2. Click "Bulk Import" button
3. Download CSV template
4. Fill in student data in Excel/CSV
5. Upload completed file
6. Review validation errors (if any)
7. Fix errors and re-upload
8. Confirm import
9. All students added to class

#### Transferring Student to Another Class

1. Go to student details
2. Click "Edit" button
3. Select new class from dropdown
4. Save changes
5. Student moved to new class
6. Attendance history preserved

#### Managing Student Status

1. Go to student details
2. Click "Edit" button
3. Change status:
   - Active: Currently enrolled
   - Inactive: Temporarily not attending
   - Transferred: Moved to another school
4. Save changes

### For Teachers

#### Viewing Class Students

1. Login to teacher dashboard
2. Navigate to "My Classes"
3. Select a class
4. View list of enrolled students
5. See student details

#### Marking Attendance

1. Select class and date
2. Student list loads automatically
3. Mark each student's attendance
4. Save attendance

## Authorization

### Admin Permissions
- Add students (individual and bulk)
- Update student information
- Delete students
- Transfer students between classes
- Change student status
- View all students in school

### Teacher Permissions
- View students in assigned classes
- View student details
- Mark attendance
- Enter performance data
- Cannot add/delete students

## Validation Rules

### Student Creation
- Name is required
- Enrollment number is required and must be unique
- Class must exist
- Date of birth must be valid date
- Gender must be 'male', 'female', or 'other'
- Email must be valid format (if provided)
- Phone must be valid format (if provided)

### Enrollment Number
- Must be unique within school
- Cannot be changed after creation
- Format: School-defined (e.g., 2024001, STU-001)

### Student Update
- Cannot change schoolId
- Cannot change enrollmentNo
- Class must exist and belong to same school
- All other fields can be updated

### Student Deletion
- Soft delete (status = 'inactive')
- Attendance records preserved
- Performance records preserved
- Can be reactivated later

## Best Practices

### Enrollment Numbers
- Use consistent format
- Include year: 2024001, 2024002
- Or use prefix: STU-001, STU-002
- Ensure uniqueness
- Document format for reference

### Data Entry
- Verify information before saving
- Use bulk import for large batches
- Keep parent contact updated
- Regular data audits

### Class Assignment
- Assign to appropriate grade level
- Consider class capacity
- Balance class sizes
- Review assignments periodically

### Data Privacy
- Protect student information
- Limit access to authorized users
- Don't share personal data
- Follow data protection regulations

## Troubleshooting

### Issue: Cannot add student

**Cause**: Missing required fields or duplicate enrollment number

**Solution**:
- Ensure all required fields are filled
- Check enrollment number is unique
- Verify class exists

---

### Issue: Bulk import failing

**Cause**: Invalid data format or missing columns

**Solution**:
- Use provided template
- Check column names match exactly
- Verify date format (YYYY-MM-DD)
- Ensure enrollment numbers are unique
- Check for special characters

---

### Issue: Cannot delete student

**Cause**: Student has attendance or exam records

**Solution**:
- Use soft delete (change status to 'inactive')
- Don't permanently delete students with records
- Archive data if needed

---

### Issue: Student not showing in class

**Cause**: Student assigned to different class or inactive

**Solution**:
- Check student's class assignment
- Verify student status is 'active'
- Transfer to correct class if needed

---

## Integration with Other Systems

### Class Management
- Students belong to classes
- Class determines grade level
- Class capacity limits enrollment

### Attendance System
- Attendance marked per student
- Student list loaded from class
- Attendance history tracked

### Performance Management
- Exam scores recorded per student
- Performance tracked over time
- Student-wise analytics

### Alert System
- Low attendance alerts
- Poor performance alerts
- Behavioral alerts
- Parent notifications

## Common Scenarios

### Scenario 1: New Academic Year

1. Create new classes for new year
2. Promote existing students to next grade
3. Bulk import new admissions
4. Verify all students assigned correctly
5. Archive previous year data

### Scenario 2: Mid-Year Admission

1. Add student individually
2. Assign to appropriate class
3. Set admission date
4. Notify class teacher
5. Begin attendance tracking

### Scenario 3: Student Transfer

1. Update student's class
2. Notify old and new class teachers
3. Transfer attendance records
4. Update parent contact if needed
5. Continue tracking in new class

### Scenario 4: Student Withdrawal

1. Change status to 'transferred' or 'inactive'
2. Set last attendance date
3. Archive student records
4. Notify relevant teachers
5. Update class capacity

---

## Data Export

### Export Student List
- Filter by class, grade, or status
- Export to CSV/Excel
- Include selected fields
- Use for reports and analysis

### Export Formats
- CSV: For data processing
- Excel: For formatted reports
- PDF: For printing

---

**Last Updated**: February 21, 2026  
**Status**: Production Ready ✅
