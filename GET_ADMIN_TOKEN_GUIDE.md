# How to Get Your Admin Token - Step by Step

## Quick Method (Recommended)

### Option 1: Use the Helper Page

1. **Run the setup script:**
   ```bash
   setup-ml-token.bat
   ```
   
   This will:
   - Open `get-admin-token.html` in your browser
   - Open `ml-service/.env` in Notepad
   - Guide you through the process

2. **Follow the on-screen instructions**

3. **Done!** Run the sync script:
   ```bash
   cd ml-service
   sync_performance_to_db.bat
   ```

---

## Manual Method (Detailed Steps)

### Step 1: Login as Admin

1. Open your browser
2. Go to: `http://localhost:3000/admin/login`
3. Enter your admin credentials
4. Click "Login"

**Important:** Make sure you login as **admin**, not as a teacher!

### Step 2: Open Browser DevTools

**Chrome / Edge:**
- Press `F12` OR
- Right-click anywhere → "Inspect" OR
- Menu → More Tools → Developer Tools

**Firefox:**
- Press `F12` OR
- Menu → More Tools → Web Developer Tools

### Step 3: Navigate to Storage

**Chrome / Edge:**
1. Click the **"Application"** tab at the top
2. In the left sidebar, expand **"Local Storage"**
3. Click on `http://localhost:3000`

**Firefox:**
1. Click the **"Storage"** tab at the top
2. Expand **"Local Storage"**
3. Click on `http://localhost:3000`

### Step 4: Find the Token

1. Look for a key named **`token`** in the list
2. Click on it
3. The value will appear on the right side
4. It's a long string starting with `eyJ...`

### Step 5: Copy the Token

**Method A - Right-click:**
1. Right-click on the token value
2. Select "Copy"

**Method B - Select and copy:**
1. Click on the token value
2. Press `Ctrl+A` to select all
3. Press `Ctrl+C` to copy

### Step 6: Add to Configuration File

1. **Open the file:**
   ```
   ml-service/.env
   ```

2. **Find this line:**
   ```env
   ADMIN_AUTH_TOKEN=your_admin_jwt_token_here
   ```

3. **Replace with your token:**
   ```env
   ADMIN_AUTH_TOKEN=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQ...
   ```
   (Your actual token will be much longer)

4. **Save the file** (`Ctrl+S`)

### Step 7: Test the Sync

1. **Open Command Prompt / Terminal**

2. **Navigate to ml-service:**
   ```bash
   cd ml-service
   ```

3. **Run the sync script:**
   ```bash
   sync_performance_to_db.bat
   ```

4. **You should see:**
   ```
   ✅ Performance metrics saved to database successfully!
      Accuracy: 0.6900
      F1-Score: 0.5441
   ```

### Step 8: Verify in Dashboard

1. **Go to admin dashboard:**
   ```
   http://localhost:3000/admin/dashboard
   ```

2. **Click "ML Performance" in the left sidebar**

3. **You should see:**
   - Latest metrics cards
   - Model information
   - Confusion matrix
   - Performance data!

---

## Troubleshooting

### "No token found in localStorage"

**Problem:** You're not logged in or token expired

**Solution:**
1. Go to `http://localhost:3000/admin/login`
2. Login with admin credentials
3. Try again

### "Token is undefined or null"

**Problem:** Wrong storage location or not logged in

**Solution:**
1. Make sure you're on `http://localhost:3000` (not 3001 or other port)
2. Make sure you clicked on the correct Local Storage entry
3. Refresh the page and login again

### "401 Unauthorized" when running sync

**Problem:** Token is invalid, expired, or not an admin token

**Solution:**
1. Make sure you logged in as **admin** (not teacher)
2. Get a fresh token (tokens may expire)
3. Check that you copied the entire token (no spaces or line breaks)
4. Make sure you saved the `.env` file after pasting

### Token looks weird or has spaces

**Problem:** Token was copied incorrectly

**Solution:**
1. The token should be one continuous string
2. No spaces, no line breaks
3. Should start with `eyJ`
4. Should be very long (hundreds of characters)

### "Connection refused" error

**Problem:** Backend server is not running

**Solution:**
1. Start the backend:
   ```bash
   cd backend
   npm start
   ```
2. Wait for "Server running on port 5000"
3. Try sync again

---

## What the Token Looks Like

### ✅ Correct Token Format:
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxMjM0NTY3ODkwIiwicm9sZSI6ImFkbWluIiwic2Nob29sSWQiOiJzY2hvb2wxMjMiLCJpYXQiOjE2MTYyMzkwMjJ9.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
```

### ❌ Incorrect (has line breaks):
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.
eyJ1c2VySWQiOiIxMjM0NTY3ODkwIiwicm9sZSI6ImFkbWluIi
wic2Nob29sSWQiOiJzY2hvb2wxMjMiLCJpYXQiOjE2MTYyMzkw
MjJ9.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
```

### ❌ Incorrect (has spaces):
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9. eyJ1c2VySWQiOiIxMjM0NTY3ODkwIiwicm9sZSI6ImFkbWluIiwic2Nob29sSWQiOiJzY2hvb2wxMjMiLCJpYXQiOjE2MTYyMzkwMjJ9. SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
```

---

## Quick Reference

### Files to Edit:
```
ml-service/.env
```

### Line to Update:
```env
ADMIN_AUTH_TOKEN=<paste_your_token_here>
```

### Command to Run:
```bash
cd ml-service
sync_performance_to_db.bat
```

### Where to Check:
```
http://localhost:3000/admin/model-performance
```

---

## Video Tutorial (Text Description)

If you prefer step-by-step visual guidance:

1. **[0:00-0:15]** Open browser, navigate to admin login
2. **[0:15-0:30]** Enter credentials, click login
3. **[0:30-0:45]** Press F12, click Application tab
4. **[0:45-1:00]** Expand Local Storage, click localhost:3000
5. **[1:00-1:15]** Find 'token' key, right-click value, copy
6. **[1:15-1:30]** Open ml-service/.env in text editor
7. **[1:30-1:45]** Paste token after ADMIN_AUTH_TOKEN=
8. **[1:45-2:00]** Save file, open terminal
9. **[2:00-2:15]** Run: cd ml-service && sync_performance_to_db.bat
10. **[2:15-2:30]** See success message, open admin dashboard
11. **[2:30-2:45]** Click ML Performance, see metrics!

---

## Need More Help?

### Check These Files:
- `SETUP_ML_PERFORMANCE_TRACKING.md` - Full setup guide
- `ML_PERFORMANCE_QUICK_REFERENCE.md` - Quick commands
- `ML_PERFORMANCE_COMPLETE.md` - Complete documentation

### Common Issues:
- Not logged in as admin → Login as admin
- Token expired → Get fresh token
- Backend not running → Start backend server
- Wrong port → Use localhost:3000 (not 3001)

### Still Stuck?
1. Check backend logs for errors
2. Verify you're using admin account (not teacher)
3. Try logging out and back in
4. Get a fresh token

---

**Remember:** The token is like a password - keep it secure and don't share it!
