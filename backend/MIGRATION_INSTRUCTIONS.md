# Database Migration Instructions

## Task 1: Set up database schema and migrations

This document provides instructions for running the database migration for the admin-teacher-profile-improvements feature.

## Prerequisites

- Node.js installed and available in your PATH
- Backend dependencies installed (`npm install` in the backend directory)
- Backup of your current database (recommended)

## Backup Your Database (Recommended)

Before running any migration, create a backup of your database:

```bash
# From the backend directory
cp storage/education_assistant.db storage/education_assistant.db.backup
```

## Running the Migration

### Step 1: Navigate to the backend directory

```bash
cd backend
```

### Step 2: Run the migration script

```bash
node migrations/001-add-profile-marks-behavior-tables.js
```

Expected output:
```
🔄 Running migration: Add profile, marks, and behavior tables...
📝 Adding profile fields to users table...
✅ Profile fields added to users table
📝 Creating marks table...
✅ Marks table created
📝 Creating behavior table...
✅ Behavior table created
📝 Adding audit fields to tables...
✅ Audit fields added to tables
✅ Migration completed successfully!

📊 Summary:
  - Added profile fields to users table (phone, designation, address, city, state, pincode, profilePicture)
  - Created marks table with enhanced schema
  - Created behavior table
  - Added audit fields (createdAt, updatedAt) to tables
```

### Step 3: Verify the migration

```bash
node migrations/verify-schema.js
```

Expected output:
```
🔍 Verifying database schema...

📋 Checking users table...
✅ All profile fields present in users table

📋 Checking marks table...
✅ Marks table exists
✅ All required columns present in marks table
📊 Marks table indexes: idx_marks_exam, idx_marks_student, idx_marks_grade, idx_marks_verified

📋 Checking behavior table...
✅ Behavior table exists
✅ All required columns present in behavior table
📊 Behavior table indexes: idx_behavior_student, idx_behavior_teacher, idx_behavior_date, idx_behavior_type, idx_behavior_severity

📋 Checking audit fields in other tables...
✅ schools table has updatedAt field
✅ teacher_requests table has audit fields

✅ Schema verification complete!
```

## What This Migration Does

### 1. Users Table Enhancements
Adds the following profile fields:
- `phone` - User's phone number
- `designation` - Job title/designation
- `address` - Street address
- `city` - City name
- `state` - State/province
- `pincode` - Postal/ZIP code
- `profilePicture` - URL to profile picture
- `updatedAt` - Last update timestamp

### 2. Marks Table Creation
Creates a new `marks` table with:
- Complete marks tracking (obtained, total, percentage, grade)
- Status tracking (present/absent/exempted)
- Verification workflow (enteredBy, verifiedBy, isVerified)
- Audit trail (createdAt, updatedAt)
- Foreign key relationships to exams and students
- Unique constraint on (examId, studentId)

### 3. Behavior Table Creation
Creates a new `behavior` table with:
- Student behavior tracking
- Behavior type classification (positive/neutral/negative)
- Severity levels (low/medium/high)
- Action tracking and follow-up management
- Foreign key relationships to students and teachers
- Comprehensive indexing for efficient queries

### 4. Audit Fields
Adds missing audit fields to:
- `schools` table (updatedAt)
- `teacher_requests` table (createdAt, updatedAt)

## Troubleshooting

### Migration fails with "table already exists"
The migration is designed to be idempotent. If the marks table already exists, it will be dropped and recreated. For other tables, columns are only added if they don't exist.

### Node.js not found
Ensure Node.js is installed and in your PATH:
```bash
node --version
```

If not installed, download from https://nodejs.org/

### Database locked error
Ensure no other processes are accessing the database:
- Stop the backend server
- Close any SQLite browser tools
- Try the migration again

### Permission errors
Ensure you have write permissions to the storage directory:
```bash
ls -la storage/
```

## Rollback

If you need to rollback the migration:

1. Restore from backup:
```bash
cp storage/education_assistant.db.backup storage/education_assistant.db
```

2. Or manually remove the changes (not recommended):
```bash
sqlite3 storage/education_assistant.db
DROP TABLE IF EXISTS behavior;
DROP TABLE IF EXISTS marks;
.quit
```

Note: SQLite doesn't support DROP COLUMN, so removing columns from the users table would require recreating the entire table.

## Next Steps

After successfully running the migration:

1. Restart your backend server
2. The new database schema is now ready for use
3. Proceed with implementing the backend endpoints (Task 2)

## Support

If you encounter any issues:
1. Check the error message carefully
2. Ensure you have a backup
3. Review the migration script: `migrations/001-add-profile-marks-behavior-tables.js`
4. Check the database file permissions
5. Verify Node.js and dependencies are properly installed
