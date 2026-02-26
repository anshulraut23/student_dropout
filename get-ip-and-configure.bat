@echo off
echo ========================================
echo  Finding Your Computer's IP Address
echo ========================================
echo.

REM Get IP address
for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr /c:"IPv4 Address"') do (
    set IP=%%a
    goto :found
)

:found
REM Remove leading spaces
set IP=%IP: =%

echo Your computer's IP address: %IP%
echo.
echo ========================================
echo  Configuration Instructions
echo ========================================
echo.
echo 1. Update proactive-education-assistant/.env file:
echo    Change: VITE_API_URL=http://localhost:5000/api
echo    To:     VITE_API_URL=http://%IP%:5000/api
echo.
echo 2. Rebuild the app:
echo    cd proactive-education-assistant
echo    npm run build
echo    npx cap sync
echo.
echo 3. Rebuild APK in Android Studio
echo.
echo ========================================
echo.

set /p UPDATE="Do you want me to update the .env file now? (y/n): "
if /i "%UPDATE%"=="y" (
    echo VITE_API_URL=http://%IP%:5000/api > proactive-education-assistant\.env
    echo.
    echo [OK] .env file updated!
    echo.
    echo Next steps:
    echo 1. cd proactive-education-assistant
    echo 2. npm run build
    echo 3. npx cap sync
    echo 4. npx cap open android
    echo 5. Rebuild APK
    echo.
) else (
    echo.
    echo Please manually update the .env file with:
    echo VITE_API_URL=http://%IP%:5000/api
    echo.
)

pause
