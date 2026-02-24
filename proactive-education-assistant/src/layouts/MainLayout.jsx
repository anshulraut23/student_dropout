// import { useEffect, useRef, useState } from "react";
// import { Outlet, useLocation, useNavigate } from "react-router-dom";
// import { useTranslation } from "react-i18next";
// import { 
//   FaChartLine, 
//   FaChalkboard, 
//   FaUsers, 
//   FaUserPlus, 
//   FaClipboardList, 
//   FaTrophy,
//   FaBars,
//   FaTimes,
//   FaFileAlt,
//   FaHistory,
//   FaChartBar
// } from "react-icons/fa";
// import Header from "../components/layouts/Header";
// import DashboardFooter from "../components/layouts/DashboardFooter";
// import loadingGif from "../assets/loading.gif";
// import { useTheme } from "../context/ThemeContext";

// function MainLayout() {
//   const [sidebarOpen, setSidebarOpen] = useState(false);
//   const [isNavLoading, setIsNavLoading] = useState(false);
//   const location = useLocation();
//   const navigate = useNavigate();
//   const { t } = useTranslation();
//   const { theme } = useTheme();
//   const navigationTimerRef = useRef(null);

//   const navItems = [
//     { path: "/dashboard", label: t("nav.dashboard", "Dashboard"), icon: FaChartLine },
//     { path: "/my-classes", label: "My Classes", icon: FaChalkboard },
//     { path: "/students", label: t("nav.students", "Students"), icon: FaUsers },
//     { path: "/add-student", label: "Add Student", icon: FaUserPlus },
//     { path: "/data-entry", label: t("nav.dataEntry", "Data Entry"), icon: FaClipboardList },
//     { path: "/attendance-history", label: "Attendance History", icon: FaHistory },
//     { path: "/score-history", label: "Score History", icon: FaChartBar },
//     { path: "/gamification", label: "Progress", icon: FaTrophy },
//   ];

//   const closeSidebar = () => setSidebarOpen(false);

//   const handleSidebarNavigation = (path) => {
//     closeSidebar();
//     setIsNavLoading(true);

//     if (navigationTimerRef.current) {
//       clearTimeout(navigationTimerRef.current);
//     }

//     navigationTimerRef.current = setTimeout(() => {
//       setIsNavLoading(false);
//       navigate(path);
//     }, 2000);
//   };

//   useEffect(() => {
//     return () => {
//       if (navigationTimerRef.current) {
//         clearTimeout(navigationTimerRef.current);
//       }
//     };
//   }, []);

//   return (
//     <div className="min-h-screen flex bg-gray-50">
      
//       {/* Mobile Overlay */}
//       {sidebarOpen && (
//         <div 
//           className="fixed inset-0 bg-black/50 z-40 lg:hidden"
//           onClick={closeSidebar}
//         />
//       )}

//       {/* Sidebar */}
//       <aside
//         className={`fixed top-0 left-0 z-50 w-64 h-screen border border-gray-300
//         transition-transform duration-300 ease-in-out lg:translate-x-0
//         ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
//         style={{ backgroundColor: '#f8fafc' }}
//       >
//         {/* Mobile Close Button */}
//         <div className="lg:hidden flex items-center justify-between p-4 border-b" style={{ borderColor: '#d1d5db' }}>
//           <h2 className="text-lg font-semibold text-gray-900">Menu</h2>
//           <button
//             onClick={closeSidebar}
//             className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
//           >
//             <FaTimes className="text-xl" />
//           </button>
//         </div>

//         <nav className="flex flex-col h-[calc(100%-4rem)] lg:h-full py-4">
//           <div className="px-3 space-y-1 flex-1 overflow-y-auto">
//             {navItems.map((item) => {
//               const Icon = item.icon;
//               const active = location.pathname.startsWith(item.path);
//               return (
//                 <button
//                   key={item.path}
//                   type="button"
//                   onClick={() => handleSidebarNavigation(item.path)}
//                   className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all
//                     ${
//                       active
//                         ? theme === "dark"
//                           ? "bg-white text-black shadow-lg"
//                           : "bg-gray-400 text-white shadow-lg"
//                         : "text-gray-900 hover:bg-gray-200 hover:text-gray-900"
//                     } w-full text-left`}
//                 >
//                   <Icon className="text-lg flex-shrink-0" />
//                   <span>{item.label}</span>
//                 </button>
//               );
//             })}
//           </div>

