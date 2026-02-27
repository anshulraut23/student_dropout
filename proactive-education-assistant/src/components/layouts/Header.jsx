// import { useState, useEffect } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { FaUserCircle, FaBell, FaWifi, FaSignOutAlt, FaMoon, FaSun } from "react-icons/fa";
// import { useTranslation } from "react-i18next";
// import LanguageSelector from "../LanguageSelector";
// import logoImage from "../../assets/logo.png";
// import { useTheme } from "../../context/ThemeContext";

// function Header() {
//   const { t } = useTranslation();
//   const navigate = useNavigate();
//   const { theme, toggleTheme } = useTheme();
//   const [isOnline, setIsOnline] = useState(navigator.onLine);
//   const [showNotifications, setShowNotifications] = useState(false);
//   const [showProfileMenu, setShowProfileMenu] = useState(false);
//   const [notifications] = useState([
//     { id: 1, message: "New high-risk student alert", time: "5 min ago", unread: true },
//     { id: 2, message: "Attendance report ready", time: "1 hour ago", unread: true },
//     { id: 3, message: "Class schedule updated", time: "2 hours ago", unread: false },
//   ]);

//   const unreadCount = notifications.filter(n => n.unread).length;

//   useEffect(() => {
//     const handleOnline = () => setIsOnline(true);
//     const handleOffline = () => setIsOnline(false);

//     window.addEventListener('online', handleOnline);
//     window.addEventListener('offline', handleOffline);

//     return () => {
//       window.removeEventListener('online', handleOnline);
//       window.removeEventListener('offline', handleOffline);
//     };
//   }, []);

//   const handleLogout = () => {
//     // Clear all session data
//     localStorage.removeItem('token');
//     localStorage.removeItem('role');
//     localStorage.removeItem('school_id');
//     localStorage.removeItem('school_name');
//     sessionStorage.removeItem('token');
//     sessionStorage.removeItem('role');
//     sessionStorage.removeItem('school_id');
//     sessionStorage.removeItem('school_name');
    
//     // Dispatch event for route updates
//     window.dispatchEvent(new Event('localStorageUpdate'));
    
//     navigate('/');
//   };

//   const handleLogoClick = (event) => {
//     event.preventDefault();
//     window.location.reload();
//   };

//   return (
//     <header className="fixed top-0 left-0 lg:left-64 right-0 z-300">
//       <div className="h-16 px-4 sm:px-6 flex items-center justify-between">
        
//         {/* Left - Logo (Desktop only) */}
//         <Link to="/dashboard" onClick={handleLogoClick} className="hidden lg:flex items-center gap-3">
//           <img src={logoImage} alt="Logo" className="w-28 h-15 object-contain" />
//           <div>
//             <h1 className="text-lg font-semibold text-gray-900">
//               {t('app.brand_full', 'Proactive Education')}
//             </h1>
//             <p className="text-xs text-gray-500">{t('app.tagline', 'Early Dropout Prevention')}</p>
//           </div>
//         </Link>

//         {/* Mobile - Just show title */}
//         <div className="lg:hidden">
//           <h1 className="text-base font-semibold text-gray-900">Dashboard</h1>
//         </div>

//         {/* Right */}
//         <div className="flex items-center gap-2 sm:gap-3">
//           {/* Theme Toggle */}
//           <button
//             onClick={toggleTheme}
//             className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-50 border border-gray-200 text-gray-700 hover:bg-gray-100 transition-colors"
//             title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
//           >
//             {theme === 'dark' ? <FaSun className="text-sm" /> : <FaMoon className="text-sm" />}
//             <span className="text-xs font-medium hidden md:inline">
//               {theme === 'dark' ? 'Light' : 'Dark'}
//             </span>
//           </button>

