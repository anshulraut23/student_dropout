# Backend Integration Guide

This document explains how the frontend connects to the backend API.

## Setup

1. **Create environment file:**
```bash
cp .env.example .env
```

2. **Configure API URL in `.env`:**
```
VITE_API_URL=http://localhost:5000/api
```

3. **Start the backend server:**
```bash
cd ../backend
npm install
cp .env.example .env
# Edit .env and set JWT_SECRET
npm run dev
```

4. **Start the frontend:**
```bash
npm run dev
```

## API Service

The `apiService.js` handles all backend communication:

### Location
`src/services/apiService.js`

### Features
- Centralized API calls
- Automatic token management
- Error handling
- Request/response formatting

### Available Methods

#### Authentication
```javascript
// Admin registration
await apiService.registerAdmin({
  fullName, email, password,
  schoolName, schoolAddress, schoolCity, schoolState, schoolPhone
});

// Teacher registration
await apiService.registerTeacher({
  fullName, email, password, schoolId
});

// Login
await apiService.login(email, password);

// Get current user
await apiService.getCurrentUser();
```

#### Schools
```javascript
// Get all schools (for dropdown)
await apiService.getSchools();

// Get school by ID
await apiService.getSchoolById(schoolId);
```

#### Approvals (Admin only)
```javascript
// Get pending teacher requests
await apiService.getPendingRequests();

// Approve teacher
await apiService.approveTeacher(teacherId, classIds);

// Reject teacher
await apiService.rejectTeacher(teacherId);
```

## Updated Components

### 1. Login Component
**File:** `src/components/auth/login.jsx`

**Changes:**
- Replaced `simulateLoginRequest` with `apiService.login`
- Uses real backend authentication
- Handles API errors properly

**Usage:**
```javascript
const response = await apiService.login(email, password);
// Response includes: token, user, school
```

### 2. Register Component
**File:** `src/components/auth/register.jsx`

**Changes:**
- Fetches real schools from backend for dropdown
- Uses `apiService.registerAdmin` for admin registration
- Uses `apiService.registerTeacher` for teacher registration
- Shows proper success/error messages

**Teacher Registration Flow:**
1. User selects "Teacher" role
2. Component fetches schools from backend
3. User selects school from dropdown
4. Registration creates pending request
5. User redirected to login with message

**Admin Registration Flow:**
1. User selects "Admin" role
2. User fills school details
3. Registration creates school and admin user
4. User automatically logged in and redirected

### 3. Approval Dashboard
**File:** `src/components/admin/ApprovalDashboard.jsx`

**New Component** for admin to manage teacher requests.

**Features:**
- Lists all pending teacher requests
- Approve button with class assignment
- Reject button with confirmation
- Real-time updates after approval/rejection
- Loading and error states

**Usage:**
Add to admin routes:
```javascript
import ApprovalDashboard from '../components/admin/ApprovalDashboard';

<Route path="/admin/approvals" element={<ApprovalDashboard />} />
```

### 4. Approval Service
**File:** `src/services/approvalService.js`

**Changes:**
- Now uses `apiService` for backend calls
- Maintains same interface for backward compatibility
- Added `getPendingRequests` method

## Authentication Flow

### Admin Registration & Login
```
User → Register Form → apiService.registerAdmin() → Backend
                                                      ↓
                                                   Creates School
                                                   Creates Admin User
                                                   Returns JWT Token
                                                      ↓
Frontend ← Token Stored ← Response ← Backend
    ↓
Redirect to Admin Dashboard
```

