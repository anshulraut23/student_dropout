#!/bin/bash

echo "========================================"
echo "Backend Server Check and Start"
echo "========================================"
echo ""

echo "Checking if backend is already running..."
if curl -s http://localhost:5000/api/health > /dev/null 2>&1; then
    echo "✅ Backend is already running!"
    echo ""
    echo "Backend: http://localhost:5000"
    echo "Health Check: http://localhost:5000/api/health"
    echo ""
    exit 0
fi

echo "❌ Backend is not running. Starting now..."
echo ""

cd backend

echo "Installing dependencies (if needed)..."
if [ ! -d "node_modules" ]; then
    echo "Running npm install..."
    npm install
    echo ""
fi

echo "Starting backend server..."
echo ""
echo "========================================"
echo "Backend Server Starting..."
echo "========================================"
echo ""
echo "Keep this terminal open!"
echo ""
echo "To stop the server, press Ctrl+C"
echo ""

npm start
