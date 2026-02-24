# 🔧 Gamification Not Fetching XP - Troubleshooting Guide

## Problem
Progress page is not showing XP data. Stats remain at 0.

## Root Cause Analysis

The issue is likely one of these:

1. **Backend API not responding** - Gamification endpoints returning errors
2. **Database records don't exist** - No teacher_gamification record for logged-in teacher
3. **Frontend not calling API** - Using cached/mock data instead
4. **Auth token issues** - API calls failing due to authentication

---

## Step-by-Step Fix

### Step 1: Verify Backend is Running ✅

```bash
cd backend
npm run dev
```

**Expected output:**
```
Server running on port 5000
✅ PostgreSQL connected successfully
```

**Check:** Open http://localhost:5000/api/health
Should return: `{"status":"ok","message":"Server is running"}`

---

### Step 2: Check Browser Console 🔍

1. Open browser DevTools (F12)
2. Go to Console tab
3. Navigate to Progress page (/gamification)
4. Look for these messages:

**If working:**
```
✅ Gamification stats loaded: {success: true, stats: {...}}
```

**If broken:**
```
❌ Error fetching gamification stats: [error message]
```

---

### Step 3: Check Network Tab 🌐

1. Open DevTools → Network tab
2. Refresh Progress page
3. Look for request to `/api/gamification/stats`

**If 200 OK:**
- Click on the request
- Check Response tab
- Should show `{success: true, stats: {...}}`

**If 404 Not Found:**
- Gamification routes not registered in server.js
- Fix: Verify `app.use('/api/gamification', gamificationRoutes)` exists

**If 401 Unauthorized:**
- Auth token is invalid or missing
- Fix: Logout and login again

**If 500 Internal Server Error:**
- Backend error (check server logs)
- Likely database issue

---

### Step 4: Test API Directly 🧪

Open browser console and run:

```javascript
// Test stats endpoint
fetch('http://localhost:5000/api/gamification/stats', {
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('token')}`,
    'Content-Type': 'application/json'
  }
})
.then(res => res.json())
.then(data => {
  console.log('✅ API Response:', data);
  if (data.success) {
    console.log('Total XP:', data.stats.totalXP);
    console.log('Level:', data.stats.currentLevel);
  } else {
    console.error('❌ API Error:', data.error);
  }
})
.catch(err => console.error('❌ Fetch Error:', err));
```

---

### Step 5: Check Database 💾

Run this in your database client (Supabase SQL Editor):

```sql
-- Check if tables exist
SELECT table_name FROM information_schema.tables 
WHERE table_name IN ('teacher_gamification', 'xp_logs', 'badges', 'teacher_badges');

-- Check teacher gamification records
SELECT * FROM teacher_gamification;

-- Check XP logs
SELECT * FROM xp_logs ORDER BY created_at DESC LIMIT 10;

-- Check your teacher ID
SELECT id, email, full_name FROM users WHERE role = 'teacher';
```

**If no records in teacher_gamification:**
- This is normal for first-time users
- The API should create a record automatically on first call
- Try marking attendance to trigger XP award

---

### Step 6: Verify Server Logs 📋

Check backend terminal for errors when accessing Progress page:

**Good logs:**
```
GET /api/gamification/stats 200 45ms
✅ Teacher stats fetched for teacher-123
```

**Bad logs:**
```
GET /api/gamification/stats 500 12ms
❌ Error: teacher_gamification table does not exist
```

---

## Quick Fixes

### Fix 1: Restart Backend
```bash
cd backend
# Stop server (Ctrl+C)
npm run dev
```

### Fix 2: Clear Browser Cache
```javascript
// In browser console
localStorage.clear();
// Then logout and login again
```

### Fix 3: Re-apply Migration
```bash
cd backend
node scripts/apply-gamification-migration.js
```

### Fix 4: Create Test XP Record
```sql
-- Replace 'YOUR_TEACHER_ID' with actual teacher ID from users table
INSERT INTO teacher_gamification (teacher_id, total_xp, current_level)
VALUES ('YOUR_TEACHER_ID', 100, 1)
ON CONFLICT (teacher_id) DO UPDATE SET total_xp = 100;
```

### Fix 5: Test XP Award
```bash
# Mark attendance to trigger XP award
# Then check console for:
🎮 Awarding 20 XP for attendance...
✅ XP awarded successfully
```

---

## Common Error Messages

### "Cannot read property 'stats' of undefined"
**Cause:** API response is not in expected format
**Fix:** Check backend response structure

### "Network request failed"
**Cause:** Backend not running or wrong URL
**Fix:** Verify backend is on http://localhost:5000

### "Unauthorized"
**Cause:** Invalid or expired token
**Fix:** Logout and login again

### "teacher_gamification table does not exist"
**Cause:** Migration not applied
**Fix:** Run `node scripts/apply-gamification-migration.js`

---

## Verification Steps

After applying fixes, verify:

1. **Backend responds:**
   ```bash
   curl http://localhost:5000/api/health
   ```

2. **Auth works:**
   ```bash
   # Get token from localStorage
   curl -H "Authorization: Bearer YOUR_TOKEN" http://localhost:5000/api/gamification/stats
   ```

3. **XP awards work:**
   - Mark attendance
   - Check console for "✅ XP awarded"
   - Refresh Progress page
   - See XP increase

4. **Progress page loads:**
   - Navigate to /gamification
   - See stats cards with real data
   - No "0 XP" everywhere

---

## Expected Behavior

### First Time User
1. Navigate to Progress page
2. API creates teacher_gamification record with 0 XP
3. Page shows "0 XP, Level 1, 0 Streak"
4. Mark attendance → +20 XP
5. Refresh page → Shows "20 XP, Level 1"

### Existing User
1. Navigate to Progress page
2. API fetches existing stats
3. Page shows current XP, level, badges
4. Perform actions → XP increases
5. Refresh → Updated stats persist

---

## Still Not Working?

If none of the above fixes work:

1. **Check server.js** - Verify gamification routes are registered:
   ```javascript
   import gamificationRoutes from './routes/gamificationRoutes.js';
   app.use('/api/gamification', gamificationRoutes);
   ```

2. **Check dataStore.js** - Verify it's using postgresStore:
   ```javascript
   import postgresStore from './postgresStore.js';
   export default postgresStore;
   ```

3. **Check auth middleware** - Verify token is being validated:
   ```javascript
   // In gamificationRoutes.js
   router.get('/stats', authenticateToken, requireRole('teacher', 'admin'), getTeacherStats);
   ```

4. **Enable debug logging:**
   ```javascript
   // In gamificationController.js
   console.log('User from token:', req.user);
   console.log('Fetching stats for teacher:', req.user.userId);
   ```

---

## Contact Points

If issue persists, provide:
- Browser console logs (full error messages)
- Network tab screenshot (showing failed request)
- Backend server logs (error stack trace)
- Database query results (teacher_gamification table)

---

**Last Updated:** February 25, 2026
**Status:** Troubleshooting guide complete
