# Quick Start: Test Offline PWA in 5 Minutes ⚡

## Prerequisites
- Backend running on `http://localhost:5000`
- Chrome browser

## Step 1: Start Frontend (30 seconds)
```bash
cd proactive-education-assistant
npm run dev
```

Open: `http://localhost:5173`

## Step 2: Login (30 seconds)
- Login as teacher
- Navigate to Dashboard

## Step 3: Test Offline Mode (2 minutes)

### Go Offline
1. Press `F12` to open DevTools
2. Click **Network** tab
3. Check **Offline** checkbox
4. Look for red "Offline" badge in top-right

### Save Data Offline
1. Go to **Data Entry** > **Attendance** tab
2. Select a class and today's date
3. Mark 3-5 students as Present
4. Click **Save Attendance**
5. ✅ See toast: "Saved locally. Will sync when online."
6. ✅ See yellow badge: "X pending"

### Try More Operations
1. Go to **Scores** tab
2. Enter marks for 2-3 students
3. Click **Save Marks**
4. ✅ Queue counter increases

## Step 4: Test Auto-Sync (1 minute)

### Go Back Online
1. In DevTools Network tab
2. **Uncheck** "Offline" checkbox
3. Watch the magic happen! ✨

### What You'll See
- ✅ Green "Online" badge appears
- ✅ Blue toast: "Syncing offline data..."
- ✅ Progress bar shows sync progress
- ✅ Green toast: "All data synced successfully!"
- ✅ Queue counter disappears
- ✅ Console logs show sync activity

### Verify Data
1. Refresh the page
2. Check attendance/marks are in database
3. All offline data is now saved! 🎉

## Step 5: Test Manual Sync (1 minute)

1. Go offline again (check Offline)
2. Mark attendance for 2 more students
3. Go online (uncheck Offline)
4. Click blue **"Sync X items"** button in top-right
5. Watch sync progress
6. Success! ✅

## What to Look For

### Visual Indicators
- 🔴 **Red badge** = Offline
- 🟢 **Green badge** = Online
- 🟡 **Yellow badge** = X items pending sync
- 🔵 **Blue button** = Manual sync available

### Console Logs
```
🔴 Network: Offline
📴 Offline mode: Queuing request /api/attendance/mark
🟢 Network: Online
🔄 Network restored - triggering auto-sync
🔄 Syncing 3 items...
✓ Synced attendance (1/3)
✓ Synced attendance (2/3)
✓ Synced attendance (3/3)
✓ Sync complete: 3 success, 0 failed
```

### Toast Messages
- "Saved locally. Will sync when online." (offline save)
- "Syncing offline data..." (sync in progress)
- "All data synced successfully! X items synced" (sync complete)

## Troubleshooting

### "Offline" checkbox not working?
- Make sure you're in the **Network** tab
- Try closing and reopening DevTools

### No sync happening?
- Check Console for errors
- Verify backend is running
- Try clicking manual sync button

### Data not appearing?
- Check backend logs for errors
- Verify you're logged in
- Refresh the page

## Advanced Testing

### Test Queue Persistence
1. Go offline
2. Save some data
3. Close browser tab completely
4. Reopen app
5. ✅ Queue counter still shows pending items
6. Go online
7. ✅ Auto-sync processes the queue

### Test Large Queue
1. Go offline
2. Mark attendance for 20+ students (bulk)
3. Enter marks for 10+ students
4. Log 5+ behavior incidents
5. Go online
6. ✅ All items sync successfully

### Test Failed Sync
1. Stop backend server (Ctrl+C)
2. Go offline, save data
3. Go online (backend still stopped)
4. ✅ Sync fails, items stay in queue
5. Start backend
6. Click manual sync
7. ✅ Items sync successfully

## Demo Script for Hackathon

### Setup (30 seconds)
- Open app, login as teacher
- Open DevTools, go to Network tab

### Demo (3 minutes)

**"Let me show you our offline capability..."**

1. Enable Offline mode
2. "Notice the app still works perfectly"
3. Mark attendance for 3 students
4. "See? Saved locally. Data is queued."
5. Show queue counter
6. Disable Offline mode
7. "Watch this - automatic sync!"
8. Show sync progress
9. "All data synced. Zero data loss!"
10. Refresh to show data in database

**Key Points:**
- Works on any smartphone
- No internet required for data entry
- Automatic sync when online
- Solves rural connectivity problem

## Success Criteria ✅

- [ ] Service Worker registered (check Console)
- [ ] Offline mode works (can navigate pages)
- [ ] Data saves offline (see toast)
- [ ] Queue counter shows pending items
- [ ] Auto-sync triggers on network restore
- [ ] Manual sync button works
- [ ] All data appears in database after sync
- [ ] No errors in Console

## Next Steps

1. ✅ Test locally (you just did!)
2. 📱 Test on real Android device
3. 🎨 Generate PWA icons (see `public/PWA_ICONS_README.md`)
4. 🚀 Deploy to production
5. 🏆 Win hackathon!

---

**Time to Complete:** 5 minutes  
**Difficulty:** Easy  
**Impact:** High  

**Questions?** Check `OFFLINE_PWA_TESTING.md` for detailed testing guide.
