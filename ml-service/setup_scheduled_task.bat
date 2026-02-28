@echo off
REM Setup Windows Task Scheduler for Nightly Model Retraining
REM Run this script as Administrator

echo ========================================
echo Setting up Automated Model Retraining
echo ========================================
echo.

REM Get the current directory
set "SCRIPT_DIR=%~dp0"
set "SCRIPT_PATH=%SCRIPT_DIR%schedule_retrain.bat"

echo Script location: %SCRIPT_PATH%
echo.

REM Create scheduled task to run at 2 AM every night
schtasks /create /tn "ML_Model_Retraining" /tr "\"%SCRIPT_PATH%\"" /sc daily /st 02:00 /f /rl highest

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ========================================
    echo ✓ Scheduled task created successfully!
    echo ========================================
    echo.
    echo Task Name: ML_Model_Retraining
    echo Schedule: Daily at 2:00 AM
    echo Script: %SCRIPT_PATH%
    echo.
    echo To view the task:
    echo   schtasks /query /tn "ML_Model_Retraining"
    echo.
    echo To run the task manually:
    echo   schtasks /run /tn "ML_Model_Retraining"
    echo.
    echo To delete the task:
    echo   schtasks /delete /tn "ML_Model_Retraining" /f
    echo.
) else (
    echo.
    echo ========================================
    echo ✗ Failed to create scheduled task
    echo ========================================
    echo.
    echo Please run this script as Administrator
    echo Right-click and select "Run as administrator"
    echo.
)

pause
