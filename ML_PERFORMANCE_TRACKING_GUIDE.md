# ML Model Performance Tracking Guide

## Overview

The system now automatically tracks ML model performance history and displays it in the admin dashboard. Every time the model is retrained (either manually or via the scheduled 2 AM cron job), the performance metrics are saved to the database.

## How It Works

### 1. Automated Retraining (2 AM Daily)

The scheduled task runs at 2 AM every night:

```
ml-service/schedule_retrain.bat
  └─> ml-service/auto_retrain.py
      ├─> ml-service/generate_and_train.py (trains the model)
      └─> ml-service/save_performance_to_db.py (saves metrics to database)
```

**What happens:**
1. Model is retrained with latest student data
2. Performance metrics are calculated (accuracy, precision, recall, F1-score)
3. Metrics are saved to `models/model_metadata.json`
4. Metrics are automatically sent to backend API
5. Backend saves to `model_performance` table in database

### 2. Viewing Performance History

Admins can view the ML performance history at:
- **Route:** `/admin/model-performance`
- **Component:** `ModelPerformancePage.jsx`

**What's displayed:**
- Latest model metrics (accuracy, precision, recall, F1-score)
- Confusion matrix visualization
- Performance trends over time (line chart)
- Model version and training information

### 3. Database Schema

The `model_performance` table stores:

```sql
CREATE TABLE model_performance (
    id TEXT PRIMARY KEY,
    school_id TEXT NOT NULL,
    model_version VARCHAR(50) NOT NULL,
    training_date TIMESTAMP NOT NULL,
    training_samples INTEGER NOT NULL,
    test_samples INTEGER NOT NULL,
    accuracy DECIMAL(5,4),
    precision_score DECIMAL(5,4),
    recall_score DECIMAL(5,4),
    f1_score DECIMAL(5,4),
    confusion_matrix JSONB,
    feature_importance JSONB,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Setup Instructions

### 1. Ensure Scheduled Task is Running

Check if the task exists:
```bash
schtasks /query /tn "ML_Model_Retraining"
```

If not set up, run as Administrator:
```bash
cd ml-service
setup_scheduled_task.bat
```

### 2. Configure Environment Variables

Edit `ml-service/.env`:

```env
# Backend API Configuration
BACKEND_URL=http://localhost:5000
ADMIN_AUTH_TOKEN=your_admin_jwt_token_here

# Auto-save to database after training
SAVE_TO_DB=true
```

**Getting the Admin Auth Token:**

Option A - Login and copy token from browser:
1. Login as admin at `http://localhost:3000/admin/login`
2. Open browser DevTools (F12) → Application → Local Storage
3. Copy the `token` value
4. Paste into `.env` file

Option B - Generate token programmatically (if you have admin credentials):
```javascript
// In browser console after login
console.log(localStorage.getItem('token'));
```

### 3. Manually Sync Current Model Performance

If you already have a trained model and want to save its metrics to the database:

```bash
cd ml-service
sync_performance_to_db.bat
```

Or run directly:
```bash
cd ml-service
python save_performance_to_db.py
```

### 4. Test the Scheduled Task Manually

Run the retraining task without waiting for 2 AM:

```bash
schtasks /run /tn "ML_Model_Retraining"
```

Check the logs:
```bash
cd ml-service/logs
type retrain_YYYYMMDD.log
```

## API Endpoints

### Save Model Performance
```http
POST /api/dropout/model-performance
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "modelVersion": "v20260301_020003",
  "trainingSamples": 800,
  "testSamples": 200,
  "accuracy": 0.69,
  "precision": 0.5967,
  "recall": 0.5,
  "f1Score": 0.5441,
  "confusionMatrix": {
    "true_negatives": 101,
    "false_positives": 25,
    "false_negatives": 37,
    "true_positives": 37
  },
  "featureImportance": [...],
  "notes": "Automated training - synthetic_data"
}
```

### Get Model Performance History
```http
GET /api/dropout/model-performance
Authorization: Bearer <admin_token>
```

