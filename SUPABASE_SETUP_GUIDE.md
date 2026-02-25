# Supabase Database Setup Guide

This guide will help you set up the complete database schema in Supabase for the Student Dropout Prevention System.

## Prerequisites

- Supabase account and project created
- Database connection string (DATABASE_URL) from Supabase
- Node.js installed

## Step 1: Configure Environment Variables

Make sure your `backend/.env` file has the correct Supabase connection string:

```env
DB_TYPE=postgres
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@db.YOUR_PROJECT_REF.supabase.co:5432/postgres
```

## Step 2: Run the Complete Schema

### Option A: Using Supabase SQL Editor (Recommended)

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Click **New Query**
4. Copy the entire contents of `backend/database/supabase-schema.sql`
5. Paste into the SQL Editor
6. Click **Run** to execute

This will create all tables including:
- schools
- users
- requests
- classes
- subjects
- students
- attendance
- exams
- marks
- exam_templates
- exam_periods
- faculty_invites
- faculty_messages
- **behaviors** (NEW)
- **interventions** (NEW)

### Option B: Using Migration Script

Run the migration script from the backend directory:

```bash
cd backend
node run-supabase-migration.js
```

This will:
- Connect to your Supabase database
- Run the behavior and interventions migration
- Verify tables were created successfully

## Step 3: Verify Tables

After running the schema, verify all tables exist:

```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;
```

You should see all the tables listed above.

## Step 4: Test the Connection

Start your backend server:

```bash
cd backend
npm start
```

You should see:
```
🔌 Connecting to PostgreSQL/Supabase...
🧪 Testing database connection...
✅ PostgreSQL connection successful!
Server running on port 5000
```

## Step 5: Create Your First Account

1. Go to the frontend: `http://localhost:5173`
2. Click "Register" or "Sign Up"
3. Fill in the school and admin details
4. Submit the form

The data should now be saved to Supabase!

## Troubleshooting

### Connection Issues

If you see connection errors:

1. **Check DATABASE_URL**: Make sure it's correct in `.env`
2. **Check Supabase Status**: Verify your Supabase project is running
3. **Check SSL**: The connection requires SSL (already configured)
4. **Check Firewall**: Ensure your IP is allowed in Supabase settings

### Tables Not Created

If tables aren't being created:

1. Check for SQL syntax errors in the Supabase SQL Editor
2. Make sure you have proper permissions
3. Try running the schema in smaller chunks

### Data Not Saving

If data isn't being saved:

1. Check backend console for errors
2. Verify `DB_TYPE=postgres` in `.env`
3. Check that all required tables exist
4. Look for foreign key constraint errors

## Migration Files

All migration files are in `backend/supabase/migrations/`:

- `20260223165630_initial_schema.sql` - Base tables
- `20260223170000_add_attendance_columns.sql` - Attendance enhancements
- `20260224000000_add_exam_columns.sql` - Exam system
- `20260225130000_add_gamification_tables.sql` - Gamification features
- `20260225140000_add_faculty_connect_tables.sql` - Faculty chat
- `20260225150000_add_behavior_interventions.sql` - **Behavior & Interventions (NEW)**

## Next Steps

After setup is complete:

1. Create your school admin account
2. Add teachers
3. Create classes
4. Add students
5. Start tracking attendance, scores, behavior, and interventions!

## Support

If you encounter issues:

1. Check the backend console logs
2. Check Supabase logs in the dashboard
3. Verify all environment variables are set correctly
4. Make sure all tables exist in Supabase

---

**Important**: Keep your DATABASE_URL and passwords secure. Never commit them to version control!
