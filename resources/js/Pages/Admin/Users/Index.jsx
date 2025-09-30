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
    Hash,
} from "lucide-react";

const UsersIndex = ({ usersall, authUser, flash }) => {
    const [showModal, setShowModal] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);
    const [syncing, setSyncing] = useState(false);
    const [roleFilter, setRoleFilter] = useState("all"); // NEW

    const { data, setData, post, put, processing, errors, reset } = useForm({
        name: "",
        email: "",
        sgguserid: "",
        password: "",
        role: "player",
    });

    const filteredUsers = usersall.filter((user) => {
        if (roleFilter === "all") return true;
        return user.role === roleFilter;
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
        if (
            confirm(
                "Yakin ingin sinkronkan semua players dari semua tournaments? Proses ini mungkin memakan waktu."
            )
        ) {
            setSyncing(true);
            router.post(
                "/admin/users/sync-all",
                {},
                {
                    onFinish: () => setSyncing(false),
                }
            );
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
                                <RefreshCw
                                    className={`h-4 w-4 mr-2 ${
                                        syncing ? "animate-spin" : ""
                                    }`}
                                />
                                {syncing ? "Syncing..." : "Sync All Players"}
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

{/* Filter Dropdown */}
<div className="bg-gray-800 rounded-2xl p-4 border border-gray-700 mb-4 flex flex-wrap items-center justify-between">
  <h2 className="text-lg font-semibold text-white mb-3 sm:mb-0">
    Filter Users
  </h2>
  <div className="flex space-x-2">
    {["all", "admin", "player"].map((role) => (
      <button
        key={role}
        onClick={() => setRoleFilter(role)}
        className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
          roleFilter === role
            ? role === "admin"
              ? "bg-red-600 text-white"
              : role === "player"
              ? "bg-blue-600 text-white"
              : "bg-gray-600 text-white"
            : "bg-gray-700 text-gray-300 hover:bg-gray-600"
        }`}
      >
        {role === "all"
          ? "All Users"
          : role.charAt(0).toUpperCase() + role.slice(1)}
      </button>
    ))}
  </div>
</div>

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
                                {filteredUsers.map((user) => (
                                    <tr
                                        key={user.id}
                                        className="hover:bg-gray-700 transition-colors"
                                    >
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
                                            {new Date(
                                                user.created_at
                                            ).toLocaleDateString("id-ID")}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <div className="flex justify-end space-x-2">
                                                <button
                                                    onClick={() =>
                                                        openModal(user)
                                                    }
                                                    className="inline-flex items-center px-3 py-1.5 border border-gray-600 shadow-sm text-xs font-medium rounded text-gray-300 bg-gray-700 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                                                >
                                                    <Edit3 className="h-3 w-3 mr-1" />
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() =>
                                                        handleDelete(user)
                                                    }
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

                        {filteredUsers.length === 0 && (
                            <div className="text-center py-12">
                                <Users className="mx-auto h-12 w-12 text-gray-400" />
                                <h3 className="mt-2 text-sm font-medium text-white">
                                    Tidak ada user
                                </h3>
                                <p className="mt-1 text-sm text-gray-400">
                                    Mulai dengan menambahkan user baru atau sync
                                    dari Start.gg.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* ... (modal form & delete modal tetap sama) ... */}
        </AdminLayout>
    );
};

export default UsersIndex;
