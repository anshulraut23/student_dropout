// Sync Manager - Automatically syncs queued data when online

import offlineQueue from './offlineQueue';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

class SyncManager {
  constructor() {
    this.isSyncing = false;
    this.syncListeners = [];
  }

  // Get auth token
  getToken() {
    return localStorage.getItem('token') || sessionStorage.getItem('token');
  }

  // Start sync process
  async sync() {
    if (this.isSyncing) {
      console.log('⏳ Sync already in progress');
      return;
    }

    if (!navigator.onLine) {
      console.log('🔴 Cannot sync: Offline');
      return;
    }

    this.isSyncing = true;
    this.notifyListeners({ status: 'syncing', progress: 0 });

    try {
      const pending = await offlineQueue.getPending();
      
      if (pending.length === 0) {
        console.log('✓ No items to sync');
        this.notifyListeners({ status: 'complete', successCount: 0, failCount: 0 });
        return;
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
            throw new Error(`HTTP ${response.status}`);
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

    } catch (error) {
      console.error('✗ Sync error:', error);
      this.notifyListeners({ status: 'error', error: error.message });
    } finally {
      this.isSyncing = false;
    }
  }

  // Add sync listener
  onSync(callback) {
    this.syncListeners.push(callback);
    // Return unsubscribe function
    return () => {
      this.syncListeners = this.syncListeners.filter(cb => cb !== callback);
    };
  }

  // Notify all listeners
  notifyListeners(data) {
    this.syncListeners.forEach(callback => {
      try {
        callback(data);
      } catch (error) {
        console.error('Sync listener error:', error);
      }
    });
  }

  // Get sync status
  getStatus() {
    return {
      isSyncing: this.isSyncing
    };
  }
}

export default new SyncManager();
