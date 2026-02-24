# 🚀 Deployment Checklist: Behavior & Interventions

## Pre-Deployment Checks

### 1. Environment Setup
- [ ] PostgreSQL database is running
- [ ] DATABASE_URL is set in backend/.env
- [ ] Backend dependencies installed (`npm install`)
- [ ] Frontend dependencies installed (`npm install`)
- [ ] Backend port 5000 is available
- [ ] Frontend port 5173 is available

### 2. Database Migration
- [ ] Run migration script: `node backend/run-behavior-intervention-migration.js`
- [ ] Verify success message appears
- [ ] Check database for `behavior` table
- [ ] Check database for updated `interventions` table
- [ ] Verify indexes were created

### 3. Backend Verification
- [ ] Start backend: `cd backend && npm start`
- [ ] See "PostgreSQL connected successfully" message
- [ ] See "Server running on port 5000" message
- [ ] No error messages in console
- [ ] Test health endpoint: `http://localhost:5000/api/health`

### 4. Frontend Verification
- [ ] Start frontend: `cd proactive-education-assistant && npm run dev`
- [ ] See "Local: http://localhost:5173" message
- [ ] No error messages in console
- [ ] Can access login page

## Deployment Steps

### Step 1: Database Migration
```bash
cd backend
node run-behavior-intervention-migration.js
```
**Expected Output:**
```
🔄 Starting behavior and interventions migration...
✅ Migration completed successfully!

Created:
  - behavior table
  - Updated interventions table with new fields
  - Added indexes for performance
```

**Verification:**
```sql
-- Check behavior table exists
SELECT * FROM behavior LIMIT 1;

-- Check interventions table has new fields
SELECT priority, title, action_plan FROM interventions LIMIT 1;
```

### Step 2: Backend Deployment
```bash
cd backend
npm start
```
**Expected Output:**
```
✅ PostgreSQL connected successfully
Server running on port 5000
```

**Verification:**
```bash
# Test health endpoint
curl http://localhost:5000/api/health

# Expected response:
{"status":"ok","message":"Server is running"}
```

### Step 3: Frontend Deployment
```bash
cd proactive-education-assistant
npm run dev
```
**Expected Output:**
```
VITE v4.x.x  ready in xxx ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
```

**Verification:**
- Open browser to http://localhost:5173
- Should see login page
- No console errors

## Post-Deployment Testing

### Test 1: Login
- [ ] Can login as teacher
- [ ] Redirected to dashboard
- [ ] No console errors

### Test 2: Behavior Tab
- [ ] Navigate to Data Entry page
- [ ] Click Behaviour tab
- [ ] Tab loads without errors
- [ ] Can select class
- [ ] Can select student
- [ ] Can fill form
- [ ] Can save behavior
- [ ] See success message
- [ ] Form resets

### Test 3: Interventions Tab
- [ ] Click Interventions tab
- [ ] Tab loads without errors
- [ ] Can click "Add Intervention"
- [ ] Form appears
- [ ] Can select class and student
- [ ] Can fill all fields
- [ ] Can save intervention
- [ ] See success message
- [ ] Intervention appears in list

### Test 4: Student Profile - Behavior
- [ ] Navigate to Students page
- [ ] Click on a student
- [ ] Click Behavior tab
- [ ] See behavior records
- [ ] Records display correctly
- [ ] Color coding works
- [ ] Dates display correctly
- [ ] Teacher names show

### Test 5: Student Profile - Interventions
- [ ] Click Interventions tab
- [ ] See intervention plans
- [ ] Plans display correctly
- [ ] Color coding works
- [ ] Status badges show
- [ ] Action plans visible
- [ ] Dates display correctly

### Test 6: Edit Intervention
- [ ] Go to Data Entry → Interventions
- [ ] Click Edit on an intervention
- [ ] Form populates with data
- [ ] Can modify fields
- [ ] Can save changes
- [ ] See success message
- [ ] Changes reflected in list

