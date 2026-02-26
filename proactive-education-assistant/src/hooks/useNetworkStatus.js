// useNetworkStatus Hook - Monitor network connectivity
import { useState, useEffect } from 'react';
import networkListener from '../sync/NetworkListener';

export const useNetworkStatus = () => {
  const [isOnline, setIsOnline] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    let unsubscribe;

    const initialize = async () => {
      try {
        // Initialize network listener
        await networkListener.initialize();
        
        // Get initial status
        const status = networkListener.getStatus();
        setIsOnline(status);
        setIsInitialized(true);

        // Subscribe to network changes
        unsubscribe = networkListener.addListener((online) => {
          setIsOnline(online);
        });
      } catch (error) {
        console.error('Failed to initialize network status:', error);
        setIsOnline(true); // Assume online if initialization fails
        setIsInitialized(true);
      }
    };

    initialize();

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  return { isOnline, isInitialized };
};

export default useNetworkStatus;
