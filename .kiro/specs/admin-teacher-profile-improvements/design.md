# Design Document

## Overview

This design document outlines the technical approach for implementing improvements to the education assistant project. The improvements span seven key areas: admin profile management, exam template updates, bulk attendance upload, score management, UI enhancements, behavior tracking, and profile functionality fixes.

The system follows a client-server architecture with a React frontend communicating with a Node.js/Express backend that uses SQLite for data persistence. The design maintains consistency with existing patterns while adding missing functionality and fixing broken features.

## Architecture

### System Architecture

The application follows a three-tier architecture:

1. **Presentation Layer (React Frontend)**
   - Component-based UI using React
   - State management via Context API
   - API communication through centralized apiService
   - Responsive design with Tailwind CSS

2. **Application Layer (Express Backend)**
   - RESTful API endpoints
   - JWT-based authentication middleware
   - Role-based access control (admin, teacher)
   - Business logic in service layer
   - Controller layer for request handling

3. **Data Layer (SQLite)**
   - Persistent storage via sqliteStore
   - Relational data model
   - Transaction support for bulk operations
   - Data integrity constraints

### Communication Flow

```
Frontend Component → apiService → Backend Route → Controller → Service → DataStore → SQLite
```

### Authentication & Authorization

- JWT tokens stored in localStorage/sessionStorage
- Token included in Authorization header for protected routes
- Middleware validates token and extracts user context
- Role-based access control enforced at route level

## Components and Interfaces

### 1. Admin Profile Management

#### Frontend Components

**AdminProfile.jsx** (Enhanced)
- Displays admin profile information
- Provides edit mode toggle
- Handles form validation and submission
- Shows success/error messages

**ProfileForm Component**
- Reusable form fields for profile data
- Client-side validation
- Controlled inputs with state management

#### Backend Components

**Profile Routes** (New: `/api/profile`)
- `GET /api/profile` - Get current user profile
- `PUT /api/profile` - Update current user profile
- `GET /api/profile/:userId` - Get user profile by ID (admin only)

**Profile Controller** (New)
```javascript
getProfile(req, res)
updateProfile(req, res)
getProfileById(req, res)
```

**Profile Service** (New)
```javascript
getUserProfile(userId)
updateUserProfile(userId, updates)
validateProfileData(data)
```

#### Data Model

**Users Table** (Existing, enhanced)
```javascript
{
  id: string,
  email: string,
  password: string,
  fullName: string,
  role: 'admin' | 'teacher',
  schoolId: string,
  status: 'pending' | 'approved' | 'rejected',
  // New fields
  phone: string,
  designation: string,
  address: string,
  city: string,
  state: string,
  pincode: string,
  profilePicture: string,
  createdAt: timestamp,
  updatedAt: timestamp
}
```

**Schools Table** (Existing, reference)
```javascript
{
  id: string,
  name: string,
  address: string,
  city: string,
  state: string,
  phone: string,
  adminId: string,
  createdAt: timestamp
}
```

### 2. Exam Template Update Fix

#### Frontend Components

**ExamTemplateManagement.jsx** (Fix)
- Template list display
- Edit modal with pre-populated data
- Update handler with proper API call
- Success/error feedback

#### Backend Components

**Exam Template Routes** (Existing, verify)
- `PUT /api/exam-templates/:templateId` - Update template

**Exam Template Controller** (Fix)
```javascript
updateTemplate(req, res) {
  // Ensure proper parameter extraction
  // Validate template data
  // Call service layer
  // Return updated template
}
```

**Exam Template Service** (Fix)
```javascript
updateTemplate(templateId, updates, userId) {
  // Validate updates
  // Check template exists
  // Update in dataStore
  // Update timestamp
  // Return updated template
}
```

#### Root Cause Analysis

The issue likely stems from:
1. Frontend not sending correct templateId in URL
2. Backend not properly extracting templateId from params
3. DataStore update method not persisting changes
4. Missing validation causing silent failures

#### Fix Strategy

