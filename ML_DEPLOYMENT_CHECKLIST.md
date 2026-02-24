# ML Dropout Prediction System - Deployment Checklist

Use this checklist to ensure proper deployment of the ML system.

## Pre-Deployment Checklist

### Environment Setup
- [ ] Python 3.9+ installed
- [ ] Node.js 16+ installed
- [ ] PostgreSQL database accessible
- [ ] Google Gemini API key obtained
- [ ] All team members aware of new ML routes

### Code Review
- [ ] All ML code reviewed and approved
- [ ] No modifications to existing controllers/services/routes
- [ ] Database migration script reviewed
- [ ] Security review completed (SQL injection, auth)
- [ ] Error handling tested

### Testing
- [ ] ML service health check passes
- [ ] Single student prediction works
- [ ] Batch prediction works
- [ ] Insufficient data handling works
- [ ] Gemini fallback works
- [ ] Database storage works
- [ ] Frontend components render correctly

## Deployment Steps

### Step 1: Database Migration
- [ ] Backup database before migration
- [ ] Run migration script: `backend/ml-integration/migration.sql`
- [ ] Verify `risk_predictions` table created
- [ ] Verify indexes created
- [ ] Test table with sample insert

```sql
-- Test insert
INSERT INTO risk_predictions (student_id, school_id, risk_score, risk_level, confidence, data_tier)
VALUES ('test-uuid', 'test-school-uuid', 0.5, 'medium', 'medium', 2);

-- Verify
SELECT * FROM risk_predictions WHERE student_id = 'test-uuid';

-- Clean up
DELETE FROM risk_predictions WHERE student_id = 'test-uuid';
```

### Step 2: Python ML Service Deployment
- [ ] Create virtual environment
- [ ] Install dependencies: `pip install -r requirements.txt`
- [ ] Configure `.env` file with Gemini API key
- [ ] Test service locally: `python app.py`
- [ ] Test health endpoint: `curl http://localhost:5001/health`
- [ ] Test prediction endpoint with sample data
- [ ] Configure production server (gunicorn/Docker)
- [ ] Set up process manager (systemd/supervisor)
- [ ] Configure firewall rules (allow port 5001)
- [ ] Set up logging
- [ ] Set up monitoring

### Step 3: Backend Integration
- [ ] Add `ML_SERVICE_URL` to `.env`
- [ ] Add ML routes to `server.js`
- [ ] Test backend routes with authentication
- [ ] Verify feature extraction works
- [ ] Verify ML client communication works
- [ ] Test error handling
- [ ] Deploy backend changes
- [ ] Restart backend service

### Step 4: Frontend Integration (Optional)
- [ ] Import risk components
- [ ] Add to appropriate pages/dashboards
- [ ] Test component rendering
- [ ] Test API calls from frontend
- [ ] Test error states
- [ ] Deploy frontend changes

### Step 5: Production Configuration
- [ ] Set `FLASK_ENV=production` in ML service
- [ ] Set `NODE_ENV=production` in backend
- [ ] Configure CORS properly
- [ ] Set up HTTPS/SSL
- [ ] Configure rate limiting
- [ ] Set up API key rotation plan
- [ ] Configure backup strategy

## Post-Deployment Verification

### Smoke Tests
- [ ] ML service health check returns 200
- [ ] Backend ML routes accessible
- [ ] Authentication works on ML routes
- [ ] Single student prediction works
- [ ] Class prediction works
- [ ] Dashboard statistics load
- [ ] Frontend components display correctly

### Performance Tests
- [ ] Single prediction < 1 second
- [ ] Batch prediction (30 students) < 3 seconds
- [ ] Dashboard load < 500ms
- [ ] No memory leaks after 100 predictions
- [ ] Database queries optimized (check EXPLAIN)

### Error Handling Tests
- [ ] Insufficient data returns 400
- [ ] Invalid student ID returns 404
- [ ] ML service down returns 503
- [ ] Gemini API failure falls back gracefully
- [ ] Database errors handled properly

