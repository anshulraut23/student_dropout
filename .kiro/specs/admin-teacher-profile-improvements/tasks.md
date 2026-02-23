# Implementation Plan: Admin Teacher Profile Improvements

## Overview

This implementation plan breaks down the admin-teacher-profile-improvements feature into discrete, actionable coding tasks. The plan follows an incremental approach, building functionality step-by-step with testing integrated throughout. Each task builds on previous work, ensuring no orphaned code and maintaining system integrity.

## Tasks

- [x] 1. Set up database schema and migrations
  - Create migration script for new `marks` table with fields: id, examId, studentId, marksObtained, totalMarks, percentage, grade, status, remarks, enteredBy, verifiedBy, isVerified, createdAt, updatedAt
  - Create migration script for new `behavior` table with fields: id, studentId, teacherId, date, behaviorType, severity, category, description, actionTaken, followUpRequired, followUpDate, createdAt, updatedAt
  - Add profile fields to `users` table: phone, designation, address, city, state, pincode, profilePicture
  - Add audit fields (createdAt, updatedAt) to tables missing them
  - Run migrations on development database and verify schema
  - _Requirements: 1.2, 1.6, 1.7, 4.7, 4.8, 6.6, 6.7_

- [ ] 2. Implement backend profile management endpoints
  - [x] 2.1 Create profile routes file (`backend/routes/profileRoutes.js`)
    - Define GET `/api/profile` route for current user profile
    - Define PUT `/api/profile` route for updating current user profile
    - Define GET `/api/profile/:userId` route for admin access to any profile
    - Add authentication middleware to all routes
    - _Requirements: 1.1, 1.4_
  
  - [x] 2.2 Create profile controller (`backend/controllers/profileController.js`)
    - Implement `getProfile` function to retrieve current user profile with school data
    - Implement `updateProfile` function with validation and database update
    - Implement `getProfileById` function with authorization check
    - Add error handling for not found and validation errors
    - _Requirements: 1.2, 1.4, 1.5, 1.9_
  
  - [x] 2.3 Create profile service (`backend/services/profileService.js`)
    - Implement `getUserProfile` function to fetch user and school data
    - Implement `updateUserProfile` function with field validation
    - Implement `validateProfileData` function for required fields
    - Add helper functions for data transformation
    - _Requirements: 1.4, 1.5_
  
  - [ ]* 2.4 Write property test for profile round-trip consistency
    - **Property 1: Profile Data Round-Trip Consistency**
    - **Validates: Requirements 1.4**
  
  - [ ]* 2.5 Write unit tests for profile endpoints
    - Test GET /api/profile returns current user data
    - Test PUT /api/profile updates and returns updated data
    - Test validation errors for missing required fields
    - Test authorization for admin-only routes
    - _Requirements: 1.2, 1.4, 1.5, 1.9_

- [ ] 3. Fix exam template update functionality
  - [x] 3.1 Verify and fix template update route
    - Check `PUT /api/exam-templates/:templateId` route definition
    - Ensure templateId is correctly extracted from req.params
    - Add logging to track update requests
    - _Requirements: 2.3, 2.4_
  
  - [x] 3.2 Fix template controller update method
    - Verify `updateTemplate` function in examTemplateController.js
    - Ensure proper parameter extraction and validation
    - Add error handling and descriptive error messages
    - Return updated template in response
    - _Requirements: 2.3, 2.5, 2.7_
  
  - [x] 3.3 Fix template service update method
    - Verify `updateTemplate` function in examTemplateService.js
    - Ensure dataStore.updateExamTemplate() persists to SQLite
    - Update lastModified timestamp on every update
    - Validate referential integrity for templates used in exams
    - _Requirements: 2.3, 2.8, 2.9_
  
  - [ ]* 3.4 Write property test for template round-trip consistency
    - **Property 2: Template Round-Trip Consistency**
    - **Validates: Requirements 2.1, 2.2, 2.3**
  
  - [ ]* 3.5 Write property test for referential integrity
    - **Property 11: Referential Integrity Preservation**
    - **Validates: Requirements 2.8**
  
  - [ ]* 3.6 Write unit tests for template update
    - Test successful template update returns updated data
    - Test validation errors for invalid data
    - Test cannot delete template used in exams
    - Test timestamp updates on modification
    - _Requirements: 2.3, 2.5, 2.7, 2.8, 2.9_

