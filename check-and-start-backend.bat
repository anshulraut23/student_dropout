@echo off
echo ========================================
echo Backend Server Check and Start
echo ========================================
echo.

echo Checking if backend is already running...
curl -s http://localhost:5000/api/health > nul 2>&1

if %errorlevel% equ 0 (
    echo ✅ Backend is already running!
    echo.
    echo Backend: http://localhost:5000
    echo Health Check: http://localhost:5000/api/health
    echo.
    pause
    exit /b 0
)

echo ❌ Backend is not running. Starting now...
echo.

cd backend

echo Installing dependencies (if needed)...
if not exist "node_modules" (
    echo Running npm install...
    call npm install
    echo.
)

echo Starting backend server...
echo.
echo ========================================
echo Backend Server Starting...
echo ========================================
echo.
echo Keep this window open!
echo.
echo To stop the server, press Ctrl+C
echo.

call npm start
