import React from "react";
import AdminLayout from "@/Layouts/AdminLayout";

const AdminDashboard = ({ auth }) => {
  return (
    <AdminLayout
      user={auth.user}
      currentPage="dashboard"
      menuItems={[
        {
          path: "dashboard",
          label: "Dashboard",
          component: ({ user }) => (
            <div>
              <h2 className="text-2xl font-bold mb-4">Welcome back, {user.name}</h2>
              <p className="text-gray-400">
                Ini adalah halaman utama admin panel kamu.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                <div className="bg-gray-800 rounded-2xl p-6 shadow">
                  <h3 className="text-lg font-semibold mb-2">Total Users</h3>
                  <p className="text-3xl font-bold">120</p>
                </div>
                <div className="bg-gray-800 rounded-2xl p-6 shadow">
                  <h3 className="text-lg font-semibold mb-2">Tournaments</h3>
                  <p className="text-3xl font-bold">8</p>
                </div>
                <div className="bg-gray-800 rounded-2xl p-6 shadow">
                  <h3 className="text-lg font-semibold mb-2">StartGG Sync</h3>
                  <p className="text-3xl font-bold text-green-400">OK</p>
                </div>
              </div>
            </div>
          ),
        },
      ]}
    />
  );
};

export default AdminDashboard;
