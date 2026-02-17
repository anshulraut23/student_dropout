import { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import LandingPage from "../pages/LandingPage";
import PricingTable from "../pages/payement/PricingTable";
import PaymentUI from "../pages/payement/PaymentUI";
import AboutPage from "../pages/AboutPage";
import ForgotPassword from "../pages/auth/ForgotPassword";

import DashboardPage from "../pages/teacher/DashboardPage";
import StudentListPage from "../pages/teacher/StudentListPage";
import StudentProfilePage from "../pages/teacher/StudentProfilePage";
import ProfilePage from "../pages/teacher/ProfilePage";
import DataEntryPage from "../pages/teacher/DataEntryPage";

import MainLayout from "../layouts/MainLayout";

import GamificationPage from "../pages/teacher/GamificationPage";



// Admin
import { AdminProvider } from "../context/AdminContext";
import AdminLayout from "../layouts/AdminLayout";
import AdminDashboard from "../pages/admin/AdminDashboard";
import TeacherManagement from "../pages/admin/TeacherManagement";
import ClassManagement from "../pages/admin/ClassManagement";
import SubjectManagement from "../pages/admin/SubjectManagement";
import StudentOverview from "../pages/admin/StudentOverview";
import DataImport from "../pages/admin/DataImport";
import Analytics from "../pages/admin/Analytics";

export default function AppRoutes() {
  const readAuthState = () => {
    const tokenFromLocal = localStorage.getItem("token");
    const roleFromLocal = localStorage.getItem("role");
    const tokenFromSession = sessionStorage.getItem("token");
    const roleFromSession = sessionStorage.getItem("role");

    if (tokenFromLocal && roleFromLocal) {
      return { token: tokenFromLocal, role: roleFromLocal };
    }

    if (tokenFromSession && roleFromSession) {
      return { token: tokenFromSession, role: roleFromSession };
    }

    return { token: null, role: null };
  };

  const [authState, setAuthState] = useState(readAuthState());
  const isLoggedIn = Boolean(authState.token);
  const userRole = authState.role;

  useEffect(() => {
    const handleStorageChange = () => {
      setAuthState(readAuthState());
    };

    handleStorageChange();
    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("focus", handleStorageChange);
    window.addEventListener("localStorageUpdate", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("focus", handleStorageChange);
      window.removeEventListener("localStorageUpdate", handleStorageChange);
    };
  }, []);

  return (
    <Routes>

      {/* Public Pages */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/pricing" element={<PricingTable />} />
      <Route path="/payment" element={<PaymentUI />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />


      {/* ---------------- ADMIN ROUTES WITH CONTEXT ---------------- */}

      {isLoggedIn && userRole === "admin" ? (
        <Route path="/admin" element={
          <AdminProvider>
            <AdminLayout />
          </AdminProvider>
        }>
          <Route index element={<Navigate to="/admin/dashboard" />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="teachers" element={<TeacherManagement />} />
          <Route path="classes" element={<ClassManagement />} />
          <Route path="subjects" element={<SubjectManagement />} />
          <Route path="students" element={<StudentOverview />} />
          <Route path="data-import" element={<DataImport />} />
          <Route path="analytics" element={<Analytics />} />
        </Route>
      ) : (
        <Route path="/admin/*" element={<Navigate to="/" />} />
      )}


      {/* ---------------- TEACHER ROUTES ---------------- */}

      {isLoggedIn && userRole !== "admin" ? (
        <Route element={<MainLayout />}>

          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/teacher/dashboard" element={<DashboardPage />} />
          <Route path="/students" element={<StudentListPage />} />
          <Route path="/students/:id" element={<StudentProfilePage />} />
          <Route path="/data-entry" element={<DataEntryPage />} />
          <Route path="/gamification" element={<GamificationPage />} />

          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/about" element={<AboutPage />} />

        </Route>
      ) : null}


      {/* ---------------- PROTECTION ---------------- */}

      {!isLoggedIn && (
        <>
          <Route path="/dashboard" element={<Navigate to="/" />} />
          <Route path="/teacher/dashboard" element={<Navigate to="/" />} />
          <Route path="/students/*" element={<Navigate to="/" />} />
          <Route path="/data-entry" element={<Navigate to="/" />} />
          <Route path="/profile" element={<Navigate to="/" />} />
          
        </>
      )}

    </Routes>
  );
}
