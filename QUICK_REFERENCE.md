# 🚀 Quick Reference Card

## ⚡ Start Testing in 3 Commands

```bash
# 1. Start Backend
cd backend && npm start

# 2. Start ngrok
ngrok http 5000

# 3. Open Android Studio
cd proactive-education-assistant && npx cap open android
```

Then click **Run** ▶️ in Android Studio!

---

## 🎯 What to Test

### ✅ Online Mode (1 min)
1. Login
2. Go to "Add Students"
3. See 🟢 **Green "Online"** badge
4. Add student → See **"✅ Success!"**

### ✅ Offline Mode (1 min)
1. Enable **Airplane Mode**
2. See 🟡 **Yellow "Offline"** badge
3. See **Yellow banner** at top
4. Add student → See **"📵 Saved locally!"**
5. See **"1 pending"** in status bar

### ✅ Auto Sync (30 sec)
1. Disable **Airplane Mode**
2. See **"Syncing..."** with spinner
3. See **"Last sync: Just now"**
4. Pending count becomes **0**

---

## 📱 UI Components

| Component | Location | Shows When |
|-----------|----------|------------|
| 📵 Offline Banner | Top | Offline only |
| 🟢/🟡 Status Badge | Top Right | Always |
| ✅ Success Message | Below header | After action |
| 📊 Sync Status Bar | Bottom | Always |

---

## 🎨 Status Indicators

| Icon | Meaning |
|------|---------|
| 🟢 Online | Connected to internet |
| 🟡 Offline | No internet connection |
| ✅ Synced | Data up to date |
| 🔄 Syncing | Sync in progress |
| ⏰ Pending | Items waiting to sync |
| ❌ Error | Sync failed |

---

## 🔄 Data Flow

### Online:
```
Add Student → Local DB → Backend → ✅ Success
```

### Offline:
```
Add Student → Local DB → Queue → 📵 Saved locally
```

### Sync:
```
Connection → Process Queue → Backend → ✅ Synced
```

---

## 🐛 Quick Fixes

### App crashes:
```bash
npx cap run android --livereload
```

### Rebuild needed:
```bash
cd proactive-education-assistant
npm run build
npx cap sync
```

### Check logs:
- Android Studio: Logcat tab
- Chrome: DevTools console

---

## ✅ Success Checklist

- [ ] Backend running
- [ ] ngrok running
- [ ] App opens
- [ ] Login works
- [ ] Online badge shows
- [ ] Can add student online
- [ ] Offline badge shows in airplane mode
- [ ] Can add student offline
- [ ] Auto sync works

---

## 📊 Expected Results

### Online:
- Badge: 🟢 Green "Online"
- Message: "✅ Student added successfully!"
- Status: "Last sync: Just now"

### Offline:
- Banner: 📵 Yellow at top
- Badge: 🟡 Yellow "Offline"
- Message: "📵 Offline: Student saved locally..."
- Status: "X pending"

### Syncing:
- Status: "🔄 Syncing... X%"
- Then: "✅ Last sync: Just now"
- Pending: 0

---

## 🎯 Key Features

✅ Works offline  
✅ Auto sync  
✅ Local storage  
✅ Clear indicators  
✅ No data loss  
✅ Instant response  

---

## 📞 Need Help?

Check these files:
- `TEST_NOW.md` - Detailed testing guide
- `VISUAL_GUIDE.md` - What you'll see
- `OFFLINE_INTEGRATION_COMPLETE.md` - Full documentation
- `IMPLEMENTATION_SUMMARY.md` - Complete overview

---

## 🎉 You're Ready!

Everything is set up and ready to test.

**Just run the 3 commands above and start testing!**

---

**Status**: Ready ✅  
**Date**: February 26, 2026
