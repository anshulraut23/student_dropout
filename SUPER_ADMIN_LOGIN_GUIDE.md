# Super Admin Login Guide

## Quick Start

### Default Credentials
- **Email**: `ngo.superadmin@demo.com`
- **Password**: `superadmin123`
- **Login URL**: `http://localhost:5173/admin/login`

## How to Create Super Admin Account

### Method 1: Run Seeding Script (Recommended)
```bash
cd backend
node scripts/seed-super-admin.js
```

This will create a super admin account with the default credentials above.

### Method 2: Custom Credentials
Set environment variables before running the script:

```bash
# In backend/.env
SUPER_ADMIN_EMAIL=your-email@example.com
SUPER_ADMIN_PASSWORD=your-secure-password
SUPER_ADMIN_NAME=Your Name
```

Then run:
```bash
cd backend
node scripts/seed-super-admin.js
```

## Login Process

1. **Navigate to Admin Login Page**
   - URL: `http://localhost:5173/admin/login`
   - Or click "Admin Login" from the landing page

2. **Enter Credentials**
   - Email: `ngo.superadmin@demo.com`
   - Password: `superadmin123`

3. **Access Super Admin Dashboard**
   - After successful login, you'll be redirected to `/admin/dashboard`
   - Super admin has access to all platform features

## Super Admin Capabilities

### 1. Platform Statistics
- View total schools, teachers, students
- Monitor high-risk students across all schools
- Track active interventions platform-wide

### 2. School Management
- View all registered schools
- Activate/deactivate schools
- View school-specific statistics
- Monitor school performance

### 3. Admin Approval
- Review pending admin registration requests
- Approve or reject school admin accounts
- View all school admins

### 4. Dropout Management
- Track student dropout outcomes across all schools
- Update student status (active, dropped_out, graduated, transferred)
- View dropout statistics and trends
- Export training data for ML model

### 5. Model Performance
- View ML model accuracy metrics
- Track model performance over time
- Monitor prediction reliability

## Super Admin Routes

All super admin routes are protected and require `super_admin` role:

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

## Troubleshooting

### Issue: "Invalid credentials"
- **Solution**: Make sure you've run the seeding script first
- Check that you're using the correct email and password
- Verify the super admin exists in the database

### Issue: "Account pending approval"
- **Solution**: This error shouldn't appear for super admin
- Super admin accounts are automatically approved
- If you see this, the account might not have `super_admin` role

### Issue: Can't access super admin pages
- **Solution**: Check that you're logged in with super admin credentials
- Verify the JWT token includes `role: 'super_admin'`
- Clear browser cache and login again

### Issue: Redirected to landing page
- **Solution**: This happens when authentication fails
- Make sure you're logged in
- Check that the token hasn't expired (7 day expiry)
- Try logging in again

## Database Schema

Super admin users have these characteristics:
- `role`: `'super_admin'`
- `school_id`: `NULL` (not associated with any specific school)
- `status`: `'approved'` (automatically approved)

## Security Notes

1. **Change Default Password**: In production, always change the default password
2. **Secure Storage**: Store credentials securely, never commit to version control
3. **Token Expiry**: JWT tokens expire after 7 days
4. **Role-Based Access**: All super admin routes check for `super_admin` role
5. **HTTPS**: Always use HTTPS in production

## Environment Variables

```env
# Super Admin Configuration
SUPER_ADMIN_EMAIL=ngo.superadmin@demo.com
SUPER_ADMIN_PASSWORD=superadmin123
SUPER_ADMIN_NAME=NGO Super Admin

# JWT Configuration
JWT_SECRET=your-secure-jwt-secret
```

## Next Steps After Login

1. **Approve Pending Admins**: Go to Admin Approval page
2. **Review Schools**: Check school statistics and performance
3. **Monitor High-Risk Students**: View students needing intervention
4. **Track Dropouts**: Update student outcomes for ML training
5. **Check Model Performance**: Review prediction accuracy

## Support

If you encounter issues:
1. Check backend logs for error messages
2. Verify database connection
3. Ensure all migrations have run
4. Check that super admin role is properly configured in database constraints
