"""
Save ML Model Performance Metrics to Database
This script reads the model_metadata.json and saves it to the database
"""

import json
import os
import requests
import logging
from datetime import datetime
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def save_performance_to_database():
    """
    Read model metadata and save to database via backend API
    """
    try:
        # Read model metadata
        metadata_path = 'models/model_metadata.json'
        
        if not os.path.exists(metadata_path):
            logger.error(f"Model metadata file not found: {metadata_path}")
            return False
        
        with open(metadata_path, 'r') as f:
            metadata = json.load(f)
        
        logger.info(f"Loaded model metadata: {metadata['model_version']}")
        
        # Get backend URL and auth token from environment
        backend_url = os.getenv('BACKEND_URL', 'http://localhost:5000')
        auth_token = os.getenv('ADMIN_AUTH_TOKEN')
        
        if not auth_token:
            logger.warning("ADMIN_AUTH_TOKEN not set - attempting without authentication")
            logger.warning("This may fail if authentication is required")
        
        # Prepare payload for backend API
        payload = {
            'modelVersion': metadata['model_version'],
            'trainingSamples': metadata['training_samples'],
            'testSamples': metadata['test_samples'],
            'accuracy': metadata['metrics']['accuracy'],
            'precision': metadata['metrics']['precision'],
            'recall': metadata['metrics']['recall'],
            'f1Score': metadata['metrics']['f1_score'],
            'confusionMatrix': metadata['confusion_matrix'],
            'featureImportance': metadata['feature_importance'],
            'notes': f"Automated training - {metadata['data_source']}"
        }
        
        # Send to backend API
        headers = {
            'Content-Type': 'application/json'
        }
        
        if auth_token:
            headers['Authorization'] = f'Bearer {auth_token}'
        
        logger.info(f"Sending performance metrics to {backend_url}/api/dropout/model-performance")
        
        response = requests.post(
            f'{backend_url}/api/dropout/model-performance',
            json=payload,
            headers=headers,
            timeout=30
        )
        
        if response.status_code == 200:
            logger.info("✅ Performance metrics saved to database successfully!")
            logger.info(f"   Accuracy: {metadata['metrics']['accuracy']:.4f}")
            logger.info(f"   F1-Score: {metadata['metrics']['f1_score']:.4f}")
            return True
        else:
            logger.error(f"❌ Failed to save metrics to database")
            logger.error(f"   Status: {response.status_code}")
            logger.error(f"   Response: {response.text}")
            return False
            
    except FileNotFoundError as e:
        logger.error(f"File not found: {e}")
        return False
    except requests.exceptions.RequestException as e:
        logger.error(f"Network error: {e}")
        return False
    except Exception as e:
        logger.error(f"Unexpected error: {e}")
        return False

if __name__ == "__main__":
    success = save_performance_to_database()
    exit(0 if success else 1)