//           {/* Footer */}
//           <div className="px-4 py-3 border-t" style={{ borderColor: '#d1d5db' }}>
//             <p className="text-xs text-gray-500 text-center">
//               Proactive Education Assistant
//             </p>
//           </div>
//         </nav>
//       </aside>

//       {/* Main Area */}
//       <div className="flex-1 flex flex-col lg:ml-64">
//         {/* Mobile Header with Menu Button */}
//         <div className="lg:hidden fixed top-0 left-0 right-0 z-30 bg-white border-b border-gray-200 h-16 flex items-center px-4">
//           <button
//             onClick={() => setSidebarOpen(true)}
//             className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
//           >
//             <FaBars className="text-xl" />
//           </button>
//           <div className="ml-3 flex items-center gap-2">
//             <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
//               <span className="text-white font-bold text-sm">PE</span>
//             </div>
//             <span className="font-semibold text-gray-900">Proactive Education</span>
//           </div>
//         </div>

//         {/* Desktop Header */}
//         <div className="hidden lg:block">
//           <Header
//             onToggleSidebar={() => setSidebarOpen((prev) => !prev)}
//             isSidebarOpen={sidebarOpen}
//           />
//         </div>

//         <main className="flex-1 pt-16 lg:pt-0">
//           <Outlet />
//         </main>

//         <DashboardFooter />
//       </div>

//       {isNavLoading && (
//         <div className="fixed inset-0 lg:left-64 z-40 bg-white flex items-center justify-center">
//           <img src={loadingGif} alt="Loading" className="w-96 h-96 object-contain" />
//         </div>
//       )}
//     </div>
//   );
// }

// export default MainLayout;















