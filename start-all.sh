#!/bin/bash

echo "========================================"
echo "Starting Education Assistant Application"
echo "========================================"
echo ""

echo "[1/4] Checking backend dependencies..."
cd backend
if [ ! -d "node_modules" ]; then
    echo "Installing backend dependencies..."
    npm install
else
    echo "Backend dependencies already installed."
fi
echo ""

echo "[2/4] Starting backend server..."
npm start &
BACKEND_PID=$!
sleep 3
echo "Backend server started on http://localhost:5000 (PID: $BACKEND_PID)"
echo ""

echo "[3/4] Checking frontend dependencies..."
cd ../proactive-education-assistant
if [ ! -d "node_modules" ]; then
    echo "Installing frontend dependencies..."
    npm install
else
    echo "Frontend dependencies already installed."
fi
echo ""

echo "[4/4] Starting frontend server..."
npm run dev &
FRONTEND_PID=$!
sleep 3
echo "Frontend server started on http://localhost:5173 (PID: $FRONTEND_PID)"
echo ""

echo "========================================"
echo "Application Started Successfully!"
echo "========================================"
echo ""
echo "Backend:  http://localhost:5000 (PID: $BACKEND_PID)"
echo "Frontend: http://localhost:5173 (PID: $FRONTEND_PID)"
echo ""
echo "Opening application in browser..."
sleep 2

# Open browser based on OS
if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    open http://localhost:5173
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    # Linux
    xdg-open http://localhost:5173
fi

echo ""
echo "To stop the servers, press Ctrl+C"
echo ""

# Wait for user interrupt
wait
