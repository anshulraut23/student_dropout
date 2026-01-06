import { Outlet } from 'react-router-dom';
import AdminSidebar from '../components/admin/sidebar/AdminSidebar';

function AdminLayout() {
  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar */}
      <AdminSidebar />
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Optional Top Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 h-16 flex items-center px-6">
          <h2 className="text-lg font-semibold text-gray-800">Admin Dashboard</h2>
        </header>
        
        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;
