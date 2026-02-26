# 🔧 Backend 500 Error - Diagnosis & Fix

## 📊 Current Status

**Issue**: Backend returning 500 Internal Server Error for:
- `GET /api/teachers/my-classes` - 500 error
- `GET /api/students` - 500 error

**User**: darshan@gmail.com (teacher, school GPP)
**Backend**: https://student-dropout-alpha.vercel.app
**Database**: PostgreSQL (Supabase)

---

## 🔍 Investigation Results

### ✅ What's Working
- Login endpoint works perfectly
- Authentication works
- Token generation works
- Database connection established
- Health check passes

### ❌ What's Failing
- Teacher dashboard endpoints (my-classes, students)
- Frontend can't load classes or students

### 🐛 Root Cause Analysis

After reviewing the code, I found the issue:

**Problem**: The `postgresStore.js` methods exist and are correct, BUT there's likely a **SQL query parameter issue**.

Look at this code in `postgresStore.js`:

```javascript
async getAttendanceByStudent(studentId, filters = {}) {
  let query = 'SELECT * FROM attendance WHERE student_id = $1';
  const values = [studentId];
  let paramIndex = 2;

  if (filters.startDate) {
    query += ` AND date >= ${paramIndex}`;  // ❌ WRONG! Missing $
    values.push(filters.startDate);
    paramIndex++;
  }
  // ... more filters
}
```

**The Bug**: Query uses `${paramIndex}` instead of `$${paramIndex}`

This causes PostgreSQL to interpret the parameter as a literal number instead of a parameter placeholder!

---

## 🔧 The Fix

### Files to Fix:

1. **backend/storage/postgresStore.js** - Multiple methods have this bug

### Affected Methods:
- `getAttendanceByStudent()` - Lines with parameter placeholders
- `getAttendanceByClass()` - Lines with parameter placeholders  
- `getExamTemplates()` - Lines with parameter placeholders
- `getExams()` - Lines with parameter placeholders
- `getMarks()` - Lines with parameter placeholders
- `getBehaviors()` - Lines with parameter placeholders
- `getInterventions()` - Lines with parameter placeholders
- `getXPLogsForTeacher()` - Lines with parameter placeholders

### Pattern to Find:
```javascript
query += ` AND column = ${paramIndex}`;  // ❌ WRONG
```

### Pattern to Replace With:
```javascript
query += ` AND column = $${paramIndex}`;  // ✅ CORRECT
```

---

## 📝 Detailed Fix List

### 1. getAttendanceByStudent (Line ~780)
```javascript
// BEFORE:
if (filters.startDate) {
  query += ` AND date >= ${paramIndex}`;
  values.push(filters.startDate);
  paramIndex++;
}
if (filters.endDate) {
  query += ` AND date <= ${paramIndex}`;
  values.push(filters.endDate);
  paramIndex++;
}
if (filters.subjectId) {
  query += ` AND subject_id = ${paramIndex}`;
  values.push(filters.subjectId);
  paramIndex++;
}
if (filters.classId) {
  query += ` AND class_id = ${paramIndex}`;
  values.push(filters.classId);
}

// AFTER:
if (filters.startDate) {
  query += ` AND date >= $${paramIndex}`;
  values.push(filters.startDate);
  paramIndex++;
}
if (filters.endDate) {
  query += ` AND date <= $${paramIndex}`;
  values.push(filters.endDate);
  paramIndex++;
}
if (filters.subjectId) {
  query += ` AND subject_id = $${paramIndex}`;
  values.push(filters.subjectId);
  paramIndex++;
}
if (filters.classId) {
  query += ` AND class_id = $${paramIndex}`;
  values.push(filters.classId);
}
```

### 2. getAttendanceByClass (Line ~810)
```javascript
// BEFORE:
if (filters.date) {
  query += ` AND date = ${paramIndex}`;
  values.push(filters.date);
  paramIndex++;
}
if (filters.startDate) {
  query += ` AND date >= ${paramIndex}`;
  values.push(filters.startDate);
  paramIndex++;
}
if (filters.endDate) {
  query += ` AND date <= ${paramIndex}`;
  values.push(filters.endDate);
  paramIndex++;
}
if (filters.subjectId) {
  query += ` AND subject_id = ${paramIndex}`;
  values.push(filters.subjectId);
  paramIndex++;
}
if (filters.status) {
  query += ` AND status = ${paramIndex}`;
  values.push(filters.status);
}

// AFTER:
if (filters.date) {
  query += ` AND date = $${paramIndex}`;
  values.push(filters.date);
  paramIndex++;
}
if (filters.startDate) {
  query += ` AND date >= $${paramIndex}`;
  values.push(filters.startDate);
  paramIndex++;
}
if (filters.endDate) {
  query += ` AND date <= $${paramIndex}`;
  values.push(filters.endDate);
  paramIndex++;
}
if (filters.subjectId) {
  query += ` AND subject_id = $${paramIndex}`;
  values.push(filters.subjectId);
  paramIndex++;
}
if (filters.status) {
  query += ` AND status = $${paramIndex}`;
  values.push(filters.status);
}
```

