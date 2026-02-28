# Super Admin Login & Dropout Tracking Fixes

## Issues Fixed

### 1. Super Admin Login Information
**Problem**: User didn't know how to login as super admin

**Solution**: Created comprehensive guide with:
- Default credentials: `ngo.superadmin@demo.com` / `superadmin123`
- Login URL: `http://localhost:5173/admin/login`
- How to create super admin account
- All super admin capabilities and routes
- Troubleshooting guide

**Files Created**:
- `SUPER_ADMIN_LOGIN_GUIDE.md` - Complete documentation

### 2. Dropout Tracking PostgreSQL Type Casting Error
**Problem**: 
```
error: inconsistent types deduced for parameter $1
detail: text versus character varying
```

**Root Cause**: PostgreSQL couldn't infer parameter types in the UPDATE query with CASE statement

**Solution**: Added explicit type casting to the UPDATE query:
```sql
UPDATE students 
SET 
  dropout_status = $1::VARCHAR,
  dropout_date = $2::DATE,
  dropout_reason = $3::TEXT,
  dropout_notes = $4::TEXT,
  status = CASE 
    WHEN $1 = 'active' THEN 'active'
    ELSE 'inactive'
  END
WHERE id = $5 AND school_id = $6
```

**Files Modified**:
- `backend/controllers/dropoutTrackingController.js` - Fixed type casting in updateDropoutStatus method

### 3. Frontend Import Error
**Problem**: 
```
The requested module '/src/services/apiService.js' does not provide an export named 'apiService'
```

**Root Cause**: DropoutManagementPage was using named import but apiService is a default export

**Current State**: Already fixed in previous conversation (using default import)

### 4. Array Safety Check
**Problem**: `students.map is not a function`

**Root Cause**: API response structure inconsistency

**Current State**: Already fixed with safety checks:
```javascript
const studentsData = Array.isArray(studentsRes) ? studentsRes : (studentsRes.students || []);
```

## How to Use Super Admin

### Step 1: Create Super Admin Account
```bash
cd backend
node scripts/seed-super-admin.js
```

Output:
```
✅ Super admin seeded successfully
   Email: ngo.superadmin@demo.com
   Password: superadmin123
```

### Step 2: Login
1. Navigate to `http://localhost:5173/admin/login`
2. Enter credentials:
   - Email: `ngo.superadmin@demo.com`
   - Password: `superadmin123`
3. Click "Login"

### Step 3: Access Super Admin Features
After login, you'll have access to:

1. **Platform Statistics** (`/admin/dashboard`)
   - Total schools, teachers, students
   - High-risk students across platform
   - Active interventions

2. **School Management** (`/admin/schools`)
   - View all schools
   - Activate/deactivate schools
   - View school statistics

3. **Admin Approval** (`/admin/admin-requests`)
   - Review pending admin registrations
   - Approve or reject school admins

4. **Dropout Management** (`/admin/dropout-management`)
   - Track student outcomes
   - Update dropout status
   - View statistics

5. **Model Performance** (`/admin/model-performance`)
   - View ML model accuracy
   - Track performance over time

## Dropout Tracking Workflow

### Update Student Status

1. **Navigate to Dropout Management**
   - URL: `/admin/dropout-management`
   - Shows all students with current status

2. **Click "Update Status"** on any student

3. **Select New Status**:
   - `active` - Student is currently enrolled
   - `dropped_out` - Student has left school
   - `graduated` - Student completed education
   - `transferred` - Student moved to another school

4. **Fill Additional Fields** (if not active):
   - Date: When the status change occurred
   - Reason: Why the student left (e.g., "Financial issues")
   - Notes: Additional details

5. **Click "Update"**

### What Happens Behind the Scenes

1. **Database Update**:
   - Updates `students` table with new status
   - Records change in `dropout_history` table
   - Updates student's `status` field (active/inactive)

2. **ML Training Data**:
   - Dropout outcomes are used for model training
   - Real data improves prediction accuracy
   - Training data includes attendance, marks, behavior

3. **Statistics Update**:
   - Dropout rate recalculated
   - Recent dropouts list updated
   - Status counts refreshed

## API Endpoints

### Super Admin Routes
```
GET  /api/super-admin/platform-stats
GET  /api/super-admin/schools
GET  /api/super-admin/admins
GET  /api/super-admin/admin-requests/pending
POST /api/super-admin/admin-requests/:adminId/approve
POST /api/super-admin/admin-requests/:adminId/reject
PATCH /api/super-admin/schools/:schoolId/status
GET  /api/super-admin/schools/:schoolId/summary
GET  /api/super-admin/schools/:schoolId/updates
GET  /api/super-admin/schools/:schoolId/high-risk-students
```

### Dropout Tracking Routes
```
POST /api/dropout/update-status
GET  /api/dropout/statistics
GET  /api/dropout/history/:studentId
GET  /api/dropout/training-data
POST /api/dropout/model-performance
GET  /api/dropout/model-performance
```

