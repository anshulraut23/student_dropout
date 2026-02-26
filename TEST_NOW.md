# 🧪 TEST YOUR OFFLINE-FIRST APP NOW!

## ✅ Everything is Ready!

All offline-first functionality has been integrated. Time to test!

---

## 🚀 Quick Start (3 Steps)

### Step 1: Start Backend & ngrok
```bash
# Terminal 1: Backend
cd backend
npm start

# Terminal 2: ngrok
ngrok http 5000
```

### Step 2: Open Android Studio
```bash
cd proactive-education-assistant
npx cap open android
```

### Step 3: Run App
Click the green "Run" button in Android Studio

---

## 🧪 Test Scenarios

### ✅ Test 1: Online Mode (2 minutes)
1. Login to app
2. Go to "Add Students" page
3. See **green "Online" badge** ✅
4. Add a student:
   - Name: Test Student
   - Roll No: 001
   - Class: Any
5. Click "Save Student"
6. See: **"✅ Student added successfully!"**
7. Check **Sync Status Bar** at bottom: "Last sync: Just now"

**Expected**: Student saved to backend immediately

---

### ✅ Test 2: Offline Mode (2 minutes)
1. Enable **Airplane Mode** in emulator
2. See **yellow "Offline" banner** at top ✅
3. See **yellow "Offline" badge** on page ✅
4. Add a student:
   - Name: Offline Student
   - Roll No: 002
   - Class: Any
5. Click "Save Student"
6. See: **"📵 Offline: Student saved locally and will sync when online!"**
7. Check **Sync Status Bar**: "1 pending"

**Expected**: Student saved to local database, queued for sync

---

### ✅ Test 3: Auto Sync (1 minute)
1. Disable **Airplane Mode**
2. See **yellow banner disappear** ✅
3. See **badge turn green** ✅
4. Watch **Sync Status Bar**:
   - "Syncing... X%"
   - Then "Last sync: Just now"
   - Pending count becomes 0
5. Check backend - offline student should be there!

**Expected**: Automatic synchronization happens

---

## 🎯 What to Look For

### UI Indicators:
- 🟢 **Green "Online" badge** - Connected
- 🟡 **Yellow "Offline" badge** - No connection
- 📵 **Yellow banner at top** - Offline mode active
- ⏰ **"X pending" in status bar** - Items waiting to sync
- 🔄 **"Syncing..." with spinner** - Sync in progress
- ✅ **"Last sync: Just now"** - Sync completed

### Success Messages:
- **Online**: "✅ Student added successfully!"
- **Offline**: "📵 Offline: Student saved locally and will sync when online!"

---

## 📱 Where to Find Components

### 1. Offline Indicator
**Location**: Top of screen (fixed)
**Shows**: Only when offline
**Color**: Yellow banner

### 2. Online/Offline Badge
**Location**: Top right of Add Students page
**Shows**: Always
**Colors**: Green (online) / Yellow (offline)

### 3. Sync Status Bar
**Location**: Bottom of screen
**Shows**: Always
**Info**: Last sync time, pending count, sync button

---

## 🐛 If Something Goes Wrong

### App crashes on startup:
```bash
# Check logs
npx cap run android --livereload
```

### Offline indicator not showing:
1. Try toggling airplane mode
2. Check console logs
3. Restart app

### Sync not working:
1. Check backend is running
2. Check ngrok is running
3. Check .env has correct ngrok URL
4. Rebuild: `npm run build && npx cap sync`

### Data not saving:
1. Check console for errors
2. Check Database Inspector in Android Studio
3. Check SQLite plugin is installed

---

## 📊 How to Verify Data

### Check Local Database:
1. In Android Studio: View > Tool Windows > App Inspection
2. Select "Database Inspector"
3. Look for tables: students, sync_queue
4. Verify data is there

### Check Backend:
1. Check backend console logs
2. Or query your database directly

---

## ✅ Success Checklist

After testing, you should have verified:
- [ ] App starts without errors
- [ ] Login works
- [ ] Online badge shows when connected
- [ ] Can add student online
- [ ] Student syncs to backend immediately
- [ ] Offline banner shows in airplane mode
- [ ] Offline badge shows when disconnected
- [ ] Can add student offline
- [ ] Student saves to local database
- [ ] Pending count increases
- [ ] Auto sync happens when back online
- [ ] Pending count becomes 0
- [ ] Offline student appears in backend
- [ ] Sync status bar updates correctly

---

## 🎉 Expected Results

### Online Mode:
```
User adds student
    ↓
Saves to local DB (instant)
    ↓
Sends to backend (background)
    ↓
"✅ Student added successfully!"
    ↓
Sync status: "Last sync: Just now"
```

### Offline Mode:
```
User adds student
    ↓
Saves to local DB (instant)
    ↓
Adds to sync queue
    ↓
"📵 Offline: Student saved locally..."
    ↓
Sync status: "1 pending"
```

### Back Online:
```
Internet reconnects
    ↓
Sync manager detects
    ↓
"Syncing... 50%"
    ↓
Processes queue
    ↓
Sends to backend
    ↓
"Last sync: Just now"
    ↓
Pending: 0
```

---

## 🚀 Ready to Test!

Everything is set up and ready. Just:
1. Start backend
2. Start ngrok
3. Open in Android Studio
4. Run and test!

**Good luck! 🎉**

---

**Status**: Ready for Testing ✅  
**Date**: February 26, 2026