//           {/* Online/Offline Status */}
//           <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-50 border border-gray-200">
//             <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-500' : 'bg-red-500'}`}></div>
//             <span className="text-xs font-medium text-gray-700 hidden md:inline">
//               {isOnline ? 'Online' : 'Offline'}
//             </span>
//             <FaWifi className={`text-sm ${isOnline ? 'text-green-600' : 'text-red-600'}`} />
//           </div>

//           {/* Notifications */}
//           <div className="relative">
//             <button
//               onClick={() => setShowNotifications(!showNotifications)}
//               className="relative p-2 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100 transition-colors"
//             >
//               <FaBell className="text-lg sm:text-xl" />
//               {unreadCount > 0 && (
//                 <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-medium">
//                   {unreadCount}
//                 </span>
//               )}
//             </button>

//             {/* Notifications Dropdown */}
//             {showNotifications && (
//               <>
//                 <div 
//                   className="fixed inset-0 z-40" 
//                   onClick={() => setShowNotifications(false)}
//                 ></div>
//                 <div className="absolute right-0 mt-2 w-80 max-w-[calc(100vw-2rem)] bg-white rounded-lg shadow-xl border border-gray-200 z-50">
//                   <div className="p-4 border-b border-gray-200">
//                     <h3 className="font-semibold text-gray-900">Notifications</h3>
//                   </div>
//                   <div className="max-h-96 overflow-y-auto">
//                     {notifications.map((notification) => (
//                       <div
//                         key={notification.id}
//                         className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors ${
//                           notification.unread ? 'bg-blue-50' : ''
//                         }`}
//                       >
//                         <p className="text-sm text-gray-900">{notification.message}</p>
//                         <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
//                       </div>
//                     ))}
//                   </div>
//                   <div className="p-3 text-center border-t border-gray-200">
//                     <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
//                       View All Notifications
//                     </button>
//                   </div>
//                 </div>
//               </>
//             )}
//           </div>

//           {/* Language Selector - Hidden on small mobile */}
//           <div className="hidden sm:block">
//             <LanguageSelector />
//           </div>
          
//           {/* Profile Menu */}
//           <div className="relative">
//             <button
//               onClick={() => setShowProfileMenu(!showProfileMenu)}
//               className="flex items-center gap-2 px-2 sm:px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
//             >
//               <FaUserCircle className="text-xl sm:text-2xl" />
//               <span className="text-sm font-medium hidden md:inline">Profile</span>
//             </button>

//             {/* Profile Dropdown */}
//             {showProfileMenu && (
//               <>
//                 <div 
//                   className="fixed inset-0 z-40" 
//                   onClick={() => setShowProfileMenu(false)}
//                 ></div>
//                 <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
//                   <div className="p-2">
//                     <button
//                       onClick={() => {
//                         setShowProfileMenu(false);
//                         navigate("/profile");
//                       }}
//                       className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
//                     >
//                       <FaUserCircle />
//                       <span>My Profile</span>
//                     </button>
//                     <button
//                       onClick={() => {
//                         setShowProfileMenu(false);
//                         handleLogout();
//                       }}
//                       className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
//                     >
//                       <FaSignOutAlt />
//                       <span>Logout</span>
//                     </button>
//                   </div>
//                 </div>
//               </>
//             )}
//           </div>
//         </div>

//       </div>
//     </header>
//   );
// }

// export default Header;















import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUserCircle, FaBell, FaWifi, FaSignOutAlt, FaTrophy } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import LanguageSelector from "../LanguageSelector";
import logoImage from "../../assets/logo.png";

