# Test Gamification API

## Quick Test Steps

### 1. Check if Backend is Running
```bash
# In backend folder
npm run dev
```

Expected output should include:
```
Server running on port 5000
✅ PostgreSQL connected successfully
```

### 2. Test API Endpoint Directly

Open browser console and run:

```javascript
// Get your auth token
const token = localStorage.getItem('token');
console.log('Token:', token);

// Test gamification stats endpoint
fetch('http://localhost:5000/api/gamification/stats', {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
})
.then(res => res.json())
.then(data => console.log('Stats Response:', data))
.catch(err => console.error('Error:', err));
```

### 3. Test XP Award Endpoint

```javascript
// Award XP
fetch('http://localhost:5000/api/gamification/award-xp', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('token')}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    actionType: 'attendance',
    xpEarned: 20
  })
})
.then(res => res.json())
.then(data => console.log('Award XP Response:', data))
.catch(err => console.error('Error:', err));
```

### 4. Check Database

```sql
-- Check if teacher_gamification record exists
SELECT * FROM teacher_gamification;

-- Check XP logs
SELECT * FROM xp_logs ORDER BY created_at DESC LIMIT 10;

-- Check badges
SELECT * FROM badges;

-- Check earned badges
SELECT * FROM teacher_badges;
```

## Expected Responses

### GET /api/gamification/stats
```json
{
  "success": true,
  "stats": {
    "totalXP": 20,
    "currentLevel": 1,
    "loginStreak": 1,
    "tasksCompleted": 1,
    "studentsHelped": 0,
    "studentsAdded": 0,
    "attendanceRecords": 0,
    "highRiskStudentsHelped": 0,
    "weeklyTaskCompletion": 0,
    "badges": [],
    "earnedBadges": [],
    "dailyTasksCompleted": {
      "attendance": true,
      "marks": false,
      "behaviour": false,
      "intervention": false,
      "login": true
    },
    "lastActiveDate": "2026-02-25"
  }
}
```

### POST /api/gamification/award-xp
```json
{
  "success": true,
  "stats": {
    "totalXP": 40,
    "currentLevel": 1,
    ...
  }
}
```

## Common Issues

### Issue 1: 404 Not Found
**Cause:** Gamification routes not registered in server.js
**Fix:** Check that `app.use('/api/gamification', gamificationRoutes)` is in server.js

### Issue 2: 401 Unauthorized
**Cause:** No auth token or invalid token
**Fix:** Login again to get fresh token

### Issue 3: 500 Internal Server Error
**Cause:** Database tables don't exist or dataStore methods missing
**Fix:** Run migration: `node backend/scripts/apply-gamification-migration.js`

### Issue 4: Empty Response
**Cause:** Teacher doesn't have gamification record yet
**Fix:** The first API call should create the record automatically

## Debugging Checklist

- [ ] Backend server is running on port 5000
- [ ] Database tables exist (teacher_gamification, xp_logs, badges, teacher_badges)
- [ ] Gamification routes registered in server.js
- [ ] Auth token is valid (check localStorage)
- [ ] Teacher is logged in
- [ ] Browser console shows no CORS errors
- [ ] Network tab shows 200 OK responses

## Quick Fix Commands

```bash
# Restart backend
cd backend
npm run dev

# Verify tables exist
node scripts/verify-gamification-tables.js

# Check server logs for errors
# Look for lines starting with "GET /api/gamification/stats"
```

## Success Indicators

When working correctly, you should see in console:
```
🎮 Awarding 20 XP for attendance...
✅ XP awarded successfully: {success: true, stats: {...}}
✅ Gamification stats loaded: {success: true, stats: {...}}
```

When NOT working, you'll see:
```
❌ Error fetching gamification stats: [error message]
❌ Error awarding XP: [error message]
```
