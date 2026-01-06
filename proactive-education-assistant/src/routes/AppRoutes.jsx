import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "../components/auth/login.jsx";
import DashboardPage from "../pages/DashboardPage";
import StudentListPage from "../pages/StudentListPage";
import StudentProfilePage from "../pages/StudentProfilePage";
import MainLayout from "../layouts/MainLayout";

export default function AppRoutes() {
  const isLoggedIn = localStorage.getItem("loggedIn");

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      
      {isLoggedIn ? (
        <Route element={<MainLayout />}>
          <Route path="/" element={<Navigate to="/dashboard" />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/students" element={<StudentListPage />} />
          <Route path="/students/:id" element={<StudentProfilePage />} />
        </Route>
      ) : (
        <Route path="/" element={<Navigate to="/dashboard" />} />
      )}
    </Routes>
  );
}
