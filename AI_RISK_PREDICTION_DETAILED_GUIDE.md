# AI Risk Prediction - Detailed Implementation Guide

This document provides a comprehensive explanation of how the AI-powered student dropout risk prediction system works in the Proactive Education Assistant platform.

## Overview

The system uses machine learning to predict which students are at risk of dropping out based on their attendance, academic performance, and behavior data. It provides real-time risk scores, explanations, and actionable recommendations to help teachers intervene early.

---

## System Architecture

```
┌─────────────────┐
│   Frontend      │
│  (React App)    │
└────────┬────────┘
         │
         │ HTTP Requests
         ▼
┌─────────────────┐
│   Backend       │
│  (Node.js API)  │
└────────┬────────┘
         │
         ├──────────────┐
         │              │
         ▼              ▼
┌─────────────┐  ┌──────────────┐
│  PostgreSQL │  │  ML Service  │
│  Database   │  │  (Python)    │
└─────────────┘  └──────────────┘
```

---

## Data Flow: From Database to Prediction

### Step 1: Data Storage

Student data is continuously collected and stored in PostgreSQL:

**Attendance Table:**
- `student_id`: Student identifier
- `date`: Date of attendance
- `status`: 'present', 'absent', or NULL (not marked)
- Tracks daily attendance records

**Marks Table:**
- `student_id`: Student identifier
- `exam_id`: Exam identifier
- `marks_obtained`: Score achieved
- `status`: 'submitted' or 'verified'
- Linked to exams table for total marks

**Behavior Table:**
- `student_id`: Student identifier
- `behavior_type`: 'positive' or 'negative'
- `description`: Details of incident
- Tracks behavioral incidents

**Exams Table:**
- `id`: Exam identifier
- `class_id`: Class identifier
- `subject_id`: Subject identifier
- `total_marks`: Maximum possible score
- `passing_marks`: Minimum passing score

---

## Feature Extraction Process

### What is Feature Extraction?

Feature extraction is the process of converting raw database records into numerical features that machine learning models can understand. Think of it as translating student data into a language the AI can read.

### Features Extracted

The system extracts 10 key features for each student:

#### 1. Attendance Features
- **attendance_rate** (0-1): Percentage of days present
  - Formula: `days_present / days_tracked`
  - Example: 38 present out of 45 days = 0.844 (84.4%)
  
- **days_tracked** (integer): Total days with attendance marked
  - Only counts days where status is NOT NULL
  - Example: 45 days
  
- **days_present** (integer): Days marked as 'present'
  - Example: 38 days
  
- **days_absent** (integer): Days marked as 'absent'
  - Example: 7 days

#### 2. Academic Features
- **avg_marks_percentage** (0-100): Average exam performance
  - Formula: `(total_marks_obtained / total_marks_possible) * 100`
  - Only includes exams with status 'submitted' or 'verified'
  - Example: 290/400 = 72.5%
  
- **exams_completed** (integer): Number of finalized exams
  - Example: 4 exams
  
- **total_marks_obtained** (integer): Sum of all exam scores
  - Example: 290 marks
  
- **total_marks_possible** (integer): Sum of all exam total marks
  - Example: 400 marks

#### 3. Behavior Features
- **behavior_score** (0-100): Behavioral health score
  - Formula: `100 - (negative_incidents * 10)`
  - No records = 100 (positive signal, not error)
  - Example: 2 negative incidents = 80 score
  
- **total_incidents** (integer): Total behavior records
  - Example: 3 incidents
  
- **positive_incidents** (integer): Positive behavior records
  - Example: 1 positive
  
- **negative_incidents** (integer): Negative behavior records
  - Example: 2 negative

---

## Data Tier System

### What is Data Tier?

Data tier represents the quality and completeness of data available for a student. More data = higher confidence in predictions.

### Tier Definitions

**Tier 0: Insufficient Data** ❌
- Less than 14 days of attendance OR less than 1 exam
- **Prediction blocked** - not enough data to make reliable prediction
- Frontend shows "Building Prediction Data" message

**Tier 1: Low Confidence** ⚠️
- 14-29 days of attendance AND 1-2 exams
- Predictions available but with low confidence
- Early warning system

**Tier 2: Medium Confidence** ✓
- 30-59 days of attendance AND 3-4 exams
- Reliable predictions with moderate confidence
- Standard operational mode

**Tier 3: High Confidence** ✓✓
- 60+ days of attendance AND 5+ exams
- Highly reliable predictions
- Best case scenario

### Current Inconsistency Issue

