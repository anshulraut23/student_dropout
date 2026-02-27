@echo off
echo ================================================================================
echo HACKATHON QUICK START - ML Prediction Demo
echo ================================================================================
echo.

echo Step 1: Generating demo data...
echo.
node create-hackathon-demo-data.js
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ERROR: Failed to generate demo data
    pause
    exit /b 1
)

echo.
echo ================================================================================
echo Demo data created successfully!
echo ================================================================================
echo.
echo Next steps:
echo.
echo 1. Start Backend (Terminal 1):
echo    cd backend
echo    npm start
echo.
echo 2. Start ML Service (Terminal 2):
echo    cd ml-service
echo    python app.py
echo.
echo 3. Start Frontend (Terminal 3):
echo    cd proactive-education-assistant
echo    npm start
echo.
echo 4. Test predictions:
echo    node test-hackathon-predictions.js
echo.
echo 5. Login to app:
echo    URL: http://localhost:3000
echo    Email: admin@demo.com
echo    Password: admin123
echo.
echo ================================================================================
echo.
pause