function Header() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [notifications] = useState([
    { id: 1, message: "New high-risk student alert", time: "5 min ago", unread: true },
    { id: 2, message: "Attendance report ready", time: "1 hour ago", unread: true },
    { id: 3, message: "Class schedule updated", time: "2 hours ago", unread: false },
  ]);

  const unreadCount = notifications.filter(n => n.unread).length;

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleLogout = () => {
    // Clear all session data
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('school_id');
    localStorage.removeItem('school_name');
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('role');
    sessionStorage.removeItem('school_id');
    sessionStorage.removeItem('school_name');
    
    // Dispatch event for route updates
    window.dispatchEvent(new Event('localStorageUpdate'));
    
    navigate('/');
  };

  const handleLogoClick = (event) => {
    event.preventDefault();
    window.location.reload();
  };

  return (
    <header 
      className="hidden lg:block fixed top-0 left-64 right-0 z-40 shadow-sm"
      style={{
        backgroundColor: "#ffffff",
        borderBottom: "1px solid rgba(26, 111, 181, 0.08)"
      }}
    >
      <div className="h-16 px-6 flex items-center justify-between">
        
        {/* Left - Logo and Brand */}
        <Link to="/dashboard" onClick={handleLogoClick} className="flex items-center gap-3 flex-shrink-0">
          <img src={logoImage} alt="Logo" className="w-24 h-12 object-contain" />
          <div>
            <h1 
              className="text-base font-semibold leading-tight"
              style={{ color: "#1e2c3a", fontFamily: "'DM Serif Display', serif" }}
            >
              {t('app.brand_full', 'Proactive Education')}
            </h1>
            <p 
              className="text-xs"
              style={{ color: "#6b7a8d", fontFamily: "'DM Sans', sans-serif" }}
            >
              {t('app.tagline', 'Early Dropout Prevention')}
            </p>
          </div>
        </Link>

        {/* Right - Icons and Actions */}
        <div className="flex items-center gap-3">
          {/* Leaderboard */}
          <Link
            to="/leaderboard"
            className="flex items-center gap-2 px-3 py-2 rounded-lg transition-all"
            style={{
              backgroundColor: "rgba(26, 111, 181, 0.05)",
              border: "1px solid rgba(26, 111, 181, 0.12)",
              color: "#6b7a8d"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "rgba(26, 111, 181, 0.1)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "rgba(26, 111, 181, 0.05)";
            }}
            title="Leaderboard"
          >
            <FaTrophy className="text-sm" />
            <span
              className="text-xs font-medium"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              Leaderboard
            </span>
          </Link>

          {/* Online/Offline Status */}
          <div 
            className="flex items-center gap-2 px-3 py-2 rounded-lg"
            style={{
              backgroundColor: "rgba(26, 111, 181, 0.05)",
              border: "1px solid rgba(26, 111, 181, 0.12)"
            }}
          >
            <div 
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: isOnline ? "#10b981" : "#dc2626" }}
            ></div>
            <span 
              className="text-xs font-medium"
              style={{ color: "#6b7a8d", fontFamily: "'DM Sans', sans-serif" }}
            >
              {isOnline ? 'Online' : 'Offline'}
            </span>
            <FaWifi 
              className="text-sm"
              style={{ color: isOnline ? "#10b981" : "#dc2626" }}
            />
          </div>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 rounded-lg transition-all"
              style={{
                color: "#6b7a8d",
                backgroundColor: "rgba(26, 111, 181, 0.05)"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "rgba(26, 111, 181, 0.1)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "rgba(26, 111, 181, 0.05)";
              }}
            >
              <FaBell className="text-lg" />
              {unreadCount > 0 && (
                <span 
                  className="absolute top-0 right-0 w-5 h-5 text-white text-xs rounded-full flex items-center justify-center font-semibold"
                  style={{ backgroundColor: "#dc2626" }}
                >
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notifications Dropdown */}
            {showNotifications && (
              <>
                <div 
                  className="fixed inset-0 z-40" 
                  onClick={() => setShowNotifications(false)}
                ></div>
                <div 
                  className="absolute right-0 mt-2 w-80 rounded-lg shadow-xl z-50"
                  style={{
                    backgroundColor: "#ffffff",
                    border: "1px solid rgba(26, 111, 181, 0.12)"
                  }}
                >
                  <div 
                    className="p-4"
                    style={{ borderBottom: "1px solid rgba(26, 111, 181, 0.12)" }}
                  >
                    <h3 
                      className="font-semibold"
                      style={{ color: "#1e2c3a", fontFamily: "'DM Serif Display', serif" }}
                    >
                      Notifications
                    </h3>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className="p-4 cursor-pointer transition-colors"
                        style={{
                          borderBottom: "1px solid rgba(26, 111, 181, 0.08)",
                          backgroundColor: notification.unread ? "rgba(26, 111, 181, 0.05)" : "#ffffff"
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = "rgba(26, 111, 181, 0.05)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = notification.unread ? "rgba(26, 111, 181, 0.05)" : "#ffffff";
                        }}
                      >
                        <p 
                          className="text-sm"
                          style={{ color: "#1e2c3a", fontFamily: "'DM Sans', sans-serif" }}
                        >
                          {notification.message}
                        </p>
                        <p 
                          className="text-xs mt-1"
                          style={{ color: "#6b7a8d", fontFamily: "'DM Sans', sans-serif" }}
                        >
                          {notification.time}
                        </p>
                      </div>
                    ))}
                  </div>
                  <div 
                    className="p-3 text-center"
                    style={{ borderTop: "1px solid rgba(26, 111, 181, 0.12)" }}
                  >
                    <button 
                      className="text-sm font-medium transition-colors"
                      style={{ color: "#1a6fb5", fontFamily: "'DM Sans', sans-serif" }}
                      onMouseEnter={(e) => e.currentTarget.style.color = "#0e4a80"}
                      onMouseLeave={(e) => e.currentTarget.style.color = "#1a6fb5"}
                    >
                      View All Notifications
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Language Selector */}
          <div>
            <LanguageSelector />
          </div>
          
          {/* Profile Menu */}
          <div className="relative">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg transition-all"
              style={{
                color: "#6b7a8d",
                backgroundColor: "rgba(26, 111, 181, 0.05)"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "rgba(26, 111, 181, 0.1)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "rgba(26, 111, 181, 0.05)";
              }}
            >
              <FaUserCircle className="text-xl" />
              <span 
                className="text-sm font-medium"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                Profile
              </span>
            </button>

            {/* Profile Dropdown */}
            {showProfileMenu && (
              <>
                <div 
                  className="fixed inset-0 z-40" 
                  onClick={() => setShowProfileMenu(false)}
                ></div>
                <div 
                  className="absolute right-0 mt-2 w-48 rounded-lg shadow-xl z-50"
                  style={{
                    backgroundColor: "#ffffff",
                    border: "1px solid rgba(26, 111, 181, 0.12)"
                  }}
                >
                  <div className="p-2">
                    <button
                      onClick={() => {
                        setShowProfileMenu(false);
                        navigate("/profile");
                      }}
                      className="w-full flex items-center gap-3 px-4 py-2 text-sm rounded-lg transition-colors"
                      style={{
                        color: "#6b7a8d",
                        fontFamily: "'DM Sans', sans-serif"
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = "rgba(26, 111, 181, 0.05)";
                        e.currentTarget.style.color = "#1a6fb5";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = "#ffffff";
                        e.currentTarget.style.color = "#6b7a8d";
                      }}
                    >
                      <FaUserCircle />
                      <span>My Profile</span>
                    </button>
                    <button
                      onClick={() => {
                        setShowProfileMenu(false);
                        handleLogout();
                      }}
                      className="w-full flex items-center gap-3 px-4 py-2 text-sm rounded-lg transition-colors"
                      style={{
                        color: "#dc2626",
                        fontFamily: "'DM Sans', sans-serif"
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = "rgba(220, 38, 38, 0.05)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = "#ffffff";
                      }}
                    >
                      <FaSignOutAlt />
                      <span>Logout</span>
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

      </div>
    </header>
  );
}

export default Header;