# 🔧 Fix JWT Token Verification Error

## Problem
```
❌ Token verification failed: invalid signature
```

## Root Cause
The JWT token in your browser was created with a different `JWT_SECRET` than what's currently in your local backend.

This happens when:
- Token was generated on Render (production) with a different secret
- You switched from production to local backend
- JWT_SECRET was changed in `.env` file

## Quick Fix (Recommended)

### Option 1: Clear Browser Storage and Re-login

1. **Open Browser DevTools**
   - Press `F12` or `Ctrl+Shift+I`

2. **Go to Application Tab**
   - Click "Application" (Chrome) or "Storage" (Firefox)

3. **Clear Storage**
   - Expand "Local Storage"
   - Click on `http://localhost:3000`
   - Right-click → "Clear"
   - Also clear "Session Storage"

4. **Refresh Page**
   - Press `F5` or `Ctrl+R`

5. **Login Again**
   - Go to homepage
   - Select your role (Teacher/Admin/Super Admin)
   - Enter credentials
   - New token will be generated with correct secret

### Option 2: Use Browser Console

1. Open DevTools Console (`F12` → Console tab)
2. Run these commands:
```javascript
localStorage.clear();
sessionStorage.clear();
location.reload();
```

## Alternative: Match JWT Secrets

If you want to keep using the existing token, match the JWT secrets:

### Check Render JWT Secret
1. Go to Render Dashboard
2. Open your backend service
3. Go to Environment Variables
4. Find `JWT_SECRET` value

### Update Local .env
```bash
# In backend/.env
JWT_SECRET=<paste_the_same_secret_from_render>
```

### Restart Backend
```bash
cd backend
npm start
```

## For VES College Admin

Your token was likely generated on Render. To fix:

1. **Clear browser storage** (Option 1 above)
2. **Login again** at `http://localhost:3000`
3. Use credentials:
   - Email: `ves@gmail.com`
   - Password: (your password)
   - Role: Admin

## Understanding JWT Tokens

### What is JWT?
- JSON Web Token - used for authentication
- Contains user info (userId, email, role, schoolId)
- Signed with a secret key

### Token Structure
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9  ← Header
.
eyJ1c2VySWQiOiIxMjM0IiwiZW1haWwiOiJ1c2VyQGV4YW1wbGUuY29tIn0  ← Payload
.
SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c  ← Signature (uses JWT_SECRET)
```

### Why Signature Fails
- Token signature was created with Secret A
- Backend is trying to verify with Secret B
- Signatures don't match → Invalid token

## Current JWT Secrets

### Local Backend
```
JWT_SECRET=your_jwt_secret_key_here_change_in_production
```

### Render Backend (Production)
```
JWT_SECRET=your_jwt_secret_key_here_change_in_production_render_deployment
```

These are DIFFERENT, so tokens from one won't work on the other.

## Best Practice

### For Development
Keep a consistent JWT_SECRET in local `.env`:
```bash
JWT_SECRET=dev_secret_key_12345
```

### For Production
Use a strong, unique secret on Render:
```bash
JWT_SECRET=prod_strong_random_secret_xyz789
```

### Never Share Secrets
- Don't commit JWT_SECRET to git
- Use different secrets for dev/prod
- Keep secrets in `.env` files (gitignored)

## Preventing This Issue

### 1. Use Environment-Specific Tokens
- Don't mix production and development tokens
- Clear storage when switching environments

### 2. Token Expiration
Tokens should expire after some time:
```javascript
// In authController.js
const token = jwt.sign(payload, JWT_SECRET, {
  expiresIn: '7d' // Token expires in 7 days
});
```

### 3. Logout Function
Always provide a logout button that clears storage:
```javascript
const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('role');
  sessionStorage.clear();
  window.location.href = '/';
};
```

## Testing the Fix

After clearing storage and logging in:

1. **Check Console**
   - Should see: `✅ Token verified successfully`
   - No more "invalid signature" errors

2. **Test API Calls**
   - Dashboard should load
   - Student list should appear
   - No 401 errors

3. **Check Token**
   - Open DevTools → Application → Local Storage
   - Should see new `token` value
   - This token is signed with current JWT_SECRET

## Still Having Issues?

### Check Backend Logs
```bash
cd backend
npm start
```
Look for:
- `JWT secret configured: true`
- Token verification messages

### Verify JWT_SECRET is Set
```bash
# In backend directory
node -e "require('dotenv').config(); console.log('JWT_SECRET:', process.env.JWT_SECRET ? 'SET' : 'NOT SET')"
```

### Test Token Manually
Create a test script:
```javascript
// test-jwt.js
const jwt = require('jsonwebtoken');
require('dotenv').config();

const token = 'YOUR_TOKEN_HERE';
try {
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  console.log('✅ Token valid:', decoded);
} catch (error) {
  console.log('❌ Token invalid:', error.message);
}
```

Run: `node test-jwt.js`

## Summary

**Quickest Fix:**
1. Clear browser storage (localStorage + sessionStorage)
2. Refresh page
3. Login again
4. New token will work perfectly

This takes 30 seconds and solves the problem immediately!
