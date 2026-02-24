import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    GEMINI_API_KEY = os.getenv('GEMINI_API_KEY')
    FLASK_PORT = int(os.getenv('FLASK_PORT', 5001))
    FLASK_ENV = os.getenv('FLASK_ENV', 'development')
    
    # Risk thresholds
    LOW_RISK_THRESHOLD = 0.3
    MEDIUM_RISK_THRESHOLD = 0.6
    HIGH_RISK_THRESHOLD = 0.8
    
    # Data tier thresholds
    TIER_0_MIN_DAYS = 14
    TIER_0_MIN_EXAMS = 1
    TIER_1_MIN_DAYS = 30
    TIER_1_MIN_EXAMS = 3
    TIER_2_MIN_DAYS = 60
    TIER_2_MIN_EXAMS = 5
