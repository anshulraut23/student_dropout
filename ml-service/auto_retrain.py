"""
Automated Model Retraining Script
Runs nightly to retrain the model with latest real data
"""

import sys
import os
from datetime import datetime
import logging

# Setup logging
log_dir = 'logs'
os.makedirs(log_dir, exist_ok=True)
log_file = os.path.join(log_dir, f'retrain_{datetime.now().strftime("%Y%m%d")}.log')

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler(log_file),
        logging.StreamHandler(sys.stdout)
    ]
)

logger = logging.getLogger(__name__)

def main():
    """Main retraining function"""
    try:
        logger.info("="*60)
        logger.info("🤖 AUTOMATED MODEL RETRAINING STARTED")
        logger.info("="*60)
        
        # Import and run the training script
        from generate_and_train import main as train_main
        
        logger.info("Starting training process...")
        train_main()
        
        logger.info("="*60)
        logger.info("✅ AUTOMATED RETRAINING COMPLETED SUCCESSFULLY")
        logger.info("="*60)
        
        return 0
        
    except Exception as e:
        logger.error("="*60)
        logger.error(f"❌ AUTOMATED RETRAINING FAILED: {e}")
        logger.error("="*60)
        return 1

if __name__ == "__main__":
    exit_code = main()
    sys.exit(exit_code)
