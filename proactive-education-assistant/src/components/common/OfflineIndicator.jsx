// Offline Indicator Component
import React from 'react';
import { WifiOff, Wifi } from 'lucide-react';
import useNetworkStatus from '../../hooks/useNetworkStatus';

const OfflineIndicator = () => {
  const { isOnline, isInitialized } = useNetworkStatus();

  if (!isInitialized) {
    return null;
  }

  if (isOnline) {
    return null; // Don't show anything when online
  }

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-yellow-500 text-white px-4 py-2 flex items-center justify-center gap-2 shadow-lg">
      <WifiOff className="w-5 h-5" />
      <span className="font-medium">Offline Mode</span>
      <span className="text-sm opacity-90">- Changes will sync when online</span>
    </div>
  );
};

export default OfflineIndicator;
