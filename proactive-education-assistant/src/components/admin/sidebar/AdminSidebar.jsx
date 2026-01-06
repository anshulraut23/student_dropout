import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  FaChartLine, 
  FaUserTie, 
  FaChalkboard, 
  FaUsers, 
  FaFileImport, 
  FaChartBar,
  FaBars,
  FaTimes
} from 'react-icons/fa';

function AdminSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  const menuItems = [
    { path: '/admin/dashboard', label: 'Dashboard', icon: FaChartLine },
    { path: '/admin/teachers', label: 'Teachers', icon: FaUserTie },
    { path: '/admin/classes', label: 'Classes', icon: FaChalkboard },
    { path: '/admin/students', label: 'Students', icon: FaUsers },
    { path: '/admin/data-import', label: 'Data Import', icon: FaFileImport },
    { path: '/admin/analytics', label: 'Analytics', icon: FaChartBar },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="md:hidden fixed top-4 left-4 z-50 bg-blue-600 text-white p-2 rounded-md shadow-lg"
      >
        {collapsed ? <FaBars size={20} /> : <FaTimes size={20} />}
      </button>

      {/* Sidebar */}
      <aside
        className={`
          fixed md:sticky top-0 left-0 h-screen bg-linear-to-b from-blue-900 to-blue-800 text-white
          transition-all duration-300 z-40 shadow-xl
          ${collapsed ? '-translate-x-full md:translate-x-0 md:w-20' : 'translate-x-0 w-64'}
        `}
      >
        {/* Logo Section */}
        <div className="h-16 flex items-center justify-center border-b border-blue-700">
          {!collapsed ? (
            <h1 className="text-xl font-bold">Admin Panel</h1>
          ) : (
            <span className="text-2xl font-bold">A</span>
          )}
        </div>

        {/* Navigation */}
        <nav className="mt-6 px-3">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`
                  flex items-center gap-4 px-4 py-3 mb-2 rounded-lg transition-all
                  ${active 
                    ? 'bg-white text-blue-900 shadow-md' 
                    : 'hover:bg-blue-700 text-white'
                  }
                  ${collapsed ? 'justify-center' : ''}
                `}
                title={collapsed ? item.label : ''}
              >
                <Icon size={20} className="shrink-0" />
                {!collapsed && (
                  <span className="font-medium">{item.label}</span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Toggle Button (Desktop) */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="hidden md:flex absolute bottom-6 left-1/2 transform -translate-x-1/2 
                     bg-blue-700 hover:bg-blue-600 px-4 py-2 rounded-md transition-colors"
        >
          {collapsed ? '→' : '←'}
        </button>
      </aside>

      {/* Overlay for Mobile */}
      {!collapsed && (
        <div
          onClick={() => setCollapsed(true)}
          className="md:hidden fixed inset-0 bg-black/50 z-30"
        />
      )}
    </>
  );
}

export default AdminSidebar;
