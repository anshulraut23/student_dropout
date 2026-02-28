import cron from 'node-cron';
import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';
import { fileURLToPath } from 'url';

const execAsync = promisify(exec);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class ModelRetrainingService {
  constructor() {
    this.isRetraining = false;
    this.lastRetrainTime = null;
    this.lastRetrainStatus = null;
  }

  /**
   * Start the automated retraining scheduler
   * Runs every night at 2 AM
   */
  startScheduler() {
    // Schedule: Run at 2 AM every day
    // Cron format: minute hour day month weekday
    // '0 2 * * *' = At 02:00 every day
    
    const schedule = '0 2 * * *'; // 2 AM daily
    
    console.log('🤖 Model Retraining Scheduler Started');
    console.log(`📅 Schedule: Daily at 2:00 AM`);
    
    cron.schedule(schedule, async () => {
      console.log('\n' + '='.repeat(60));
      console.log('🤖 SCHEDULED MODEL RETRAINING TRIGGERED');
      console.log('='.repeat(60));
      await this.retrainModel();
    });

    // Also allow manual trigger via API
    console.log('💡 Manual retraining available via POST /api/ml/retrain');
  }

  /**
   * Execute model retraining
   */
  async retrainModel() {
    if (this.isRetraining) {
      console.log('⚠️  Retraining already in progress, skipping...');
      return {
        success: false,
        message: 'Retraining already in progress'
      };
    }

    this.isRetraining = true;
    const startTime = new Date();

    try {
      console.log(`\n🔄 Starting model retraining at ${startTime.toISOString()}`);
      
      // Path to ML service
      const mlServicePath = path.join(__dirname, '../../ml-service');
      
      // Execute Python retraining script
      const command = process.platform === 'win32'
        ? `cd "${mlServicePath}" && python auto_retrain.py`
        : `cd "${mlServicePath}" && python3 auto_retrain.py`;
      
      console.log(`📝 Executing: ${command}`);
      
      const { stdout, stderr } = await execAsync(command, {
        maxBuffer: 10 * 1024 * 1024 // 10MB buffer
      });
      
      if (stdout) console.log(stdout);
      if (stderr) console.error('Stderr:', stderr);
      
      const endTime = new Date();
      const duration = ((endTime - startTime) / 1000).toFixed(2);
      
      this.lastRetrainTime = endTime;
      this.lastRetrainStatus = 'success';
      
      console.log(`\n✅ Model retraining completed successfully in ${duration}s`);
      console.log('='.repeat(60) + '\n');
      
      return {
        success: true,
        message: 'Model retrained successfully',
        duration: `${duration}s`,
        timestamp: endTime.toISOString()
      };
      
    } catch (error) {
      const endTime = new Date();
      const duration = ((endTime - startTime) / 1000).toFixed(2);
      
      this.lastRetrainTime = endTime;
      this.lastRetrainStatus = 'failed';
      
      console.error(`\n❌ Model retraining failed after ${duration}s`);
      console.error('Error:', error.message);
      console.log('='.repeat(60) + '\n');
      
      return {
        success: false,
        message: 'Model retraining failed',
        error: error.message,
        duration: `${duration}s`,
        timestamp: endTime.toISOString()
      };
      
    } finally {
      this.isRetraining = false;
    }
  }

  /**
   * Get retraining status
   */
  getStatus() {
    return {
      isRetraining: this.isRetraining,
      lastRetrainTime: this.lastRetrainTime,
      lastRetrainStatus: this.lastRetrainStatus
    };
  }
}

export default new ModelRetrainingService();
