import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaGraduationCap, FaBars, FaTimes } from 'react-icons/fa';
import LoginModal from '../auth/login.jsx';
import RegisterModal from '../auth/register.jsx';

function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [authType, setAuthType] = useState(null);
  const location = useLocation();

  // Navigation items
  const navItems = [
    { path: '/', label: 'Dashboard' },
    { path: '/students', label: 'Students' },

    { path: '/about', label: 'About' },
    { path: '/contact', label: 'Contact' },
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
            ? 'bg-white shadow-md'
            : 'bg-white/95 backdrop-blur-sm shadow-sm'
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
                <h1 className="text-xl font-bold text-gray-800 leading-tight group-hover:text-blue-600 transition-colors">
                  Proactive Education Assistant
                </h1>
                <p className="text-xs text-gray-500">Early Dropout Prevention System</p>
              </div>
              <div className="sm:hidden">
                <h1 className="text-lg font-bold text-gray-800 group-hover:text-blue-600 transition-colors">
                  EduPro
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
                        ? 'text-blue-600 bg-blue-50'
                        : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            {/* Right: Auth Buttons (Desktop) */}
            <div className="hidden md:flex items-center gap-3">
              <button
                onClick={() => {
                  setAuthType('login');
                  setOpen(true);
                }}
                className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700
                           border border-blue-600 rounded-md hover:bg-blue-50 transition-colors"
              >
                Login
              </button>
              <button
                onClick={() => {
                  setAuthType('register');
                  setOpen(true);
                }}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600
                           rounded-md hover:bg-blue-700 transition-colors shadow-sm"
              >
                Sign Up
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-md text-gray-700 hover:bg-gray-100 transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            mobileMenuOpen ? 'max-h-screen border-t border-gray-200' : 'max-h-0'
          }`}
        >
          <div className="px-4 py-4 space-y-2 bg-white">
            {/* Mobile Nav Links */}
            {navItems.map((item) => {
              const active = isActive(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`block px-4 py-3 rounded-md text-sm font-medium transition-colors ${
                    active
                      ? 'text-blue-600 bg-blue-50'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}

            {/* Mobile Auth Buttons */}
            <div className="pt-4 border-t border-gray-200 space-y-2">
              <button
                onClick={() => {
                  setAuthType('login');
                  setOpen(true);
                  setMobileMenuOpen(false);
                }}
                className="w-full px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700
                           border border-blue-600 rounded-md hover:bg-blue-50 transition-colors"
              >
                Login
              </button>
              <button
                onClick={() => {
                  setAuthType('register');
                  setOpen(true);
                  setMobileMenuOpen(false);
                }}
                className="w-full px-4 py-2 text-sm font-medium text-white bg-blue-600
                           rounded-md hover:bg-blue-700 transition-colors"
              >
                Sign Up
              </button>
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
