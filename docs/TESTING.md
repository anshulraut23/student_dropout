# Testing Guide

## Quick Start

### Run All Tests
```bash
cd backend
node clear-attendance.js && node test-attendance-system.js
```

## Test Scripts

### 1. Clear Attendance
```bash
cd backend
node clear-attendance.js
```
Clears all attendance records from the database.

### 2. Comprehensive Test Suite
```bash
cd backend
node test-attendance-system.js
```
Runs 35+ automated tests covering all attendance functionality.

## Test Coverage

✅ Daily attendance marking
✅ Subject-wise attendance marking  
✅ Update existing attendance
✅ Multiple dates and subjects
✅ Attendance statistics
✅ Date-specific queries
✅ Edge cases and error handling

## Expected Output

```
Total Tests: 35
Passed: 35
Failed: 0
Pass Rate: 100.0%

🎉 ALL TESTS PASSED! 🎉
```

## Test Data

Use the test data created by `add-test-data.js`:
- 1 school
- 4 teachers  
- 4 classes (2 daily, 2 subject-wise)
- 10 subjects
- 20 students

### Create Test Data
```bash
cd backend
node add-test-data.js
```

### View Test Data
```bash
cd backend
node show-test-data.js
```

## Manual UI Testing

After automated tests pass:

1. Start servers:
   ```bash
   # Terminal 1 - Backend
   cd backend
   npm run dev
   
   # Terminal 2 - Frontend  
   cd proactive-education-assistant
   npm run dev
   ```

2. Login as teacher:
   - Email: `teacher1@school.com`
   - Password: `admin123`

3. Test scenarios:
   - Mark new attendance
   - Edit existing attendance
   - Test subject-wise attendance
   - Verify banner display
   - Test validation messages

## Troubleshooting

### Database Locked
Stop the backend server before running tests.

### No Test Data
Run `node add-test-data.js` to create test data.

### Tests Failing
Check error messages and fix issues before proceeding.

---

For detailed testing documentation, see `ATTENDANCE_SYSTEM.md`.
