import { BrowserRouter } from "react-router-dom";
import { useEffect, useState } from "react";
import { TeacherProvider } from "./context/TeacherContext";
import { GamificationProvider } from "./context/GamificationContext";
import { ThemeProvider } from "./context/ThemeContext";
import AppRoutes from "./routes/AppRoutes";
import Chatbot from "./components/chatbot/Chatbot";
import syncManager from "./services/syncManager";
import { useNetworkStatus } from "./hooks/useNetworkStatus";

// Toast Notification Component
function SyncToast({ message, type = 'info', onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const bgColor = {
    info: 'bg-blue-500',
    success: 'bg-green-500',
    error: 'bg-red-500'
  }[type] || 'bg-blue-500';

  return (
    <div className={`fixed bottom-4 right-4 ${bgColor} text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-slide-up`}>
      <div className="flex items-center gap-2">
        {type === 'info' && (
          <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        )}
        {type === 'success' && (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        )}
        {type === 'error' && (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
        )}
        <span className="text-sm font-medium">{message}</span>
      </div>
    </div>
  );
}

// Global Sync Manager Component
function GlobalSyncManager() {
  const { isOnline, wasOffline } = useNetworkStatus();
  const [toast, setToast] = useState(null);

  // Auto-sync when network is restored
  useEffect(() => {
    if (isOnline && wasOffline) {
      console.log('🔄 Network restored - triggering auto-sync');
      syncManager.sync();
    }
  }, [isOnline, wasOffline]);

  // Listen to sync events
  useEffect(() => {
    const unsubscribe = syncManager.onSync((data) => {
      if (data.status === 'syncing') {
        if (data.total) {
          setToast({
            message: `Syncing ${data.current}/${data.total} items...`,
            type: 'info'
          });
        } else {
          setToast({
            message: 'Syncing offline data...',
            type: 'info'
          });
        }
      } else if (data.status === 'complete') {
        if (data.successCount > 0) {
          setToast({
            message: `Sync complete! ${data.successCount} items synced.`,
            type: 'success'
          });
        }
        if (data.failCount > 0) {
          setToast({
            message: `Sync completed with ${data.failCount} errors.`,
            type: 'error'
          });
        }
      } else if (data.status === 'error') {
        setToast({
          message: 'Sync failed. Will retry later.',
          type: 'error'
        });
      }
    });

    return unsubscribe;
  }, []);

  return (
    <>
      {toast && (
        <SyncToast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-white">
        <BrowserRouter>
          <TeacherProvider>
            <GamificationProvider>
              <GlobalSyncManager />
              <AppRoutes />
              <Chatbot />
            </GamificationProvider>
          </TeacherProvider>
        </BrowserRouter>
      </div>
    </ThemeProvider>
  );
}
