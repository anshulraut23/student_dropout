import { Outlet } from 'react-router-dom';
import AdminSidebar from '../components/admin/sidebar/AdminSidebar';
import { useState } from 'react';
import { FaBars, FaTimes } from 'react-icons/fa';

function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-gray-50 via-gray-50 to-blue-50">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <div className={`fixed lg:static inset-y-0 left-0 z-50 transform transition-transform duration-300 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}>
        <AdminSidebar onClose={() => setSidebarOpen(false)} />
      </div>
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col w-full">
        {/* Top Header */}
        <header className="bg-white shadow-md border-b border-gray-200 h-16 flex items-center px-4 sm:px-6 lg:px-8 sticky top-0 z-30">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden text-gray-700 hover:text-gray-900 mr-4"
          >
            {sidebarOpen ? <FaTimes className="w-6 h-6" /> : <FaBars className="w-6 h-6" />}
          </button>
          <div className="flex-1">
            <h2 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Admin Dashboard
            </h2>
          </div>
        </header>
        
        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;
