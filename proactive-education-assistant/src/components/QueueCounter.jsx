import { useState, useEffect } from 'react';
import { FiClock } from 'react-icons/fi';
import offlineQueue from '../services/offlineQueue';

export default function QueueCounter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const loadCount = async () => {
      const queueCount = await offlineQueue.getCount();
      setCount(queueCount);
    };

    loadCount();
    
    // Refresh every 2 seconds
    const interval = setInterval(loadCount, 2000);
    
    return () => clearInterval(interval);
  }, []);

  if (count === 0) return null;

  return (
    <div className="flex items-center gap-2 px-3 py-1.5 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
      <FiClock size={14} />
      <span>{count} pending</span>
    </div>
  );
}