- [ ] 4. Checkpoint - Verify profile and template functionality
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 5. Implement bulk attendance upload functionality
  - [ ] 5.1 Create attendance template generation endpoint
    - Add GET `/api/attendance/template` route
    - Implement controller function to generate Excel/CSV template
    - Include columns: Enrollment Number, Student Name, Date, Status
    - Return file download response
    - _Requirements: 3.1, 3.2_
  
  - [ ] 5.2 Create file parser utility (`backend/utils/fileParser.js`)
    - Implement `parseExcelFile` function using xlsx library
    - Implement `parseCSVFile` function
    - Implement `validateFileFormat` function
    - Add error handling for malformed files
    - _Requirements: 3.4, 3.5_
  
  - [ ] 5.3 Create bulk attendance upload endpoint
    - Add POST `/api/attendance/bulk-upload` route with multer middleware
    - Implement controller function to handle file upload
    - Parse uploaded file and extract attendance records
    - Validate each record against student database
    - Check for duplicate student/date combinations
    - Save valid records in single transaction
    - Return summary with success/failed counts and error details
    - Clean up temporary files
    - _Requirements: 3.4, 3.5, 3.6, 3.7, 3.8, 3.9, 3.10, 3.11_
  
  - [ ]* 5.4 Write property test for template format compatibility
    - **Property 3: Attendance Template Format Compatibility**
    - **Validates: Requirements 3.3**
  
  - [ ]* 5.5 Write property test for bulk upload atomicity
    - **Property 5: Bulk Attendance Upload Atomicity**
    - **Validates: Requirements 3.7, 3.8**
  
  - [ ]* 5.6 Write property test for duplicate detection
    - **Property 6: Attendance Duplicate Detection**
    - **Validates: Requirements 3.11**
  
  - [ ]* 5.7 Write unit tests for bulk attendance upload
    - Test template download returns valid file
    - Test file parsing extracts all records
    - Test validation rejects invalid student IDs
    - Test duplicate detection
    - Test transaction rollback on error
    - Test summary response format
    - _Requirements: 3.1, 3.4, 3.5, 3.6, 3.7, 3.8, 3.9, 3.11_

- [ ] 6. Implement score management system backend
  - [ ] 6.1 Create marks service (`backend/services/marksService.js`)
    - Implement `createMarksRecord` function with validation
    - Implement `createBulkMarks` function with transaction support
    - Implement `calculateGrade` function based on percentage
    - Implement `calculatePercentage` function
    - Implement `validateMarksData` function
    - Implement `getMarksByExam` function
    - Implement `getMarksByStudent` function with filters
    - Implement `updateMarksRecord` function
    - Implement `deleteMarksRecord` function
    - _Requirements: 4.1, 4.7, 4.8, 4.11_
  
  - [ ] 6.2 Verify and fix marks controller
    - Verify `enterSingleMarks` function in marksController.js
    - Verify `enterBulkMarks` function processes arrays correctly
    - Ensure proper error handling and descriptive messages
    - Add audit trail (enteredBy, timestamps)
    - Return success summary with counts
    - _Requirements: 4.2, 4.9, 4.10, 4.12_
  
  - [ ]* 6.3 Write property test for marks calculation correctness
    - **Property 7: Marks Calculation Correctness**
    - **Validates: Requirements 4.7, 4.8**
  
  - [ ]* 6.4 Write property test for marks range validation
    - **Property 8: Marks Range Validation**
    - **Validates: Requirements 4.1**
  
  - [ ]* 6.5 Write property test for bulk marks entry
    - **Property 9: Bulk Marks Entry Success**
    - **Validates: Requirements 4.11**
  
  - [ ]* 6.6 Write unit tests for marks management
    - Test single marks entry saves correctly
    - Test bulk marks entry processes all records
    - Test grade calculation for various percentages
    - Test validation rejects out-of-range marks
    - Test audit trail fields are populated
    - _Requirements: 4.1, 4.7, 4.8, 4.9, 4.11, 4.12_