⚠️ **PROBLEM**: Different parts of the system use different thresholds:
- `featureExtractor.js`: Uses 14 days minimum (Tier 0 threshold)
- `config.py`: Defines 14 days but not consistently used
- `StudentRiskCard.jsx`: Shows "14 days" in UI

This inconsistency was introduced when testing with 1 day minimum but not fully reverted.

---

## ML Model: How Predictions Work

### Model Type

**Random Forest Classifier**
- Ensemble of 100 decision trees
- Each tree votes on dropout risk
- Final prediction is majority vote
- Provides feature importance scores

### Training Process

1. **Data Generation** (`generate_and_train.py`)
   - Creates 1,000 synthetic student records
   - Simulates realistic correlations between features
   - Assigns dropout labels based on risk factors

2. **Feature Correlation**
   - Low attendance (< 60%) → High dropout risk
   - Low marks (< 40%) → High dropout risk
   - Low behavior score (< 40%) → High dropout risk
   - Combined factors → Exponentially higher risk

3. **Model Training**
   - 80% training data, 20% test data
   - Balanced class weights (handles imbalanced data)
   - Saves model to `models/dropout_model.pkl`

### Current Model Limitations

⚠️ **CRITICAL ISSUES**:

1. **Synthetic Training Data**
   - Model trained on fake data, not real student records
   - May not reflect actual dropout patterns
   - **Solution**: Retrain with real historical data

2. **No Real Dropout Labels**
   - All training records have `dropped_out = 0`
   - Model has never seen actual dropout cases
   - **Solution**: Collect real dropout outcomes

3. **Low Accuracy**
   - Current ROC-AUC: ~0.72
   - Target ROC-AUC: >0.85
   - **Solution**: Better training data + feature engineering

---

## Prediction Workflow

### Step-by-Step Process

When a teacher views a student's risk prediction:

**1. Frontend Request**
```javascript
// User clicks on student card
apiService.getStudentRiskPrediction(studentId)
// Calls: GET /api/ml/risk/student/:studentId
```

**2. Backend Authentication**
```javascript
// Verify user has access to this student
// Teachers can only see their own students
// Admins can see all students in their school
```

**3. Feature Extraction**
```javascript
// featureExtractor.extractFeatures(studentId, schoolId)
// Runs 3 SQL queries in parallel:
// - Attendance query
// - Academic query  
// - Behavior query
// Returns 10 numerical features + data_tier
```

**4. Data Tier Check**
```javascript
if (data_tier === 0) {
  return 400 error: "Insufficient data"
  // Frontend shows "Building Prediction Data" card
}
```

**5. ML Service Call**
```javascript
// mlClient.predictRisk(payload)
// POST http://localhost:5001/predict
// Payload: { student_id, features, metadata }
```

**6. ML Prediction**
```python
# ML service receives request
# Loads trained model from disk
# Runs prediction on features
# Returns: risk_score (0-1), risk_level, feature_importance
```

**7. Risk Level Mapping**
```python
if risk_score < 0.3: risk_level = 'low'
elif risk_score < 0.6: risk_level = 'medium'
elif risk_score < 0.8: risk_level = 'high'
else: risk_level = 'critical'
```

**8. Store Prediction**
```javascript
// Save to risk_predictions table
// UPSERT: Insert new or update existing
// Stores: risk_score, risk_level, confidence, recommendations
```

**9. Return to Frontend**
```javascript
// Response includes:
// - prediction (risk_score, risk_level, confidence)
// - components (attendance_risk, academic_risk, behavior_risk)
// - feature_importance (which features matter most)
// - explanation (AI-generated text)
// - recommendations (actionable steps)
// - priority_actions (top 2 urgent actions)
```

**10. Display to User**
```javascript
// StudentRiskCard component renders:
// - Color-coded risk header (green/yellow/orange/red)
// - Risk score percentage
// - AI explanation
// - Risk breakdown bars
// - Feature importance chart
// - Priority actions
// - Recommendations list
```

---

## When Predictions Update

### Current Behavior (PROBLEM)

⚠️ **Predictions DO NOT auto-update** when new data is added:

1. Teacher marks attendance → No prediction update
2. Teacher enters exam marks → No prediction update
3. Teacher logs behavior → No prediction update

**Why?**
- No trigger mechanism in place
- Predictions only update when explicitly requested
- Frontend may show stale predictions

### How to Manually Update

**Option 1: View Student Card**
- Navigate to student's risk card
- Frontend fetches fresh prediction
- Backend extracts latest features
- ML service generates new prediction

**Option 2: Retrain Model**
- Admin clicks "Retrain Model" button
- Backend extracts all student features
- ML service retrains with latest data
- New model replaces old model

---

## Caching Mechanism

