@echo off
echo Starting ML Dropout Prediction Service...
echo.

cd ml-service

if not exist venv (
    echo Creating Python virtual environment...
    python -m venv venv
    echo.
)

echo Activating virtual environment...
call venv\Scripts\activate

if not exist .env (
    echo Creating .env file from template...
    copy .env.example .env
    echo.
    echo IMPORTANT: Edit ml-service\.env and add your GEMINI_API_KEY
    echo Get your key from: https://makersuite.google.com/app/apikey
    echo.
)

echo Installing Python dependencies...
pip install -r requirements.txt
echo.

if not exist models\dropout_model.pkl (
    echo.
    echo ============================================================
    echo TRAINING INITIAL ML MODEL
    echo ============================================================
    echo.
    echo No trained model found. Training Random Forest model...
    python generate_and_train.py
    echo.
    echo Model training complete!
    echo.
    pause
)

echo Starting Flask ML service on port 5001...
echo.
python app.py

pause