- [ ] 7. Checkpoint - Verify attendance and marks backend functionality
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 8. Implement behavior tracking backend
  - [ ] 8.1 Create behavior routes (`backend/routes/behaviorRoutes.js`)
    - Define POST `/api/behavior` route for creating behavior records
    - Define GET `/api/behavior/student/:studentId` route for student behavior history
    - Define GET `/api/behavior` route with filters (date range, type, severity)
    - Define PUT `/api/behavior/:behaviorId` route for updates
    - Define DELETE `/api/behavior/:behaviorId` route for deletion
    - Add authentication and authorization middleware
    - _Requirements: 6.1, 6.2, 6.3, 6.4_
  
  - [ ] 8.2 Create behavior controller (`backend/controllers/behaviorController.js`)
    - Implement `createBehaviorRecord` function with validation
    - Implement `getBehaviorRecords` function with filtering
    - Implement `getStudentBehaviorRecords` function with sorting
    - Implement `updateBehaviorRecord` function preserving createdAt
    - Implement `deleteBehaviorRecord` function
    - Add error handling for all operations
    - _Requirements: 6.5, 6.6, 6.8, 6.9_
  
  - [ ] 8.3 Create behavior service (`backend/services/behaviorService.js`)
    - Implement `createBehavior` function with field validation
    - Implement `getBehaviorsByStudent` function with date sorting
    - Implement `getBehaviors` function with filters
    - Implement `updateBehavior` function maintaining timestamps
    - Implement `deleteBehavior` function
    - Implement `validateBehaviorData` function for required fields
    - _Requirements: 6.6, 6.7, 6.8, 6.9, 6.11_
  
  - [ ]* 8.4 Write property test for behavior record chronological ordering
    - **Property 12: Behavior Record Chronological Ordering**
    - **Validates: Requirements 6.8**
  
  - [ ]* 8.5 Write property test for behavior record association
    - **Property 13: Behavior Record Association**
    - **Validates: Requirements 6.7**
  
  - [ ]* 8.6 Write unit tests for behavior tracking
    - Test behavior record creation with all required fields
    - Test records are returned in reverse chronological order
    - Test validation rejects missing required fields
    - Test foreign key associations are correct
    - Test createdAt is preserved on update
    - _Requirements: 6.5, 6.6, 6.7, 6.8, 6.9, 6.11_

- [ ] 9. Fix teacher and student profile endpoints
  - [ ] 9.1 Create/enhance teacher profile endpoint
    - Add GET `/api/teachers/:teacherId` route if missing
    - Implement controller to fetch teacher with subjects and classes
    - Include personal information and professional details
    - Add error handling for teacher not found
    - _Requirements: 7.1, 7.2, 7.3, 7.4_
  
  - [ ] 9.2 Fix student profile endpoint
    - Verify GET `/api/students/:studentId` route exists
    - Enhance controller to include attendance summary
    - Enhance controller to include academic performance summary
    - Fix "student not found" error handling with descriptive message
    - Handle missing or incomplete data gracefully
    - _Requirements: 7.5, 7.6, 7.7, 7.8, 7.9_
  
  - [ ]* 9.3 Write property test for profile data completeness
    - **Property 14: Profile Data Completeness**
    - **Validates: Requirements 7.3, 7.7, 7.9**
  
  - [ ]* 9.4 Write property test for authentication enforcement
    - **Property 15: Authentication and Authorization Enforcement**
    - **Validates: Requirements 7.12**
  
  - [ ]* 9.5 Write unit tests for profile endpoints
    - Test teacher profile returns complete data
    - Test student profile returns complete data with summaries
    - Test 404 error for non-existent profiles
    - Test authentication is required
    - Test authorization is enforced
    - _Requirements: 7.1, 7.3, 7.4, 7.5, 7.7, 7.8, 7.12_

- [ ] 10. Checkpoint - Verify all backend endpoints
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 11. Implement frontend admin profile management
  - [ ] 11.1 Enhance AdminProfile.jsx component
    - Add state management for profile data and edit mode
    - Implement data fetching from GET `/api/profile` on mount
    - Create form fields for all profile information (personal and school)
    - Add edit mode toggle button
    - Implement form validation for required fields
    - Implement save handler calling PUT `/api/profile`
    - Add success/error message display
    - Add loading states
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7, 1.8, 1.9_
  
  - [ ] 11.2 Update navigation to link profile icon to profile page
    - Add onClick handler to profile icon/name in navigation
    - Navigate to `/admin/profile` route
    - _Requirements: 1.1_
  
  - [ ]* 11.3 Write integration tests for admin profile flow
    - Test profile page loads and displays data
    - Test edit mode enables form fields
    - Test save updates profile and shows success message
    - Test validation errors are displayed
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.8, 1.9_

