# ML Dropout Prediction Service

Python Flask microservice for student dropout risk prediction using Random Forest ML model and Google Gemini AI for explainable recommendations.

## Features

- **Trained ML Model**: Random Forest Classifier trained on synthetic student data
- **Feature Importance**: Identifies key risk factors for each prediction
- **Explainable AI**: Google Gemini generates human-readable recommendations
- **Continuous Learning**: `/retrain` endpoint to update model with new data
- **Batch Predictions**: Efficient processing of multiple students

## Setup

### 1. Create virtual environment

```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

### 2. Install dependencies

```bash
pip install -r requirements.txt
```

### 3. Train the initial model

```bash
python generate_and_train.py
```

This will:
- Generate 1,000 synthetic student records
- Train a Random Forest model
- Save the model to `models/dropout_model.pkl`
- Display training metrics and feature importance

### 4. Configure environment

```bash
cp .env.example .env
# Edit .env and add your GEMINI_API_KEY
```

### 5. Run the service

```bash
python app.py
```

The service will start on `http://localhost:5001`

## API Endpoints

### Health Check
```
GET /health
```

Response:
```json
{
  "status": "healthy",
  "service": "ml-dropout-prediction",
  "model_loaded": true,
  "gemini_available": true,
  "model_type": "RandomForestClassifier"
}
```

### Single Prediction
```
POST /predict
Content-Type: application/json

{
  "student_id": "uuid",
  "features": {
    "attendance_rate": 0.85,
    "avg_marks_percentage": 72.5,
    "behavior_score": 80,
    "data_tier": 2,
    "days_tracked": 45,
    "exams_completed": 4,
    "days_present": 38,
    "days_absent": 7,
    "total_incidents": 2,
    "positive_incidents": 1,
    "negative_incidents": 1
  }
}
```

Response:
```json
{
  "student_id": "uuid",
  "prediction": {
    "risk_score": 0.342,
    "risk_level": "medium",
    "confidence": "medium",
    "data_tier": 2,
    "model_type": "RandomForest"
  },
  "feature_importance": {
    "attendance_rate": 0.2845,
    "avg_marks_percentage": 0.2612,
    "behavior_score": 0.1523,
    ...
  },
  "explanation": "ML model predicts medium risk...",
  "recommendations": [...],
  "priority_actions": [...]
}
```

### Batch Prediction
```
POST /batch-predict
Content-Type: application/json

{
  "students": [
    {"student_id": "uuid1", "features": {...}},
    {"student_id": "uuid2", "features": {...}}
  ]
}
```

### Retrain Model (Continuous Learning)
```
POST /retrain
Content-Type: application/json

{
  "training_data": [
    {
      "attendance_rate": 0.85,
      "avg_marks_percentage": 72.5,
      "behavior_score": 80,
      "days_tracked": 45,
      "exams_completed": 4,
      "days_present": 38,
      "days_absent": 7,
      "total_incidents": 2,
      "positive_incidents": 1,
      "negative_incidents": 1,
      "dropped_out": 0
    },
    ...
  ]
}
```

Response:
```json
{
  "success": true,
  "message": "Model retrained successfully",
  "training_samples": 150,
  "metrics": {
    "roc_auc": 0.8542,
    "training_samples": 120,
    "test_samples": 30
  }
}
```

## ML Model Details

### Algorithm
- **Model**: Random Forest Classifier
- **Trees**: 100 estimators
- **Max Depth**: 10
- **Class Weight**: Balanced (handles imbalanced data)

### Features (10 total)
1. `attendance_rate` - Proportion of days present (0-1)
2. `avg_marks_percentage` - Average exam score (0-100)
3. `behavior_score` - Behavior rating (0-100, higher is better)
4. `days_tracked` - Total days of attendance data
5. `exams_completed` - Number of completed exams
6. `days_present` - Count of present days
7. `days_absent` - Count of absent days
8. `total_incidents` - Total behavior incidents
9. `positive_incidents` - Positive behavior count
10. `negative_incidents` - Negative behavior count

### Risk Classification
- **Low**: Risk score < 0.3 (< 30% dropout probability)
- **Medium**: Risk score 0.3-0.6 (30-60% dropout probability)
- **High**: Risk score 0.6-0.8 (60-80% dropout probability)
- **Critical**: Risk score > 0.8 (> 80% dropout probability)

## Data Requirements

### Minimum Data (Tier 1)
- 14+ days of attendance
- 1+ completed exam

### Medium Confidence (Tier 2)
- 30+ days of attendance
- 3+ completed exams

### High Confidence (Tier 3)
- 60+ days of attendance
- 5+ completed exams

## Testing

Run the test suite:

```bash
python test_ml_service.py
```

This tests:
- Health check
- Single prediction
- Insufficient data handling
- Batch prediction

## Continuous Learning

The `/retrain` endpoint allows you to update the model with new data:

1. Collect historical student data with outcomes
2. Format as JSON with `dropped_out` labels (0 or 1)
3. POST to `/retrain` with at least 50 samples
4. Model is retrained and automatically reloaded

Example workflow:
```python
import requests

# Collect real student data with outcomes
training_data = [
    {
        "attendance_rate": 0.65,
        "avg_marks_percentage": 45.0,
        "behavior_score": 55.0,
        "days_tracked": 80,
        "exams_completed": 6,
        "days_present": 52,
        "days_absent": 28,
        "total_incidents": 8,
        "positive_incidents": 2,
        "negative_incidents": 6,
        "dropped_out": 1  # Student actually dropped out
    },
    # ... more samples
]

response = requests.post(
    'http://localhost:5001/retrain',
    json={'training_data': training_data}
)
print(response.json())
```

## Feature Importance

The model provides feature importance scores showing which factors most influence predictions:

```python
{
  "attendance_rate": 0.2845,      # 28.45% importance
  "avg_marks_percentage": 0.2612, # 26.12% importance
  "behavior_score": 0.1523,       # 15.23% importance
  ...
}
```

These scores are:
- Used by Gemini AI to explain predictions
- Returned in every prediction response
- Based on Random Forest's built-in feature importance

## Production Deployment

### Using Gunicorn
```bash
gunicorn -w 4 -b 0.0.0.0:5001 app:app
```

### Using Docker
```bash
docker build -t ml-service .
docker run -p 5001:5001 --env-file .env ml-service
```

## Troubleshooting

### Model Not Found Error
```
Please run 'python generate_and_train.py' first to train the model
```
Solution: Train the initial model before starting the service.

### Gemini API Errors
The system automatically falls back to rule-based explanations if Gemini is unavailable. Predictions still work without Gemini.

### Insufficient Training Data
The `/retrain` endpoint requires at least 50 samples. Collect more historical data before retraining.

## Files

- `app.py` - Flask API server
- `generate_and_train.py` - Initial model training script
- `models/ml_predictor.py` - ML model wrapper class
- `models/gemini_explainer.py` - Gemini AI integration
- `models/dropout_model.pkl` - Trained model (generated)
- `models/training_data.csv` - Training dataset (generated)
- `models/model_metadata.json` - Model info (generated)
- `config.py` - Configuration
- `requirements.txt` - Python dependencies
