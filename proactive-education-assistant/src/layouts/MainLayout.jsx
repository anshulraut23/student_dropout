import { useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Header from "../components/layouts/Header";
import DashboardFooter from "../components/layouts/DashboardFooter";

function MainLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();
  const { t } = useTranslation();

  const navItems = [
    { path: "/dashboard", label: t("nav.dashboard", "Dashboard") },
    { path: "/my-classes", label: "My Classes" },
    { path: "/students", label: t("nav.students", "Students") },
    { path: "/add-student", label: "Add Student" },
    { path: "/data-entry", label: t("nav.dataEntry", "Data Entry") },
    { path: "/gamification", label: "Progress" },
  ];

  return (
    <div className="min-h-screen flex bg-gray-50">
      
      {/* Sidebar */}
      <aside
        className={`fixed top-16 left-0 z-40 w-64 bg-white border-r border-gray-200
        transition-transform duration-200 min-h-[calc(100vh-4rem)]
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <nav className="flex flex-col h-full px-3 py-4 space-y-1">
          {navItems.map((item) => {
            const active = location.pathname.startsWith(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`block px-4 py-2.5 rounded-lg text-sm font-medium transition-colors
                  ${
                    active
                      ? "bg-blue-50 text-blue-700"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
              >
                {item.label}
              </Link>
            );
          })}

          {/* Sidebar bottom filler */}
          <div className="flex-1" />

          <div className="px-4 py-3 text-xs text-gray-500 border-t border-gray-200">
            Proactive Education Assistant
          </div>
        </nav>
      </aside>

      {/* Main Area */}
      <div
        className={`flex-1 flex flex-col transition-all duration-200
        ${sidebarOpen ? "lg:ml-64" : ""}`}
      >
        <Header
          onToggleSidebar={() => setSidebarOpen((prev) => !prev)}
          isSidebarOpen={sidebarOpen}
        />

        <main className="flex-1 pt-16">
          <Outlet />
        </main>

        <DashboardFooter />
      </div>
    </div>
  );
}

export default MainLayout;
