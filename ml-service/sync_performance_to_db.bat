@echo off
REM Manually sync current model performance to database
REM Run this if you want to save the current model metrics to the database

echo ========================================
echo Syncing Model Performance to Database
echo ========================================
echo.

cd /d "%~dp0"

python save_performance_to_db.py

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ========================================
    echo ✓ Performance metrics synced successfully
    echo ========================================
) else (
    echo.
    echo ========================================
    echo ✗ Failed to sync performance metrics
    echo ========================================
)

echo.
pause
