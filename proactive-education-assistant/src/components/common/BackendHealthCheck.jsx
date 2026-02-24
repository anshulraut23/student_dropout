import { useState, useEffect } from 'react';
import { FaCheckCircle, FaExclamationTriangle, FaSpinner } from 'react-icons/fa';

export default function BackendHealthCheck() {
  const [status, setStatus] = useState('checking'); // checking, online, offline
  const [showWarning, setShowWarning] = useState(false);

  useEffect(() => {
    checkBackendHealth();
    const interval = setInterval(checkBackendHealth, 30000); // Check every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const checkBackendHealth = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/health', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (response.ok) {
        setStatus('online');
        setShowWarning(false);
      } else {
        setStatus('offline');
        setShowWarning(true);
      }
    } catch (error) {
      setStatus('offline');
      setShowWarning(true);
    }
  };

  if (status === 'checking') {
    return null; // Don't show anything while checking
  }

  if (status === 'online') {
    return null; // Don't show anything when backend is healthy
  }

  // Show warning when backend is offline
  if (showWarning) {
    return (
      <div className="fixed top-0 left-0 right-0 z-50 bg-red-600 text-white px-4 py-3 shadow-lg">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FaExclamationTriangle className="text-xl flex-shrink-0" />
            <div>
              <p className="font-medium">Backend Server Offline</p>
              <p className="text-sm text-red-100">
                Cannot connect to the backend server. Please start the backend server on port 5000.
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowWarning(false)}
            className="text-white hover:text-red-100 text-xl font-bold"
          >
            ×
          </button>
        </div>
      </div>
    );
  }

  return null;
}
