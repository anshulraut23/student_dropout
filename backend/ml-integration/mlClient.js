const axios = require('axios');

/**
 * ML Service Client
 * Communicates with Python Flask ML microservice
 */

class MLClient {
  constructor() {
    this.baseURL = process.env.ML_SERVICE_URL || 'http://localhost:5001';
    this.timeout = 30000; // 30 seconds
    
    this.client = axios.create({
      baseURL: this.baseURL,
      timeout: this.timeout,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
  
  /**
   * Check if ML service is healthy
   */
  async healthCheck() {
    try {
      const response = await this.client.get('/health');
      return {
        available: true,
        ...response.data
      };
    } catch (error) {
      return {
        available: false,
        error: error.message
      };
    }
  }
  
  /**
   * Get dropout risk prediction for a single student
   * @param {Object} payload - { student_id, features, metadata }
   * @returns {Promise<Object>} Prediction result
   */
  async predictRisk(payload) {
    try {
      const response = await this.client.post('/predict', payload);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      if (error.response) {
        // ML service returned an error
        return {
          success: false,
          error: error.response.data.error || 'Prediction failed',
          message: error.response.data.message,
          status: error.response.status
        };
      } else if (error.request) {
        // ML service not reachable
        return {
          success: false,
          error: 'ML service unavailable',
          message: 'Could not connect to ML prediction service'
        };
      } else {
        return {
          success: false,
          error: 'Request failed',
          message: error.message
        };
      }
    }
  }
  
  /**
   * Get batch predictions for multiple students
   * @param {Array} students - Array of { student_id, features }
   * @returns {Promise<Object>} Batch prediction results
   */
  async batchPredict(students) {
    try {
      const response = await this.client.post('/batch-predict', { students });
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }
}

module.exports = new MLClient();
