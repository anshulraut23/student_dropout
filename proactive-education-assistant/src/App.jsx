import { BrowserRouter } from "react-router-dom";
import { TeacherProvider } from "./context/TeacherContext";
import { GamificationProvider } from "./context/GamificationContext";
import { ThemeProvider } from "./context/ThemeContext";
import AppRoutes from "./routes/AppRoutes";
import Chatbot from "./components/chatbot/Chatbot";

export default function App() {
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
