#!/bin/bash

echo "Starting ML Dropout Prediction Service..."
echo ""

cd ml-service

if [ ! -d "venv" ]; then
    echo "Creating Python virtual environment..."
    python3 -m venv venv
    echo ""
fi

echo "Activating virtual environment..."
source venv/bin/activate

if [ ! -f ".env" ]; then
    echo "Creating .env file from template..."
    cp .env.example .env
    echo ""
    echo "IMPORTANT: Edit ml-service/.env and add your GEMINI_API_KEY"
    echo "Get your key from: https://makersuite.google.com/app/apikey"
    echo ""
    read -p "Press enter to continue..."
fi

echo "Installing Python dependencies..."
pip install -r requirements.txt
echo ""

echo "Starting Flask ML service on port 5001..."
echo ""
python app.py
