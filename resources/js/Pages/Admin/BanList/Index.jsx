import React, { useState, useMemo } from "react";
import { Head, useForm, router } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";
import { Shield, User, Plus, Edit3, Trash2, Search, X } from "lucide-react";
import Modal from "@/Components/Modal";

const BanListIndex = ({ banlists = [], authUser, users = [] }) => {
    const { data, setData, post, put, processing, reset } = useForm({
        user_id: "",
        major: "No",
        minor: "No",
        mini: "No",
    });

    const [showModal, setShowModal] = useState(false);
    const [editing, setEditing] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [isSearchFocused, setIsSearchFocused] = useState(false);

    // Filter users berdasarkan search query
    const filteredUsers = useMemo(() => {
        if (!searchQuery.trim()) return users;

        const query = searchQuery.toLowerCase();
        return users.filter(
            (user) =>
                user.name.toLowerCase().includes(query) ||
                user.email?.toLowerCase().includes(query)
        );
    }, [users, searchQuery]);

    // Cek apakah user sudah ada di ban list
    const isUserBanned = (userId) => {
        return banlists.data?.some((ban) => ban.user_id === userId);
    };

    const openCreate = () => {
        reset();
        setEditing(null);
        setSearchQuery("");
        setShowModal(true);
    };

    const openEdit = (ban) => {
        setData({
            user_id: ban.user_id,
            major: ban.major,
            minor: ban.minor,
            mini: ban.mini,
        });
        setEditing(ban.id);
        setSearchQuery("");
        setShowModal(true);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editing) {
            put(`/admin/banlist/${editing}`, {
                preserveScroll: true,
                onSuccess: () => {
                    setShowModal(false);
                    reset();
                    setSearchQuery("");
                },
            });
        } else {
            post("/admin/banlist", {
                preserveScroll: true,
                onSuccess: () => {
                    setShowModal(false);
                    reset();
                    setSearchQuery("");
                },
            });
        }
    };

    const handleDelete = (id) => {
        if (confirm("Are you sure you want to delete this ban entry?")) {
            router.delete(`/admin/banlist/${id}`, {
                preserveScroll: true,
            });
        }
    };

    const selectUser = (userId) => {
        setData("user_id", userId);
        setSearchQuery("");
        setIsSearchFocused(false);
    };

    const clearUserSelection = () => {
        setData("user_id", "");
        setSearchQuery("");
    };

    const selectedUser = users.find((u) => u.id === data.user_id);

    const getBadgeColor = (status) => {
        return status === "Yes"
            ? "bg-red-500/20 text-red-400 border-red-500/30"
            : "bg-green-500/20 text-green-400 border-green-500/30";
    };

    return (
        <AdminLayout user={authUser}>
            <Head title="Ban List" />

            <div className="space-y-6">
                {/* Header */}
                <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-3">
                                <Shield className="text-red-500" size={32} />
                                Ban List Management
                            </h1>
                            <p className="text-gray-400 mt-1 text-sm">
                                Manage banned users for Major, Minor, and Mini
                                events
                            </p>
                        </div>
                        <button
                            onClick={openCreate}
                            className="inline-flex items-center gap-2 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white px-5 py-3 rounded-lg shadow-lg hover:shadow-red-500/50 transition-all font-semibold"
                        >
                            <Plus size={18} />
                            Add Ban
                        </button>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-gradient-to-br from-red-900/30 to-red-800/20 border border-red-500/30 rounded-xl p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-red-400 text-sm font-medium">
                                    Total Banned
                                </p>
                                <p className="text-3xl font-bold text-white mt-1">
                                    {banlists.data?.length || 0}
                                </p>
                            </div>
                            <Shield className="text-red-500" size={40} />
                        </div>
                    </div>
                    <div className="bg-gradient-to-br from-yellow-900/30 to-yellow-800/20 border border-yellow-500/30 rounded-xl p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-yellow-400 text-sm font-medium">
                                    Major Bans
                                </p>
                                <p className="text-3xl font-bold text-white mt-1">
                                    {banlists.data?.filter(
                                        (b) => b.major === "Yes"
                                    ).length || 0}
                                </p>
                            </div>
                            <Shield className="text-yellow-500" size={40} />
                        </div>
                    </div>
                    <div className="bg-gradient-to-br from-blue-900/30 to-blue-800/20 border border-blue-500/30 rounded-xl p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-blue-400 text-sm font-medium">
                                    Minor Bans
                                </p>
                                <p className="text-3xl font-bold text-white mt-1">
                                    {banlists.data?.filter(
                                        (b) => b.minor === "Yes"
                                    ).length || 0}
                                </p>
                            </div>
                            <Shield className="text-blue-500" size={40} />
                        </div>
                    </div>
                </div>

                {/* Table */}
                <div className="bg-gray-800 border border-gray-700 rounded-2xl overflow-hidden shadow-xl">
                    <div className="overflow-x-auto">
                        <table className="w-full text-white">
                            <thead>
                                <tr className="border-b border-gray-700 bg-gray-900">
                                    <th className="py-4 px-6 text-left font-semibold">
                                        User
                                    </th>
                                    <th className="py-4 px-6 text-center font-semibold">
                                        Major
                                    </th>
                                    <th className="py-4 px-6 text-center font-semibold">
                                        Minor
                                    </th>
                                    <th className="py-4 px-6 text-center font-semibold">
                                        Mini
                                    </th>
                                    <th className="py-4 px-6 text-center font-semibold">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {banlists.data?.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan="5"
                                            className="text-center text-gray-400 py-12"
                                        >
                                            <div className="flex flex-col items-center gap-3">
                                                <Shield
                                                    className="text-gray-600"
                                                    size={48}
                                                />
                                                <div>
                                                    <p className="text-lg font-medium">
                                                        No banned users
                                                    </p>
                                                    <p className="text-sm mt-1">
                                                        Click "Add Ban" to
                                                        restrict players
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    banlists.data.map((ban) => (
                                        <tr
                                            key={ban.id}
                                            className="hover:bg-gray-700/50 border-b border-gray-700 transition-colors"
                                        >
                                            <td className="py-4 px-6">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center">
                                                        <User
                                                            className="text-gray-400"
                                                            size={20}
                                                        />
                                                    </div>
                                                    <div>
                                                        <p className="font-semibold">
                                                            {ban.user?.name ||
                                                                "Unknown"}
                                                        </p>
                                                        <p className="text-xs text-gray-400">
                                                            {ban.user?.email ||
                                                                "N/A"}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-4 px-6 text-center">
                                                <span
                                                    className={`inline-block px-3 py-1 rounded-full text-xs font-semibold border ${getBadgeColor(
                                                        ban.major
                                                    )}`}
                                                >
                                                    {ban.major}
                                                </span>
                                            </td>
                                            <td className="py-4 px-6 text-center">
                                                <span
                                                    className={`inline-block px-3 py-1 rounded-full text-xs font-semibold border ${getBadgeColor(
                                                        ban.minor
                                                    )}`}
                                                >
                                                    {ban.minor}
                                                </span>
                                            </td>
                                            <td className="py-4 px-6 text-center">
                                                <span
                                                    className={`inline-block px-3 py-1 rounded-full text-xs font-semibold border ${getBadgeColor(
                                                        ban.mini
                                                    )}`}
                                                >
                                                    {ban.mini}
                                                </span>
                                            </td>
                                            <td className="py-4 px-6 text-center">
                                                <div className="flex justify-center gap-2">
                                                    <button
                                                        onClick={() =>
                                                            openEdit(ban)
                                                        }
                                                        className="text-blue-400 hover:text-blue-300 p-2 hover:bg-gray-700 rounded-lg transition-colors inline-flex items-center gap-1"
                                                        title="Edit"
                                                    >
                                                        <Edit3 size={18} />
                                                    </button>
                                                    <button
                                                        onClick={() =>
                                                            handleDelete(ban.id)
                                                        }
                                                        className="text-red-400 hover:text-red-300 p-2 hover:bg-gray-700 rounded-lg transition-colors inline-flex items-center gap-1"
                                                        title="Delete"
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Modal with Search */}
            <Modal
                title={editing ? "Edit Ban" : "Add Ban"}
                show={showModal}
                onClose={() => {
                    setShowModal(false);
                    setSearchQuery("");
                }}
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* User Search */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            User {!editing && <span className="text-red-500">*</span>}
                        </label>

                        {editing ? (
                            // Disabled saat edit
                            <div className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 flex items-center gap-3">
                                <User className="text-gray-400" size={20} />
                                <div className="flex-1">
                                    <p className="font-semibold text-white">
                                        {selectedUser?.name || "Unknown User"}
                                    </p>
                                    <p className="text-xs text-gray-400">
                                        {selectedUser?.email || "N/A"}
                                    </p>
                                </div>
                            </div>
                        ) : (
                            // Search box saat create
                            <div className="relative">
                                {data.user_id && selectedUser ? (
                                    // Selected User Display
                                    <div className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 flex items-center gap-3">
                                        <User
                                            className="text-blue-400"
                                            size={20}
                                        />
                                        <div className="flex-1">
                                            <p className="font-semibold text-white">
                                                {selectedUser.name}
                                            </p>
                                            <p className="text-xs text-gray-400">
                                                {selectedUser.email}
                                            </p>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={clearUserSelection}
                                            className="text-red-400 hover:text-red-300 p-1 hover:bg-gray-600 rounded transition-colors"
                                        >
                                            <X size={18} />
                                        </button>
                                    </div>
                                ) : (
                                    <>
                                        {/* Search Input */}
                                        <div className="relative">
                                            <Search
                                                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                                                size={20}
                                            />
                                            <input
                                                type="text"
                                                placeholder="Search user by name or email..."
                                                value={searchQuery}
                                                onChange={(e) =>
                                                    setSearchQuery(
                                                        e.target.value
                                                    )
                                                }
                                                onFocus={() =>
                                                    setIsSearchFocused(true)
                                                }
                                                className="w-full bg-gray-800 border border-gray-700 rounded-lg text-white pl-10 pr-4 py-3 focus:border-blue-500 focus:outline-none transition-colors"
                                            />
                                        </div>

                                        {/* Search Results Dropdown */}
                                        {isSearchFocused &&
                                            searchQuery.trim() && (
                                                <div className="absolute z-50 w-full mt-2 bg-gray-800 border border-gray-700 rounded-lg shadow-xl max-h-64 overflow-y-auto">
                                                    {filteredUsers.length >
                                                    0 ? (
                                                        <div className="py-2">
                                                            {filteredUsers.map(
                                                                (user) => {
                                                                    const isBanned =
                                                                        isUserBanned(
                                                                            user.id
                                                                        );
                                                                    return (
                                                                        <button
                                                                            key={
                                                                                user.id
                                                                            }
                                                                            type="button"
                                                                            onClick={() =>
                                                                                selectUser(
                                                                                    user.id
                                                                                )
                                                                            }
                                                                            disabled={
                                                                                isBanned
                                                                            }
                                                                            className={`w-full text-left px-4 py-3 flex items-center gap-3 transition-colors ${
                                                                                isBanned
                                                                                    ? "opacity-50 cursor-not-allowed"
                                                                                    : "hover:bg-gray-700 cursor-pointer"
                                                                            }`}
                                                                        >
                                                                            <User
                                                                                className={
                                                                                    isBanned
                                                                                        ? "text-red-400"
                                                                                        : "text-gray-400"
                                                                                }
                                                                                size={
                                                                                    20
                                                                                }
                                                                            />
                                                                            <div className="flex-1">
                                                                                <p
                                                                                    className={`font-semibold ${
                                                                                        isBanned
                                                                                            ? "text-gray-500"
                                                                                            : "text-white"
                                                                                    }`}
                                                                                >
                                                                                    {
                                                                                        user.name
                                                                                    }
                                                                                </p>
                                                                                <p className="text-xs text-gray-400">
                                                                                    {
                                                                                        user.email
                                                                                    }
                                                                                </p>
                                                                            </div>
                                                                            {isBanned && (
                                                                                <span className="text-xs bg-red-500/20 text-red-400 px-2 py-1 rounded">
                                                                                    Already
                                                                                    Banned
                                                                                </span>
                                                                            )}
                                                                        </button>
                                                                    );
                                                                }
                                                            )}
                                                        </div>
                                                    ) : (
                                                        <div className="py-8 px-4 text-center text-gray-400">
                                                            <User
                                                                className="mx-auto mb-2 text-gray-600"
                                                                size={32}
                                                            />
                                                            <p>No users found</p>
                                                        </div>
                                                    )}
                                                </div>
                                            )}

                                        {/* Click outside to close */}
                                        {isSearchFocused && (
                                            <div
                                                className="fixed inset-0 z-40"
                                                onClick={() =>
                                                    setIsSearchFocused(false)
                                                }
                                            />
                                        )}
                                    </>
                                )}
                            </div>
                        )}
                        <p className="text-xs text-gray-400 mt-2">
                            {editing
                                ? "User cannot be changed when editing"
                                : "Search and select a user to ban"}
                        </p>
                    </div>

                    {/* Major */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Major Events
                        </label>
                        <select
                            value={data.major}
                            onChange={(e) => setData("major", e.target.value)}
                            className="w-full bg-gray-800 border border-gray-700 rounded-lg text-white px-4 py-3 focus:border-blue-500 focus:outline-none transition-colors"
                        >
                            <option value="No">No - Allowed</option>
                            <option value="Yes">Yes - Banned</option>
                        </select>
                    </div>

                    {/* Minor */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Minor Events
                        </label>
                        <select
                            value={data.minor}
                            onChange={(e) => setData("minor", e.target.value)}
                            className="w-full bg-gray-800 border border-gray-700 rounded-lg text-white px-4 py-3 focus:border-blue-500 focus:outline-none transition-colors"
                        >
                            <option value="No">No - Allowed</option>
                            <option value="Yes">Yes - Banned</option>
                        </select>
                    </div>

                    {/* Mini */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Mini Events
                        </label>
                        <select
                            value={data.mini}
                            onChange={(e) => setData("mini", e.target.value)}
                            className="w-full bg-gray-800 border border-gray-700 rounded-lg text-white px-4 py-3 focus:border-blue-500 focus:outline-none transition-colors"
                        >
                            <option value="No">No - Allowed</option>
                            <option value="Yes">Yes - Banned</option>
                        </select>
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end gap-3 pt-4 border-t border-gray-700">
                        <button
                            type="button"
                            onClick={() => {
                                setShowModal(false);
                                setSearchQuery("");
                            }}
                            className="px-5 py-2.5 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors font-semibold"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={processing || (!editing && !data.user_id)}
                            className="px-5 py-2.5 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white rounded-lg transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {processing
                                ? "Saving..."
                                : editing
                                ? "Update Ban"
                                : "Add Ban"}
                        </button>
                    </div>
                </form>
            </Modal>
        </AdminLayout>
    );
};

export default BanListIndex;