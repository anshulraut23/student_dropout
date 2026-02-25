/**
 * Offline Queue Manager
 * Manages queue of operations to be synced when online
 * Uses storageAdapter for persistence
 */

import storageAdapter from './storageAdapter';

const QUEUE_KEY = 'offline_queue';
const MAX_RETRIES = 3;

class OfflineQueue {
  constructor() {
    this.initialized = false;
  }

  /**
   * Initialize the queue (load from storage)
   */
  async init() {
    if (this.initialized) return;
    
    try {
      const queue = await storageAdapter.get(QUEUE_KEY);
      if (!queue) {
        await storageAdapter.set(QUEUE_KEY, []);
      }
      this.initialized = true;
      console.log('📋 Offline queue initialized');
    } catch (error) {
      console.error('Failed to initialize offline queue:', error);
    }
  }

  /**
   * Generate unique ID
   */
  generateId() {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Add item to queue
   * @param {string} type - Operation type (e.g., 'attendance', 'marks')
   * @param {object} data - Operation data
   * @returns {Promise<object>} - Queue item
   */
  async add(type, data) {
    await this.init();

    const item = {
      id: this.generateId(),
      type,
      data,
      timestamp: new Date().toISOString(),
      retries: 0,
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    try {
      const queue = await this.getQueue();
      queue.push(item);
      await this.saveQueue(queue);
      
      console.log(`✅ Added to queue: ${type} (${item.id})`);
      return item;
    } catch (error) {
      console.error('Failed to add to queue:', error);
      throw error;
    }
  }

  /**
   * Get all items in queue
   * @returns {Promise<Array>}
   */
  async getQueue() {
    await this.init();
    
    try {
      const queue = await storageAdapter.get(QUEUE_KEY);
      return queue || [];
    } catch (error) {
      console.error('Failed to get queue:', error);
      return [];
    }
  }

  /**
   * Save queue to storage
   * @param {Array} queue
   */
  async saveQueue(queue) {
    try {
      await storageAdapter.set(QUEUE_KEY, queue);
    } catch (error) {
      console.error('Failed to save queue:', error);
      
      // Handle quota exceeded error
      if (error.name === 'QuotaExceededError') {
        console.warn('Storage quota exceeded. Trimming queue...');
        // Keep only the last 100 items
        const trimmed = queue.slice(-100);
        await storageAdapter.set(QUEUE_KEY, trimmed);
      }
    }
  }

  /**
   * Get pending items (status: 'pending')
   * @returns {Promise<Array>}
   */
  async getPending() {
    const queue = await this.getQueue();
    return queue.filter(item => item.status === 'pending');
  }

  /**
   * Get failed items (status: 'failed')
   * @returns {Promise<Array>}
   */
  async getFailed() {
    const queue = await this.getQueue();
    return queue.filter(item => item.status === 'failed');
  }

  /**
   * Remove item from queue
   * @param {string} id - Item ID
   */
  async remove(id) {
    const queue = await this.getQueue();
    const filtered = queue.filter(item => item.id !== id);
    await this.saveQueue(filtered);
    console.log(`🗑️ Removed from queue: ${id}`);
  }

  /**
   * Mark item as syncing
   * @param {string} id - Item ID
   */
  async markSyncing(id) {
    const queue = await this.getQueue();
    const item = queue.find(i => i.id === id);
    
    if (item) {
      item.status = 'syncing';
      item.lastAttempt = new Date().toISOString();
      await this.saveQueue(queue);
    }
  }

  /**
   * Mark item as failed
   * @param {string} id - Item ID
   * @param {string} error - Error message
   */
  async markFailed(id, error) {
    const queue = await this.getQueue();
    const item = queue.find(i => i.id === id);
    
    if (item) {
      item.retries += 1;
      item.lastError = error;
      item.lastAttempt = new Date().toISOString();
      
      // Mark as failed if max retries reached
      if (item.retries >= MAX_RETRIES) {
        item.status = 'failed';
        console.error(`❌ Item failed after ${MAX_RETRIES} retries: ${id}`);
      } else {
        item.status = 'pending'; // Retry
        console.warn(`⚠️ Item retry ${item.retries}/${MAX_RETRIES}: ${id}`);
      }
      
      await this.saveQueue(queue);
    }
  }

  /**
   * Retry failed item
   * @param {string} id - Item ID
   */
  async retryFailed(id) {
    const queue = await this.getQueue();
    const item = queue.find(i => i.id === id);
    
    if (item && item.status === 'failed') {
      item.status = 'pending';
      item.retries = 0;
      item.lastError = null;
      await this.saveQueue(queue);
      console.log(`🔄 Retrying failed item: ${id}`);
    }
  }

  /**
   * Get queue count
   * @returns {Promise<number>}
   */
  async getCount() {
    const queue = await this.getQueue();
    return queue.filter(item => item.status === 'pending').length;
  }

  /**
   * Get queue statistics
   * @returns {Promise<object>}
   */
  async getStats() {
    const queue = await this.getQueue();
    
    return {
      total: queue.length,
      pending: queue.filter(i => i.status === 'pending').length,
      syncing: queue.filter(i => i.status === 'syncing').length,
      failed: queue.filter(i => i.status === 'failed').length,
      oldestTimestamp: queue.length > 0 ? queue[0].timestamp : null,
      newestTimestamp: queue.length > 0 ? queue[queue.length - 1].timestamp : null
    };
  }

  /**
   * Clear entire queue
   */
  async clear() {
    await storageAdapter.set(QUEUE_KEY, []);
    console.log('🗑️ Queue cleared');
  }

  /**
   * Clear only synced/failed items
   */
  async clearCompleted() {
    const queue = await this.getQueue();
    const pending = queue.filter(item => item.status === 'pending' || item.status === 'syncing');
    await this.saveQueue(pending);
    console.log('🗑️ Completed items cleared');
  }
}

// Export singleton instance
export default new OfflineQueue();
