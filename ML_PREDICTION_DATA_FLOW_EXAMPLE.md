# ML Prediction Data Flow - Real Example

This document shows a complete real-world example of how data flows through the AI risk prediction system.

## Example Student: Rahul Kumar

Let's follow Rahul's data through the entire system.

---

## Step 1: Raw Data in Database

### Attendance Records (45 days tracked)
```sql
SELECT * FROM attendance WHERE student_id = 'rahul-123' ORDER BY date;

| date       | status  |
|------------|---------|
| 2026-01-01 | present |
| 2026-01-02 | present |
| 2026-01-03 | absent  |
| 2026-01-04 | present |
| ...        | ...     |
| 2026-02-15 | present |

Total: 45 days tracked
Present: 38 days
Absent: 7 days
```

### Exam Marks (4 exams completed)
```sql
SELECT e.name, e.total_marks, m.marks_obtained, m.status
FROM marks m
JOIN exams e ON m.exam_id = e.id
WHERE m.student_id = 'rahul-123' AND m.status IN ('submitted', 'verified');

| exam_name          | total_marks | marks_obtained | status   |
|--------------------|-------------|----------------|----------|
| Math Mid-Term      | 100         | 65             | verified |
| Science Unit Test  | 50          | 38             | verified |
| English Mid-Term   | 100         | 72             | verified |
| Math Unit Test     | 50          | 35             | verified |

Total: 4 exams
Marks obtained: 210
Marks possible: 300
```

### Behavior Records (3 incidents)
```sql
SELECT * FROM behavior WHERE student_id = 'rahul-123';

| date       | behavior_type | description              |
|------------|---------------|--------------------------|
| 2026-01-15 | positive      | Helped classmate         |
| 2026-01-28 | negative      | Late to class            |
| 2026-02-10 | negative      | Incomplete homework      |

Total: 3 incidents
Positive: 1
Negative: 2
```

---

## Step 2: Feature Extraction

The backend runs SQL queries to calculate features:

### Attendance Features
```javascript
attendance_rate = 38 / 45 = 0.844 (84.4%)
days_tracked = 45
days_present = 38
days_absent = 7
```

### Academic Features
```javascript
avg_marks_percentage = (210 / 300) * 100 = 70.0%
exams_completed = 4
total_marks_obtained = 210
total_marks_possible = 300
```

### Behavior Features
```javascript
behavior_score = 100 - (2 * 10) = 80
total_incidents = 3
positive_incidents = 1
negative_incidents = 2
```

### Data Tier Calculation
```javascript
// Check thresholds
days_tracked = 45 >= 14 ✓
exams_completed = 4 >= 1 ✓

// Determine tier
if (45 >= 60 && 4 >= 5) → Tier 3 ✗
if (45 >= 30 && 4 >= 3) → Tier 2 ✓

data_tier = 2 (Medium Confidence)
```

---

## Step 3: Feature Payload to ML Service

Backend sends this JSON to ML service:

```json
{
  "student_id": "rahul-123",
  "features": {
    "attendance_rate": 0.844,
    "avg_marks_percentage": 70.0,
    "behavior_score": 80,
    "days_tracked": 45,
    "exams_completed": 4,
    "days_present": 38,
    "days_absent": 7,
    "total_marks_obtained": 210,
    "total_marks_possible": 300,
    "total_incidents": 3,
    "positive_incidents": 1,
    "negative_incidents": 2,
    "data_tier": 2
  },
  "metadata": {
    "student_name": "Rahul Kumar",
    "class_name": "10-A",
    "roll_number": "101"
  }
}
```

---

## Step 4: ML Model Prediction

The Random Forest model processes the features:

### Feature Vector (what model sees)
```python
X = [0.844, 70.0, 80, 45, 4, 38, 7, 210, 300, 3, 1, 2]
#    [att%, marks%, beh, days, exams, pres, abs, tot_m, pos_m, inc, pos, neg]
```