1. Verify frontend sends PUT request to correct endpoint
2. Ensure backend extracts `req.params.templateId` correctly
3. Validate dataStore.updateExamTemplate() persists to SQLite
4. Add comprehensive error logging
5. Return updated template in response

### 3. Teacher Bulk Attendance Upload

#### Frontend Components

**BulkAttendanceUpload Component** (New)
- Template download button
- File upload input
- File validation
- Upload progress indicator
- Results summary display

#### Backend Components

**Attendance Routes** (Enhanced)
- `GET /api/attendance/template` - Download attendance template
- `POST /api/attendance/bulk-upload` - Upload attendance file

**Attendance Controller** (Enhanced)
```javascript
getAttendanceTemplate(req, res)
uploadBulkAttendance(req, res)
```

**Attendance Service** (Enhanced)
```javascript
generateAttendanceTemplate(classId)
parseBulkAttendanceFile(fileBuffer, classId)
validateAttendanceRecords(records)
saveBulkAttendance(records)
```

**File Parser Utility** (New)
```javascript
parseExcelFile(buffer)
parseCSVFile(buffer)
validateFileFormat(data)
```

#### Data Flow

1. Teacher downloads template (Excel/CSV)
2. Teacher fills in attendance data
3. Teacher uploads completed file
4. Backend parses file
5. Backend validates each record
6. Backend saves valid records in transaction
7. Backend returns summary (success/failed counts)

#### Template Format

```csv
Enrollment Number,Student Name,Date,Status
2024001,John Doe,2024-01-15,present
2024002,Jane Smith,2024-01-15,absent
```

#### Validation Rules

- Enrollment number must exist in database
- Date must be valid format (YYYY-MM-DD)
- Status must be: present, absent, late, excused
- No duplicate records for same student/date
- Student must belong to teacher's class

### 4. Score Management System

#### Frontend Components

**MarksEntryPage.jsx** (Fix)
- Exam selection
- Student list with marks input
- Grade calculation display
- Save button with proper API call
- Success/error feedback

**ScoresPage Component** (New)
- View all scores by class/exam
- Filter by student, subject, date range
- Edit existing scores
- Delete scores (admin only)

#### Backend Components

**Marks Routes** (Verify/Fix)
- `POST /api/marks` - Create single marks record
- `POST /api/marks/bulk` - Create bulk marks records
- `GET /api/marks/exam/:examId` - Get marks by exam
- `GET /api/marks/student/:studentId` - Get marks by student
- `PUT /api/marks/:marksId` - Update marks record
- `DELETE /api/marks/:marksId` - Delete marks record

**Marks Controller** (Fix)
```javascript
enterSingleMarks(req, res)
enterBulkMarks(req, res)
getMarksByExam(req, res)
getMarksByStudent(req, res)
updateMarks(req, res)
deleteMarks(req, res)
```

**Marks Service** (New/Enhanced)
```javascript
createMarksRecord(marksData)
createBulkMarks(marksArray)
calculateGrade(marksObtained, totalMarks)
calculatePercentage(marksObtained, totalMarks)
validateMarksData(data)
getMarksByExam(examId)
getMarksByStudent(studentId, filters)
updateMarksRecord(marksId, updates)
deleteMarksRecord(marksId)
```

#### Data Model

**Marks Table** (New)
```javascript
{
  id: string,
  examId: string,
  studentId: string,
  marksObtained: number,
  totalMarks: number,
  percentage: number,
  grade: string,
  status: 'present' | 'absent' | 'exempted',
  remarks: string,
  enteredBy: string,
  verifiedBy: string,
  isVerified: boolean,
  createdAt: timestamp,
  updatedAt: timestamp
}
```

#### Grade Calculation Logic

```javascript
function calculateGrade(percentage) {
  if (percentage >= 91) return 'A+';
  if (percentage >= 81) return 'A';
  if (percentage >= 71) return 'B+';
  if (percentage >= 61) return 'B';
  if (percentage >= 51) return 'C+';
  if (percentage >= 41) return 'C';
  if (percentage >= 33) return 'D';
  return 'E';
}
```

