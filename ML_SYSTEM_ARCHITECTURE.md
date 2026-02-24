# ML Dropout Prediction System - Architecture Documentation

## System Overview

The Smart Automated Dropout Prediction System uses a microservices architecture to predict student dropout risk based on attendance, academic performance, and behavior data.

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                     React Frontend (Port 5173)              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │ RiskDashboard│  │StudentRiskCard│  │ClassRiskTable│     │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘     │
└─────────┼──────────────────┼──────────────────┼────────────┘
          │                  │                  │
          └──────────────────┼──────────────────┘
                             │ HTTP/REST
                             ▼
┌─────────────────────────────────────────────────────────────┐
│              Node.js Backend (Port 3000)                    │
│  ┌──────────────────────────────────────────────────────┐  │
│  │           ML Integration Layer (NEW)                  │  │
│  │  ┌────────────┐  ┌────────────┐  ┌────────────┐     │  │
│  │  │   Routes   │→ │ Controller │→ │  Feature   │     │  │
│  │  │            │  │            │  │ Extractor  │     │  │
│  │  └────────────┘  └─────┬──────┘  └─────┬──────┘     │  │
│  │                         │                │            │  │
│  │                         │                ▼            │  │
│  │                         │         ┌────────────┐     │  │
│  │                         │         │ PostgreSQL │     │  │
│  │                         │         │  (Raw SQL) │     │  │
│  │                         │         └────────────┘     │  │
│  │                         ▼                             │  │
│  │                  ┌────────────┐                      │  │
│  │                  │ ML Client  │                      │  │
│  │                  └─────┬──────┘                      │  │
│  └────────────────────────┼───────────────────────────┘  │
└───────────────────────────┼──────────────────────────────┘
                            │ HTTP
                            ▼
┌─────────────────────────────────────────────────────────────┐
│           Python ML Service (Port 5001)                     │
│  ┌──────────────────────────────────────────────────────┐  │
│  │                  Flask API                            │  │
│  │  ┌────────────┐  ┌────────────┐  ┌────────────┐     │  │
│  │  │   /health  │  │  /predict  │  │/batch-pred │     │  │
│  │  └────────────┘  └─────┬──────┘  └────────────┘     │  │
│  │                         │                             │  │
│  │                         ▼                             │  │
│  │              ┌────────────────────┐                  │  │
│  │              │  Risk Calculator   │                  │  │
│  │              │  (Rule-based ML)   │                  │  │
│  │              └─────────┬──────────┘                  │  │
│  │                        │                              │  │
│  │                        ▼                              │  │
│  │              ┌────────────────────┐                  │  │
│  │              │ Gemini Explainer   │                  │  │
│  │              │ (AI Recommendations)│                 │  │
│  │              └─────────┬──────────┘                  │  │
│  └────────────────────────┼───────────────────────────┘  │
└───────────────────────────┼──────────────────────────────┘
                            │ HTTPS
                            ▼
                   ┌────────────────┐
                   │ Google Gemini  │
                   │   AI API       │
                   └────────────────┘
```

## Component Details

### 1. React Frontend Components

**Location**: `proactive-education-assistant/src/components/risk/`

#### RiskDashboard.jsx
- Displays school-wide risk statistics
- Shows critical students requiring immediate attention
- Provides risk level breakdown (low/medium/high/critical)

#### StudentRiskCard.jsx
- Individual student risk profile
- Risk score with confidence level
- Component breakdown (attendance/academic/behavior)
- AI-generated recommendations
- Priority actions

#### ClassRiskTable.jsx
- Risk analysis for all students in a class
- Sortable by risk score, level, confidence
- CSV export functionality
- Batch prediction support

### 2. Node.js Backend Integration

**Location**: `backend/ml-integration/`

#### routes.js
- Express routes for ML endpoints
- Authentication middleware integration
- RESTful API design

**Endpoints**:
```
GET  /api/ml/risk/:studentId        - Single student prediction
GET  /api/ml/risk/class/:classId    - Class-wide predictions
GET  /api/ml/risk/dashboard         - School statistics
```

#### riskController.js
- Orchestrates the prediction workflow
- Validates data tier before prediction
- Stores predictions in database
- Handles errors gracefully

**Workflow**:
1. Extract features from database
2. Validate data tier (block if insufficient)
3. Get student metadata
4. Call ML service
5. Store prediction
6. Return result

#### featureExtractor.js
- Extracts student features using raw SQL
- Enforces business rules (NULL vs ZERO)
- Calculates data tier
- Supports batch extraction

**Features Extracted**:
- Attendance: rate, days tracked, present, absent
- Academic: avg marks, exams completed, total marks
- Behavior: score, incidents (positive/negative)
- Data quality: tier (0-3)

#### mlClient.js
- HTTP client for Python ML service
- Health check monitoring
- Error handling and fallbacks
- Timeout management

### 3. Python ML Service

**Location**: `ml-service/`

#### app.py (Flask API)
- RESTful API endpoints
- Request validation
- Error handling
- CORS support

**Endpoints**:
```
GET  /health              - Health check
POST /predict             - Single prediction
POST /batch-predict       - Batch predictions
```

#### models/risk_calculator.py
- Rule-based risk calculation
- Weighted scoring system
- Component risk calculation
- Risk level classification

**Algorithm**:
```python
risk_score = (
    0.40 * attendance_risk +
    0.40 * academic_risk +
    0.20 * behavior_risk
)

