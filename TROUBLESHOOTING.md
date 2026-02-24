# Troubleshooting Guide

## Error: "Failed to load resource: the server responded with a status of 500"

### What This Means
The backend server received your request but encountered an error while processing it.

### Solution Steps:

#### 1. Check if Backend Server is Running

Open a terminal and run:
```bash
cd backend
npm start
```

You should see:
```
Server running on port 5000
Database connected successfully
```

#### 2. Check Backend Console for Errors

Look at the terminal where the backend is running. You should see error messages that explain what went wrong.

Common errors:
- **"Cannot find module"** → Run `npm install` in the backend folder
- **"EADDRINUSE"** → Port 5000 is already in use. Kill the process or change the port
- **"Database error"** → Database file is corrupted or missing

#### 3. Verify Database Exists

Check if this file exists:
```
backend/storage/education_assistant.db
```

If it doesn't exist, the backend will create it automatically on first run.

#### 4. Check Environment Variables

Make sure `backend/.env` exists with:
```env
PORT=5000
JWT_SECRET=your-secret-key-change-this-in-production
NODE_ENV=development
```

#### 5. Test the Backend Directly

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

If you see an error page or "Cannot GET /api/health", the backend is not running properly.

---

## Error: "Cannot connect to backend server"

### What This Means
The frontend cannot reach the backend server at all.

### Solution Steps:

#### 1. Start the Backend Server

```bash
cd backend
npm install
npm start
```

#### 2. Check if Port 5000 is Available

**Windows:**
```cmd
netstat -ano | findstr :5000
```

**Mac/Linux:**
```bash
lsof -i :5000
```

If something is using port 5000, either:
- Kill that process
- Change the backend port in `backend/.env` and `proactive-education-assistant/.env`

#### 3. Check Firewall Settings

Make sure your firewall isn't blocking port 5000.

**Windows:** Go to Windows Defender Firewall → Allow an app
**Mac:** System Preferences → Security & Privacy → Firewall

---

## Error: "Student not found" or "Access denied"

### What This Means
Either the student doesn't exist, or you don't have permission to view it.

### Solution Steps:

#### 1. Check if You're Logged In

Make sure you're logged in with the correct account (admin or teacher).

#### 2. Check if Student Exists

Go to the Students page and verify the student is in the list.

#### 3. Check Class Assignment

Teachers can only view students in classes they teach. Admins can view all students.

---

## Error: "Template update not working"

### What This Means
The exam template appears to update but changes aren't saved.

### Solution Steps:

#### 1. Check Backend Logs

Look at the backend console when you click "Update". You should see:
```
🔄 Update template controller: { templateId: '...', updates: {...} }
✅ Template updated: {...}
```

#### 2. Check Browser Console

Press F12 and look at the Console tab. Check for errors.

#### 3. Verify API Call

In the Network tab (F12), look for the PUT request to `/api/exam-templates/:id`

Check:
- Status should be 200
- Response should contain the updated template

#### 4. Clear Browser Cache

Sometimes old data is cached. Press Ctrl+Shift+Delete and clear cache.

---

## General Debugging Steps

### 1. Check Both Servers Are Running

You need TWO servers running:

**Backend (Port 5000):**
```bash
cd backend
npm start
```

**Frontend (Port 5173):**
```bash
cd proactive-education-assistant
npm run dev
```

### 2. Check Browser Console

Press F12 → Console tab
Look for red error messages

### 3. Check Network Tab

Press F12 → Network tab
Look for failed requests (red)
Click on them to see details

### 4. Check Backend Console

Look at the terminal where backend is running
Check for error messages

### 5. Restart Everything

Sometimes a fresh start helps:

1. Stop both servers (Ctrl+C)
2. Close all browser tabs
3. Start backend: `cd backend && npm start`
4. Start frontend: `cd proactive-education-assistant && npm run dev`
5. Open browser and try again

---

## Quick Fix Checklist

- [ ] Backend server is running on port 5000
- [ ] Frontend server is running on port 5173
- [ ] `backend/.env` file exists with JWT_SECRET
- [ ] `backend/storage/education_assistant.db` exists
- [ ] No firewall blocking ports 5000 or 5173
- [ ] Browser console shows no errors
- [ ] You're logged in with correct credentials
- [ ] You have the necessary permissions (admin/teacher)

---

## Still Having Issues?

### Collect Debug Information

1. **Backend Console Output:**
   - Copy all text from backend terminal
   
2. **Browser Console Errors:**
   - Press F12 → Console tab
   - Copy all red error messages
   
3. **Network Request Details:**
   - Press F12 → Network tab
   - Find the failed request
   - Right-click → Copy → Copy as cURL

4. **Environment Details:**
   - Operating System
   - Node.js version (`node --version`)
   - npm version (`npm --version`)

### Reset Everything

If nothing works, try a complete reset:

```bash
# Stop all servers
# Then:

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

## Common Port Issues

### Change Backend Port

If port 5000 is in use:

1. Edit `backend/.env`:
   ```env
   PORT=5001
   ```

2. Edit `proactive-education-assistant/.env`:
   ```env
   VITE_API_URL=http://localhost:5001/api
   ```

3. Restart both servers

### Change Frontend Port

If port 5173 is in use:

1. Edit `proactive-education-assistant/vite.config.js`:
   ```js
   export default defineConfig({
     server: {
       port: 3000
     }
   })
   ```

2. Restart frontend server
