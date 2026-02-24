// Offline Queue Manager - Stores data operations when offline

const QUEUE_KEY = 'offline_queue';
const MAX_RETRIES = 3;

class OfflineQueue {
  // Generate simple UUID
  generateId() {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  // Add item to queue
  async add(type, data) {
    const queue = await this.getQueue();
    const item = {
      id: this.generateId(),
      type, // 'attendance', 'marks', 'behavior', 'intervention'
      data,
      timestamp: new Date().toISOString(),
      retries: 0,
      status: 'pending'
    };
    queue.push(item);
    await this.saveQueue(queue);
    return item;
  }

  // Get all queued items
  async getQueue() {
    try {
      const stored = localStorage.getItem(QUEUE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error reading queue:', error);
      return [];
    }
  }

  // Save queue to localStorage
  async saveQueue(queue) {
    try {
      localStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
    } catch (error) {
      console.error('Error saving queue:', error);
      // Handle quota exceeded error
      if (error.name === 'QuotaExceededError') {
        console.warn('LocalStorage quota exceeded. Clearing old items...');
        // Keep only the last 50 items
        const trimmed = queue.slice(-50);
        localStorage.setItem(QUEUE_KEY, JSON.stringify(trimmed));
      }
    }
  }

  // Remove item from queue
  async remove(id) {
    const queue = await this.getQueue();
    const filtered = queue.filter(item => item.id !== id);
    await this.saveQueue(filtered);
  }

  // Get queue count
  async getCount() {
    const queue = await this.getQueue();
    return queue.filter(item => item.status === 'pending').length;
  }

  // Get all pending items
  async getPending() {
    const queue = await this.getQueue();
    return queue.filter(item => item.status === 'pending');
  }

  // Clear entire queue
  async clear() {
    localStorage.removeItem(QUEUE_KEY);
  }

  // Mark item as failed
  async markFailed(id, error) {
    const queue = await this.getQueue();
    const item = queue.find(i => i.id === id);
    if (item) {
      item.retries += 1;
      item.lastError = error;
      item.status = item.retries >= MAX_RETRIES ? 'failed' : 'pending';
      item.lastAttempt = new Date().toISOString();
      await this.saveQueue(queue);
    }
  }

  // Mark item as syncing
  async markSyncing(id) {
    const queue = await this.getQueue();
    const item = queue.find(i => i.id === id);
    if (item) {
      item.status = 'syncing';
      await this.saveQueue(queue);
    }
  }

  // Get failed items
  async getFailed() {
    const queue = await this.getQueue();
    return queue.filter(item => item.status === 'failed');
  }

  // Retry failed item
  async retryFailed(id) {
    const queue = await this.getQueue();
    const item = queue.find(i => i.id === id);
    if (item && item.status === 'failed') {
      item.status = 'pending';
      item.retries = 0;
      item.lastError = null;
      await this.saveQueue(queue);
    }
  }

  // Get queue statistics
  async getStats() {
    const queue = await this.getQueue();
    return {
      total: queue.length,
      pending: queue.filter(i => i.status === 'pending').length,
      syncing: queue.filter(i => i.status === 'syncing').length,
      failed: queue.filter(i => i.status === 'failed').length,
      oldestTimestamp: queue.length > 0 ? queue[0].timestamp : null
    };
  }
}

export default new OfflineQueue();
