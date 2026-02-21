# Authentication System - Complete Documentation

## Table of Contents
1. [Overview](#overview)
2. [Features](#features)
3. [Architecture](#architecture)
4. [User Flows](#user-flows)
5. [API Reference](#api-reference)
6. [Security](#security)
7. [Usage Guide](#usage-guide)
8. [Troubleshooting](#troubleshooting)

---

## Overview

The Authentication System provides secure user registration, login, and role-based access control for the education management platform. It supports multiple user roles (Admin, Teacher) with different registration and approval workflows.

### Key Features
- ✅ Admin registration (self-service)
- ✅ Teacher registration with approval workflow
- ✅ JWT-based authentication
- ✅ Role-based access control (RBAC)
- ✅ Password hashing (bcrypt)
- ✅ Token validation middleware
- ✅ Session management
- ✅ School-based data isolation

---

## Features

### 1. User Roles

#### Admin
- **Registration**: Self-service, creates school automatically
- **Permissions**: Full access to school data
- **Capabilities**:
  - Approve/reject teacher registrations
  - Manage classes, subjects, students
  - View all reports and analytics
  - Configure school settings

#### Teacher
- **Registration**: Requires admin approval
- **Permissions**: Limited to assigned classes/subjects
- **Capabilities**:
  - Mark attendance for assigned classes
  - View student information
  - Enter performance data
  - View assigned class reports

### 2. Registration Workflows

#### Admin Registration Flow
```
1. User fills registration form
   ↓
2. System creates school
   ↓
3. System creates admin user
   ↓
4. Admin can login immediately
   ↓
5. Admin dashboard access
```

#### Teacher Registration Flow
```
1. Teacher fills registration form
   ↓
2. System creates pending request
   ↓
3. Teacher status: "pending"
   ↓
4. Admin reviews request
   ↓
5. Admin approves/rejects
   ↓
6. If approved: Teacher can login
   ↓
7. Teacher dashboard access
```

### 3. Authentication Flow

```
1. User enters credentials
   ↓
2. System validates credentials
   ↓
3. System generates JWT token
   ↓
4. Token stored in localStorage/sessionStorage
   ↓
5. Token sent with each API request
   ↓
6. Middleware validates token
   ↓
7. Request processed if valid
```

### 4. Authorization

#### Token Structure
```json
{
  "userId": "user-123",
  "email": "user@example.com",
  "role": "teacher",
  "schoolId": "school-456",
  "iat": 1708531200,
  "exp": 1708617600
}
```

#### Protected Routes
- All `/api/*` routes except `/api/auth/login` and `/api/auth/register/*`
- Middleware checks for valid JWT token
- Extracts user info from token
- Validates school access

---

## Architecture

### Backend Components

```
backend/
├── controllers/
│   └── authController.js          # Authentication handlers
├── middleware/
│   └── auth.js                    # JWT validation middleware
├── routes/
│   └── authRoutes.js              # Auth route definitions
└── storage/
    └── dataStore.js               # User data storage
```

### Frontend Components

```
proactive-education-assistant/src/
├── pages/
│   ├── LoginPage.jsx              # Login UI
│   ├── AdminRegistrationPage.jsx # Admin registration
│   └── TeacherRegistrationPage.jsx # Teacher registration
├── services/
│   └── apiService.js              # Auth API client
└── components/
    └── ProtectedRoute.jsx         # Route protection
```

### Database Schema

```sql
CREATE TABLE users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  fullName TEXT NOT NULL,
  role TEXT NOT NULL,              -- 'admin', 'teacher'
  schoolId TEXT NOT NULL,
  status TEXT NOT NULL,            -- 'active', 'pending', 'rejected'
  phone TEXT,
  address TEXT,
  createdAt TEXT NOT NULL,
  updatedAt TEXT NOT NULL
);

CREATE TABLE schools (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  address TEXT,
  phone TEXT,
  email TEXT,
  adminId TEXT NOT NULL,
  createdAt TEXT NOT NULL,
  updatedAt TEXT NOT NULL
);

CREATE TABLE approval_requests (
  id TEXT PRIMARY KEY,
  userId TEXT NOT NULL,
  requestType TEXT NOT NULL,       -- 'teacher_registration'
  status TEXT NOT NULL,            -- 'pending', 'approved', 'rejected'
  requestData TEXT,                -- JSON with additional data
  reviewedBy TEXT,
  reviewedAt TEXT,
  comments TEXT,
  createdAt TEXT NOT NULL
);
```

---

## User Flows

### Admin Registration

#### Frontend Flow
1. User navigates to `/register/admin`
2. Fills form:
   - Full Name
   - Email
   - Password
   - School Name
   - School Address
   - Phone
3. Submits form
4. Redirected to login page
5. Logs in with credentials
6. Accesses admin dashboard

#### Backend Flow
1. Receives registration request
2. Validates input data
3. Checks if email already exists
4. Hashes password with bcrypt
5. Creates school record
6. Creates admin user record
7. Returns success response

### Teacher Registration

#### Frontend Flow
1. User navigates to `/register/teacher`
2. Selects school from dropdown
3. Fills form:
   - Full Name
   - Email
   - Password
   - Phone
   - Address
4. Submits form
5. Sees "Pending Approval" message
6. Waits for admin approval
7. Receives notification (future feature)
8. Logs in after approval

#### Backend Flow
1. Receives registration request
2. Validates input data
3. Checks if email already exists
4. Hashes password with bcrypt
5. Creates teacher user with status "pending"
6. Creates approval request record
7. Returns success response

### Teacher Approval

#### Frontend Flow (Admin)
1. Admin logs in
2. Navigates to "Approvals" page
3. Sees list of pending requests
4. Reviews teacher details
5. Clicks "Approve" or "Reject"
6. Optionally assigns classes
7. Sees confirmation message

#### Backend Flow
1. Receives approval/rejection request
2. Validates admin permissions
3. Updates user status to "active" or "rejected"
4. Updates approval request status
5. If approved: Assigns classes (optional)
6. Returns success response

### Login

#### Frontend Flow
1. User navigates to `/login`
2. Enters email and password
3. Submits form
4. Token stored in localStorage
5. Redirected to dashboard
6. Dashboard loads user data

#### Backend Flow
1. Receives login request
2. Finds user by email
3. Compares password with bcrypt
4. Checks user status (must be "active")
5. Generates JWT token
6. Returns token and user data

---

## API Reference

### Register Admin

**Endpoint**: `POST /api/auth/register/admin`

**Request Body**:
```json
{
  "fullName": "John Doe",
  "email": "admin@school.com",
  "password": "securePassword123",
  "schoolName": "Springfield High School",
  "schoolAddress": "123 Main St, Springfield",
  "phone": "+1234567890"
}
```

**Response** (201 Created):
```json
{
  "success": true,
  "message": "Admin registered successfully",
  "user": {
    "id": "user-123",
    "email": "admin@school.com",
    "fullName": "John Doe",
    "role": "admin",
    "schoolId": "school-456"
  },
  "school": {
    "id": "school-456",
    "name": "Springfield High School"
  }
}
```

**Error Responses**:
- 400: Validation error (missing fields, invalid email)
- 409: Email already exists

---

### Register Teacher

**Endpoint**: `POST /api/auth/register/teacher`

**Request Body**:
```json
{
  "fullName": "Jane Smith",
  "email": "teacher@school.com",
  "password": "securePassword123",
  "schoolId": "school-456",
  "phone": "+1234567890",
  "address": "456 Oak Ave, Springfield"
}
```

**Response** (201 Created):
```json
{
  "success": true,
  "message": "Teacher registration submitted. Awaiting admin approval.",
  "user": {
    "id": "user-789",
    "email": "teacher@school.com",
    "fullName": "Jane Smith",
    "role": "teacher",
    "status": "pending",
    "schoolId": "school-456"
  }
}
```

**Error Responses**:
- 400: Validation error
- 404: School not found
- 409: Email already exists

---

### Login

**Endpoint**: `POST /api/auth/login`

**Request Body**:
```json
{
  "email": "admin@school.com",
  "password": "securePassword123"
}
```

**Response** (200 OK):
```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "user-123",
    "email": "admin@school.com",
    "fullName": "John Doe",
    "role": "admin",
    "schoolId": "school-456"
  }
}
```

**Error Responses**:
- 400: Missing credentials
- 401: Invalid credentials
- 403: Account pending approval or rejected

---

### Get Current User

**Endpoint**: `GET /api/auth/me`

**Headers**:
```
Authorization: Bearer <token>
```

**Response** (200 OK):
```json
{
  "success": true,
  "user": {
    "id": "user-123",
    "email": "admin@school.com",
    "fullName": "John Doe",
    "role": "admin",
    "schoolId": "school-456",
    "status": "active"
  }
}
```

**Error Responses**:
- 401: Invalid or expired token
- 404: User not found

---

### Get Pending Requests (Admin Only)

**Endpoint**: `GET /api/approvals/pending`

**Headers**:
```
Authorization: Bearer <admin-token>
```

**Response** (200 OK):
```json
{
  "success": true,
  "requests": [
    {
      "id": "request-123",
      "userId": "user-789",
      "fullName": "Jane Smith",
      "email": "teacher@school.com",
      "phone": "+1234567890",
      "address": "456 Oak Ave",
      "status": "pending",
      "createdAt": "2026-02-20T10:00:00Z"
    }
  ]
}
```

---

### Approve Teacher (Admin Only)

**Endpoint**: `POST /api/approvals/approve/:teacherId`

**Headers**:
```
Authorization: Bearer <admin-token>
```

**Request Body** (Optional):
```json
{
  "classIds": ["class-123", "class-456"]
}
```

**Response** (200 OK):
```json
{
  "success": true,
  "message": "Teacher approved successfully",
  "user": {
    "id": "user-789",
    "status": "active"
  }
}
```

---

### Reject Teacher (Admin Only)

**Endpoint**: `POST /api/approvals/reject/:teacherId`

**Headers**:
```
Authorization: Bearer <admin-token>
```

**Response** (200 OK):
```json
{
  "success": true,
  "message": "Teacher rejected"
}
```

---

## Security

### Password Security

#### Hashing
- Uses bcrypt with salt rounds: 10
- Passwords never stored in plain text
- One-way hashing (cannot be reversed)

```javascript
const hashedPassword = await bcrypt.hash(password, 10);
```

#### Validation
- Minimum length: 6 characters (configurable)
- Compared using bcrypt.compare()

```javascript
const isValid = await bcrypt.compare(password, hashedPassword);
```

### JWT Tokens

#### Token Generation
```javascript
const token = jwt.sign(
  {
    userId: user.id,
    email: user.email,
    role: user.role,
    schoolId: user.schoolId
  },
  process.env.JWT_SECRET,
  { expiresIn: '24h' }
);
```

#### Token Validation
```javascript
const decoded = jwt.verify(token, process.env.JWT_SECRET);
```

#### Token Storage
- Frontend: localStorage or sessionStorage
- Sent in Authorization header: `Bearer <token>`
- Automatically included in all API requests

### Authorization Middleware

```javascript
export const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};
```

### Role-Based Access Control

```javascript
export const requireAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
};
```

### School Isolation

All data queries filtered by schoolId:
```javascript
const classes = dataStore.getClasses().filter(
  c => c.schoolId === req.user.schoolId
);
```

---

## Usage Guide

### For Administrators

#### 1. Register as Admin
1. Navigate to registration page
2. Fill in school and admin details
3. Submit form
4. Login with credentials
5. Access admin dashboard

#### 2. Approve Teachers
1. Login to admin dashboard
2. Click "Approvals" in sidebar
3. Review pending teacher requests
4. Click "Approve" for valid requests
5. Optionally assign classes
6. Teacher can now login

#### 3. Manage Users
1. View all teachers in "Teachers" section
2. Edit teacher details if needed
3. Assign/unassign classes
4. Deactivate users if necessary

### For Teachers

#### 1. Register as Teacher
1. Navigate to teacher registration
2. Select your school
3. Fill in personal details
4. Submit form
5. Wait for admin approval
6. Check email for approval notification (future)

#### 2. Login After Approval
1. Navigate to login page
2. Enter email and password
3. Access teacher dashboard
4. View assigned classes

---

## Troubleshooting

### Issue: "Email already exists"

**Cause**: Email is already registered in the system

**Solution**: 
- Use a different email address
- If you forgot password, use password reset (future feature)
- Contact admin if you believe this is an error

---

### Issue: "Account pending approval"

**Cause**: Teacher account not yet approved by admin

**Solution**:
- Wait for admin to review your request
- Contact school admin to expedite approval
- Check spam folder for approval email (future)

---

### Issue: "Invalid credentials"

**Cause**: Incorrect email or password

**Solution**:
- Double-check email and password
- Ensure caps lock is off
- Try password reset (future feature)
- Contact admin if issue persists

---

### Issue: "Token expired"

**Cause**: JWT token has expired (24 hours)

**Solution**:
- Logout and login again
- Token will be refreshed automatically
- Consider implementing refresh tokens (future)

---

### Issue: "Access denied"

**Cause**: Insufficient permissions for the requested action

**Solution**:
- Verify your role (admin vs teacher)
- Check if you have access to the resource
- Contact admin for permission changes

---

## Best Practices

### For Development

1. **Never commit JWT_SECRET**: Use environment variables
2. **Use HTTPS in production**: Protect tokens in transit
3. **Implement rate limiting**: Prevent brute force attacks
4. **Log authentication attempts**: Monitor for suspicious activity
5. **Validate all inputs**: Prevent injection attacks

### For Deployment

1. **Strong JWT_SECRET**: Use long, random string
2. **Short token expiration**: Balance security and UX
3. **Implement refresh tokens**: Avoid frequent re-logins
4. **Enable CORS properly**: Restrict to known origins
5. **Monitor failed logins**: Alert on suspicious patterns

### For Users

1. **Strong passwords**: Use mix of characters
2. **Unique passwords**: Don't reuse across sites
3. **Logout when done**: Especially on shared devices
4. **Report suspicious activity**: Contact admin immediately
5. **Keep credentials private**: Never share passwords

---

## Future Enhancements

### Planned Features
- [ ] Password reset via email
- [ ] Two-factor authentication (2FA)
- [ ] Social login (Google, Microsoft)
- [ ] Refresh token mechanism
- [ ] Email verification
- [ ] Account lockout after failed attempts
- [ ] Password strength meter
- [ ] Session management dashboard
- [ ] Audit logs for authentication events

### Technical Improvements
- [ ] OAuth 2.0 implementation
- [ ] Redis for session storage
- [ ] Rate limiting per user
- [ ] IP-based restrictions
- [ ] Device fingerprinting
- [ ] Biometric authentication support

---

## Version History

### v1.0.0 (Current)
- ✅ Admin registration
- ✅ Teacher registration with approval
- ✅ JWT authentication
- ✅ Role-based access control
- ✅ Password hashing
- ✅ Token validation middleware
- ✅ School-based isolation

---

**Last Updated**: February 21, 2026  
**Status**: Production Ready ✅