### 5. UI Improvements

#### Attendance History Page

**Current Issues:**
- Poor layout when viewing details
- Missing proper table formatting
- Unclear data presentation

**Improvements:**
- Responsive table with proper columns
- Modal for detailed view
- Visual indicators for attendance percentages
- Filtering and sorting capabilities
- Export functionality

**Component Structure:**
```
AttendanceHistoryPage
├── FilterBar (date range, class selector)
├── AttendanceTable (responsive, sortable)
├── AttendanceDetailModal (student-level details)
└── ExportButton (Excel/CSV export)
```

#### Template Creation View

**Current Issues:**
- Cluttered form layout
- Missing field descriptions
- Poor mobile responsiveness

**Improvements:**
- Grouped form sections
- Clear field labels and tooltips
- Inline validation feedback
- Responsive grid layout
- Preview before save

**Component Structure:**
```
TemplateCreationForm
├── BasicInfoSection (name, type, description)
├── MarksSection (total marks, passing marks)
├── WeightageSection (weightage input with explanation)
├── ValidationFeedback (inline errors)
└── ActionButtons (save, cancel, preview)
```

### 6. Behavior Tab Functionality

#### Frontend Components

**BehaviorTab Component** (New)
- Behavior records list
- Add behavior record form
- Edit behavior record
- Delete behavior record
- Filter by date range, type, severity

**BehaviorForm Component** (New)
- Date picker
- Behavior type selector
- Severity selector
- Description textarea
- Submit/cancel buttons

#### Backend Components

**Behavior Routes** (New: `/api/behavior`)
- `POST /api/behavior` - Create behavior record
- `GET /api/behavior/student/:studentId` - Get student behavior records
- `GET /api/behavior` - Get all behavior records (with filters)
- `PUT /api/behavior/:behaviorId` - Update behavior record
- `DELETE /api/behavior/:behaviorId` - Delete behavior record

**Behavior Controller** (New)
```javascript
createBehaviorRecord(req, res)
getBehaviorRecords(req, res)
getStudentBehaviorRecords(req, res)
updateBehaviorRecord(req, res)
deleteBehaviorRecord(req, res)
```

**Behavior Service** (New)
```javascript
createBehavior(behaviorData)
getBehaviorsByStudent(studentId, filters)
getBehaviors(filters)
updateBehavior(behaviorId, updates)
deleteBehavior(behaviorId)
validateBehaviorData(data)
```

#### Data Model

**Behavior Table** (New)
```javascript
{
  id: string,
  studentId: string,
  teacherId: string,
  date: date,
  behaviorType: 'positive' | 'neutral' | 'negative',
  severity: 'low' | 'medium' | 'high',
  category: string, // e.g., 'discipline', 'participation', 'conduct'
  description: string,
  actionTaken: string,
  followUpRequired: boolean,
  followUpDate: date,
  createdAt: timestamp,
  updatedAt: timestamp
}
```

### 7. Teacher and Student Profile Functionality

#### Frontend Components

**ProfilePage.jsx** (Fix - Teacher)
- Load teacher data from backend
- Display personal info, subjects, classes
- Handle loading states
- Handle error states
- Edit functionality

**StudentProfilePage.jsx** (Fix)
- Load student data from backend
- Display personal info, class, attendance
- Display academic performance
- Handle "student not found" error
- Navigation back to student list

#### Backend Components

**Teacher Routes** (Enhanced)
- `GET /api/teachers/:teacherId` - Get teacher profile
- `PUT /api/teachers/:teacherId` - Update teacher profile

**Student Routes** (Enhanced)
- `GET /api/students/:studentId` - Get student profile (fix)
- Include attendance summary
- Include academic performance summary

**Profile Service** (Enhanced)
```javascript
getTeacherProfile(teacherId)
getStudentProfile(studentId)
getStudentAttendanceSummary(studentId)
getStudentAcademicSummary(studentId)
```

#### Error Handling

