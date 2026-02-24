# ML Dropout Prediction System - Setup Guide

Complete setup guide for the Smart Automated Dropout Prediction System.

## Architecture Overview

```
┌─────────────────┐
│  React Frontend │
│  (Port 5173)    │
└────────┬────────┘
         │ HTTP
         ▼
┌─────────────────┐
│  Node.js API    │
│  (Port 3000)    │
│  ml-integration/│
└────────┬────────┘
         │ HTTP
         ▼
┌─────────────────┐
│  Python ML      │
│  Flask Service  │
│  (Port 5001)    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Google Gemini  │
│  AI API         │
└─────────────────┘
```

## Prerequisites

- Node.js 16+ and npm
- Python 3.9+
- PostgreSQL database (already configured)
- Google Gemini API key (get from https://makersuite.google.com/app/apikey)

## Step 1: Database Migration

Run the SQL migration to create the `risk_predictions` table:

```bash
# Option A: Using psql
psql -U your_username -d your_database -f backend/ml-integration/migration.sql

# Option B: Using Supabase CLI (if using Supabase)
supabase db push
```

Verify the table was created:

```sql
SELECT * FROM risk_predictions LIMIT 1;
```

## Step 2: Python ML Service Setup

```bash
# Navigate to ml-service directory
cd ml-service

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On Mac/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Configure environment
cp .env.example .env

# Edit .env and add your Gemini API key
# GEMINI_API_KEY=your_actual_api_key_here
# FLASK_PORT=5001
# FLASK_ENV=development
```

Test the ML service:

```bash
python app.py
```

You should see:
```
* Running on http://0.0.0.0:5001
```

Test health endpoint:
```bash
curl http://localhost:5001/health
```

## Step 3: Node.js Backend Integration

```bash
cd backend

# Add ML service URL to .env
echo "ML_SERVICE_URL=http://localhost:5001" >> .env

# Install axios if not already installed
npm install axios
```

## Step 4: Integrate ML Routes

Add to `backend/server.js` (after existing routes):

```javascript
// ML Risk Prediction Routes (NEW - Isolated)
const mlRoutes = require('./ml-integration/routes');
app.use('/api/ml', mlRoutes);
```

Restart your backend server:

```bash
npm start
```

## Step 5: Frontend Integration (Optional)

The React components are ready in `proactive-education-assistant/src/components/risk/`.

To use them in your app:

```javascript
// In your admin dashboard or teacher dashboard
import { RiskDashboard, StudentRiskCard, ClassRiskTable } from '../components/risk';

// Use components
<RiskDashboard />
<StudentRiskCard studentId="uuid-here" />
<ClassRiskTable classId="uuid-here" />
```

## Step 6: Testing the System

### Test 1: Health Check

```bash
curl http://localhost:5001/health
```

Expected response:
```json
{
  "status": "healthy",
  "service": "ml-dropout-prediction",
  "gemini_available": true
}
```

### Test 2: Single Student Prediction

```bash
curl -X POST http://localhost:3000/api/ml/risk/STUDENT_UUID \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json"
```

### Test 3: Class Risk Analysis

```bash
curl http://localhost:3000/api/ml/risk/class/CLASS_UUID \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Test 4: Risk Dashboard

```bash
curl http://localhost:3000/api/ml/risk/dashboard \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## Data Requirements

For predictions to work, students need:

- **Minimum (Tier 1)**: 14 days of attendance + 1 completed exam
- **Medium (Tier 2)**: 30 days of attendance + 3 completed exams
- **High (Tier 3)**: 60 days of attendance + 5 completed exams

Students with less data will receive an "Insufficient Data" error.

## Troubleshooting

### ML Service Not Starting

```bash
# Check Python version
python --version  # Should be 3.9+

# Check if port 5001 is in use
netstat -ano | findstr :5001  # Windows
lsof -i :5001  # Mac/Linux

# Check logs
python app.py  # Look for error messages
```

### Gemini API Errors

If Gemini API is unavailable, the system will automatically fall back to rule-based explanations. Check:

1. API key is correct in `ml-service/.env`
2. API key has not exceeded quota
3. Internet connection is working

### Database Connection Errors

```bash
# Test PostgreSQL connection
psql -U your_username -d your_database -c "SELECT 1"

# Check if risk_predictions table exists
psql -U your_username -d your_database -c "\dt risk_predictions"
```

### "Insufficient Data" Errors

This is expected behavior. Students need:
- At least 14 days of marked attendance
- At least 1 exam with status 'submitted' or 'verified'

Load demo data or wait for real data to accumulate.

## Production Deployment

### Python ML Service

```bash
# Use gunicorn for production
gunicorn -w 4 -b 0.0.0.0:5001 app:app

# Or use Docker
docker build -t ml-service .
docker run -p 5001:5001 ml-service
```

### Environment Variables

Production `.env` for ml-service:

```
GEMINI_API_KEY=your_production_key
FLASK_PORT=5001
FLASK_ENV=production
```

Production `.env` for backend:

```
ML_SERVICE_URL=http://ml-service:5001
```

## API Endpoints Summary

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/ml/risk/:studentId` | GET | Get risk prediction for one student |
| `/api/ml/risk/class/:classId` | GET | Get risk predictions for all students in class |
| `/api/ml/risk/dashboard` | GET | Get school-wide risk statistics |

All endpoints require authentication token.

## Next Steps

1. Run database migration
2. Start Python ML service
3. Configure Gemini API key
4. Restart Node.js backend
5. Test with existing student data
6. Integrate React components (optional)

## Support

For issues:
1. Check logs in `ml-service/` and `backend/`
2. Verify all services are running
3. Test each component independently
4. Check data requirements are met
