import { useState, useEffect } from 'react';
import { FiRefreshCw } from 'react-icons/fi';
import offlineQueue from '../services/offlineQueue';
import syncManager from '../services/syncManager';

export default function SyncButton() {
  const [syncing, setSyncing] = useState(false);
  const [queueCount, setQueueCount] = useState(0);

  useEffect(() => {
    loadQueueCount();
    
    // Refresh count every 2 seconds
    const interval = setInterval(loadQueueCount, 2000);
    
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Listen to sync events
    const unsubscribe = syncManager.onSync((data) => {
      if (data.status === 'syncing') {
        setSyncing(true);
      } else if (data.status === 'complete' || data.status === 'error') {
        setSyncing(false);
        loadQueueCount();
      }
    });

    return unsubscribe;
  }, []);

  const loadQueueCount = async () => {
    const count = await offlineQueue.getCount();
    setQueueCount(count);
  };

  const handleSync = async () => {
    if (syncing || queueCount === 0) return;
    
    setSyncing(true);
    await syncManager.sync();
    await loadQueueCount();
    setSyncing(false);
  };

  if (queueCount === 0) return null;

  return (
    <button
      onClick={handleSync}
      disabled={syncing}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
        syncing
          ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
          : 'bg-blue-600 text-white hover:bg-blue-700'
      }`}
    >
      <FiRefreshCw className={syncing ? 'animate-spin' : ''} />
      {syncing ? 'Syncing...' : `Sync ${queueCount} item${queueCount > 1 ? 's' : ''}`}
    </button>
  );
}
