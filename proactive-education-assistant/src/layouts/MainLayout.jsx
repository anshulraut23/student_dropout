import { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Header from '../components/layouts/Header';
import Footer from '../components/layouts/Footer';

function MainLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();
  const { t } = useTranslation();

  const navItems = [
    { path: '/dashboard', label: t('nav.dashboard') },
    { path: '/students', label: t('nav.students') },
    { path: '/about', label: t('nav.about') },
    { path: '/contact', label: t('nav.contact') },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header
        onToggleSidebar={() => setSidebarOpen((prev) => !prev)}
        isSidebarOpen={sidebarOpen}
      />
      <aside
        className={`fixed top-16 left-0 bottom-0 z-40 w-64 bg-white border-r border-slate-200 transition-transform duration-200 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <nav className="p-4 space-y-1">
          {navItems.map((item) => {
            const active = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`block px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  active
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>
      <main className={`flex-1 pt-16 ${sidebarOpen ? 'lg:pl-64' : ''}`}>
        <Outlet />
      </main>
      <div className={sidebarOpen ? 'lg:pl-64' : ''}>
        <Footer />
      </div>
    </div>
  );
}

export default MainLayout;