**Student Not Found:**
```javascript
if (!student) {
  return res.status(404).json({
    success: false,
    error: 'Student not found',
    message: 'The requested student does not exist or has been removed'
  });
}
```

**Frontend Error Display:**
```jsx
if (error === 'Student not found') {
  return (
    <ErrorView
      title="Student Not Found"
      message="The student you're looking for doesn't exist"
      action={() => navigate('/students')}
      actionText="Back to Students"
    />
  );
}
```

## Data Models

### Enhanced User Model

```javascript
{
  id: string,
  email: string,
  password: string,
  fullName: string,
  role: 'admin' | 'teacher',
  schoolId: string,
  status: 'pending' | 'approved' | 'rejected',
  // Profile fields
  phone: string,
  designation: string,
  address: string,
  city: string,
  state: string,
  pincode: string,
  profilePicture: string,
  // Teacher-specific
  subjects: string[], // Subject IDs
  classes: string[], // Class IDs
  qualifications: string,
  experience: number,
  // Timestamps
  createdAt: timestamp,
  updatedAt: timestamp
}
```

### New Marks Model

```javascript
{
  id: string,
  examId: string,
  studentId: string,
  marksObtained: number,
  totalMarks: number,
  percentage: number,
  grade: string,
  status: 'present' | 'absent' | 'exempted',
  remarks: string,
  enteredBy: string,
  verifiedBy: string,
  isVerified: boolean,
  createdAt: timestamp,
  updatedAt: timestamp
}
```

### New Behavior Model

```javascript
{
  id: string,
  studentId: string,
  teacherId: string,
  date: date,
  behaviorType: 'positive' | 'neutral' | 'negative',
  severity: 'low' | 'medium' | 'high',
  category: string,
  description: string,
  actionTaken: string,
  followUpRequired: boolean,
  followUpDate: date,
  createdAt: timestamp,
  updatedAt: timestamp
}
```

### Enhanced Attendance Model

```javascript
{
  id: string,
  studentId: string,
  classId: string,
  date: date,
  status: 'present' | 'absent' | 'late' | 'excused',
  subjectId: string, // Optional for subject-wise attendance
  markedBy: string,
  notes: string,
  createdAt: timestamp
}
```

## Correctness Properties


*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Profile Data Round-Trip Consistency

*For any* valid user profile (admin, teacher, or student) and any valid profile updates, saving the updates then retrieving the profile should return data equivalent to the updates.

**Validates: Requirements 1.4, 2.3, 7.1, 7.5**

### Property 2: Template Round-Trip Consistency

*For any* valid exam template, creating or updating the template then retrieving it should return data equivalent to what was saved.

**Validates: Requirements 2.1, 2.2, 2.3**

### Property 3: Attendance Template Format Compatibility

*For any* attendance template generated by the download function, uploading that template (with valid data filled in) should be successfully parsed by the upload parser.

**Validates: Requirements 3.3**

### Property 4: Input Validation Rejection

*For any* data submission (profile update, template update, marks entry, behavior record, attendance upload) with missing required fields or invalid values, the system should reject the submission and return a descriptive error message.

**Validates: Requirements 1.5, 2.5, 3.4, 3.6, 4.1, 6.6, 6.11**

### Property 5: Bulk Attendance Upload Atomicity

*For any* bulk attendance upload, either all valid records are saved successfully or none are saved (transaction atomicity), and the response should contain accurate counts of successful and failed records.

**Validates: Requirements 3.7, 3.8**

### Property 6: Attendance Duplicate Detection

*For any* attendance upload containing duplicate records (same student and date), the system should reject the upload with a specific error message identifying the duplicates.

**Validates: Requirements 3.11**

### Property 7: Marks Calculation Correctness

*For any* marks entry with marksObtained and totalMarks, the calculated percentage should equal (marksObtained / totalMarks) * 100, and the calculated grade should match the grading formula based on the percentage.

**Validates: Requirements 4.7, 4.8**

### Property 8: Marks Range Validation

