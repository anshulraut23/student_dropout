import { Link, useLocation } from 'react-router-dom';
import { 
  FaChartLine, 
  FaUserTie, 
  FaChalkboard, 
  FaBook,
  FaChartBar,
  FaGraduationCap,
  FaTimes
} from 'react-icons/fa';

function AdminSidebar({ onClose }) {
  const location = useLocation();

  const menuItems = [
    { path: '/admin/dashboard', label: 'Dashboard', icon: FaChartLine },
    { path: '/admin/teachers', label: 'Teachers', icon: FaUserTie },
    { path: '/admin/classes', label: 'Classes', icon: FaChalkboard },
    { path: '/admin/subjects', label: 'Subjects', icon: FaBook },
    { path: '/admin/analytics', label: 'Analytics', icon: FaChartBar },
  ];

  const isActive = (path) => location.pathname === path;

  const handleNavClick = () => {
    if (onClose) onClose();
  };

  return (
    <aside className="w-64 min-h-screen flex flex-col" style={{ backgroundColor: '#1d2530' }}>
      {/* Logo Section */}
      <div className="h-16 flex items-center justify-between px-6 border-b flex-shrink-0" style={{ borderColor: '#2a3744' }}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg">
            <FaGraduationCap className="text-xl text-white" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-white">Admin Panel</h1>
            <p className="text-xs text-gray-400">Management</p>
          </div>
        </div>
        
        {/* Mobile Close Button */}
        <button
          onClick={onClose}
          className="lg:hidden p-2 text-gray-300 hover:text-white hover:bg-gray-700/50 rounded-lg transition-colors"
        >
          <FaTimes className="text-lg" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={handleNavClick}
              className={`
                flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-sm font-medium
                ${active 
                  ? 'bg-blue-600 text-white shadow-lg' 
                  : 'text-gray-300 hover:bg-gray-700/50 hover:text-white'
                }
              `}
            >
              <Icon className="text-lg flex-shrink-0" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer Section */}
      <div className="border-t p-4 flex-shrink-0" style={{ borderColor: '#2a3744' }}>
        <div className="rounded-lg p-3 text-center" style={{ backgroundColor: '#2a3744' }}>
          <p className="text-xs text-gray-300 font-medium">School Management</p>
          <p className="text-xs text-gray-500 mt-1">Version 1.0.0</p>
        </div>
      </div>
    </aside>
  );
}

export default AdminSidebar;
