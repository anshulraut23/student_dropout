@echo off
echo ========================================
echo Starting Education Assistant Application
echo ========================================
echo.

echo [1/4] Checking backend dependencies...
cd backend
if not exist "node_modules" (
    echo Installing backend dependencies...
    call npm install
) else (
    echo Backend dependencies already installed.
)
echo.

echo [2/4] Starting backend server...
start "Backend Server" cmd /k "npm start"
timeout /t 3 /nobreak > nul
echo Backend server started on http://localhost:5000
echo.

echo [3/4] Checking frontend dependencies...
cd ../proactive-education-assistant
if not exist "node_modules" (
    echo Installing frontend dependencies...
    call npm install
) else (
    echo Frontend dependencies already installed.
)
echo.

echo [4/4] Starting frontend server...
start "Frontend Server" cmd /k "npm run dev"
timeout /t 3 /nobreak > nul
echo Frontend server started on http://localhost:5173
echo.

echo ========================================
echo Application Started Successfully!
echo ========================================
echo.
echo Backend:  http://localhost:5000
echo Frontend: http://localhost:5173
echo.
echo Press any key to open the application in your browser...
pause > nul

start http://localhost:5173

echo.
echo To stop the servers, close the Backend and Frontend terminal windows.
echo.
pause
