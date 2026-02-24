# Behavior Tracking System - Complete Documentation

## Table of Contents
1. [Overview](#overview)
2. [Features](#features)
3. [Architecture](#architecture)
4. [Database Schema](#database-schema)
5. [API Reference](#api-reference)
6. [Usage Guide](#usage-guide)
7. [Implementation Status](#implementation-status)

---

## Overview

The Behavior Tracking System allows teachers and administrators to record and monitor student behavioral incidents, both positive and negative. This system helps identify patterns, track improvements, and provide data for intervention planning.

### Key Features
- ✅ Record positive and negative behaviors
- ✅ Categorize behaviors by type and severity
- ✅ Track follow-up actions
- ✅ Filter and search behavior records
- ✅ Student behavior history
- ✅ Role-based access control

---

## Features

### 1. Behavior Recording

#### Behavior Types
- **Positive**: Good behavior, achievements, improvements
- **Negative**: Disciplinary issues, rule violations, concerns

#### Severity Levels
- **Low**: Minor issues or small achievements
- **Medium**: Moderate concerns or notable achievements
- **High**: Serious issues or exceptional achievements

#### Categories
- Academic Performance
- Classroom Behavior
- Social Interaction
- Attendance & Punctuality
- Homework & Assignments
- Respect & Discipline
- Leadership & Initiative
- Other

### 2. Behavior Details

Each behavior record includes:
- Student information
- Date of incident
- Behavior type (positive/negative)
- Category
- Severity level
- Detailed description
- Action taken (if any)
- Follow-up required flag
- Follow-up date
- Teacher who recorded it

### 3. Access Control

#### Teachers
- Can create behavior records for their students
- Can view their own behavior records
- Can edit/delete their own records
- Cannot modify other teachers' records

#### Administrators
- Can view all behavior records in their school
- Can edit/delete any behavior record
- Can filter by teacher, student, date range
- Can generate behavior reports

---

## Architecture

### Backend Components

```
backend/
├── controllers/
│   └── behaviorController.js        # API endpoint handlers
├── routes/
│   └── behaviorRoutes.js           # Route definitions
└── storage/
    ├── postgresStore.js            # PostgreSQL implementation
    └── sqliteStore.js              # SQLite implementation
```

### Database Schema

```sql
CREATE TABLE behavior (
    id TEXT PRIMARY KEY,
    student_id TEXT NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    teacher_id TEXT NOT NULL REFERENCES users(id),
    date DATE NOT NULL,
    behavior_type VARCHAR(20) NOT NULL CHECK (behavior_type IN ('positive', 'negative')),
    category VARCHAR(50) NOT NULL,
    severity VARCHAR(20) NOT NULL CHECK (severity IN ('low', 'medium', 'high')),
    description TEXT NOT NULL,
    action_taken TEXT,
    follow_up_required BOOLEAN DEFAULT FALSE,
    follow_up_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX idx_behavior_student_id ON behavior(student_id);
CREATE INDEX idx_behavior_teacher_id ON behavior(teacher_id);
CREATE INDEX idx_behavior_date ON behavior(date);
CREATE INDEX idx_behavior_type ON behavior(behavior_type);
```

---

## API Reference

### 1. Get All Behaviors
```
GET /api/behavior
Query Parameters:
  - studentId: Filter by student
  - teacherId: Filter by teacher (admin only)
  - behaviorType: Filter by type (positive/negative)
  - severity: Filter by severity (low/medium/high)
  - startDate: Filter from date
  - endDate: Filter to date

Response:
{
  "success": true,
  "totalBehaviors": 10,
  "behaviors": [
    {
      "id": "behavior-123",
      "studentId": "student-456",
      "studentName": "John Doe",
      "teacherId": "teacher-789",
      "teacherName": "Ms. Smith",
      "className": "Class 10-A",
      "date": "2026-02-20",
      "behaviorType": "negative",
      "category": "Classroom Behavior",
      "severity": "medium",
      "description": "Disrupting class",
      "actionTaken": "Verbal warning given",
      "followUpRequired": true,
      "followUpDate": "2026-02-27",
      "createdAt": "2026-02-20T10:30:00Z",
      "updatedAt": "2026-02-20T10:30:00Z"
    }
  ]
}
```

### 2. Get Behavior by ID
```
GET /api/behavior/:behaviorId

Response:
{
  "success": true,
  "behavior": { ... }
}
```

### 3. Create Behavior Record
```
POST /api/behavior
Body:
{
  "studentId": "student-456",
  "date": "2026-02-20",
  "behaviorType": "negative",
  "severity": "medium",
  "category": "Classroom Behavior",
  "description": "Disrupting class",
  "actionTaken": "Verbal warning given",
  "followUpRequired": true,
  "followUpDate": "2026-02-27"
}

Response:
{
  "success": true,
  "message": "Behavior record created successfully",
  "behavior": { ... }
}
```

### 4. Update Behavior Record
```
PUT /api/behavior/:behaviorId
Body:
{
  "severity": "high",
  "actionTaken": "Parent meeting scheduled",
  "followUpDate": "2026-02-25"
}

Response:
{
  "success": true,
  "message": "Behavior record updated successfully",
  "behavior": { ... }
}
```

### 5. Delete Behavior Record
```
DELETE /api/behavior/:behaviorId

Response:
{
  "success": true,
  "message": "Behavior record deleted successfully"
}
```

### 6. Get Student Behavior History
```
GET /api/behavior/student/:studentId
Query Parameters:
  - startDate: Filter from date
  - endDate: Filter to date
  - behaviorType: Filter by type
  - severity: Filter by severity

Response:
{
  "success": true,
  "studentId": "student-456",
  "studentName": "John Doe",
  "totalBehaviors": 5,
  "behaviors": [ ... ]
}
```

---

## Usage Guide

### For Teachers

#### Recording a Behavior Incident

1. Navigate to student profile or behavior section
2. Click "Add Behavior Record"
3. Fill in the form:
   - Select behavior type (positive/negative)
   - Choose category
   - Set severity level
   - Enter detailed description
   - Describe action taken (if any)
   - Mark if follow-up is required
   - Set follow-up date if needed
4. Click "Save"

#### Viewing Behavior Records

1. Navigate to "Behavior Records"
2. Filter by:
   - Your students
   - Date range
   - Behavior type
   - Severity
3. Click on a record to view details
4. Edit or delete your own records

### For Administrators

#### Monitoring School-Wide Behavior

1. Navigate to "Behavior Dashboard"
2. View statistics:
   - Total incidents by type
   - Severity distribution
   - Trends over time
   - Students requiring attention
3. Filter by teacher, class, or date range
4. Export reports for analysis

#### Managing Behavior Records

1. View all behavior records
2. Edit any record if needed
3. Delete inappropriate records
4. Generate reports for meetings

---

## Implementation Status

### ✅ Completed (Backend)
- Database schema designed
- API endpoints implemented
- Controllers created
- Storage layer (PostgreSQL & SQLite)
- Validation and error handling
- Role-based access control

### 🚧 Pending (Frontend)
- Behavior recording UI
- Behavior history view
- Student behavior profile
- Behavior dashboard
- Filtering and search
- Export functionality

### 📋 Migration Required
The behavior table needs to be added to your Supabase database:

```bash
# Run this migration in Supabase SQL Editor
# File: backend/database/add-behavior-interventions.sql
```

---

## Best Practices

### Recording Behaviors

1. **Be Specific**: Provide detailed descriptions
2. **Be Objective**: Focus on observable behaviors
3. **Be Timely**: Record incidents promptly
4. **Be Consistent**: Use standard categories
5. **Follow Up**: Track required follow-ups

### Data Privacy

1. Keep behavior records confidential
2. Share only with authorized personnel
3. Use for educational purposes only
4. Follow school privacy policies
5. Secure access with proper authentication

---

## Future Enhancements

- [ ] Behavior pattern analysis
- [ ] Automatic alerts for repeated incidents
- [ ] Parent notification integration
- [ ] Behavior improvement tracking
- [ ] Positive behavior rewards system
- [ ] Integration with intervention system
- [ ] Mobile app support
- [ ] Behavior analytics dashboard

---

**Last Updated**: February 24, 2026
**Status**: Backend Complete, Frontend Pending 🚧
