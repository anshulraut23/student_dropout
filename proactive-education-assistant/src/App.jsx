// import { BrowserRouter } from "react-router-dom";
// import { TeacherProvider } from "./context/TeacherContext";
// import AppRoutes from "./routes/AppRoutes";
// import Chatbot from "./pages/chatbot/Chatbot";

// export default function App() {
//   return (
//     <div className="min-h-screen transition-colors duration-200 bg-white dark:bg-gray-900">
//       <BrowserRouter>
//         <TeacherProvider>
//           <AppRoutes />
//           <Chatbot />
//         </TeacherProvider>
//       </BrowserRouter>
//     </div>
//   );
// }



import { BrowserRouter } from "react-router-dom";
import { TeacherProvider } from "./context/TeacherContext";
import { GamificationProvider } from "./context/GamificationContext";
import AppRoutes from "./routes/AppRoutes";
import Chatbot from "./pages/chatbot/Chatbot";

export default function App() {
  return (
    <div className="min-h-screen transition-colors duration-200 bg-white dark:bg-gray-900">
      <BrowserRouter>
        <TeacherProvider>
          <GamificationProvider>
            <AppRoutes />
            <Chatbot />
          </GamificationProvider>
        </TeacherProvider>
      </BrowserRouter>
    </div>
  );
}
