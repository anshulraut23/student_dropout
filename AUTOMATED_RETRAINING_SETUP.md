# Automated Model Retraining Setup

## Overview
The ML model now automatically retrains every night at 2 AM with the latest real student dropout data. This ensures predictions stay accurate as new data is collected.

## How It Works

### 1. Node.js Cron Scheduler (Recommended)
The backend server includes an automated scheduler that runs when the server is running.

**Features:**
- Runs at 2 AM every night
- Fetches latest real dropout data
- Retrains the model
- Saves performance metrics
- Logs all activities

**Status:** ✅ Already integrated into backend server

When you start the backend, you'll see:
```
🤖 Model Retraining Scheduler Started
📅 Schedule: Daily at 2:00 AM
💡 Manual retraining available via POST /api/ml/retrain
```

### 2. Windows Task Scheduler (Alternative)
For production servers or if you want retraining even when backend is off.

**Setup Steps:**

1. **Run Setup Script (as Administrator)**
   ```bash
   cd ml-service
   setup_scheduled_task.bat
   ```

2. **Verify Task Created**
   ```bash
   schtasks /query /tn "ML_Model_Retraining"
   ```

3. **Test Manual Run**
   ```bash
   schtasks /run /tn "ML_Model_Retraining"
   ```

## Files Created

### Backend Service
- `backend/services/modelRetrainingService.js` - Node.js cron scheduler

### ML Service Scripts
- `ml-service/auto_retrain.py` - Automated retraining script with logging
- `ml-service/schedule_retrain.bat` - Windows batch script for Task Scheduler
- `ml-service/setup_scheduled_task.bat` - One-click Task Scheduler setup

## Manual Retraining

### Option 1: Via API (Recommended)
```bash
curl -X POST http://localhost:5000/api/ml/retrain \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Option 2: Via Python Script
```bash
cd ml-service
python auto_retrain.py
```

### Option 3: Via Original Script
```bash
cd ml-service
python generate_and_train.py
```

## Monitoring

### Check Retraining Status
The service tracks:
- Is retraining currently running?
- When was the last retraining?
- Was it successful or failed?

### View Logs
Retraining logs are saved to:
```
ml-service/logs/retrain_YYYYMMDD.log
```

Example log file: `retrain_20260301.log`

### Check Model Performance
After each retraining:
1. Go to Admin Panel
2. Navigate to "ML Performance" page
3. View latest metrics and trends

## Configuration

### Change Schedule Time
Edit `backend/services/modelRetrainingService.js`:

```javascript
// Current: 2 AM daily
const schedule = '0 2 * * *';

// Examples:
// '0 3 * * *'     - 3 AM daily
// '0 2 * * 0'     - 2 AM every Sunday
// '0 2 1 * *'     - 2 AM on 1st of each month
// '0 */6 * * *'   - Every 6 hours
```

Cron format: `minute hour day month weekday`

### Disable Automated Retraining
Comment out in `backend/server.js`:
```javascript
// modelRetrainingService.startScheduler();
```

## Retraining Process

### What Happens During Retraining:

1. **Data Collection**
   - Fetches all students with attendance + exam data
   - Includes real dropout status from database
   - Filters students with minimum 3 days attendance + 1 exam

2. **Model Training**
   - Splits data 80/20 (train/test)
   - Trains Random Forest classifier
   - Calculates comprehensive metrics

3. **Validation**
   - Tests on held-out data
   - Calculates accuracy, precision, recall, F1-score
   - Generates confusion matrix

4. **Saving**
   - Saves new model to `ml-service/models/dropout_model.pkl`
   - Saves metadata to `ml-service/models/model_metadata.json`
   - Stores performance metrics in database

5. **Logging**
   - Logs all activities to daily log file
   - Console output shows progress
   - Errors are captured and logged

## Requirements for Successful Retraining

### Minimum Data:
- At least 10 students total
- At least 2 students marked as dropped out
- Each student needs:
  - Minimum 3 days of attendance records
  - Minimum 1 exam with marks

### If Insufficient Data:
- Script falls back to synthetic data
- Warning message is logged
- Model still trains but may be less accurate

## Troubleshooting

### Retraining Not Running?

1. **Check Backend Server**
   ```bash
   # Backend must be running for Node.js scheduler
   cd backend
   npm start
   ```

2. **Check Logs**
   ```bash
   # View today's retraining log
   cat ml-service/logs/retrain_$(date +%Y%m%d).log
   ```

3. **Test Manual Retraining**
   ```bash
   cd ml-service
   python auto_retrain.py
   ```

### Python Not Found?

Ensure Python is installed and in PATH:
```bash
python --version
# or
python3 --version
```

### Permission Errors?

For Windows Task Scheduler:
- Run `setup_scheduled_task.bat` as Administrator
- Right-click → "Run as administrator"

## Benefits of Automated Retraining

✅ **Always Up-to-Date** - Model uses latest dropout outcomes
✅ **Improved Accuracy** - More real data = better predictions
✅ **Zero Manual Work** - Runs automatically every night
✅ **Performance Tracking** - Metrics saved to database
✅ **Error Handling** - Logs failures for debugging
✅ **Fallback Support** - Uses synthetic data if real data insufficient

## Next Steps

1. ✅ Automated retraining is now active
2. Mark students as dropped out in Dropout Management page
3. Wait for nightly retraining (or trigger manually)
4. Check ML Performance page for updated metrics
5. Monitor accuracy improvements over time

---

**Developed by Team GPPians**
**Date**: March 1, 2026
