import React from "react";
import { router } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";

const UsersIndex = ({ usersall, authUser, flash }) => {
  const handleSync = () => {
    if (confirm("Yakin ingin sinkronkan semua players dari semua tournaments?")) {
      router.post("/admin/users/sync-all");
    }
  };

  return (
    <AdminLayout user={authUser}>
      <h1 className="text-2xl font-bold mb-6">Users Management</h1>

      {/* Flash Message */}
      {flash?.success && (
        <div className="mb-4 p-3 bg-green-600 text-white rounded">
          {flash.success}
        </div>
      )}
      {flash?.error && (
        <div className="mb-4 p-3 bg-red-600 text-white rounded">
          {flash.error}
        </div>
      )}

      {/* Tombol Sync */}
      <div className="mb-6">
        <button
          onClick={handleSync}
          className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded text-white"
        >
          Sync All Players
        </button>
      </div>

      {/* Tabel Users */}
      <div className="overflow-x-auto">
        <table className="min-w-full text-left border border-gray-700">
          <thead className="bg-gray-800 text-gray-300">
            <tr>
              <th className="px-4 py-2 border border-gray-700">ID</th>
              <th className="px-4 py-2 border border-gray-700">Name</th>
              <th className="px-4 py-2 border border-gray-700">Email</th>
              <th className="px-4 py-2 border border-gray-700">SGG User ID</th>
              <th className="px-4 py-2 border border-gray-700">Role</th>
            </tr>
          </thead>
          <tbody>
            {usersall.map((u) => (
              <tr key={u.id}>
                <td className="px-4 py-2 border border-gray-700">{u.id}</td>
                <td className="px-4 py-2 border border-gray-700">{u.name}</td>
                <td className="px-4 py-2 border border-gray-700">{u.email}</td>
                <td className="px-4 py-2 border border-gray-700">
                  {u.sgguserid ?? "-"}
                </td>
                <td className="px-4 py-2 border border-gray-700">{u.role}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
};

export default UsersIndex;
