# ML Dropout Prediction System - Quick Start

Get the ML dropout prediction system running in 10 minutes.

## Prerequisites Check

```bash
# Check Node.js (need 16+)
node --version

# Check Python (need 3.9+)
python --version

# Check PostgreSQL
psql --version
```

## 5-Step Quick Start

### Step 1: Database Migration (2 minutes)

```bash
# Run the migration
psql -U your_username -d your_database -f backend/ml-integration/migration.sql

# Verify
psql -U your_username -d your_database -c "SELECT COUNT(*) FROM risk_predictions;"
```

### Step 2: Python ML Service (3 minutes)

```bash
# Windows
start-ml-service.bat

# Mac/Linux
chmod +x start-ml-service.sh
./start-ml-service.sh
```

When prompted, edit `ml-service/.env` and add your Gemini API key:
```
GEMINI_API_KEY=your_actual_key_here
```

Get your key from: https://makersuite.google.com/app/apikey

### Step 3: Backend Integration (1 minute)

Add to `backend/.env`:
```bash
ML_SERVICE_URL=http://localhost:5001
```

Add to `backend/server.js` (after existing routes):
```javascript
const mlRoutes = require('./ml-integration/routes');
app.use('/api/ml', mlRoutes);
```

Restart backend:
```bash
cd backend
npm start
```

### Step 4: Test It (2 minutes)

```bash
# Test ML service
curl http://localhost:5001/health

# Test backend integration (replace with your token and student ID)
curl http://localhost:3000/api/ml/risk/YOUR_STUDENT_UUID \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Step 5: Use It (2 minutes)

Add to your React component:
```javascript
import { StudentRiskCard } from '../components/risk';

<StudentRiskCard studentId={student.student_id} />
```

## That's It!

You now have:
- ✓ ML service running on port 5001
- ✓ Backend routes at `/api/ml/*`
- ✓ React components ready to use
- ✓ Database table for predictions

## Next Steps

1. Load demo data (if you haven't already)
2. Try predictions on students with 14+ days of attendance
3. View the risk dashboard
4. Customize risk weights if needed

## Troubleshooting

### "Insufficient Data" Error
**This is normal!** Students need:
- At least 14 days of marked attendance
- At least 1 completed exam (status: submitted/verified)

### ML Service Won't Start
```bash
# Check Python version
python --version  # Need 3.9+

# Check if port 5001 is in use
netstat -ano | findstr :5001  # Windows
lsof -i :5001  # Mac/Linux
```

### Gemini API Errors
The system works without Gemini (uses fallback explanations).
But for best results, add your API key to `ml-service/.env`.

### Backend Connection Error
```bash
# Verify ML service is running
curl http://localhost:5001/health

# Check backend .env has ML_SERVICE_URL
cat backend/.env | grep ML_SERVICE
```

## Test with Sample Data

```bash
# Test the ML service directly
cd ml-service
python test_ml_service.py
```

## Documentation

- **Setup Guide**: `SETUP_ML_SYSTEM.md` - Detailed setup instructions
- **Integration Guide**: `INTEGRATION_GUIDE.md` - How to integrate with existing code
- **Architecture**: `ML_SYSTEM_ARCHITECTURE.md` - System design and data flow

## Support

If you get stuck:
1. Check the logs in both services
2. Verify all prerequisites are installed
3. Make sure database migration ran successfully
4. Test each component independently

## What You Built

```
React Frontend
    ↓
Node.js API (ml-integration/)
    ↓
Python ML Service (ml-service/)
    ↓
Google Gemini AI
```

All isolated from your existing code - zero merge conflicts!
