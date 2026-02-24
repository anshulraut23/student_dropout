# Demo Data Seeding Guide

This guide explains how to set up a realistic testing environment with 4 specific student personas to demonstrate ML predictions.

## Overview

The `seed-demo-data.js` script creates a complete demo environment with:
- 1 School
- 1 Admin + 2 Teachers
- 1 Class (Grade 10-A)
- 3 Subjects (Math, Science, English)
- 1 Completed Exam
- **4 Student Personas** with distinct risk profiles

## Student Personas

### 🔴 Persona 1: "The High Risk Student" - Arjun Patel
**Expected ML Output: Critical Risk (>0.8)**

- **Attendance**: 50% (10 present, 10 absent out of 20 days)
- **Exam Marks**: 25%, 30%, 28% (All failing)
- **Behavior**: 2 negative incidents (high severity)
  - Repeated disruption in class
  - Not submitting assignments

### 🟢 Persona 2: "The Good Student" - Priya Desai
**Expected ML Output: Low Risk (<0.3)**

- **Attendance**: 95% (19 present, 1 absent out of 20 days)
- **Exam Marks**: 92%, 88%, 90% (All excellent)
- **Behavior**: 1 positive incident
  - Helped classmates with difficult concepts

### 🟡 Persona 3: "The Borderline Student" - Rahul Singh
**Expected ML Output: Medium Risk (0.3-0.6)**

- **Attendance**: 80% (16 present, 4 absent out of 20 days)
- **Exam Marks**: 55%, 52%, 58% (All average)
- **Behavior**: None (defaults to 100 positive score)

### ⏳ Persona 4: "The New Student" - Ananya Reddy
**Expected ML Output: Insufficient Data (Tier 0)**

- **Attendance**: Only 5 days (all present)
- **Exam Marks**: None
- **Behavior**: None
- **Result**: Should show "Gathering Data" badge with requirements checklist

## Setup Instructions

### Option 1: Use Existing Database (Quick Test)

If you want to test with your current database:

```bash
# 1. Navigate to backend directory
cd backend

# 2. Run the seeding script
node scripts/seed-demo-data.js
```

### Option 2: Use Separate Test Database (Recommended for Demo)

For a clean demo environment:

#### Step 1: Create Test Database in Supabase

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Create a new project (or use existing)
3. Copy the connection string from Settings → Database

#### Step 2: Update .env File

Create a backup of your current `.env`:
```bash
cp backend/.env backend/.env.backup
```

Update `backend/.env` with test database URL:
```env
DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@[YOUR-HOST]:5432/postgres
```

#### Step 3: Run Migrations

Run the schema migrations on the test database:

```bash
# Option A: Using Supabase CLI
cd backend/supabase
supabase db push

# Option B: Manually in Supabase SQL Editor
# Copy and run these files in order:
# 1. backend/database/supabase-schema.sql
# 2. backend/database/add-behavior-interventions.sql
```

#### Step 4: Run Seeding Script

```bash
cd backend
node scripts/seed-demo-data.js
```

You should see colorful output showing the creation of all data.

#### Step 5: Start Services

```bash
# Terminal 1: Start ML Service
cd ml-service
python app.py

# Terminal 2: Start Backend
cd backend
npm start

# Terminal 3: Start Frontend
cd proactive-education-assistant
npm run dev
```

## Login Credentials

### Admin Account
```
Email: admin@demo.com
Password: admin123
```

### Teacher Accounts
```
Email: teacher1@demo.com (Mathematics)
Password: teacher123

Email: teacher2@demo.com (Science)
Password: teacher123
```

## Testing the ML Predictions

1. **Login** as `teacher1@demo.com`
2. **Navigate** to Dashboard
3. **View** all 4 students in the list
4. **Click** on each student to see their profile
5. **Observe** the ML risk predictions:
   - Arjun Patel: 🔴 Critical Risk
   - Priya Desai: 🟢 Low Risk
   - Rahul Singh: 🟡 Medium Risk
   - Ananya Reddy: ⏳ Gathering Data

## Verifying Data

To check what was created:

```bash
cd backend
node scripts/check-loaded-data.js
```

## Clearing Demo Data

To remove all demo data and start fresh:

```bash
cd backend
node scripts/clear-all-data.js
```

Then run the seeding script again.

## Troubleshooting

### "Cannot connect to database"
- Check your `.env` file has correct `DATABASE_URL`
- Verify Supabase project is running
- Test connection: `psql $DATABASE_URL`

### "Foreign key constraint violation"
- Ensure migrations were run first
- Check that all tables exist
- Run: `node scripts/clear-all-data.js` then seed again

### "ML predictions not showing"
- Verify ML service is running: `curl http://localhost:5001/health`
- Check backend logs for ML client errors
- Ensure `ML_SERVICE_URL` in backend `.env` is correct

### "Insufficient Data for all students"
- Check that exam status is 'completed' not 'scheduled'
- Verify attendance records were created (should be 65 total)
- Check marks were inserted with status 'submitted'

## Data Statistics

The script creates:
- **1** School
- **3** Users (1 admin, 2 teachers)
- **1** Class
- **3** Subjects
- **1** Exam (completed)
- **4** Students
- **65** Attendance records (20+20+20+5)
- **9** Exam marks (3+3+3+0)
- **3** Behavior incidents (2+1+0+0)

## Notes

- All dates are relative to current date (e.g., "10 days ago")
- Attendance spans last 20 days for personas 1-3
- Exam date is set to 10 days ago
- IDs are generated using nanoid (16 characters)
- Passwords are bcrypt hashed
- All data respects foreign key constraints

## Restoring Original Database

If you used Option 2 (separate test database):

```bash
# Restore original .env
cp backend/.env.backup backend/.env

# Restart backend
cd backend
npm start
```

---

**Created**: February 2026  
**Purpose**: ML Dropout Prediction System Demo
