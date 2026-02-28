# Test Super Admin Login - Quick Guide

## Prerequisites
- Backend server running on port 5000
- Frontend running on port 5173
- Database connected (PostgreSQL/Supabase)

## Step-by-Step Testing

### 1. Create Super Admin Account
```bash
cd backend
node scripts/seed-super-admin.js
```

**Expected Output**:
```
✅ Super admin seeded successfully
   Email: ngo.superadmin@demo.com
   Password: superadmin123
```

If you see "Super admin already exists", that's fine - the account is ready.

### 2. Test Backend Login API

Open a new terminal and test the login endpoint:

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "ngo.superadmin@demo.com",
    "password": "superadmin123"
  }'
```

**Expected Response**:
```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "...",
    "email": "ngo.superadmin@demo.com",
    "fullName": "NGO Super Admin",
    "role": "super_admin",
    "schoolId": null,
    "status": "approved"
  },
  "school": null
}
```

### 3. Test Frontend Login

1. Open browser: `http://localhost:5173/admin/login`
2. Enter credentials:
   - Email: `ngo.superadmin@demo.com`
   - Password: `superadmin123`
3. Click "Login"

**Expected Result**:
- Redirected to `/admin/dashboard`
- See platform statistics
- Navigation shows super admin menu items

### 4. Test Dropout Management

1. Navigate to: `http://localhost:5173/admin/dropout-management`
2. You should see:
   - Statistics cards (Total Students, Active, Dropped Out, Dropout Rate)
   - Students table with all students
   - "Update Status" button for each student

3. Click "Update Status" on any student
4. Modal should open with:
   - Status dropdown (Active, Dropped Out, Graduated, Transferred)
   - Date field
   - Reason field
   - Notes field

5. Change status to "Dropped Out"
6. Fill in date and reason
7. Click "Update"

**Expected Result**:
- Modal closes
- Table refreshes
- Student status updated
- Statistics recalculated

### 5. Check Backend Logs

In the backend terminal, you should see:
```
🔐 Login attempt for: ngo.superadmin@demo.com
🔍 Looking up user in database...
✅ User found: <user-id> super_admin
🔐 Verifying password...
✅ Password valid
🏫 Fetching school info...
🔑 Generating JWT token...
✅ Login successful for: ngo.superadmin@demo.com
```

When updating dropout status:
```
=== Auth Debug ===
Auth header: Present
Token: eyJhbGciOiJIUzI1NiIs...
✅ Token valid for user: <user-id> role: super_admin
Student <name> status updated: active → dropped_out
```

## Troubleshooting

### Issue: "Super admin already exists"
**Solution**: This is fine! The account is already created. Proceed to step 2.

### Issue: "User not found" or "Invalid credentials"
**Solutions**:
1. Check database connection
2. Verify super admin was created: 
   ```sql
   SELECT * FROM users WHERE role = 'super_admin';
   ```
3. Try creating again with custom credentials:
   ```bash
   SUPER_ADMIN_EMAIL=test@example.com SUPER_ADMIN_PASSWORD=test123 node scripts/seed-super-admin.js
   ```

### Issue: "Access token required" or 401 error
**Solutions**:
1. Clear browser localStorage
2. Login again
3. Check browser console for errors
4. Verify token is being sent in Authorization header

### Issue: "Insufficient permissions" or 403 error
**Solutions**:
1. Verify user role is `super_admin` (check JWT token)
2. Check backend logs for role verification
3. Re-login to get fresh token

### Issue: Redirected to landing page
**Solutions**:
1. Check if token is expired (7 day expiry)
2. Verify token exists in localStorage: `localStorage.getItem('token')`
3. Check browser console for authentication errors
4. Try logging in again

### Issue: Dropout status update fails
**Solutions**:
1. Check backend logs for specific error
2. Verify student exists in database
3. Check user has permission (admin or super_admin)
4. Verify database connection
5. Check PostgreSQL logs for query errors

## Verification Checklist

- [ ] Super admin account created successfully
- [ ] Backend login API returns token
- [ ] Frontend login redirects to dashboard
- [ ] Dashboard shows platform statistics
- [ ] Can access dropout management page
- [ ] Can see students list
- [ ] Can open update status modal
- [ ] Can change student status
- [ ] Status updates successfully
- [ ] Statistics refresh after update
- [ ] Backend logs show success messages

## Database Verification

Check super admin exists:
```sql
SELECT id, email, full_name, role, school_id, status 
FROM users 
WHERE role = 'super_admin';
```

Check dropout tracking fields:
```sql
SELECT id, name, dropout_status, dropout_date, dropout_reason 
FROM students 
LIMIT 5;
```

Check dropout history:
```sql
SELECT * FROM dropout_history 
ORDER BY changed_at DESC 
LIMIT 5;
```

## Success Criteria

✅ Super admin can login
✅ Dashboard loads with statistics
✅ Can access all super admin pages
✅ Can view students list
✅ Can update student dropout status
✅ Changes persist in database
✅ Statistics update correctly
✅ Backend logs show no errors

## Next Steps After Successful Test

1. **Approve School Admins**: Go to Admin Approval page
2. **Manage Schools**: Activate/deactivate schools
3. **Track Outcomes**: Update more student statuses
4. **View Performance**: Check model performance page
5. **Export Data**: Use training data endpoint for ML

## API Testing with Postman/Insomnia

### 1. Login
```
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "ngo.superadmin@demo.com",
  "password": "superadmin123"
}
```

### 2. Get Platform Stats
```
GET http://localhost:5000/api/super-admin/platform-stats
Authorization: Bearer <token-from-login>
```

### 3. Update Dropout Status
```
POST http://localhost:5000/api/dropout/update-status
Authorization: Bearer <token-from-login>
Content-Type: application/json

{
  "studentId": "<student-id>",
  "dropoutStatus": "dropped_out",
  "dropoutDate": "2024-03-01",
  "dropoutReason": "Financial difficulties",
  "dropoutNotes": "Family unable to afford fees"
}
```

### 4. Get Dropout Statistics
```
GET http://localhost:5000/api/dropout/statistics
Authorization: Bearer <token-from-login>
```

## Common Error Messages

| Error | Meaning | Solution |
|-------|---------|----------|
| "Access token required" | No token in request | Login and include token |
| "Invalid or expired token" | Token is invalid/expired | Login again |
| "Insufficient permissions" | Wrong role | Use super_admin account |
| "Student not found" | Invalid student ID | Check student exists |
| "Missing required fields" | Incomplete request | Include all required fields |
| "Invalid dropout status" | Wrong status value | Use: active, dropped_out, graduated, transferred |

## Support

If issues persist:
1. Check backend logs for detailed errors
2. Verify database schema is up to date
3. Run migrations if needed
4. Check environment variables are set
5. Restart backend and frontend servers
