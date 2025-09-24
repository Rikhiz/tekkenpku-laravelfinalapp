import React, { useState } from "react";
import { Menu } from "lucide-react";
import AdminHeader from "@/Components/AdminHeader";

const AdminLayout = ({ user, children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 w-64 bg-gray-900 border-r border-gray-800 p-4 transform transition-transform duration-200 z-40
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
      >
        <AdminHeader user={user} />
      </aside>

      {/* Overlay (Mobile Only) */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="lg:ml-64 flex flex-col min-h-screen">
        {/* Header mobile */}
        <header className="bg-gray-900 border-b border-gray-700 h-16 flex items-center justify-between px-4 lg:hidden">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-white hover:text-red-500 transition-colors"
          >
            <Menu size={24} />
          </button>
          <h1 className="text-white text-xl font-bold">Admin Panel</h1>
        </header>

        {/* Page Content */}
        <main className="flex-1 bg-black p-6 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;