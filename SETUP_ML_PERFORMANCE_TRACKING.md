# Setup ML Performance Tracking - Quick Start

## Current Status

✅ Model is trained (v20260301_020003)
✅ Performance metrics exist in model_metadata.json
✅ Database sync script created
✅ Scheduled task configured (runs at 2 AM daily)
⚠️ Need to configure authentication and sync to database

## Quick Setup (5 minutes)

### Step 1: Get Admin Authentication Token

**Easy Method - Use Helper Script:**
```bash
setup-ml-token.bat
```
This will open a helper page and guide you through the process!

**OR Manual Method:**

1. **Start the backend** (if not running):
   ```bash
   cd backend
   npm start
   ```

2. **Start the frontend** (if not running):
   ```bash
   cd proactive-education-assistant
   npm start
   ```

3. **Login as Admin:**
   - Open browser: `http://localhost:3000/admin/login`
   - Login with admin credentials

4. **Get the token:**
   - Press F12 to open DevTools
   - Go to "Application" tab (Chrome) or "Storage" tab (Firefox)
   - Click "Local Storage" → `http://localhost:3000`
   - Find the `token` entry
   - Copy the entire token value (long string starting with "eyJ...")

**Need detailed help?** See `GET_ADMIN_TOKEN_GUIDE.md` for step-by-step instructions with screenshots.

### Step 2: Configure ML Service

1. **Open the ML service .env file:**
   ```
   ml-service/.env
   ```

2. **Update the ADMIN_AUTH_TOKEN:**
   ```env
   # Backend API Configuration (for saving performance metrics)
   BACKEND_URL=http://localhost:5000
   ADMIN_AUTH_TOKEN=<paste_your_token_here>

   # Optional: Auto-save to database after training
   SAVE_TO_DB=true
   ```

3. **Save the file**

### Step 3: Sync Current Model to Database

Run the sync script:

**Option A - Using batch file:**
```bash
cd ml-service
sync_performance_to_db.bat
```

**Option B - Using Python directly:**
```bash
cd ml-service
python save_performance_to_db.py
```

You should see:
```
✅ Performance metrics saved to database successfully!
   Accuracy: 0.6900
   F1-Score: 0.5441
```

### Step 4: Verify in Admin Dashboard

1. **Go to admin dashboard:**
   - Navigate to `http://localhost:3000/admin/dashboard`

2. **Click "ML Performance" in the sidebar**
   - It's under the "ML & Predictions" section

3. **You should see:**
   - Latest metrics cards (Accuracy, Precision, Recall, F1-Score)
   - Model information
   - Confusion matrix
   - (Performance trends will appear after multiple training sessions)

## Troubleshooting

### "401 Unauthorized" Error

**Problem:** Token is invalid or expired

**Solution:**
1. Login again as admin
2. Get a fresh token from browser
3. Update `ml-service/.env`
4. Run sync script again

### "Connection refused" Error

**Problem:** Backend is not running

**Solution:**
1. Start backend: `cd backend && npm start`
2. Verify it's running: `http://localhost:5000/health`
3. Run sync script again

### "No model performance data available yet"

**Problem:** Sync didn't work or database not updated

**Solution:**
1. Check backend logs for errors
2. Verify token is correct in `.env`
3. Run sync script with verbose output:
   ```bash
   cd ml-service
   python save_performance_to_db.py
   ```
4. Check for error messages

## Testing the Scheduled Task

The model retrains automatically at 2 AM every night. To test it now:

```bash
schtasks /run /tn "ML_Model_Retraining"
```

Check the logs:
```bash
cd ml-service/logs
type retrain_20260301.log
```

## What Happens Next?

### Automatic (Every Night at 2 AM)
1. Scheduled task runs
2. Model retrains with latest data
3. Performance metrics calculated
4. Metrics automatically saved to database
5. Admin can see updated performance in dashboard

### Manual (Anytime)
1. Train model: `cd ml-service && python generate_and_train.py`
2. Sync to database: `cd ml-service && python save_performance_to_db.py`
3. View in dashboard: Navigate to ML Performance page

## Summary

After completing these steps:

✅ Current model performance will be visible in admin dashboard
✅ Future retraining (2 AM daily) will automatically update the dashboard
✅ Admin can monitor model performance over time
✅ Historical trends will build up as model retrains

## Need Help?

- **Technical Guide:** See `ML_PERFORMANCE_TRACKING_GUIDE.md`
- **Admin Guide:** See `ADMIN_ML_PERFORMANCE_GUIDE.md`
- **Implementation Details:** See `ML_PERFORMANCE_IMPLEMENTATION_SUMMARY.md`

---

**Next Step:** Complete Step 1 above to get your admin token and configure the system!
