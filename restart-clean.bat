@echo off
echo ========================================
echo CLEAN RESTART - All Services
echo ========================================
echo.

echo [1/3] Killing all Node processes...
taskkill /F /IM node.exe >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ All Node processes killed
) else (
    echo ℹ️  No Node processes were running
)
timeout /t 2 /nobreak >nul
echo.

echo [2/3] Starting Backend (port 5000)...
start "Backend Server" cmd /k "cd backend && npm start"
echo ✅ Backend starting...
echo    Wait 5 seconds for backend to initialize...
timeout /t 5 /nobreak >nul
echo.

echo [3/3] Starting Frontend (port 5173)...
start "Frontend Dev Server" cmd /k "cd proactive-education-assistant && npm run dev"
echo ✅ Frontend starting...
echo    Wait 5 seconds for frontend to initialize...
timeout /t 5 /nobreak >nul
echo.

echo ========================================
echo ✅ ALL SERVICES STARTED
echo ========================================
echo.
echo Backend:  http://localhost:5000
echo Frontend: http://localhost:5173
echo.
echo Two new command windows have opened:
echo 1. Backend Server (keep this running)
echo 2. Frontend Dev Server (keep this running)
echo.
echo NEXT STEPS:
echo 1. Wait for both servers to fully start
echo 2. Open browser: http://localhost:5173
echo 3. Press Ctrl+Shift+R to hard refresh
echo 4. Login with: admin@demo.com / admin123
echo 5. Check a student's risk prediction
echo 6. Press F12 and look for debug messages in Console
echo.
pause
