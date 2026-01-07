import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import { useTeacher } from "../../context/TeacherContext";
import { useTheme } from "../../context/ThemeContext";
import LanguageSelector from "../LanguageSelector";

// Mock teacher database (in real app, this would be an API call)
const MOCK_TEACHERS = {
  "pending@school.org": {
    email: "pending@school.org",
    password: "123",
    name: "Pending Teacher",
    status: "PENDING",
    assignedClasses: [],
    subject: "General Education",
  },
  "teacher1@school.org": {
    email: "teacher1@school.org",
    password: "123",
    name: "Sarah Johnson",
    status: "APPROVED",
    assignedClasses: ["Grade 6A"],
    subject: "Mathematics",
  },
  "teacher2@school.org": {
    email: "teacher2@school.org",
    password: "123",
    name: "Michael Chen",
    status: "APPROVED",
    assignedClasses: ["Grade 7A", "Grade 7B"],
    subject: "Science",
  },
  "admin": {
    email: "admin",
    password: "123",
    name: "Admin",
    role: "coordinator",
    status: "APPROVED",
    assignedClasses: [],
  },
};

function Modal({ isOpen, onClose, onSwitchToRegister, onLoginSuccess }) {
  if (!isOpen) return null;
  
  const { t } = useTranslation();
  const { theme } = useTheme();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("teacher");
  const [errorMessage, setErrorMessage] = useState("");
  const [pendingApproval, setPendingApproval] = useState(false);
  
  const { loginTeacher } = useTeacher();
  const navigate = useNavigate();

  const handleLogin = () => {
    setErrorMessage("");
    setPendingApproval(false);
    
    // Find teacher in mock database
    const teacher = MOCK_TEACHERS[email];
    
    if (!teacher || teacher.password !== password) {
      setErrorMessage("Invalid email or password");
      return;
    }
    
    // Check if teacher account is pending approval
    if (role === "teacher" && teacher.status === "PENDING") {
      setPendingApproval(true);
      setErrorMessage("Your account is awaiting admin approval. Please contact your coordinator.");
      return;
    }
    
    // Login successful
    if (role === "teacher") {
      loginTeacher(teacher);
      localStorage.setItem("loggedIn", "true");
      localStorage.setItem("userRole", "teacher");
      // Trigger custom event for route update
      window.dispatchEvent(new Event("localStorageUpdate"));
      
      // Close modal and navigate
      onClose();
      setTimeout(() => {
        navigate("/dashboard");
      }, 200);
      
      // Clear form
      setEmail("");
      setPassword("");
      setRole("teacher");
    } else if (role === "coordinator") {
      // Admin login
      localStorage.setItem("loggedIn", "true");
      localStorage.setItem("userRole", "admin");
      localStorage.setItem("adminData", JSON.stringify(teacher));
      // Trigger custom event for route update
      window.dispatchEvent(new Event("localStorageUpdate"));
      
      // Close modal and navigate
      onClose();
      setTimeout(() => {
        navigate("/admin/dashboard");
      }, 200);
      
      // Clear form
      setEmail("");
      setPassword("");
      setRole("teacher");
    }
  };
  
  return (
    // Overlay (click outside closes)
    <div
      className="fixed inset-0 z-100 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      {/* Modal box */}
      <div
        className={`rounded-2xl w-[90%] max-w-md p-8 relative max-h-[90vh] overflow-y-auto ${
          theme === 'dark' 
            ? 'bg-gray-800 shadow-2xl shadow-black/50' 
            : 'bg-white shadow-2xl shadow-blue-200/30'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Section */}
        <div className="flex flex-col items-center mb-8">
          {/* Logo */}
          <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-teal-500 rounded-full flex items-center justify-center shadow-lg mb-6">
            <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          
          <h1 className={`text-2xl font-bold text-center mb-2 ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            {t('app.brand_full', 'Proactive Education Assistant')}
          </h1>
          <p className={`text-sm text-center leading-relaxed ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          }`}>
            {t('landing.early_detection', 'Helping educators identify and support at-risk students early.')}
          </p>

          {/* Language Selector */}
          <div className="flex justify-center mt-4">
            <LanguageSelector />
          </div>
        </div>

        {/* Divider */}
        <div className={`h-px mb-6 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'}`}></div>

        {/* Form Content */}
        <div className="space-y-5">
          {/* Error/Pending Message */}
          {errorMessage && (
            <div className={`p-3 rounded-lg text-sm ${
              pendingApproval 
                ? 'bg-yellow-50 border border-yellow-200 text-yellow-800'
                : 'bg-red-50 border border-red-200 text-red-800'
            }`}>
              <div className="flex items-start gap-2">
                {pendingApproval ? (
                  <svg className="w-4 h-4 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                )}
                <span>{errorMessage}</span>
              </div>
            </div>
          )}
          
          {/* Role Selection */}
          <div>
            <label className={`block text-sm font-semibold mb-3 ${
              theme === 'dark' ? 'text-gray-200' : 'text-gray-800'
            }`}>
              {t('login.select_role', 'Select Your Role')}
            </label>
            <div className="space-y-2.5">
              <label className={`flex items-center gap-3 px-4 py-3.5 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                role === 'teacher' 
                  ? 'border-blue-500 bg-blue-50/80 shadow-md shadow-blue-200' 
                  : (theme === 'dark'
                      ? 'border-gray-600 bg-gray-700/50 hover:border-blue-400 hover:shadow-md'
                      : 'border-gray-300 hover:border-blue-400 hover:shadow-md hover:bg-blue-50/30')
              }`}>
                <input
                  type="radio"
                  name="role"
                  value="teacher"
                  checked={role === "teacher"}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-5 h-5 text-blue-600 cursor-pointer"
                />
                <span className={`text-sm font-medium ${
                  role === 'teacher' ? 'text-blue-700' : (theme === 'dark' ? 'text-gray-200' : 'text-gray-700')
                }`}>{t('signup.role_teacher', 'Teacher / Field Worker')}</span>
              </label>
              
              <label className={`flex items-center gap-3 px-4 py-3.5 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                role === 'coordinator' 
                  ? 'border-blue-500 bg-blue-50/80 shadow-md shadow-blue-200' 
                  : (theme === 'dark'
                      ? 'border-gray-600 bg-gray-700/50 hover:border-blue-400 hover:shadow-md'
                      : 'border-gray-300 hover:border-blue-400 hover:shadow-md hover:bg-blue-50/30')
              }`}>
                <input
                  type="radio"
                  name="role"
                  value="coordinator"
                  checked={role === "coordinator"}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-5 h-5 text-blue-600 cursor-pointer"
                />
                <span className={`text-sm font-medium ${
                  role === 'coordinator' ? 'text-blue-700' : (theme === 'dark' ? 'text-gray-200' : 'text-gray-700')
                }`}>{t('signup.role_admin', 'Coordinator / Admin')}</span>
              </label>
            </div>
          </div>

          {/* Email Input */}
          <div>
            <label className={`block text-xs font-semibold mb-2.5 uppercase tracking-wide ${
              theme === 'dark' ? 'text-gray-200' : 'text-gray-800'
            }`}>
              {t('login.email_label', 'Email Address')}
            </label>
            <input 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              placeholder={t('login.email_placeholder', 'educator@school.org')}
              className={`w-full px-4 py-3 rounded-xl border-2 text-sm font-medium
                         placeholder-gray-400
                         focus:outline-none focus:ring-2 focus:ring-offset-0
                         transition-all duration-200 ${
                           email 
                             ? 'bg-blue-50/80 border-blue-400 text-gray-900 focus:border-blue-500 focus:ring-blue-300' 
                             : (theme === 'dark' 
                                 ? 'bg-gray-700/80 border-gray-600 text-gray-100 focus:border-blue-400 focus:ring-blue-400' 
                                 : 'bg-gray-50 border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-blue-300')
                         }`}
            />    
          </div>

          {/* Password Input */}
          <div>
            <label className={`block text-xs font-semibold mb-2.5 uppercase tracking-wide ${
              theme === 'dark' ? 'text-gray-200' : 'text-gray-800'
            }`}>
              {t('login.password_label', 'Password')}
            </label>
            <input 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              placeholder={t('login.password_placeholder', 'Enter your password')}
              className={`w-full px-4 py-3 rounded-xl border-2 text-sm font-medium
                         placeholder-gray-400
                         focus:outline-none focus:ring-2 focus:ring-offset-0
                         transition-all duration-200 ${
                           password 
                             ? 'bg-blue-50/80 border-blue-400 text-gray-900 focus:border-blue-500 focus:ring-blue-300' 
                             : (theme === 'dark' 
                                 ? 'bg-gray-700/80 border-gray-600 text-gray-100 focus:border-blue-400 focus:ring-blue-400' 
                                 : 'bg-gray-50 border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-blue-300')
                         }`}
            />
          </div>
        </div>

        {/* Sign In Button */}
        <button 
          onClick={handleLogin}
          className="w-full mt-8 bg-gradient-to-r from-blue-600 to-blue-500 text-white
                     font-bold py-3.5 rounded-xl text-base
                     hover:from-blue-700 hover:to-blue-600 hover:shadow-lg
                     focus:outline-none focus:ring-4 focus:ring-blue-300/50
                     active:scale-95
                     transition-all duration-200
                     shadow-md"
        >
          {t('login.sign_in_button', 'Sign In')}
        </button>

        {/* Helper Info Section */}
        <div className={`mt-8 p-4 rounded-xl border ${
          theme === 'dark' 
            ? 'bg-gray-700/50 border-gray-600' 
            : 'bg-blue-50 border-blue-200'
        }`}>
          <p className={`text-xs flex items-center justify-center gap-2 mb-3 ${
            theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
          }`}>
            <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            {t('login.offline_note', 'Works offline after first login.')}
          </p>
          
          <div className={`text-xs space-y-2 ${
            theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
          }`}>
            <p className="font-semibold text-center">{t('login.demo_credentials', 'Demo Credentials:')}</p>
            <div className={`text-center space-y-1 p-2 rounded-lg ${
              theme === 'dark' ? 'bg-gray-700/50' : 'bg-white/60'
            }`}>
              <p>{t('login.teacher_demo', 'Teacher')}: <span className="font-semibold text-blue-600">teacher1@school.org</span></p>
              <p>{t('login.admin_demo', 'Admin')}: <span className="font-semibold text-blue-600">admin</span></p>
              <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>{t('login.password_label', 'Password')}: <span className="font-mono">123</span></p>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className={`h-px my-6 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'}`}></div>

        {/* Switch to Register */}
        <div className="text-center">
          <p className={`text-sm mb-3 ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          }`}>{t('login.no_account', "Don't have an account?")}</p>
          <button
            onClick={onSwitchToRegister}
            className="w-full py-2.5 px-4 rounded-xl border-2 border-blue-600 text-blue-600 font-semibold
                       hover:bg-blue-50 hover:border-blue-700
                       dark:hover:bg-blue-600/20 dark:border-blue-400 dark:text-blue-400
                       transition-all duration-200"
          >
            {t('signup.page_title', 'Create Account')}
          </button>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className={`absolute top-5 right-5 rounded-full p-2.5 transition-all ${
            theme === 'dark' 
              ? 'text-gray-500 hover:text-gray-200 hover:bg-gray-700' 
              : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
          }`}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}

export default Modal;