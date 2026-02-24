import { useState, useEffect, lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

// Eager load critical pages (landing, login)
import LandingPage from "../pages/LandingPage";
import LoginPage from "../pages/teacher/LoginPage";
import MainLayout from "../layouts/MainLayout";

// Lazy load all other pages
const PricingTable = lazy(() => import("../pages/payement/PricingTable"));
const PaymentUI = lazy(() => import("../pages/payement/PaymentUI"));
const AboutPage = lazy(() => import("../pages/AboutPage"));
const ForgotPassword = lazy(() => import("../pages/auth/ForgotPassword"));

// Teacher pages - lazy loaded
const DashboardPage = lazy(() => import("../pages/teacher/DashboardPage"));
const StudentListPage = lazy(() => import("../pages/teacher/StudentListPage"));
const StudentProfilePage = lazy(() => import("../pages/teacher/StudentProfilePage"));
const ProfilePage = lazy(() => import("../pages/teacher/ProfilePage"));
const DataEntryPage = lazy(() => import("../pages/teacher/DataEntryPage"));
const AttendanceHistoryPage = lazy(() => import("../pages/teacher/AttendanceHistoryPage"));
const InterventionsHistoryPage = lazy(() => import("../pages/teacher/InterventionsHistoryPage"));
const MarksEntryPage = lazy(() => import("../pages/teacher/MarksEntryPage"));
const ScoreHistoryPage = lazy(() => import("../pages/teacher/ScoreHistoryPage"));
const GamificationPage = lazy(() => import("../pages/teacher/GamificationPage"));
const LeaderboardPage = lazy(() => import("../pages/teacher/LeaderboardPage"));
const AddStudentPage = lazy(() => import("../pages/teacher/AddStudentPage"));
const MyClassesPage = lazy(() => import("../pages/teacher/MyClassesPage"));
const FacultyConnect = lazy(() => import("../pages/teacher/FacultyConnect"));
const FacultyChat = lazy(() => import("../pages/teacher/FacultyChat"));

// Admin - lazy loaded
const AdminProvider = lazy(() => import("../context/AdminContext").then(m => ({ default: m.AdminProvider })));
const AdminLayout = lazy(() => import("../layouts/AdminLayout"));
const AdminDashboard = lazy(() => import("../pages/admin/AdminDashboard"));
const TeacherManagement = lazy(() => import("../pages/admin/TeacherManagement"));
const ClassManagement = lazy(() => import("../pages/admin/ClassManagement"));
const SubjectManagement = lazy(() => import("../pages/admin/SubjectManagement"));
const ExamTemplateManagement = lazy(() => import("../pages/admin/ExamTemplateManagement"));
const Analytics = lazy(() => import("../pages/admin/Analytics"));
const AdminProfile = lazy(() => import("../pages/admin/AdminProfile"));

// Loading fallback component
const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
  </div>
);

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
    <Suspense fallback={<LoadingSpinner />}>
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
            <Route path="/leaderboard" element={<LeaderboardPage />} />
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
          <Route path="/leaderboard" element={<Navigate to="/teacher/login" replace />} />
          <Route path="/faculty-connect" element={<Navigate to="/teacher/login" replace />} />
          <Route path="/faculty-chat" element={<Navigate to="/teacher/login" replace />} />
          <Route path="/profile" element={<Navigate to="/teacher/login" replace />} />
        </>
      )}

      {/* Catch all - redirect to home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
    </Suspense>
  );
}