*For any* marks entry, if marksObtained is less than 0 or greater than totalMarks, the system should reject the entry with a validation error.

**Validates: Requirements 4.1**

### Property 9: Bulk Marks Entry Success

*For any* array of valid marks records, bulk marks entry should successfully save all records and return a summary with the count of entered records.

**Validates: Requirements 4.11**

### Property 10: Audit Trail Maintenance

*For any* data update operation (profile, template, marks, behavior), the system should update the updatedAt timestamp and maintain the original createdAt timestamp.

**Validates: Requirements 2.9, 4.12, 6.9**

### Property 11: Referential Integrity Preservation

*For any* exam template that is referenced by existing exams, attempting to delete the template should fail with an error, or updates to the template should not break existing exam references.

**Validates: Requirements 2.8**

### Property 12: Behavior Record Chronological Ordering

*For any* set of behavior records for a student, when retrieved and displayed, they should be ordered by date in descending order (most recent first).

**Validates: Requirements 6.8**

### Property 13: Behavior Record Association

*For any* behavior record created by a teacher for a student, the saved record should have the correct studentId and teacherId foreign key associations.

**Validates: Requirements 6.7**

### Property 14: Profile Data Completeness

*For any* retrieved profile (teacher or student), the response should include all required fields (personal information, role-specific data, and associated entities), or gracefully handle missing fields without crashing.

**Validates: Requirements 7.3, 7.7, 7.9**

### Property 15: Authentication and Authorization Enforcement

*For any* protected endpoint (profile, marks, behavior, attendance), requests without valid authentication tokens should be rejected with 401 Unauthorized, and requests from users without proper role permissions should be rejected with 403 Forbidden.

**Validates: Requirements 7.12**

### Property 16: Attendance Filter Effectiveness

*For any* attendance history view with applied filters (date range, class), the displayed records should only include records matching all filter criteria.

**Validates: Requirements 5.3**

### Property 17: Inline Validation Feedback

*For any* form input (template creation, profile edit) with invalid data, the system should display inline validation feedback indicating the specific validation error.

**Validates: Requirements 5.8**

### Property 18: Error Message Descriptiveness

*For any* failed operation (save, update, delete), the system should return an error response containing a descriptive error message that explains what went wrong.

**Validates: Requirements 1.9, 2.7, 4.10**

### Property 19: Attendance Data Consistency

*For any* bulk attendance upload, all saved attendance records should maintain valid foreign key references to existing students and classes, ensuring referential integrity.

**Validates: Requirements 3.10**

### Property 20: Parsed Record Completeness

*For any* valid attendance file with N records, the parsing function should extract exactly N records with all required fields populated.

**Validates: Requirements 3.5**

## Error Handling

### Error Categories

1. **Validation Errors (400 Bad Request)**
   - Missing required fields
   - Invalid data formats
   - Out-of-range values
   - Duplicate records

2. **Authentication Errors (401 Unauthorized)**
   - Missing authentication token
   - Invalid or expired token
   - Token signature verification failure

3. **Authorization Errors (403 Forbidden)**
   - Insufficient permissions for operation
   - Accessing resources outside user's school
   - Role-based access control violations

4. **Not Found Errors (404 Not Found)**
   - Resource does not exist
   - Invalid ID in request
   - Deleted or archived records

5. **Conflict Errors (409 Conflict)**
   - Duplicate unique constraints
   - Concurrent modification conflicts
   - Referential integrity violations

6. **Server Errors (500 Internal Server Error)**
   - Database connection failures
   - Unexpected exceptions
   - File system errors

### Error Response Format

All error responses follow a consistent format:

```javascript
{
  success: false,
  error: "Brief error message",
  message: "Detailed explanation (optional)",
  details: {
    field: "Specific field error (optional)",
    code: "ERROR_CODE (optional)"
  }
}
```

### Frontend Error Handling

1. **Display User-Friendly Messages**
   - Convert technical errors to readable messages
   - Provide actionable guidance
   - Show retry options when appropriate