- [ ] 12. Fix frontend exam template update
  - [ ] 12.1 Fix ExamTemplateManagement.jsx update handler
    - Verify edit button loads template data into form
    - Ensure update handler calls PUT `/api/exam-templates/:templateId` with correct ID
    - Add proper error handling and user feedback
    - Refresh template list after successful update
    - Display success message on successful update
    - Display error message on failure
    - _Requirements: 2.2, 2.3, 2.6, 2.7_
  
  - [ ]* 12.2 Write integration tests for template update
    - Test edit loads template data
    - Test update saves changes
    - Test success message is displayed
    - Test template list refreshes
    - _Requirements: 2.2, 2.3, 2.6_

- [ ] 13. Implement frontend bulk attendance upload
  - [ ] 13.1 Create BulkAttendanceUpload component
    - Add template download button calling GET `/api/attendance/template`
    - Add file input for Excel/CSV upload
    - Implement file validation (type, size)
    - Add upload button calling POST `/api/attendance/bulk-upload`
    - Display upload progress indicator
    - Display results summary (success/failed counts)
    - Display error details for failed records
    - Add styling and responsive layout
    - _Requirements: 3.1, 3.4, 3.8, 3.9_
  
  - [ ] 13.2 Integrate bulk upload into attendance management page
    - Add "Bulk Upload" button to attendance page
    - Open BulkAttendanceUpload component in modal
    - Refresh attendance list after successful upload
    - _Requirements: 3.1_
  
  - [ ]* 13.3 Write integration tests for bulk upload flow
    - Test template download works
    - Test file upload processes correctly
    - Test results summary is displayed
    - Test error messages are shown for failures
    - _Requirements: 3.1, 3.4, 3.8, 3.9_

- [ ] 14. Fix frontend marks entry page
  - [ ] 14.1 Fix MarksEntryPage.jsx save functionality
    - Verify save button calls POST `/api/marks/bulk` with correct data
    - Ensure marks validation happens before submission
    - Add proper error handling for save failures
    - Display success message after successful save
    - Display error message with details on failure
    - Refresh marks display after save
    - _Requirements: 4.2, 4.9, 4.10_
  
  - [ ] 14.2 Add real-time grade calculation display
    - Calculate and display grade as marks are entered
    - Calculate and display percentage
    - Update UI immediately on input change
    - _Requirements: 4.7, 4.8_
  
  - [ ]* 14.3 Write integration tests for marks entry
    - Test marks entry saves correctly
    - Test grade calculation displays correctly
    - Test validation prevents invalid marks
    - Test success/error messages display
    - _Requirements: 4.2, 4.7, 4.8, 4.9, 4.10_

- [ ] 15. Checkpoint - Verify frontend core functionality
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 16. Improve attendance history UI
  - [ ] 16.1 Enhance AttendanceHistoryPage.jsx layout
    - Improve table formatting with proper columns and headers
    - Add responsive design for mobile devices
    - Implement filter bar with date range and class selectors
    - Add visual indicators for attendance percentages (color coding)
    - Improve modal for detailed student-level view
    - Add export to Excel functionality
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5_
  
  - [ ]* 16.2 Write property test for filter effectiveness
    - **Property 16: Attendance Filter Effectiveness**
    - **Validates: Requirements 5.3**
  
  - [ ]* 16.3 Write unit tests for attendance history UI
    - Test table renders with correct columns
    - Test filters reduce displayed records
    - Test visual indicators display correctly
    - Test detail modal shows student data
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5_

- [ ] 17. Improve template creation UI
  - [ ] 17.1 Enhance ExamTemplateManagement.jsx form layout
    - Reorganize form into logical sections (Basic Info, Marks, Weightage)
    - Add clear labels and descriptions for all fields
    - Implement inline validation feedback
    - Add tooltips for complex fields (e.g., weightage explanation)
    - Improve responsive layout for mobile devices
    - Add form preview before save
    - _Requirements: 5.6, 5.7, 5.8, 5.9, 5.10_
  
  - [ ]* 17.2 Write property test for inline validation
    - **Property 17: Inline Validation Feedback**
    - **Validates: Requirements 5.8**
  
  - [ ]* 17.3 Write unit tests for template creation UI
    - Test form sections are properly organized
    - Test inline validation displays errors
    - Test tooltips are present
    - Test responsive layout on different screen sizes
    - _Requirements: 5.6, 5.8, 5.9, 5.10_

