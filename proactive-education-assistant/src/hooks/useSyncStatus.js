// useSyncStatus Hook - Monitor sync status
import { useState, useEffect } from 'react';
import syncManager from '../sync/SyncManager';

export const useSyncStatus = () => {
  const [isSyncing, setIsSyncing] = useState(false);
  const [pendingCount, setPendingCount] = useState(0);
  const [lastSyncTime, setLastSyncTime] = useState(null);
  const [syncProgress, setSyncProgress] = useState(0);
  const [syncError, setSyncError] = useState(null);

  useEffect(() => {
    let unsubscribe;

    const initialize = async () => {
      try {
        // Get initial pending count
        const count = await syncManager.getPendingCount();
        setPendingCount(count);

        // Get last sync time
        const lastSync = syncManager.getLastSyncTime();
        setLastSyncTime(lastSync);

        // Subscribe to sync updates
        unsubscribe = syncManager.addSyncListener((data) => {
          if (data.status === 'started') {
            setIsSyncing(true);
            setSyncProgress(0);
            setSyncError(null);
          } else if (data.status === 'syncing') {
            setSyncProgress(data.progress || 0);
          } else if (data.status === 'completed') {
            setIsSyncing(false);
            setSyncProgress(100);
            setPendingCount(0);
            setLastSyncTime(new Date());
            setSyncError(null);
          } else if (data.status === 'failed') {
            setIsSyncing(false);
            setSyncError(data.error);
          }
        });

        // Refresh pending count every 30 seconds
        const interval = setInterval(async () => {
          const count = await syncManager.getPendingCount();
          setPendingCount(count);
        }, 30000);

        return () => {
          clearInterval(interval);
        };
      } catch (error) {
        console.error('Failed to initialize sync status:', error);
      }
    };

    initialize();

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  const triggerSync = async () => {
    try {
      await syncManager.sync();
    } catch (error) {
      console.error('Failed to trigger sync:', error);
      setSyncError(error.message);
    }
  };

  return {
    isSyncing,
    pendingCount,
    lastSyncTime,
    syncProgress,
    syncError,
    triggerSync,
  };
};

export default useSyncStatus;