### Test 7: Delete Intervention
- [ ] Click Delete on an intervention
- [ ] See confirmation dialog
- [ ] Confirm deletion
- [ ] See success message
- [ ] Intervention removed from list
- [ ] No longer on student profile

### Test 8: Filters
- [ ] Test class filter
- [ ] Test status filter
- [ ] Filters work correctly
- [ ] Results update immediately

### Test 9: Error Handling
- [ ] Try to save without student
- [ ] See error message
- [ ] Try to save without description
- [ ] See error message
- [ ] Error messages are clear

### Test 10: Data Persistence
- [ ] Create a behavior record
- [ ] Refresh page
- [ ] Record still visible
- [ ] Create an intervention
- [ ] Refresh page
- [ ] Intervention still visible

## API Endpoint Testing

### Behavior Endpoints
```bash
# Get all behaviors (requires auth token)
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:5000/api/behavior

# Get behaviors for student
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:5000/api/behavior/student/STUDENT_ID

# Create behavior
curl -X POST \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"studentId":"...","date":"2026-02-24","behaviorType":"positive","category":"Participation","severity":"medium","description":"Test"}' \
  http://localhost:5000/api/behavior
```

**Expected Results:**
- [ ] Status 200 for GET requests
- [ ] Status 201 for POST requests
- [ ] JSON response with data
- [ ] No errors

### Intervention Endpoints
```bash
# Get all interventions
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:5000/api/interventions

# Get interventions for student
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:5000/api/interventions/student/STUDENT_ID

# Create intervention
curl -X POST \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"studentId":"...","interventionType":"Academic Support","priority":"high","title":"Test","description":"Test"}' \
  http://localhost:5000/api/interventions
```

**Expected Results:**
- [ ] Status 200 for GET requests
- [ ] Status 201 for POST requests
- [ ] JSON response with data
- [ ] No errors

## Database Verification

### Check Behavior Records
```sql
-- Count behavior records
SELECT COUNT(*) FROM behavior;

-- View recent behaviors
SELECT * FROM behavior ORDER BY created_at DESC LIMIT 5;

-- Check behavior by student
SELECT * FROM behavior WHERE student_id = 'STUDENT_ID';
```

### Check Intervention Records
```sql
-- Count interventions
SELECT COUNT(*) FROM interventions;

-- View recent interventions
SELECT * FROM interventions ORDER BY created_at DESC LIMIT 5;

-- Check interventions by student
SELECT * FROM interventions WHERE student_id = 'STUDENT_ID';
```

## Performance Testing

### Page Load Times
- [ ] Data Entry page loads in < 2 seconds
- [ ] Student Profile page loads in < 2 seconds
- [ ] Behavior tab loads in < 1 second
- [ ] Interventions tab loads in < 1 second

### Form Submission
- [ ] Behavior save completes in < 1 second
- [ ] Intervention save completes in < 1 second
- [ ] Edit completes in < 1 second
- [ ] Delete completes in < 1 second

### Data Loading
- [ ] Behavior list loads in < 1 second
- [ ] Intervention list loads in < 1 second
- [ ] Student profile data loads in < 2 seconds

## Security Verification

### Authentication
- [ ] Cannot access endpoints without token
- [ ] Token expires correctly
- [ ] Refresh token works

### Authorization
- [ ] Teachers can only see their school's data
- [ ] Teachers can only edit their own records
- [ ] Admins can see all data
- [ ] Cannot access other schools' data

### Input Validation
- [ ] Required fields are enforced
- [ ] Date validation works
- [ ] SQL injection protection works
- [ ] XSS protection works

## Browser Compatibility

### Desktop Browsers
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)

### Mobile Browsers
- [ ] Chrome Mobile
- [ ] Safari Mobile
- [ ] Firefox Mobile

