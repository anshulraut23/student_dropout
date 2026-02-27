# Clear Browser Cache - Fix "14 days" Issue

## Problem
Browser is showing old cached JavaScript with "14 days" instead of "3 days"

## Solution: Hard Refresh

### Windows/Linux:
```
Ctrl + Shift + R
or
Ctrl + F5
```

### Mac:
```
Cmd + Shift + R
or
Cmd + Option + R
```

### Alternative: Clear Cache Manually

**Chrome:**
1. Press `F12` to open DevTools
2. Right-click the refresh button
3. Select "Empty Cache and Hard Reload"

**Firefox:**
1. Press `Ctrl + Shift + Delete`
2. Select "Cached Web Content"
3. Click "Clear Now"

**Edge:**
1. Press `Ctrl + Shift + Delete`
2. Select "Cached images and files"
3. Click "Clear now"

## After Clearing Cache

1. Close all browser tabs for localhost:3000
2. Restart the frontend if needed:
   ```bash
   cd proactive-education-assistant
   # Ctrl+C to stop
   npm start
   ```
3. Open fresh browser tab to http://localhost:3000
4. Login and check Risk Analysis tab

## Verify Fix

You should now see:
- ✅ "Please add 2 more days of attendance" (not 14)
- ✅ "Mark attendance for 2 more days" (not 14)
- ✅ "2 days and 1 exam away from predictions" (not 14)

## If Still Showing "14 days"

1. Check if backend was restarted after code changes
2. Try incognito/private browsing mode
3. Check browser console for errors (F12)
4. Verify the file was actually saved with changes
