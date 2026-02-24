import { useState, useEffect } from 'react';
import { FiCheckCircle, FiAlertCircle, FiLoader } from 'react-icons/fi';
import syncManager from '../services/syncManager';

export default function SyncProgress() {
  const [syncStatus, setSyncStatus] = useState(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const unsubscribe = syncManager.onSync((status) => {
      setSyncStatus(status);
      setVisible(true);

      // Auto-hide after 5 seconds for complete/error status
      if (status.status === 'complete' || status.status === 'error') {
        setTimeout(() => setVisible(false), 5000);
      }
    });

    return unsubscribe;
  }, []);

  if (!visible || !syncStatus) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 animate-slide-up">
      <div className={`rounded-lg shadow-lg p-4 min-w-[300px] ${
        syncStatus.status === 'syncing' ? 'bg-blue-50 border border-blue-200' :
        syncStatus.status === 'complete' ? 'bg-green-50 border border-green-200' :
        'bg-red-50 border border-red-200'
      }`}>
        <div className="flex items-start gap-3">
          {syncStatus.status === 'syncing' && (
            <FiLoader className="text-blue-600 animate-spin mt-0.5" size={20} />
          )}
          {syncStatus.status === 'complete' && (
            <FiCheckCircle className="text-green-600 mt-0.5" size={20} />
          )}
          {syncStatus.status === 'error' && (
            <FiAlertCircle className="text-red-600 mt-0.5" size={20} />
          )}
          
          <div className="flex-1">
            {syncStatus.status === 'syncing' && (
              <>
                <p className="font-medium text-blue-900">Syncing offline data...</p>
                {syncStatus.progress !== undefined && (
                  <div className="mt-2">
                    <div className="flex justify-between text-sm text-blue-700 mb-1">
                      <span>{syncStatus.current} / {syncStatus.total}</span>
                      <span>{syncStatus.progress}%</span>
                    </div>
                    <div className="w-full bg-blue-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${syncStatus.progress}%` }}
                      ></div>
                    </div>
                  </div>
                )}
              </>
            )}
            
            {syncStatus.status === 'complete' && (
              <>
                <p className="font-medium text-green-900">All data synced successfully!</p>
                <p className="text-sm text-green-700 mt-1">
                  {syncStatus.successCount} item{syncStatus.successCount !== 1 ? 's' : ''} synced
                  {syncStatus.failCount > 0 && `, ${syncStatus.failCount} failed`}
                </p>
              </>
            )}
            
            {syncStatus.status === 'error' && (
              <>
                <p className="font-medium text-red-900">Sync failed</p>
                <p className="text-sm text-red-700 mt-1">{syncStatus.error}</p>
              </>
            )}
          </div>

          <button
            onClick={() => setVisible(false)}
            className="text-gray-400 hover:text-gray-600"
          >
            ×
          </button>
        </div>
      </div>
    </div>
  );
}
