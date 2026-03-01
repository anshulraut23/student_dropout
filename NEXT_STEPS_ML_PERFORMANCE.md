# 🎯 Next Steps - ML Performance Tracking Setup

## Current Status

✅ **Completed:**
- ML model is trained (v20260301_020003)
- Performance metrics exist in model_metadata.json
- Database sync script created and working
- Scheduled task configured (runs at 2 AM daily)
- All documentation created

⚠️ **Needs Action:**
- Get admin authentication token
- Add token to ml-service/.env
- Run sync script to save current model to database

---

## What You Need to Do Now (5 minutes)

### Quick Start - Use the Helper Script

```bash
setup-ml-token.bat
```

This will:
1. Open a helper page in your browser
2. Open the .env file in Notepad
3. Guide you through getting and adding your token

### OR Follow These Steps Manually:

#### 1. Get Your Admin Token (2 minutes)

**Option A - Use Helper Page:**
- Open `get-admin-token.html` in your browser
- Click "Get My Token"
- Copy the token

**Option B - Manual:**
- Login as admin at `http://localhost:3000/admin/login`
- Press F12 → Application → Local Storage → localhost:3000
- Copy the `token` value

**Need help?** See `GET_ADMIN_TOKEN_GUIDE.md` for detailed instructions.

#### 2. Add Token to Configuration (1 minute)

Open `ml-service/.env` and update this line:

```env
ADMIN_AUTH_TOKEN=<paste_your_token_here>
```

Save the file.

#### 3. Run Sync Script (1 minute)

```bash
cd ml-service
sync_performance_to_db.bat
```

You should see:
```
✅ Performance metrics saved to database successfully!
   Accuracy: 0.6900
   F1-Score: 0.5441
```

#### 4. Verify in Dashboard (1 minute)

1. Go to `http://localhost:3000/admin/dashboard`
2. Click "ML Performance" in the sidebar
3. You should see the performance metrics!

---

## What Happens After Setup

### Automatic (Every Night at 2 AM)
```
Scheduled Task Runs
    ↓
Model Retrains with Latest Data
    ↓
Performance Metrics Calculated
    ↓
Automatically Saved to Database
    ↓
Visible in Admin Dashboard
```

### Manual (Anytime You Want)
```bash
# Train model manually
cd ml-service
python generate_and_train.py

# Sync to database
python save_performance_to_db.py

# View in dashboard
# Navigate to /admin/model-performance
```

---

## Files You Need to Know About

### Helper Scripts (Use These!)
- `setup-ml-token.bat` - Automated setup helper
- `get-admin-token.html` - Token extraction helper
- `ml-service/sync_performance_to_db.bat` - Manual sync

### Configuration
- `ml-service/.env` - Where you add the token

### Documentation
- `GET_ADMIN_TOKEN_GUIDE.md` - Detailed token guide
- `SETUP_ML_PERFORMANCE_TRACKING.md` - Full setup guide
- `ML_PERFORMANCE_QUICK_REFERENCE.md` - Quick commands
- `ML_PERFORMANCE_COMPLETE.md` - Complete overview

---

## Troubleshooting

### Error: "401 Unauthorized"
**You saw this error - it means you need to add the token!**

**Solution:**
1. Get admin token (see Step 1 above)
2. Add to `ml-service/.env`
3. Run sync script again

### Error: "Connection refused"
**Backend is not running**

**Solution:**
```bash
cd backend
npm start
```

### Error: "No token found"
**Not logged in or wrong storage**

**Solution:**
1. Login as admin at `http://localhost:3000/admin/login`
2. Make sure you're on port 3000 (not 3001)
3. Try again

---

## Quick Commands Reference

### Get Token (Easy Way)
```bash
setup-ml-token.bat
```

### Sync Current Model
```bash
cd ml-service
sync_performance_to_db.bat
```

### Train New Model
```bash
cd ml-service
python generate_and_train.py
```

