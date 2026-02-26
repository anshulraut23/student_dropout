@echo off
echo ========================================
echo  Starting ngrok Tunnel
echo ========================================
echo.
echo Make sure your backend is running in another terminal!
echo.
echo Starting ngrok on port 5000...
echo.
echo ========================================
echo  COPY THE HTTPS URL BELOW
echo ========================================
echo.

ngrok http 5000

pause
