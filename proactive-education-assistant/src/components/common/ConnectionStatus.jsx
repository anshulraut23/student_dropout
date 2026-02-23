import { useState, useEffect } from 'react';
import { FaCheckCircle, FaExclamationCircle, FaSpinner } from 'react-icons/fa';

export default function ConnectionStatus() {
  const [status, setStatus] = useState('checking'); // checking, connected, disconnected
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    checkConnection();
    const interval = setInterval(checkConnection, 10000); // Check every 10 seconds
    return () => clearInterval(interval);
  }, []);

  const checkConnection = async () => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000); // 3 second timeout

      const response = await fetch('http://localhost:5000/api/health', {
        method: 'GET',
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        setStatus('connected');
        setShowBanner(false);
      } else {
        setStatus('disconnected');
        setShowBanner(true);
      }
    } catch (error) {
      setStatus('disconnected');
      setShowBanner(true);
    }
  };

  // Don't show anything while checking initially
  if (status === 'checking') {
    return null;
  }

  // Show banner when disconnected
  if (showBanner && status === 'disconnected') {
    return (
      <div className="fixed top-0 left-0 right-0 z-[9999] bg-red-600 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FaExclamationCircle className="text-xl flex-shrink-0 animate-pulse" />
              <div>
                <p className="font-semibold text-sm">Backend Server Offline</p>
                <p className="text-xs text-red-100">
                  Cannot connect to http://localhost:5000 - Please start the backend server
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={checkConnection}
                className="px-3 py-1 bg-red-700 hover:bg-red-800 rounded text-xs font-medium transition-colors"
              >
                Retry
              </button>
              <button
                onClick={() => setShowBanner(false)}
                className="text-white hover:text-red-100 text-xl font-bold"
                title="Dismiss"
              >
                ×
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show small indicator in corner when connected
  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="bg-green-600 text-white px-3 py-2 rounded-lg shadow-lg flex items-center gap-2 text-sm">
        <FaCheckCircle className="text-green-200" />
        <span className="font-medium">Connected</span>
      </div>
    </div>
  );
}
