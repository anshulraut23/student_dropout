# Testing Guide

This guide will help you test all the implemented features to ensure everything is working correctly.

---

## Prerequisites

Before testing, ensure:

1. ✅ Backend server is running on port 5000
   ```bash
   cd backend
   npm start
   ```

2. ✅ Frontend is running on port 5173
   ```bash
   cd proactive-education-assistant
   npm run dev
   ```

3. ✅ You have test accounts:
   - Admin account
   - Teacher account
   - Some test students in the database

---

## Test Scenarios

### 1. Admin Profile Management

**Steps:**
1. Login as admin at `/admin/login`
2. You should see the admin dashboard
3. Look at the top-right corner - you'll see the admin name/icon
4. Click on the admin name or icon
5. You should be redirected to `/admin/profile`
6. Verify you can see:
   - Name
   - Email
   - Phone
   - School name
   - Other profile fields
7. Click "Edit Profile" button
8. Modify some fields (e.g., phone number)
9. Click "Save Changes"
10. Verify success message appears
11. Refresh the page
12. Verify changes are persisted

**Expected Results:**
- ✅ Profile page loads without errors
- ✅ All fields display correctly
- ✅ Edit mode allows modifications
- ✅ Changes are saved successfully
- ✅ Success message is displayed
- ✅ Changes persist after refresh

**If it fails:**
- Check browser console for errors
- Check backend console for errors
- Verify backend is running on port 5000
- Check Network tab in browser DevTools

---

### 2. Exam Template Update

**Steps:**
1. Login as admin
2. Navigate to "Exam Templates" from sidebar
3. You should see a list of exam templates
4. Click "Edit" button on any template
5. Modal should open with pre-filled data
6. Modify some fields:
   - Change template name
   - Modify total marks
   - Change passing marks
7. Click "Update Template"
8. Verify success message
9. Close modal
10. Verify template list shows updated data

**Expected Results:**
- ✅ Edit modal opens with correct data
- ✅ All fields are editable
- ✅ Update saves successfully
- ✅ Success message is displayed
- ✅ Template list refreshes with new data

**If it fails:**
- Check if backend endpoint exists: `PUT /api/exam-templates/:id`
- Check browser console for errors
- Verify modal is calling the correct API

---

### 3. Score Entry (Data Entry Page)

**Steps:**
1. Login as teacher
2. Navigate to "Data Entry" from sidebar
3. Click on "Scores" tab
4. Select a class from dropdown
5. Select an exam
6. Select a subject
7. Student list should load
8. Enter marks for some students:
   - Enter marks obtained
   - Status should auto-calculate
   - Grade should auto-calculate
9. Click "Save Scores"
10. Verify success message

**Expected Results:**
- ✅ Class, exam, and subject dropdowns work
- ✅ Student list loads correctly
- ✅ Marks can be entered
- ✅ Grades calculate automatically
- ✅ Save works without errors
- ✅ Success message is displayed

**Common Issues:**
- If you see "Failed to save scores" error:
  - Check backend is running
  - Check browser console for the exact error
  - Verify endpoint is `/api/marks/bulk` (not `/api/performance/bulk`)

---

### 4. Behavior Records

**Steps:**
1. Login as teacher
2. Navigate to "Data Entry"
3. Click on "Behavior" tab
4. Click "Add Behavior Record" button
5. Fill in the form:
   - Select student
   - Select date
   - Select behavior type (positive/negative)
   - Enter description
   - Add remarks
6. Click "Save"
7. Verify success message
8. Verify record appears in the list

**Expected Results:**
- ✅ Form opens correctly
- ✅ All fields are functional
- ✅ Save works without errors
- ✅ Record appears in list
- ✅ Can view/edit/delete records

**If it fails:**
- Check if `apiService.createBehaviourRecord` exists
- Check backend endpoint: `POST /api/behavior`
- Check browser console for errors

---

### 5. Score History Page

**Steps:**
1. Login as teacher
2. Look at the sidebar navigation
3. You should see "Score History" link (with chart icon)
4. Click on "Score History"
5. Page should load with exam scores
6. Try filters:
   - Select a class
   - Select a subject
   - Set date range
   - Use search box
7. Click "View" on any record
8. Modal should open with detailed scores
9. Close modal
10. Click "Export" button
11. Excel file should download

**Expected Results:**
- ✅ Score History link appears in sidebar
- ✅ Page loads without errors
- ✅ Exam scores are displayed
- ✅ Filters work correctly
- ✅ Detail modal shows student scores
- ✅ Export downloads Excel file

**If it fails:**
- Check if route `/score-history` exists in AppRoutes.jsx
- Check if ScoreHistoryPage.jsx exists
- Check if MainLayout.jsx has the navigation link
- Check browser console for errors

---

### 6. Bulk Attendance Upload

**Steps:**
1. Login as teacher
2. Navigate to "Data Entry"
3. Click on "Attendance" tab
4. Click "Bulk Upload" button at the top
5. Select a class from dropdown
6. Click "Download Template" button
7. Excel file should download with student list
8. Open the Excel file
9. Fill in attendance status for students:
   - Status column: "Present", "Absent", "Late", or "Excused"
