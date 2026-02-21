# Debugging Fixes Applied

## Issues Found

Based on the console errors in your screenshot:

1. **404 Errors** - API endpoints not being found
2. **JSON Parse Errors** - Server returning non-JSON responses
3. **Token Validation Errors** - Authentication issues
4. **Papaparse Import Errors** - CSV library not installed

## Fixes Applied

### 1. Simplified Student Pages

I've created simplified versions of the student pages that:
- Have better error handling
- Show detailed console logs for debugging
- Don't require papaparse initially
- Have clearer error messages

**Files Updated:**
- `StudentListPage.jsx` - Simplified version (backup saved as `StudentListPage_Backup.jsx`)
- `AddStudentPage.jsx` - Simplified version without bulk upload (backup saved as `AddStudentPage_Backup.jsx`)

### 2. Improved API Service

Updated `apiService.js` to:
- Check if response is JSON before parsing
- Show better error messages
- Handle non-JSON responses gracefully

### 3. Better Error Handling in Backend

Updated `server.js` to:
- Add 404 handler for unknown endpoints
- Show which endpoint was not found
- Better error logging

## Testing Steps

### Step 1: Restart Backend Server

```bash
# Stop the current backend server (Ctrl+C)
cd backend
npm start
```

You should see:
```
Server running on port 5000
API available at http://localhost:5000/api
```

### Step 2: Test Backend Endpoints

Open a new terminal and test:

```bash
# Test health endpoint
curl http://localhost:5000/api/health

# Should return: {"status":"ok","message":"Server is running"}
```

### Step 3: Check Authentication

1. Open browser DevTools (F12)
2. Go to Application/Storage > Local Storage
3. Check if you have a `token` stored
4. If not, you need to login again

### Step 4: Test Student Endpoints

After logging in as a teacher:

1. Go to `/students` page
2. Open browser console (F12)
3. Look for console logs:
   - "Loading students for class: ..."
   - "Students result: ..."

4. If you see errors, check:
   - Is backend running?
   - Do you have a valid token?
   - Are you logged in as a teacher?

### Step 5: Test Add Student

1. Go to `/add-student` page
2. Open browser console
3. Look for:
   - "Loading classes..."
   - "Classes result: ..."

4. Fill in the form and submit
5. Check console for:
   - "Submitting student: ..."
   - "Create result: ..."

## Common Issues & Solutions

### Issue: "Failed to load resources: the server responded with a status of 404"

**Cause**: Backend server not running or endpoint doesn't exist

**Solution**:
1. Make sure backend is running: `cd backend && npm start`
2. Check the URL in the error - should be `http://localhost:5000/api/...`
3. Verify the endpoint exists in backend routes

### Issue: "Unexpected token '<', \"<!DOCTYPE \"... is not valid JSON"

**Cause**: Server returning HTML instead of JSON (usually a 404 page)

**Solution**:
1. Check if the API endpoint exists
2. Verify the URL is correct
3. Make sure backend server is running

### Issue: "Unexpected token 'U', \"Unexpected\"... is not valid JSON"

**Cause**: Server returning plain text error instead of JSON

**Solution**:
1. Check backend console for errors
2. Look for syntax errors in backend code
3. Verify all routes are properly imported

### Issue: "Cannot find module 'papaparse'"

**Cause**: Papaparse library not installed

**Solution**:
```bash
cd proactive-education-assistant
npm install papaparse
```

Then restore the full version:
```bash
# Restore the backup with bulk upload
Copy-Item "src/pages/teacher/AddStudentPage_Backup.jsx" "src/pages/teacher/AddStudentPage.jsx" -Force
```

### Issue: "Access denied" or "Insufficient permissions"

**Cause**: Not logged in or wrong role

**Solution**:
1. Make sure you're logged in
2. Check you're logged in as a teacher (not admin)
3. Verify the teacher is assigned to classes
4. Check token is valid (not expired)

### Issue: "Failed to load classes"

**Cause**: Teacher not assigned to any classes or API error

**Solution**:
1. Login as admin
2. Go to Teacher Management
3. Assign the teacher to classes
4. Make sure teacher is approved
5. Logout and login again as teacher

## Debugging Checklist

- [ ] Backend server is running on port 5000
- [ ] Frontend is running on port 5173
- [ ] You're logged in (check Local Storage for token)
- [ ] You're logged in as the correct role (teacher/admin)
- [ ] Browser console is open to see errors
- [ ] Network tab is open to see API calls
- [ ] Backend console is visible to see server logs

## Console Logs to Check

### Frontend Console (Browser):
```
Loading students for class: null
Students result: {success: true, students: [...]}
```

### Backend Console (Terminal):
```
Server running on port 5000
API available at http://localhost:5000/api
GET /api/students 200 - 15ms
POST /api/students 201 - 25ms
```

## Next Steps After Fixing

Once the simplified versions work:

1. **Install papaparse**:
   ```bash
   cd proactive-education-assistant
   npm install papaparse
   ```

2. **Restore full versions**:
   ```bash
   # Restore StudentListPage with all features
   Copy-Item "src/pages/teacher/StudentListPage_Backup.jsx" "src/pages/teacher/StudentListPage.jsx" -Force
   
   # Restore AddStudentPage with bulk upload
   Copy-Item "src/pages/teacher/AddStudentPage_Backup.jsx" "src/pages/teacher/AddStudentPage.jsx" -Force
   ```

3. **Test bulk upload**:
   - Go to Add Student page
   - Click "Bulk Upload" tab
   - Download template
   - Upload CSV file

## Files Modified

### Simplified (Current):
- `src/pages/teacher/StudentListPage.jsx` - Basic version with debugging
- `src/pages/teacher/AddStudentPage.jsx` - Single student only, no bulk upload

### Backups (Full Featured):
- `src/pages/teacher/StudentListPage_Backup.jsx` - Full version with search/filter/export
- `src/pages/teacher/AddStudentPage_Backup.jsx` - Full version with bulk upload

### Updated:
- `src/services/apiService.js` - Better error handling
- `backend/server.js` - 404 handler and better logging

## Quick Test Script

Run this in your browser console after logging in:

```javascript
// Test if API is accessible
fetch('http://localhost:5000/api/health')
  .then(r => r.json())
  .then(d => console.log('Health check:', d))
  .catch(e => console.error('Health check failed:', e));

// Test if you're authenticated
const token = localStorage.getItem('token');
console.log('Token exists:', !!token);
console.log('Token:', token?.substring(0, 20) + '...');

// Test students endpoint
fetch('http://localhost:5000/api/students', {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
})
  .then(r => r.json())
  .then(d => console.log('Students:', d))
  .catch(e => console.error('Students failed:', e));
```

## Support

If issues persist:

1. Share the console errors (both frontend and backend)
2. Share the Network tab showing the failed requests
3. Verify all files are saved
4. Try clearing browser cache
5. Try logging out and logging in again
