# ML Performance Tracking - Quick Reference Card

## 🚀 Quick Setup (5 minutes)

```bash
# 1. Get admin token from browser (after login)
#    F12 → Application → Local Storage → copy 'token'

# 2. Configure ML service
#    Edit: ml-service/.env
#    Add: ADMIN_AUTH_TOKEN=<your_token>

# 3. Sync current model
cd ml-service
sync_performance_to_db.bat

# 4. View in dashboard
#    http://localhost:3000/admin/model-performance
```

## 📊 What Admin Sees

| Metric | Current Value | Meaning |
|--------|---------------|---------|
| Accuracy | 69% | Overall correctness |
| Precision | 59.68% | Dropout predictions accuracy |
| Recall | 50% | Actual dropouts caught |
| F1-Score | 54.41% | Balanced performance |

## 🔄 Automatic Schedule

```
Daily at 2:00 AM
├─ Model retrains with latest data
├─ Metrics calculated
├─ Saved to database
└─ Visible in admin dashboard
```

## 📁 Key Files

### Scripts
- `ml-service/save_performance_to_db.py` - Database sync
- `ml-service/sync_performance_to_db.bat` - Manual sync
- `ml-service/auto_retrain.py` - Automated retraining

### Configuration
- `ml-service/.env` - Backend URL & auth token

### Documentation
- `ML_PERFORMANCE_COMPLETE.md` - Full implementation
- `SETUP_ML_PERFORMANCE_TRACKING.md` - Setup guide
- `ADMIN_ML_PERFORMANCE_GUIDE.md` - Admin user guide

## 🛠️ Common Commands

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

### Manual Sync
```bash
cd ml-service
python save_performance_to_db.py
```

### Train Model
```bash
cd ml-service
python generate_and_train.py
```

## 🔍 Troubleshooting

| Problem | Solution |
|---------|----------|
| No data showing | Run `sync_performance_to_db.bat` |
| 401 Unauthorized | Update token in `.env` |
| Connection refused | Start backend server |
| Task not running | Check Task Scheduler |

## 📈 Performance Metrics Guide

### Accuracy
- **Good:** > 70%
- **Fair:** 60-70%
- **Poor:** < 60%

### Precision
- **High:** Few false alarms
- **Low:** Many false alarms

### Recall
- **High:** Catches most at-risk students
- **Low:** Misses many at-risk students

### F1-Score
- **Best overall indicator**
- **Balances precision and recall**

## 🎯 API Endpoints

### Save Performance
```http
POST /api/dropout/model-performance
Authorization: Bearer <token>
Content-Type: application/json

{
  "modelVersion": "v20260301_020003",
  "trainingSamples": 800,
  "testSamples": 200,
  "accuracy": 0.69,
  "precision": 0.5967,
  "recall": 0.5,
  "f1Score": 0.5441,
  "confusionMatrix": {...},
  "featureImportance": [...]
}
```

### Get Performance History
```http
GET /api/dropout/model-performance
Authorization: Bearer <token>
```

## 📋 Checklist

### Initial Setup
- [ ] Get admin token from browser
- [ ] Add token to `ml-service/.env`
- [ ] Run `sync_performance_to_db.bat`
- [ ] Verify in admin dashboard

### Daily Monitoring
- [ ] Check latest metrics
- [ ] Review any sudden changes
- [ ] Note unusual patterns

### Weekly Review
- [ ] Review performance trends
- [ ] Compare with previous weeks
- [ ] Update dropout outcomes

### Monthly Analysis
- [ ] Deep dive into metrics
- [ ] Identify systematic errors
- [ ] Adjust intervention strategies

## 🔐 Security Notes

- Token expires after some time
- Get fresh token if 401 errors occur
- Only admins can access performance data
- Token stored in `.env` (not committed to git)

## 📞 Support

### Documentation
- Technical: `ML_PERFORMANCE_TRACKING_GUIDE.md`
- Admin: `ADMIN_ML_PERFORMANCE_GUIDE.md`
- Setup: `SETUP_ML_PERFORMANCE_TRACKING.md`

### Logs Location
- Training logs: `ml-service/logs/`
- Backend logs: Console output
- Frontend logs: Browser console

## ✅ Success Indicators

- ✅ Performance page shows metrics
- ✅ Scheduled task runs successfully
- ✅ Logs show no errors
- ✅ Metrics update after retraining
- ✅ Trend chart appears (after 2+ trainings)

## 🎓 Key Concepts

### Model Version
- Format: `v20260301_020003`
- Timestamp of training
- Unique identifier

### Training Samples
- Number of students used to train
- More samples = better model
- Minimum: 50 students

### Confusion Matrix
- True Positives: Correct dropout predictions
- True Negatives: Correct no-dropout predictions
- False Positives: Incorrect dropout predictions
- False Negatives: Missed dropouts

### Feature Importance
- Shows which factors matter most
- Top factors: Marks, Attendance, Behavior
- Helps focus interventions

## 🚦 Status Indicators

| Color | Meaning | Action |
|-------|---------|--------|
| 🟢 Green | Good performance | Continue monitoring |
| 🟡 Yellow | Fair performance | Review and improve data |
| 🔴 Red | Poor performance | Retrain with more data |

## 💡 Pro Tips

1. **Mark actual outcomes** - More real data = better predictions
2. **Monitor trends** - Look for patterns over time
3. **Check logs regularly** - Catch issues early
4. **Update token periodically** - Prevents auth errors
5. **Review confusion matrix** - Understand prediction errors

---

**Quick Start:** Follow `SETUP_ML_PERFORMANCE_TRACKING.md` for detailed setup instructions.
