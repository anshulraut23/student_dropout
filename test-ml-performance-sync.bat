@echo off
REM Test ML Performance Sync to Database
echo ========================================
echo Testing ML Performance Sync
echo ========================================
echo.

echo Step 1: Checking if model metadata exists...
if exist "ml-service\models\model_metadata.json" (
    echo ✓ Model metadata found
    echo.
    
    echo Step 2: Displaying current model metrics...
    type ml-service\models\model_metadata.json
    echo.
    echo.
    
    echo Step 3: Syncing to database...
    cd ml-service
    python save_performance_to_db.py
    cd ..
    echo.
    
    echo ========================================
    echo Test Complete
    echo ========================================
    echo.
    echo Next steps:
    echo 1. Login as admin at http://localhost:3000/admin/login
    echo 2. Navigate to ML Performance page
    echo 3. You should see the performance history
    echo.
) else (
    echo ✗ Model metadata not found
    echo.
    echo Please train the model first:
    echo   cd ml-service
    echo   python generate_and_train.py
    echo.
)

pause