risk_level = classify(risk_score)
# low: <0.3, medium: 0.3-0.6, high: 0.6-0.8, critical: >0.8
```

#### models/gemini_explainer.py
- Google Gemini AI integration
- Generates human-readable explanations
- Provides actionable recommendations
- Fallback to rule-based if API fails

**Prompt Engineering**:
- Structured prompts with student context
- JSON response parsing
- Priority action identification
- Educational counselor persona

### 4. Database Schema

**Table**: `risk_predictions`

```sql
CREATE TABLE risk_predictions (
  prediction_id UUID PRIMARY KEY,
  student_id UUID NOT NULL,
  school_id UUID NOT NULL,
  risk_score DECIMAL(5,3) NOT NULL,
  risk_level VARCHAR(20) NOT NULL,
  confidence VARCHAR(20) NOT NULL,
  data_tier INTEGER NOT NULL,
  component_scores JSONB,
  recommendations JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(student_id, school_id)
);
```

**Indexes**:
- `idx_risk_predictions_school` - Query by school
- `idx_risk_predictions_level` - Filter by risk level
- `idx_risk_predictions_student` - Lookup by student
- `idx_risk_predictions_created` - Time-based queries

## Data Flow

### Single Student Prediction Flow

```
1. User requests student risk
   ↓
2. Frontend: GET /api/ml/risk/:studentId
   ↓
3. Backend: Authenticate user
   ↓
4. Backend: Extract features from PostgreSQL
   - Attendance data (only marked days)
   - Academic data (only submitted/verified exams)
   - Behavior data (no records = positive signal)
   ↓
5. Backend: Calculate data tier
   - Tier 0: <14 days OR 0 exams → BLOCK
   - Tier 1-3: Proceed with prediction
   ↓
6. Backend: Call Python ML service
   POST http://localhost:5001/predict
   ↓
7. Python: Calculate risk score
   - Attendance risk (40%)
   - Academic risk (40%)
   - Behavior risk (20%)
   ↓
8. Python: Call Gemini AI
   - Generate explanation
   - Generate recommendations
   - Identify priority actions
   ↓
9. Python: Return prediction
   ↓
10. Backend: Store in risk_predictions table
    ↓
11. Backend: Return to frontend
    ↓
12. Frontend: Display risk card
```

### Batch Prediction Flow

```
1. User requests class risk
   ↓
2. Frontend: GET /api/ml/risk/class/:classId
   ↓
3. Backend: Get all students in class
   ↓
4. Backend: Extract features for all students (parallel)
   ↓
5. Backend: Filter students with sufficient data (tier > 0)
   ↓
6. Backend: Call Python ML service (batch)
   POST http://localhost:5001/batch-predict
   ↓
7. Python: Calculate risk for each student
   ↓
8. Python: Return batch results
   ↓
9. Backend: Store all predictions
   ↓
10. Backend: Return to frontend
    ↓
11. Frontend: Display class risk table
```

## Business Logic

### Data Tier Calculation

```javascript
function calculateDataTier(daysTracked, examsCompleted) {
  if (daysTracked < 14 || examsCompleted < 1) return 0;  // Insufficient
  if (daysTracked >= 60 && examsCompleted >= 5) return 3; // High
  if (daysTracked >= 30 && examsCompleted >= 3) return 2; // Medium
  return 1; // Low
}
```

### Attendance Risk Calculation

```python
def calculate_attendance_risk(attendance_rate):
    if attendance_rate >= 0.90: return 0.1   # Excellent
    if attendance_rate >= 0.80: return 0.3   # Good
    if attendance_rate >= 0.75: return 0.5   # Acceptable
    if attendance_rate >= 0.60: return 0.7   # Concerning
    return 0.95  # Critical
```

### Academic Risk Calculation

```python
def calculate_academic_risk(avg_marks):
    if avg_marks >= 75: return 0.1   # Excellent
    if avg_marks >= 60: return 0.3   # Good
    if avg_marks >= 50: return 0.5   # Acceptable
    if avg_marks >= 40: return 0.7   # Concerning
    return 0.95  # Critical