## Authentication Flow

### Super Admin Login
1. User submits email/password to `/api/auth/login`
2. Backend verifies credentials
3. Checks user role is `super_admin`
4. Generates JWT token with:
   ```javascript
   {
     userId: user.id,
     email: user.email,
     role: 'super_admin',
     schoolId: null  // Super admin not tied to specific school
   }
   ```
5. Returns token to frontend
6. Frontend stores token in localStorage
7. All subsequent requests include token in Authorization header

### Protected Routes
All super admin routes use middleware:
```javascript
router.use(authenticateToken, requireRole('super_admin'));
```

This ensures:
- Valid JWT token is present
- Token hasn't expired (7 day expiry)
- User has `super_admin` role
- School is active (if applicable)

## Troubleshooting

### Issue: Can't login as super admin
**Check**:
1. Super admin account exists: `node backend/scripts/seed-super-admin.js`
2. Using correct credentials: `ngo.superadmin@demo.com` / `superadmin123`
3. Backend is running: `npm start` in backend folder
4. Database is connected: Check backend logs

### Issue: Dropout status update fails
**Check**:
1. User is authenticated (token present)
2. User has permission (admin or super_admin role)
3. Student exists in database
4. School ID matches user's school (or super admin)
5. Backend logs for specific error

### Issue: Redirected to landing page
**Check**:
1. Token is valid (not expired)
2. Token includes correct role
3. Browser localStorage has token
4. No CORS issues (check browser console)

## Database Schema

### Super Admin User
```sql
{
  id: '1234567890-abc123',
  email: 'ngo.superadmin@demo.com',
  password: '<hashed>',
  full_name: 'NGO Super Admin',
  role: 'super_admin',
  school_id: NULL,  -- Not tied to specific school
  status: 'approved',
  created_at: '2024-01-01T00:00:00Z'
}
```

### Dropout Tracking Fields
```sql
-- students table
dropout_status VARCHAR(20) DEFAULT 'active'
dropout_date DATE
dropout_reason TEXT
dropout_notes TEXT
last_attendance_date DATE

-- dropout_history table
id VARCHAR(50) PRIMARY KEY
student_id VARCHAR(50)
school_id VARCHAR(50)
previous_status VARCHAR(20)
new_status VARCHAR(20)
dropout_date DATE
dropout_reason TEXT
dropout_notes TEXT
changed_by VARCHAR(50)
changed_at TIMESTAMP DEFAULT NOW()
```

## Next Steps

1. **Login as Super Admin**
   - Use default credentials
   - Explore dashboard

2. **Approve Pending Admins**
   - Go to Admin Approval page
   - Review and approve school admins

3. **Track Student Outcomes**
   - Update dropout status for students
   - Provide real data for ML training

4. **Monitor Model Performance**
   - Check prediction accuracy
   - Review training metrics

5. **Manage Schools**
   - Activate/deactivate schools
   - View school statistics

## Security Notes

1. **Change Default Password**: Always change in production
2. **Secure JWT Secret**: Use strong secret in production
3. **HTTPS Only**: Never use HTTP in production
4. **Token Expiry**: Tokens expire after 7 days
5. **Role-Based Access**: All routes check permissions
6. **School Deactivation**: Deactivated schools can't login

## Files Modified

1. `backend/controllers/dropoutTrackingController.js`
   - Fixed PostgreSQL type casting in UPDATE query
   - Added explicit ::VARCHAR, ::DATE, ::TEXT casts

2. `SUPER_ADMIN_LOGIN_GUIDE.md` (NEW)
   - Complete super admin documentation
   - Login instructions
   - Capabilities and routes
   - Troubleshooting guide

3. `SUPER_ADMIN_AND_DROPOUT_FIXES.md` (NEW)
   - Summary of all fixes
   - Workflow documentation
   - API endpoints
   - Troubleshooting

## Testing

### Test Super Admin Login
```bash
# 1. Create super admin
cd backend
node scripts/seed-super-admin.js

# 2. Start backend
npm start

# 3. Start frontend (in another terminal)
cd proactive-education-assistant
npm run dev

# 4. Open browser
# Navigate to http://localhost:5173/admin/login
# Login with: ngo.superadmin@demo.com / superadmin123
```

### Test Dropout Tracking
```bash
# 1. Login as super admin or school admin
# 2. Navigate to /admin/dropout-management
# 3. Click "Update Status" on any student
# 4. Change status to "dropped_out"
# 5. Fill date and reason
# 6. Click "Update"
# 7. Verify status updated in table
# 8. Check backend logs for success message
```

## Summary

All issues have been resolved:
1. ✅ Super admin login documented with default credentials
2. ✅ PostgreSQL type casting error fixed in dropout controller
3. ✅ Frontend import errors already fixed
4. ✅ Array safety checks already in place
5. ✅ Complete documentation created

The system is now ready for:
- Super admin login and management
- Dropout tracking with real outcomes
- ML model training with actual data
- School and admin management
