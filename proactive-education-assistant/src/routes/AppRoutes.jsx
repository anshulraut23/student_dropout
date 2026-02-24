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
import AttendanceHistoryPage from "../pages/teacher/AttendanceHistoryPage";
import InterventionsHistoryPage from "../pages/teacher/InterventionsHistoryPage";
import MarksEntryPage from "../pages/teacher/MarksEntryPage";
import ScoreHistoryPage from "../pages/teacher/ScoreHistoryPage";
import GamificationPage from "../pages/teacher/GamificationPage";
import AddStudentPage from "../pages/teacher/AddStudentPage";
import MyClassesPage from "../pages/teacher/MyClassesPage";
import LoginPage from "../pages/teacher/LoginPage";
import FacultyConnect from "../pages/teacher/FacultyConnect";
import FacultyChat from "../pages/teacher/FacultyChat";

import MainLayout from "../layouts/MainLayout";

// Admin
import { AdminProvider } from "../context/AdminContext";
import AdminLayout from "../layouts/AdminLayout";
import AdminDashboard from "../pages/admin/AdminDashboard";
import TeacherManagement from "../pages/admin/TeacherManagement";
import ClassManagement from "../pages/admin/ClassManagement";
import SubjectManagement from "../pages/admin/SubjectManagement";
import ExamTemplateManagement from "../pages/admin/ExamTemplateManagement";
import Analytics from "../pages/admin/Analytics";
import AdminProfile from "../pages/admin/AdminProfile";

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
      <Route path="/about" element={<AboutPage />} />
      
      {/* Login Routes - Always Accessible */}
      <Route 
        path="/teacher/login" 
        element={
          isLoggedIn && userRole === "teacher" 
            ? <Navigate to="/teacher/dashboard" replace /> 
            : <LoginPage />
        } 
      />
      
      <Route 
        path="/admin/login" 
        element={
          isLoggedIn && userRole === "admin" 
            ? <Navigate to="/admin/dashboard" replace /> 
            : <LoginPage />
        } 
      />

      {/* Admin Routes */}
      {isLoggedIn && userRole === "admin" ? (
        <Route 
          path="/admin" 
          element={
            <AdminProvider>
              <AdminLayout />
            </AdminProvider>
          }
        >
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="teachers" element={<TeacherManagement />} />
          <Route path="classes" element={<ClassManagement />} />
          <Route path="subjects" element={<SubjectManagement />} />
          <Route path="exam-templates" element={<ExamTemplateManagement />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="profile" element={<AdminProfile />} />
        </Route>
      ) : (
        <Route path="/admin/*" element={<Navigate to="/admin/login" replace />} />
      )}

      {/* Teacher Routes */}
      {isLoggedIn && userRole === "teacher" ? (
        <>
          <Route element={<MainLayout />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/teacher/dashboard" element={<DashboardPage />} />
            <Route path="/my-classes" element={<MyClassesPage />} />
            <Route path="/students" element={<StudentListPage />} />
            <Route path="/students/:id" element={<StudentProfilePage />} />
            <Route path="/add-student" element={<AddStudentPage />} />
            <Route path="/teacher/marks/entry/:examId" element={<MarksEntryPage />} />
            <Route path="/data-entry" element={<DataEntryPage />} />
            <Route path="/attendance-history" element={<AttendanceHistoryPage />} />
            <Route path="/interventions-history" element={<InterventionsHistoryPage />} />
            <Route path="/score-history" element={<ScoreHistoryPage />} />
            <Route path="/gamification" element={<GamificationPage />} />
            <Route path="/faculty-connect" element={<FacultyConnect />} />
            <Route path="/faculty-chat" element={<FacultyChat />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/about" element={<AboutPage />} />
          </Route>
        </>
      ) : (
        <>
          <Route path="/dashboard" element={<Navigate to="/teacher/login" replace />} />
          <Route path="/teacher/dashboard" element={<Navigate to="/teacher/login" replace />} />
          <Route path="/my-classes" element={<Navigate to="/teacher/login" replace />} />
          <Route path="/students" element={<Navigate to="/teacher/login" replace />} />
          <Route path="/students/:id" element={<Navigate to="/teacher/login" replace />} />
          <Route path="/add-student" element={<Navigate to="/teacher/login" replace />} />
          <Route path="/teacher/marks/entry/:examId" element={<Navigate to="/teacher/login" replace />} />
          <Route path="/data-entry" element={<Navigate to="/teacher/login" replace />} />
          <Route path="/attendance-history" element={<Navigate to="/teacher/login" replace />} />
          <Route path="/interventions-history" element={<Navigate to="/teacher/login" replace />} />
          <Route path="/score-history" element={<Navigate to="/teacher/login" replace />} />
          <Route path="/gamification" element={<Navigate to="/teacher/login" replace />} />
          <Route path="/faculty-connect" element={<Navigate to="/teacher/login" replace />} />
          <Route path="/faculty-chat" element={<Navigate to="/teacher/login" replace />} />
          <Route path="/profile" element={<Navigate to="/teacher/login" replace />} />
        </>
      )}

      {/* Catch all - redirect to home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
