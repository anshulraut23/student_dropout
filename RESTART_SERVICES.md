# Restart Services - Apply Code Changes

## Why Restart?

After code changes, services need to be restarted to load the new code:
- ✅ Backend changes → Restart backend
- ✅ Frontend changes → Restart frontend (or auto-reloads)
- ✅ ML Service changes → Restart ML service

---

## Quick Restart Guide

### 1. Restart Backend (REQUIRED for smart messages)

**Terminal 1 (Backend):**
```bash
# Stop current backend (Ctrl+C)
cd backend
npm start
```

**Wait for:**
```
✅ Server running on port 3001
✅ Connected to PostgreSQL
```

### 2. Restart Frontend (if needed)

**Terminal 2 (Frontend):**
```bash
# Usually auto-reloads, but if not:
# Stop current frontend (Ctrl+C)
cd proactive-education-assistant
npm start
```

**Wait for:**
```
✅ Compiled successfully!
✅ webpack compiled
```

### 3. Clear Browser Cache

**Hard Refresh:**
- Windows/Linux: `Ctrl + Shift + R`
- Mac: `Cmd + Shift + R`

---

## Test Backend is Updated

Run this test to verify backend has new code:

```bash
node test-backend-response.js
```

**Expected Output:**
```
✅ BACKEND IS RETURNING MISSING DATA:
   Current Days: 1
   Current Exams: 0
   Days Needed: 2
   Exams Needed: 1

✅ Backend code is working correctly!
```

**If you see:**
```
❌ MISSING DATA NOT FOUND IN RESPONSE!
```

**Then:** Backend was NOT restarted. Go back to step 1.

---

## Verify Smart Messages Work

### Test Case: Student with 1 day attendance, 0 exams

1. Login to http://localhost:3000
2. Go to Students page
3. Click on a student with 1 day attendance
4. Go to "Risk Analysis" tab

**You should see:**
```
Current Progress:
✓ Attendance: 1 day recorded
✓ Exams: 0 exams completed

Attendance Needed:
Please add 2 more days of attendance to unlock predictions
(Need 3 days total, currently have 1)

Exam Score Needed:
Please add 1 exam score to unlock predictions
(Need 1 exam total, currently have 0)

Next Steps:
• Mark attendance for 2 more days
• Enter 1 exam score
• Predictions will automatically appear when requirements are met

2 days and 1 exam away from predictions
```

---

## Troubleshooting

### Issue: Still showing old messages

**Solution 1: Hard refresh browser**
```
Ctrl + Shift + R (Windows/Linux)
Cmd + Shift + R (Mac)
```

**Solution 2: Clear browser cache**
1. F12 → DevTools
2. Right-click refresh button
3. "Empty Cache and Hard Reload"

**Solution 3: Incognito mode**
- Open new incognito/private window
- Test there (no cache)

### Issue: Backend not starting

**Check if port is in use:**
```bash
# Windows
netstat -ano | findstr :3001

# Linux/Mac
lsof -i :3001
```

**Kill process and restart:**
```bash
# Find PID from above command, then:
# Windows
taskkill /PID <PID> /F

# Linux/Mac
kill -9 <PID>
```

### Issue: Frontend not updating

**Clear node_modules cache:**
```bash
cd proactive-education-assistant
rm -rf node_modules/.cache
npm start
```

---

## Complete Restart (Nuclear Option)

If nothing works, restart everything:

```bash
# 1. Stop all services (Ctrl+C in each terminal)

# 2. Restart backend
cd backend
npm start

# 3. Restart ML service
cd ml-service
python app.py

# 4. Restart frontend
cd proactive-education-assistant
npm start

# 5. Clear browser cache (Ctrl+Shift+R)

# 6. Test
node test-backend-response.js
```

---

## Checklist

Before testing smart messages:

- [ ] Backend restarted (npm start)
- [ ] Frontend restarted (npm start)
- [ ] Browser cache cleared (Ctrl+Shift+R)
- [ ] Test script shows "MISSING DATA" ✅
- [ ] Student has 1 day attendance
- [ ] Student has 0 exams
- [ ] Viewing Risk Analysis tab

If all checked, smart messages should appear! 🎉
