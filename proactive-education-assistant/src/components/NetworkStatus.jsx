import { useNetworkStatus } from '../hooks/useNetworkStatus';

export default function NetworkStatus() {
  const { isOnline } = useNetworkStatus();

  return (
    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium ${
      isOnline 
        ? 'bg-green-100 text-green-700' 
        : 'bg-red-100 text-red-700'
    }`}>
      <span className={`w-2 h-2 rounded-full ${
        isOnline ? 'bg-green-500' : 'bg-red-500'
      } animate-pulse`}></span>
      {isOnline ? 'Online' : 'Offline'}
    </div>
  );
}