### Check Scheduled Task
```bash
schtasks /query /tn "ML_Model_Retraining"
```

### Run Task Manually
```bash
schtasks /run /tn "ML_Model_Retraining"
```

### View Logs
```bash
cd ml-service/logs
type retrain_20260301.log
```

---

## Expected Results

### After Successful Setup:

1. **In Terminal:**
   ```
   ✅ Performance metrics saved to database successfully!
      Accuracy: 0.6900
      F1-Score: 0.5441
   ```

2. **In Admin Dashboard:**
   - See 4 metric cards (Accuracy, Precision, Recall, F1-Score)
   - See model information (version, date, samples)
   - See confusion matrix visualization
   - (Trend chart appears after 2+ training sessions)

3. **Tomorrow at 2 AM:**
   - Model automatically retrains
   - New metrics saved to database
   - Dashboard shows updated performance
   - History starts building up

---

## Success Checklist

- [ ] Backend is running (`http://localhost:5000/health`)
- [ ] Frontend is running (`http://localhost:3000`)
- [ ] Logged in as admin (not teacher)
- [ ] Got admin token from browser
- [ ] Added token to `ml-service/.env`
- [ ] Saved the .env file
- [ ] Ran `sync_performance_to_db.bat`
- [ ] Saw success message
- [ ] Opened admin dashboard
- [ ] Clicked "ML Performance"
- [ ] See performance metrics displayed

---

## What You'll See in the Dashboard

### Latest Metrics (Top Cards)
```
┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐
│  Accuracy   │ │  Precision  │ │   Recall    │ │  F1-Score   │
│    69%      │ │   59.68%    │ │    50%      │ │   54.41%    │
└─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘
```

### Model Information
```
Model Version: v20260301_020003
Training Date: March 1, 2026 at 2:00 AM
Training Samples: 800
Test Samples: 200
```

### Confusion Matrix
```
┌──────────────────┐ ┌──────────────────┐
│ True Negatives   │ │ False Positives  │
│       101        │ │        25        │
│ (Correct: No)    │ │ (Wrong: Yes)     │
└──────────────────┘ └──────────────────┘

┌──────────────────┐ ┌──────────────────┐
│ False Negatives  │ │ True Positives   │
│        37        │ │        37        │
│ (Missed)         │ │ (Correct: Yes)   │
└──────────────────┘ └──────────────────┘
```

---

## Timeline

### Now (Setup)
- Get token
- Add to .env
- Run sync
- See current model in dashboard

### Tomorrow (2 AM)
- Model retrains automatically
- New metrics saved
- Dashboard shows 2 entries
- Trend line starts appearing

### Next Week
- 7 training sessions completed
- Clear performance trends visible
- Can see if model is improving
- Historical data for analysis

---

## Need Help?

### Quick Help
1. Run `setup-ml-token.bat` - Automated helper
2. Open `get-admin-token.html` - Visual guide
3. Read `GET_ADMIN_TOKEN_GUIDE.md` - Detailed steps

### Documentation
- `SETUP_ML_PERFORMANCE_TRACKING.md` - Full setup
- `ML_PERFORMANCE_QUICK_REFERENCE.md` - Commands
- `ML_PERFORMANCE_COMPLETE.md` - Overview
- `ADMIN_ML_PERFORMANCE_GUIDE.md` - User guide

### Still Stuck?
- Check backend is running
- Verify you're logged in as admin
- Make sure token is copied correctly (no spaces/breaks)
- Try getting a fresh token

---

## Summary

You're almost done! Just need to:

1. ✅ Get admin token (2 min)
2. ✅ Add to .env file (1 min)
3. ✅ Run sync script (1 min)
4. ✅ Verify in dashboard (1 min)

**Total time: 5 minutes**

Then the system will automatically track ML performance every night at 2 AM!

---

**Ready?** Run `setup-ml-token.bat` to get started! 🚀
