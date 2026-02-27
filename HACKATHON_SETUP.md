# 🎯 Hackathon Demo Setup Guide

## Quick Start (5 Minutes)

This guide helps you set up the ML prediction system with **3-day minimum data** for quick demonstration.

---

## What Changed?

**Threshold Reduced: 14 days → 3 days**

| Component | Old Threshold | New Threshold | File Changed |
|-----------|---------------|---------------|--------------|
| Backend Feature Extractor | 14 days | 3 days | `backend/ml-integration/featureExtractor.js` |
| ML Service Config | 14 days | 3 days | `ml-service/config.py` |
| ML Service Error Message | 14 days | 3 days | `ml-service/app.py` |
| Frontend Component | 14 days | 3 days | `proactive-education-assistant/src/components/risk/StudentRiskCard.jsx` |

**New Data Tiers:**
- Tier 0 (Insufficient): < 3 days or < 1 exam → **Blocked**
- Tier 1 (Low Confidence): 3-7 days, 1-2 exams → **Demo Mode**
- Tier 2 (Medium Confidence): 8-14 days, 3-4 exams
- Tier 3 (High Confidence): 15+ days, 5+ exams

---

## Step-by-Step Setup

### 1. Generate Demo Data (2 minutes)

```bash
# Install dependencies (if not already done)
cd backend && npm install && cd ..

# Generate demo data
node create-hackathon-demo-data.js
```

**This creates:**
- 1 school (Demo High School)
- 1 admin user (admin@demo.com / admin123)
- 1 class (10-A)
- 1 subject (Mathematics)
- 1 exam (Mid-Term, 100 marks)
- 5 students with varying risk levels:
  - Rahul Kumar: 100% attendance, 85% marks → **LOW risk**
  - Priya Sharma: 66% attendance, 65% marks → **MEDIUM risk**
  - Amit Patel: 33% attendance, 45% marks → **HIGH risk**
  - Sneha Reddy: 100% attendance, 50% marks → **MEDIUM risk**
  - Vikram Singh: 66% attendance, 80% marks → **LOW risk**

### 2. Start Services (1 minute)

**Terminal 1 - Backend:**
```bash
cd backend
npm start
# Should run on http://localhost:3001
```

**Terminal 2 - ML Service:**
```bash
cd ml-service
python app.py
# Should run on http://localhost:5001
```

**Terminal 3 - Frontend:**
```bash
cd proactive-education-assistant
npm start
# Should run on http://localhost:3000
```

### 3. Test Predictions (1 minute)

```bash
# In a new terminal
node test-hackathon-predictions.js
```

**Expected Output:**
```
📊 Rahul Kumar (Roll: 101)
   Risk Level: LOW
   Risk Score: 25.3%
   Confidence: LOW
   Data Tier: 1
   
📊 Priya Sharma (Roll: 102)
   Risk Level: MEDIUM
   Risk Score: 42.7%
   Confidence: LOW
   Data Tier: 1
   
📊 Amit Patel (Roll: 103)
   Risk Level: HIGH
   Risk Score: 68.5%
   Confidence: LOW
   Data Tier: 1
```

### 4. View in Browser (1 minute)

1. Open http://localhost:3000
2. Login: `admin@demo.com` / `admin123`
3. Navigate to Students or Dashboard
4. View risk predictions for each student
5. See color-coded risk cards (Green/Yellow/Orange/Red)

---

## Demo Talking Points

### For Judges:

**"Our AI provides early warning from day 1"**
- With just 3 days of data, system identifies at-risk patterns
- Confidence grows from LOW → MEDIUM → HIGH as data accumulates
- Helps teachers intervene early before students fall behind

**"Transparent about data quality"**
- Shows "LOW confidence" for 3-day predictions
- Tier system clearly indicates data completeness
- Honest about limitations while providing value

