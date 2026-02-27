@echo off
echo ========================================
echo FIX FETCH ERROR - Clean Restart
echo ========================================
echo.

echo [1/4] Killing all Node processes...
taskkill /F /IM node.exe >nul 2>&1
timeout /t 2 /nobreak >nul
echo ✅ All processes killed
echo.

echo [2/4] Starting Backend...
start "Backend Server" cmd /k "cd backend && npm start"
echo ✅ Backend starting on port 5000...
echo    Waiting 10 seconds for backend to initialize...
timeout /t 10 /nobreak >nul
echo.

echo [3/4] Testing Backend...
curl -s http://localhost:5000/api/health >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Backend is responding
) else (
    echo ⚠️  Backend may still be starting...
)
echo.

echo [4/4] Starting Frontend...
start "Frontend Dev Server" cmd /k "cd proactive-education-assistant && npm run dev"
echo ✅ Frontend starting on port 5173...
echo    Waiting 10 seconds for frontend to initialize...
timeout /t 10 /nobreak >nul
echo.

echo ========================================
echo ✅ SERVICES RESTARTED
echo ========================================
echo.
echo Backend:  http://localhost:5000
echo Frontend: http://localhost:5173
echo.
echo NEXT STEPS:
echo 1. Wait for both servers to fully start (check the new windows)
echo 2. Open browser: http://localhost:5173
echo 3. Press Ctrl+Shift+R to hard refresh
echo 4. Login and test the student risk prediction
echo.
echo If you still see "Fetch failed":
echo - Check the Backend window for errors
echo - Make sure backend shows "Server running on port 5000"
echo - Try opening http://localhost:5000/api/health in browser
echo.
pause