2. **Graceful Degradation**
   - Handle missing data without crashing
   - Show loading states during async operations
   - Provide fallback UI for errors

3. **Error Logging**
   - Log errors to console for debugging
   - Track error patterns for monitoring
   - Include context (user action, timestamp)

### Backend Error Handling

1. **Try-Catch Blocks**
   - Wrap async operations in try-catch
   - Log errors with stack traces
   - Return appropriate HTTP status codes

2. **Validation Middleware**
   - Validate request data before processing
   - Return early with validation errors
   - Use schema validation libraries

3. **Database Error Handling**
   - Handle constraint violations
   - Manage transaction rollbacks
   - Retry transient failures

4. **File Upload Error Handling**
   - Validate file size and type
   - Handle parsing errors gracefully
   - Clean up temporary files on error

## Testing Strategy

### Dual Testing Approach

The testing strategy employs both unit tests and property-based tests to ensure comprehensive coverage:

- **Unit Tests**: Verify specific examples, edge cases, and error conditions
- **Property Tests**: Verify universal properties across all inputs

Both approaches are complementary and necessary for comprehensive coverage. Unit tests catch concrete bugs in specific scenarios, while property tests verify general correctness across a wide range of inputs.

### Unit Testing

**Focus Areas:**
- Specific examples demonstrating correct behavior
- Integration points between components
- Edge cases and error conditions
- UI component rendering
- API endpoint responses

**Example Unit Tests:**
- Admin profile displays all registration fields
- Template update endpoint returns 200 on success
- Marks calculation returns correct grade for 85%
- Student not found returns 404 error
- Behavior tab displays records for specific student

**Testing Tools:**
- Frontend: Jest, React Testing Library
- Backend: Jest, Supertest
- Integration: Cypress or Playwright

### Property-Based Testing

**Configuration:**
- Minimum 100 iterations per property test (due to randomization)
- Each property test references its design document property
- Tag format: `Feature: admin-teacher-profile-improvements, Property {number}: {property_text}`

**Property Test Library:**
- JavaScript/TypeScript: fast-check

**Example Property Tests:**

```javascript
// Property 1: Profile Data Round-Trip Consistency
// Feature: admin-teacher-profile-improvements, Property 1: Profile Data Round-Trip Consistency
test('profile updates round-trip correctly', () => {
  fc.assert(
    fc.property(
      fc.record({
        fullName: fc.string(),
        phone: fc.string(),
        designation: fc.string(),
        address: fc.string()
      }),
      async (updates) => {
        const userId = await createTestUser();
        await updateProfile(userId, updates);
        const retrieved = await getProfile(userId);
        expect(retrieved).toMatchObject(updates);
      }
    ),
    { numRuns: 100 }
  );
});

// Property 7: Marks Calculation Correctness
// Feature: admin-teacher-profile-improvements, Property 7: Marks Calculation Correctness
test('marks calculation is correct', () => {
  fc.assert(
    fc.property(
      fc.integer({ min: 0, max: 100 }),
      fc.integer({ min: 1, max: 100 }),
      (marksObtained, totalMarks) => {
        fc.pre(marksObtained <= totalMarks);
        const percentage = calculatePercentage(marksObtained, totalMarks);
        const grade = calculateGrade(percentage);
        
        expect(percentage).toBe((marksObtained / totalMarks) * 100);
        expect(grade).toMatch(/^[A-E][+]?$/);
      }
    ),
    { numRuns: 100 }
  );
});

// Property 4: Input Validation Rejection
// Feature: admin-teacher-profile-improvements, Property 4: Input Validation Rejection
test('invalid data is rejected with error', () => {
  fc.assert(
    fc.property(
      fc.record({
        marksObtained: fc.integer({ min: -100, max: 200 }),
        totalMarks: fc.integer({ min: 1, max: 100 })
      }),
      async (data) => {
        fc.pre(data.marksObtained < 0 || data.marksObtained > data.totalMarks);
        const result = await saveMarks(data);
        expect(result.success).toBe(false);
        expect(result.error).toBeDefined();
      }
    ),
    { numRuns: 100 }
  );
});
```

