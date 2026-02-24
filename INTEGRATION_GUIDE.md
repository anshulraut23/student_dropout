# ML System Integration Guide

This guide shows how to integrate the isolated ML dropout prediction system into your existing codebase **without causing merge conflicts**.

## Phase 1: Isolated Development (COMPLETE ✓)

All ML components have been built in isolated directories:

```
✓ ml-service/                    (Python ML microservice)
✓ backend/ml-integration/        (Node.js orchestration layer)
✓ proactive-education-assistant/src/components/risk/  (React UI)
```

**Zero files modified in existing controllers, services, or routes.**

## Phase 2: Integration Steps

### Step 1: Database Migration (5 minutes)

Run the migration to add the `risk_predictions` table:

```bash
# Using psql
psql -U your_username -d your_database -f backend/ml-integration/migration.sql

# OR using Supabase
supabase db push
```

This adds ONE new table without touching existing tables.

### Step 2: Backend Integration (2 minutes)

Add ONE line to `backend/server.js`:

```javascript
// Add this line after your existing routes (around line 50-60)
const mlRoutes = require('./ml-integration/routes');
app.use('/api/ml', mlRoutes);
```

That's it! The ML routes are now available at `/api/ml/*`.

### Step 3: Environment Configuration (1 minute)

Add to `backend/.env`:

```bash
ML_SERVICE_URL=http://localhost:5001
```

### Step 4: Start ML Service (2 minutes)

```bash
# Windows
start-ml-service.bat

# Mac/Linux
chmod +x start-ml-service.sh
./start-ml-service.sh
```

Edit `ml-service/.env` and add your Gemini API key.

### Step 5: Test the Integration (5 minutes)

```bash
# Test ML service health
curl http://localhost:5001/health

# Test Node.js integration (replace TOKEN and UUID)
curl http://localhost:3000/api/ml/risk/STUDENT_UUID \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## Phase 3: Frontend Integration (Optional)

### Option A: Add to Existing Dashboard

```javascript
// In your admin dashboard component
import { RiskDashboard } from '../components/risk';

// Add to your dashboard
<RiskDashboard />
```

### Option B: Add to Student Profile

```javascript
// In your student profile page
import { StudentRiskCard } from '../components/risk';

// Add to student details
<StudentRiskCard studentId={student.student_id} />
```

### Option C: Add to Class View

```javascript
// In your class management page
import { ClassRiskTable } from '../components/risk';

// Add to class details
<ClassRiskTable classId={class.class_id} />
```

## API Endpoints Available

After integration, these endpoints are available:

```
GET  /api/ml/risk/:studentId        - Get student risk prediction
GET  /api/ml/risk/class/:classId    - Get class risk analysis
GET  /api/ml/risk/dashboard         - Get school-wide statistics
```

All require authentication token.

## Data Flow

```
1. Frontend calls /api/ml/risk/:studentId
2. Node.js (riskController) extracts features from PostgreSQL
3. Node.js validates data tier (blocks if insufficient)
4. Node.js calls Python ML service
5. Python calculates risk + calls Gemini for explanation
6. Node.js stores prediction in database
7. Frontend displays risk card with recommendations
```

## Business Rules Enforced

### Attendance Calculation
- Only counts days where `status IS NOT NULL`
- Unmarked days are NOT counted as absences
- Rate = present_days / total_marked_days

### Academic Calculation
- Only counts exams with `status IN ('submitted', 'verified')`
- Pending exams are ignored
- Average = sum(marks_obtained) / sum(total_marks) * 100

### Behavior Calculation
- No behavior records = 100 score (positive signal)
- Each negative incident reduces score by 10 points
- Minimum score is 0

### Data Tier Gating
- **Tier 0**: <14 days OR 0 exams → Prediction BLOCKED
- **Tier 1**: 14-30 days, 1-2 exams → Low confidence
- **Tier 2**: 30-60 days, 3-5 exams → Medium confidence
- **Tier 3**: 60+ days, 5+ exams → High confidence

## Risk Calculation

### Component Weights
- Attendance: 40%
- Academic: 40%
- Behavior: 20%

### Risk Levels
- **Low**: Score < 0.3 (Green)
- **Medium**: Score 0.3-0.6 (Yellow)
- **High**: Score 0.6-0.8 (Orange)
- **Critical**: Score > 0.8 (Red)

## Testing Checklist

- [ ] Database migration completed
- [ ] ML service starts without errors
- [ ] Health check returns 200
- [ ] Backend routes accessible
- [ ] Single student prediction works
- [ ] Class prediction works
- [ ] Dashboard statistics load
- [ ] Insufficient data handled correctly
- [ ] Gemini explanations generated (or fallback works)
- [ ] Predictions stored in database

## Rollback Plan

If you need to rollback:

1. **Remove ML routes** from `backend/server.js`:
   ```javascript
   // Comment out or remove this line
   // app.use('/api/ml', mlRoutes);
   ```

2. **Stop ML service**:
   ```bash
   # Just close the terminal running the ML service
   ```

3. **Drop table** (optional):
   ```sql
   DROP TABLE IF EXISTS risk_predictions;
   ```

All existing functionality remains untouched.

## Production Deployment

### Python ML Service

Use gunicorn or Docker:

```bash
# Gunicorn
cd ml-service
gunicorn -w 4 -b 0.0.0.0:5001 app:app

# Docker
docker build -t ml-service ml-service/
docker run -d -p 5001:5001 --env-file ml-service/.env ml-service
```

### Environment Variables

Production settings:

```bash
# backend/.env
ML_SERVICE_URL=http://ml-service:5001
NODE_ENV=production

# ml-service/.env
GEMINI_API_KEY=your_production_key
FLASK_ENV=production
FLASK_PORT=5001
```

### Scaling Considerations

- ML service is stateless (can run multiple instances)
- Use load balancer for ML service if needed
- Cache predictions in database (already implemented)
- Consider batch processing for large classes

## Monitoring

### Health Checks

```bash
# ML service health
curl http://localhost:5001/health

# Check predictions table
SELECT COUNT(*), risk_level 
FROM risk_predictions 
GROUP BY risk_level;
```

### Logs

- ML service logs: `ml-service/` (stdout)
- Backend logs: `backend/` (stdout)
- Check for errors in both services

## Common Issues

### "Insufficient Data" Error
- **Expected behavior** - students need 14+ days and 1+ exam
- Load demo data or wait for real data

### Gemini API Errors
- System automatically falls back to rule-based explanations
- Check API key and quota
- Predictions still work without Gemini

### ML Service Connection Failed
- Verify ML service is running on port 5001
- Check `ML_SERVICE_URL` in backend `.env`
- Test health endpoint directly

### Database Errors
- Verify migration ran successfully
- Check PostgreSQL connection
- Ensure `risk_predictions` table exists

## Next Steps After Integration

1. **Load Demo Data**: Use existing demo data scripts
2. **Test with Real Students**: Try predictions on actual students
3. **Monitor Performance**: Check prediction accuracy over time
4. **Adjust Weights**: Tune risk calculation weights if needed
5. **Add UI Components**: Integrate React components into dashboards
6. **Train Team**: Show teachers how to interpret risk scores

## Support

The system is designed to be:
- **Isolated**: No conflicts with existing code
- **Fault-tolerant**: Falls back gracefully if ML service is down
- **Transparent**: Clear error messages and data requirements
- **Extensible**: Easy to add new features or adjust weights

All components follow the same patterns as your existing codebase (raw SQL, Express routes, React components).
