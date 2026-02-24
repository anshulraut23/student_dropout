# ML Risk Prediction System

## Overview
AI-powered dropout risk prediction system that analyzes student data to identify at-risk students early and provide actionable recommendations.

## Features
- Real-time risk score calculation (0-1 scale)
- Risk level categorization (Low, Medium, High, Critical)
- Confidence scoring based on data completeness
- Component-wise risk breakdown (Attendance, Academic, Behavior)
- AI-generated recommendations using Google Gemini
- Automated model retraining

## Architecture

### Components
1. **ML Service** (Python/Flask) - Port 5001
   - Random Forest Classifier for risk prediction
   - Google Gemini API for explanations
   - Model training and persistence
   - RESTful API endpoints

2. **Backend Integration** (Node.js)
   - Feature extraction from database
   - API client for ML service
   - Risk data storage and retrieval
   - Batch prediction processing

3. **Frontend Components** (React)
   - Risk dashboard with visualizations
   - Student risk cards
   - Class risk table
   - Risk badge indicators

## Data Requirements

### Minimum Data for Prediction
- **14 days of attendance data**
- **At least 1 completed exam**

### Data Tiers
- **Tier 0**: Insufficient data (< 14 days attendance)
- **Tier 1**: Low data (14-29 days attendance, 1-2 exams)
- **Tier 2**: Medium data (30-59 days attendance, 3-4 exams)
- **Tier 3**: High data (60+ days attendance, 5+ exams)

## Risk Calculation

### Component Scores
1. **Attendance Risk** (40% weight)
   - Based on attendance percentage
   - Considers recent trends
   - Flags irregular patterns

2. **Academic Risk** (40% weight)
   - Based on exam performance
   - Grade trends over time
   - Subject-wise analysis

3. **Behavior Risk** (20% weight)
   - Negative behavior incidents
   - Severity and frequency
   - Recent behavior patterns

### Risk Levels
- **Low**: Risk score 0.0 - 0.3 (Green)
- **Medium**: Risk score 0.3 - 0.6 (Yellow)
- **High**: Risk score 0.6 - 0.8 (Orange)
- **Critical**: Risk score 0.8 - 1.0 (Red)

## API Endpoints

### ML Service (Port 5001)
```
POST /predict - Single student prediction
POST /predict-batch - Multiple students prediction
POST /train - Train/retrain model
GET /health - Service health check
```

### Backend API (Port 5000)
```
GET /api/ml/risk/:studentId - Get student risk
GET /api/ml/risk/class/:classId - Get class risks
POST /api/ml/predict/:studentId - Generate prediction
POST /api/ml/predict-batch - Batch predictions
POST /api/ml/retrain - Retrain model
```

## Setup Instructions

### 1. ML Service Setup
```bash
cd ml-service
pip install -r requirements.txt
python app.py
```

### 2. Environment Variables
```env
# ML Service
GEMINI_API_KEY=your_gemini_api_key
PORT=5001

# Backend
ML_SERVICE_URL=http://localhost:5001
```

### 3. Database Migration
```bash
cd backend
node scripts/apply-complete-schema.js
```

### 4. Initial Training
```bash
cd ml-service
python generate_and_train.py
```

## Usage

### For Teachers
1. Navigate to Dashboard
2. View "At-Risk Students" section
3. Click on student for detailed risk analysis
4. Review AI recommendations
5. Create interventions based on suggestions

### For Admins
1. Access Risk Dashboard
2. View school-wide risk statistics
3. Filter by class or risk level
4. Export reports
5. Trigger model retraining

## Model Retraining

### Automatic Retraining
- Triggered when new data is available
- Runs in background
- Updates predictions automatically

### Manual Retraining
1. Click "Retrain AI Model" button on dashboard
2. System fetches latest data
3. Model trains on updated dataset
4. New predictions generated
5. Success notification displayed

## Recommendations

### Types
1. **Attendance Interventions**
   - Parent meetings
   - Attendance monitoring
   - Transportation support

2. **Academic Support**
   - Tutoring sessions
   - Study groups
   - Extra classes

3. **Behavioral Support**
   - Counseling
   - Mentorship programs
   - Positive reinforcement

## Performance Metrics
- Prediction accuracy: ~85%
- Response time: < 2 seconds
- Batch processing: 100 students/minute
- Model training time: 2-5 minutes

## Troubleshooting

### ML Service Not Running
```bash
# Check if service is running
curl http://localhost:5001/health

# Restart service
cd ml-service
python app.py
```

### Insufficient Data Error
- Ensure student has 14+ days attendance
- Verify at least 1 exam is completed
- Check data quality in database

### Low Confidence Predictions
- Add more attendance records
- Complete more exams
- Log behavior incidents
- Wait for data accumulation

## Files Structure
```
ml-service/
├── app.py                    # Flask API server
├── models/
│   ├── ml_predictor.py      # ML model logic
│   └── gemini_explainer.py  # AI explanations
├── generate_and_train.py    # Training script
└── requirements.txt         # Python dependencies

backend/ml-integration/
├── mlClient.js              # ML service client
├── featureExtractor.js      # Feature engineering
├── riskController.js        # API controllers
└── routes.js                # API routes

proactive-education-assistant/src/components/risk/
├── RiskDashboard.jsx        # Main dashboard
├── StudentRiskCard.jsx      # Student card
└── ClassRiskTable.jsx       # Class table
```

## Best Practices
1. Keep ML service running continuously
2. Retrain model weekly with new data
3. Review predictions regularly
4. Act on high-risk alerts promptly
5. Monitor prediction accuracy
6. Update intervention strategies based on outcomes