### Integration Testing

**Scenarios:**
- Complete user workflows (login → navigate → perform action)
- Multi-step processes (upload file → parse → validate → save)
- Cross-component interactions
- API integration with frontend

**Example Integration Tests:**
- Admin registers → logs in → updates profile → verifies changes
- Teacher uploads attendance → system parses → displays summary
- Teacher enters marks → calculates grades → displays in UI
- Student profile loads → displays attendance → shows academic performance

### Test Data Management

**Strategies:**
1. **Test Fixtures**: Predefined test data for consistent scenarios
2. **Factories**: Generate test data programmatically
3. **Generators**: Random data generation for property tests
4. **Cleanup**: Reset database state between tests

### Testing Checklist

**Before Deployment:**
- [ ] All unit tests pass
- [ ] All property tests pass (100+ iterations each)
- [ ] Integration tests cover main workflows
- [ ] Error scenarios are tested
- [ ] Edge cases are covered
- [ ] Performance is acceptable
- [ ] Security vulnerabilities are addressed
- [ ] Accessibility standards are met

## Implementation Notes

### Database Migrations

**New Tables:**
- `marks` table for score management
- `behavior` table for behavior tracking

**Schema Updates:**
- Add profile fields to `users` table
- Add audit fields (createdAt, updatedAt) to all tables

**Migration Strategy:**
1. Create migration scripts for new tables
2. Add columns to existing tables with default values
3. Backfill data for existing records
4. Test migrations on development database
5. Apply migrations to production with backup

### API Versioning

All new endpoints follow the existing API structure:
- Base URL: `/api`
- Authentication: JWT Bearer token
- Response format: JSON with `success` field

### Frontend State Management

**Context API Usage:**
- User context for authentication state
- Profile context for user profile data
- Notification context for success/error messages

**Local State:**
- Form inputs and validation
- UI state (modals, loading, errors)
- Temporary data before submission

### File Upload Handling

**Frontend:**
- Use FormData for file uploads
- Show upload progress
- Validate file size and type client-side

**Backend:**
- Use multer middleware for file handling
- Store files temporarily during processing
- Clean up files after processing
- Limit file size (e.g., 5MB max)

### Performance Considerations

**Optimization Strategies:**
1. **Database Indexing**: Add indexes on frequently queried fields
2. **Pagination**: Implement pagination for large data sets
3. **Caching**: Cache frequently accessed data (user profiles, templates)
4. **Lazy Loading**: Load data on-demand rather than upfront
5. **Debouncing**: Debounce search and filter inputs

**Monitoring:**
- Track API response times
- Monitor database query performance
- Log slow operations for optimization

### Security Considerations

**Authentication:**
- JWT tokens with expiration
- Secure token storage (httpOnly cookies or secure localStorage)
- Token refresh mechanism

**Authorization:**
- Role-based access control
- Resource ownership validation
- School-level data isolation

**Input Validation:**
- Sanitize all user inputs
- Validate data types and formats
- Prevent SQL injection (use parameterized queries)
- Prevent XSS attacks (escape output)

**File Upload Security:**
- Validate file types (whitelist)
- Scan for malicious content
- Limit file sizes
- Store files outside web root

### Deployment Strategy

**Phases:**
1. **Phase 1**: Backend endpoints and database changes
2. **Phase 2**: Frontend components and UI improvements
3. **Phase 3**: Integration and testing
4. **Phase 4**: Production deployment

**Rollback Plan:**
- Database migration rollback scripts
- Feature flags for gradual rollout
- Backup before deployment
- Monitoring for errors post-deployment

### Documentation Requirements

**API Documentation:**
- Endpoint descriptions
- Request/response examples
- Error codes and messages
- Authentication requirements

**User Documentation:**
- Feature guides for admins and teachers
- Bulk upload template instructions
- Troubleshooting common issues

**Developer Documentation:**
- Architecture overview
- Code organization
- Testing guidelines
- Deployment procedures
