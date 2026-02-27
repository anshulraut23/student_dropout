@echo off
echo ========================================
echo COMPREHENSIVE SYSTEM VERIFICATION
echo ========================================
echo.

echo [1/5] Checking Backend Process...
netstat -ano | findstr :5000 >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Backend is running on port 5000
) else (
    echo ❌ Backend is NOT running!
    echo    Start it with: cd backend ^&^& npm start
)
echo.

echo [2/5] Checking Frontend Process...
netstat -ano | findstr :5173 >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Frontend is running on port 5173
) else (
    echo ❌ Frontend is NOT running!
    echo    Start it with: cd proactive-education-assistant ^&^& npm run dev
)
echo.

echo [3/5] Checking ML Service...
netstat -ano | findstr :5001 >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ ML Service is running on port 5001
) else (
    echo ⚠️  ML Service is NOT running (optional for this test)
)
echo.

echo [4/5] Testing Backend API Response...
echo Running: node test-backend-response.js
echo.
node test-backend-response.js
echo.

echo [5/5] Opening Browser Test Page...
echo.
echo Opening test-frontend-api.html in your browser...
echo.
echo INSTRUCTIONS:
echo 1. Click "1. Test Login" button
echo 2. Click "2. Get Students" button  
echo 3. Click "3. Test Prediction" button
echo 4. Look for "MISSING OBJECT FOUND" in green
echo 5. Check if the missing data shows:
echo    - current_days
echo    - current_exams
echo    - days_needed
echo    - exams_needed
echo.
pause

start test-frontend-api.html

echo.
echo ========================================
echo VERIFICATION COMPLETE
echo ========================================
echo.
echo If the browser test shows "MISSING OBJECT FOUND",
echo then the backend is working correctly!
echo.
echo If smart messages still don't show in the app:
echo 1. Open http://localhost:5173 in browser
echo 2. Press F12 to open DevTools
echo 3. Go to Console tab
echo 4. Look for debug messages starting with 🔍
echo 5. Check Network tab for API responses
echo.
pause
