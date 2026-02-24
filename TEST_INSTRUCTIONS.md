# Testing Instructions: Behavior & Interventions

## Prerequisites
- Backend server running on port 5000
- Frontend running on port 5173
- Database migration completed
- Logged in as a teacher

## Test 1: Behavior Tab - Create Record

### Steps:
1. Navigate to `http://localhost:5173/data-entry`
2. Click on "Behaviour" tab
3. Fill in the form:
   - **Class**: Select "Class 8 A - Grade 8 Section A" (or any available class)
   - **Student**: Select "Aarav Sharma (S2024001)" (or any student)
   - **Date**: Today's date (default)
   - **Behavior Type**: Select "Positive"
   - **Category**: Select "Participation"
   - **Severity**: Select "Medium - Needs monitoring"
   - **Description**: "Student actively participated in class discussion and helped other students"
   - **Action Taken**: "Praised in front of class"
   - **Follow-up Required**: Check the box
   - **Follow-up Date**: Select a date 1 week from now
4. Click "Save Observation"

### Expected Result:
- ✅ Green success message: "Behaviour observation saved successfully!"
- ✅ Form resets after 2 seconds
- ✅ Class selection remains the same

### Verify in Database:
```sql
SELECT * FROM behavior ORDER BY created_at DESC LIMIT 1;
```

## Test 2: Behavior Tab - View on Student Profile

### Steps:
1. Navigate to `http://localhost:5173/students`
2. Click on the student you just added behavior for
3. Click on "Behavior" tab

### Expected Result:
- ✅ See the behavior record you just created
- ✅ Green badge showing "positive"
- ✅ Yellow badge showing "medium" severity
- ✅ Category: "Participation"
- ✅ Description visible
- ✅ Action taken visible
- ✅ Teacher name shown at bottom
- ✅ Date displayed correctly

## Test 3: Interventions Tab - Create Intervention

### Steps:
1. Navigate to `http://localhost:5173/data-entry`
2. Click on "Interventions" tab
3. Click "Add Intervention" button
4. Fill in the form:
   - **Class**: Select a class
   - **Student**: Select a student
   - **Intervention Type**: Select "Academic Support"
   - **Priority**: Select "High"
   - **Start Date**: Today's date
   - **Target Date**: Select a date 1 month from now
   - **Status**: Select "Planned"
   - **Title**: "Math Tutoring Program"
   - **Description**: "Student struggling with algebra concepts, needs additional support"
   - **Action Plan**: "Weekly 1-on-1 tutoring sessions focusing on algebraic equations and problem-solving"
   - **Expected Outcome**: "Improve math test scores by at least 20% within one month"
5. Click "Create Intervention"

### Expected Result:
- ✅ Green success message: "Intervention created successfully!"
- ✅ Form closes automatically after 2 seconds
- ✅ New intervention appears in the list below

### Verify in Database:
```sql
SELECT * FROM interventions ORDER BY created_at DESC LIMIT 1;
```

## Test 4: Interventions Tab - View List

### Steps:
1. Stay on Interventions tab
2. Look at the interventions list

### Expected Result:
- ✅ See the intervention you just created
- ✅ Student name displayed
- ✅ Type: "Academic Support"
- ✅ Title: "Math Tutoring Program"
- ✅ Orange badge showing "high" priority
- ✅ Gray badge showing "planned" status
- ✅ Edit and Delete buttons visible

## Test 5: Interventions Tab - Edit Intervention

### Steps:
1. Click the Edit button (pencil icon) on the intervention
2. Change:
   - **Status**: "In Progress"
   - **Priority**: "Urgent"
3. Click "Update Intervention"

### Expected Result:
- ✅ Success message: "Intervention updated successfully!"
- ✅ Status badge changes to blue "in-progress"
- ✅ Priority badge changes to red "urgent"

## Test 6: Interventions Tab - Filter

### Steps:
1. In the Filters section:
   - **Status**: Select "In Progress"
2. Observe the list

### Expected Result:
- ✅ Only interventions with "in-progress" status are shown
- ✅ Other interventions are hidden

## Test 7: View Intervention on Student Profile

### Steps:
1. Navigate to `http://localhost:5173/students`
2. Click on the student you created intervention for
3. Click on "Interventions" tab

### Expected Result:
- ✅ See the intervention you created
- ✅ Title: "Math Tutoring Program"
- ✅ Type: "Academic Support"
- ✅ Red badge showing "urgent" priority
- ✅ Blue badge showing "in-progress" status
- ✅ Description visible
- ✅ Action plan visible in gray box
- ✅ Start date and target date shown at bottom

## Test 8: Student Profile Overview

### Steps:
1. Stay on student profile
2. Click "Overview" tab

### Expected Result:
- ✅ "Behavior Records" card shows count (should be 1 or more)
- ✅ Quick statistics section displays behavior count

## Test 9: Create Negative Behavior

### Steps:
1. Navigate to `http://localhost:5173/data-entry`
2. Click "Behaviour" tab
3. Create a negative behavior:
   - **Behavior Type**: "Negative"
   - **Category**: "Discipline"
   - **Severity**: "High"
   - **Description**: "Student was disruptive during class"
   - **Action Taken**: "Verbal warning given, parent contacted"
   - **Follow-up Required**: Yes
