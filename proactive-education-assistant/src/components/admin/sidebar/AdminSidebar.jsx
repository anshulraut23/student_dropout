import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  FaChartLine, 
  FaUserTie, 
  FaChalkboard, 
  FaUsers, 
  FaFileImport, 
  FaChartBar,
  FaShieldAlt,
  FaChevronRight
} from 'react-icons/fa';

function AdminSidebar({ onClose }) {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  const menuItems = [
    { path: '/admin/dashboard', label: 'Dashboard', icon: FaChartLine },
    { path: '/admin/teachers', label: 'Teachers', icon: FaUserTie },
    { path: '/admin/classes', label: 'Classes', icon: FaChalkboard },
    { path: '/admin/subjects', label: 'Subjects', icon: FaFileImport },
    { path: '/admin/students', label: 'Students', icon: FaUsers },
    { path: '/admin/data-import', label: 'Data Import', icon: FaFileImport },
    { path: '/admin/analytics', label: 'Analytics', icon: FaChartBar },
  ];

  const isActive = (path) => location.pathname === path;

  const handleNavClick = () => {
    if (onClose) onClose();
  };

  return (
    <aside className="w-64 bg-gradient-to-b from-blue-900 via-blue-800 to-blue-900 text-white h-screen flex flex-col shadow-2xl">
      {/* Logo Section */}
      <div className="h-20 flex items-center justify-center border-b border-blue-700 px-4">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-blue-400 to-purple-500 p-2 rounded-lg">
            <FaShieldAlt className="text-xl text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold">Admin Panel</h1>
            <p className="text-xs text-blue-200">Control Center</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 mt-6 px-4 space-y-2 overflow-y-auto">
        <p className="text-xs font-semibold text-blue-300 uppercase tracking-wider px-4 mb-4">Menu</p>
        {menuItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={handleNavClick}
              className={`
                flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group
                ${active 
                  ? 'bg-gradient-to-r from-white to-blue-50 text-blue-900 shadow-lg' 
                  : 'text-blue-100 hover:bg-blue-700/50'
                }
              `}
            >
              <Icon className={`w-5 h-5 flex-shrink-0 ${active ? 'text-blue-600' : 'group-hover:text-blue-300'}`} />
              <span className="font-medium flex-1">{item.label}</span>
              {active && <FaChevronRight className="w-4 h-4 text-blue-600" />}
            </Link>
          );
        })}
      </nav>

      {/* Footer Section */}
      <div className="border-t border-blue-700 p-4">
        <div className="bg-blue-800/50 rounded-lg p-4 text-center">
          <p className="text-sm text-blue-200">School Management System</p>
          <p className="text-xs text-blue-300 mt-1">v1.0.0</p>
        </div>
      </div>
    </aside>
  );
}

export default AdminSidebar;
