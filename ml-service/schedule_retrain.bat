@echo off
REM Automated Model Retraining Script for Windows Task Scheduler
REM This script runs the ML model retraining process

echo ========================================
echo ML Model Automated Retraining
echo Started at: %date% %time%
echo ========================================

REM Change to ml-service directory
cd /d "%~dp0"

REM Activate virtual environment if it exists
if exist venv\Scripts\activate.bat (
    call venv\Scripts\activate.bat
)

REM Run the retraining script
python auto_retrain.py

REM Check exit code
if %ERRORLEVEL% EQU 0 (
    echo.
    echo ========================================
    echo ✓ Retraining completed successfully
    echo Finished at: %date% %time%
    echo ========================================
) else (
    echo.
    echo ========================================
    echo ✗ Retraining failed with error code %ERRORLEVEL%
    echo Finished at: %date% %time%
    echo ========================================
)

REM Keep window open for 5 seconds to see results
timeout /t 5 /nobreak >nul
