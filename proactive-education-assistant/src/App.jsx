import { useEffect } from "react";
import { BrowserRouter } from "react-router-dom";
import { TeacherProvider } from "./context/TeacherContext";
import { GamificationProvider } from "./context/GamificationContext";
import { ThemeProvider } from "./context/ThemeContext";
import AppRoutes from "./routes/AppRoutes";
import Chatbot from "./components/chatbot/Chatbot";
import offlineDataService from "./services/OfflineDataService";
import syncManager from "./sync/SyncManager";

export default function App() {
  useEffect(() => {
    // Initialize offline services
    const initializeOfflineServices = async () => {
      try {
        console.log('🔄 Initializing offline services...');
        await offlineDataService.initialize();
        await syncManager.initialize();
        console.log('✅ Offline services initialized successfully');
      } catch (error) {
        console.error('❌ Failed to initialize offline services:', error);
      }
    };

    initializeOfflineServices();
  }, []);

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-white">
        <BrowserRouter>
          <TeacherProvider>
            <GamificationProvider>
              <AppRoutes />
              <Chatbot />
            </GamificationProvider>
          </TeacherProvider>
        </BrowserRouter>
      </div>
    </ThemeProvider>
  );
}