### Model Computation
```python
# 100 decision trees vote
# Each tree analyzes feature splits
# Tree 1: attendance_rate < 0.85? → Yes → marks < 75? → Yes → Risk: 0.45
# Tree 2: behavior_score < 85? → Yes → attendance < 0.90? → Yes → Risk: 0.42
# Tree 3: marks < 70? → No → attendance > 0.80? → Yes → Risk: 0.38
# ...
# Tree 100: combined features → Risk: 0.41

# Average all trees
risk_score = (0.45 + 0.42 + 0.38 + ... + 0.41) / 100 = 0.42
```

### Risk Level Mapping
```python
if 0.42 < 0.3: risk_level = 'low'      # No
elif 0.42 < 0.6: risk_level = 'medium' # Yes ✓
elif 0.42 < 0.8: risk_level = 'high'   # No
else: risk_level = 'critical'          # No

risk_level = 'medium'
```

### Feature Importance (from model)
```python
{
  "attendance_rate": 0.32,        # 32% - Most important
  "avg_marks_percentage": 0.28,   # 28% - Second
  "behavior_score": 0.18,         # 18% - Third
  "days_tracked": 0.08,           # 8%
  "exams_completed": 0.06,        # 6%
  "days_present": 0.04,           # 4%
  "days_absent": 0.02,            # 2%
  "total_incidents": 0.02         # 2%
}
```

---

## Step 5: Generate Recommendations

### Rule-Based Recommendations (Fallback)
```javascript
recommendations = []

// Check attendance
if (attendance_rate < 0.75) {
  // 0.844 > 0.75, skip
}

// Check marks
if (avg_marks_percentage < 50) {
  // 70 > 50, skip
}

// Check behavior
if (behavior_score < 60) {
  // 80 > 60, skip
}

// Since no critical issues, add general recommendations
recommendations = [
  "Continue monitoring student progress regularly",
  "Maintain current attendance levels",
  "Provide additional support in weaker subjects"
]
```

### Priority Actions (Top 2)
```javascript
priority_actions = [
  "Continue monitoring student progress regularly",
  "Maintain current attendance levels"
]
```

---

## Step 6: ML Service Response

ML service returns this JSON:

```json
{
  "student_id": "rahul-123",
  "prediction": {
    "risk_score": 0.42,
    "risk_level": "medium",
    "confidence": "medium",
    "data_tier": 2,
    "model_type": "RandomForest"
  },
  "feature_importance": {
    "attendance_rate": 0.32,
    "avg_marks_percentage": 0.28,
    "behavior_score": 0.18,
    "days_tracked": 0.08,
    "exams_completed": 0.06,
    "days_present": 0.04,
    "days_absent": 0.02,
    "total_incidents": 0.02
  },
  "explanation": "Student is at medium risk. Key factors: Attendance Rate, Average Marks Percentage, Behavior Score.",
  "recommendations": [
    "Continue monitoring student progress regularly",
    "Maintain current attendance levels",
    "Provide additional support in weaker subjects"
  ],
  "priority_actions": [
    "Continue monitoring student progress regularly",
    "Maintain current attendance levels"
  ],
  "metadata": {
    "student_name": "Rahul Kumar",
    "class_name": "10-A"
  }
}
```

---

## Step 7: Backend Processing

### Calculate Risk Breakdown
```javascript
// Backend calculates component risks
components = {
  attendance_risk: 1 - (0.844) = 0.156 = 15.6%,
  academic_risk: 1 - (70.0 / 100) = 0.30 = 30.0%,
  behavior_risk: 1 - (80 / 100) = 0.20 = 20.0%
}
```

### Store in Database
```sql
INSERT INTO risk_predictions (
  student_id, school_id, risk_score, risk_level, 
  confidence, data_tier, component_scores, recommendations
) VALUES (
  'rahul-123',
  'school-456',
  0.42,
  'medium',
  'medium',
  2,
  '{"feature_importance": {...}, "model_type": "RandomForest"}',
  '["Continue monitoring...", "Maintain attendance..."]'
)
ON CONFLICT (student_id, school_id) DO UPDATE SET
  risk_score = 0.42,
  risk_level = 'medium',
  updated_at = NOW();
```