10. Save the Excel file
11. Back in the app, click "Choose File"
12. Select your filled Excel file
13. File should be parsed and show preview
14. Click "Upload Attendance"
15. Verify success message

**Expected Results:**
- ✅ Bulk Upload mode is available
- ✅ Template downloads with student data
- ✅ File upload accepts Excel/CSV
- ✅ File is parsed correctly
- ✅ Upload saves attendance
- ✅ Success message is displayed

**Template Format:**
```
Student Name | Enrollment No | Date | Status
John Doe     | 2024001      | 2026-02-23 | Present
Jane Smith   | 2024002      | 2026-02-23 | Absent
```

**If it fails:**
- Check if AttendanceTab.jsx has bulk upload code
- Verify file format matches template
- Check backend endpoint: `POST /api/attendance/bulk`

---

### 7. Student Profile Viewing

**Steps:**
1. Login as teacher
2. Navigate to "Students" from sidebar
3. You should see a list of students
4. Click on any student's name or "View Profile"
5. Student profile page should load
6. Verify you can see:
   - Student name
   - Enrollment number
   - Class
   - Personal information
   - Parent information
7. Try different tabs:
   - Overview
   - Personal
   - Academics
   - Interventions
8. Click "Back" button
9. Should return to student list

**Expected Results:**
- ✅ Student list loads correctly
- ✅ Clicking student opens profile
- ✅ All information displays correctly
- ✅ Tabs work properly
- ✅ Back button works
- ✅ No "Student not found" error

**If you see "Student not found":**
- Check if student ID is valid
- Check backend endpoint: `GET /api/students/:id`
- Check if student exists in database
- Check browser console for errors

---

### 8. Teacher Profile Viewing

**Steps:**
1. Login as teacher
2. Click on profile icon in header (or navigate to `/profile`)
3. Profile page should load
4. Verify you can see:
   - Name
   - Email
   - Phone
   - School
   - Subject
   - Experience
   - Qualification
5. Click "Edit Profile"
6. Modify some fields
7. Click "Save Changes"
8. Verify changes are saved
9. Try uploading a profile picture
10. Verify picture is displayed

**Expected Results:**
- ✅ Profile page loads correctly
- ✅ All fields display correctly
- ✅ Edit mode works
- ✅ Changes are saved
- ✅ Profile picture upload works
- ✅ Statistics are displayed

---

## Common Issues and Solutions

### Issue 1: Backend Not Running
**Symptoms:**
- "Failed to fetch" errors
- "Network error" messages
- 500 status codes

**Solution:**
```bash
cd backend
npm start
```

### Issue 2: CORS Errors
**Symptoms:**
- "CORS policy" errors in console
- Requests blocked by browser

**Solution:**
- Check backend CORS configuration
- Ensure frontend URL is allowed

### Issue 3: Authentication Errors
**Symptoms:**
- "Unauthorized" errors
- Redirected to login page

**Solution:**
- Check if token is stored in localStorage
- Verify token is valid
- Try logging out and logging in again

### Issue 4: Data Not Loading
**Symptoms:**
- Empty lists
- "No data found" messages

**Solution:**
- Check if database has data
- Run seed scripts if needed
- Check API responses in Network tab

---

## Testing Checklist

Use this checklist to track your testing progress:

- [ ] Admin Profile Management
  - [ ] View profile
  - [ ] Edit profile
  - [ ] Save changes
  - [ ] Changes persist

- [ ] Exam Template Update
  - [ ] Open edit modal
  - [ ] Modify fields
  - [ ] Save changes
  - [ ] Verify update

- [ ] Score Entry
  - [ ] Select class/exam/subject
  - [ ] Enter marks
  - [ ] Save scores
  - [ ] Verify success

- [ ] Behavior Records
  - [ ] Add record
  - [ ] View records
  - [ ] Edit record
  - [ ] Delete record

- [ ] Score History
  - [ ] View history
  - [ ] Use filters
  - [ ] View details
  - [ ] Export to Excel

- [ ] Bulk Attendance Upload
  - [ ] Download template
  - [ ] Fill template
  - [ ] Upload file
  - [ ] Verify attendance

- [ ] Student Profile
  - [ ] View profile
  - [ ] Check all tabs
  - [ ] Navigate back

- [ ] Teacher Profile
  - [ ] View profile
  - [ ] Edit profile
  - [ ] Upload picture
  - [ ] Save changes

---

## Reporting Issues

If you find any issues during testing, please note:

1. **What were you trying to do?**
2. **What did you expect to happen?**
3. **What actually happened?**
4. **Error messages** (from browser console)
5. **Screenshots** (if applicable)
6. **Steps to reproduce**

---

## Success Criteria

All features are working correctly if:

✅ All 8 test scenarios pass  
✅ No console errors  
✅ Data saves and persists correctly  
✅ UI is responsive and user-friendly  
✅ Error messages are clear and helpful  
✅ Navigation works smoothly  

---

**Happy Testing!** 🎉

If you encounter any issues, refer to the TROUBLESHOOTING.md document for detailed solutions.