### Teacher Registration & Approval
```
User → Register Form → Fetch Schools → apiService.getSchools()
                            ↓
                    Select School
                            ↓
                    apiService.registerTeacher()
                            ↓
                    Backend Creates:
                    - Teacher User (status: pending)
                    - Approval Request
                            ↓
                    Success Message
                            ↓
                    Redirect to Login
                            ↓
Admin → Approval Dashboard → apiService.getPendingRequests()
                            ↓
                    View Pending Teachers
                            ↓
                    Approve/Reject
                            ↓
                    apiService.approveTeacher() / rejectTeacher()
                            ↓
                    Teacher Status Updated
                            ↓
Teacher → Login → apiService.login()
                            ↓
                    Check Status
                            ↓
                    If Approved: Success
                    If Pending: Error Message
                    If Rejected: Error Message
```

## Token Management

### Storage
- Tokens stored in `localStorage` or `sessionStorage` based on "Remember Me"
- Token automatically included in authenticated requests

### Format
```javascript
// Stored in localStorage/sessionStorage
{
  token: "jwt-token-here",
  role: "admin" | "teacher",
  school_id: "school-id",
  school_name: "School Name"
}
```

### Usage in API Calls
```javascript
// apiService automatically adds token to headers
Authorization: Bearer <token>
```

## Error Handling

### API Errors
```javascript
try {
  const response = await apiService.login(email, password);
  // Handle success
} catch (error) {
  // error.message contains user-friendly message
  setErrorMessage(error.message);
}
```

### Common Errors
- `Invalid credentials` - Wrong email/password
- `Your account is pending approval` - Teacher not approved yet
- `Your account request was rejected` - Teacher rejected by admin
- `Email already registered` - Duplicate email
- `Failed to load schools` - Backend connection issue

## CORS Configuration

The backend is configured to accept requests from the frontend:

```javascript
// Backend server.js
app.use(cors());
```

For production, configure specific origins:
```javascript
app.use(cors({
  origin: 'https://your-frontend-domain.com'
}));
```

## Testing

### Test Admin Registration
```bash
curl -X POST http://localhost:5000/api/auth/register/admin \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Test Admin",
    "email": "admin@test.com",
    "password": "password123",
    "schoolName": "Test School",
    "schoolAddress": "123 Test St",
    "schoolCity": "Mumbai",
    "schoolState": "Maharashtra",
    "schoolPhone": "+91 9876543210"
  }'
```

### Test Teacher Registration
```bash
# First get school ID from schools list
curl http://localhost:5000/api/schools

# Then register teacher
curl -X POST http://localhost:5000/api/auth/register/teacher \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Test Teacher",
    "email": "teacher@test.com",
    "password": "password123",
    "schoolId": "school-id-from-above"
  }'
```

### Test Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@test.com",
    "password": "password123"
  }'
```

## Troubleshooting

### Backend not connecting
1. Check backend is running: `http://localhost:5000/api/health`
2. Verify `.env` has correct `VITE_API_URL`
3. Check browser console for CORS errors

### Schools not loading in dropdown
1. Verify backend is running
2. Check at least one admin has registered (creates school)
3. Check browser network tab for API errors

### Login fails with valid credentials
1. Check backend logs for errors
2. Verify JWT_SECRET is set in backend `.env`
3. Check user exists in backend data store

### Teacher can't login after approval
1. Verify admin approved the teacher
2. Check teacher status in backend
3. Try logging out and back in

## Production Deployment

### Environment Variables
```bash
# Frontend .env
VITE_API_URL=https://api.yourdomain.com/api

# Backend .env
PORT=5000
JWT_SECRET=<strong-random-secret>
NODE_ENV=production
```

### Build Frontend
```bash
npm run build
```

### Deploy Backend
```bash
# Install dependencies
npm install --production

# Start server
npm start
```

## Next Steps

1. **Database Integration**: Replace in-memory store with MongoDB/PostgreSQL
2. **Email Verification**: Add email verification for registration
3. **Password Reset**: Implement forgot password flow
4. **Refresh Tokens**: Add token refresh mechanism
5. **Rate Limiting**: Add rate limiting to prevent abuse
6. **Logging**: Add request/error logging
7. **Testing**: Add unit and integration tests
