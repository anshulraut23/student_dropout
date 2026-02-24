# Quick Start: Behavior & Interventions

## 🚀 Get Started in 3 Steps

### Step 1: Run Database Migration
```bash
cd backend
node run-behavior-intervention-migration.js
```

Expected output:
```
🔄 Starting behavior and interventions migration...
✅ Migration completed successfully!

Created:
  - behavior table
  - Updated interventions table with new fields
  - Added indexes for performance
```

### Step 2: Start Backend Server
```bash
cd backend
npm start
```

The server should show:
```
✅ PostgreSQL connected successfully
Server running on port 5000
```

### Step 3: Test the Features

#### Test Behavior Tab
1. Open browser: `http://localhost:5173/data-entry`
2. Click "Behaviour" tab
3. Select a class and student
4. Fill in the form:
   - Behavior Type: Positive or Negative
   - Category: e.g., "Participation"
   - Severity: Low/Medium/High
   - Description: "Student actively participated in class discussion"
5. Click "Save Observation"
6. ✅ You should see success message

#### Test Interventions Tab
1. Stay on Data Entry page
2. Click "Interventions" tab
3. Click "Add Intervention"
4. Fill in the form:
   - Class & Student
   - Type: e.g., "Academic Support"
   - Priority: Medium
   - Title: "Math tutoring plan"
   - Description: "Student needs extra help with algebra"
   - Action Plan: "Weekly 1-on-1 sessions"
5. Click "Create Intervention"
6. ✅ You should see success message

#### View on Student Profile
1. Go to Students page
2. Click on any student
3. Click "Behavior" tab
   - ✅ Should see all behavior records
4. Click "Interventions" tab
   - ✅ Should see all intervention plans

## 🔍 Verify Everything Works

Run the test script:
```bash
cd backend
node test-behavior-interventions.js
```

Expected output:
```
🧪 Testing Behavior and Interventions Implementation

✅ Database connection established

📋 Test 1: Checking behavior methods...
  ✅ addBehavior exists
  ✅ getBehaviors exists
  ✅ getBehaviorById exists
  ✅ updateBehavior exists
  ✅ deleteBehavior exists

📋 Test 2: Checking intervention methods...
  ✅ addIntervention exists
  ✅ getInterventions exists
  ✅ getInterventionById exists
  ✅ updateIntervention exists
  ✅ deleteIntervention exists

📋 Test 3: Testing getBehaviors...
  ✅ getBehaviors works - found 0 records

📋 Test 4: Testing getInterventions...
  ✅ getInterventions works - found 0 records

🎉 All tests completed!
```

## ❓ Troubleshooting

### Migration Error: "relation already exists"
This is OK! It means the tables already exist. The migration is safe to run multiple times.

### API Error: "Failed to load resource"
- Check backend is running on port 5000
- Check frontend .env has correct API_URL
- Check browser console for details

### "Student does not belong to your school"
- Make sure you're logged in as a teacher
- Select a student from your assigned classes

### No students showing in dropdown
- Make sure you selected a class first
- Check that the class has students assigned

## 📊 What You Can Do Now

### Behavior Tracking
- ✅ Record positive behaviors (praise, achievements)
- ✅ Record negative behaviors (issues, concerns)
- ✅ Set severity levels
- ✅ Track follow-ups
- ✅ View history on student profile

### Interventions
- ✅ Create intervention plans
- ✅ Set priorities (low/medium/high/urgent)
- ✅ Track status (planned/in-progress/completed)
- ✅ Define action plans
- ✅ Set target dates
- ✅ View on student profile

### Student Profile
- ✅ View all behavior records
- ✅ View all interventions
- ✅ See quick stats
- ✅ Add new records directly

## 🎯 Next Steps

1. **Add some test data**
   - Record a few behaviors
   - Create a couple interventions
   - View them on student profiles

2. **Explore the features**
   - Try different behavior types
   - Test different priorities
   - Update intervention status

3. **Customize as needed**
   - Add more behavior categories
   - Add more intervention types
   - Adjust severity levels

## 📞 Need Help?

Check these files:
- `BEHAVIOR_INTERVENTIONS_IMPLEMENTATION.md` - Full documentation
- Backend console - Error messages
- Browser console - Frontend errors
- Network tab - API request/response

---

**Ready to go!** 🎉 Start recording behaviors and creating interventions!
