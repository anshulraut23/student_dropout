# Profile & Dashboard System - Complete Documentation

## Table of Contents
1. [Overview](#overview)
2. [Features](#features)
3. [Architecture](#architecture)
4. [Database Schema](#database-schema)
5. [API Reference](#api-reference)
6. [Usage Guide](#usage-guide)

---

## Overview

The Profile & Dashboard System provides comprehensive views of student performance, attendance, behavior, and interventions. It serves as the central hub for monitoring student progress and identifying at-risk students.

### Key Features
- ✅ Student profile overview
- ✅ Academic performance tracking
- ✅ Attendance summary
- ✅ Behavior history
- ✅ Active interventions
- ✅ Risk assessment
- ✅ Performance trends

---

## Features

### 1. Student Profile

#### Basic Information
- Name, enrollment number, roll number
- Class and section
- Date of birth, gender
- Parent/guardian information
- Contact details
- Current status (active/inactive)

#### Academic Overview
- Current grades by subject
- Exam performance history
- Grade trends
- Subject-wise performance
- Overall GPA/percentage

#### Attendance Summary
- Overall attendance percentage
- Subject-wise attendance (if applicable)
- Recent attendance pattern
- Absences and late arrivals
- Attendance trends

#### Behavior Summary
- Recent behavior incidents
- Positive vs. negative behaviors
- Severity distribution
- Follow-up items
- Behavior trends

#### Active Interventions
- Current intervention plans
- Intervention status
- Priority levels
- Expected outcomes
- Progress updates

### 2. Risk Assessment

#### Risk Indicators
- **Academic Risk**: Failing grades, declining performance
- **Attendance Risk**: Low attendance, frequent absences
- **Behavior Risk**: Repeated negative incidents
- **Overall Risk**: Combined assessment

#### Risk Levels
- **Low**: No significant concerns
- **Medium**: Some concerns, monitoring needed
- **High**: Serious concerns, intervention recommended
- **Critical**: Immediate action required

### 3. Dashboard Views

#### Teacher Dashboard
- My classes overview
- Students requiring attention
- Pending tasks (follow-ups, interventions)
- Recent activities
- Quick actions

#### Admin Dashboard
- School-wide statistics
- At-risk students
- Teacher workload
- System usage
- Trends and analytics

---

## Architecture

### Backend Components

```
backend/
├── controllers/
│   └── profileController.js         # Profile API handlers
├── services/
│   └── profileService.js           # Profile business logic
├── routes/
│   └── profileRoutes.js            # Route definitions
└── storage/
    └── postgresStore.js            # Data access layer
```

### Database Schema

```sql
-- Profile data is aggregated from multiple tables:
-- students, marks, attendance, behavior, interventions

-- No separate profile table needed
-- Data is computed on-demand from existing tables
```

---

## API Reference

### 1. Get Student Profile
```
GET /api/profile/student/:studentId

Response:
{
  "success": true,
  "profile": {
    "student": {
      "id": "student-123",
      "name": "John Doe",
      "enrollmentNo": "2024001",
      "rollNumber": "10",
      "classId": "class-456",
      "className": "Class 10-A",
      "dateOfBirth": "2010-05-15",
      "gender": "male",
      "fatherName": "Mr. Doe",
      "motherName": "Mrs. Doe",
      "contactNumber": "+1234567890",
      "status": "active"
    },
    "academic": {
      "currentGPA": 3.5,
      "overallPercentage": 75.5,
      "subjects": [
        {
          "subjectId": "sub-1",
          "subjectName": "Mathematics",
          "currentGrade": "B",
          "percentage": 78.5,
          "trend": "improving"
        }
      ],
      "recentExams": [ ... ]
    },
    "attendance": {
      "overallPercentage": 92.5,
      "totalDays": 120,
      "present": 111,
      "absent": 7,
      "late": 2,
      "trend": "stable",
      "subjectWise": [ ... ]
    },
    "behavior": {
      "totalIncidents": 5,
      "positive": 3,
      "negative": 2,
      "recentIncidents": [ ... ],
      "followUpsPending": 1
    },
    "interventions": {
      "active": 2,
      "completed": 1,
      "activeInterventions": [ ... ]
    },
    "riskAssessment": {
      "overallRisk": "medium",
      "academicRisk": "low",
      "attendanceRisk": "low",
      "behaviorRisk": "medium",
      "factors": [
        "Recent negative behavior incidents",
        "Academic performance stable"
      ]
    }
  }
}
```

### 2. Get Class Profiles
```
GET /api/profile/class/:classId

Response:
{
  "success": true,
  "classId": "class-456",
  "className": "Class 10-A",
  "totalStudents": 30,
  "profiles": [
    {
      "studentId": "student-123",
      "studentName": "John Doe",
      "overallPercentage": 75.5,
      "attendancePercentage": 92.5,
      "riskLevel": "medium",
      "activeInterventions": 2
    },
    ...
  ]
}
```

### 3. Get At-Risk Students
```
GET /api/profile/at-risk
Query Parameters:
  - classId: Filter by class
  - riskLevel: Filter by risk level (medium/high/critical)
  - riskType: Filter by risk type (academic/attendance/behavior)

Response:
{
  "success": true,
  "totalAtRisk": 8,
  "students": [
    {
      "studentId": "student-123",
      "studentName": "John Doe",
      "className": "Class 10-A",
      "riskLevel": "high",
      "riskFactors": [
        "Attendance below 75%",
        "Failing in 2 subjects",
        "3 negative behavior incidents"
      ],
      "recommendedActions": [
        "Schedule parent meeting",
        "Create academic intervention",
        "Monitor attendance closely"
      ]
    }
  ]
}
```

### 4. Get Performance Trends
```
GET /api/profile/student/:studentId/trends
Query Parameters:
  - period: Time period (month/quarter/year)
  - metric: Metric to track (grades/attendance/behavior)

Response:
{
  "success": true,
  "studentId": "student-123",
  "metric": "grades",
  "period": "quarter",
  "data": [
    {
      "date": "2026-01-01",
      "value": 72.5,
      "label": "Q1"
    },
    {
      "date": "2026-02-01",
      "value": 75.5,
      "label": "Q2"
    }
  ],
  "trend": "improving",
  "changePercentage": 4.1
}
```

---

## Usage Guide

### For Teachers

#### Viewing Student Profile

1. Navigate to "Students" or "My Classes"
2. Click on a student name
3. View comprehensive profile with:
   - Academic performance
   - Attendance summary
   - Behavior history
   - Active interventions
   - Risk assessment
4. Use quick actions:
   - Mark attendance
   - Record behavior
   - Create intervention
   - View detailed reports

#### Monitoring At-Risk Students

1. Navigate to "At-Risk Students"
2. View list sorted by risk level
3. Filter by:
   - Risk level
   - Risk type
   - Class
4. Click on student to view details
5. Take action:
   - Create intervention
   - Schedule meeting
   - Contact parents

### For Administrators

#### School-Wide Monitoring

1. Navigate to "Admin Dashboard"
2. View statistics:
   - Total students
   - At-risk students by level
   - Average attendance
   - Average performance
   - Active interventions
3. Drill down into specific areas
4. Generate reports

#### Performance Analytics

1. Navigate to "Analytics"
2. View trends:
   - Academic performance over time
   - Attendance patterns
   - Behavior incidents
   - Intervention effectiveness
3. Compare classes or teachers
4. Export data for analysis

---

## Risk Assessment Algorithm

### Academic Risk Calculation

```javascript
function calculateAcademicRisk(student) {
  const failingSubjects = student.subjects.filter(s => s.percentage < 40).length;
  const averagePercentage = student.overallPercentage;
  
  if (failingSubjects >= 3 || averagePercentage < 40) return 'critical';
  if (failingSubjects >= 2 || averagePercentage < 50) return 'high';
  if (failingSubjects >= 1 || averagePercentage < 60) return 'medium';
  return 'low';
}
```

### Attendance Risk Calculation

```javascript
function calculateAttendanceRisk(student) {
  const attendancePercentage = student.attendance.overallPercentage;
  
  if (attendancePercentage < 60) return 'critical';
  if (attendancePercentage < 75) return 'high';
  if (attendancePercentage < 85) return 'medium';
  return 'low';
}
```

### Behavior Risk Calculation

```javascript
function calculateBehaviorRisk(student) {
  const negativeIncidents = student.behavior.negative;
  const highSeverityIncidents = student.behavior.highSeverity;
  
  if (highSeverityIncidents >= 2 || negativeIncidents >= 5) return 'critical';
  if (highSeverityIncidents >= 1 || negativeIncidents >= 3) return 'high';
  if (negativeIncidents >= 1) return 'medium';
  return 'low';
}
```

### Overall Risk Calculation

```javascript
function calculateOverallRisk(academicRisk, attendanceRisk, behaviorRisk) {
  const riskScores = {
    'critical': 4,
    'high': 3,
    'medium': 2,
    'low': 1
  };
  
  const maxRisk = Math.max(
    riskScores[academicRisk],
    riskScores[attendanceRisk],
    riskScores[behaviorRisk]
  );
  
  return Object.keys(riskScores).find(key => riskScores[key] === maxRisk);
}
```

---

## Best Practices

### Profile Management

1. **Regular Updates**: Keep profile data current
2. **Comprehensive View**: Consider all factors
3. **Timely Action**: Respond to risk indicators
4. **Documentation**: Record all interventions
5. **Privacy**: Protect student information

### Risk Assessment

1. **Multiple Indicators**: Don't rely on single metric
2. **Context Matters**: Consider individual circumstances
3. **Early Intervention**: Act on medium risk, not just high
4. **Regular Review**: Reassess risk levels periodically
5. **Collaborative Approach**: Involve multiple stakeholders

---

## Future Enhancements

- [ ] Predictive analytics using ML
- [ ] Automated risk alerts
- [ ] Parent portal access to profiles
- [ ] Peer comparison (anonymized)
- [ ] Goal setting and tracking
- [ ] Customizable dashboards
- [ ] Mobile app support
- [ ] Integration with external systems
- [ ] Advanced reporting tools
- [ ] Real-time notifications

---

**Last Updated**: February 24, 2026
**Status**: Backend Complete, Frontend Partial ✅
