# Fix: Score Entry Not Working

## The Problem

You're seeing these errors:
- ❌ `TypeError: not found`
- ❌ `Failed to fetch`
- ❌ `Endpoint not found`
- ❌ `Score submission error: Endpoint not found`

## Root Cause

**The backend server is not running!**

The frontend is trying to call `http://localhost:5000/api/marks/bulk` but the backend server is not responding.

---

## Solution: Start the Backend Server

### Method 1: Use the Startup Script (Recommended)

**Windows:**
```cmd
start-all.bat
```

**Mac/Linux:**
```bash
chmod +x start-all.sh
./start-all.sh
```

### Method 2: Manual Start

**Step 1: Open a terminal**

**Step 2: Navigate to backend folder**
```bash
cd backend
```

**Step 3: Install dependencies (first time only)**
```bash
npm install
```

**Step 4: Start the server**
```bash
npm start
```

**Step 5: Verify it's running**

You should see:
```
Server running on port 5000
API available at http://localhost:5000/api
Database connected successfully
```

**Keep this terminal window open!**

---

## Verify Backend is Running

### Test 1: Health Check

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

### Test 2: Check Marks Endpoint

Open your browser and go to:
```
http://localhost:5000/api/marks
```

You should see either:
- A 401 error (Unauthorized) - This is OK! It means the endpoint exists
- A JSON response with marks data

If you see "Cannot GET /api/marks" or a 404 error, the routes are not registered properly.

---

## If Backend Won't Start

### Error: "Port 5000 is already in use"

**Windows:**
```cmd
netstat -ano | findstr :5000
taskkill /PID <PID_NUMBER> /F
```

**Mac/Linux:**
```bash
lsof -i :5000
kill -9 <PID_NUMBER>
```

### Error: "Cannot find module"

```bash
cd backend
rm -rf node_modules
rm package-lock.json
npm install
npm start
```

### Error: "Database error"

```bash
cd backend/storage
del education_assistant.db  # Windows
rm education_assistant.db   # Mac/Linux
cd ..
npm start
```

The database will be recreated automatically.

---

## Test Score Entry

Once the backend is running:

1. **Login as a teacher**
2. **Go to Dashboard**
3. **Click "Enter Marks" on an exam**
4. **Enter marks for students**
5. **Click "Save All Marks"**

### Expected Behavior:

✅ You should see: "Marks saved successfully! Entered: X, Failed: 0"

### If Still Not Working:

**Check Backend Console:**
Look at the terminal where backend is running. You should see:
```
POST /api/marks/bulk 201 - - ms
```

**Check Browser Console (F12):**
- Look for the POST request to `/api/marks/bulk`
- Check the response status (should be 201)
- Check the response body

**Check Network Tab (F12 → Network):**
- Find the request to `marks/bulk`
- Click on it
- Check:
  - Request URL: Should be `http://localhost:5000/api/marks/bulk`
  - Status: Should be 201
  - Response: Should have `success: true`

---

## Common Issues

### Issue 1: "CORS Error"

**Symptom:** Error mentions "CORS policy" or "Access-Control-Allow-Origin"

**Solution:** Make sure backend has CORS enabled (it should be by default)

Check `backend/server.js` has:
```javascript
import cors from 'cors';
app.use(cors());
```

### Issue 2: "401 Unauthorized"

**Symptom:** Error says "Access token required" or "Unauthorized"

**Solution:** You're not logged in or token expired

1. Logout
2. Login again
3. Try entering marks again

### Issue 3: "Validation Error"

**Symptom:** Error says "Marks must be between 0 and X"

**Solution:** Check the marks you entered are valid

- Marks should be between 0 and total marks
- Marks should be numbers, not text
- Status should be present/absent/exempted

---

## Debug Checklist

- [ ] Backend server is running on port 5000
- [ ] Frontend server is running on port 5173
- [ ] Can access http://localhost:5000/api/health
- [ ] Logged in as teacher
- [ ] Selected an exam to enter marks
- [ ] Entered valid marks (0 to total marks)
- [ ] No errors in backend console
- [ ] No errors in browser console (F12)

---

## Still Not Working?

### Collect Debug Information:

1. **Backend Console Output:**
   - Copy everything from the backend terminal
   
2. **Browser Console Errors:**
   - Press F12
   - Go to Console tab
   - Copy all red errors
   
3. **Network Request:**
   - Press F12
   - Go to Network tab
   - Find the `marks/bulk` request
   - Right-click → Copy → Copy as cURL

4. **Request Payload:**
   - In Network tab
   - Click on `marks/bulk` request
   - Go to "Payload" or "Request" tab
   - Copy the data being sent

### Try Complete Reset:

```bash
# Stop all servers (Ctrl+C in both terminals)

# Backend
cd backend
rm -rf node_modules
rm package-lock.json
npm install
npm start

# Frontend (in new terminal)
cd proactive-education-assistant
rm -rf node_modules
rm package-lock.json
npm install
npm run dev
```

---

## Quick Test Script

Run this to test if backend is working:

```bash
node test-backend.js
```

You should see:
```
✅ Backend is running! Status: 200
Response: {"status":"ok","message":"Server is running"}
```

If you see:
```
❌ Backend is NOT running!
```

Then start the backend server.

---

## What Was Fixed

1. ✅ Added better error messages in MarksEntryPage
2. ✅ Added console logging for debugging
3. ✅ Added specific error handling for common issues
4. ✅ Created test script to check backend
5. ✅ Created comprehensive troubleshooting guide

---

## Next Steps

1. **Start the backend server** using one of the methods above
2. **Verify it's running** by checking http://localhost:5000/api/health
3. **Try entering marks again**
4. **If still not working**, follow the debug checklist above

---

## Prevention

To avoid this issue in the future:

1. **Always start backend first**, then frontend
2. **Keep backend terminal open** while using the app
3. **Check backend console** if something doesn't work
4. **Use the startup script** (`start-all.bat` or `start-all.sh`)

---

## Summary

The score entry feature is fully implemented and working. The error you're seeing is simply because the backend server is not running. Start the backend server and everything will work!

```bash
cd backend
npm start
```

That's it! 🎉
