import { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import LandingPage from "../pages/LandingPage";
import DashboardPage from "../pages/teacher/DashboardPage";
import StudentListPage from "../pages/teacher/StudentListPage";
import StudentProfilePage from "../pages/teacher/StudentProfilePage";
import ProfilePage from "../pages/teacher/ProfilePage";
import MainLayout from "../layouts/MainLayout";

// Admin imports
import AdminLayout from "../layouts/AdminLayout";
import AdminDashboard from "../pages/admin/AdminDashboard";
import TeacherManagement from "../pages/admin/TeacherManagement";
import ClassManagement from "../pages/admin/ClassManagement";
import StudentOverview from "../pages/admin/StudentOverview";
import DataImport from "../pages/admin/DataImport";
import Analytics from "../pages/admin/Analytics";

export default function AppRoutes() {
  const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem("loggedIn"));
  const [userRole, setUserRole] = useState(localStorage.getItem("userRole"));

  // Listen for storage changes
  useEffect(() => {
    const handleStorageChange = () => {
      setIsLoggedIn(localStorage.getItem("loggedIn"));
      setUserRole(localStorage.getItem("userRole"));
    };

    // Check on mount and when window gains focus
    handleStorageChange();
    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("focus", handleStorageChange);

    // Custom event for same-window localStorage changes
    window.addEventListener("localStorageUpdate", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("focus", handleStorageChange);
      window.removeEventListener("localStorageUpdate", handleStorageChange);
    };
  }, []);

  return (
    <Routes>
      {/* Public Landing Page */}
      <Route path="/" element={<LandingPage />} />
      
      {/* Admin Routes */}
      {isLoggedIn && userRole === "admin" ? (
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="/admin/dashboard" />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="teachers" element={<TeacherManagement />} />
          <Route path="classes" element={<ClassManagement />} />
          <Route path="students" element={<StudentOverview />} />
          <Route path="data-import" element={<DataImport />} />
          <Route path="analytics" element={<Analytics />} />
        </Route>
      ) : (
        <Route path="/admin/*" element={<Navigate to="/" />} />
      )}

      {/* Teacher Routes */}
      {isLoggedIn && userRole !== "admin" ? (
        <Route element={<MainLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/students" element={<StudentListPage />} />
          <Route path="/students/:id" element={<StudentProfilePage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Route>
      ) : null}
      
      {/* Redirect to landing if not logged in */}
      {!isLoggedIn && (
        <>
          <Route path="/dashboard" element={<Navigate to="/" />} />
          <Route path="/students/*" element={<Navigate to="/" />} />
        </>
      )}
    </Routes>
  );
}
