/**
 * Sync Manager
 * Automatically syncs queued data when online
 * Handles retry logic and conflict resolution
 */

import offlineQueue from './offlineQueue';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

class SyncManager {
  constructor() {
    this.isSyncing = false;
    this.syncListeners = [];
    this.autoSyncEnabled = true;
  }

  /**
   * Get auth token from storage
   */
  getToken() {
    return localStorage.getItem('token') || sessionStorage.getItem('token');
  }

  /**
   * Start sync process
   * @returns {Promise<object>} - Sync result
   */
  async sync() {
    // Prevent concurrent syncs
    if (this.isSyncing) {
      console.log('⏳ Sync already in progress');
      return { status: 'already_syncing' };
    }

    // Check if online
    if (!navigator.onLine) {
      console.log('🔴 Cannot sync: Offline');
      return { status: 'offline' };
    }

    this.isSyncing = true;
    this.notifyListeners({ status: 'syncing', progress: 0 });

    try {
      const pending = await offlineQueue.getPending();
      
      if (pending.length === 0) {
        console.log('✓ No items to sync');
        this.notifyListeners({ 
          status: 'complete', 
          successCount: 0, 
          failCount: 0 
        });
        return { status: 'complete', successCount: 0, failCount: 0 };
      }

      console.log(`🔄 Syncing ${pending.length} items...`);

      let successCount = 0;
      let failCount = 0;

      for (let i = 0; i < pending.length; i++) {
        const item = pending[i];
        
        try {
          // Mark as syncing
          await offlineQueue.markSyncing(item.id);

          // Send request to backend
          const response = await fetch(`${API_BASE_URL}${item.data.endpoint}`, {
            method: item.data.method,
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${this.getToken()}`
            },
            body: JSON.stringify(item.data.data)
          });

          if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error || `HTTP ${response.status}`);
          }

          // Remove from queue on success
          await offlineQueue.remove(item.id);
          successCount++;
          
          console.log(`✓ Synced ${item.type} (${i + 1}/${pending.length})`);

          // Notify progress
          this.notifyListeners({
            status: 'syncing',
            progress: Math.round(((i + 1) / pending.length) * 100),
            current: i + 1,
            total: pending.length
          });

        } catch (error) {
          console.error(`✗ Failed to sync ${item.type}:`, error.message);
          
          // Mark as failed
          await offlineQueue.markFailed(item.id, error.message);
          failCount++;
        }
      }

      console.log(`✓ Sync complete: ${successCount} success, ${failCount} failed`);

      this.notifyListeners({
        status: 'complete',
        successCount,
        failCount
      });

      return { status: 'complete', successCount, failCount };

    } catch (error) {
      console.error('✗ Sync error:', error);
      this.notifyListeners({ status: 'error', error: error.message });
      return { status: 'error', error: error.message };
    } finally {
      this.isSyncing = false;
    }
  }

  /**
   * Add sync listener
   * @param {Function} callback - Callback function
   * @returns {Function} - Unsubscribe function
   */
  onSync(callback) {
    this.syncListeners.push(callback);
    
    // Return unsubscribe function
    return () => {
      this.syncListeners = this.syncListeners.filter(cb => cb !== callback);
    };
  }

  /**
   * Notify all listeners
   * @param {object} data - Sync data
   */
  notifyListeners(data) {
    this.syncListeners.forEach(callback => {
      try {
        callback(data);
      } catch (error) {
        console.error('Sync listener error:', error);
      }
    });
  }

  /**
   * Get sync status
   * @returns {object}
   */
  getStatus() {
    return {
      isSyncing: this.isSyncing,
      autoSyncEnabled: this.autoSyncEnabled
    };
  }

  /**
   * Enable auto-sync
   */
  enableAutoSync() {
    this.autoSyncEnabled = true;
    console.log('✓ Auto-sync enabled');
  }

  /**
   * Disable auto-sync
   */
  disableAutoSync() {
    this.autoSyncEnabled = false;
    console.log('✓ Auto-sync disabled');
  }

  /**
   * Setup auto-sync on network restore
   */
  setupAutoSync() {
    if (typeof window === 'undefined') return;

    // Listen for online event
    window.addEventListener('online', () => {
      if (this.autoSyncEnabled) {
        console.log('🌐 Network restored - triggering auto-sync');
        setTimeout(() => this.sync(), 1000); // Delay to ensure connection is stable
      }
    });

    // Listen for offline event
    window.addEventListener('offline', () => {
      console.log('📴 Network lost');
    });

    console.log('✓ Auto-sync listeners registered');
  }

  /**
   * Retry all failed items
   * @returns {Promise<object>}
   */
  async retryFailed() {
    const failed = await offlineQueue.getFailed();
    
    if (failed.length === 0) {
      console.log('No failed items to retry');
      return { status: 'no_failed_items' };
    }

    console.log(`🔄 Retrying ${failed.length} failed items...`);

    // Reset failed items to pending
    for (const item of failed) {
      await offlineQueue.retryFailed(item.id);
    }

    // Trigger sync
    return this.sync();
  }

  /**
   * Get sync statistics
   * @returns {Promise<object>}
   */
  async getStats() {
    const queueStats = await offlineQueue.getStats();
    
    return {
      ...queueStats,
      isSyncing: this.isSyncing,
      autoSyncEnabled: this.autoSyncEnabled,
      isOnline: navigator.onLine
    };
  }
}

// Export singleton instance
const syncManager = new SyncManager();

// Setup auto-sync on module load
if (typeof window !== 'undefined') {
  syncManager.setupAutoSync();
}

export default syncManager;
