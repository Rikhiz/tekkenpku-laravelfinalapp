import React, { useState } from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import { Head, useForm, router } from "@inertiajs/react";
import {
    Plus,
    Edit3,
    Trash2,
    Calendar,
    MapPin,
    User,
    X,
    Loader2,
    BoomBox,
} from "lucide-react";

const AdminActivities = ({ auth, activities, users }) => {
    const [showModal, setShowModal] = useState(false);
    const [editingActivity, setEditingActivity] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [activityToDelete, setActivityToDelete] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const { data, setData, post, put, processing, errors, reset } = useForm({
        name: "",
        image_url: "",
        url_ig: "",
        created_by: "",
        alamat: "",
        desc: "",
        status: "Mendatang",
        tanggal_kegiatan: "",
    });

    const statusColors = {
        Mendatang: "bg-blue-500 text-white",
        Selesai: "bg-gray-600 text-white",
    };

    const openModal = (activity = null) => {
        if (activity) {
            setEditingActivity(activity);
            setData({
                name: activity.name,
                image_url: activity.image_url || "",
                url_ig: activity.url_ig || "",
                created_by: activity.created_by,
                alamat: activity.alamat,
                desc: activity.desc || "",
                status: activity.status,
                tanggal_kegiatan: activity.tanggal_kegiatan || "",
            });
        } else {
            setEditingActivity(null);
            reset();
            setData("status", "Mendatang");
        }
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setEditingActivity(null);
        reset();
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editingActivity) {
            put(route("activity.update", editingActivity.slug), {
                onSuccess: () => closeModal(),
            });
        } else {
            post(route("activity.store"), {
                onSuccess: () => closeModal(),
            });
        }
    };

    const handleDelete = (activity) => {
        setActivityToDelete(activity);
        setShowDeleteModal(true);
    };

    const confirmDelete = () => {
        if (activityToDelete && !isDeleting) {
            setIsDeleting(true);
            router.delete(route("activity.destroy", activityToDelete.slug), {
                onSuccess: () => {
                    setShowDeleteModal(false);
                    setActivityToDelete(null);
                    setIsDeleting(false);
                },
                onError: () => {
                    setIsDeleting(false);
                    alert("Gagal menghapus activity. Silakan coba lagi.");
                },
                onFinish: () => setIsDeleting(false),
            });
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return "-";
        return new Date(dateString).toLocaleDateString("id-ID", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    return (
        <AdminLayout user={auth.user}>
            <Head title="Admin - Activities" />

            <div className="space-y-6">
                <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-white">
                                Activity Management
                            </h1>
                            <p className="mt-1 text-sm text-gray-400">
                                Kelola semua kegiatan komunitas
                            </p>
                        </div>
                        <div className="mt-4 sm:mt-0">
                            <button
                                onClick={() => openModal()}
                                className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors"
                            >
                                <Plus className="h-4 w-4 mr-2" />
                                Tambah Activity
                            </button>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {activities.map((activity) => (
                        <div
                            key={activity.id}
                            className="group relative flex flex-col bg-gradient-to-br from-gray-900 to-gray-800 backdrop-blur-xl border border-gray-700 rounded-2xl overflow-hidden transition-all duration-300 hover:border-purple-500 hover:shadow-lg hover:shadow-purple-500/20"
                        >
                            <div className="relative h-48 overflow-hidden flex-shrink-0">
                                <img
                                    src={
                                        activity.image_url ||
                                        "https://picsum.photos/400/300?random=" +
                                            activity.id
                                    }
                                    alt={activity.name}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                    loading="lazy"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent"></div>

                                <div className="absolute top-3 right-3">
                                    <span
                                        className={`px-3 py-1 text-xs font-semibold rounded-full ${
                                            statusColors[activity.status]
                                        }`}
                                    >
                                        {activity.status}
                                    </span>
                                </div>
                            </div>

                            <div className="flex flex-col flex-grow p-5">
                                <div className="mb-3">
                                    <h3 className="text-white font-bold text-lg leading-tight line-clamp-2 mb-2">
                                        {activity.name}
                                    </h3>
                                    {activity.desc && (
                                        <p className="text-gray-400 text-sm leading-relaxed line-clamp-2">
                                            {activity.desc}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2 mb-4">
                                    <div className="flex items-center text-sm text-gray-400">
                                        <User className="h-4 w-4 mr-2 flex-shrink-0 text-purple-400" />
                                        <span className="truncate">
                                            {activity.creator?.name}
                                        </span>
                                    </div>

                                    <div className="flex items-start text-sm text-gray-400">
                                        <MapPin className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0 text-purple-400" />
                                        <span className="line-clamp-2">
                                            {activity.alamat}
                                        </span>
                                    </div>

                                    {activity.tanggal_kegiatan && (
                                        <div className="flex items-center text-sm text-gray-400">
                                            <Calendar className="h-4 w-4 mr-2 flex-shrink-0 text-purple-400" />
                                            <span>
                                                {formatDate(
                                                    activity.tanggal_kegiatan
                                                )}
                                            </span>
                                        </div>
                                    )}
                                </div>

                                <div className="flex justify-end space-x-2 mt-auto pt-3 border-t border-gray-700">
                                    <button
                                        onClick={() => openModal(activity)}
                                        className="inline-flex items-center px-3 py-1.5 border border-gray-600 shadow-sm text-xs font-medium rounded text-gray-300 bg-gray-700 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors"
                                    >
                                        <Edit3 className="h-3 w-3 mr-1" />
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(activity)}
                                        className="inline-flex items-center px-3 py-1.5 border border-red-600 shadow-sm text-xs font-medium rounded text-red-300 bg-red-900 hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
                                    >
                                        <Trash2 className="h-3 w-3 mr-1" />
                                        Hapus
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {activities.length === 0 && (
                    <div className="text-center py-12 bg-gray-800 rounded-2xl border border-gray-700">
                        <BoomBox className="mx-auto h-12 w-12 text-gray-400" />
                        <h3 className="mt-2 text-sm font-medium text-white">
                            Tidak ada activity
                        </h3>
                        <p className="mt-1 text-sm text-gray-400">
                            Mulai dengan membuat activity baru.
                        </p>
                        <div className="mt-6">
                            <button
                                onClick={() => openModal()}
                                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors"
                            >
                                <Plus className="h-4 w-4 mr-2" />
                                Tambah Activity
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Modal Form */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
                    <div className="relative bg-gray-800 border border-gray-700 w-full max-w-2xl max-h-[90vh] shadow-lg rounded-xl flex flex-col">
                        <div className="flex items-center justify-between p-4 border-b border-gray-700 flex-shrink-0">
                            <h3 className="text-base font-medium text-white">
                                {editingActivity
                                    ? "Edit Activity"
                                    : "Tambah Activity Baru"}
                            </h3>
                            <button
                                onClick={closeModal}
                                className="text-gray-400 hover:text-white transition-colors"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-4">
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">
                                        Nama Activity *
                                    </label>
                                    <input
                                        type="text"
                                        value={data.name}
                                        onChange={(e) =>
                                            setData("name", e.target.value)
                                        }
                                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 text-white text-sm"
                                        required
                                    />
                                    {errors.name && (
                                        <p className="mt-1 text-xs text-red-400">
                                            {errors.name}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">
                                        Dibuat oleh *
                                    </label>
                                    <select
                                        value={data.created_by}
                                        onChange={(e) =>
                                            setData(
                                                "created_by",
                                                e.target.value
                                            )
                                        }
                                        className="w-full px-2.5 py-1.5 bg-gray-700 border border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-white text-sm"
                                        required
                                    >
                                        <option value="">Pilih User</option>
                                        {users.map((user) => (
                                            <option
                                                key={user.id}
                                                value={user.id}
                                            >
                                                {user.name}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.created_by && (
                                        <p className="mt-1 text-xs text-red-400">
                                            {errors.created_by}
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-300 mb-1">
                                        Instagram Post URL
                                    </label>
                                    <input
                                        type="url"
                                        value={data.url_ig}
                                        onChange={(e) =>
                                            setData("url_ig", e.target.value)
                                        }
                                        className="w-full px-2.5 py-1.5 bg-gray-700 border border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-white text-sm"
                                        placeholder="https://www.instagram.com/p/xxx/"
                                    />
                                    {errors.url_ig && (
                                        <p className="mt-1 text-xs text-red-400">
                                            {errors.url_ig}
                                        </p>
                                    )}
                                    <p className="mt-1 text-xs text-gray-400">
                                        Copy Instagram post URL (e.g.,
                                        https://www.instagram.com/p/DOXgSwKkpgp/)
                                    </p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">
                                        Alamat *
                                    </label>
                                    <input
                                        type="text"
                                        value={data.alamat}
                                        onChange={(e) =>
                                            setData("alamat", e.target.value)
                                        }
                                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 text-white text-sm"
                                        placeholder="Lokasi kegiatan"
                                        required
                                    />
                                    {errors.alamat && (
                                        <p className="mt-1 text-xs text-red-400">
                                            {errors.alamat}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">
                                        Tanggal Kegiatan
                                    </label>
                                    <input
                                        type="date"
                                        value={data.tanggal_kegiatan}
                                        onChange={(e) =>
                                            setData(
                                                "tanggal_kegiatan",
                                                e.target.value
                                            )
                                        }
                                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 text-white text-sm"
                                    />
                                    {errors.tanggal_kegiatan && (
                                        <p className="mt-1 text-xs text-red-400">
                                            {errors.tanggal_kegiatan}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">
                                        Status *
                                    </label>
                                    <select
                                        value={data.status}
                                        onChange={(e) =>
                                            setData("status", e.target.value)
                                        }
                                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 text-white text-sm"
                                        required
                                    >
                                        <option value="Mendatang">
                                            Mendatang
                                        </option>
                                        <option value="Selesai">Selesai</option>
                                    </select>
                                    {errors.status && (
                                        <p className="mt-1 text-xs text-red-400">
                                            {errors.status}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">
                                        URL Gambar (Google Drive Link)
                                    </label>
                                    <input
                                        type="text"
                                        value={data.image_url}
                                        onChange={(e) =>
                                            setData("image_url", e.target.value)
                                        }
                                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 text-white text-sm"
                                        placeholder="https://drive.google.com/file/d/..."
                                    />
                                    {errors.image_url && (
                                        <p className="mt-1 text-xs text-red-400">
                                            {errors.image_url}
                                        </p>
                                    )}
                                    <p className="mt-1 text-xs text-gray-400">
                                        Paste link Google Drive. Gambar akan
                                        otomatis didownload dan disimpan.
                                    </p>
                                    {data.image_url && (
                                        <div className="mt-2">
                                            <img
                                                src={data.image_url}
                                                alt="Preview"
                                                className="w-full h-32 object-cover rounded-lg border border-gray-700"
                                                onError={(e) =>
                                                    (e.target.style.display =
                                                        "none")
                                                }
                                            />
                                        </div>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">
                                        Deskripsi
                                    </label>
                                    <textarea
                                        value={data.desc}
                                        onChange={(e) =>
                                            setData("desc", e.target.value)
                                        }
                                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 text-white text-sm"
                                        rows="3"
                                        placeholder="Deskripsi kegiatan..."
                                    />
                                    {errors.desc && (
                                        <p className="mt-1 text-xs text-red-400">
                                            {errors.desc}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end space-x-2 p-4 border-t border-gray-700 flex-shrink-0">
                            <button
                                type="button"
                                onClick={closeModal}
                                className="px-4 py-2 border border-gray-600 rounded-lg shadow-sm text-sm font-medium text-gray-300 bg-gray-700 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
                            >
                                Batal
                            </button>
                            <button
                                type="button"
                                onClick={handleSubmit}
                                disabled={processing}
                                className="px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 transition-colors"
                            >
                                {processing
                                    ? "Menyimpan..."
                                    : editingActivity
                                    ? "Update"
                                    : "Simpan"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
                    <div className="relative bg-gray-800 border border-gray-700 w-full max-w-md shadow-lg rounded-xl">
                        <div className="p-5">
                            <div className="flex items-center mb-4">
                                <div className="mx-auto flex-shrink-0 flex items-center justify-center h-10 w-10 rounded-full bg-red-900">
                                    {isDeleting ? (
                                        <Loader2 className="h-5 w-5 text-red-400 animate-spin" />
                                    ) : (
                                        <Trash2 className="h-5 w-5 text-red-400" />
                                    )}
                                </div>
                            </div>
                            <div className="text-center">
                                <h3 className="text-base leading-6 font-medium text-white">
                                    {isDeleting
                                        ? "Menghapus Activity..."
                                        : "Hapus Activity"}
                                </h3>
                                <div className="mt-2">
                                    <p className="text-sm text-gray-400">
                                        {isDeleting
                                            ? "Mohon tunggu, activity sedang dihapus..."
                                            : `Apakah Anda yakin ingin menghapus activity "${activityToDelete?.name}"? Tindakan ini tidak dapat dibatalkan.`}
                                    </p>
                                </div>
                            </div>
                            <div className="mt-5 flex space-x-3">
                                <button
                                    onClick={() => {
                                        if (!isDeleting) {
                                            setShowDeleteModal(false);
                                            setActivityToDelete(null);
                                        }
                                    }}
                                    disabled={isDeleting}
                                    className="w-full px-3 py-2 border border-gray-600 rounded-lg shadow-sm text-sm font-medium text-gray-300 bg-gray-700 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Batal
                                </button>
                                <button
                                    onClick={confirmDelete}
                                    disabled={isDeleting}
                                    className="w-full inline-flex items-center justify-center px-3 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isDeleting ? (
                                        <>
                                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                            Menghapus...
                                        </>
                                    ) : (
                                        "Hapus"
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
};

export default AdminActivities;
