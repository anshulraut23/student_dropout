#!/bin/bash

# Start both Node.js backend and Python ML service
echo "🚀 Starting combined services..."

# Set environment variables
export ML_SERVICE_PORT=${ML_SERVICE_PORT:-5001}
export PORT=${PORT:-5000}
export ML_SERVICE_URL="http://localhost:${ML_SERVICE_PORT}"

echo "📊 Backend will run on port $PORT"
echo "🤖 ML Service will run on port $ML_SERVICE_PORT"

# Start Python ML service in background
cd ml-service
echo "🤖 Starting ML service..."
gunicorn --bind 0.0.0.0:$ML_SERVICE_PORT --workers 2 --timeout 120 app:app &
ML_PID=$!
cd ..

# Wait for ML service to start
sleep 5

# Check if ML service is running
if ps -p $ML_PID > /dev/null; then
   echo "✅ ML service started (PID: $ML_PID)"
else
   echo "❌ ML service failed to start"
   exit 1
fi

# Start Node.js backend
cd backend
echo "🚀 Starting Node.js backend..."
node server.js &
BACKEND_PID=$!

# Wait for backend to start
sleep 3

# Check if backend is running
if ps -p $BACKEND_PID > /dev/null; then
   echo "✅ Backend started (PID: $BACKEND_PID)"
else
   echo "❌ Backend failed to start"
   kill $ML_PID
   exit 1
fi

echo "✅ All services running!"
echo "📊 Backend: http://localhost:$PORT"
echo "🤖 ML Service: http://localhost:$ML_SERVICE_PORT"

# Wait for both processes
wait $ML_PID $BACKEND_PID
