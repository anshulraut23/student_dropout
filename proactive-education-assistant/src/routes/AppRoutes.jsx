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
import FacultyChat from "../pages/teacher/FacultyChat";
import AIAssistantPage from "../pages/teacher/AIAssistantPage";
import SuperAdminDashboard from "../pages/super-admin/SuperAdminDashboard";
import SuperAdminSchoolsPage from "../pages/super-admin/SuperAdminSchoolsPage";
import SuperAdminSchoolDetailPage from "../pages/super-admin/SuperAdminSchoolDetailPage";
import SuperAdminProfile from "../pages/super-admin/SuperAdminProfile";

import MainLayout from "../layouts/MainLayout";
import SuperAdminLayout from "../layouts/SuperAdminLayout";

// Admin
import { AdminProvider } from "../context/AdminContext";
import AdminLayout from "../layouts/AdminLayout";
import AdminDashboard from "../pages/admin/AdminDashboard";
import TeacherManagement from "../pages/admin/TeacherManagement";
import ClassManagement from "../pages/admin/ClassManagement";
import SubjectManagement from "../pages/admin/SubjectManagement";
import ExamTemplateManagement from "../pages/admin/ExamTemplateManagement";
import ExamManagement from "../pages/admin/ExamManagement";
import Analytics from "../pages/admin/Analytics";
import AdminProfile from "../pages/admin/AdminProfile";
import DropoutManagementPage from "../pages/admin/DropoutManagementPage";
import ModelPerformancePage from "../pages/admin/ModelPerformancePage";

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
      
      {/* Super Admin Routes */}
      {isLoggedIn && userRole === "super_admin" ? (
        <Route path="/super-admin" element={<SuperAdminLayout />}>
          <Route index element={<Navigate to="/super-admin/dashboard" replace />} />
          <Route path="dashboard" element={<SuperAdminDashboard />} />
          <Route path="schools" element={<SuperAdminSchoolsPage />} />
          <Route path="schools/:schoolId" element={<SuperAdminSchoolDetailPage />} />
          <Route path="profile" element={<SuperAdminProfile />} />
        </Route>
      ) : (
        <>
          <Route path="/super-admin/dashboard" element={<Navigate to="/" replace />} />
          <Route path="/super-admin/schools" element={<Navigate to="/" replace />} />
          <Route path="/super-admin/schools/:schoolId" element={<Navigate to="/" replace />} />
          <Route path="/super-admin/profile" element={<Navigate to="/" replace />} />
        </>
      )}

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
          <Route path="exams" element={<ExamManagement />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="dropout-management" element={<DropoutManagementPage />} />
          <Route path="model-performance" element={<ModelPerformancePage />} />
          <Route path="profile" element={<AdminProfile />} />
        </Route>
      ) : (
        <Route path="/admin/*" element={<Navigate to="/" replace />} />
      )}

      {/* Teacher Routes */}
      {isLoggedIn && userRole === "teacher" ? (
        <>
          <Route element={<MainLayout />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/teacher/dashboard" element={<DashboardPage />} />
            <Route path="/students" element={<StudentListPage />} />
            <Route path="/students/:id" element={<StudentProfilePage />} />
            <Route path="/teacher/marks/entry/:examId" element={<MarksEntryPage />} />
            <Route path="/data-entry" element={<DataEntryPage />} />
            <Route path="/attendance-history" element={<AttendanceHistoryPage />} />
            <Route path="/interventions-history" element={<InterventionsHistoryPage />} />
            <Route path="/faculty-chat" element={<FacultyChat />} />
            <Route path="/ai-assistant" element={<AIAssistantPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/about" element={<AboutPage />} />
          </Route>
        </>
      ) : (
        <>
          <Route path="/dashboard" element={<Navigate to="/" replace />} />
          <Route path="/teacher/dashboard" element={<Navigate to="/" replace />} />
          <Route path="/students" element={<Navigate to="/" replace />} />
          <Route path="/students/:id" element={<Navigate to="/" replace />} />
          <Route path="/teacher/marks/entry/:examId" element={<Navigate to="/" replace />} />
          <Route path="/data-entry" element={<Navigate to="/" replace />} />
          <Route path="/attendance-history" element={<Navigate to="/" replace />} />
          <Route path="/interventions-history" element={<Navigate to="/" replace />} />
          <Route path="/faculty-chat" element={<Navigate to="/" replace />} />
          <Route path="/ai-assistant" element={<Navigate to="/" replace />} />
          <Route path="/profile" element={<Navigate to="/" replace />} />
        </>
      )}

      {/* Catch all - redirect to home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
