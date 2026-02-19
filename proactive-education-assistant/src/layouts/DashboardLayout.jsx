import { useState } from "react";
import { Outlet } from "react-router-dom";
import Header from "../components/layouts/Header";
import DashboardFooter from "../components/layouts/DashboardFooter";
import Sidebar from "../components/layouts/Slidebar";

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen flex bg-gray-50">
      
      {/* Sidebar */}
      <div
        className={`${sidebarOpen ? "block" : "hidden"}`}
      >
        <Sidebar />
      </div>

      {/* Main Area */}
      <div 
        className={`flex-1 flex flex-col transition-all duration-200 pt-16
        ${sidebarOpen ? "lg:ml-64" : ""}`}
      >
        <Header onToggleSidebar={() => setSidebarOpen((prev) => !prev)} />
        <main className="flex-1">
          <Outlet />
        </main>
        <DashboardFooter />
      </div>

    </div>
  );
}




