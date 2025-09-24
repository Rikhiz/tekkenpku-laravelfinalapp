import React, { useState } from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import { Head, useForm, router } from "@inertiajs/react";
import {
    Plus,
    Edit3,
    Trash2,
    Calendar,
    Users,
    Award,
    ExternalLink,
    X,
} from "lucide-react";

const AdminTournaments = ({ auth, tournaments, users }) => {
    const [showModal, setShowModal] = useState(false);
    const [editingTournament, setEditingTournament] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [tournamentToDelete, setTournamentToDelete] = useState(null);

    const { data, setData, post, put, processing, errors, reset } = useForm({
        name: "",
        created_by: "",
        category: 3,
        total: 0,
        start_date: "",
        end_date: "",
        image_url: "",
        desc: "",
        prizepool: "",
        max_pemain: "",
        url_yt: "",
        url_startgg: "",
        status: "Pendaftaran Dibuka",
    });

    const categoryLabels = {
        1: "Major",
        2: "Minor",
        3: "Mini",
    };

    const categoryColors = {
        1: "bg-red-500 text-white",
        2: "bg-yellow-500 text-white",
        3: "bg-green-500 text-white",
    };

    const openModal = (tournament = null) => {
        if (tournament) {
            setEditingTournament(tournament);
            setData({
                name: tournament.name,
                created_by: tournament.created_by,
                category: tournament.category,
                total: tournament.total || 0,
                start_date: tournament.start_date
                    ? tournament.start_date.substring(0, 16)
                    : "",
                end_date: tournament.end_date
                    ? tournament.end_date.substring(0, 16)
                    : "",
                image_url: tournament.image_url || "",
                desc: tournament.desc || "",
                prizepool: tournament.prizepool || "",
                max_pemain: tournament.max_pemain || "",
                url_yt: tournament.url_yt || "",
                url_startgg: tournament.url_startgg || "",
                status: tournament.status,
            });
        } else {
            setEditingTournament(null);
            reset();
            setData("status", "Pendaftaran Dibuka");
            setData("category", 3);
        }
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setEditingTournament(null);
        reset();
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (editingTournament) {
            put(route("tournaments.update", editingTournament.tourid), {
                onSuccess: () => {
                    closeModal();
                },
            });
        } else {
            post(route("tournaments.store"), {
                onSuccess: () => {
                    closeModal();
                },
            });
        }
    };

    const handleDelete = (tournament) => {
        setTournamentToDelete(tournament);
        setShowDeleteModal(true);
    };

    const confirmDelete = () => {
        if (tournamentToDelete) {
            router.delete(
                route("tournaments.destroy", tournamentToDelete.tourid),
                {
                    onSuccess: () => {
                        setShowDeleteModal(false);
                        setTournamentToDelete(null);
                    },
                }
            );
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return "-";
        return new Date(dateString).toLocaleDateString("id-ID", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    return (
        <AdminLayout user={auth.user}>
            <Head title="Admin - Tournaments" />

            <div className="space-y-6">
                {/* Header */}
                <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-white">
                                Tournament Management
                            </h1>
                            <p className="mt-1 text-sm text-gray-400">
                                Kelola semua tournament yang ada di sistem
                            </p>
                        </div>
                        <div className="mt-4 sm:mt-0">
                            <button
                                onClick={() => openModal()}
                                className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                            >
                                <Plus className="h-4 w-4 mr-2" />
                                Tambah Tournament
                            </button>
                        </div>
                    </div>
                </div>

                {/* Tournament Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {tournaments.map((tournament) => (
                        <div
                            key={tournament.tourid}
                            className="bg-gray-800 rounded-2xl shadow-lg border border-gray-700 overflow-hidden hover:border-gray-600 transition-colors"
                        >
                            {/* Tournament Image */}
                            <div className="h-48 bg-gradient-to-br from-blue-500 to-purple-600 relative">
                                {tournament.image_url ? (
                                    <img
                                        src={tournament.image_url}
                                        alt={tournament.name}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="flex items-center justify-center h-full">
                                        <Award className="h-16 w-16 text-white opacity-50" />
                                    </div>
                                )}

                                {/* Status Badge */}
                                <div className="absolute top-3 right-3">
                                    <span
                                        className={`px-2 py-1 text-xs font-medium rounded-full ${
                                            tournament.status === "Selesai"
                                                ? "bg-gray-700 text-gray-300"
                                                : "bg-green-600 text-white"
                                        }`}
                                    >
                                        {tournament.status}
                                    </span>
                                </div>

                                {/* Category Badge */}
                                <div className="absolute top-3 left-3">
                                    <span
                                        className={`px-2 py-1 text-xs font-medium rounded-full ${
                                            categoryColors[tournament.category]
                                        }`}
                                    >
                                        {categoryLabels[tournament.category]}
                                    </span>
                                </div>
                            </div>

                            {/* Tournament Info */}
                            <div className="p-4">
                                <h3 className="text-lg font-semibold text-white mb-2 line-clamp-1">
                                    {tournament.name}
                                </h3>

                                {tournament.desc && (
                                    <p className="text-sm text-gray-400 mb-3 line-clamp-2">
                                        {tournament.desc}
                                    </p>
                                )}

                                <div className="space-y-2 mb-4">
                                    <div className="flex items-center text-sm text-gray-400">
                                        <Users className="h-4 w-4 mr-2" />
                                        <span>
                                            Dibuat oleh:{" "}
                                            {tournament.creator?.name}
                                        </span>
                                    </div>

                                    {tournament.max_pemain && (
                                        <div className="flex items-center text-sm text-gray-400">
                                            <Users className="h-4 w-4 mr-2" />
                                            <span>
                                                Max: {tournament.max_pemain}{" "}
                                                pemain
                                            </span>
                                        </div>
                                    )}

                                    {tournament.prizepool && (
                                        <div className="flex items-center text-sm text-gray-400">
                                            <Award className="h-4 w-4 mr-2" />
                                            <span>
                                                Prize: {tournament.prizepool}
                                            </span>
                                        </div>
                                    )}

                                    {tournament.start_date && (
                                        <div className="flex items-center text-sm text-gray-400">
                                            <Calendar className="h-4 w-4 mr-2" />
                                            <span>
                                                {formatDate(
                                                    tournament.start_date
                                                )}
                                            </span>
                                        </div>
                                    )}
                                </div>

                                {/* External Links */}
                                {(tournament.url_yt ||
                                    tournament.url_startgg) && (
                                    <div className="flex space-x-2 mb-4">
                                        {tournament.url_yt && (
                                            <a
                                                href={tournament.url_yt}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center text-xs bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded transition-colors"
                                            >
                                                <ExternalLink className="h-3 w-3 mr-1" />
                                                YouTube
                                            </a>
                                        )}
                                        {tournament.url_startgg && (
                                            <a
                                                href={`https://www.start.gg/tournament/${tournament.url_startgg}/events`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center text-xs bg-purple-600 hover:bg-purple-700 text-white px-2 py-1 rounded transition-colors"
                                            >
                                                <ExternalLink className="h-3 w-3 mr-1" />
                                                Start.gg
                                            </a>
                                        )}
                                    </div>
                                )}

                                {/* Action Buttons */}
                                <div className="flex justify-end space-x-2">
                                    <button
                                        onClick={() => openModal(tournament)}
                                        className="inline-flex items-center px-3 py-1.5 border border-gray-600 shadow-sm text-xs font-medium rounded text-gray-300 bg-gray-700 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                                    >
                                        <Edit3 className="h-3 w-3 mr-1" />
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(tournament)}
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

                {tournaments.length === 0 && (
                    <div className="text-center py-12 bg-gray-800 rounded-2xl border border-gray-700">
                        <Award className="mx-auto h-12 w-12 text-gray-400" />
                        <h3 className="mt-2 text-sm font-medium text-white">
                            Tidak ada tournament
                        </h3>
                        <p className="mt-1 text-sm text-gray-400">
                            Mulai dengan membuat tournament baru.
                        </p>
                        <div className="mt-6">
                            <button
                                onClick={() => openModal()}
                                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                            >
                                <Plus className="h-4 w-4 mr-2" />
                                Tambah Tournament
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Modal Form */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
                    <div className="relative bg-gray-800 border border-gray-700 w-full max-w-4xl shadow-lg rounded-2xl">
                        <div className="flex items-center justify-between p-6 border-b border-gray-700">
                            <h3 className="text-lg font-medium text-white">
                                {editingTournament
                                    ? "Edit Tournament"
                                    : "Tambah Tournament Baru"}
                            </h3>
                            <button
                                onClick={closeModal}
                                className="text-gray-400 hover:text-white transition-colors"
                            >
                                <X className="h-6 w-6" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Tournament Name */}
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-300 mb-1">
                                        Nama Tournament *
                                    </label>
                                    <input
                                        type="text"
                                        value={data.name}
                                        onChange={(e) =>
                                            setData("name", e.target.value)
                                        }
                                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg 
               shadow-sm focus:outline-none focus:ring-blue-500 
               focus:border-blue-500 text-white"
                                        required
                                    />
                                    {errors.name && (
                                        <p className="mt-1 text-sm text-red-400">
                                            {errors.name}
                                        </p>
                                    )}
                                </div>

                                {/* Creator */}
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
                                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg 
               shadow-sm focus:outline-none focus:ring-blue-500 
               focus:border-blue-500 text-white"
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
                                        <p className="mt-1 text-sm text-red-400">
                                            {errors.created_by}
                                        </p>
                                    )}
                                </div>

                                {/* Category */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">
                                        Kategori *
                                    </label>
                                    <select
                                        value={data.category}
                                        onChange={(e) =>
                                            setData(
                                                "category",
                                                parseInt(e.target.value)
                                            )
                                        }
                                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg 
               shadow-sm focus:outline-none focus:ring-blue-500 
               focus:border-blue-500 text-white"
                                        required
                                    >
                                        <option value={1}>Major</option>
                                        <option value={2}>Minor</option>
                                        <option value={3}>Mini</option>
                                    </select>
                                    {errors.category && (
                                        <p className="mt-1 text-sm text-red-400">
                                            {errors.category}
                                        </p>
                                    )}
                                </div>

                                {/* Start Date */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">
                                        Tanggal Mulai
                                    </label>
                                    <input
                                        type="datetime-local"
                                        value={data.start_date}
                                        onChange={(e) =>
                                            setData(
                                                "start_date",
                                                e.target.value
                                            )
                                        }
                                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg 
               shadow-sm focus:outline-none focus:ring-blue-500 
               focus:border-blue-500 text-white"
                                    />
                                    {errors.start_date && (
                                        <p className="mt-1 text-sm text-red-400">
                                            {errors.start_date}
                                        </p>
                                    )}
                                </div>

                                {/* End Date */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">
                                        Tanggal Selesai
                                    </label>
                                    <input
                                        type="datetime-local"
                                        value={data.end_date}
                                        onChange={(e) =>
                                            setData("end_date", e.target.value)
                                        }
                                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg 
               shadow-sm focus:outline-none focus:ring-blue-500 
               focus:border-blue-500 text-white"
                                    />
                                    {errors.end_date && (
                                        <p className="mt-1 text-sm text-red-400">
                                            {errors.end_date}
                                        </p>
                                    )}
                                </div>

                                {/* Prize Pool */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">
                                        Prize Pool
                                    </label>
                                    <input
                                        type="text"
                                        value={data.prizepool}
                                        onChange={(e) =>
                                            setData("prizepool", e.target.value)
                                        }
                                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg 
               shadow-sm focus:outline-none focus:ring-blue-500 
               focus:border-blue-500 text-white"
                                    />
                                    {errors.prizepool && (
                                        <p className="mt-1 text-sm text-red-400">
                                            {errors.prizepool}
                                        </p>
                                    )}
                                </div>

                                {/* Youtube URL */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">
                                        URL Youtube
                                    </label>
                                    <input
                                        type="text"
                                        value={data.url_yt}
                                        onChange={(e) =>
                                            setData("url_yt", e.target.value)
                                        }
                                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg 
               shadow-sm focus:outline-none focus:ring-blue-500 
               focus:border-blue-500 text-white"
                                    />
                                    {errors.url_yt && (
                                        <p className="mt-1 text-sm text-red-400">
                                            {errors.url_yt}
                                        </p>
                                    )}
                                </div>

                                {/* Start.gg URL */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">
                                        URL Start.gg
                                    </label>
                                    <input
                                        type="text"
                                        value={data.url_startgg}
                                        onChange={(e) =>
                                            setData(
                                                "url_startgg",
                                                e.target.value
                                            )
                                        }
                                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg 
               shadow-sm focus:outline-none focus:ring-blue-500 
               focus:border-blue-500 text-white"
                                    />
                                    {errors.url_startgg && (
                                        <p className="mt-1 text-sm text-red-400">
                                            {errors.url_startgg}
                                        </p>
                                    )}
                                </div>

                                {/* Status */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">
                                        Status *
                                    </label>
                                    <select
                                        value={data.status}
                                        onChange={(e) =>
                                            setData("status", e.target.value)
                                        }
                                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg 
               shadow-sm focus:outline-none focus:ring-blue-500 
               focus:border-blue-500 text-white"
                                        required
                                    >
                                        <option value="Pendaftaran Dibuka">
                                            Pendaftaran Dibuka
                                        </option>
                                        <option value="Selesai">Selesai</option>
                                    </select>
                                    {errors.status && (
                                        <p className="mt-1 text-sm text-red-400">
                                            {errors.status}
                                        </p>
                                    )}
                                </div>

                                {/* Image URL */}
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-300 mb-1">
                                        URL Gambar
                                    </label>
                                    <input
                                        type="url"
                                        value={data.image_url}
                                        onChange={(e) =>
                                            setData("image_url", e.target.value)
                                        }
                                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-white"
                                        placeholder="https://example.com/image.jpg"
                                    />
                                    {errors.image_url && (
                                        <p className="mt-1 text-sm text-red-400">
                                            {errors.image_url}
                                        </p>
                                    )}
                                </div>

                                {/* Description */}
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-300 mb-1">
                                        Deskripsi
                                    </label>
                                    <textarea
                                        value={data.desc}
                                        onChange={(e) =>
                                            setData("desc", e.target.value)
                                        }
                                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-white"
                                        rows="3"
                                        placeholder="Deskripsi tournament..."
                                    />
                                    {errors.desc && (
                                        <p className="mt-1 text-sm text-red-400">
                                            {errors.desc}
                                        </p>
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
                                    {processing
                                        ? "Menyimpan..."
                                        : editingTournament
                                        ? "Update"
                                        : "Simpan"}
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
                                    Hapus Tournament
                                </h3>
                                <div className="mt-2">
                                    <p className="text-sm text-gray-400">
                                        Apakah Anda yakin ingin menghapus
                                        tournament "{tournamentToDelete?.name}"?
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

export default AdminTournaments;
