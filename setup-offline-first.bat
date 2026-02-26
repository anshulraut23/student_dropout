@echo off
REM Offline-First Mobile App Setup Script for Windows
REM This script automates the setup process for converting the React app to Android APK

echo.
echo ========================================
echo  Offline-First Mobile App Setup
echo ========================================
echo.

REM Check Node.js
echo [1/5] Checking Node.js...
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Node.js is not installed
    echo Please install Node.js v18 or higher from https://nodejs.org
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
echo [OK] Node.js %NODE_VERSION% found
echo.

REM Check npm
echo [2/5] Checking npm...
where npm >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] npm is not installed
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('npm --version') do set NPM_VERSION=%%i
echo [OK] npm %NPM_VERSION% found
echo.

REM Check Java
echo [3/5] Checking Java...
where java >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [WARNING] Java is not installed
    echo Java JDK 17+ is required for Android builds
    echo Install from: https://www.oracle.com/java/technologies/downloads/
    echo.
) else (
    for /f "tokens=*" %%i in ('java --version 2^>^&1 ^| findstr /r "^"') do (
        echo [OK] %%i
        goto :java_found
    )
    :java_found
    echo.
)

REM Navigate to frontend directory
echo [4/5] Navigating to frontend directory...
cd proactive-education-assistant
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Frontend directory not found
    pause
    exit /b 1
)
echo.

REM Install dependencies
echo [5/5] Installing dependencies...
echo This may take a few minutes...
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Failed to install dependencies
    pause
    exit /b 1
)
echo [OK] Dependencies installed
echo.

REM Check if Android platform exists
if exist "android" (
    echo [WARNING] Android platform already exists
    set /p RECREATE="Do you want to remove and recreate it? (y/n): "
    if /i "%RECREATE%"=="y" (
        echo Removing existing Android platform...
        rmdir /s /q android
        echo Adding Android platform...
        call npx cap add android
    )
) else (
    echo Adding Android platform...
    call npx cap add android
)

if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Failed to add Android platform
    pause
    exit /b 1
)
echo [OK] Android platform configured
echo.

REM Build React app
echo Building React app...
call npm run build
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Failed to build React app
    pause
    exit /b 1
)
echo [OK] React app built
echo.

REM Sync with Capacitor
echo Syncing with Capacitor...
call npx cap sync
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Failed to sync with Capacitor
    pause
    exit /b 1
)
echo [OK] Capacitor sync completed
echo.

REM Summary
echo.
echo ========================================
echo  Setup completed successfully!
echo ========================================
echo.
echo Next steps:
echo.
echo 1. Open Android Studio:
echo    npx cap open android
echo.
echo 2. Build APK in Android Studio:
echo    - Click Build -^> Build Bundle(s) / APK(s) -^> Build APK(s)
echo.
echo 3. Or build via command line:
echo    cd android
echo    gradlew assembleDebug
echo.
echo 4. Test on emulator or device
echo.
echo Documentation:
echo    - Setup Guide: ..\OFFLINE_FIRST_SETUP_GUIDE.md
echo    - Implementation Plan: ..\OFFLINE_FIRST_IMPLEMENTATION_PLAN.md
echo.
echo Happy coding!
echo.

pause
