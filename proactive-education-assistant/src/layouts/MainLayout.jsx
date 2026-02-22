import { useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
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
  FaHistory
} from "react-icons/fa";
import Header from "../components/layouts/Header";
import DashboardFooter from "../components/layouts/DashboardFooter";

function MainLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const { t } = useTranslation();

  const navItems = [
    { path: "/dashboard", label: t("nav.dashboard", "Dashboard"), icon: FaChartLine },
    { path: "/my-classes", label: "My Classes", icon: FaChalkboard },
    { path: "/students", label: t("nav.students", "Students"), icon: FaUsers },
    { path: "/add-student", label: "Add Student", icon: FaUserPlus },
    { path: "/data-entry", label: t("nav.dataEntry", "Data Entry"), icon: FaClipboardList },
    { path: "/attendance-history", label: "Attendance History", icon: FaHistory },
    { path: "/gamification", label: "Progress", icon: FaTrophy },
  ];

  const closeSidebar = () => setSidebarOpen(false);

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
        className={`fixed top-0 left-0 z-50 w-64 h-screen
        transition-transform duration-300 ease-in-out lg:translate-x-0
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
        style={{ backgroundColor: '#1d2530' }}
      >
        {/* Mobile Close Button */}
        <div className="lg:hidden flex items-center justify-between p-4 border-b" style={{ borderColor: '#2a3744' }}>
          <h2 className="text-lg font-semibold text-white">Menu</h2>
          <button
            onClick={closeSidebar}
            className="p-2 text-gray-300 hover:text-white hover:bg-gray-700/50 rounded-lg transition-colors"
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
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={closeSidebar}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all
                    ${
                      active
                        ? "bg-blue-600 text-white shadow-lg"
                        : "text-gray-300 hover:bg-gray-700/50 hover:text-white"
                    }`}
                >
                  <Icon className="text-lg flex-shrink-0" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Footer */}
          <div className="px-4 py-3 border-t" style={{ borderColor: '#2a3744' }}>
            <p className="text-xs text-gray-400 text-center">
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
    </div>
  );
}

export default MainLayout;
