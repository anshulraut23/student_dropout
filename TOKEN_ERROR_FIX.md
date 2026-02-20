# Token Error Fix

## Problem

Teacher is getting "Invalid or expired token" error on My Classes and Students pages.

## Possible Causes

1. **Token expired** - JWT tokens expire after 7 days
2. **Token not being sent** - Frontend not including token in requests
3. **JWT_SECRET mismatch** - Backend using different secret
4. **Token format issue** - Token payload structure mismatch

## Quick Fix Steps

### Step 1: Logout and Login Again

The simplest solution - get a fresh token:

1. Click "Logout" in the teacher panel
2. Login again with teacher credentials
3. Try accessing My Classes or Students page

### Step 2: Check Token in Browser

Open browser console (F12) and run:

```javascript
// Check if token exists
const token = localStorage.getItem('token');
console.log('Token exists:', !!token);
console.log('Token:', token);

// Check token expiry
if (token) {
  const payload = JSON.parse(atob(token.split('.')[1]));
  console.log('Token payload:', payload);
  console.log('Expires at:', new Date(payload.exp * 1000));
  console.log('Is expired:', Date.now() > payload.exp * 1000);
}
```

### Step 3: Test API Directly

Run in browser console:

```javascript
fetch('http://localhost:5000/api/teachers/my-classes', {
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('token')}`,
    'Content-Type': 'application/json'
  }
})
  .then(r => r.json())
  .then(d => console.log('API Response:', d))
  .catch(e => console.error('API Error:', e));
```

### Step 4: Check Backend Logs

After trying to access My Classes, check backend terminal for:

```
=== Auth Debug ===
Auth header: Present
Token: eyJhbGciOiJIUzI1NiIs...
✅ Token valid for user: <user-id> role: teacher
```

If you see:
```
❌ Token verification failed: jwt expired
```
Then the token is expired - logout and login again.

If you see:
```
❌ Token verification failed: invalid signature
```
Then JWT_SECRET might have changed - restart backend.

## Manual Token Refresh

If you don't want to logout, you can refresh the token:

1. Open browser console (F12)
2. Run:
```javascript
// Get current credentials (if you remember them)
const email = 'teacher@school.com';
const password = 'your-password';

fetch('http://localhost:5000/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, password })
})
  .then(r => r.json())
  .then(d => {
    if (d.success) {
      localStorage.setItem('token', d.token);
      localStorage.setItem('role', d.user.role);
      console.log('✅ Token refreshed! Reload the page.');
      location.reload();
    } else {
      console.error('❌ Login failed:', d.error);
    }
  });
```

## Permanent Fix

### Update Token Expiry

If tokens expire too quickly, update in `backend/controllers/authController.js`:

```javascript
// Change from 7d to 30d
const token = jwt.sign(
  { userId: user.id, email: user.email, role: user.role, schoolId: user.schoolId },
  process.env.JWT_SECRET,
  { expiresIn: '30d' }  // ← Change this
);
```

### Add Token Refresh Endpoint

Create an endpoint to refresh tokens without re-login:

```javascript
// In authController.js
export const refreshToken = (req, res) => {
  try {
    const user = dataStore.getUserById(req.user.userId);
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        error: 'User not found' 
      });
    }

    // Generate new token
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role, schoolId: user.schoolId },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      token
    });
  } catch (error) {
    console.error('Refresh token error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to refresh token' 
    });
  }
};
```

## Debugging Checklist

- [ ] Backend server is running
- [ ] Teacher is logged in
- [ ] Token exists in localStorage
- [ ] Token is not expired
- [ ] Backend shows auth debug logs
- [ ] JWT_SECRET is set in .env
- [ ] Teacher account is approved (status: 'approved')

## Common Scenarios

### Scenario 1: Token Expired
**Symptoms**: Error after 7 days of login
**Solution**: Logout and login again

### Scenario 2: Backend Restarted with Different Secret
**Symptoms**: Error immediately after backend restart
**Solution**: Logout and login again

### Scenario 3: Token Not Being Sent
**Symptoms**: "Access token required" error
**Solution**: Check if token exists in localStorage

### Scenario 4: Wrong Token Format
**Symptoms**: "Invalid token" error
**Solution**: Clear localStorage and login again

## Quick Test Script

Save this as `test-auth.html` and open in browser:

```html
<!DOCTYPE html>
<html>
<head>
  <title>Auth Test</title>
</head>
<body>
  <h1>Authentication Test</h1>
  <div id="result"></div>
  
  <script>
    const token = localStorage.getItem('token');
    const result = document.getElementById('result');
    
    if (!token) {
      result.innerHTML = '<p style="color: red;">❌ No token found. Please login.</p>';
    } else {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const isExpired = Date.now() > payload.exp * 1000;
        
        result.innerHTML = `
          <p><strong>Token Found:</strong> ✅</p>
          <p><strong>User ID:</strong> ${payload.userId}</p>
          <p><strong>Email:</strong> ${payload.email}</p>
          <p><strong>Role:</strong> ${payload.role}</p>
          <p><strong>School ID:</strong> ${payload.schoolId}</p>
          <p><strong>Expires:</strong> ${new Date(payload.exp * 1000).toLocaleString()}</p>
          <p><strong>Status:</strong> ${isExpired ? '❌ EXPIRED' : '✅ VALID'}</p>
        `;
        
        if (isExpired) {
          result.innerHTML += '<p style="color: red;"><strong>Action Required:</strong> Logout and login again to get a new token.</p>';
        }
      } catch (e) {
        result.innerHTML = '<p style="color: red;">❌ Invalid token format</p>';
      }
    }
  </script>
</body>
</html>
```

## Still Not Working?

1. **Clear all browser data**:
   - Press Ctrl + Shift + Delete
   - Clear cookies and site data
   - Reload page

2. **Restart backend**:
   ```bash
   cd backend
   npm start
   ```

3. **Check .env file**:
   - Make sure JWT_SECRET is set
   - Should be: `JWT_SECRET=your_jwt_secret_key_here_change_in_production`

4. **Check backend logs**:
   - Look for "Auth Debug" messages
   - Check for JWT verification errors

5. **Try different browser**:
   - Sometimes browser extensions interfere
   - Try incognito mode

---

**TL;DR**: Logout and login again to get a fresh token!