Response:
```json
{
  "success": true,
  "performance_history": [
    {
      "id": "...",
      "school_id": "...",
      "model_version": "v20260301_020003",
      "training_date": "2026-03-01T02:00:03.989Z",
      "training_samples": 800,
      "test_samples": 200,
      "accuracy": 0.69,
      "precision_score": 0.5967,
      "recall_score": 0.5,
      "f1_score": 0.5441,
      "confusion_matrix": {...},
      "feature_importance": [...],
      "created_at": "2026-03-01T02:00:05.123Z"
    }
  ]
}
```

## Troubleshooting

### Performance History Not Showing

**Problem:** Admin dashboard shows "No model performance data available yet"

**Solutions:**

1. **Check if model has been trained:**
   ```bash
   cd ml-service
   dir models\model_metadata.json
   ```

2. **Manually sync current model:**
   ```bash
   cd ml-service
   sync_performance_to_db.bat
   ```

3. **Check backend logs for errors:**
   - Look for authentication errors
   - Verify `ADMIN_AUTH_TOKEN` is set correctly

4. **Verify database table exists:**
   ```sql
   SELECT * FROM model_performance ORDER BY training_date DESC LIMIT 5;
   ```

### Scheduled Task Not Running

**Problem:** Model not retraining at 2 AM

**Solutions:**

1. **Check task status:**
   ```bash
   schtasks /query /tn "ML_Model_Retraining" /v
   ```

2. **Check task history:**
   - Open Task Scheduler (taskschd.msc)
   - Find "ML_Model_Retraining"
   - Check "History" tab

3. **Run manually to test:**
   ```bash
   schtasks /run /tn "ML_Model_Retraining"
   ```

4. **Check logs:**
   ```bash
   cd ml-service\logs
   type retrain_*.log
   ```

### Authentication Errors

**Problem:** "401 Unauthorized" when saving metrics

**Solutions:**

1. **Update auth token:**
   - Login as admin
   - Get fresh token from browser
   - Update `ml-service/.env`

2. **Check token expiration:**
   - Tokens may expire after some time
   - Generate a new token if needed

3. **Verify admin role:**
   - Only admin users can save performance metrics
   - Check user role in database

## Best Practices

1. **Monitor Performance Trends:**
   - Check the admin dashboard weekly
   - Look for declining accuracy over time
   - Retrain if performance drops significantly

2. **Keep Training Data Updated:**
   - Mark actual dropout outcomes in the system
   - More real data = better predictions

3. **Review Logs Regularly:**
   - Check `ml-service/logs/` for training issues
   - Monitor for errors or warnings

4. **Backup Model Files:**
   - Keep copies of well-performing models
   - Store in `ml-service/models/backups/`

5. **Test After Updates:**
   - After system updates, verify scheduled task still works
   - Run manual sync to confirm database connectivity

## Files Modified/Created

### New Files:
- `ml-service/save_performance_to_db.py` - Saves metrics to database
- `ml-service/sync_performance_to_db.bat` - Manual sync script
- `ML_PERFORMANCE_TRACKING_GUIDE.md` - This guide

### Modified Files:
- `ml-service/auto_retrain.py` - Added database sync after training
- `ml-service/generate_and_train.py` - Optional database save
- `ml-service/.env` - Added backend URL and auth token config

### Existing Files (Already Working):
- `proactive-education-assistant/src/pages/admin/ModelPerformancePage.jsx` - UI
- `backend/controllers/dropoutTrackingController.js` - API endpoints
- `backend/database/migrations/add-dropout-tracking.sql` - Database schema

## Summary

The ML performance tracking system is now fully automated:

✅ Model retrains daily at 2 AM
✅ Performance metrics automatically saved to database
✅ Admin dashboard displays historical performance
✅ Manual sync available when needed
✅ Comprehensive logging for troubleshooting

The admin can now monitor model performance over time and see how the model improves as more real student outcome data is collected.
