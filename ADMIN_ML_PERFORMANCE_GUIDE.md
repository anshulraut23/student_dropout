# Admin Guide: ML Model Performance Tracking

## What is This?

The ML Performance page shows you how well the dropout prediction model is performing over time. Every time the model is retrained (automatically at 2 AM daily), the performance metrics are saved and displayed here.

## How to Access

1. Login as Admin at `http://localhost:3000/admin/login`
2. Click on **"ML Performance"** in the left sidebar (under "ML & Predictions" section)
3. You'll see the performance dashboard

## What You'll See

### 1. Latest Metrics Cards

Four key metrics are displayed at the top:

- **Accuracy** (Blue): Overall correctness of predictions
  - Example: 69% means the model correctly predicts 69 out of 100 students
  
- **Precision** (Green): When model predicts dropout, how often is it correct?
  - Example: 60% means 6 out of 10 "dropout" predictions are actually correct
  
- **Recall** (Purple): Of all actual dropouts, how many did the model catch?
  - Example: 50% means model catches 5 out of 10 students who actually drop out
  
- **F1-Score** (Orange): Balance between precision and recall
  - Example: 54% is a balanced measure of model performance

### 2. Model Information

Shows details about the latest trained model:
- **Model Version**: Unique identifier (e.g., v20260301_020003)
- **Training Date**: When the model was last trained
- **Training Samples**: Number of students used to train
- **Test Samples**: Number of students used to test

### 3. Confusion Matrix

Visual breakdown of predictions:

| Metric | Meaning | What You Want |
|--------|---------|---------------|
| **True Negatives** (Green) | Correctly predicted NO dropout | Higher is better |
| **False Positives** (Yellow) | Incorrectly predicted dropout | Lower is better |
| **False Negatives** (Red) | Missed actual dropouts | Lower is better |
| **True Positives** (Blue) | Correctly predicted dropout | Higher is better |

### 4. Performance Trends (Line Chart)

If you have multiple training sessions, you'll see a chart showing how metrics change over time. This helps you:
- See if the model is improving
- Identify when performance drops
- Decide when to retrain with more data

## Understanding the Metrics

### What's a Good Score?

| Metric | Poor | Fair | Good | Excellent |
|--------|------|------|------|-----------|
| Accuracy | <60% | 60-70% | 70-85% | >85% |
| Precision | <50% | 50-65% | 65-80% | >80% |
| Recall | <50% | 50-65% | 65-80% | >80% |
| F1-Score | <50% | 50-65% | 65-80% | >80% |

### Why Metrics Matter

**High Accuracy** = Model makes correct predictions most of the time

**High Precision** = When model says "at risk", it's usually right
- Important to avoid false alarms
- Prevents wasting resources on students who don't need help

**High Recall** = Model catches most students who are actually at risk
- Important to not miss students who need help
- Ensures no at-risk student falls through the cracks

**High F1-Score** = Good balance between precision and recall
- Best overall indicator of model quality

## When to Take Action

### ✅ Model is Performing Well
- Accuracy > 70%
- F1-Score > 65%
- Confusion matrix shows more green/blue than yellow/red

**Action:** Continue monitoring, no changes needed

### ⚠️ Model Needs Attention
- Accuracy < 60%
- F1-Score < 50%
- High false negatives (missing actual dropouts)

**Action:** 
1. Mark more actual dropout outcomes in the system
2. Wait for next automatic retraining (2 AM)
3. Check if performance improves

### 🔴 Model Needs Immediate Retraining
- Accuracy < 50%
- Very high false negatives
- Performance declining over time

**Action:**
1. Review and mark all known dropout cases
2. Manually trigger retraining (see Technical Guide)
3. Contact technical support if issues persist

## How the Model Improves

The model gets better when you:

1. **Mark Actual Outcomes**
   - Go to Dropout Management page
   - Update student status when they drop out
   - This creates real training data

2. **Collect More Data**
   - More attendance records
   - More exam results
   - More behavior incidents
   - Better predictions!

3. **Regular Retraining**
   - Happens automatically at 2 AM daily
   - Uses latest student data
   - Adapts to your school's patterns

## Troubleshooting

### "No model performance data available yet"

**Cause:** Model hasn't been trained or metrics weren't saved

**Solution:**
1. Check if model exists: Look for `ml-service/models/model_metadata.json`
2. If model exists, run: `ml-service/sync_performance_to_db.bat`
3. If no model, train it: `cd ml-service` then `python generate_and_train.py`
4. Refresh the page

### Performance history not updating

**Cause:** Scheduled task not running or database sync failing

**Solution:**
1. Check scheduled task: Open Task Scheduler, find "ML_Model_Retraining"
2. Check logs: Look in `ml-service/logs/` for error messages
3. Verify backend is running: `http://localhost:5000/health`
4. Contact technical support with log files

### Metrics seem wrong or unrealistic

**Cause:** Insufficient training data or data quality issues

**Solution:**
1. Check training samples count (should be > 100)
2. Verify dropout outcomes are marked correctly
3. Ensure attendance and exam data is complete
4. Wait for more data to accumulate

## Best Practices

### Daily Monitoring (5 minutes)
- Check latest metrics
- Look for any sudden drops
- Note any unusual patterns

### Weekly Review (15 minutes)
- Review performance trends
- Compare with previous weeks
- Update dropout outcomes
- Plan interventions based on predictions

### Monthly Analysis (30 minutes)
- Deep dive into confusion matrix
- Identify systematic errors
- Review feature importance
- Adjust intervention strategies

## Key Takeaways

✅ **Higher metrics = Better predictions**
✅ **Regular monitoring helps catch issues early**
✅ **More real data = Better model performance**
✅ **Automatic retraining keeps model current**
✅ **Use predictions to guide interventions**

## Need Help?

If you encounter issues:
1. Check the Technical Guide: `ML_PERFORMANCE_TRACKING_GUIDE.md`
2. Review logs in `ml-service/logs/`
3. Contact technical support with:
   - Screenshot of the issue
   - Latest log file
   - Description of what you were trying to do

---

**Remember:** The ML model is a tool to help identify at-risk students early. It should complement, not replace, your professional judgment and personal knowledge of students.
