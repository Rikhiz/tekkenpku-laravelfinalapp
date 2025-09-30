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
    Trophy,
    Medal,
    Hash,
    UserCheck,
    ArrowRight,
    Calendar,
    ArrowLeft,
    Eye,
} from "lucide-react";

const ParticipantsIndex = ({
    participantsAll,
    authUser,
    users,
    tournaments,
    flash,
    selectedTournament = null,
}) => {
    console.log("✅ ParticipantsIndex Props:", {
        participantsAll,
        authUser,
        users,
        tournaments,
        flash,
        selectedTournament,
    });

    const [currentView, setCurrentView] = useState(
        selectedTournament ? "participants" : "tournaments"
    );
    const [activeTournament, setActiveTournament] =
        useState(selectedTournament);
    const [showModal, setShowModal] = useState(false);
    const [editingParticipant, setEditingParticipant] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [participantToDelete, setParticipantToDelete] = useState(null);
    const [syncing, setSyncing] = useState(false);
    

    const { data, setData, post, put, processing, errors, reset } = useForm({
        user_id: "",
        tourid: selectedTournament?.tourid || "",
        placement: "",
    });

    // Get participants for active tournament
    const getParticipantsForTournament = (tournamentId) => {
    return participantsAll?.filter(
        (p) => p.tournament?.tourid === tournamentId
    ) || [];
};

    const currentParticipants = activeTournament
    ? getParticipantsForTournament(activeTournament.tourid)
    : [];

    // Get tournament statistics
    const getTournamentStats = (tournament) => {
        const participants = participantsAll.filter(
            (p) => p.tournament?.tourid === tournament.tourid // bukan p.tourid
        );

        return {
            totalParticipants: participants.length,
            withPlacement: participants.filter((p) => p.placement !== null)
                .length,
            top3: participants.filter((p) => p.placement && p.placement <= 3)
                .length,
        };
    };

    const openModal = (participant = null) => {
        if (participant) {
            setEditingParticipant(participant);
            setData({
                user_id: participant.user_id,
                tourid: participant.tourid,
                placement: participant.placement || "",
            });
        } else {
            setEditingParticipant(null);
            reset();
            if (activeTournament) {
                setData("tourid", activeTournament.tourid);
            }
        }
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setEditingParticipant(null);
        reset();
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (editingParticipant) {
            put(route("participant.update", editingParticipant.id), {
                onSuccess: () => {
                    closeModal();
                },
            });
        } else {
            post(route("participant.store"), {
                onSuccess: () => {
                    closeModal();
                },
            });
        }
    };

    const handleDelete = (participant) => {
        setParticipantToDelete(participant);
        setShowDeleteModal(true);
    };

    const confirmDelete = () => {
        if (participantToDelete) {
            router.delete(
                route("participant.destroy", participantToDelete.id),
                {
                    onSuccess: () => {
                        setShowDeleteModal(false);
                        setParticipantToDelete(null);
                    },
                }
            );
        }
    };

    const handleSyncParticipants = () => {
        if (
            confirm(
                "Yakin ingin sinkronkan participants dari semua tournaments? Proses ini mungkin memakan waktu."
            )
        ) {
            setSyncing(true);
            router.post(
                "/admin/participants/sync",
                {},
                {
                    onFinish: () => setSyncing(false),
                }
            );
        }
    };

    const handleViewTournamentParticipants = (tournament) => {
        setActiveTournament(tournament);
        setCurrentView("participants");
    };

    const handleBackToTournaments = () => {
        setCurrentView("tournaments");
        setActiveTournament(null);
    };

    const getPlacementBadge = (placement) => {
        if (!placement) return null;

        let badgeClass = "bg-gray-600 text-gray-100";
        let icon = null;

        if (placement === 1) {
            badgeClass = "bg-yellow-500 text-yellow-900";
            icon = <Medal className="h-3 w-3 mr-1" />;
        } else if (placement === 2) {
            badgeClass = "bg-gray-400 text-gray-900";
            icon = <Medal className="h-3 w-3 mr-1" />;
        } else if (placement === 3) {
            badgeClass = "bg-amber-600 text-amber-100";
            icon = <Medal className="h-3 w-3 mr-1" />;
        } else if (placement <= 8) {
            badgeClass = "bg-blue-600 text-blue-100";
        }

        return (
            <span
                className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${badgeClass}`}
            >
                {icon}#{placement}
            </span>
        );
    };

    const getCategoryBadge = (category) => {
        const badges = {
            1: { text: "Major", class: "bg-red-600 text-red-100" },
            2: { text: "Minor", class: "bg-blue-600 text-blue-100" },
            3: { text: "Mini", class: "bg-green-600 text-green-100" },
        };

        const badge = badges[category] || {
            text: "Unknown",
            class: "bg-gray-600 text-gray-100",
        };

        return (
            <span
                className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${badge.class}`}
            >
                {badge.text}
            </span>
        );
    };

    // Tournament List View
    if (currentView === "tournaments") {
        return (
            <AdminLayout user={authUser}>
                <Head title="Admin - Tournaments & Participants" />

                <div className="space-y-6">
                    {/* Header */}
                    <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <h1 className="text-2xl font-bold text-white">
                                    Tournaments & Participants
                                </h1>
                                <p className="mt-1 text-sm text-gray-400">
                                    Pilih tournament untuk melihat dan mengelola
                                    participants
                                </p>
                            </div>
                            <div className="mt-4 sm:mt-0">
                                <button
                                    onClick={handleSyncParticipants}
                                    disabled={syncing}
                                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 transition-colors"
                                >
                                    <RefreshCw
                                        className={`h-4 w-4 mr-2 ${
                                            syncing ? "animate-spin" : ""
                                        }`}
                                    />
                                    {syncing
                                        ? "Syncing All..."
                                        : "Sync All Participants"}
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

                    {/* Overall Statistics */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                            <div className="flex items-center">
                                <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center mr-3">
                                    <Trophy className="h-4 w-4 text-white" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-400">
                                        Total Tournaments
                                    </p>
                                    <p className="text-xl font-semibold text-white">
                                        {tournaments?.length || 0}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                            <div className="flex items-center">
                                <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center mr-3">
                                    <Users className="h-4 w-4 text-white" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-400">
                                        Total Participants
                                    </p>
                                    <p className="text-xl font-semibold text-white">
                                        {participantsAll?.length || 0}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                            <div className="flex items-center">
                                <div className="w-8 h-8 bg-yellow-500 rounded-lg flex items-center justify-center mr-3">
                                    <Medal className="h-4 w-4 text-white" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-400">
                                        With Placement
                                    </p>
                                    <p className="text-xl font-semibold text-white">
                                        {participantsAll?.filter(
                                            (p) => p.placement
                                        ).length || 0}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Tournaments Grid */}
                    <div className="bg-gray-800 rounded-2xl shadow-lg border border-gray-700">
                        <div className="p-6 border-b border-gray-700">
                            <h2 className="text-lg font-semibold text-white">
                                Tournament List
                            </h2>
                            <p className="text-sm text-gray-400 mt-1">
                                Klik pada tournament untuk melihat participants
                            </p>
                        </div>

                        <div className="p-6">
                            {tournaments && tournaments.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {tournaments.map((tournament) => {
                                        const stats =
                                            getTournamentStats(tournament);
                                        return (
                                            <div
                                                key={tournament.tourid}
                                                className="bg-gray-700 rounded-xl p-6 border border-gray-600 hover:border-gray-500 transition-colors cursor-pointer group"
                                                onClick={() =>
                                                    handleViewTournamentParticipants(
                                                        tournament
                                                    )
                                                }
                                            >
                                                <div className="flex items-start justify-between mb-4">
                                                    <div className="flex-1">
                                                        <h3 className="font-semibold text-white text-lg mb-2 group-hover:text-blue-400 transition-colors">
                                                            {tournament.name}
                                                        </h3>
                                                        {tournament.category &&
                                                            getCategoryBadge(
                                                                tournament.category
                                                            )}
                                                    </div>
                                                    <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-blue-400 transition-colors" />
                                                </div>

                                                <div className="space-y-3">
                                                    <div className="flex items-center justify-between text-sm">
                                                        <span className="text-gray-400">
                                                            Participants:
                                                        </span>
                                                        <span className="text-white font-medium">
                                                            {
                                                                stats.totalParticipants
                                                            }
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center justify-between text-sm">
                                                        <span className="text-gray-400">
                                                            With Placement:
                                                        </span>
                                                        <span className="text-white font-medium">
                                                            {
                                                                stats.withPlacement
                                                            }
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center justify-between text-sm">
                                                        <span className="text-gray-400">
                                                            Top 3 Finishes:
                                                        </span>
                                                        <span className="text-white font-medium">
                                                            {stats.top3}
                                                        </span>
                                                    </div>
                                                </div>

                                                <div className="mt-4 pt-4 border-t border-gray-600">
                                                    <div className="flex items-center text-xs text-gray-400">
                                                        <Hash className="h-3 w-3 mr-1" />
                                                        Tournament ID:{" "}
                                                        {tournament.tourid}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <div className="text-center py-12">
                                    <Trophy className="mx-auto h-12 w-12 text-gray-400" />
                                    <h3 className="mt-2 text-sm font-medium text-white">
                                        Tidak ada tournament
                                    </h3>
                                    <p className="mt-1 text-sm text-gray-400">
                                        Tambahkan tournament terlebih dahulu
                                        untuk mengelola participants.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </AdminLayout>
        );
    }

    // Participants View for Selected Tournament
    return (
        <AdminLayout user={authUser}>
            <Head title={`Admin - Participants: ${activeTournament?.name}`} />

            <div className="space-y-6">
                {/* Header with Back Button */}
                <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center">
                            <button
                                onClick={handleBackToTournaments}
                                className="inline-flex items-center px-3 py-2 border border-gray-600 rounded-lg shadow-sm text-sm font-medium text-gray-300 bg-gray-700 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors mr-4"
                            >
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Back to Tournaments
                            </button>
                            <div>
                                <h1 className="text-2xl font-bold text-white">
                                    {activeTournament?.name}
                                </h1>
                                <div className="flex items-center mt-1 space-x-3">
                                    <p className="text-sm text-gray-400">
                                        Participants Management
                                    </p>
                                    {activeTournament?.category &&
                                        getCategoryBadge(
                                            activeTournament.category
                                        )}
                                </div>
                            </div>
                        </div>
                        <div className="mt-4 sm:mt-0 flex space-x-3">
                            <button
                                onClick={() => openModal()}
                                className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                            >
                                <Plus className="h-4 w-4 mr-2" />
                                Add Participant
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

                {/* Tournament Statistics */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                        <div className="flex items-center">
                            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center mr-3">
                                <Users className="h-4 w-4 text-white" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-400">
                                    Total Participants
                                </p>
                                <p className="text-xl font-semibold text-white">
                                    {currentParticipants.length}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                        <div className="flex items-center">
                            <div className="w-8 h-8 bg-yellow-500 rounded-lg flex items-center justify-center mr-3">
                                <Trophy className="h-4 w-4 text-white" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-400">
                                    With Placement
                                </p>
                                <p className="text-xl font-semibold text-white">
                                    {
                                        currentParticipants.filter(
                                            (p) => p.placement
                                        ).length
                                    }
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                        <div className="flex items-center">
                            <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center mr-3">
                                <Medal className="h-4 w-4 text-white" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-400">
                                    Top 3 Finishes
                                </p>
                                <p className="text-xl font-semibold text-white">
                                    {
                                        currentParticipants.filter(
                                            (p) =>
                                                p.placement && p.placement <= 3
                                        ).length
                                    }
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Participants Table */}
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
                                            <UserCheck className="h-4 w-4 mr-1" />
                                            Player
                                        </div>
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                        <div className="flex items-center">
                                            <Medal className="h-4 w-4 mr-1" />
                                            Placement
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
                                {currentParticipants.map((participant) => (
                                    <tr
                                        key={participant.id}
                                        className="hover:bg-gray-700 transition-colors"
                                    >
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                            {participant.id}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-white">
                                                {participant.user?.name || "-"}
                                            </div>
                                            {participant.user?.sgguserid && (
                                                <div className="text-xs text-gray-400">
                                                    SGG ID:{" "}
                                                    {participant.user.sgguserid}
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {getPlacementBadge(
                                                participant.placement
                                            ) || (
                                                <span className="text-sm text-gray-400">
                                                    -
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                            {new Date(
                                                participant.created_at
                                            ).toLocaleDateString("id-ID")}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <div className="flex justify-end space-x-2">
                                                <button
                                                    onClick={() =>
                                                        openModal(participant)
                                                    }
                                                    className="inline-flex items-center px-3 py-1.5 border border-gray-600 shadow-sm text-xs font-medium rounded text-gray-300 bg-gray-700 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                                                >
                                                    <Edit3 className="h-3 w-3 mr-1" />
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() =>
                                                        handleDelete(
                                                            participant
                                                        )
                                                    }
                                                    className="inline-flex items-center px-3 py-1.5 border border-red-600 shadow-sm text-xs font-medium rounded text-red-300 bg-red-900 hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
                                                >
                                                    <Trash2 className="h-3 w-3 mr-1" />
                                                    Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {currentParticipants.length === 0 && (
                            <div className="text-center py-12">
                                <Users className="mx-auto h-12 w-12 text-gray-400" />
                                <h3 className="mt-2 text-sm font-medium text-white">
                                    No participants in this tournament
                                </h3>
                                <p className="mt-1 text-sm text-gray-400">
                                    Add participants manually or sync from
                                    Start.gg.
                                </p>
                                <div className="mt-6">
                                    <button
                                        onClick={() => openModal()}
                                        className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                                    >
                                        <Plus className="h-4 w-4 mr-2" />
                                        Add Participant
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Modal Form - Same as before but with tournament pre-selected */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
                    <div className="relative bg-gray-800 border border-gray-700 w-full max-w-md shadow-lg rounded-2xl">
                        <div className="flex items-center justify-between p-6 border-b border-gray-700">
                            <h3 className="text-lg font-medium text-white">
                                {editingParticipant
                                    ? "Edit Participant"
                                    : `Add Participant to ${activeTournament?.name}`}
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
                                {/* User Selection */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">
                                        Player *
                                    </label>
                                    <select
                                        value={data.user_id}
                                        onChange={(e) =>
                                            setData("user_id", e.target.value)
                                        }
                                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-white"
                                        required
                                    >
                                        <option value="">Select Player</option>
                                        {users?.map((user) => (
                                            <option
                                                key={user.id}
                                                value={user.id}
                                            >
                                                {user.name}{" "}
                                                {user.sgguserid
                                                    ? `(SGG: ${user.sgguserid})`
                                                    : ""}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.user_id && (
                                        <p className="mt-1 text-sm text-red-400">
                                            {errors.user_id}
                                        </p>
                                    )}
                                </div>

                                {/* Tournament - Display selected tournament */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">
                                        Tournament
                                    </label>
                                    <div className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white">
                                        {activeTournament?.name}
                                    </div>
                                    <input
                                        type="hidden"
                                        name="tourid"
                                        value={data.tourid}
                                    />
                                </div>

                                {/* Placement */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">
                                        Placement
                                    </label>
                                    <input
                                        type="number"
                                        value={data.placement}
                                        onChange={(e) =>
                                            setData("placement", e.target.value)
                                        }
                                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-white"
                                        placeholder="Leave empty if no result yet"
                                        min="1"
                                    />
                                    {errors.placement && (
                                        <p className="mt-1 text-sm text-red-400">
                                            {errors.placement}
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
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-colors"
                                >
                                    {processing
                                        ? "Saving..."
                                        : editingParticipant
                                        ? "Update"
                                        : "Save"}
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
                                    Hapus Participant
                                </h3>
                                <div className="mt-2">
                                    <p className="text-sm text-gray-400">
                                        Apakah Anda yakin ingin menghapus
                                        participant "
                                        {participantToDelete?.user?.name}" dari
                                        tournament "
                                        {participantToDelete?.tournament?.name}
                                        "? Tindakan ini tidak dapat dibatalkan.
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

export default ParticipantsIndex;