### Current Implementation

**No explicit caching** in the current code:
- Each request triggers full workflow
- Feature extraction runs every time
- ML service called every time
- Database updated every time

### Database-Level Caching

The `risk_predictions` table acts as implicit cache:
- Stores last prediction for each student
- `updated_at` timestamp tracks freshness
- Frontend could check timestamp before requesting new prediction

---

## API Endpoints

### 1. Get Student Risk
```
GET /api/ml/risk/student/:studentId
Authorization: Bearer <token>

Response:
{
  "success": true,
  "student_id": "uuid",
  "prediction": {
    "risk_score": 0.65,
    "risk_level": "medium",
    "confidence": "medium",
    "data_tier": 2
  },
  "components": {
    "attendance_risk": 0.15,
    "academic_risk": 0.28,
    "behavior_risk": 0.20
  },
  "feature_importance": {
    "attendance_rate": 0.35,
    "avg_marks_percentage": 0.30,
    "behavior_score": 0.20,
    ...
  },
  "explanation": "Student is at medium risk. Key factors: Attendance Rate, Average Marks Percentage, Behavior Score.",
  "recommendations": [
    "Improve attendance through parent engagement",
    "Provide academic tutoring"
  ],
  "priority_actions": [
    "Improve attendance through parent engagement"
  ]
}
```

### 2. Get Class Risk
```
GET /api/ml/risk/class/:classId
Authorization: Bearer <token>

Response:
{
  "success": true,
  "class_id": "uuid",
  "total_students": 30,
  "predictions_generated": 25,
  "predictions": [
    {
      "student_id": "uuid",
      "student_name": "John Doe",
      "risk_score": 0.65,
      "risk_level": "medium",
      "confidence": "medium"
    },
    ...
  ]
}
```

### 3. Retrain Model
```
POST /api/ml/retrain
Authorization: Bearer <token>

Response:
{
  "success": true,
  "message": "Model retrained successfully with 250 student records",
  "data": {
    "students_used": 250,
    "metrics": {
      "roc_auc": 0.72,
      "accuracy": 0.85
    }
  }
}
```

---

## Feature Importance

### What is Feature Importance?

Feature importance tells us which factors contribute most to the dropout risk prediction. It's like asking the AI: "What made you think this student is at risk?"

### How It's Calculated

Random Forest models naturally provide feature importance:
- Each tree splits data based on features
- Features that create better splits get higher importance
- Importance scores sum to 1.0 (100%)

### Example Output

```json
{
  "attendance_rate": 0.35,        // 35% - Most important
  "avg_marks_percentage": 0.30,   // 30% - Second most
  "behavior_score": 0.20,         // 20% - Third most
  "days_tracked": 0.05,           // 5%
  "exams_completed": 0.04,        // 4%
  "days_present": 0.03,           // 3%
  "days_absent": 0.02,            // 2%
  "total_incidents": 0.01         // 1%
}
```

### How It's Used

1. **AI Explanation**: "Key factors: Attendance Rate, Average Marks Percentage"
2. **Priority Actions**: Focus on top 2-3 factors
3. **Teacher Insights**: Shows what to focus on for each student

---

## Recommendations Engine

### How Recommendations are Generated

**Option 1: Gemini AI (if API key provided)**
- Sends features + prediction to Google Gemini
- AI generates personalized explanation
- AI suggests specific interventions
- More contextual and detailed

**Option 2: Rule-Based Fallback (no API key)**
- Uses if-then rules based on features
- Example rules:
  ```javascript
  if (attendance_rate < 0.75) {
    recommendations.push("Improve attendance through parent engagement")
  }
  if (avg_marks_percentage < 50) {
    recommendations.push("Provide intensive academic tutoring")
  }
  if (behavior_score < 60) {
    recommendations.push("Implement behavior intervention")
  }
  ```

### Recommendation Types

1. **Priority Actions** (Top 2)
   - Most urgent interventions
   - Displayed prominently in red box
   - Example: "Improve attendance through parent engagement"

2. **All Recommendations** (Full list)
   - Comprehensive action plan
   - Collapsible section
   - Example: 5-7 specific interventions

---

## Error Handling

### Insufficient Data (400)
```json
{
  "error": "Insufficient data for prediction",
  "message": "Student needs at least 14 days of attendance and 1 completed exam",
  "data_tier": 0,
  "features": { ... }
}
```
Frontend shows: "Building Prediction Data" card with requirements

### ML Service Unavailable (503)
```json
{
  "error": "ML service unavailable",
  "message": "Could not connect to ML prediction service"
}
```
Frontend shows: Yellow warning box

