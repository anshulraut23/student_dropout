# Backend Server Startup Guide

## Error: Server responded with 500 (Internal Server Error)

This error occurs when:
1. The backend server is not running
2. The backend server crashed
3. There's a database connection issue

## How to Fix:

### Step 1: Start the Backend Server

```bash
cd backend
npm install
npm start
```

The server should start on `http://localhost:5000`

### Step 2: Check for Errors

If you see errors like:
- "Cannot find module" - Run `npm install` again
- "Port already in use" - Kill the process using port 5000
- "Database error" - Check if `backend/storage/education_assistant.db` exists

### Step 3: Verify Server is Running

Open a browser and go to:
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

### Step 4: Check Environment Variables

Make sure `backend/.env` file exists with:
```
PORT=5000
JWT_SECRET=your-secret-key-here
NODE_ENV=development
```

### Step 5: Test the Students Endpoint

Once the server is running, test:
```
http://localhost:5000/api/students
```

You should get a JSON response (might be 401 if not authenticated, which is expected).

## Common Issues:

### Issue 1: "Failed to load resource: net::ERR_CONNECTION_REFUSED"
**Solution:** Backend server is not running. Start it with `npm start` in the backend folder.

### Issue 2: "Server responded with HTML instead of JSON"
**Solution:** The API endpoint doesn't exist or there's a routing issue. Check the backend logs.

### Issue 3: "500 Internal Server Error"
**Solution:** Check backend console for error details. Usually a database or code error.

## Quick Fix Script:

Create a file `start-backend.bat` (Windows) or `start-backend.sh` (Mac/Linux):

**Windows (start-backend.bat):**
```batch
@echo off
cd backend
echo Installing dependencies...
call npm install
echo Starting backend server...
call npm start
```

**Mac/Linux (start-backend.sh):**
```bash
#!/bin/bash
cd backend
echo "Installing dependencies..."
npm install
echo "Starting backend server..."
npm start
```

Make it executable (Mac/Linux only):
```bash
chmod +x start-backend.sh
```

Then run it:
- Windows: Double-click `start-backend.bat`
- Mac/Linux: `./start-backend.sh`
