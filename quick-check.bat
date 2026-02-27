@echo off
echo ================================================================================
echo QUICK SERVICE CHECK
echo ================================================================================
echo.

echo Checking Backend (Port 5000)...
curl -s http://localhost:5000/api/health >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo [OK] Backend is running on port 5000
) else (
    echo [ERROR] Backend is NOT running on port 5000
    echo Please start: cd backend ^&^& npm start
)
echo.

echo Checking ML Service (Port 5001)...
curl -s http://localhost:5001/health >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo [OK] ML Service is running on port 5001
) else (
    echo [ERROR] ML Service is NOT running on port 5001
    echo Please start: cd ml-service ^&^& python app.py
)
echo.

echo Checking Frontend (Port 5173)...
curl -s http://localhost:5173 >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo [OK] Frontend is running on port 5173
) else (
    echo [ERROR] Frontend is NOT running on port 5173
    echo Please start: cd proactive-education-assistant ^&^& npm run dev
)
echo.

echo ================================================================================
echo.
echo If all services are running, test the backend response:
echo   node test-backend-response.js
echo.
pause
