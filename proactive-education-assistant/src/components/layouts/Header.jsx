import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaGraduationCap, FaBars, FaTimes, FaUserCircle, FaSun, FaMoon } from 'react-icons/fa';
import { useTeacher } from '../../context/TeacherContext';
import { useTheme } from '../../context/ThemeContext';
import LoginModal from '../auth/login.jsx';
import RegisterModal from '../auth/register.jsx';
import { useTranslation } from 'react-i18next';
import LanguageSelector from '../LanguageSelector.jsx';

function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [authType, setAuthType] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const location = useLocation();
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

  // Navigation items
  const navItems = [
    { path: isLoggedIn ? '/dashboard' : '/', label: t('nav.dashboard') },
    { path: '/students', label: t('nav.students') },
    { path: '/about', label: t('nav.about') },
    { path: '/contact', label: t('nav.contact') },
  ];

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Check if link is active
  const isActive = (path) => location.pathname === path;

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-white dark:bg-gray-900 shadow-md'
            : 'bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm shadow-sm'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left: Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <div className="bg-linear-to-br from-blue-600 to-teal-500 p-2 rounded-lg shadow-md group-hover:shadow-lg transition-all">
                <FaGraduationCap className="text-white text-2xl" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold text-gray-800 dark:text-white leading-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {t('app.brand_full')}
                </h1>
                <p className="text-xs text-gray-500 dark:text-gray-400">{t('app.tagline')}</p>
              </div>
              <div className="sm:hidden">
                <h1 className="text-lg font-bold text-gray-800 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {t('app.brand_short')}
                </h1>
              </div>
            </Link>

            {/* Center: Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1">
              {navItems.map((item) => {
                const active = isActive(item.path);
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                      active
                        ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30'
                        : 'text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            {/* Right: Auth Buttons (Desktop) */}
            <div className="hidden md:flex items-center gap-3">
              {isLoggedIn ? (
                <button
                  onClick={() => navigate('/profile')}
                  className="flex items-center gap-2 px-4 py-2 text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-gray-800 rounded-md transition-all"
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
                    className="px-4 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300
                               border border-blue-600 dark:border-blue-400 rounded-md hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors"
                  >
                    {t('auth.login')}
                  </button>
                  <button
                    onClick={() => {
                      setAuthType('register');
                      setOpen(true);
                    }}
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 dark:bg-blue-600
                               rounded-md hover:bg-blue-700 dark:hover:bg-blue-700 transition-colors shadow-sm"
                  >
                    {t('auth.signup')}
                  </button>
                </>
              )}
              <button
                onClick={toggleTheme}
                className="p-2 rounded-md text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                title={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
                aria-label="Toggle theme"
              >
                {theme === 'light' ? <FaMoon size={20} /> : <FaSun size={20} />}
              </button>
              <LanguageSelector />
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center gap-2">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-md text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                title={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
                aria-label="Toggle theme"
              >
                {theme === 'light' ? <FaMoon size={20} /> : <FaSun size={20} />}
              </button>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-md text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                aria-label={t('aria.toggle_menu')}
              >
                {mobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            mobileMenuOpen ? 'max-h-screen border-t border-gray-200 dark:border-gray-700' : 'max-h-0'
          }`}
        >
          <div className="px-4 py-4 space-y-2 bg-white dark:bg-gray-900">
            {/* Mobile Nav Links */}
            {navItems.map((item) => {
              const active = isActive(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`block px-4 py-3 rounded-md text-sm font-medium transition-colors ${
                    active
                      ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30'
                      : 'text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}

            {/* Mobile Auth Buttons */}
            <div className="pt-4 border-t border-gray-200 dark:border-gray-700 space-y-2">
              {isLoggedIn ? (
                <button
                  onClick={() => {
                    navigate('/profile');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 text-gray-700 dark:text-gray-200 bg-gray-50 dark:bg-gray-800 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <FaUserCircle className="text-xl" />
                  <span className="font-medium">{teacher?.name || t('auth.my_profile')}</span>
                </button>
              ) : (
                <>
                  <button
                    onClick={() => {
                      setAuthType('login');
                      setOpen(true);
                      setMobileMenuOpen(false);
                    }}
                    className="w-full px-4 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300
                               border border-blue-600 dark:border-blue-400 rounded-md hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors"
                  >
                    {t('auth.login')}
                  </button>
                  <button
                    onClick={() => {
                      setAuthType('register');
                      setOpen(true);
                      setMobileMenuOpen(false);
                    }}
                    className="w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 dark:bg-blue-600
                               rounded-md hover:bg-blue-700 dark:hover:bg-blue-700 transition-colors"
                  >
                    {t('auth.signup')}
                  </button>
                </>
              )}
              <div className="pt-2">
                <LanguageSelector className="w-full" />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Spacer to prevent content from hiding under fixed header */}
      <div className="h-16"></div>

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