import { useEffect, useRef, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { 
  FaChartLine, 
  FaChalkboard, 
  FaUsers, 
  FaUserPlus, 
  FaClipboardList, 
  FaTrophy,
  FaBars,
  FaTimes,
  FaHistory,
  FaChartBar,
  FaHandsHelping
} from "react-icons/fa";
import Header from "../components/layouts/Header";
import DashboardFooter from "../components/layouts/DashboardFooter";
import loadingGif from "../assets/loading.gif";

/* ── Teacher Sidebar Styles (matching Admin theme) ──────────────────── */
const TEACHER_SIDEBAR_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500;600;700&display=swap');

  .teacher-sidebar {
    background: linear-gradient(180deg, #0e4a80 0%, #0a3660 45%, #071f3a 100%);
    position: fixed;
    overflow: hidden;
  }

  /* Radial mesh glow behind content */
  .teacher-sidebar::before {
    content: '';
    position: absolute;
    inset: 0;
    background-image:
      radial-gradient(ellipse at 10% 15%,  rgba(45,143,212,0.25) 0%, transparent 55%),
      radial-gradient(ellipse at 90% 85%,  rgba(240,165,0,0.08)  0%, transparent 50%),
      radial-gradient(ellipse at 80% 10%,  rgba(26,111,181,0.12) 0%, transparent 40%);
    pointer-events: none;
    z-index: 0;
  }

  /* Subtle dot-grid texture */
  .teacher-sidebar::after {
    content: '';
    position: absolute;
    inset: 0;
    background-image: url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='10' cy='10' r='0.8' fill='%23ffffff' fill-opacity='0.035'/%3E%3C/svg%3E");
    pointer-events: none;
    z-index: 0;
  }

  /* All direct children sit above the pseudo-element layers */
  .teacher-sidebar > * { position: relative; z-index: 1; }

  /* ── Logo header ─────────────────────────────────────────────────────── */
  .teacher-logo-wrap {
    height: 72px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 1.1rem;
    border-bottom: 1px solid rgba(255,255,255,0.07);
    background: rgba(0,0,0,0.15);
  }

  .teacher-logo-icon {
    width: 44px; height: 44px;
    border-radius: 13px;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
    background: linear-gradient(135deg, #1a6fb5 0%, #2d8fd4 100%);
    box-shadow: 0 4px 18px rgba(26,111,181,0.55), inset 0 1px 0 rgba(255,255,255,0.22);
    position: relative;
    overflow: hidden;
  }

  /* Gloss on icon */
  .teacher-logo-icon::after {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 50%;
    background: linear-gradient(to bottom, rgba(255,255,255,0.18), transparent);
    border-radius: 13px 13px 0 0;
  }

  .teacher-brand-name {
    font-family: 'DM Serif Display', serif;
    font-size: 1.05rem;
    color: white;
    line-height: 1.15;
    letter-spacing: -0.015em;
  }

  .teacher-brand-sub {
    font-family: 'DM Sans', sans-serif;
    font-size: 0.67rem;
    color: rgba(255,255,255,0.38);
    letter-spacing: 0.06em;
    text-transform: uppercase;
    margin-top: 1px;
  }

  /* ── Section labels ──────────────────────────────────────────────────── */
  .teacher-section-label {
    font-family: 'DM Sans', sans-serif;
    font-size: 0.6rem;
    font-weight: 700;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: rgba(255,255,255,0.45);
    padding: 0 1.1rem;
    margin: 1.2rem 0 0.35rem;
  }

  /* ── Divider ─────────────────────────────────────────────────────────── */
  .teacher-divider {
    height: 1px;
    margin: 0.8rem 1rem;
    background: linear-gradient(90deg,
      transparent 0%,
      rgba(255,255,255,0.08) 30%,
      rgba(255,255,255,0.08) 70%,
      transparent 100%);
  }

  /* ── Nav item ────────────────────────────────────────────────────────── */
  .teacher-nav-item {
    display: flex;
    align-items: center;
    gap: 0.7rem;
    padding: 0.62rem 0.85rem;
    border-radius: 10px;
    margin: 2px 0.6rem;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.855rem;
    font-weight: 500;
    color: #ffffff !important;
    text-decoration: none !important;
    position: relative;
    overflow: hidden;
    transition: color 0.22s ease, background 0.22s ease, transform 0.22s ease, box-shadow 0.22s ease;
    background: transparent;
    border: none;
    cursor: pointer;
    width: 100%;
    text-align: left;
  }

  .teacher-nav-item:hover {
    color: #ffffff;
    background: rgba(255,255,255,0.1);
    transform: translateX(4px);
  }

  /* Active filled state */
  .teacher-nav-item.teacher-active {
    background: linear-gradient(135deg, rgba(26,111,181,0.85) 0%, rgba(45,143,212,0.75) 100%);
    color: white;
    font-weight: 600;
    transform: translateX(0);
    box-shadow: 0 4px 18px rgba(26,111,181,0.3), inset 0 1px 0 rgba(255,255,255,0.13);
  }

  /* Left accent bar */
  .teacher-nav-item.teacher-active::before {
    content: '';
    position: absolute;
    left: 0; top: 18%; bottom: 18%;
    width: 3px;
    background: linear-gradient(to bottom, #ffffff, rgba(255,255,255,0.5));
    border-radius: 0 3px 3px 0;
  }

  /* Subtle right shimmer on active */
  .teacher-nav-item.teacher-active::after {
    content: '';
    position: absolute;
    right: 0; top: 0; bottom: 0;
    width: 40%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.04));
    pointer-events: none;
  }

  /* ── Icon box ────────────────────────────────────────────────────────── */
  .teacher-nav-icon {
    width: 32px; height: 32px;
    border-radius: 8px;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
    font-size: 0.85rem;
    transition: background 0.22s ease, color 0.22s ease;
    background: rgba(255,255,255,0.1);
    color: #ffffff;
  }

  .teacher-nav-item:hover .teacher-nav-icon {
    background: rgba(255,255,255,0.16);
    color: #ffffff;
  }

  .teacher-nav-item.teacher-active .teacher-nav-icon {
    background: rgba(255,255,255,0.22);
    color: white;
    box-shadow: 0 2px 8px rgba(0,0,0,0.15);
  }

  /* ── Footer ──────────────────────────────────────────────────────────── */
  .teacher-footer {
    padding: 0.85rem;
    border-top: 1px solid rgba(255,255,255,0.06);
    background: rgba(0,0,0,0.12);
  }

  .teacher-footer-card {
    border-radius: 12px;
    padding: 0.8rem 0.9rem;
    text-align: center;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.07);
    position: relative;
    overflow: hidden;
  }

  .teacher-footer-card::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.12), transparent);
  }

  .teacher-footer-text {
    font-family: 'DM Sans', sans-serif;
    font-size: 0.7rem;
    color: rgba(255,255,255,0.5);
  }

  /* ── Mobile close ────────────────────────────────────────────────────── */
  .teacher-close-btn {
    width: 34px; height: 34px;
    border-radius: 9px;
    display: flex; align-items: center; justify-content: center;
    color: rgba(255,255,255,0.45);
    background: transparent;
    border: 1px solid rgba(255,255,255,0.08);
    cursor: pointer;
    transition: color 0.2s, background 0.2s, border-color 0.2s;
  }
  .teacher-close-btn:hover {
    color: white;
    background: rgba(255,255,255,0.1);
    border-color: rgba(255,255,255,0.18);
  }

  /* ── Slim scrollbar ──────────────────────────────────────────────────── */
  .teacher-nav-scroll { 
    overflow-y: auto;
    overflow-x: hidden;
  }
  .teacher-nav-scroll::-webkit-scrollbar { width: 3px; }
  .teacher-nav-scroll::-webkit-scrollbar-track { background: transparent; }
  .teacher-nav-scroll::-webkit-scrollbar-thumb {
    background: rgba(255,255,255,0.1);
    border-radius: 99px;
  }
  .teacher-nav-scroll::-webkit-scrollbar-thumb:hover {
    background: rgba(255,255,255,0.2);
  }

  /* Mobile responsive adjustments */
  @media (max-width: 1023px) {
    .teacher-main-content {
      margin-left: 0 !important;
    }
    .teacher-loading-overlay {
      margin-left: 0 !important;
    }
  }

  @media (min-width: 1024px) {
    .teacher-main-content {
      margin-left: 256px;
    }
    .teacher-loading-overlay {
      margin-left: 256px;
    }
  }
