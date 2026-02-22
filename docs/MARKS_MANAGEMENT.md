# Marks Management System - Implementation Guide

## Implementation Status: ✅ ACTIVE (Integrated with Standardized Exam System)

**Last Updated:** February 22, 2026

> **📌 NOTE:** This system works with the Standardized Exam Management System documented in [EXAM_MANAGEMENT.md](EXAM_MANAGEMENT.md).
>
> **How it works:**
> - Admins create exam templates → System generates exams
> - Teachers enter marks for their assigned subjects only
> - System auto-calculates percentage, grade, and pass/fail status
> - Consistent data structure for dropout prediction ML models

---

## Table of Contents
1. [Overview](#overview)
2. [Current Implementation](#current-implementation)
3. [Database Schema](#database-schema)
4. [Features](#features)
5. [API Endpoints](#api-endpoints)
6. [User Workflows](#user-workflows)
7. [Validation Rules](#validation-rules)
8. [Grading System](#grading-system)
9. [Integration with Exam System](#integration-with-exam-system)

---

## Overview

The Marks Management System handles all aspects of marks entry, grade calculation, and performance tracking. It integrates seamlessly with the standardized exam system to ensure data consistency.

### Key Objectives
- Streamline marks entry process
- Auto-calculate percentage and grades
- Track student performance over time
- Provide data for dropout prediction
- Support bulk marks entry
- Generate performance reports

### Scope
- ✅ Marks entry (individual and bulk)
- ✅ Grade calculation and assignment
- ✅ Performance analytics
- ✅ Student-wise reports
- ✅ Class-wise reports
- ✅ Subject-wise reports
- ✅ Export functionality

---

## Current Implementation

### What's Implemented

#### Backend (100% Complete)
- ✅ Marks table in database
- ✅ CRUD operations in `sqliteStore.js`
- ✅ Services: `marksService.js` with grade calculation
- ✅ Controllers: `marksController.js`
- ✅ Routes: `/api/marks`
- ✅ Validation: marks range, student verification
- ✅ Auto-calculation: percentage, grade, pass/fail

#### Frontend (100% Complete)
- ✅ Teacher UI: `ScoresTab.jsx` for marks entry
- ✅ Exam filtering: Shows only teacher's subjects
- ✅ Student list: Auto-loaded from class
- ✅ Real-time calculation: Percentage, grade, status
- ✅ Bulk save: Save all marks at once
- ✅ Validation: Client-side and server-side

### How It Works

1. **Teacher selects exam** (filtered to their subjects)
2. **System loads students** from exam's class
3. **Teacher enters marks** for each student
4. **System auto-calculates** percentage, grade, pass/fail
5. **Teacher saves** all marks at once
6. **Data stored** for analytics and reports

---

## System Architecture

### Component Structure

```
Backend:
├── controllers/
│   ├── examController.js          # Exam CRUD operations
│   ├── marksController.js         # Marks entry and management
│   └── performanceController.js   # Analytics and reports
├── services/
│   ├── examService.js             # Exam business logic
│   ├── marksService.js            # Marks calculations
│   ├── gradingService.js          # Grade assignment logic
│   └── performanceCalculator.js   # Statistics calculations
├── utils/
│   ├── examValidators.js          # Exam validation
│   ├── marksValidators.js         # Marks validation
│   └── gradeCalculators.js        # Grade computation
└── routes/
    ├── examRoutes.js              # Exam endpoints
    ├── marksRoutes.js             # Marks endpoints
    └── performanceRoutes.js       # Analytics endpoints

Frontend:
├── pages/
│   ├── admin/
│   │   ├── ExamManagementPage.jsx
│   │   └── PerformanceReportsPage.jsx
│   └── teacher/
│       ├── MarksEntryPage.jsx
│       └── StudentPerformancePage.jsx
├── components/
│   ├── exams/
│   │   ├── ExamForm.jsx
│   │   ├── ExamList.jsx
│   │   └── ExamDetails.jsx
│   ├── marks/
│   │   ├── MarksEntryForm.jsx
│   │   ├── BulkUploadModal.jsx
│   │   └── MarksTable.jsx
│   └── reports/
│       ├── PerformanceChart.jsx
│       ├── GradeDistribution.jsx
│       └── TrendAnalysis.jsx
└── services/
    ├── examService.js
    ├── marksService.js
    └── performanceService.js
```

---

## Database Schema

### Exams Table
```sql
CREATE TABLE exams (
  id TEXT PRIMARY KEY,
  schoolId TEXT NOT NULL,
  name TEXT NOT NULL,
  type TEXT NOT NULL,              -- 'unit_test', 'midterm', 'final', 'assignment', 'project', 'practical'
  classId TEXT NOT NULL,
  subjectId TEXT NOT NULL,
  totalMarks INTEGER NOT NULL,
  passingMarks INTEGER NOT NULL,
  weightage REAL DEFAULT 1.0,      -- For weighted average calculation
  examDate TEXT NOT NULL,
  duration INTEGER,                 -- in minutes
  instructions TEXT,
  syllabusTopics TEXT,              -- JSON array of topics
  createdBy TEXT NOT NULL,
  status TEXT DEFAULT 'scheduled',  -- 'scheduled', 'ongoing', 'completed', 'cancelled'
  createdAt TEXT NOT NULL,
  updatedAt TEXT NOT NULL,
  
  FOREIGN KEY (schoolId) REFERENCES schools(id),
  FOREIGN KEY (classId) REFERENCES classes(id),
  FOREIGN KEY (subjectId) REFERENCES subjects(id),
  FOREIGN KEY (createdBy) REFERENCES users(id)
);

CREATE INDEX idx_exams_school ON exams(schoolId);
CREATE INDEX idx_exams_class ON exams(classId);
CREATE INDEX idx_exams_subject ON exams(subjectId);
CREATE INDEX idx_exams_date ON exams(examDate);
CREATE INDEX idx_exams_status ON exams(status);
```

### Marks Table
```sql
CREATE TABLE marks (
  id TEXT PRIMARY KEY,
  examId TEXT NOT NULL,
  studentId TEXT NOT NULL,
  marksObtained REAL NOT NULL,
  grade TEXT,                       -- 'A+', 'A', 'B+', 'B', 'C', 'D', 'F'
  gradePoint REAL,                  -- GPA: 4.0, 3.7, 3.3, etc.
  percentage REAL,
  status TEXT DEFAULT 'present',    -- 'present', 'absent', 'exempted'
  remarks TEXT,
  enteredBy TEXT NOT NULL,
  enteredAt TEXT NOT NULL,
  updatedBy TEXT,
  updatedAt TEXT,
  verifiedBy TEXT,
  verifiedAt TEXT,
  
  FOREIGN KEY (examId) REFERENCES exams(id),
  FOREIGN KEY (studentId) REFERENCES students(id),
  FOREIGN KEY (enteredBy) REFERENCES users(id),
  
  UNIQUE(examId, studentId)
);

CREATE INDEX idx_marks_exam ON marks(examId);
CREATE INDEX idx_marks_student ON marks(studentId);
CREATE INDEX idx_marks_grade ON marks(grade);
```

### Grade Configuration Table
```sql
CREATE TABLE grade_config (
  id TEXT PRIMARY KEY,
  schoolId TEXT NOT NULL,
  name TEXT NOT NULL,               -- 'Default', 'CBSE', 'ICSE', 'Custom'
  isDefault BOOLEAN DEFAULT 0,
  grades TEXT NOT NULL,             -- JSON array of grade definitions
  createdAt TEXT NOT NULL,
  updatedAt TEXT NOT NULL,
  
  FOREIGN KEY (schoolId) REFERENCES schools(id)
);

-- Example grades JSON:
-- [
--   { "grade": "A+", "minPercentage": 90, "maxPercentage": 100, "gradePoint": 4.0, "description": "Outstanding" },
--   { "grade": "A", "minPercentage": 80, "maxPercentage": 89, "gradePoint": 3.7, "description": "Excellent" },
--   { "grade": "B+", "minPercentage": 70, "maxPercentage": 79, "gradePoint": 3.3, "description": "Very Good" },
--   { "grade": "B", "minPercentage": 60, "maxPercentage": 69, "gradePoint": 3.0, "description": "Good" },
--   { "grade": "C", "minPercentage": 50, "maxPercentage": 59, "gradePoint": 2.0, "description": "Average" },
--   { "grade": "D", "minPercentage": 40, "maxPercentage": 49, "gradePoint": 1.0, "description": "Pass" },
--   { "grade": "F", "minPercentage": 0, "maxPercentage": 39, "gradePoint": 0.0, "description": "Fail" }
-- ]
```

### Performance Summary Table (Materialized View)
```sql
CREATE TABLE performance_summary (
  id TEXT PRIMARY KEY,
  studentId TEXT NOT NULL,
  classId TEXT NOT NULL,
  subjectId TEXT NOT NULL,
  academicYear TEXT NOT NULL,
  totalExams INTEGER DEFAULT 0,
  examsAppeared INTEGER DEFAULT 0,
  totalMarks REAL DEFAULT 0,
  marksObtained REAL DEFAULT 0,
  averagePercentage REAL DEFAULT 0,
  averageGradePoint REAL DEFAULT 0,
  overallGrade TEXT,
  rank INTEGER,
  lastUpdated TEXT NOT NULL,
  
  FOREIGN KEY (studentId) REFERENCES students(id),
  FOREIGN KEY (classId) REFERENCES classes(id),
  FOREIGN KEY (subjectId) REFERENCES subjects(id),
  
  UNIQUE(studentId, subjectId, academicYear)
);

CREATE INDEX idx_perf_student ON performance_summary(studentId);
CREATE INDEX idx_perf_class ON performance_summary(classId);
CREATE INDEX idx_perf_subject ON performance_summary(subjectId);
```


---

## Features & Requirements

### 1. Exam Management

#### 1.1 Exam Types
- **Unit Test**: Regular class tests
- **Midterm**: Mid-semester exams
- **Final**: End-semester exams
- **Assignment**: Take-home assignments
- **Project**: Long-term projects
- **Practical**: Lab/practical exams
- **Quiz**: Short quizzes
- **Oral**: Viva/oral examinations

#### 1.2 Exam Creation
- Create exam with all details
- Set total marks and passing marks
- Define exam date and duration
- Add instructions and syllabus topics
- Set weightage for final grade calculation
- Schedule multiple exams
- Copy exam from previous term

#### 1.3 Exam Management
- View all exams (filterable by class, subject, type, date)
- Edit exam details (before marks entry)
- Cancel exams
- Mark exam as completed
- View exam statistics
- Export exam details

### 2. Marks Entry

#### 2.1 Individual Entry
- Enter marks for one student at a time
- Real-time validation
- Auto-calculate percentage and grade
- Add remarks for individual students
- Mark student as absent/exempted
- Save and continue to next student

#### 2.2 Bulk Entry (Table View)
- View all students in a table
- Enter marks for all students at once
- Quick navigation (Tab key, Enter key)
- Auto-save on blur
- Highlight validation errors
- Show running statistics (average, highest, lowest)

#### 2.3 Bulk Upload (CSV/Excel)
- Download template with student list
- Upload filled template
- Validate data before import
- Show preview with errors
- Confirm and import
- Rollback on errors

#### 2.4 Marks Verification
- Teacher enters marks
- Admin/HOD verifies marks
- Verification workflow
- Lock marks after verification
- Audit trail of changes

### 3. Grading System

#### 3.1 Grade Configuration
- Define custom grading scales
- Set percentage ranges for each grade
- Assign grade points (GPA)
- Multiple grading systems per school
- Default grading system

#### 3.2 Grade Calculation
- Auto-calculate grade based on percentage
- Support for absolute grading
- Support for relative grading (curve)
- Weighted average calculation
- GPA calculation

#### 3.3 Grade Types
- Letter grades (A+, A, B+, B, C, D, F)
- Numeric grades (1-10, 1-100)
- Descriptive grades (Outstanding, Excellent, Good, etc.)
- Pass/Fail
- Custom grades

### 4. Performance Analytics

#### 4.1 Student-Wise Reports
- Individual student performance
- Subject-wise breakdown
- Exam-wise breakdown
- Trend analysis over time
- Comparison with class average
- Strengths and weaknesses
- Improvement suggestions

#### 4.2 Class-Wise Reports
- Class performance summary
- Subject-wise analysis
- Grade distribution
- Pass/fail statistics
- Top performers
- Students needing attention
- Comparison with other classes

#### 4.3 Subject-Wise Reports
- Subject performance across classes
- Topic-wise analysis
- Difficulty level assessment
- Teacher effectiveness
- Improvement areas

#### 4.4 Comparative Analysis
- Student vs class average
- Class vs school average
- Current vs previous performance
- Subject-wise comparison
- Trend analysis

### 5. Reports & Exports

#### 5.1 Report Types
- Mark sheets (individual)
- Progress reports
- Report cards
- Rank lists
- Grade sheets
- Performance certificates

#### 5.2 Export Formats
- PDF (formatted reports)
- Excel (data analysis)
- CSV (data export)
- Print-friendly format

#### 5.3 Report Customization
- Select data fields
- Choose date range
- Filter by criteria
- Add school logo
- Custom headers/footers

---

## API Endpoints

### Exam Management Endpoints

#### Create Exam
```
POST /api/exams
Authorization: Bearer <admin/teacher-token>

Request Body:
{
  "name": "Mathematics Midterm Exam",
  "type": "midterm",
  "classId": "class-123",
  "subjectId": "subject-456",
  "totalMarks": 100,
  "passingMarks": 40,
  "weightage": 1.5,
  "examDate": "2026-03-15",
  "duration": 180,
  "instructions": "Answer all questions. Use of calculator is allowed.",
  "syllabusTopics": ["Algebra", "Geometry", "Trigonometry"]
}

Response:
{
  "success": true,
  "message": "Exam created successfully",
  "exam": {
    "id": "exam-789",
    "name": "Mathematics Midterm Exam",
    "status": "scheduled",
    ...
  }
}
```

#### Get All Exams
```
GET /api/exams?classId=class-123&subjectId=subject-456&type=midterm&status=scheduled
Authorization: Bearer <token>

Response:
{
  "success": true,
  "exams": [
    {
      "id": "exam-789",
      "name": "Mathematics Midterm Exam",
      "type": "midterm",
      "className": "Class 10-A",
      "subjectName": "Mathematics",
      "examDate": "2026-03-15",
      "totalMarks": 100,
      "status": "scheduled",
      "marksEntered": 25,
      "totalStudents": 30
    }
  ]
}
```

#### Get Exam Details
```
GET /api/exams/:examId
Authorization: Bearer <token>

Response:
{
  "success": true,
  "exam": {
    "id": "exam-789",
    "name": "Mathematics Midterm Exam",
    "type": "midterm",
    "classId": "class-123",
    "className": "Class 10-A",
    "subjectId": "subject-456",
    "subjectName": "Mathematics",
    "totalMarks": 100,
    "passingMarks": 40,
    "weightage": 1.5,
    "examDate": "2026-03-15",
    "duration": 180,
    "instructions": "...",
    "syllabusTopics": [...],
    "status": "scheduled",
    "statistics": {
      "totalStudents": 30,
      "marksEntered": 25,
      "pending": 5,
      "averageMarks": 72.5,
      "highestMarks": 95,
      "lowestMarks": 45,
      "passCount": 23,
      "failCount": 2
    }
  }
}
```

#### Update Exam
```
PUT /api/exams/:examId
Authorization: Bearer <admin/teacher-token>

Request Body:
{
  "name": "Mathematics Midterm Exam - Updated",
  "examDate": "2026-03-16",
  "totalMarks": 100
}

Response:
{
  "success": true,
  "message": "Exam updated successfully",
  "exam": { ... }
}
```

#### Delete Exam
```
DELETE /api/exams/:examId
Authorization: Bearer <admin-token>

Response:
{
  "success": true,
  "message": "Exam deleted successfully"
}
```

#### Change Exam Status
```
POST /api/exams/:examId/status
Authorization: Bearer <admin/teacher-token>

Request Body:
{
  "status": "completed"
}

Response:
{
  "success": true,
  "message": "Exam status updated to completed"
}
```

### Marks Entry Endpoints

#### Enter Single Student Marks
```
POST /api/marks
Authorization: Bearer <teacher-token>

Request Body:
{
  "examId": "exam-789",
  "studentId": "student-123",
  "marksObtained": 85,
  "status": "present",
  "remarks": "Excellent performance"
}

Response:
{
  "success": true,
  "message": "Marks entered successfully",
  "marks": {
    "id": "marks-456",
    "examId": "exam-789",
    "studentId": "student-123",
    "marksObtained": 85,
    "percentage": 85.0,
    "grade": "A",
    "gradePoint": 3.7,
    "status": "present"
  }
}
```

#### Enter Bulk Marks
```
POST /api/marks/bulk
Authorization: Bearer <teacher-token>

Request Body:
{
  "examId": "exam-789",
  "marks": [
    {
      "studentId": "student-123",
      "marksObtained": 85,
      "status": "present"
    },
    {
      "studentId": "student-124",
      "marksObtained": 72,
      "status": "present"
    },
    {
      "studentId": "student-125",
      "status": "absent"
    }
  ]
}

Response:
{
  "success": true,
  "message": "Bulk marks entered: 30 successful, 0 failed",
  "entered": 30,
  "failed": 0,
  "records": [...],
  "errors": []
}
```

#### Get Marks for Exam
```
GET /api/marks/exam/:examId
Authorization: Bearer <token>

Response:
{
  "success": true,
  "exam": {
    "id": "exam-789",
    "name": "Mathematics Midterm Exam",
    "totalMarks": 100
  },
  "marks": [
    {
      "id": "marks-456",
      "studentId": "student-123",
      "studentName": "John Smith",
      "enrollmentNo": "2024001",
      "marksObtained": 85,
      "percentage": 85.0,
      "grade": "A",
      "status": "present",
      "enteredAt": "2026-03-16T10:30:00Z"
    }
  ],
  "statistics": {
    "totalStudents": 30,
    "marksEntered": 30,
    "averageMarks": 72.5,
    "averagePercentage": 72.5,
    "highestMarks": 95,
    "lowestMarks": 45,
    "passCount": 28,
    "failCount": 2,
    "absentCount": 0
  }
}
```

#### Get Student Marks
```
GET /api/marks/student/:studentId?subjectId=subject-456&startDate=2026-01-01&endDate=2026-06-30
Authorization: Bearer <token>

Response:
{
  "success": true,
  "student": {
    "id": "student-123",
    "name": "John Smith",
    "enrollmentNo": "2024001",
    "className": "Class 10-A"
  },
  "marks": [
    {
      "examId": "exam-789",
      "examName": "Mathematics Midterm Exam",
      "examType": "midterm",
      "examDate": "2026-03-15",
      "subjectName": "Mathematics",
      "totalMarks": 100,
      "marksObtained": 85,
      "percentage": 85.0,
      "grade": "A",
      "gradePoint": 3.7
    }
  ],
  "summary": {
    "totalExams": 5,
    "examsAppeared": 5,
    "averagePercentage": 82.5,
    "averageGradePoint": 3.6,
    "overallGrade": "A"
  }
}
```

#### Update Marks
```
PUT /api/marks/:marksId
Authorization: Bearer <teacher-token>

Request Body:
{
  "marksObtained": 87,
  "remarks": "Updated after re-evaluation"
}

Response:
{
  "success": true,
  "message": "Marks updated successfully",
  "marks": { ... }
}
```

#### Delete Marks
```
DELETE /api/marks/:marksId
Authorization: Bearer <admin-token>

Response:
{
  "success": true,
  "message": "Marks deleted successfully"
}
```

#### Verify Marks
```
POST /api/marks/:marksId/verify
Authorization: Bearer <admin-token>

Response:
{
  "success": true,
  "message": "Marks verified successfully",
  "marks": {
    "id": "marks-456",
    "verifiedBy": "admin-123",
    "verifiedAt": "2026-03-17T14:00:00Z"
  }
}
```

### Performance Analytics Endpoints

#### Get Student Performance
```
GET /api/performance/student/:studentId?academicYear=2025-2026
Authorization: Bearer <token>

Response:
{
  "success": true,
  "student": { ... },
  "performance": {
    "overallSummary": {
      "totalExams": 20,
      "examsAppeared": 19,
      "averagePercentage": 78.5,
      "averageGPA": 3.4,
      "overallGrade": "B+",
      "classRank": 5,
      "totalStudents": 30
    },
    "subjectWise": [
      {
        "subjectId": "subject-456",
        "subjectName": "Mathematics",
        "exams": 5,
        "averagePercentage": 82.0,
        "averageGPA": 3.6,
        "grade": "A",
        "trend": "improving"
      }
    ],
    "examTypeWise": [
      {
        "type": "unit_test",
        "exams": 8,
        "averagePercentage": 75.0
      },
      {
        "type": "midterm",
        "exams": 2,
        "averagePercentage": 85.0
      }
    ],
    "trends": {
      "monthlyAverage": [
        { "month": "2026-01", "average": 75.0 },
        { "month": "2026-02", "average": 78.0 },
        { "month": "2026-03", "average": 82.0 }
      ]
    }
  }
}
```

#### Get Class Performance
```
GET /api/performance/class/:classId?subjectId=subject-456&academicYear=2025-2026
Authorization: Bearer <token>

Response:
{
  "success": true,
  "class": { ... },
  "performance": {
    "overallSummary": {
      "totalStudents": 30,
      "totalExams": 5,
      "classAverage": 72.5,
      "highestAverage": 92.0,
      "lowestAverage": 45.0,
      "passPercentage": 93.3
    },
    "gradeDistribution": [
      { "grade": "A+", "count": 5, "percentage": 16.7 },
      { "grade": "A", "count": 8, "percentage": 26.7 },
      { "grade": "B+", "count": 10, "percentage": 33.3 },
      { "grade": "B", "count": 5, "percentage": 16.7 },
      { "grade": "C", "count": 2, "percentage": 6.7 }
    ],
    "topPerformers": [
      {
        "studentId": "student-123",
        "studentName": "John Smith",
        "averagePercentage": 92.0,
        "rank": 1
      }
    ],
    "needsAttention": [
      {
        "studentId": "student-456",
        "studentName": "Jane Doe",
        "averagePercentage": 45.0,
        "failedExams": 3
      }
    ]
  }
}
```

#### Get Subject Performance
```
GET /api/performance/subject/:subjectId?academicYear=2025-2026
Authorization: Bearer <token>

Response:
{
  "success": true,
  "subject": { ... },
  "performance": {
    "overallSummary": {
      "totalClasses": 4,
      "totalStudents": 120,
      "totalExams": 20,
      "averagePercentage": 68.5,
      "passPercentage": 85.0
    },
    "classWise": [
      {
        "classId": "class-123",
        "className": "Class 10-A",
        "students": 30,
        "averagePercentage": 72.5,
        "passPercentage": 93.3
      }
    ],
    "examWise": [
      {
        "examId": "exam-789",
        "examName": "Midterm Exam",
        "averagePercentage": 75.0,
        "difficulty": "medium"
      }
    ]
  }
}
```

#### Generate Report Card
```
POST /api/performance/report-card
Authorization: Bearer <token>

Request Body:
{
  "studentId": "student-123",
  "academicYear": "2025-2026",
  "term": "midterm",
  "format": "pdf"
}

Response:
{
  "success": true,
  "reportCard": {
    "url": "/downloads/report-card-student-123.pdf",
    "generatedAt": "2026-03-20T10:00:00Z"
  }
}
```


---

## User Flows

### Flow 1: Creating an Exam

**Actor**: Admin or Teacher

1. Navigate to "Exams" section
2. Click "Create Exam" button
3. Fill exam details form:
   - Select class
   - Select subject
   - Enter exam name
   - Select exam type
   - Set total marks
   - Set passing marks
   - Set weightage (optional)
   - Select exam date
   - Set duration
   - Add instructions (optional)
   - Add syllabus topics (optional)
4. Click "Save"
5. System validates data
6. System creates exam
7. System shows success message
8. Exam appears in exam list

**Validation**:
- All required fields must be filled
- Exam date cannot be in the past
- Total marks must be greater than 0
- Passing marks must be less than total marks
- Duration must be positive number

### Flow 2: Entering Marks (Individual)

**Actor**: Teacher

1. Navigate to "Marks Entry" section
2. Select exam from dropdown
3. System loads student list
4. For each student:
   - Enter marks obtained
   - System auto-calculates percentage
   - System auto-assigns grade
   - Add remarks (optional)
   - Mark as absent if applicable
5. Click "Save"
6. System validates marks
7. System saves marks
8. System shows success message
9. Move to next student or finish

**Validation**:
- Marks cannot exceed total marks
- Marks cannot be negative
- Marks must be numeric
- Cannot enter marks for absent students

### Flow 3: Entering Marks (Bulk Table View)

**Actor**: Teacher

1. Navigate to "Marks Entry" section
2. Select exam from dropdown
3. Click "Bulk Entry" tab
4. System shows table with all students
5. Enter marks for each student in table
6. Use Tab/Enter to navigate
7. System validates on blur
8. System shows validation errors inline
9. System auto-saves valid entries
10. Click "Submit All" when done
11. System shows summary (success/failed)

**Features**:
- Real-time validation
- Auto-save on blur
- Keyboard navigation
- Running statistics display
- Highlight errors in red
- Show success in green

### Flow 4: Bulk Upload via CSV/Excel

**Actor**: Teacher

1. Navigate to "Marks Entry" section
2. Select exam from dropdown
3. Click "Bulk Upload" button
4. Click "Download Template"
5. System generates Excel with student list
6. Teacher fills marks in Excel
7. Teacher uploads filled file
8. System validates file:
   - Check file format
   - Validate column headers
   - Validate data types
   - Check for missing students
   - Validate marks range
9. System shows preview with errors
10. Teacher fixes errors and re-uploads OR
11. Teacher confirms import
12. System imports valid records
13. System shows summary:
    - Total records
    - Successful imports
    - Failed imports
    - Error details

**Template Format**:
```
Enrollment No | Student Name | Marks Obtained | Status | Remarks
2024001      | John Smith   | 85            | present | Good work
2024002      | Jane Doe     | 72            | present |
2024003      | Bob Johnson  | 0             | absent  | Medical leave
```

### Flow 5: Viewing Student Performance

**Actor**: Teacher, Admin, or Parent (future)

1. Navigate to "Performance" section
2. Select student from dropdown
3. Select academic year
4. System loads performance data
5. System displays:
   - Overall summary
   - Subject-wise performance
   - Exam-wise details
   - Grade distribution
   - Trend charts
   - Comparison with class average
6. User can:
   - Filter by subject
   - Filter by exam type
   - Filter by date range
   - Export to PDF/Excel
   - Print report

### Flow 6: Generating Report Card

**Actor**: Admin or Teacher

1. Navigate to "Reports" section
2. Select "Report Card" option
3. Select student
4. Select academic year
5. Select term (midterm/final)
6. Select format (PDF/Excel)
7. Click "Generate"
8. System:
   - Fetches all exam data
   - Calculates averages
   - Assigns grades
   - Calculates rank
   - Generates formatted report
9. System shows download link
10. User downloads report

### Flow 7: Verifying Marks

**Actor**: Admin or HOD

1. Navigate to "Marks Verification" section
2. System shows list of unverified marks
3. Filter by class/subject/exam
4. Select marks to verify
5. Review marks details
6. Click "Verify" or "Reject"
7. If reject: Add comments
8. System updates verification status
9. System locks verified marks
10. System sends notification to teacher

---

## Validation Rules

### Exam Validation

#### Required Fields
- Name
- Type
- Class ID
- Subject ID
- Total marks
- Passing marks
- Exam date

#### Business Rules
- Exam date cannot be more than 1 year in the past
- Exam date cannot be more than 1 year in the future
- Total marks must be between 1 and 1000
- Passing marks must be between 1 and total marks
- Passing marks typically 40% of total marks
- Weightage must be between 0.1 and 5.0
- Duration must be between 15 and 300 minutes

#### Constraints
- Cannot delete exam if marks are entered
- Cannot edit total marks after marks entry
- Cannot change class/subject after creation
- Cannot schedule two exams for same class/subject on same date

### Marks Validation

#### Required Fields
- Exam ID
- Student ID
- Marks obtained (if status is 'present')
- Status

#### Business Rules
- Marks obtained must be between 0 and total marks
- Marks can have up to 2 decimal places
- Cannot enter marks for absent students
- Cannot enter negative marks
- Marks for exempted students set to 0
- Percentage = (marks obtained / total marks) * 100
- Grade assigned based on percentage and grade config

#### Constraints
- Cannot enter marks twice for same student-exam
- Cannot modify marks after verification (admin only)
- Cannot delete marks after verification
- Student must belong to exam's class
- Exam must exist and not be cancelled

### Bulk Upload Validation

#### File Validation
- File format must be CSV or Excel (.xlsx, .xls)
- File size must be less than 5MB
- Must have required columns
- Column headers must match template

#### Data Validation
- Enrollment number must exist
- Enrollment number must belong to exam's class
- Marks must be numeric
- Marks must be within valid range
- Status must be 'present', 'absent', or 'exempted'
- No duplicate enrollment numbers
- All students in class must be present in file

#### Error Handling
- Show row number for each error
- Show specific error message
- Allow partial import (skip errors)
- Provide error summary
- Allow download of error report

---

## Bulk Upload System

### Template Generation

#### Process
1. Get exam details
2. Get all students in exam's class
3. Generate Excel/CSV with columns:
   - Enrollment No (pre-filled, read-only)
   - Student Name (pre-filled, read-only)
   - Marks Obtained (empty, editable)
   - Status (default: 'present', dropdown)
   - Remarks (empty, optional)
4. Add data validation:
   - Marks: numeric, 0 to total marks
   - Status: dropdown (present, absent, exempted)
5. Format cells:
   - Header row: bold, colored background
   - Read-only cells: gray background
   - Editable cells: white background
6. Add instructions sheet
7. Generate file

#### Template Features
- Pre-filled student data
- Data validation rules
- Conditional formatting
- Instructions included
- Example rows
- Error prevention

### Upload Processing

#### Step 1: File Validation
```javascript
validateFile(file) {
  // Check file type
  if (!['csv', 'xlsx', 'xls'].includes(fileExtension)) {
    throw new Error('Invalid file format');
  }
  
  // Check file size
  if (fileSize > 5 * 1024 * 1024) {
    throw new Error('File size exceeds 5MB');
  }
  
  return true;
}
```

#### Step 2: Parse File
```javascript
parseFile(file) {
  const workbook = XLSX.read(file);
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const data = XLSX.utils.sheet_to_json(sheet);
  
  return data;
}
```

#### Step 3: Validate Data
```javascript
validateData(data, exam, students) {
  const errors = [];
  const validRecords = [];
  
  data.forEach((row, index) => {
    const rowErrors = [];
    
    // Validate enrollment number
    const student = students.find(s => s.enrollmentNo === row['Enrollment No']);
    if (!student) {
      rowErrors.push(`Row ${index + 2}: Student not found`);
    }
    
    // Validate marks
    if (row.Status === 'present') {
      const marks = parseFloat(row['Marks Obtained']);
      if (isNaN(marks)) {
        rowErrors.push(`Row ${index + 2}: Invalid marks`);
      } else if (marks < 0 || marks > exam.totalMarks) {
        rowErrors.push(`Row ${index + 2}: Marks out of range`);
      }
    }
    
    // Validate status
    if (!['present', 'absent', 'exempted'].includes(row.Status)) {
      rowErrors.push(`Row ${index + 2}: Invalid status`);
    }
    
    if (rowErrors.length > 0) {
      errors.push(...rowErrors);
    } else {
      validRecords.push({
        studentId: student.id,
        marksObtained: row.Status === 'present' ? parseFloat(row['Marks Obtained']) : 0,
        status: row.Status,
        remarks: row.Remarks || null
      });
    }
  });
  
  return { validRecords, errors };
}
```

#### Step 4: Preview
- Show total records
- Show valid records count
- Show error records count
- Display errors with row numbers
- Allow user to:
  - Fix errors and re-upload
  - Import valid records only
  - Cancel import

#### Step 5: Import
```javascript
async importMarks(examId, validRecords, userId) {
  const results = {
    imported: 0,
    failed: 0,
    errors: []
  };
  
  for (const record of validRecords) {
    try {
      await marksService.enterMarks({
        examId,
        ...record,
        enteredBy: userId
      });
      results.imported++;
    } catch (error) {
      results.failed++;
      results.errors.push({
        studentId: record.studentId,
        error: error.message
      });
    }
  }
  
  return results;
}
```

### Error Handling

#### Common Errors
1. **File Format Error**
   - Message: "Invalid file format. Please upload CSV or Excel file."
   - Action: Show supported formats

2. **Missing Columns**
   - Message: "Required columns missing: Enrollment No, Marks Obtained"
   - Action: Show template download link

3. **Invalid Marks**
   - Message: "Row 5: Marks 105 exceeds total marks 100"
   - Action: Highlight row in preview

4. **Student Not Found**
   - Message: "Row 3: Student with enrollment no 2024999 not found"
   - Action: Show valid enrollment numbers

5. **Duplicate Entry**
   - Message: "Row 8: Marks already entered for this student"
   - Action: Offer to update existing marks

#### Error Report
- Generate Excel with errors
- Include row numbers
- Include error messages
- Include original data
- Allow download

---

## Grading System

### Grade Configuration

#### Default Grading System (CBSE-style)
```json
{
  "name": "CBSE Grading",
  "grades": [
    {
      "grade": "A+",
      "minPercentage": 91,
      "maxPercentage": 100,
      "gradePoint": 10.0,
      "description": "Outstanding"
    },
    {
      "grade": "A",
      "minPercentage": 81,
      "maxPercentage": 90,
      "gradePoint": 9.0,
      "description": "Excellent"
    },
    {
      "grade": "B+",
      "minPercentage": 71,
      "maxPercentage": 80,
      "gradePoint": 8.0,
      "description": "Very Good"
    },
    {
      "grade": "B",
      "minPercentage": 61,
      "maxPercentage": 70,
      "gradePoint": 7.0,
      "description": "Good"
    },
    {
      "grade": "C+",
      "minPercentage": 51,
      "maxPercentage": 60,
      "gradePoint": 6.0,
      "description": "Satisfactory"
    },
    {
      "grade": "C",
      "minPercentage": 41,
      "maxPercentage": 50,
      "gradePoint": 5.0,
      "description": "Adequate"
    },
    {
      "grade": "D",
      "minPercentage": 33,
      "maxPercentage": 40,
      "gradePoint": 4.0,
      "description": "Pass"
    },
    {
      "grade": "E",
      "minPercentage": 0,
      "maxPercentage": 32,
      "gradePoint": 0.0,
      "description": "Fail"
    }
  ]
}
```

#### Custom Grading System
Schools can create custom grading systems:
- Define grade labels
- Set percentage ranges
- Assign grade points
- Set descriptions
- Mark as default

### Grade Calculation

#### Absolute Grading
```javascript
calculateGrade(percentage, gradeConfig) {
  for (const gradeRule of gradeConfig.grades) {
    if (percentage >= gradeRule.minPercentage && 
        percentage <= gradeRule.maxPercentage) {
      return {
        grade: gradeRule.grade,
        gradePoint: gradeRule.gradePoint,
        description: gradeRule.description
      };
    }
  }
  return null;
}
```

#### Relative Grading (Curve)
```javascript
calculateRelativeGrade(marks, allMarks, gradeConfig) {
  // Calculate percentile
  const sortedMarks = allMarks.sort((a, b) => b - a);
  const rank = sortedMarks.indexOf(marks) + 1;
  const percentile = ((sortedMarks.length - rank + 1) / sortedMarks.length) * 100;
  
  // Assign grade based on percentile
  if (percentile >= 90) return 'A+';
  if (percentile >= 80) return 'A';
  if (percentile >= 70) return 'B+';
  if (percentile >= 60) return 'B';
  if (percentile >= 50) return 'C';
  if (percentile >= 40) return 'D';
  return 'F';
}
```

### GPA Calculation

#### Subject GPA
```javascript
calculateSubjectGPA(exams) {
  let totalWeightedGP = 0;
  let totalWeight = 0;
  
  exams.forEach(exam => {
    const weight = exam.weightage || 1.0;
    totalWeightedGP += exam.gradePoint * weight;
    totalWeight += weight;
  });
  
  return totalWeightedGP / totalWeight;
}
```

#### Overall GPA
```javascript
calculateOverallGPA(subjects) {
  let totalGP = 0;
  let totalSubjects = 0;
  
  subjects.forEach(subject => {
    if (subject.gpa !== null) {
      totalGP += subject.gpa;
      totalSubjects++;
    }
  });
  
  return totalSubjects > 0 ? totalGP / totalSubjects : 0;
}
```

### Weighted Average

#### Calculation
```javascript
calculateWeightedAverage(exams) {
  let totalWeightedMarks = 0;
  let totalWeightedTotal = 0;
  
  exams.forEach(exam => {
    const weight = exam.weightage || 1.0;
    totalWeightedMarks += (exam.marksObtained / exam.totalMarks) * 100 * weight;
    totalWeightedTotal += weight;
  });
  
  return totalWeightedMarks / totalWeightedTotal;
}
```

#### Example
```
Unit Test 1: 80/100, weightage: 0.5
Unit Test 2: 85/100, weightage: 0.5
Midterm: 90/100, weightage: 1.5
Final: 95/100, weightage: 2.0

Weighted Average = (80*0.5 + 85*0.5 + 90*1.5 + 95*2.0) / (0.5 + 0.5 + 1.5 + 2.0)
                 = (40 + 42.5 + 135 + 190) / 4.5
                 = 407.5 / 4.5
                 = 90.56%
```


---

## Reports & Analytics

### Student Performance Report

#### Components
1. **Header Section**
   - Student name, photo
   - Enrollment number
   - Class, section
   - Academic year
   - Report generation date

2. **Overall Summary**
   - Total exams conducted
   - Exams appeared
   - Overall percentage
   - Overall GPA
   - Overall grade
   - Class rank
   - Attendance percentage

3. **Subject-Wise Performance**
   - Subject name
   - Number of exams
   - Marks obtained / Total marks
   - Percentage
   - Grade
   - GPA
   - Rank in subject

4. **Exam-Wise Details**
   - Exam name, type, date
   - Subject
   - Marks obtained / Total marks
   - Percentage
   - Grade
   - Class average
   - Highest marks

5. **Trend Analysis**
   - Performance graph over time
   - Subject-wise trends
   - Improvement/decline indicators

6. **Strengths & Weaknesses**
   - Best performing subjects
   - Subjects needing attention
   - Consistent performance areas
   - Improvement suggestions

7. **Teacher Remarks**
   - Subject-wise remarks
   - Overall remarks
   - Recommendations

### Class Performance Report

#### Components
1. **Class Summary**
   - Class name, section
   - Total students
   - Academic year
   - Class teacher

2. **Overall Statistics**
   - Class average percentage
   - Highest percentage
   - Lowest percentage
   - Pass percentage
   - Average GPA

3. **Grade Distribution**
   - Pie chart showing grade distribution
   - Table with grade counts
   - Percentage of students in each grade

4. **Subject-Wise Analysis**
   - Subject name
   - Class average
   - Highest marks
   - Lowest marks
   - Pass percentage
   - Difficulty level

5. **Top Performers**
   - Rank, name, percentage
   - Top 10 students
   - Subject-wise toppers

6. **Students Needing Attention**
   - Students with low performance
   - Students with declining trends
   - Students with multiple failures
   - Recommended interventions

7. **Comparative Analysis**
   - Comparison with other sections
   - Comparison with previous year
   - Subject-wise comparison

### Report Card

#### Format
```
┌─────────────────────────────────────────────────────────────┐
│                    [SCHOOL LOGO]                            │
│                  SCHOOL NAME                                │
│              PROGRESS REPORT CARD                           │
│                 Academic Year: 2025-2026                    │
└─────────────────────────────────────────────────────────────┘

Student Name: John Smith                 Class: 10-A
Enrollment No: 2024001                    Roll No: 15
Date of Birth: 15-05-2010                 Term: Midterm

┌─────────────────────────────────────────────────────────────┐
│ SCHOLASTIC AREAS                                            │
├──────────────┬────────┬────────┬────────┬────────┬──────────┤
│ Subject      │ Total  │ Marks  │ Percent│ Grade  │ Grade Pt │
│              │ Marks  │ Obtain │   %    │        │          │
├──────────────┼────────┼────────┼────────┼────────┼──────────┤
│ Mathematics  │  500   │  425   │  85.0  │   A    │   9.0    │
│ Science      │  500   │  410   │  82.0  │   A    │   9.0    │
│ English      │  400   │  340   │  85.0  │   A    │   9.0    │
│ Social Sci.  │  400   │  320   │  80.0  │  B+    │   8.0    │
│ Hindi        │  400   │  360   │  90.0  │  A+    │  10.0    │
├──────────────┼────────┼────────┼────────┼────────┼──────────┤
│ TOTAL        │ 2200   │ 1855   │  84.3  │   A    │   9.0    │
└──────────────┴────────┴────────┴────────┴────────┴──────────┘

Overall Grade: A                          CGPA: 9.0
Class Rank: 5 out of 30                   Attendance: 95%

┌─────────────────────────────────────────────────────────────┐
│ CO-SCHOLASTIC AREAS                                         │
├──────────────────────────┬──────────────────────────────────┤
│ Work Education           │ A                                │
│ Art Education            │ B+                               │
│ Physical Education       │ A                                │
└──────────────────────────┴──────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ DISCIPLINE                                                  │
├──────────────────────────┬──────────────────────────────────┤
│ Behavior                 │ Excellent                        │
│ Punctuality              │ Very Good                        │
│ Participation            │ Excellent                        │
└──────────────────────────┴──────────────────────────────────┘

Class Teacher's Remarks:
John is a dedicated student with consistent performance across
all subjects. He shows particular strength in Mathematics and
English. Encouraged to participate more in group activities.

Principal's Signature: _______________  Date: _______________

Parent's Signature: _______________    Date: _______________
```

### Analytics Dashboard

#### Widgets
1. **Performance Overview**
   - Total students
   - Average class percentage
   - Pass percentage
   - Grade distribution pie chart

2. **Subject Performance**
   - Bar chart showing average by subject
   - Comparison with previous term
   - Trend indicators

3. **Top Performers**
   - List of top 10 students
   - Photos and percentages
   - Quick view of their performance

4. **At-Risk Students**
   - Students with failing grades
   - Students with declining trends
   - Alert indicators

5. **Exam Calendar**
   - Upcoming exams
   - Recent exams
   - Marks entry status

6. **Trends**
   - Monthly performance trends
   - Subject-wise trends
   - Class-wise comparison

---

## Edge Cases & Error Handling

### Edge Case 1: Marks Entry for Transferred Student

**Scenario**: Student transferred to another class after exam but before marks entry

**Handling**:
- Allow marks entry for original class
- Show warning that student has transferred
- Include in original class statistics
- Exclude from new class statistics for this exam

### Edge Case 2: Exam Cancelled After Marks Entry

**Scenario**: Exam cancelled but some marks already entered

**Handling**:
- Soft delete exam (don't remove from database)
- Mark exam status as 'cancelled'
- Keep marks data for audit
- Exclude from performance calculations
- Show cancelled status in reports

### Edge Case 3: Total Marks Changed After Partial Entry

**Scenario**: Admin changes total marks after some teachers entered marks

**Handling**:
- Prevent total marks change if any marks entered
- OR recalculate all percentages and grades
- Send notification to affected teachers
- Show warning before allowing change
- Log the change for audit

### Edge Case 4: Student Absent for All Exams

**Scenario**: Student marked absent for all exams in a subject

**Handling**:
- Show "Insufficient Data" in reports
- Don't assign grade
- Don't include in class average
- Show special indicator in report card
- Alert admin/teacher

### Edge Case 5: Duplicate Marks Entry

**Scenario**: Teacher tries to enter marks twice for same student

**Handling**:
- Check for existing marks before insert
- Show existing marks to teacher
- Offer to update existing marks
- Require confirmation for update
- Log the update with reason

### Edge Case 6: Marks Entry for Wrong Class

**Scenario**: Teacher selects wrong class and enters marks

**Handling**:
- Validate student belongs to exam's class
- Show error immediately
- Don't allow save
- Suggest correct class
- Prevent data corruption

### Edge Case 7: Bulk Upload with Missing Students

**Scenario**: Excel file missing some students from class

**Handling**:
- Detect missing students
- Show list of missing students
- Offer to:
  - Mark missing students as absent
  - Cancel import
  - Import partial data
- Require explicit confirmation

### Edge Case 8: Grade Boundary Student

**Scenario**: Student gets exactly 80% (boundary between B+ and A)

**Handling**:
- Use inclusive ranges (80-89 = A, not 81-89)
- Document grade boundaries clearly
- Apply consistently
- Allow manual override by admin if needed

### Edge Case 9: Decimal Marks

**Scenario**: Teacher enters 85.5 marks

**Handling**:
- Allow up to 2 decimal places
- Round to 2 decimals automatically
- Store as REAL in database
- Display with 2 decimals in UI
- Calculate percentage with precision

### Edge Case 10: Negative Marks

**Scenario**: Teacher accidentally enters negative marks

**Handling**:
- Validate marks >= 0
- Show error message
- Don't allow save
- Suggest valid range
- Prevent negative marks in database

### Edge Case 11: Marks Greater Than Total

**Scenario**: Teacher enters 105 when total is 100

**Handling**:
- Validate marks <= total marks
- Show error with total marks
- Don't allow save
- Highlight the field
- Suggest grace marks feature (future)

### Edge Case 12: Concurrent Marks Entry

**Scenario**: Two teachers enter marks for same student simultaneously

**Handling**:
- Use database constraints (UNIQUE)
- Last write wins OR
- Show conflict resolution dialog
- Allow teacher to choose which to keep
- Log both attempts

### Edge Case 13: Exam Date in Future

**Scenario**: Creating exam with future date

**Handling**:
- Allow future dates (for scheduling)
- Don't allow marks entry until exam date
- Show "Scheduled" status
- Send reminders before exam
- Auto-change status on exam date

### Edge Case 14: Student Joins Mid-Term

**Scenario**: New student joins after some exams conducted

**Handling**:
- Mark previous exams as "Not Applicable"
- Calculate average only for appeared exams
- Show "NA" in report card
- Don't penalize in ranking
- Clear indication in reports

### Edge Case 15: Grade Configuration Change

**Scenario**: School changes grading system mid-year

**Handling**:
- Apply new grades only to future exams
- Keep old grades for past exams
- Show both systems in reports
- Allow admin to recalculate if needed
- Document the change

---

## Testing Strategy

### Unit Tests

#### Exam Service Tests
```javascript
describe('Exam Service', () => {
  test('should create exam with valid data', async () => {
    const examData = {
      name: 'Math Midterm',
      type: 'midterm',
      classId: 'class-123',
      subjectId: 'subject-456',
      totalMarks: 100,
      passingMarks: 40,
      examDate: '2026-03-15'
    };
    
    const exam = await examService.createExam(examData, 'teacher-123');
    
    expect(exam.id).toBeDefined();
    expect(exam.name).toBe('Math Midterm');
    expect(exam.status).toBe('scheduled');
  });
  
  test('should reject exam with invalid data', async () => {
    const examData = {
      name: 'Math Midterm',
      totalMarks: -100  // Invalid
    };
    
    await expect(examService.createExam(examData, 'teacher-123'))
      .rejects.toThrow('Total marks must be positive');
  });
});
```

#### Marks Service Tests
```javascript
describe('Marks Service', () => {
  test('should enter marks with auto-grade calculation', async () => {
    const marksData = {
      examId: 'exam-789',
      studentId: 'student-123',
      marksObtained: 85
    };
    
    const marks = await marksService.enterMarks(marksData, 'teacher-123');
    
    expect(marks.percentage).toBe(85.0);
    expect(marks.grade).toBe('A');
    expect(marks.gradePoint).toBe(9.0);
  });
  
  test('should reject marks exceeding total', async () => {
    const marksData = {
      examId: 'exam-789',
      studentId: 'student-123',
      marksObtained: 105  // Total is 100
    };
    
    await expect(marksService.enterMarks(marksData, 'teacher-123'))
      .rejects.toThrow('Marks cannot exceed total marks');
  });
});
```

#### Grade Calculator Tests
```javascript
describe('Grade Calculator', () => {
  test('should calculate correct grade for percentage', () => {
    const grade = gradeCalculator.calculateGrade(85, gradeConfig);
    
    expect(grade.grade).toBe('A');
    expect(grade.gradePoint).toBe(9.0);
  });
  
  test('should handle boundary cases', () => {
    const grade1 = gradeCalculator.calculateGrade(90, gradeConfig);
    const grade2 = gradeCalculator.calculateGrade(91, gradeConfig);
    
    expect(grade1.grade).toBe('A');
    expect(grade2.grade).toBe('A+');
  });
});
```

### Integration Tests

#### End-to-End Exam Flow
```javascript
describe('Exam Flow', () => {
  test('complete exam lifecycle', async () => {
    // Create exam
    const exam = await createExam(examData);
    expect(exam.status).toBe('scheduled');
    
    // Enter marks for all students
    const marks = await enterBulkMarks(exam.id, marksData);
    expect(marks.entered).toBe(30);
    
    // Verify marks
    await verifyMarks(exam.id, 'admin-123');
    
    // Generate report
    const report = await generateReport(exam.id);
    expect(report.statistics.averagePercentage).toBeGreaterThan(0);
    
    // Complete exam
    await completeExam(exam.id);
    const updatedExam = await getExam(exam.id);
    expect(updatedExam.status).toBe('completed');
  });
});
```

### Performance Tests

#### Bulk Operations
```javascript
describe('Performance Tests', () => {
  test('should handle 1000 students bulk upload', async () => {
    const startTime = Date.now();
    
    const result = await enterBulkMarks(examId, generate1000Records());
    
    const duration = Date.now() - startTime;
    expect(duration).toBeLessThan(5000); // 5 seconds
    expect(result.entered).toBe(1000);
  });
  
  test('should generate report for 500 students quickly', async () => {
    const startTime = Date.now();
    
    const report = await generateClassReport(classId);
    
    const duration = Date.now() - startTime;
    expect(duration).toBeLessThan(3000); // 3 seconds
  });
});
```

### Test Data

#### Sample Exam Data
```javascript
const sampleExams = [
  {
    name: 'Mathematics Unit Test 1',
    type: 'unit_test',
    totalMarks: 50,
    passingMarks: 20,
    weightage: 0.5
  },
  {
    name: 'Mathematics Midterm',
    type: 'midterm',
    totalMarks: 100,
    passingMarks: 40,
    weightage: 1.5
  },
  {
    name: 'Mathematics Final',
    type: 'final',
    totalMarks: 100,
    passingMarks: 40,
    weightage: 2.0
  }
];
```

#### Sample Marks Data
```javascript
const sampleMarks = [
  { studentId: 'student-1', marksObtained: 85, status: 'present' },
  { studentId: 'student-2', marksObtained: 72, status: 'present' },
  { studentId: 'student-3', marksObtained: 0, status: 'absent' },
  { studentId: 'student-4', marksObtained: 95, status: 'present' },
  { studentId: 'student-5', marksObtained: 68, status: 'present' }
];
```


---

## UI/UX Design

### Exam Management UI

#### Exam List Page
```
┌─────────────────────────────────────────────────────────────┐
│ Exams                                    [+ Create Exam]    │
├─────────────────────────────────────────────────────────────┤
│ Filters:                                                    │
│ [Class ▼] [Subject ▼] [Type ▼] [Status ▼] [Date Range]   │
├─────────────────────────────────────────────────────────────┤
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ Mathematics Midterm Exam                    [Edit] [⋮] │ │
│ │ Class 10-A • Mathematics • Midterm                      │ │
│ │ Date: 15 Mar 2026 • Total Marks: 100                   │ │
│ │ Status: Scheduled • Marks Entered: 0/30                │ │
│ │ [Enter Marks] [View Details]                           │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ Science Unit Test 1                         [Edit] [⋮] │ │
│ │ Class 10-A • Science • Unit Test                       │ │
│ │ Date: 10 Mar 2026 • Total Marks: 50                   │ │
│ │ Status: Completed • Marks Entered: 30/30               │ │
│ │ [View Marks] [View Report]                             │ │
│ └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

#### Create Exam Form
```
┌─────────────────────────────────────────────────────────────┐
│ Create Exam                                      [✕ Close]  │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ Exam Name *                                                 │
│ [_____________________________________________________]     │
│                                                             │
│ Exam Type *                    Class *                      │
│ [Unit Test ▼]                  [Class 10-A ▼]              │
│                                                             │
│ Subject *                      Exam Date *                  │
│ [Mathematics ▼]                [📅 15/03/2026]              │
│                                                             │
│ Total Marks *                  Passing Marks *              │
│ [100_____]                     [40______]                   │
│                                                             │
│ Duration (minutes)             Weightage                    │
│ [180_____]                     [1.5_____]                   │
│                                                             │
│ Instructions                                                │
│ [_____________________________________________________]     │
│ [_____________________________________________________]     │
│ [_____________________________________________________]     │
│                                                             │
│ Syllabus Topics                                             │
│ [+ Add Topic]                                               │
│ • Algebra                                          [✕]      │
│ • Geometry                                         [✕]      │
│ • Trigonometry                                     [✕]      │
│                                                             │
│                              [Cancel] [Create Exam]         │
└─────────────────────────────────────────────────────────────┘
```

### Marks Entry UI

#### Individual Entry Mode
```
┌─────────────────────────────────────────────────────────────┐
│ Enter Marks - Mathematics Midterm Exam                      │
├─────────────────────────────────────────────────────────────┤
│ Class: 10-A • Subject: Mathematics • Total Marks: 100      │
│ Date: 15 Mar 2026 • Students: 30 • Entered: 15/30         │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ Student: John Smith (2024001)                    [15/30]   │
│                                                             │
│ Marks Obtained *                                            │
│ [85______] / 100                                            │
│                                                             │
│ Percentage: 85.0%                                           │
│ Grade: A (9.0 GPA)                                          │
│                                                             │
│ Status                                                      │
│ ○ Present  ○ Absent  ○ Exempted                            │
│                                                             │
│ Remarks                                                     │
│ [_____________________________________________________]     │
│                                                             │
│ [← Previous] [Save & Next →] [Save & Close]                │
└─────────────────────────────────────────────────────────────┘
```

#### Bulk Entry Mode (Table View)
```
┌─────────────────────────────────────────────────────────────┐
│ Bulk Marks Entry - Mathematics Midterm Exam                 │
├─────────────────────────────────────────────────────────────┤
│ [Individual Entry] [Bulk Entry] [Bulk Upload]              │
├─────────────────────────────────────────────────────────────┤
│ Statistics: Avg: 75.5 | Highest: 95 | Lowest: 45          │
├─────────────────────────────────────────────────────────────┤
│ Enroll No │ Student Name    │ Marks │ % │ Grade │ Status  │
├───────────┼─────────────────┼───────┼───┼───────┼─────────┤
│ 2024001   │ John Smith      │ [85_] │85%│  A    │ Present │
│ 2024002   │ Jane Doe        │ [72_] │72%│  B+   │ Present │
│ 2024003   │ Bob Johnson     │ [__] │ - │  -    │ Absent  │
│ 2024004   │ Alice Williams  │ [95_] │95%│  A+   │ Present │
│ 2024005   │ Charlie Brown   │ [68_] │68%│  B    │ Present │
│ ...       │ ...             │ ...   │...│ ...   │ ...     │
├───────────┴─────────────────┴───────┴───┴───────┴─────────┤
│ Entered: 25/30 • Pending: 5 • Absent: 0                    │
│                                          [Save All Changes] │
└─────────────────────────────────────────────────────────────┘
```

#### Bulk Upload Mode
```
┌─────────────────────────────────────────────────────────────┐
│ Bulk Upload Marks - Mathematics Midterm Exam                │
├─────────────────────────────────────────────────────────────┤
│ Step 1: Download Template                                   │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ 📄 Download Excel template with student list           │ │
│ │ [📥 Download Template]                                  │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                             │
│ Step 2: Fill Marks in Excel                                 │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ • Open the downloaded file                              │ │
│ │ • Fill marks for each student                           │ │
│ │ • Mark absent students                                  │ │
│ │ • Add remarks if needed                                 │ │
│ │ • Save the file                                         │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                             │
│ Step 3: Upload Filled File                                  │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ Drag and drop file here or click to browse             │ │
│ │                                                         │ │
│ │              [📁 Choose File]                           │ │
│ │                                                         │ │
│ │ Supported formats: .xlsx, .xls, .csv                   │ │
│ │ Maximum file size: 5MB                                  │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                             │
│                                          [Cancel] [Upload]  │
└─────────────────────────────────────────────────────────────┘
```

#### Upload Preview with Errors
```
┌─────────────────────────────────────────────────────────────┐
│ Upload Preview                                              │
├─────────────────────────────────────────────────────────────┤
│ ✓ File uploaded successfully                                │
│ ⚠ Found 3 errors in uploaded data                          │
├─────────────────────────────────────────────────────────────┤
│ Summary:                                                    │
│ • Total Records: 30                                         │
│ • Valid Records: 27                                         │
│ • Invalid Records: 3                                        │
├─────────────────────────────────────────────────────────────┤
│ Errors:                                                     │
│ ❌ Row 5: Marks 105 exceeds total marks 100                │
│ ❌ Row 12: Student with enrollment no 2024999 not found    │
│ ❌ Row 18: Invalid status 'maybe' (use present/absent)     │
├─────────────────────────────────────────────────────────────┤
│ Options:                                                    │
│ ○ Import valid records only (27 records)                   │
│ ○ Fix errors and re-upload                                 │
│                                                             │
│ [Download Error Report] [Cancel] [Import Valid Records]    │
└─────────────────────────────────────────────────────────────┘
```

### Performance Reports UI

#### Student Performance Dashboard
```
┌─────────────────────────────────────────────────────────────┐
│ Student Performance - John Smith (2024001)                  │
├─────────────────────────────────────────────────────────────┤
│ [Overview] [Subject-Wise] [Exam-Wise] [Trends]            │
├─────────────────────────────────────────────────────────────┤
│ Overall Summary                                             │
│ ┌──────────────┬──────────────┬──────────────┬────────────┐ │
│ │ Total Exams  │ Appeared     │ Average %    │ Overall    │ │
│ │     20       │     19       │    78.5%     │ Grade: B+  │ │
│ └──────────────┴──────────────┴──────────────┴────────────┘ │
│                                                             │
│ Subject-Wise Performance                                    │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ Mathematics    ████████████████░░  82% (A)   ↗ Improving│ │
│ │ Science        ███████████████░░░  75% (B+)  → Stable   │ │
│ │ English        █████████████████░  85% (A)   ↗ Improving│ │
│ │ Social Science ██████████████░░░░  70% (B)   ↘ Declining│ │
│ │ Hindi          ██████████████████  90% (A+)  ↗ Improving│ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                             │
│ Performance Trend                                           │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ 100%│                                    ●               │ │
│ │  90%│                          ●       ●   ●             │ │
│ │  80%│              ●     ●   ●   ●                       │ │
│ │  70%│        ●   ●   ●                                   │ │
│ │  60%│  ●                                                 │ │
│ │     └───────────────────────────────────────────────────│ │
│ │      Jan  Feb  Mar  Apr  May  Jun  Jul  Aug  Sep  Oct  │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                             │
│ Strengths: Mathematics, English, Hindi                      │
│ Needs Attention: Social Science                             │
│                                                             │
│ [Export PDF] [Export Excel] [Print]                        │
└─────────────────────────────────────────────────────────────┘
```

#### Class Performance Dashboard
```
┌─────────────────────────────────────────────────────────────┐
│ Class Performance - Class 10-A                              │
├─────────────────────────────────────────────────────────────┤
│ Overall Statistics                                          │
│ ┌──────────┬──────────┬──────────┬──────────┬────────────┐ │
│ │ Students │ Avg %    │ Highest  │ Lowest   │ Pass %     │ │
│ │    30    │  72.5%   │  95.0%   │  45.0%   │   93.3%    │ │
│ └──────────┴──────────┴──────────┴──────────┴────────────┘ │
│                                                             │
│ Grade Distribution                                          │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │        ┌─────┐                                          │ │
│ │        │ 33% │                                          │ │
│ │  ┌─────┤ B+  ├─────┐                                   │ │
│ │  │ 27% │     │ 17% │                                   │ │
│ │  │  A  │     │  B  │  ┌─────┐                         │ │
│ │  │     │     │     │  │  7% │                         │ │
│ │  │     │     │     │  │  C  │                         │ │
│ │ ┌┴─────┴─────┴─────┴──┴─────┴┐                        │ │
│ │ │ 17%  27%  33%  17%   7%    │                        │ │
│ │ │ A+    A   B+    B    C     │                        │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                             │
│ Top 5 Performers                                            │
│ 1. Alice Williams    95.0%  (A+)                           │
│ 2. John Smith        92.0%  (A+)                           │
│ 3. Sarah Johnson     88.5%  (A)                            │
│ 4. Michael Brown     85.0%  (A)                            │
│ 5. Emily Davis       82.5%  (A)                            │
│                                                             │
│ Students Needing Attention (3)                              │
│ • Jane Doe - 45% - Failed 3 exams                          │
│ • Bob Wilson - 48% - Declining trend                       │
│ • Tom Anderson - 52% - Irregular attendance                │
│                                                             │
│ [View Details] [Export Report] [Send Alerts]               │
└─────────────────────────────────────────────────────────────┘
```

### Mobile Responsive Design

#### Mobile Marks Entry
```
┌─────────────────────┐
│ ☰  Marks Entry      │
├─────────────────────┤
│ Math Midterm Exam   │
│ Class 10-A          │
│ 15/30 Entered       │
├─────────────────────┤
│                     │
│ John Smith          │
│ 2024001             │
│                     │
│ Marks: [85__] /100  │
│                     │
│ Grade: A (85%)      │
│                     │
│ Status:             │
│ ● Present           │
│ ○ Absent            │
│                     │
│ Remarks:            │
│ [_______________]   │
│                     │
│ [← Prev] [Next →]  │
│                     │
│ [Save]              │
│                     │
└─────────────────────┘
```

---

## Integration Points

### 1. Student Management Integration
- Fetch student list for exam's class
- Validate student belongs to class
- Get student details for reports
- Track student transfers

### 2. Class Management Integration
- Fetch class details
- Get class students
- Validate class exists
- Get class teacher

### 3. Subject Management Integration
- Fetch subject details
- Validate subject belongs to class
- Get subject teacher
- Check subject-class mapping

### 4. Teacher Management Integration
- Validate teacher permissions
- Check if teacher teaches subject
- Get teacher details for audit
- Verify class incharge

### 5. Attendance System Integration
- Cross-reference attendance data
- Show attendance in performance reports
- Calculate attendance percentage
- Identify correlation between attendance and performance

### 6. Alert System Integration (Future)
- Generate alerts for low performance
- Alert for failing students
- Alert for declining trends
- Notify parents of poor performance

### 7. Intervention System Integration (Future)
- Trigger interventions for at-risk students
- Track intervention effectiveness
- Link performance data to interventions
- Monitor improvement after intervention

---

## Security & Authorization

### Role-Based Permissions

#### Admin
- ✅ Create/edit/delete exams
- ✅ Enter/edit/delete marks
- ✅ Verify marks
- ✅ View all reports
- ✅ Export data
- ✅ Configure grading system
- ✅ Override grades

#### Teacher
- ✅ Create exams for assigned subjects
- ✅ Edit own exams (before marks entry)
- ✅ Enter marks for assigned subjects
- ✅ Edit own marks (before verification)
- ✅ View reports for assigned classes
- ✅ Export reports for assigned classes
- ❌ Delete exams with marks
- ❌ Verify marks
- ❌ Override grades

#### Student/Parent (Future)
- ✅ View own performance
- ✅ View own report card
- ✅ Export own reports
- ❌ View other students' data
- ❌ Edit any data

### Data Access Control

#### School Isolation
```javascript
// All queries filtered by schoolId
const exams = dataStore.getExams().filter(
  e => e.schoolId === req.user.schoolId
);
```

#### Teacher Access
```javascript
// Teachers can only access their subjects
const canAccess = await checkTeacherAccess(
  teacherId,
  examId
);

if (!canAccess) {
  return res.status(403).json({ error: 'Access denied' });
}
```

#### Student Data Privacy
```javascript
// Protect student personal information
const sanitizeStudentData = (student) => {
  return {
    id: student.id,
    name: student.name,
    enrollmentNo: student.enrollmentNo,
    // Don't expose: phone, email, address, parent details
  };
};
```

### Audit Trail

#### Track All Changes
```javascript
const auditLog = {
  action: 'UPDATE_MARKS',
  entityType: 'marks',
  entityId: marksId,
  userId: req.user.id,
  oldValue: JSON.stringify(oldMarks),
  newValue: JSON.stringify(newMarks),
  timestamp: new Date().toISOString(),
  ipAddress: req.ip
};

dataStore.addAuditLog(auditLog);
```

#### Audit Events
- Exam created/updated/deleted
- Marks entered/updated/deleted
- Marks verified
- Grade configuration changed
- Report generated
- Data exported

---

## Implementation Checklist

### Phase 1: Core Exam Management
- [ ] Database schema creation
- [ ] Exam CRUD operations
- [ ] Exam validation
- [ ] Exam status management
- [ ] Exam listing and filtering
- [ ] Unit tests

### Phase 2: Marks Entry
- [ ] Individual marks entry
- [ ] Bulk marks entry (table view)
- [ ] Marks validation
- [ ] Grade calculation
- [ ] Percentage calculation
- [ ] Unit tests

### Phase 3: Bulk Upload
- [ ] Template generation
- [ ] File upload handling
- [ ] Data parsing
- [ ] Data validation
- [ ] Preview with errors
- [ ] Import processing
- [ ] Unit tests

### Phase 4: Grading System
- [ ] Grade configuration
- [ ] Grade calculation logic
- [ ] GPA calculation
- [ ] Weighted average
- [ ] Custom grading systems
- [ ] Unit tests

### Phase 5: Performance Analytics
- [ ] Student performance calculation
- [ ] Class performance calculation
- [ ] Subject performance calculation
- [ ] Trend analysis
- [ ] Comparative analysis
- [ ] Unit tests

### Phase 6: Reports
- [ ] Student performance report
- [ ] Class performance report
- [ ] Report card generation
- [ ] PDF export
- [ ] Excel export
- [ ] Print formatting

### Phase 7: UI Implementation
- [ ] Exam management pages
- [ ] Marks entry pages
- [ ] Bulk upload modal
- [ ] Performance dashboards
- [ ] Report pages
- [ ] Mobile responsive design

### Phase 8: Integration
- [ ] Student management integration
- [ ] Class management integration
- [ ] Subject management integration
- [ ] Teacher management integration
- [ ] Attendance system integration

### Phase 9: Testing
- [ ] Unit tests (100% coverage)
- [ ] Integration tests
- [ ] End-to-end tests
- [ ] Performance tests
- [ ] Security tests
- [ ] User acceptance testing

### Phase 10: Documentation
- [ ] API documentation
- [ ] User guides
- [ ] Admin guides
- [ ] Teacher guides
- [ ] Troubleshooting guides

---

**Document Version**: 1.0  
**Last Updated**: February 21, 2026  
**Status**: Ready for Implementation  
**Estimated Effort**: 4-6 weeks (full-time development)
