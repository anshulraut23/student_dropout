@echo off
echo ========================================
echo  ngrok Setup - Complete Guide
echo ========================================
echo.
echo This script will help you set up ngrok for your mobile app.
echo.
echo STEP 1: Make sure backend is running
echo ----------------------------------------
echo Open a NEW terminal and run:
echo    cd backend
echo    npm start
echo.
set /p BACKEND_READY="Is your backend running? (y/n): "
if /i not "%BACKEND_READY%"=="y" (
    echo.
    echo Please start the backend first, then run this script again.
    pause
    exit /b
)

echo.
echo STEP 2: Starting ngrok
echo ----------------------------------------
echo Starting ngrok tunnel on port 5000...
echo.
echo IMPORTANT: Keep this window open!
echo.
echo When ngrok starts, you'll see something like:
echo    Forwarding: https://abc123.ngrok.io -^> http://localhost:5000
echo.
echo Copy the HTTPS URL (the part before the arrow)
echo.
pause

start cmd /k "ngrok http 5000"

echo.
echo ========================================
echo  STEP 3: Update Frontend Configuration
echo ========================================
echo.
echo After you see the ngrok URL:
echo.
echo 1. Copy the HTTPS URL (e.g., https://abc123.ngrok.io)
echo 2. Press any key to continue...
pause

echo.
set /p NGROK_URL="Paste your ngrok HTTPS URL here: "

if "%NGROK_URL%"=="" (
    echo Error: No URL provided
    pause
    exit /b
)

echo.
echo Updating .env file...
echo VITE_API_URL=%NGROK_URL%/api > proactive-education-assistant\.env

echo [OK] .env file updated!
echo.
echo ========================================
echo  STEP 4: Rebuild App
echo ========================================
echo.
echo Building React app...
cd proactive-education-assistant
call npm run build

if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Build failed
    pause
    exit /b
)

echo.
echo Syncing with Capacitor...
call npx cap sync

if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Sync failed
    pause
    exit /b
)

echo.
echo ========================================
echo  SUCCESS!
echo ========================================
echo.
echo Your app is now configured to use:
echo %NGROK_URL%/api
echo.
echo Next steps:
echo 1. Open Android Studio: npx cap open android
echo 2. Click Run button
echo 3. Test the app!
echo.
echo IMPORTANT: Keep the ngrok terminal window open!
echo.
pause