- [ ] 18. Implement frontend behavior tab
  - [ ] 18.1 Create BehaviorTab component
    - Display list of behavior records for selected student
    - Implement date range filter
    - Implement type and severity filters
    - Add "Add Behavior" button opening form modal
    - Display records in reverse chronological order
    - Add edit and delete actions for each record
    - _Requirements: 6.5, 6.8_
  
  - [ ] 18.2 Create BehaviorForm component
    - Add date picker field
    - Add behavior type selector (positive, neutral, negative)
    - Add severity selector (low, medium, high)
    - Add category input
    - Add description textarea
    - Add action taken field
    - Add follow-up checkbox and date
    - Implement form validation
    - Implement submit handler calling POST `/api/behavior`
    - Implement update handler calling PUT `/api/behavior/:behaviorId`
    - _Requirements: 6.6, 6.9_
  
  - [ ] 18.3 Integrate behavior tab into student profile page
    - Add "Behavior" tab to StudentProfilePage.jsx
    - Load BehaviorTab component when tab is selected
    - Pass student ID to BehaviorTab
    - _Requirements: 6.5_
  
  - [ ]* 18.4 Write integration tests for behavior tracking
    - Test behavior tab displays records
    - Test records are in chronological order
    - Test add behavior form works
    - Test edit behavior preserves createdAt
    - Test filters work correctly
    - _Requirements: 6.5, 6.6, 6.8, 6.9_

- [ ] 19. Fix frontend teacher and student profiles
  - [ ] 19.1 Fix ProfilePage.jsx (teacher profile)
    - Replace mock data with API call to GET `/api/teachers/:teacherId`
    - Display personal information from API response
    - Display subjects taught and classes assigned
    - Add loading state while fetching data
    - Add error state with user-friendly message
    - Handle missing data gracefully
    - _Requirements: 7.1, 7.3, 7.4, 7.9_
  
  - [ ] 19.2 Fix StudentProfilePage.jsx
    - Replace mock data with API call to GET `/api/students/:studentId`
    - Display personal information from API response
    - Display attendance summary from API response
    - Display academic performance from API response
    - Fix "student not found" error display with navigation back
    - Add loading state while fetching data
    - Handle missing or incomplete data without crashing
    - _Requirements: 7.5, 7.7, 7.8, 7.9_
  
  - [ ]* 19.3 Write integration tests for profile pages
    - Test teacher profile loads and displays data
    - Test student profile loads and displays data
    - Test "student not found" error displays correctly
    - Test loading states display
    - Test error handling works
    - _Requirements: 7.1, 7.3, 7.4, 7.5, 7.7, 7.8, 7.9_

- [ ] 20. Final integration and testing
  - [ ] 20.1 Run all unit tests and fix any failures
    - Execute test suite for backend
    - Execute test suite for frontend
    - Fix any failing tests
    - Ensure code coverage meets standards
  
  - [ ] 20.2 Run all property tests and fix any failures
    - Execute all property tests with 100+ iterations
    - Investigate and fix any property violations
    - Verify all properties pass consistently
  
  - [ ] 20.3 Perform end-to-end integration testing
    - Test complete admin profile workflow
    - Test complete template update workflow
    - Test complete bulk attendance upload workflow
    - Test complete marks entry workflow
    - Test complete behavior tracking workflow
    - Test complete profile viewing workflows
    - Verify all UI improvements are functional
  
  - [ ] 20.4 Test error scenarios and edge cases
    - Test all validation errors display correctly
    - Test authentication and authorization enforcement
    - Test handling of missing or incomplete data
    - Test file upload error scenarios
    - Test concurrent operations and race conditions
  
  - [ ] 20.5 Performance and security review
    - Check API response times are acceptable
    - Verify database queries are optimized
    - Test file upload size limits
    - Verify input sanitization
    - Check for SQL injection vulnerabilities
    - Verify XSS protection

- [ ] 21. Final checkpoint - Production readiness
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional testing tasks and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation throughout implementation
- Property tests validate universal correctness properties with 100+ iterations
- Unit tests validate specific examples and edge cases
- Integration tests validate end-to-end workflows
- All backend changes should be tested before frontend integration
- Database migrations should be tested on development environment first
- File uploads should be tested with various file formats and sizes
- Error handling should be comprehensive and user-friendly
