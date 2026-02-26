#!/bin/bash

# Start both Node.js backend and Python ML service
echo "🚀 Starting combined services..."

# Set environment variables
export ML_SERVICE_PORT=${ML_SERVICE_PORT:-5001}
export FLASK_PORT=${FLASK_PORT:-5001}
export PORT=${PORT:-10000}
export ML_SERVICE_URL="http://localhost:${ML_SERVICE_PORT}"

echo "📊 Backend will run on port $PORT"
echo "🤖 ML Service will run on port $ML_SERVICE_PORT"

# Start Python ML service in background
cd ml-service
echo "🤖 Starting ML service..."
gunicorn --bind 0.0.0.0:$ML_SERVICE_PORT --workers 2 --timeout 120 --daemon app:app
cd ..

# Wait for ML service to start
sleep 3

# Start Node.js backend (foreground - Render needs this)
cd backend
echo "🚀 Starting Node.js backend on port $PORT..."
exec node server.js
