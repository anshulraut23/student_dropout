# Teacher Access Control Implementation

## Overview
This document describes the implementation of teacher access control that restricts teachers to only view and manage students from their assigned classes.

## Date Implemented
February 26, 2026

## Problem Statement
Previously, teachers could see ALL students in their school, regardless of whether they taught those students or not. This was a security and privacy issue.

## Solution
Teachers can now **only** access students from:
1. **Classes where they are the class incharge** (`classes.teacherId` matches the teacher's userId)
2. **Classes where they teach subjects** (`subjects.teacherId` matches the teacher's userId)

## Implementation Details

### New Utility Module
Created `backend/utils/teacherAccessControl.js` with the following functions:

- **`getTeacherAccessibleClassIds(dataStore, teacherId, schoolId)`**
  - Returns a Set of all class IDs the teacher can access
  - Checks both incharge assignments and subject teaching assignments

- **`canTeacherAccessClass(dataStore, teacherId, classId, schoolId)`**
  - Returns boolean indicating if teacher has access to a specific class

- **`canTeacherAccessStudent(dataStore, teacherId, studentId, schoolId)`**
  - Returns boolean indicating if teacher has access to a specific student

- **`filterStudentsByTeacherAccess(dataStore, students, teacherId, schoolId)`**
  - Filters an array of students to only those accessible by the teacher

- **`getTeacherAccessDetails(dataStore, teacherId, schoolId)`**
  - Returns detailed information about a teacher's access (for debugging/admin purposes)

### Updated Controllers

#### 1. Student Controller (`backend/controllers/studentController.js`)
**Modified Functions:**
- `getStudents()` - Now filters students by teacher's accessible classes
- `getStudentById()` - Checks if teacher has access before returning student
- `createStudent()` - Verifies teacher has access to the class before adding student
- `createStudentsBulk()` - Verifies teacher has access to the class for bulk upload
- `updateStudent()` - Checks teacher access before allowing updates
- `deleteStudent()` - Checks teacher access before allowing deletion/deactivation

**Example:**
```javascript
// Before: Teachers could see all students in school
const schoolClasses = await dataStore.getClassesBySchool(schoolId);
const schoolClassIds = new Set(schoolClasses.map(c => c.id));
students = allStudents.filter(s => schoolClassIds.has(s.classId));

// After: Teachers only see their students
if (role === 'teacher') {
  const teacherAccessibleClassIds = await getTeacherAccessibleClassIds(dataStore, userId, schoolId);
  students = students.filter(s => teacherAccessibleClassIds.has(s.classId));
}
```

#### 2. Behavior Controller (`backend/controllers/behaviorController.js`)
**Modified Functions:**
- `getBehaviors()` - Filters behavior records to only students in teacher's classes
- `getBehaviorById()` - Checks teacher access before returning behavior record
- `createBehavior()` - Verifies teacher has access to student before creating behavior record

**Changes:**
- Removed logic that only showed teacher's own behavior records
- Now shows ALL behavior records for students in teacher's classes
- Teachers can see behavior recorded by any teacher for their students

#### 3. Intervention Controller (`backend/controllers/interventionController.js`)
**Modified Functions:**
- `getInterventions()` - Filters interventions to only students in teacher's classes
- `getInterventionById()` - Checks teacher access before returning intervention
- `createIntervention()` - Verifies teacher has access to student before creating intervention

**Bug Fixed:**
- Fixed incorrect check `student.schoolId !== schoolId` (students don't have schoolId directly)
- Now properly checks via `classData.schoolId`

#### 4. Risk Controller (`backend/ml-integration/riskController.js`)
**Modified Functions:**
- `getStudentRisk()` - Checks if teacher has access to student before returning risk prediction
- `getClassRisk()` - Checks if teacher has access to class before returning risk predictions

**Changes:**
- Added import of teacherAccessControl utility functions
- Added role-based checks before processing requests

## Access Control Matrix

| Resource | Admin Access | Teacher Access |
|----------|-------------|----------------|
| Students | All in school | Only in their classes (incharge or subject teacher) |
| Attendance | All in school | Only their classes (marking restricted per attendance mode) |
| Marks | All in school | Only for exams in their subjects |
| Behavior Records | All in school | Only students in their classes |
| Interventions | All in school | Only students in their classes |
| Risk Predictions | All in school | Only students in their classes |

## Teacher Class Assignment Logic

### A teacher has access to a class if:
```javascript
// Option 1: Teacher is the class incharge
class.teacherId === teacher.id

// OR Option 2: Teacher teaches at least one subject in the class
subjects.some(subject => 
  subject.classId === class.id && 
  subject.teacherId === teacher.id
)
```

### Example Scenarios

**Scenario 1: Class Incharge**
- Teacher A is incharge of Class 10-A
- Teacher A can see all students in Class 10-A
- Teacher A can view/create behavior records, interventions for all Class 10-A students

**Scenario 2: Subject Teacher**
- Teacher B teaches Mathematics in Class 10-A and Class 10-B
- Teacher B can see all students in BOTH classes
- Teacher B can view/create behavior records, interventions for students in both classes

**Scenario 3: Both Incharge and Subject Teacher**
- Teacher C is incharge of Class 10-A
- Teacher C also teaches Science in Class 10-B
- Teacher C can see students from both Class 10-A and Class 10-B

**Scenario 4: No Assignment**
- Teacher D has no class incharge assignment and no subject assignments
- Teacher D can see NO students
- Teacher D's dashboard will show empty lists

## Testing Recommendations

### Test Case 1: Basic Access Control
1. Login as Teacher A (incharge of Class 10-A only)
2. Navigate to Students page
3. Verify only Class 10-A students are shown
4. Try to access a student from Class 10-B via URL
5. Should receive 403 Forbidden

### Test Case 2: Subject Teacher Access
1. Login as Teacher B (teaches Math in Classes 10-A, 10-B, 10-C)
2. Navigate to Students page
3. Verify students from all three classes are shown
4. Filter by class - should work for all three classes

### Test Case 3: Mixed Access
1. Login as Teacher C (incharge of 10-A, teaches Science in 10-B)
2. Navigate to Students page
3. Verify students from both classes are shown
4. Create behavior record for student in 10-A - should succeed
5. Create behavior record for student in 10-B - should succeed
6. Try to access student in 10-C - should fail with 403

### Test Case 4: API Access Control
Test all endpoints:
```bash
# As Teacher A (only has access to Class 10-A)
GET /api/students  # Should return only 10-A students
GET /api/students/:id  # Should fail for non-10-A students
POST /api/students  # Should fail if classId is not 10-A
GET /api/behavior  # Should return only behavior for 10-A students
GET /api/interventions  # Should return only interventions for 10-A students
GET /api/ml/risk/student/:id  # Should fail for non-10-A students
```

## Frontend Impact

**No frontend changes required!** The frontend already:
- Calls the backend APIs which now properly filter data
- Displays whatever data the backend returns
- Shows "No students found" if teacher has no class assignments

The frontend `StudentListPage.jsx` calls:
1. `apiService.getMyClasses()` - Already returns only teacher's classes
2. `apiService.getStudents()` - Now returns only accessible students

## Database Schema (Reference)

### Classes Table
```sql
CREATE TABLE classes (
  id TEXT PRIMARY KEY,
  schoolId TEXT NOT NULL,
  name TEXT NOT NULL,
  grade TEXT NOT NULL,
  teacherId TEXT,  -- Class incharge
  -- other fields...
  FOREIGN KEY (teacherId) REFERENCES users(id)
);
```

### Subjects Table
```sql
CREATE TABLE subjects (
  id TEXT PRIMARY KEY,
  schoolId TEXT NOT NULL,
  classId TEXT NOT NULL,
  name TEXT NOT NULL,
  teacherId TEXT,  -- Subject teacher
  -- other fields...
  FOREIGN KEY (teacherId) REFERENCES users(id)
);
```

### Students Table
```sql
CREATE TABLE students (
  id TEXT PRIMARY KEY,
  classId TEXT NOT NULL,  -- Note: No direct schoolId!
  name TEXT NOT NULL,
  enrollmentNo TEXT NOT NULL,
  -- other fields...
  FOREIGN KEY (classId) REFERENCES classes(id)
);
```

## Performance Considerations

### Query Optimization
The access control adds 2 additional queries per request:
1. `getClassesBySchool()` - To find incharge classes
2. `getSubjectsBySchool()` - To find subject teaching classes

**Optimization applied:**
- Access check is done ONCE per request and cached in a Set
- Filtering is done in-memory using the cached Set
- No additional queries per student

### Example Request Flow
```
Teacher requests students list:
1. Authentication middleware runs
2. getStudents() controller called
3. IF teacher role:
   a. Query classes once → find incharge classes
   b. Query subjects once → find teaching classes  
   c. Build Set of accessible class IDs
   d. Filter students using Set (O(n) time)
4. Return filtered students
```

## Security Notes

- **Admins bypass all checks** - They can see all students in their school
- **Teachers CANNOT** see students from other schools (even if class IDs match)
- **School isolation** is enforced at database level (schoolId checks)
- **URL manipulation protection** - Direct API access with student IDs is blocked
- **Frontend routing** doesn't matter - Backend enforces all access control

## Rollback Plan

If issues occur, rollback can be done by:

1. Revert `studentController.js` to remove `getTeacherAccessibleClassIds` calls
2. Revert `behaviorController.js` and `interventionController.js` 
3. Delete `teacherAccessControl.js` utility file
4. Restart backend server

The system will return to previous behavior where teachers see all school students.

## Future Enhancements

1. **Caching**: Cache teacher access data in memory/Redis for better performance
2. **Audit Logging**: Log all access attempts for security auditing
3. **Fine-grained permissions**: Allow per-subject permissions (e.g., view-only for certain subjects)
4. **Parent access**: Extend similar logic for parent users (they should only see their children)
5. **Class transfer**: Handle edge cases when students transfer between classes mid-year

## Related Documentation

- [Teacher Management System](docs/TEACHER_MANAGEMENT.md)
- [Class Management](docs/CLASS_MANAGEMENT.md)
- [Subject Management](docs/SUBJECT_MANAGEMENT.md)
- [Student Management](docs/STUDENT_MANAGEMENT.md)

## Contact

For questions or issues with this implementation, refer to this document or check the code comments in:
- `backend/utils/teacherAccessControl.js`
- Modified controller files