---

## Step 8: Frontend Display

### API Response to Frontend
```json
{
  "success": true,
  "student_id": "rahul-123",
  "prediction": {
    "risk_score": 0.42,
    "risk_level": "medium",
    "confidence": "medium",
    "data_tier": 2
  },
  "components": {
    "attendance_risk": 0.156,
    "academic_risk": 0.30,
    "behavior_risk": 0.20
  },
  "feature_importance": {
    "attendance_rate": 0.32,
    "avg_marks_percentage": 0.28,
    "behavior_score": 0.18
  },
  "explanation": "Student is at medium risk. Key factors: Attendance Rate, Average Marks Percentage, Behavior Score.",
  "recommendations": [
    "Continue monitoring student progress regularly",
    "Maintain current attendance levels",
    "Provide additional support in weaker subjects"
  ],
  "priority_actions": [
    "Continue monitoring student progress regularly",
    "Maintain current attendance levels"
  ]
}
```

### StudentRiskCard Renders
```
┌─────────────────────────────────────────────┐
│  ⚠️  MEDIUM RISK                            │
│  Risk Score: 42.0%                          │
│  Confidence: Medium                         │
├─────────────────────────────────────────────┤
│  🤖 AI Analysis                             │
│  Student is at medium risk. Key factors:    │
│  Attendance Rate, Average Marks Percentage, │
│  Behavior Score.                            │
├─────────────────────────────────────────────┤
│  Risk Breakdown                             │
│  Attendance Risk  ████░░░░░░ 15.6%          │
│  Academic Risk    ██████░░░░ 30.0%          │
│  Behavior Risk    ████░░░░░░ 20.0%          │
├─────────────────────────────────────────────┤
│  ⚠️ Priority Actions                        │
│  • Continue monitoring student progress     │
│  • Maintain current attendance levels       │
├─────────────────────────────────────────────┤
│  ✓ Show All Recommendations (3)             │
└─────────────────────────────────────────────┘
```

---

## Complete Timeline

```
[00:00] Teacher clicks "View Risk" for Rahul
[00:01] Frontend: GET /api/ml/risk/student/rahul-123
[00:02] Backend: Authenticate teacher access
[00:03] Backend: Extract features from database
        - Query attendance table (45 records)
        - Query marks table (4 records)
        - Query behavior table (3 records)
[00:04] Backend: Calculate data_tier = 2
[00:05] Backend: POST to ML service with features
[00:06] ML Service: Load model from disk
[00:07] ML Service: Run prediction (100 trees vote)
[00:08] ML Service: Calculate feature importance
[00:09] ML Service: Generate recommendations
[00:10] ML Service: Return prediction
[00:11] Backend: Calculate risk breakdown
[00:12] Backend: Store prediction in database
[00:13] Backend: Return response to frontend
[00:14] Frontend: Render StudentRiskCard
[00:15] Teacher sees: MEDIUM RISK - 42%
```

Total time: ~15 seconds (first time)
Subsequent views: ~2 seconds (cached in database)

---

## What Happens When Data Changes?

### Scenario: Teacher marks Rahul absent for 3 more days

**Current Behavior:**
1. Teacher marks attendance → Saved to database ✓
2. Prediction updates? → NO ✗
3. Teacher views risk card → Shows OLD prediction (42%) ✗
4. Teacher must manually refresh or wait for next view

**Expected Behavior (Not Implemented):**
1. Teacher marks attendance → Saved to database ✓
2. Trigger: Auto-regenerate prediction ✓
3. New features extracted:
   - attendance_rate = 38/48 = 0.792 (79.2%)
   - risk_score increases to 0.52 (52%)
   - risk_level stays 'medium'
4. Teacher views risk card → Shows NEW prediction (52%) ✓

---

## Summary

This example shows:
- How raw database records become ML features
- How the Random Forest model makes predictions
- How feature importance identifies key risk factors
- How recommendations are generated
- How the frontend displays the results
- Why predictions don't auto-update (missing trigger)

The system works end-to-end but needs auto-update triggers to be truly real-time.