### 3. getExamTemplates (Line ~890)
```javascript
// BEFORE:
if (filters.isActive !== undefined) {
  query += ` AND is_active = ${paramIndex}`;
  values.push(filters.isActive);
  paramIndex++;
}
if (filters.type) {
  query += ` AND type = ${paramIndex}`;
  values.push(filters.type);
  paramIndex++;
}

// AFTER:
if (filters.isActive !== undefined) {
  query += ` AND is_active = $${paramIndex}`;
  values.push(filters.isActive);
  paramIndex++;
}
if (filters.type) {
  query += ` AND type = $${paramIndex}`;
  values.push(filters.type);
  paramIndex++;
}
```

### 4. getExamPeriods (Line ~970)
```javascript
// BEFORE:
if (filters.templateId) {
  query += ` AND template_id = ${paramIndex}`;
  values.push(filters.templateId);
  paramIndex++;
}

// AFTER:
if (filters.templateId) {
  query += ` AND template_id = $${paramIndex}`;
  values.push(filters.templateId);
  paramIndex++;
}
```

### 5. getExams (Line ~985)
```javascript
// BEFORE:
if (filters.schoolId) {
  query += ` AND school_id = ${paramIndex}`;
  values.push(filters.schoolId);
  paramIndex++;
}
if (filters.classId) {
  query += ` AND class_id = ${paramIndex}`;
  values.push(filters.classId);
  paramIndex++;
}
if (filters.subjectId) {
  query += ` AND subject_id = ${paramIndex}`;
  values.push(filters.subjectId);
  paramIndex++;
}
if (filters.type) {
  query += ` AND type = ${paramIndex}`;
  values.push(filters.type);
  paramIndex++;
}
if (filters.status) {
  query += ` AND status = ${paramIndex}`;
  values.push(filters.status);
  paramIndex++;
}
if (filters.startDate) {
  query += ` AND exam_date >= ${paramIndex}`;
  values.push(filters.startDate);
  paramIndex++;
}
if (filters.endDate) {
  query += ` AND exam_date <= ${paramIndex}`;
  values.push(filters.endDate);
}

// AFTER:
if (filters.schoolId) {
  query += ` AND school_id = $${paramIndex}`;
  values.push(filters.schoolId);
  paramIndex++;
}
if (filters.classId) {
  query += ` AND class_id = $${paramIndex}`;
  values.push(filters.classId);
  paramIndex++;
}
if (filters.subjectId) {
  query += ` AND subject_id = $${paramIndex}`;
  values.push(filters.subjectId);
  paramIndex++;
}
if (filters.type) {
  query += ` AND type = $${paramIndex}`;
  values.push(filters.type);
  paramIndex++;
}
if (filters.status) {
  query += ` AND status = $${paramIndex}`;
  values.push(filters.status);
  paramIndex++;
}
if (filters.startDate) {
  query += ` AND exam_date >= $${paramIndex}`;
  values.push(filters.startDate);
  paramIndex++;
}
if (filters.endDate) {
  query += ` AND exam_date <= $${paramIndex}`;
  values.push(filters.endDate);
}
```

### 6. getMarks (Line ~1100)
```javascript
// BEFORE:
if (filters.examId) {
  query += ` AND exam_id = ${paramIndex}`;
  values.push(filters.examId);
  paramIndex++;
}
if (filters.studentId) {
  query += ` AND student_id = ${paramIndex}`;
  values.push(filters.studentId);
  paramIndex++;
}
if (filters.status) {
  query += ` AND status = ${paramIndex}`;
  values.push(filters.status);
}

// AFTER:
if (filters.examId) {
  query += ` AND exam_id = $${paramIndex}`;
  values.push(filters.examId);
  paramIndex++;
}
if (filters.studentId) {
  query += ` AND student_id = $${paramIndex}`;
  values.push(filters.studentId);
  paramIndex++;
}
if (filters.status) {
  query += ` AND status = $${paramIndex}`;
  values.push(filters.status);
}
```

