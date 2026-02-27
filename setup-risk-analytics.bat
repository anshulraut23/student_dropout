@echo off
REM Risk Analytics System - Automated Setup Script (Windows)
REM Sets up ML service, trains model, and verifies system health

setlocal enabledelayedexpansion

echo 🚀 Risk Analytics System - Setup ^& Verification
echo ==================================================
echo.

REM Step 1: Verify Python
echo Step 1: Checking Python environment...
python --version > nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Python found
    python --version
) else (
    echo ❌ Python not found - install Python 3.11+
    exit /b 1
)
echo.

REM Step 2: Install ML dependencies
echo Step 2: Installing ML service dependencies...
cd ml-service
python -m pip install -q -r requirements.txt
if %errorlevel% equ 0 (
    echo ✅ ML dependencies installed
) else (
    echo ❌ Failed to install dependencies
    exit /b 1
)
echo.

REM Step 3: Train ML model
echo Step 3: Training ML model...
python generate_and_train.py > nul 2>&1
if exist "models\dropout_model.pkl" (
    echo ✅ ML model trained successfully
) else (
    echo ⚠️  ML model training may have issues
)
echo.

REM Step 4: Verify Gemini configuration
echo Step 4: Checking Gemini API configuration...
findstr "GEMINI_API_KEY=AIza" .env > nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Gemini API key configured
) else (
    echo ⚠️  Gemini API key not found - explanations will use fallback mode
)
echo.

REM Step 5: Start ML service
echo Step 5: Starting ML service...
echo ℹ️  ML service starting on port 5001...
echo (Keep this terminal open while using the system)
echo.
echo ==================================================
python app.py
