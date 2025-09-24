import React, { useState } from "react";
import { router, useForm, Head } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";
import { 
  Plus, 
  Edit3, 
  Trash2, 
  Users, 
  RefreshCw, 
  X, 
  UserPlus, 
  Mail, 
  Shield, 
  Hash 
} from "lucide-react";

const UsersIndex = ({ usersall, authUser, flash }) => {
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [syncing, setSyncing] = useState(false);

  const { data, setData, post, put, processing, errors, reset } = useForm({
    name: "",
    email: "",
    sgguserid: "",
    password: "",
    role: "player",
  });

  const openModal = (user = null) => {
    if (user) {
      setEditingUser(user);
      setData({
        name: user.name,
        email: user.email || "",
        sgguserid: user.sgguserid || "",
        password: "",
        role: user.role,
      });
    } else {
      setEditingUser(null);
      reset();
      setData("role", "player");
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingUser(null);
    reset();
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (editingUser) {
      put(route("users.update", editingUser.id), {
        onSuccess: () => {
          closeModal();
        },
      });
    } else {
      post(route("users.store"), {
        onSuccess: () => {
          closeModal();
        },
      });
    }
  };

  const handleDelete = (user) => {
    setUserToDelete(user);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (userToDelete) {
      router.delete(route("users.destroy", userToDelete.id), {
        onSuccess: () => {
          setShowDeleteModal(false);
          setUserToDelete(null);
        },
      });
    }
  };

  const handleSync = () => {
    if (confirm("Yakin ingin sinkronkan semua players dari semua tournaments? Proses ini mungkin memakan waktu.")) {
      setSyncing(true);
      router.post("/admin/users/sync-all", {}, {
        onFinish: () => setSyncing(false),
      });
    }
  };

  return (
    <AdminLayout user={authUser}>
      <Head title="Admin - Users Management" />

      <div className="space-y-6">
        {/* Header */}
        <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">
                Users Management
              </h1>
              <p className="mt-1 text-sm text-gray-400">
                Kelola semua user yang terdaftar di sistem
              </p>
            </div>
            <div className="mt-4 sm:mt-0 flex space-x-3">
              <button
                onClick={handleSync}
                disabled={syncing}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 transition-colors"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${syncing ? 'animate-spin' : ''}`} />
                {syncing ? 'Syncing...' : 'Sync All Players'}
              </button>
              <button
                onClick={() => openModal()}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                <Plus className="h-4 w-4 mr-2" />
                Tambah User
              </button>
            </div>
          </div>
        </div>

        {/* Flash Messages */}
        {flash?.success && (
          <div className="bg-green-900 border border-green-700 text-green-100 px-4 py-3 rounded-lg">
            <p className="text-sm">{flash.success}</p>
          </div>
        )}
        {flash?.error && (
          <div className="bg-red-900 border border-red-700 text-red-100 px-4 py-3 rounded-lg">
            <p className="text-sm">{flash.error}</p>
          </div>
        )}

        {/* Users Table */}
        <div className="bg-gray-800 rounded-2xl shadow-lg border border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-700">
              <thead className="bg-gray-900">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    <div className="flex items-center">
                      <Hash className="h-4 w-4 mr-1" />
                      ID
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-1" />
                      Name
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    <div className="flex items-center">
                      <Mail className="h-4 w-4 mr-1" />
                      Email
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    SGG User ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    <div className="flex items-center">
                      <Shield className="h-4 w-4 mr-1" />
                      Role
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Created At
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-gray-800 divide-y divide-gray-700">
                {usersall.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-700 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {user.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-white">
                        {user.name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {user.email || "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {user.sgguserid || "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          user.role === "admin"
                            ? "bg-red-900 text-red-100"
                            : "bg-blue-900 text-blue-100"
                        }`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {new Date(user.created_at).toLocaleDateString("id-ID")}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => openModal(user)}
                          className="inline-flex items-center px-3 py-1.5 border border-gray-600 shadow-sm text-xs font-medium rounded text-gray-300 bg-gray-700 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                        >
                          <Edit3 className="h-3 w-3 mr-1" />
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(user)}
                          className="inline-flex items-center px-3 py-1.5 border border-red-600 shadow-sm text-xs font-medium rounded text-red-300 bg-red-900 hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
                        >
                          <Trash2 className="h-3 w-3 mr-1" />
                          Hapus
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {usersall.length === 0 && (
              <div className="text-center py-12">
                <Users className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-white">
                  Tidak ada user
                </h3>
                <p className="mt-1 text-sm text-gray-400">
                  Mulai dengan menambahkan user baru atau sync dari Start.gg.
                </p>
                <div className="mt-6 flex justify-center space-x-3">
                  <button
                    onClick={() => openModal()}
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Tambah User
                  </button>
                  <button
                    onClick={handleSync}
                    disabled={syncing}
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 transition-colors"
                  >
                    <RefreshCw className={`h-4 w-4 mr-2 ${syncing ? 'animate-spin' : ''}`} />
                    {syncing ? 'Syncing...' : 'Sync Players'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal Form */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
          <div className="relative bg-gray-800 border border-gray-700 w-full max-w-md shadow-lg rounded-2xl">
            <div className="flex items-center justify-between p-6 border-b border-gray-700">
              <h3 className="text-lg font-medium text-white">
                {editingUser ? "Edit User" : "Tambah User Baru"}
              </h3>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6">
              <div className="space-y-4">
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Nama *
                  </label>
                  <input
                    type="text"
                    value={data.name}
                    onChange={(e) => setData("name", e.target.value)}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-white"
                    required
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-400">{errors.name}</p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={data.email}
                    onChange={(e) => setData("email", e.target.value)}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-white"
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-400">{errors.email}</p>
                  )}
                </div>

                {/* SGG User ID */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Start.gg User ID
                  </label>
                  <input
                    type="number"
                    value={data.sgguserid}
                    onChange={(e) => setData("sgguserid", e.target.value)}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-white"
                    placeholder="ID unik dari Start.gg"
                  />
                  {errors.sgguserid && (
                    <p className="mt-1 text-sm text-red-400">{errors.sgguserid}</p>
                  )}
                </div>

                {/* Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Password {editingUser ? "(kosongkan jika tidak ingin mengubah)" : "*"}
                  </label>
                  <input
                    type="password"
                    value={data.password}
                    onChange={(e) => setData("password", e.target.value)}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-white"
                    required={!editingUser}
                  />
                  {errors.password && (
                    <p className="mt-1 text-sm text-red-400">{errors.password}</p>
                  )}
                </div>

                {/* Role */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Role *
                  </label>
                  <select
                    value={data.role}
                    onChange={(e) => setData("role", e.target.value)}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-white"
                    required
                  >
                    <option value="player">Player</option>
                    <option value="admin">Admin</option>
                  </select>
                  {errors.role && (
                    <p className="mt-1 text-sm text-red-400">{errors.role}</p>
                  )}
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex justify-end space-x-3 mt-6 pt-6 border-t border-gray-700">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 border border-gray-600 rounded-lg shadow-sm text-sm font-medium text-gray-300 bg-gray-700 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={processing}
                  className="px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-colors"
                >
                  {processing ? "Menyimpan..." : editingUser ? "Update" : "Simpan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
          <div className="relative bg-gray-800 border border-gray-700 w-full max-w-md shadow-lg rounded-2xl">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-900">
                  <Trash2 className="h-6 w-6 text-red-400" />
                </div>
              </div>
              <div className="text-center">
                <h3 className="text-lg leading-6 font-medium text-white">
                  Hapus User
                </h3>
                <div className="mt-2">
                  <p className="text-sm text-gray-400">
                    Apakah Anda yakin ingin menghapus user "{userToDelete?.name}"?
                    Tindakan ini tidak dapat dibatalkan.
                  </p>
                </div>
              </div>
              <div className="mt-6 flex space-x-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="w-full px-4 py-2 border border-gray-600 rounded-lg shadow-sm text-sm font-medium text-gray-300 bg-gray-700 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
                >
                  Batal
                </button>
                <button
                  onClick={confirmDelete}
                  className="w-full px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
                >
                  Hapus
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default UsersIndex;