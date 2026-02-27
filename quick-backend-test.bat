@echo off
echo Testing if backend is responding...
echo.

curl -s http://localhost:5000/api/health >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Backend is responding on port 5000
) else (
    echo ❌ Backend is NOT responding!
    echo.
    echo Please start the backend:
    echo   cd backend
    echo   npm start
    pause
    exit /b 1
)

echo.
echo Running prediction test...
node test-backend-response.js

pause
