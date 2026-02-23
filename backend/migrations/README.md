# Database Migrations

This directory contains database migration scripts for the education assistant project.

## Running Migrations

To run a migration, execute the following command from the `backend` directory:

```bash
node migrations/001-add-profile-marks-behavior-tables.js
```

## Migration 001: Add Profile, Marks, and Behavior Tables

**File:** `001-add-profile-marks-behavior-tables.js`

**Purpose:** This migration adds the necessary database schema changes for the admin-teacher-profile-improvements feature.

**Changes:**
1. Adds profile fields to the `users` table:
   - `phone` - User's phone number
   - `designation` - User's job title/designation
   - `address` - Street address
   - `city` - City name
   - `state` - State/province
   - `pincode` - Postal/ZIP code
   - `profilePicture` - URL to profile picture
   - `updatedAt` - Timestamp for last update

2. Creates the `marks` table with enhanced schema:
   - `id` - Primary key
   - `examId` - Foreign key to exams table
   - `studentId` - Foreign key to students table
   - `marksObtained` - Marks scored by student
   - `totalMarks` - Total marks for the exam
   - `percentage` - Calculated percentage
   - `grade` - Calculated grade
   - `status` - Status (present/absent/exempted)
   - `remarks` - Additional notes
   - `enteredBy` - User who entered the marks
   - `verifiedBy` - User who verified the marks
   - `isVerified` - Verification status
   - `createdAt` - Creation timestamp
   - `updatedAt` - Last update timestamp

3. Creates the `behavior` table:
   - `id` - Primary key
   - `studentId` - Foreign key to students table
   - `teacherId` - Foreign key to users table
   - `date` - Date of behavior observation
   - `behaviorType` - Type (positive/neutral/negative)
   - `severity` - Severity level (low/medium/high)
   - `category` - Behavior category
   - `description` - Detailed description
   - `actionTaken` - Actions taken in response
   - `followUpRequired` - Whether follow-up is needed
   - `followUpDate` - Date for follow-up
   - `createdAt` - Creation timestamp
   - `updatedAt` - Last update timestamp

4. Adds audit fields to tables missing them:
   - Adds `updatedAt` to `schools` table
   - Adds `createdAt` and `updatedAt` to `teacher_requests` table

**Indexes Created:**
- Marks table: examId, studentId, grade, isVerified
- Behavior table: studentId, teacherId, date, behaviorType, severity

**Safety Features:**
- Uses transactions (BEGIN/COMMIT/ROLLBACK)
- Checks for existing columns before adding
- Backfills audit fields with appropriate values
- Includes error handling and rollback on failure

## Verification

After running the migration, you can verify the schema changes by:

1. Checking the database file exists:
   ```bash
   ls -la storage/education_assistant.db
   ```

2. Using SQLite CLI to inspect tables:
   ```bash
   sqlite3 storage/education_assistant.db
   .schema users
   .schema marks
   .schema behavior
   .quit
   ```

3. Running the verification script:
   ```bash
   node migrations/verify-schema.js
   ```

## Rollback

If you need to rollback this migration, you can:

1. Restore from a backup of the database
2. Or manually drop the new tables and columns:
   ```sql
   DROP TABLE IF EXISTS behavior;
   DROP TABLE IF EXISTS marks;
   -- Note: SQLite doesn't support DROP COLUMN, so you'd need to recreate the users table
   ```

## Notes

- Always backup your database before running migrations
- Migrations are designed to be idempotent where possible
- The migration checks for existing columns before adding them
- All changes are wrapped in a transaction for safety