### Security Tests
- [ ] Unauthenticated requests rejected
- [ ] Cross-school data access blocked
- [ ] SQL injection attempts blocked
- [ ] API key not exposed in logs
- [ ] CORS configured correctly

## Monitoring Setup

### Metrics to Track
- [ ] ML service uptime
- [ ] Prediction request count
- [ ] Prediction latency (p50, p95, p99)
- [ ] Error rate
- [ ] Gemini API success rate
- [ ] Database query performance
- [ ] Risk level distribution

### Alerts to Configure
- [ ] ML service down
- [ ] High error rate (>5%)
- [ ] High latency (>2 seconds)
- [ ] Gemini API quota exceeded
- [ ] Database connection failures
- [ ] Critical risk students detected

### Logging
- [ ] ML service logs configured
- [ ] Backend logs include ML operations
- [ ] Error logs captured
- [ ] Audit logs for predictions
- [ ] Log rotation configured

## Documentation

- [ ] Update main README with ML system info
- [ ] Document API endpoints
- [ ] Create user guide for teachers
- [ ] Document risk interpretation
- [ ] Create troubleshooting guide
- [ ] Document maintenance procedures

## Training

- [ ] Train administrators on system
- [ ] Train teachers on risk interpretation
- [ ] Train counselors on recommendations
- [ ] Create FAQ document
- [ ] Schedule follow-up training

## Rollback Plan

### If Issues Arise
- [ ] Document rollback procedure
- [ ] Test rollback in staging
- [ ] Backup current state before rollback

### Rollback Steps
1. Remove ML routes from `server.js`
2. Stop ML service
3. Revert database migration (optional)
4. Restart backend
5. Notify team

## Production Checklist

### Week 1 Post-Deployment
- [ ] Monitor error logs daily
- [ ] Check prediction accuracy
- [ ] Gather user feedback
- [ ] Review critical risk students
- [ ] Adjust thresholds if needed

### Week 2-4 Post-Deployment
- [ ] Analyze prediction patterns
- [ ] Review Gemini recommendations quality
- [ ] Optimize slow queries
- [ ] Update documentation based on feedback
- [ ] Plan feature enhancements

### Monthly Maintenance
- [ ] Review system performance
- [ ] Update dependencies
- [ ] Archive old predictions
- [ ] Review and adjust risk weights
- [ ] Update Gemini prompts if needed

## Success Criteria

- [ ] 95%+ uptime for ML service
- [ ] <1 second average prediction time
- [ ] <5% error rate
- [ ] Positive user feedback
- [ ] Critical students identified accurately
- [ ] Recommendations actionable and helpful

## Sign-Off

- [ ] Development team lead approval
- [ ] QA team approval
- [ ] Security team approval
- [ ] Product owner approval
- [ ] Operations team ready

## Emergency Contacts

- ML Service Issues: [Contact]
- Backend Issues: [Contact]
- Database Issues: [Contact]
- Gemini API Issues: [Contact]

## Notes

Date Deployed: _______________
Deployed By: _______________
Version: _______________
Issues Encountered: _______________
Resolutions: _______________

---

## Quick Reference

### Start ML Service
```bash
cd ml-service
source venv/bin/activate  # or venv\Scripts\activate on Windows
python app.py
```

### Test ML Service
```bash
curl http://localhost:5001/health
```

### Check Logs
```bash
# ML service
tail -f ml-service/logs/app.log

# Backend
tail -f backend/logs/app.log
```

### Database Queries
```sql
-- Check predictions
SELECT COUNT(*), risk_level FROM risk_predictions GROUP BY risk_level;

-- Recent predictions
SELECT * FROM risk_predictions ORDER BY created_at DESC LIMIT 10;

-- Critical students
SELECT * FROM risk_predictions WHERE risk_level = 'critical';
```

### Restart Services
```bash
# ML service
sudo systemctl restart ml-service

# Backend
sudo systemctl restart backend

# Or with Docker
docker-compose restart ml-service backend
```
