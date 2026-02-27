@echo off
echo ========================================
echo RESTART BACKEND ONLY
echo ========================================
echo.

echo Killing backend process (PID 15260)...
taskkill /F /PID 15260 >nul 2>&1
timeout /t 2 /nobreak >nul

echo.
echo Starting backend with updated code...
start "Backend Server - UPDATED CODE" cmd /k "cd backend && echo Starting backend with missing object support... && npm start"

echo.
echo ✅ Backend restarting...
echo    Wait 10 seconds for it to fully start...
timeout /t 10 /nobreak >nul

echo.
echo Testing backend...
node test-backend-response.js

pause