```

### Behavior Risk Calculation

```python
def calculate_behavior_risk(behavior_score):
    if behavior_score >= 80: return 0.1   # Excellent
    if behavior_score >= 60: return 0.3   # Good
    if behavior_score >= 40: return 0.6   # Concerning
    return 0.9  # Critical
```

## Security

### Authentication
- All API endpoints require JWT token
- Token validated by existing auth middleware
- School ID extracted from token

### Authorization
- Users can only access their school's data
- Student ID validated against school ID
- Class ID validated against school ID

### Data Privacy
- Predictions stored with school isolation
- No cross-school data leakage
- JSONB fields for flexible data storage

## Performance

### Optimization Strategies
1. **Parallel Feature Extraction**: Attendance, marks, and behavior queries run in parallel
2. **Batch Processing**: Class predictions use batch endpoint
3. **Database Indexing**: Optimized indexes for common queries
4. **Caching**: Predictions stored in database (upsert on conflict)
5. **Stateless ML Service**: Can scale horizontally

### Expected Response Times
- Single prediction: 500-1000ms
- Class prediction (30 students): 2-3 seconds
- Dashboard statistics: 200-500ms

## Error Handling

### Insufficient Data
```json
{
  "error": "Insufficient data for prediction",
  "message": "Student needs at least 14 days of attendance and 1 completed exam",
  "data_tier": 0
}
```

### ML Service Unavailable
```json
{
  "error": "ML service unavailable",
  "message": "Could not connect to ML prediction service"
}
```

### Gemini API Failure
- System automatically falls back to rule-based explanations
- Predictions still generated
- `fallback: true` flag in response

## Monitoring

### Health Checks
```bash
# ML service health
curl http://localhost:5001/health

# Expected response
{
  "status": "healthy",
  "service": "ml-dropout-prediction",
  "gemini_available": true
}
```

### Database Queries
```sql
-- Prediction statistics
SELECT 
  risk_level,
  COUNT(*) as count,
  AVG(risk_score) as avg_score
FROM risk_predictions
WHERE created_at > NOW() - INTERVAL '7 days'
GROUP BY risk_level;

-- Data tier distribution
SELECT 
  data_tier,
  COUNT(*) as count
FROM risk_predictions
GROUP BY data_tier;
```

## Extensibility

### Adding New Features
1. Update `featureExtractor.js` to extract new data
2. Update `risk_calculator.py` to use new features
3. Adjust weights if needed
4. Update Gemini prompt for context

### Adjusting Weights
Edit `ml-service/models/risk_calculator.py`:
```python
self.weights = {
    'attendance': 0.40,  # Adjust as needed
    'academic': 0.40,
    'behavior': 0.20
}
```

### Adding New Risk Levels
1. Update risk classification thresholds
2. Update database CHECK constraint
3. Update frontend badge colors
4. Update documentation

## Testing

### Unit Tests
- Feature extraction logic
- Risk calculation algorithm
- Data tier calculation
- Business rule enforcement

### Integration Tests
- End-to-end prediction flow
- Batch prediction
- Error handling
- Fallback mechanisms

### Test Script
```bash
cd ml-service
python test_ml_service.py
```

## Deployment

### Development
```bash
# Start ML service
cd ml-service
python app.py

# Start backend
cd backend
npm start

# Start frontend
cd proactive-education-assistant
npm run dev
```

### Production
```bash
# ML service with gunicorn
gunicorn -w 4 -b 0.0.0.0:5001 app:app

# Or with Docker
docker-compose up -d
```

## Maintenance

### Regular Tasks
1. Monitor prediction accuracy
2. Review critical risk students
3. Adjust thresholds based on outcomes
4. Update Gemini prompts for better recommendations
5. Archive old predictions (>90 days)

### Database Maintenance
```sql
-- Archive old predictions
DELETE FROM risk_predictions 
WHERE created_at < NOW() - INTERVAL '90 days';

-- Vacuum table
VACUUM ANALYZE risk_predictions;
```

## Future Enhancements

1. **Machine Learning Model**: Replace rule-based with trained model
2. **Historical Trends**: Track risk score changes over time
3. **Intervention Tracking**: Link predictions to interventions
4. **Parent Notifications**: Auto-notify parents of high-risk students
5. **Predictive Analytics**: Forecast future risk trajectories
6. **A/B Testing**: Test different weight configurations
7. **Real-time Updates**: WebSocket for live risk updates

## Conclusion

The ML Dropout Prediction System is designed to be:
- **Isolated**: No conflicts with existing code
- **Scalable**: Microservices architecture
- **Maintainable**: Clear separation of concerns
- **Extensible**: Easy to add features
- **Reliable**: Graceful error handling
- **Transparent**: Clear business rules and data requirements