### Responsive Design
- [ ] Works on desktop (1920x1080)
- [ ] Works on laptop (1366x768)
- [ ] Works on tablet (768x1024)
- [ ] Works on mobile (375x667)

## Error Handling

### Network Errors
- [ ] Shows error when backend is down
- [ ] Shows error when network is slow
- [ ] Retry mechanism works

### Validation Errors
- [ ] Shows clear error messages
- [ ] Highlights invalid fields
- [ ] Prevents invalid submissions

### Server Errors
- [ ] Shows user-friendly error messages
- [ ] Logs errors to console
- [ ] Doesn't crash the app

## Documentation Review

### Code Documentation
- [ ] All functions have comments
- [ ] Complex logic is explained
- [ ] API endpoints documented

### User Documentation
- [ ] QUICK_START guide is clear
- [ ] TEST_INSTRUCTIONS are complete
- [ ] VISUAL_GUIDE is helpful
- [ ] IMPLEMENTATION_COMPLETE is accurate

## Rollback Plan

### If Issues Occur
1. **Stop the services**
   ```bash
   # Stop backend (Ctrl+C)
   # Stop frontend (Ctrl+C)
   ```

2. **Rollback database** (if needed)
   ```sql
   DROP TABLE IF EXISTS behavior;
   -- Restore interventions table from backup
   ```

3. **Restore code** (if needed)
   ```bash
   git checkout HEAD~1
   ```

4. **Investigate issues**
   - Check logs
   - Review error messages
   - Test in isolation

## Success Criteria

### All Must Pass
- [x] Migration runs successfully
- [x] Backend starts without errors
- [x] Frontend starts without errors
- [x] Can create behavior records
- [x] Can create interventions
- [x] Records show on student profile
- [x] Edit and delete work
- [x] Filters work
- [x] No console errors
- [x] No security issues
- [x] Performance is acceptable
- [x] Documentation is complete

## Final Sign-Off

### Before Going Live
- [ ] All tests passed
- [ ] Performance is acceptable
- [ ] Security verified
- [ ] Documentation complete
- [ ] Team trained
- [ ] Backup created
- [ ] Rollback plan ready

### Deployment Approval
- [ ] Technical lead approval
- [ ] Product owner approval
- [ ] QA approval
- [ ] Security approval

## Post-Deployment Monitoring

### First 24 Hours
- [ ] Monitor error logs
- [ ] Check database performance
- [ ] Monitor API response times
- [ ] Collect user feedback
- [ ] Watch for issues

### First Week
- [ ] Review usage statistics
- [ ] Analyze performance metrics
- [ ] Gather user feedback
- [ ] Fix any issues
- [ ] Document lessons learned

## Support Plan

### If Users Report Issues
1. **Gather information**
   - What were they trying to do?
   - What error did they see?
   - Can they reproduce it?

2. **Check logs**
   - Backend console
   - Frontend console
   - Database logs

3. **Reproduce issue**
   - Follow their steps
   - Check in different browsers
   - Test with different data

4. **Fix and deploy**
   - Create fix
   - Test thoroughly
   - Deploy update
   - Notify users

## Contact Information

### Technical Support
- Backend issues: Check backend console
- Frontend issues: Check browser console
- Database issues: Check PostgreSQL logs

### Documentation
- Quick Start: QUICK_START_BEHAVIOR_INTERVENTIONS.md
- Full Docs: BEHAVIOR_INTERVENTIONS_IMPLEMENTATION.md
- Testing: TEST_INSTRUCTIONS.md
- Visual Guide: VISUAL_GUIDE.md

---

## ✅ Deployment Complete!

Once all items are checked:
- ✅ System is ready for production
- ✅ Users can start using features
- ✅ Monitoring is in place
- ✅ Support is ready

**Date Deployed**: _______________
**Deployed By**: _______________
**Verified By**: _______________

🎉 **Congratulations! Behavior & Interventions are now live!** 🎉
