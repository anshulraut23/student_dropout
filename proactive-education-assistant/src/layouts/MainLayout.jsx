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
    { path: "/students", label: t("nav.students", "Students") },
    { path: "/data-entry", label: t("nav.dataEntry", "Data Entry") },
    { path: "/about", label: t("nav.about", "About") },
    { path: "/contact", label: t("nav.contact", "Contact") },
  ];

  return (
    <div className="min-h-screen flex bg-slate-100 dark:bg-gray-900">
      
      {/* Sidebar */}
      <aside
        className={`fixed top-16 left-0 z-40 w-64 bg-slate-900 text-slate-300
        border-r border-slate-800 transition-transform duration-200
        min-h-[calc(100vh-4rem)]
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <nav className="flex flex-col h-full px-3 py-4 space-y-1">
          {navItems.map((item) => {
            const active = location.pathname.startsWith(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`block px-3 py-2 rounded-md text-sm font-medium transition-colors
                  ${
                    active
                      ? "bg-slate-800 text-white"
                      : "text-slate-300 hover:bg-slate-800 hover:text-white"
                  }`}
              >
                {item.label}
              </Link>
            );
          })}

          {/* Sidebar bottom filler (keeps bg till bottom) */}
          <div className="flex-1" />

          <div className="px-3 py-3 text-xs text-slate-500 border-t border-slate-800">
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
