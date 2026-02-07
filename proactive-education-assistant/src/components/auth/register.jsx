import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import { useTheme } from "../../context/ThemeContext";
import { useTeacher } from "../../context/TeacherContext";
import LanguageSelector from "../LanguageSelector";

function RegisterModal({ isOpen, onClose, onSwitchToLogin }) {
  if (!isOpen) return null;

  const navigate = useNavigate();
  const { loginTeacher } = useTeacher();
  const { t } = useTranslation();
  const { theme } = useTheme();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    role: "teacher",
    organization: ""
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = () => {
    console.log("Registration data:", formData);
    alert("Account created successfully!");
  };

  const handleGuestLogin = () => {
    localStorage.setItem("loggedIn", "true");
    localStorage.setItem("userRole", formData.role === "coordinator" ? "admin" : "teacher");
    
    // Set guest user data
    const guestUser = {
      email: "guest@school.org",
      name: "Guest User",
      status: "APPROVED",
      assignedClasses: ["Demo Class"],
      subject: "All Subjects",
      isGuest: true
    };
    
    if (formData.role === "teacher") {
      loginTeacher(guestUser);
    } else {
      localStorage.setItem("adminData", JSON.stringify(guestUser));
    }
    
    // Trigger custom event for route update
    window.dispatchEvent(new Event("localStorageUpdate"));
    onClose();
    
    setTimeout(() => navigate(formData.role === "coordinator" ? "/admin/dashboard" : "/dashboard"), 100);
  };

  return (
    // Overlay
    <div
      className="fixed inset-0 z-100 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      {/* Modal box - scrollable on small screens */}
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
          <div className="w-14 h-14 bg-gradient-to-br from-teal-500 to-blue-500 rounded-full flex items-center justify-center shadow-lg mb-6">
            <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
          </div>
          
          <h1 className={`text-2xl font-bold text-center mb-2 ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            {t('signup.page_title', 'Create Educator Account')}
          </h1>
          <p className={`text-sm text-center leading-relaxed ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          }`}>
            {t('signup.page_subtitle', 'Join the platform to support at-risk students')}
          </p>

          {/* Language Selector */}
          <div className="flex justify-center mt-4">
            <LanguageSelector />
          </div>
        </div>

        {/* Divider */}
        <div className={`h-px mb-6 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'}`}></div>

        {/* Form */}
        <div className="space-y-5">
          {/* Full Name */}
          {/* Full Name */}
          <div>
            <label className={`block text-xs font-semibold mb-2.5 uppercase tracking-wide ${
              theme === 'dark' ? 'text-gray-200' : 'text-gray-800'
            }`}>
              {t('signup.name_label', 'Full Name')}
            </label>
            <input
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              type="text"
              placeholder={t('signup.name_placeholder', 'John Doe')}
              className={`w-full px-4 py-3 rounded-xl border-2 text-sm font-medium
                         placeholder-gray-400
                         focus:outline-none focus:ring-2 focus:ring-offset-0
                         transition-all duration-200 ${
                           formData.fullName 
                             ? 'bg-blue-50/80 border-blue-400 text-gray-900 focus:border-blue-500 focus:ring-blue-300' 
                             : (theme === 'dark' 
                                 ? 'bg-gray-700/80 border-gray-600 text-gray-100 focus:border-blue-400 focus:ring-blue-400' 
                                 : 'bg-gray-50 border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-blue-300')
                         }`}
            />
          </div>

          {/* Email */}
          <div>
            <label className={`block text-xs font-semibold mb-2.5 uppercase tracking-wide ${
              theme === 'dark' ? 'text-gray-200' : 'text-gray-800'
            }`}>
              {t('signup.email_label', 'Email Address')}
            </label>
            <input
              name="email"
              value={formData.email}
              onChange={handleChange}
              type="email"
              placeholder={t('signup.email_placeholder', 'educator@school.org')}
              className={`w-full px-4 py-3 rounded-xl border-2 text-sm font-medium
                         placeholder-gray-400
                         focus:outline-none focus:ring-2 focus:ring-offset-0
                         transition-all duration-200 ${
                           formData.email 
                             ? 'bg-blue-50/80 border-blue-400 text-gray-900 focus:border-blue-500 focus:ring-blue-300' 
                             : (theme === 'dark' 
                                 ? 'bg-gray-700/80 border-gray-600 text-gray-100 focus:border-blue-400 focus:ring-blue-400' 
                                 : 'bg-gray-50 border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-blue-300')
                         }`}
            />
          </div>

          {/* Password */}
          <div>
            <label className={`block text-xs font-semibold mb-2.5 uppercase tracking-wide ${
              theme === 'dark' ? 'text-gray-200' : 'text-gray-800'
            }`}>
              {t('signup.password_label', 'Password')}
            </label>
            <input
              name="password"
              value={formData.password}
              onChange={handleChange}
              type="password"
              placeholder={t('signup.password_placeholder', 'Create a secure password')}
              className={`w-full px-4 py-3 rounded-xl border-2 text-sm font-medium
                         placeholder-gray-400
                         focus:outline-none focus:ring-2 focus:ring-offset-0
                         transition-all duration-200 ${
                           formData.password 
                             ? 'bg-blue-50/80 border-blue-400 text-gray-900 focus:border-blue-500 focus:ring-blue-300' 
                             : (theme === 'dark' 
                                 ? 'bg-gray-700/80 border-gray-600 text-gray-100 focus:border-blue-400 focus:ring-blue-400' 
                                 : 'bg-gray-50 border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-blue-300')
                         }`}
            />
          </div>

          {/* Role Selection */}
          <div>
            <label className={`block text-xs font-semibold mb-3 uppercase tracking-wide ${
              theme === 'dark' ? 'text-gray-200' : 'text-gray-800'
            }`}>
              {t('signup.role_label', 'Your Role')}
            </label>
            <div className="space-y-2.5">
              <label className={`flex items-center gap-3 px-4 py-3.5 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                formData.role === 'teacher' 
                  ? 'border-blue-500 bg-blue-50/80 shadow-md shadow-blue-200' 
                  : (theme === 'dark' 
                      ? 'border-gray-600 bg-gray-700/50 hover:border-blue-400 hover:shadow-md' 
                      : 'border-gray-300 hover:border-blue-400 hover:shadow-md hover:bg-blue-50/30')
              }`}>
                <input
                  type="radio"
                  name="role"
                  value="teacher"
                  checked={formData.role === "teacher"}
                  onChange={handleChange}
                  className="w-5 h-5 text-blue-600 cursor-pointer"
                />
                <span className={`text-sm font-medium ${
                  formData.role === 'teacher' ? 'text-blue-700' : (theme === 'dark' ? 'text-gray-200' : 'text-gray-700')
                }`}>{t('signup.role_teacher', 'Teacher')}</span>
              </label>
              
              <label className={`flex items-center gap-3 px-4 py-3.5 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                formData.role === 'coordinator' 
                  ? 'border-blue-500 bg-blue-50/80 shadow-md shadow-blue-200' 
                  : (theme === 'dark' 
                      ? 'border-gray-600 bg-gray-700/50 hover:border-blue-400 hover:shadow-md' 
                      : 'border-gray-300 hover:border-blue-400 hover:shadow-md hover:bg-blue-50/30')
              }`}>
                <input
                  type="radio"
                  name="role"
                  value="coordinator"
                  checked={formData.role === "coordinator"}
                  onChange={handleChange}
                  className="w-5 h-5 text-blue-600 cursor-pointer"
                />
                <span className={`text-sm font-medium ${
                  formData.role === 'coordinator' ? 'text-blue-700' : (theme === 'dark' ? 'text-gray-200' : 'text-gray-700')
                }`}>{t('signup.role_admin', 'Coordinator')}</span>
              </label>
            </div>
          </div>

          {/* School/Organization Name */}
          <div>
            <label className={`block text-xs font-semibold mb-2.5 uppercase tracking-wide ${
              theme === 'dark' ? 'text-gray-200' : 'text-gray-800'
            }`}>
              {t('signup.organization_label', 'School / Organization Name')}
            </label>
            <input
              name="organization"
              value={formData.organization}
              onChange={handleChange}
              type="text"
              placeholder={t('signup.organization_placeholder', 'Springfield High School')}
              className={`w-full px-4 py-3 rounded-xl border-2 text-sm font-medium
                         placeholder-gray-400
                         focus:outline-none focus:ring-2 focus:ring-offset-0
                         transition-all duration-200 ${
                           formData.organization 
                             ? 'bg-blue-50/80 border-blue-400 text-gray-900 focus:border-blue-500 focus:ring-blue-300' 
                             : (theme === 'dark' 
                                 ? 'bg-gray-700/80 border-gray-600 text-gray-100 focus:border-blue-400 focus:ring-blue-400' 
                                 : 'bg-gray-50 border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-blue-300')
                         }`}
            />
          </div>
        </div>

        {/* Info Note */}
        <div className={`mt-4 p-3 rounded-lg shadow-sm border ${
          theme === 'dark' ? 'bg-blue-900/20 border-blue-700' : 'bg-blue-50 border-blue-200'
        }`}>
          <p className={`text-xs flex items-start gap-2 ${
            theme === 'dark' ? 'text-blue-300' : 'text-blue-800'
          }`}>
            <svg className="w-4 h-4 mt-0.5 flex shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <span>{t('signup.info_note', 'Student accounts are not required. This platform is exclusively for educators and coordinators.')}</span>
          </p>
        </div>

        {/* Register Button */}
        <button
          onClick={handleSubmit}
          className="w-full mt-6 bg-linear-to-r from-teal-500 to-blue-500 text-white
                     font-semibold py-3 rounded-lg
                     hover:from-teal-600 hover:to-blue-600
                     focus:outline-none focus:ring-4 focus:ring-teal-200
                     transform hover:scale-[1.02] transition-all duration-200
                     shadow-md hover:shadow-lg"
        >
          {t('signup.sign_up_button', 'Create Account')}
        </button>

        {/* Guest Login Button */}
        <button 
          onClick={handleGuestLogin}
          className="w-full mt-3 bg-gradient-to-r from-gray-600 to-gray-700 text-white
                     font-semibold py-3 rounded-lg
                     hover:from-gray-700 hover:to-gray-800
                     focus:outline-none focus:ring-4 focus:ring-gray-200
                     transform hover:scale-[1.02] transition-all duration-200
                     shadow-md hover:shadow-lg"
        >
          {t('signup.guest_login', 'Continue as Guest')}
        </button>

        {/* Switch to Login */}
        <div className={`text-center mt-6 pt-6 border-t ${
          theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
        }`}>
          <span className={`text-sm ${
            theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
          }`}>{t('signup.already_have_account', 'Already have an account?')}</span>
          <button
            onClick={onSwitchToLogin}
            className="ml-2 text-sm text-teal-600 hover:text-teal-700 font-semibold hover:underline transition-colors"
          >
            {t('signup.sign_in_link', 'Sign in')}
          </button>
        </div>

        {/* Close */}
        <button
          onClick={onClose}
          className={`absolute top-4 right-4 rounded-full p-2 transition-all ${
            theme === 'dark' 
              ? 'text-gray-400 hover:text-gray-200 hover:bg-gray-700' 
              : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
          }`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}

export default RegisterModal;
