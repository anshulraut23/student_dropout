import { BrowserRouter } from "react-router-dom";
import { TeacherProvider } from "./context/TeacherContext";
import AppRoutes from "./routes/AppRoutes";

export default function App() {
  return (
    <BrowserRouter>
      <TeacherProvider>
        <AppRoutes />
      </TeacherProvider>
    </BrowserRouter>
  );
}
