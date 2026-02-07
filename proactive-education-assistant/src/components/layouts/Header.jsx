import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaGraduationCap, FaBars, FaTimes, FaUserCircle, FaSun, FaMoon } from 'react-icons/fa';
import { useTeacher } from '../../context/TeacherContext';
import { useTheme } from '../../context/ThemeContext';
import LoginModal from '../auth/login.jsx';
import RegisterModal from '../auth/register.jsx';
import { useTranslation } from 'react-i18next';
import LanguageSelector from '../LanguageSelector.jsx';

function Header({ onToggleSidebar, isSidebarOpen }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [authType, setAuthType] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();
  const { teacher } = useTeacher();
  const { theme, toggleTheme } = useTheme();
  const { t } = useTranslation();

  // Check login status
  useEffect(() => {
    const checkLoginStatus = () => {
      setIsLoggedIn(!!localStorage.getItem("loggedIn"));
    };
    
    checkLoginStatus();
    window.addEventListener("localStorageUpdate", checkLoginStatus);
    
    return () => {
      window.removeEventListener("localStorageUpdate", checkLoginStatus);
    };
  }, []);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? 'bg-slate-900 shadow-sm' : 'bg-slate-900 shadow-sm'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left: Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <button
                type="button"
                onClick={onToggleSidebar}
                className="p-2 rounded-md text-white hover:bg-white/10 transition-colors"
                aria-label={isSidebarOpen ? t('aria.close_menu', 'Close navigation') : t('aria.open_menu', 'Open navigation')}
              >
                {isSidebarOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
              </button>
              <div className="bg-linear-to-br from-blue-600 to-teal-500 p-2 rounded-lg shadow-md group-hover:shadow-lg transition-all">
                <FaGraduationCap className="text-white text-2xl" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold text-white leading-tight">
                  {t('app.brand_full')}
                </h1>
                <p className="text-xs text-slate-300">{t('app.tagline')}</p>
              </div>
              <div className="sm:hidden">
                <h1 className="text-lg font-bold text-white">
                  {t('app.brand_short')}
                </h1>
              </div>
            </Link>

            {/* Right: Auth Buttons (Desktop) */}
            <div className="hidden md:flex items-center gap-3">
              {isLoggedIn ? (
                <button
                  onClick={() => navigate('/profile')}
                  className="flex items-center gap-2 px-4 py-2 text-white hover:bg-white/10 rounded-md transition-colors"
                  title={t('auth.profile')}
                >
                  <FaUserCircle className="text-2xl" />
                  <span className="text-sm font-medium">{teacher?.name?.split(' ')[0] || t('auth.profile')}</span>
                </button>
              ) : (
                <>
                  <button
                    onClick={() => {
                      setAuthType('login');
                      setOpen(true);
                    }}
                    className="px-4 py-2 text-sm font-medium text-white border border-white/40 rounded-md hover:bg-white/10 transition-colors"
                  >
                    {t('auth.login')}
                  </button>
                  <button
                    onClick={() => {
                      setAuthType('register');
                      setOpen(true);
                    }}
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors shadow-sm"
                  >
                    {t('auth.signup')}
                  </button>
                </>
              )}
              <button
                onClick={toggleTheme}
                className="p-2 rounded-md text-white hover:bg-white/10 transition-colors"
                title={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
                aria-label="Toggle theme"
              >
                {theme === 'light' ? <FaMoon size={20} /> : <FaSun size={20} />}
              </button>
              <LanguageSelector />
            </div>

          </div>
        </div>
      </header>

      {/* Auth Modals */}
      <LoginModal
        isOpen={open && authType === 'login'}
        onClose={() => {
          setOpen(false);
          setAuthType(null);
        }}
        onSwitchToRegister={() => {
          setAuthType('register');
        }}
      />

      <RegisterModal
        isOpen={open && authType === 'register'}
        onClose={() => {
          setOpen(false);
          setAuthType(null);
        }}
        onSwitchToLogin={() => {
          setAuthType('login');
        }}
      />
    </>
  );
}

export default Header;
