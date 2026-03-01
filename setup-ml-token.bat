@echo off
REM Setup ML Performance Tracking - Get Admin Token
echo ========================================
echo ML Performance Tracking Setup
echo ========================================
echo.

echo This script will help you get your admin token.
echo.

echo Step 1: Open the token helper page
echo ----------------------------------------
echo.
echo Opening get-admin-token.html in your browser...
start get-admin-token.html
echo.

echo Step 2: Follow the instructions on the page
echo ----------------------------------------
echo.
echo 1. Login as admin if not already logged in
echo 2. Click "Get My Token" button
echo 3. Copy the token
echo.

echo Step 3: Paste token into ml-service/.env
echo ----------------------------------------
echo.
echo Opening ml-service/.env file for you...
timeout /t 2 >nul
notepad ml-service\.env
echo.

echo Step 4: Save the file and run sync
echo ----------------------------------------
echo.
echo After saving the .env file with your token:
echo.
echo   cd ml-service
echo   sync_performance_to_db.bat
echo.

pause