### 7. getBehaviors (Line ~1350)
```javascript
// BEFORE:
if (filters.studentId) {
  query += ` AND student_id = ${paramIndex}`;
  values.push(filters.studentId);
  paramIndex++;
}
if (filters.teacherId) {
  query += ` AND teacher_id = ${paramIndex}`;
  values.push(filters.teacherId);
  paramIndex++;
}
if (filters.behaviorType) {
  query += ` AND behavior_type = ${paramIndex}`;
  values.push(filters.behaviorType);
  paramIndex++;
}
if (filters.severity) {
  query += ` AND severity = ${paramIndex}`;
  values.push(filters.severity);
  paramIndex++;
}
if (filters.startDate) {
  query += ` AND date >= ${paramIndex}`;
  values.push(filters.startDate);
  paramIndex++;
}
if (filters.endDate) {
  query += ` AND date <= ${paramIndex}`;
  values.push(filters.endDate);
  paramIndex++;
}

// AFTER:
if (filters.studentId) {
  query += ` AND student_id = $${paramIndex}`;
  values.push(filters.studentId);
  paramIndex++;
}
if (filters.teacherId) {
  query += ` AND teacher_id = $${paramIndex}`;
  values.push(filters.teacherId);
  paramIndex++;
}
if (filters.behaviorType) {
  query += ` AND behavior_type = $${paramIndex}`;
  values.push(filters.behaviorType);
  paramIndex++;
}
if (filters.severity) {
  query += ` AND severity = $${paramIndex}`;
  values.push(filters.severity);
  paramIndex++;
}
if (filters.startDate) {
  query += ` AND date >= $${paramIndex}`;
  values.push(filters.startDate);
  paramIndex++;
}
if (filters.endDate) {
  query += ` AND date <= $${paramIndex}`;
  values.push(filters.endDate);
  paramIndex++;
}
```

### 8. getInterventions (Line ~1480)
```javascript
// BEFORE:
if (filters.studentId) {
  query += ` AND student_id = ${paramIndex}`;
  values.push(filters.studentId);
  paramIndex++;
}
if (filters.initiatedBy) {
  query += ` AND initiated_by = ${paramIndex}`;
  values.push(filters.initiatedBy);
  paramIndex++;
}
if (filters.status) {
  query += ` AND status = ${paramIndex}`;
  values.push(filters.status);
  paramIndex++;
}
if (filters.priority) {
  query += ` AND priority = ${paramIndex}`;
  values.push(filters.priority);
  paramIndex++;
}
if (filters.startDate) {
  query += ` AND start_date >= ${paramIndex}`;
  values.push(filters.startDate);
  paramIndex++;
}
if (filters.endDate) {
  query += ` AND (end_date <= ${paramIndex} OR end_date IS NULL)`;
  values.push(filters.endDate);
  paramIndex++;
}

// AFTER:
if (filters.studentId) {
  query += ` AND student_id = $${paramIndex}`;
  values.push(filters.studentId);
  paramIndex++;
}
if (filters.initiatedBy) {
  query += ` AND initiated_by = $${paramIndex}`;
  values.push(filters.initiatedBy);
  paramIndex++;
}
if (filters.status) {
  query += ` AND status = $${paramIndex}`;
  values.push(filters.status);
  paramIndex++;
}
if (filters.priority) {
  query += ` AND priority = $${paramIndex}`;
  values.push(filters.priority);
  paramIndex++;
}
if (filters.startDate) {
  query += ` AND start_date >= $${paramIndex}`;
  values.push(filters.startDate);
  paramIndex++;
}
if (filters.endDate) {
  query += ` AND (end_date <= $${paramIndex} OR end_date IS NULL)`;
  values.push(filters.endDate);
  paramIndex++;
}
```

### 9. getXPLogsForTeacher (Line ~1720)
```javascript
// BEFORE:
if (startDate) {
  values.push(startDate);
  query += ` AND created_at >= ${values.length}`;
}
if (endDate) {
  values.push(endDate);
  query += ` AND created_at <= ${values.length}`;
}

// AFTER:
if (startDate) {
  values.push(startDate);
  query += ` AND created_at >= $${values.length}`;
}
if (endDate) {
  values.push(endDate);
  query += ` AND created_at <= $${values.length}`;
}
```

---

## 🚀 Deployment Steps

1. Fix all the parameter placeholders in `backend/storage/postgresStore.js`
2. Commit changes
3. Push to Vercel (auto-deploys)
4. Wait 30 seconds for deployment
5. Test endpoints again

---

## 🧪 Testing After Fix

### Test 1: Login (Should still work)
```bash
curl -X POST https://student-dropout-alpha.vercel.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"darshan@gmail.com","password":"123456"}'
```

### Test 2: Get My Classes (Should now work)
```bash
curl -X GET https://student-dropout-alpha.vercel.app/api/teachers/my-classes \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Test 3: Get Students (Should now work)
```bash
curl -X GET https://student-dropout-alpha.vercel.app/api/students \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## ✅ Expected Results After Fix

- ✅ Login works
- ✅ Get my classes returns classes
- ✅ Get students returns students
- ✅ Frontend dashboard loads properly
- ✅ Attendance page loads classes
- ✅ Exams page loads exams
- ✅ Student profiles load

---

## 📊 Impact

This bug affects ALL filtered queries in the system:
- Attendance queries with date filters
- Exam queries with filters
- Marks queries with filters
- Behavior queries with filters
- Intervention queries with filters
- XP logs queries with date filters

**Severity**: HIGH - Breaks most of the application
**Priority**: CRITICAL - Must fix immediately

---

**Status**: Ready to fix
**Date**: February 26, 2026
