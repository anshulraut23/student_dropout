# 🚀 START HERE - Education Assistant

## ⚠️ IMPORTANT: You're seeing errors because the backend is not running!

---

## Quick Fix (30 seconds)

### Windows Users:
1. Double-click `check-and-start-backend.bat`
2. Wait for "Server running on port 5000"
3. Refresh your browser

### Mac/Linux Users:
```bash
chmod +x check-and-start-backend.sh
./check-and-start-backend.sh
```

---

## What's Happening?

Your frontend (React app) is running on `http://localhost:5173`

But your backend (API server) is **NOT** running on `http://localhost:5000`

That's why you see:
- ❌ "Failed to fetch"
- ❌ "Endpoint not found"  
- ❌ "Cannot connect to backend"

---

## The Solution

You need **TWO** servers running:

### Server 1: Backend (Port 5000)
```bash
cd backend
npm start
```

### Server 2: Frontend (Port 5173)
```bash
cd proactive-education-assistant
npm run dev
```

---

## Step-by-Step Guide

### Step 1: Start Backend

Open a terminal and run:

```bash
cd backend
npm install  # First time only
npm start
```

You should see:
```
✅ Server running on port 5000
✅ API available at http://localhost:5000/api
✅ Database connected successfully
```

**KEEP THIS TERMINAL OPEN!**

### Step 2: Verify Backend is Running

Open your browser and go to:
```
http://localhost:5000/api/health
```

You should see:
```json
{
  "status": "ok",
  "message": "Server is running"
}
```

### Step 3: Start Frontend (if not already running)

Open a **NEW** terminal and run:

```bash
cd proactive-education-assistant
npm install  # First time only
npm run dev
```

You should see:
```
✅ VITE ready in XXX ms
✅ Local: http://localhost:5173/
```

### Step 4: Open the App

Go to: `http://localhost:5173`

---

## Verify Everything Works

### Test 1: Login
- Go to http://localhost:5173
- Login with your credentials
- Should work without errors

### Test 2: Enter Marks
- Login as teacher
- Go to Dashboard
- Click "Enter Marks" on an exam
- Enter marks for students
- Click "Save All Marks"
- Should see: "Marks saved successfully!"

### Test 3: View Attendance
- Go to "Attendance History"
- Should see attendance records
- No errors in console

---

## Common Problems

### Problem 1: "Port 5000 is already in use"

**Solution:**

**Windows:**
```cmd
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

**Mac/Linux:**
```bash
lsof -i :5000
kill -9 <PID>
```

Then start backend again.

### Problem 2: "Cannot find module"

**Solution:**
```bash
cd backend
rm -rf node_modules
npm install
npm start
```

### Problem 3: "Database error"

**Solution:**
```bash
cd backend/storage
rm education_assistant.db
cd ..
npm start
```

Database will be recreated automatically.

### Problem 4: Still seeing errors

**Solution:**
1. Stop both servers (Ctrl+C)
2. Close all browser tabs
3. Start backend first
4. Start frontend second
5. Open browser and try again

---

## Automated Startup

### Use the All-in-One Script:

**Windows:**
```cmd
start-all.bat
```

**Mac/Linux:**
```bash
chmod +x start-all.sh
./start-all.sh
```

This will:
1. ✅ Install dependencies (if needed)
2. ✅ Start backend server
3. ✅ Start frontend server
4. ✅ Open browser automatically

---

## Project Structure

```
.
├── backend/                    # Backend API Server
│   ├── controllers/           # Request handlers
│   ├── routes/               # API routes
│   ├── services/             # Business logic
│   ├── storage/              # Database
│   └── server.js             # Entry point
│
├── proactive-education-assistant/  # Frontend React App
│   ├── src/
│   │   ├── components/       # React components
│   │   ├── pages/            # Page components
│   │   └── services/         # API service
│   └── index.html
│
├── check-and-start-backend.bat    # Quick backend starter (Windows)
├── check-and-start-backend.sh     # Quick backend starter (Mac/Linux)
├── start-all.bat                  # Start everything (Windows)
├── start-all.sh                   # Start everything (Mac/Linux)
└── test-backend.js                # Test if backend is running
```

---

## Features Status

| Feature | Status | Notes |
|---------|--------|-------|
| Admin Profile | ✅ Working | View and edit profile |
| Teacher Profile | ✅ Working | View profile info |
| Student Management | ✅ Working | Add, edit, view students |
| Class Management | ✅ Working | Create and manage classes |
| Subject Management | ✅ Working | Assign subjects to classes |
| Exam Templates | ✅ Working | Create and edit templates |
| Marks Entry | ✅ Working | Enter and save marks |
| Attendance Tracking | ✅ Working | Mark and view attendance |
| Attendance History | ✅ Working | View with filters |
| Analytics | ✅ Working | View school statistics |
| Bulk Attendance Upload | ⏳ Coming Soon | File upload feature |
| Behavior Tracking | ⏳ Coming Soon | Track student behavior |

---

## Quick Commands

### Check if backend is running:
```bash
curl http://localhost:5000/api/health
```

### Check if frontend is running:
```bash
curl http://localhost:5173
```

### View backend logs:
Look at the terminal where you ran `npm start` in backend folder

### View frontend logs:
Press F12 in browser → Console tab

---

## Need Help?

### Documentation:
- 📖 [Quick Start Guide](QUICK_START.md)
- 🔧 [Troubleshooting Guide](TROUBLESHOOTING.md)
- 🐛 [Fix Score Entry Error](FIX_SCORE_ENTRY_ERROR.md)
- 📊 [Implementation Status](IMPLEMENTATION_STATUS.md)

### Quick Tests:
```bash
# Test backend
node test-backend.js

# Test marks endpoint
curl http://localhost:5000/api/marks
```

---

## Default Ports

- **Backend:** http://localhost:5000
- **Frontend:** http://localhost:5173
- **Database:** SQLite file (no port needed)

---

## Security Note

This is a development setup. For production:
- Change JWT_SECRET in backend/.env
- Use HTTPS
- Add rate limiting
- Use proper database (PostgreSQL/MySQL)
- Add input validation
- Enable CORS properly

---

## Tips

1. ✅ Always start backend BEFORE frontend
2. ✅ Keep both terminals open while using the app
3. ✅ Check backend console if something doesn't work
4. ✅ Press F12 in browser to see frontend errors
5. ✅ Use the automated startup scripts

---

## Summary

**The score entry feature is fully implemented and working!**

The error you're seeing is simply because the backend server is not running.

**To fix:**
1. Start the backend server
2. Refresh your browser
3. Try entering marks again

**That's it!** 🎉

---

## Next Steps

1. ✅ Start backend server (see Step 1 above)
2. ✅ Verify it's running (see Step 2 above)
3. ✅ Test score entry feature
4. ✅ Explore other features

---

Last Updated: 2025-02-23
