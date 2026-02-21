# How to Assign Classes to Teachers

## Problem

The teacher doesn't see any classes in the dropdown because:
1. No classes have been created yet, OR
2. The teacher hasn't been assigned to any classes yet

## Solution: Assign Classes to Teacher

### Step 1: Login as Admin

1. Logout if you're logged in as teacher
2. Go to: http://localhost:5173/admin/login
3. Login with admin credentials

### Step 2: Create Classes (if not already created)

1. Go to "Class Management" in admin panel
2. Click "Add Class" button
3. Fill in:
   - Class Name (e.g., "Class 10A")
   - Grade (e.g., "10")
   - Section (e.g., "A")
   - Academic Year (e.g., "2024-2025")
   - Attendance Mode (Daily or Subject-wise)
   - **Class Incharge**: Select the teacher
4. Click "Create Class"

### Step 3: Assign Teacher as Class Incharge

When creating a class:
- Select the teacher in the "Class Incharge" dropdown
- This makes the teacher the incharge of that class
- The teacher will be able to add students to this class

### Step 4: Assign Teacher to Subjects (Optional)

If you want the teacher to teach specific subjects:

1. Go to "Subject Management"
2. Click "Add Subject"
3. Fill in:
   - Subject Name (e.g., "Mathematics")
   - Class (select the class)
   - Teacher (select the teacher)
4. Click "Create Subject"

### Step 5: Verify Assignment

1. Still in admin panel, go to "Teacher Management"
2. Find your teacher in the list
3. Check the "Assigned Classes" column
4. Should show the class name

### Step 6: Test as Teacher

1. Logout from admin
2. Login as teacher
3. Go to "My Classes"
4. You should see the assigned class(es)
5. Go to "Add Student"
6. The class dropdown should now show your classes

## Quick Debug

### Check What Data Exists

Open this URL in your browser (while backend is running):
```
http://localhost:5000/api/debug/data
```

This will show you:
- All schools
- All users (teachers, admins)
- All classes
- All subjects
- Who is assigned to what

### Check Backend Logs

When you try to load classes as a teacher, check the backend terminal. You should see:
```
=== Get My Classes Debug ===
Teacher userId: <teacher-id>
Teacher schoolId: <school-id>
Total classes in school: X
Total subjects in school: Y
Incharge class IDs: [...]
Teaching subjects: X
All class IDs for teacher: [...]
Final classes for teacher: X
=== End Debug ===
```

If "Final classes for teacher: 0", then the teacher is not assigned to any classes.

## Common Issues

### Issue 1: "No classes in dropdown"

**Cause**: Teacher not assigned to any classes

**Solution**:
1. Login as admin
2. Create a class with this teacher as incharge
3. OR assign this teacher to subjects in existing classes

### Issue 2: "Teacher can't add students"

**Cause**: Teacher is only a subject teacher, not incharge

**Solution**:
- Teachers can only add students to classes where they are the incharge
- Either make them incharge of a class, OR
- Have the admin add students instead

### Issue 3: "Classes exist but teacher can't see them"

**Cause**: Teacher ID mismatch

**Solution**:
1. Check the debug endpoint: http://localhost:5000/api/debug/data
2. Find the teacher's ID in the users array
3. Find the class in the classes array
4. Make sure the class's `teacherId` matches the teacher's `id`

## Example: Complete Setup

### 1. Create School (if not exists)
```
School Name: "ABC High School"
```

### 2. Create Admin Account
```
Email: admin@abc.com
Password: admin123
School: ABC High School
```

### 3. Create Teacher Account
```
Email: teacher@abc.com
Password: teacher123
School: ABC High School
Status: Approved
```

### 4. Create Class
```
Name: Class 10A
Grade: 10
Section: A
Academic Year: 2024-2025
Attendance Mode: Daily
Class Incharge: teacher@abc.com (select from dropdown)
```

### 5. Create Subjects (Optional)
```
Subject: Mathematics
Class: Class 10A
Teacher: teacher@abc.com

Subject: Science
Class: Class 10A
Teacher: teacher@abc.com
```

### 6. Test
```
1. Logout
2. Login as teacher@abc.com
3. Go to My Classes → Should see "Class 10A"
4. Go to Add Student → Dropdown should show "Class 10A"
```

## Verification Checklist

- [ ] Admin account exists and can login
- [ ] Teacher account exists and is approved
- [ ] At least one class is created
- [ ] Teacher is assigned as incharge of at least one class
- [ ] Teacher can login successfully
- [ ] Teacher can see classes in "My Classes" page
- [ ] Teacher can see classes in "Add Student" dropdown
- [ ] Teacher can add a student successfully

## SQL/Data Check (for debugging)

If using the debug endpoint, verify:

```javascript
// Check if teacher exists
users.find(u => u.email === 'teacher@abc.com')
// Should return: { id: 'xxx', role: 'teacher', status: 'approved', ... }

// Check if class exists
classes.find(c => c.name === 'Class 10A')
// Should return: { id: 'yyy', teacherId: 'xxx', ... }

// Verify teacherId matches
const teacher = users.find(u => u.email === 'teacher@abc.com');
const class = classes.find(c => c.name === 'Class 10A');
console.log(class.teacherId === teacher.id); // Should be true
```

## Still Not Working?

If classes still don't show:

1. **Check backend logs** when loading Add Student page
2. **Check browser console** for errors
3. **Verify token** is valid (logout and login again)
4. **Check debug endpoint** to see actual data
5. **Restart backend** after making changes

## Quick Fix Script

Run this in browser console after logging in as teacher:

```javascript
// Check if classes API works
fetch('http://localhost:5000/api/teachers/my-classes', {
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('token')}`,
    'Content-Type': 'application/json'
  }
})
  .then(r => r.json())
  .then(d => {
    console.log('My Classes Response:', d);
    if (d.success && d.classes.length === 0) {
      console.error('❌ No classes assigned to this teacher!');
      console.log('👉 Login as admin and assign classes to this teacher');
    } else if (d.success) {
      console.log('✅ Teacher has', d.classes.length, 'classes');
    }
  })
  .catch(e => console.error('API Error:', e));
```

---

**Remember**: Teachers can only add students to classes where they are the CLASS INCHARGE, not just a subject teacher!
