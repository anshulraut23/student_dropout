@echo off
echo ========================================
echo Opening Browser API Test Page
echo ========================================
echo.
echo This will open a test page in your browser
echo that directly tests the API endpoints.
echo.
echo Instructions:
echo 1. Click "1. Test Login"
echo 2. Click "2. Get Students"
echo 3. Click "3. Test Prediction"
echo.
echo Look for the MISSING OBJECT in the output!
echo.
pause

start test-frontend-api.html

echo.
echo Test page opened in browser!
echo Check the output for MISSING OBJECT data.
echo.
pause