**"Pattern recognition, not guesswork"**
- Even with 3 days, can detect:
  - Attendance patterns (100% vs 66% vs 33%)
  - Academic performance (85% vs 65% vs 45%)
  - Combined risk factors
- ML model trained on realistic student patterns

**"Scales with more data"**
- 3 days: LOW confidence, early warning
- 7 days: Better patterns, weekly trends
- 14 days: MEDIUM confidence, reliable predictions
- 30+ days: HIGH confidence, production-ready

---

## Troubleshooting

### Issue: "Insufficient data for prediction"

**Cause:** Student has < 3 days attendance or < 1 exam

**Solution:**
```bash
# Regenerate demo data
node create-hackathon-demo-data.js
```

### Issue: "ML service unavailable"

**Cause:** ML service not running or model not trained

**Solution:**
```bash
# Train model first
cd ml-service
python generate_and_train.py

# Then start service
python app.py
```

### Issue: Predictions not updating

**Cause:** Backend not restarted after code changes

**Solution:**
```bash
# Restart backend
cd backend
# Ctrl+C to stop
npm start
```

---

## What to Show Judges

### 1. Dashboard View
- Show 5 students with different risk levels
- Point out color coding (green/yellow/orange/red)
- Highlight "LOW confidence" badge

### 2. Individual Student Card
- Click on high-risk student (Amit Patel)
- Show risk breakdown:
  - Attendance Risk: 67%
  - Academic Risk: 55%
  - Behavior Risk: 0%
- Show AI explanation
- Show recommendations

### 3. Feature Importance
- Expand "Model Feature Importance" section
- Show which factors matter most:
  - Attendance Rate: 32%
  - Average Marks: 28%
  - Behavior Score: 18%

### 4. Data Requirements
- Show "Building Prediction Data" card for new student
- Explain 3-day minimum requirement
- Show how it unlocks automatically

---

## Post-Hackathon: Reverting to Production

To change back to production thresholds (14 days):

```bash
# 1. Update backend/ml-integration/featureExtractor.js
#    Line 173: Change 3 → 14
#    Lines 178-188: Update tier thresholds

# 2. Update ml-service/config.py
#    Line 17: TIER_0_MIN_DAYS = 14

# 3. Update ml-service/app.py
#    Line 102: Change "3 days" → "14 days"

# 4. Update frontend component
#    proactive-education-assistant/src/components/risk/StudentRiskCard.jsx
#    Line 127: attendance: 14

# 5. Restart all services
```

---

## Files Modified

✅ `backend/ml-integration/featureExtractor.js` - Threshold + tier calculations
✅ `ml-service/config.py` - Config thresholds
✅ `ml-service/app.py` - Error message
✅ `backend/ml-integration/riskController.js` - Error messages
✅ `proactive-education-assistant/src/components/risk/StudentRiskCard.jsx` - Frontend requirements

📄 `create-hackathon-demo-data.js` - NEW: Demo data generator
📄 `test-hackathon-predictions.js` - NEW: Test script
📄 `HACKATHON_SETUP.md` - NEW: This guide

---

## Success Criteria

✅ All 5 students show predictions
✅ Risk levels vary (LOW, MEDIUM, HIGH)
✅ Confidence shows "LOW" (Tier 1)
✅ Data tier shows "1"
✅ Recommendations display
✅ Feature importance shows
✅ Color-coded risk cards work
✅ No "insufficient data" errors

---

## Quick Commands Reference

```bash
# Generate demo data
node create-hackathon-demo-data.js

# Test predictions
node test-hackathon-predictions.js

# Start all services
# Terminal 1: cd backend && npm start
# Terminal 2: cd ml-service && python app.py
# Terminal 3: cd proactive-education-assistant && npm start

# Login credentials
# Email: admin@demo.com
# Password: admin123
```

---

## Good Luck! 🚀

Your ML prediction system is now configured for quick demonstration with minimal data requirements. The 3-day threshold allows you to show the feature working immediately while being honest about confidence levels.
