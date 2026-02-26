@echo off
echo ========================================
echo   Testing Backend + ML Integration
echo ========================================
echo.

echo Starting services locally...
echo.

REM Start ML service in background
echo 🤖 Starting ML service on port 5001...
start "ML Service" cmd /k "cd ml-service && python app.py"

REM Wait for ML service to start
timeout /t 5 /nobreak >nul

REM Start backend
echo 📊 Starting backend on port 5000...
start "Backend" cmd /k "cd backend && node server.js"

REM Wait for backend to start
timeout /t 5 /nobreak >nul

echo.
echo ✅ Services started!
echo.
echo Testing endpoints...
echo.

REM Test ML service health
echo 🤖 Testing ML service health...
curl http://localhost:5001/health
echo.
echo.

REM Test backend health
echo 📊 Testing backend health...
curl http://localhost:5000/api/health
echo.
echo.

echo ========================================
echo   Services Running
echo ========================================
echo.
echo 🤖 ML Service: http://localhost:5001
echo 📊 Backend: http://localhost:5000
echo.
echo Press any key to stop services...
pause >nul

REM Kill services
taskkill /FI "WINDOWTITLE eq ML Service*" /F >nul 2>&1
taskkill /FI "WINDOWTITLE eq Backend*" /F >nul 2>&1

echo.
echo ✅ Services stopped
