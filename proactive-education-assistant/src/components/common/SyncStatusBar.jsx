// Sync Status Bar Component
import React from 'react';
import { RefreshCw, CheckCircle, AlertCircle, Clock } from 'lucide-react';
import useSyncStatus from '../../hooks/useSyncStatus';
import useNetworkStatus from '../../hooks/useNetworkStatus';

const SyncStatusBar = () => {
  const { isSyncing, pendingCount, lastSyncTime, syncProgress, syncError, triggerSync } = useSyncStatus();
  const { isOnline } = useNetworkStatus();

  const formatLastSync = (date) => {
    if (!date) return 'Never';
    
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  return (
    <div className="bg-white border-t border-gray-200 px-4 py-2 flex items-center justify-between text-sm">
      {/* Left side - Sync status */}
      <div className="flex items-center gap-3">
        {isSyncing ? (
          <>
            <RefreshCw className="w-4 h-4 text-blue-500 animate-spin" />
            <span className="text-gray-700">Syncing... {syncProgress}%</span>
          </>
        ) : syncError ? (
          <>
            <AlertCircle className="w-4 h-4 text-red-500" />
            <span className="text-red-600">Sync failed</span>
          </>
        ) : (
          <>
            <CheckCircle className="w-4 h-4 text-green-500" />
            <span className="text-gray-600">
              Last sync: {formatLastSync(lastSyncTime)}
            </span>
          </>
        )}
      </div>

      {/* Right side - Pending count and sync button */}
      <div className="flex items-center gap-3">
        {pendingCount > 0 && (
          <div className="flex items-center gap-1 text-orange-600">
            <Clock className="w-4 h-4" />
            <span className="font-medium">{pendingCount} pending</span>
          </div>
        )}

        {isOnline && !isSyncing && pendingCount > 0 && (
          <button
            onClick={triggerSync}
            className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors flex items-center gap-1"
          >
            <RefreshCw className="w-3 h-3" />
            Sync Now
          </button>
        )}

        {!isOnline && (
          <span className="text-gray-500 text-xs">Offline</span>
        )}
      </div>
    </div>
  );
};

export default SyncStatusBar;