`;

function MainLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isNavLoading, setIsNavLoading] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const navigationTimerRef = useRef(null);

  const navItems = [
    { path: "/dashboard", label: t("nav.dashboard", "Dashboard"), icon: FaChartLine },
    { path: "/my-classes", label: "My Classes", icon: FaChalkboard },
    { path: "/students", label: t("nav.students", "Students"), icon: FaUsers },
    { path: "/add-student", label: "Add Student", icon: FaUserPlus },
    { path: "/data-entry", label: t("nav.dataEntry", "Data Entry"), icon: FaClipboardList },
    { path: "/attendance-history", label: "Attendance History", icon: FaHistory },
    { path: "/interventions-history", label: "Interventions History", icon: FaHandsHelping },
    { path: "/score-history", label: "Score History", icon: FaChartBar },
    { path: "/gamification", label: "Progress", icon: FaTrophy },
  ];

  const closeSidebar = () => setSidebarOpen(false);

  const handleSidebarNavigation = (path) => {
    closeSidebar();
    setIsNavLoading(true);

    if (navigationTimerRef.current) {
      clearTimeout(navigationTimerRef.current);
    }

    navigationTimerRef.current = setTimeout(() => {
      setIsNavLoading(false);
      navigate(path);
    }, 2000);
  };

  useEffect(() => {
    return () => {
      if (navigationTimerRef.current) {
        clearTimeout(navigationTimerRef.current);
      }
    };
  }, []);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: TEACHER_SIDEBAR_STYLES }} />
      
      <div className="min-h-screen flex" style={{ backgroundColor: "#f5f8fb" }}>
        
        {/* Mobile Overlay */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity"
            onClick={closeSidebar}
          />
        )}

        {/* Sidebar */}
        <aside
          className={`teacher-sidebar fixed top-0 left-0 z-50 w-64 h-screen 
          transition-transform duration-300 ease-in-out lg:translate-x-0 
          flex flex-col shadow-xl
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
          style={{ position: 'fixed' }}
        >
          {/* Logo Header */}
          <div className="teacher-logo-wrap">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div className="teacher-logo-icon">
                <span style={{ color: 'white', fontSize: '1.1rem', fontWeight: '700', position: 'relative', zIndex: 1 }}>PE</span>
              </div>
              <div>
                <div className="teacher-brand-name">Proactive Education</div>
                <div className="teacher-brand-sub">Teacher Portal</div>
              </div>
            </div>

            {/* Mobile Close Button */}
            <button
              className="teacher-close-btn lg:hidden"
              onClick={closeSidebar}
              aria-label="Close sidebar"
            >
              <FaTimes style={{ fontSize: '0.9rem' }} />
            </button>
          </div>

          {/* Navigation */}
          <nav className="teacher-nav-scroll flex-1 py-3">
            <div className="teacher-section-label">Overview</div>

            {/* First Group: Main navigation */}
            {navItems.slice(0, 4).map((item) => {
              const Icon = item.icon;
              const active = location.pathname.startsWith(item.path);
              return (
                <button
                  key={item.path}
                  type="button"
                  onClick={() => handleSidebarNavigation(item.path)}
                  className={`teacher-nav-item${active ? ' teacher-active' : ''}`}
                >
                  <span className="teacher-nav-icon"><Icon /></span>
                  <span>{item.label}</span>
                </button>
              );
            })}

            <div className="teacher-divider" />
            <div className="teacher-section-label">Analytics & History</div>

            {/* Second Group: Analytics and History */}
            {navItems.slice(4).map((item) => {
              const Icon = item.icon;
              const active = location.pathname.startsWith(item.path);
              return (
                <button
                  key={item.path}
                  type="button"
                  onClick={() => handleSidebarNavigation(item.path)}
                  className={`teacher-nav-item${active ? ' teacher-active' : ''}`}
                >
                  <span className="teacher-nav-icon"><Icon /></span>
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="teacher-footer">
            <div className="teacher-footer-card">
              <p className="teacher-footer-text">Proactive Education Assistant</p>
            </div>
          </div>
        </aside>

        {/* Main Area */}
        <div className="teacher-main-content flex-1 flex flex-col">
          {/* Mobile Header with Menu Button */}
          <div 
            className="lg:hidden fixed top-0 right-0 z-30 h-16 flex items-center px-4 shadow-sm"
            style={{
              backgroundColor: "#ffffff",
              borderBottom: "1px solid rgba(26, 111, 181, 0.08)",
              left: '0'
            }}
          >
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-lg transition-all"
              style={{
                color: "#6b7a8d",
                backgroundColor: "rgba(26, 111, 181, 0.06)",
                border: "1px solid rgba(26, 111, 181, 0.12)"
              }}
              aria-label="Open sidebar"
            >
              <FaBars className="text-lg" />
            </button>
            
            <div className="ml-3 flex items-center gap-2">
              <div 
                className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ 
                  background: "linear-gradient(135deg, #1a6fb5 0%, #2d8fd4 100%)"
                }}
              >
                <span style={{ color: "white", fontWeight: "700", fontSize: "0.8rem" }}>PE</span>
              </div>
              <h2 
                className="text-sm font-semibold"
                style={{ color: "#1e2c3a" }}
              >
                Proactive Education
              </h2>
            </div>
          </div>

          {/* Desktop Header */}
          <div className="hidden lg:block">
            <Header
              onToggleSidebar={() => setSidebarOpen((prev) => !prev)}
              isSidebarOpen={sidebarOpen}
            />
          </div>

          {/* Main Content */}
          <main className="flex-1 pt-16 lg:pt-0" style={{ minHeight: '100vh' }}>
            <Outlet />
          </main>

          <DashboardFooter />
        </div>

        {/* Loading Overlay */}
        {isNavLoading && (
          <div 
            className="fixed z-40 flex items-center justify-center teacher-loading-overlay"
            style={{ 
              backgroundColor: "rgba(255, 255, 255, 0.95)",
              top: 0,
              bottom: 0,
              left: 0,
              right: 0
            }}
          >
            <img src={loadingGif} alt="Loading" className="w-96 h-96 object-contain" />
          </div>
        )}
      </div>
    </>
  );
}

export default MainLayout;