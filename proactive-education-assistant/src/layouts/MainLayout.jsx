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
  FaFileAlt,
  FaHistory,
  FaChartBar
} from "react-icons/fa";
import Header from "../components/layouts/Header";
import DashboardFooter from "../components/layouts/DashboardFooter";
import loadingGif from "../assets/loading.gif";
import { useTheme } from "../context/ThemeContext";

function MainLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isNavLoading, setIsNavLoading] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { theme } = useTheme();
  const navigationTimerRef = useRef(null);

  const navItems = [
    { path: "/dashboard", label: t("nav.dashboard", "Dashboard"), icon: FaChartLine },
    { path: "/my-classes", label: "My Classes", icon: FaChalkboard },
    { path: "/students", label: t("nav.students", "Students"), icon: FaUsers },
    { path: "/add-student", label: "Add Student", icon: FaUserPlus },
    { path: "/data-entry", label: t("nav.dataEntry", "Data Entry"), icon: FaClipboardList },
    { path: "/attendance-history", label: "Attendance History", icon: FaHistory },
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
    <div className="min-h-screen flex bg-gray-50">
      
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-50 w-64 h-screen border border-gray-300
        transition-transform duration-300 ease-in-out lg:translate-x-0
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
        style={{ backgroundColor: '#f8fafc' }}
      >
        {/* Mobile Close Button */}
        <div className="lg:hidden flex items-center justify-between p-4 border-b" style={{ borderColor: '#d1d5db' }}>
          <h2 className="text-lg font-semibold text-gray-900">Menu</h2>
          <button
            onClick={closeSidebar}
            className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <FaTimes className="text-xl" />
          </button>
        </div>

        <nav className="flex flex-col h-[calc(100%-4rem)] lg:h-full py-4">
          <div className="px-3 space-y-1 flex-1 overflow-y-auto">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = location.pathname.startsWith(item.path);
              return (
                <button
                  key={item.path}
                  type="button"
                  onClick={() => handleSidebarNavigation(item.path)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all
                    ${
                      active
                        ? theme === "dark"
                          ? "bg-white text-black shadow-lg"
                          : "bg-gray-400 text-white shadow-lg"
                        : "text-gray-900 hover:bg-gray-200 hover:text-gray-900"
                    } w-full text-left`}
                >
                  <Icon className="text-lg flex-shrink-0" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          {/* Footer */}
          <div className="px-4 py-3 border-t" style={{ borderColor: '#d1d5db' }}>
            <p className="text-xs text-gray-500 text-center">
              Proactive Education Assistant
            </p>
          </div>
        </nav>
      </aside>

      {/* Main Area */}
      <div className="flex-1 flex flex-col lg:ml-64">
        {/* Mobile Header with Menu Button */}
        <div className="lg:hidden fixed top-0 left-0 right-0 z-30 bg-white border-b border-gray-200 h-16 flex items-center px-4">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <FaBars className="text-xl" />
          </button>
          <div className="ml-3 flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">PE</span>
            </div>
            <span className="font-semibold text-gray-900">Proactive Education</span>
          </div>
        </div>

        {/* Desktop Header */}
        <div className="hidden lg:block">
          <Header
            onToggleSidebar={() => setSidebarOpen((prev) => !prev)}
            isSidebarOpen={sidebarOpen}
          />
        </div>

        <main className="flex-1 pt-16 lg:pt-0">
          <Outlet />
        </main>

        <DashboardFooter />
      </div>

      {isNavLoading && (
        <div className="fixed inset-0 lg:left-64 z-40 bg-white flex items-center justify-center">
          <img src={loadingGif} alt="Loading" className="w-96 h-96 object-contain" />
        </div>
      )}
    </div>
  );
}

export default MainLayout;