4. Save

### Expected Result:
- ✅ Success message
- ✅ Record saved

### Verify on Profile:
1. Go to student profile → Behavior tab
2. Should see:
   - ✅ Red badge for "negative"
   - ✅ Red badge for "high" severity

## Test 10: Delete Intervention

### Steps:
1. Navigate to `http://localhost:5173/data-entry`
2. Click "Interventions" tab
3. Click Delete button (trash icon) on an intervention
4. Confirm deletion

### Expected Result:
- ✅ Confirmation dialog appears
- ✅ After confirming, success message shows
- ✅ Intervention removed from list
- ✅ No longer visible on student profile

## Test 11: API Endpoints (Using Browser Console or Postman)

### Test Behavior Endpoints:
```javascript
// Get all behaviors
fetch('http://localhost:5000/api/behavior', {
  headers: { 'Authorization': 'Bearer YOUR_TOKEN' }
})

// Get behaviors for specific student
fetch('http://localhost:5000/api/behavior/student/STUDENT_ID', {
  headers: { 'Authorization': 'Bearer YOUR_TOKEN' }
})
```

### Test Intervention Endpoints:
```javascript
// Get all interventions
fetch('http://localhost:5000/api/interventions', {
  headers: { 'Authorization': 'Bearer YOUR_TOKEN' }
})

// Get interventions for specific student
fetch('http://localhost:5000/api/interventions/student/STUDENT_ID', {
  headers: { 'Authorization': 'Bearer YOUR_TOKEN' }
})
```

### Expected Result:
- ✅ Status 200
- ✅ JSON response with data
- ✅ No errors in console

## Test 12: Error Handling

### Test 1: Try to save without selecting student
1. Go to Behaviour tab
2. Don't select a student
3. Try to save

**Expected**: Error message "Please select class and student"

### Test 2: Try to save without description
1. Select class and student
2. Leave description empty
3. Try to save

**Expected**: Error message "Please select category and add description"

### Test 3: Try to create intervention without title
1. Go to Interventions tab
2. Fill form but leave title empty
3. Try to save

**Expected**: Error message "Please provide title and description"

## Test 13: Multiple Records

### Steps:
1. Create 5 different behavior records for the same student
2. Create 3 different interventions for the same student
3. View student profile

### Expected Result:
- ✅ All 5 behaviors visible in Behavior tab
- ✅ All 3 interventions visible in Interventions tab
- ✅ Records sorted by date (newest first)
- ✅ No duplicates
- ✅ All data displays correctly

## Test 14: Different Students

### Steps:
1. Create behavior for Student A
2. Create intervention for Student B
3. View Student A profile
4. View Student B profile

### Expected Result:
- ✅ Student A shows only their behavior
- ✅ Student B shows only their intervention
- ✅ No cross-contamination of data

## Test 15: Date Filtering (Future Enhancement)

### Steps:
1. Create behaviors on different dates
2. Try to filter by date range (if implemented)

### Expected Result:
- ✅ Only behaviors in date range shown

## Common Issues & Solutions

### Issue: "Failed to load resource: net::ERR_CONNECTION_REFUSED"
**Solution**: Backend server is not running. Start it with `npm start` in backend folder.

### Issue: "Student does not belong to your school"
**Solution**: You're trying to access a student from a different school. Select a student from your school.

### Issue: "Authentication required"
**Solution**: You're not logged in. Go to login page and sign in.

### Issue: Behavior/Intervention not showing on profile
**Solution**: 
1. Refresh the page
2. Check browser console for errors
3. Verify the record was saved (check database)
4. Make sure you're viewing the correct student

### Issue: "Cannot read property 'map' of undefined"
**Solution**: API returned unexpected data structure. Check backend console for errors.

## Success Criteria

All tests should pass with:
- ✅ No console errors
- ✅ All success messages display correctly
- ✅ Data persists after page refresh
- ✅ Student profiles show correct data
- ✅ Filters work correctly
- ✅ Edit and delete operations work
- ✅ Color coding is correct
- ✅ Dates display properly
- ✅ Teacher names show correctly

## Performance Check

- ✅ Page loads in < 2 seconds
- ✅ Form submission completes in < 1 second
- ✅ Student profile loads in < 2 seconds
- ✅ No lag when switching tabs
- ✅ Smooth scrolling in lists

## Final Verification

Run this checklist:
- [ ] Can create positive behavior
- [ ] Can create negative behavior
- [ ] Can create intervention
- [ ] Can edit intervention
- [ ] Can delete intervention
- [ ] Behaviors show on student profile
- [ ] Interventions show on student profile
- [ ] Color coding works
- [ ] Dates display correctly
- [ ] Teacher names show
- [ ] Filters work
- [ ] Error messages display
- [ ] Success messages display
- [ ] No console errors
- [ ] Data persists after refresh

## Report Issues

If any test fails:
1. Note which test failed
2. Copy error message from console
3. Check backend logs
4. Check database for data
5. Document steps to reproduce

---

**All tests passing?** 🎉 The implementation is working correctly!