### Access Denied (403)
```json
{
  "error": "Access denied",
  "message": "You do not have access to this student"
}
```
Teachers can only see their own students

---

## Database Schema

### risk_predictions Table
```sql
CREATE TABLE risk_predictions (
  id TEXT PRIMARY KEY,
  student_id TEXT NOT NULL,
  school_id TEXT NOT NULL,
  risk_score DECIMAL(5,3) NOT NULL,  -- 0.000 to 1.000
  risk_level VARCHAR(20) NOT NULL,   -- low, medium, high, critical
  confidence VARCHAR(20) NOT NULL,   -- insufficient, low, medium, high
  data_tier INTEGER NOT NULL,        -- 0, 1, 2, 3
  component_scores JSONB,            -- Feature importance + breakdown
  recommendations JSONB,             -- Action items
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  UNIQUE(student_id, school_id)
);
```

---

## Configuration

### Backend (.env)
```bash
ML_SERVICE_URL=http://localhost:5001
DATABASE_URL=postgresql://...
```

### ML Service (.env)
```bash
FLASK_PORT=5001
FLASK_ENV=development
GEMINI_API_KEY=your_api_key_here  # Optional
```

### Thresholds (config.py)
```python
LOW_RISK_THRESHOLD = 0.3
MEDIUM_RISK_THRESHOLD = 0.6
HIGH_RISK_THRESHOLD = 0.8

TIER_0_MIN_DAYS = 14
TIER_0_MIN_EXAMS = 1
TIER_1_MIN_DAYS = 30
TIER_1_MIN_EXAMS = 3
TIER_2_MIN_DAYS = 60
TIER_2_MIN_EXAMS = 5
```

---

## Testing the System

### 1. Check ML Service Health
```bash
curl http://localhost:5001/health
```

### 2. Test Prediction (with token)
```bash
curl -X GET \
  http://localhost:3001/api/ml/risk/student/:studentId \
  -H "Authorization: Bearer <token>"
```

### 3. Retrain Model
```bash
curl -X POST \
  http://localhost:3001/api/ml/retrain \
  -H "Authorization: Bearer <token>"
```

---

## Known Issues & Limitations

### 1. Inconsistent Thresholds
- **Problem**: 14 days in some files, 1 day in others
- **Impact**: Confusing requirements, inconsistent behavior
- **Fix**: Standardize to 7 days everywhere

### 2. No Auto-Update
- **Problem**: Predictions don't refresh after data entry
- **Impact**: Stale predictions shown to teachers
- **Fix**: Add trigger after attendance/marks/behavior entry

### 3. Synthetic Training Data
- **Problem**: Model trained on fake data
- **Impact**: Low accuracy (ROC-AUC 0.72)
- **Fix**: Retrain with real historical dropout data

### 4. No Real Dropout Labels
- **Problem**: All training records have `dropped_out = 0`
- **Impact**: Model never learned what dropout looks like
- **Fix**: Collect actual dropout outcomes from schools

### 5. Missing Trend Features
- **Problem**: Only uses current values, not trends
- **Impact**: Can't detect declining patterns
- **Fix**: Add 7-day, 14-day, 30-day trend features

---

## Improvement Roadmap

### Phase 1: Fix Inconsistencies (Immediate)
- [ ] Standardize threshold to 7 days everywhere
- [ ] Fix SQL parameter bugs in updateClass/updateSubject
- [ ] Add auto-regeneration after data entry
- [ ] Remove or reduce cache duration

### Phase 2: Improve Model (Short-term)
- [ ] Collect real dropout labels from schools
- [ ] Retrain model with real data
- [ ] Add trend features (7-day, 14-day, 30-day changes)
- [ ] Improve feature engineering
- [ ] Target ROC-AUC > 0.85

### Phase 3: Advanced Features (Long-term)
- [ ] Real-time prediction updates
- [ ] Predictive alerts (email/SMS when risk increases)
- [ ] Intervention tracking (measure effectiveness)
- [ ] Multi-school model (learn from all schools)
- [ ] Explainable AI dashboard for admins

---

## Summary

The AI risk prediction system:

1. **Collects** attendance, marks, and behavior data
2. **Extracts** 10 numerical features from database
3. **Checks** data tier (blocks if insufficient)
4. **Predicts** dropout risk using Random Forest model
5. **Explains** prediction with feature importance
6. **Recommends** specific interventions
7. **Stores** prediction in database
8. **Displays** color-coded risk card to teachers

**Current State**: Working but needs improvements in data quality, model accuracy, and real-time updates.

**Next Steps**: Fix inconsistencies, add auto-updates, retrain with real data.
