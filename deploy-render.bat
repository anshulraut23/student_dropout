@echo off
echo ========================================
echo   Deploy to Render - Student Dropout
echo ========================================
echo.

REM Check if Render CLI is installed
where render >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Render CLI not found!
    echo.
    echo Please install Render CLI first:
    echo npm install -g @render/cli
    echo.
    echo Or use PowerShell:
    echo npm install -g @render/cli
    echo.
    pause
    exit /b 1
)

echo ✅ Render CLI found
echo.

REM Check if user is logged in
render whoami >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo 🔐 Please login to Render...
    echo.
    render login
    if %ERRORLEVEL% NEQ 0 (
        echo ❌ Login failed
        pause
        exit /b 1
    )
)

echo ✅ Logged in to Render
echo.

echo 📦 Preparing deployment...
echo.

REM Create .env file for ML service if it doesn't exist
if not exist "ml-service\.env" (
    echo Creating ml-service/.env from example...
    copy "ml-service\.env.example" "ml-service\.env"
)

REM Create .env file for backend if it doesn't exist  
if not exist "backend\.env" (
    echo Creating backend/.env from example...
    copy "backend\.env.example" "backend\.env"
)

echo.
echo 🚀 Deploying to Render...
echo.
echo This will:
echo   1. Create a new web service on Render
echo   2. Install Node.js and Python dependencies
echo   3. Train the ML model
echo   4. Start both backend and ML service
echo.

REM Deploy using render.yaml
render deploy

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ========================================
    echo   ✅ Deployment Successful!
    echo ========================================
    echo.
    echo Your backend is now live on Render!
    echo.
    echo Next steps:
    echo 1. Go to Render dashboard: https://dashboard.render.com
    echo 2. Find your service and copy the URL
    echo 3. Update frontend .env with the new URL
    echo 4. Set environment variables in Render dashboard:
    echo    - DATABASE_URL (your Supabase connection string)
    echo    - JWT_SECRET (generate a secure random string)
    echo    - GEMINI_API_KEY (optional, for AI explanations)
    echo.
) else (
    echo.
    echo ========================================
    echo   ❌ Deployment Failed
    echo ========================================
    echo.
    echo Please check the error messages above.
    echo.
    echo Common issues:
    echo 1. Not logged in to Render CLI
    echo 2. Invalid render.yaml configuration
    echo 3. Missing dependencies
    echo.
)

pause
