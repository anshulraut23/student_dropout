// Sync Manager - Orchestrates data synchronization
import SyncQueueRepository from '../repositories/SyncQueueRepository';
import networkListener from './NetworkListener';
import apiService from '../services/apiService';
import dbService from '../database/db';

class SyncManager {
  constructor() {
    this.isSyncing = false;
    this.lastSyncTime = null;
    this.syncListeners = [];
    this.autoSyncEnabled = true;
    this.syncInterval = null;
  }

  /**
   * Initialize sync manager
   */
  async initialize() {
    console.log('🔄 Initializing Sync Manager...');

    // Initialize network listener
    await networkListener.initialize();

    // Listen for network changes
    networkListener.addListener((isOnline) => {
      if (isOnline && this.autoSyncEnabled) {
        console.log('📡 Network online - triggering sync');
        this.sync();
      }
    });

    // Load last sync time
    await this.loadLastSyncTime();

    // Start periodic sync check (every 5 minutes when online)
    this.startPeriodicSync();

    console.log('✅ Sync Manager initialized');
  }

  /**
   * Start periodic sync
   */
  startPeriodicSync() {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
    }

    this.syncInterval = setInterval(async () => {
      if (networkListener.getStatus() && this.autoSyncEnabled && !this.isSyncing) {
        const pendingCount = await SyncQueueRepository.getUnsyncedCount();
        if (pendingCount > 0) {
          console.log(`🔄 Periodic sync: ${pendingCount} items pending`);
          await this.sync();
        }
      }
    }, 5 * 60 * 1000); // 5 minutes
  }

  /**
   * Stop periodic sync
   */
  stopPeriodicSync() {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
      this.syncInterval = null;
    }
  }

  /**
   * Main sync function
   */
  async sync(force = false) {
    // Check if already syncing
    if (this.isSyncing && !force) {
      console.log('⏳ Sync already in progress');
      return { success: false, message: 'Sync already in progress' };
    }

    // Check network status
    if (!networkListener.getStatus()) {
      console.log('📵 Cannot sync - device is offline');
      return { success: false, message: 'Device is offline' };
    }

    this.isSyncing = true;
    this.notifySyncListeners({ status: 'started', progress: 0 });

    try {
      console.log('🔄 Starting sync...');

      // Get unsynced items
      const unsyncedItems = await SyncQueueRepository.getUnsyncedParsed();
      
      if (unsyncedItems.length === 0) {
        console.log('✅ No items to sync');
        this.isSyncing = false;
        this.notifySyncListeners({ status: 'completed', progress: 100, synced: 0 });
        return { success: true, synced: 0 };
      }

      console.log(`📤 Syncing ${unsyncedItems.length} items...`);

      let syncedCount = 0;
      let failedCount = 0;

      // Process each item
      for (let i = 0; i < unsyncedItems.length; i++) {
        const item = unsyncedItems[i];
        const progress = Math.round(((i + 1) / unsyncedItems.length) * 100);

        try {
          await this.syncItem(item);
          await SyncQueueRepository.markAsSynced(item.id);
          syncedCount++;
          
          this.notifySyncListeners({
            status: 'syncing',
            progress,
            synced: syncedCount,
            total: unsyncedItems.length,
          });
        } catch (error) {
          console.error(`❌ Failed to sync item ${item.id}:`, error);
          await SyncQueueRepository.incrementRetry(item.id, error.message);
          failedCount++;
        }
      }

      // Update last sync time
      await this.updateLastSyncTime();

      // Fetch updated data from server
      await this.fetchUpdatedData();

      console.log(`✅ Sync completed: ${syncedCount} synced, ${failedCount} failed`);

      this.isSyncing = false;
      this.notifySyncListeners({
        status: 'completed',
        progress: 100,
        synced: syncedCount,
        failed: failedCount,
      });

      return { success: true, synced: syncedCount, failed: failedCount };
    } catch (error) {
      console.error('❌ Sync failed:', error);
      this.isSyncing = false;
      this.notifySyncListeners({ status: 'failed', error: error.message });
      return { success: false, error: error.message };
    }
  }

  /**
   * Sync a single item
   */
  async syncItem(item) {
    const { entity, action, payload } = item;

    console.log(`📤 Syncing ${entity} ${action}:`, payload.id);

    switch (entity) {
      case 'attendance':
        return await this.syncAttendance(action, payload);
      
      case 'marks':
        return await this.syncMarks(action, payload);
      
      case 'behavior':
        return await this.syncBehavior(action, payload);
      
      case 'interventions':
        return await this.syncIntervention(action, payload);
      
      default:
        throw new Error(`Unknown entity type: ${entity}`);
    }
  }

  /**
   * Sync attendance record
   */
  async syncAttendance(action, payload) {
    switch (action) {
      case 'CREATE':
      case 'UPDATE':
        return await apiService.markAttendance(payload);
      
      case 'DELETE':
        return await apiService.deleteAttendance(payload.id);
      
      default:
        throw new Error(`Unknown action: ${action}`);
    }
  }

  /**
   * Sync marks record
   */
  async syncMarks(action, payload) {
    switch (action) {
      case 'CREATE':
      case 'UPDATE':
        return await apiService.enterSingleMarks(payload);
      
      case 'DELETE':
        return await apiService.deleteMarks(payload.id);
      
      default:
        throw new Error(`Unknown action: ${action}`);
    }
  }

  /**
   * Sync behavior record
   */
  async syncBehavior(action, payload) {
    switch (action) {
      case 'CREATE':
        return await apiService.createBehaviorRecord(payload);
      
      case 'UPDATE':
        return await apiService.updateBehaviorRecord(payload.id, payload);
      
      case 'DELETE':
        return await apiService.deleteBehaviorRecord(payload.id);
      
      default:
        throw new Error(`Unknown action: ${action}`);
    }
  }

  /**
   * Sync intervention record
   */
  async syncIntervention(action, payload) {
    switch (action) {
      case 'CREATE':
        return await apiService.createIntervention(payload);
      
      case 'UPDATE':
        return await apiService.updateIntervention(payload.id, payload);
      
      case 'DELETE':
        return await apiService.deleteIntervention(payload.id);
      
      default:
        throw new Error(`Unknown action: ${action}`);
    }
  }

  /**
   * Fetch updated data from server after sync
   */
  async fetchUpdatedData() {
    console.log('📥 Fetching updated data from server...');

    try {
      // Fetch updated risk predictions
      // This will be implemented when we integrate with ML service
      
      // Fetch updated leaderboard
      // This will be implemented when we integrate with gamification service

      console.log('✅ Updated data fetched');
    } catch (error) {
      console.error('❌ Failed to fetch updated data:', error);
      // Don't throw - sync was successful even if fetch fails
    }
  }

  /**
   * Get pending changes count
   */
  async getPendingCount() {
    return await SyncQueueRepository.getUnsyncedCount();
  }

  /**
   * Get last sync time
   */
  getLastSyncTime() {
    return this.lastSyncTime;
  }

  /**
   * Load last sync time from database
   */
  async loadLastSyncTime() {
    try {
      const result = await dbService.getOne(
        "SELECT last_sync FROM sync_metadata WHERE entity = 'global' LIMIT 1"
      );
      
      if (result) {
        this.lastSyncTime = new Date(result.last_sync);
      }
    } catch (error) {
      console.error('Failed to load last sync time:', error);
    }
  }

  /**
   * Update last sync time
   */
  async updateLastSyncTime() {
    this.lastSyncTime = new Date();
    
    try {
      await dbService.execute(
        `INSERT OR REPLACE INTO sync_metadata (entity, last_sync, sync_count) 
         VALUES ('global', ?, COALESCE((SELECT sync_count FROM sync_metadata WHERE entity = 'global'), 0) + 1)`,
        [this.lastSyncTime.toISOString()]
      );
    } catch (error) {
      console.error('Failed to update last sync time:', error);
    }
  }

  /**
   * Add sync listener
   */
  addSyncListener(callback) {
    this.syncListeners.push(callback);
    
    return () => {
      this.syncListeners = this.syncListeners.filter(cb => cb !== callback);
    };
  }

  /**
   * Notify sync listeners
   */
  notifySyncListeners(data) {
    this.syncListeners.forEach(callback => {
      try {
        callback(data);
      } catch (error) {
        console.error('Sync listener callback failed:', error);
      }
    });
  }

  /**
   * Enable/disable auto sync
   */
  setAutoSync(enabled) {
    this.autoSyncEnabled = enabled;
    console.log(`🔄 Auto sync ${enabled ? 'enabled' : 'disabled'}`);
  }

  /**
   * Get sync statistics
   */
  async getStatistics() {
    return await SyncQueueRepository.getStatistics();
  }
}

// Export singleton instance
const syncManager = new SyncManager();
export default syncManager;
