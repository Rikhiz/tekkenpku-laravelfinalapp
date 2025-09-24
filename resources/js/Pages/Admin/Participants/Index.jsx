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
  UserCheck
} from "lucide-react";

const ParticipantsIndex = ({ participantsAll, authUser, users, tournaments, flash }) => {
  const [showModal, setShowModal] = useState(false);
  const [editingParticipant, setEditingParticipant] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [participantToDelete, setParticipantToDelete] = useState(null);
  const [syncing, setSyncing] = useState(false);

  const { data, setData, post, put, processing, errors, reset } = useForm({
    user_id: "",
    tourid: "",
    placement: "",
  });

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
      router.delete(route("participant.destroy", participantToDelete.id), {
        onSuccess: () => {
          setShowDeleteModal(false);
          setParticipantToDelete(null);
        },
      });
    }
  };

  const handleSyncParticipants = () => {
    if (confirm("Yakin ingin sinkronkan participants dari semua tournaments? Proses ini mungkin memakan waktu.")) {
      setSyncing(true);
      router.post("/admin/participants/sync", {}, {
        onFinish: () => setSyncing(false),
      });
    }
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
      <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${badgeClass}`}>
        {icon}
        #{placement}
      </span>
    );
  };

  return (
    <AdminLayout user={authUser}>
      <Head title="Admin - Participants Management" />

      <div className="space-y-6">
        {/* Header */}
        <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">
                Participants Management
              </h1>
              <p className="mt-1 text-sm text-gray-400">
                Kelola semua partisipan tournament dan placement mereka
              </p>
            </div>
            <div className="mt-4 sm:mt-0 flex space-x-3">
              <button
                onClick={handleSyncParticipants}
                disabled={syncing}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 transition-colors"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${syncing ? 'animate-spin' : ''}`} />
                {syncing ? 'Syncing...' : 'Sync Participants'}
              </button>
              <button
                onClick={() => openModal()}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                <Plus className="h-4 w-4 mr-2" />
                Tambah Participant
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

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center mr-3">
                <Users className="h-4 w-4 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Total Participants</p>
                <p className="text-xl font-semibold text-white">
                  {participantsAll?.length || 0}
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
                <p className="text-sm text-gray-400">With Placement</p>
                <p className="text-xl font-semibold text-white">
                  {participantsAll?.filter(p => p.placement).length || 0}
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
                <p className="text-sm text-gray-400">Top 3 Finishes</p>
                <p className="text-xl font-semibold text-white">
                  {participantsAll?.filter(p => p.placement && p.placement <= 3).length || 0}
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
                      <Trophy className="h-4 w-4 mr-1" />
                      Tournament
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
                {participantsAll?.map((participant) => (
                  <tr key={participant.id} className="hover:bg-gray-700 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {participant.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-white">
                        {participant.user?.name || "-"}
                      </div>
                      {participant.user?.sgguserid && (
                        <div className="text-xs text-gray-400">
                          SGG ID: {participant.user.sgguserid}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-white">
                        {participant.tournament?.name || "-"}
                      </div>
                      {participant.tournament?.category && (
                        <div className="text-xs text-gray-400">
                          Category: {participant.tournament.category === 1 ? 'Major' : participant.tournament.category === 2 ? 'Minor' : 'Mini'}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getPlacementBadge(participant.placement) || (
                        <span className="text-sm text-gray-400">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {new Date(participant.created_at).toLocaleDateString("id-ID")}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => openModal(participant)}
                          className="inline-flex items-center px-3 py-1.5 border border-gray-600 shadow-sm text-xs font-medium rounded text-gray-300 bg-gray-700 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                        >
                          <Edit3 className="h-3 w-3 mr-1" />
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(participant)}
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

            {(!participantsAll || participantsAll.length === 0) && (
              <div className="text-center py-12">
                <Users className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-white">
                  Tidak ada participant
                </h3>
                <p className="mt-1 text-sm text-gray-400">
                  Mulai dengan menambahkan participant baru atau sync dari Start.gg.
                </p>
                <div className="mt-6 flex justify-center space-x-3">
                  <button
                    onClick={() => openModal()}
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Tambah Participant
                  </button>
                  <button
                    onClick={handleSyncParticipants}
                    disabled={syncing}
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 transition-colors"
                  >
                    <RefreshCw className={`h-4 w-4 mr-2 ${syncing ? 'animate-spin' : ''}`} />
                    {syncing ? 'Syncing...' : 'Sync Participants'}
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
                {editingParticipant ? "Edit Participant" : "Tambah Participant Baru"}
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
                    onChange={(e) => setData("user_id", e.target.value)}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-white"
                    required
                  >
                    <option value="">Pilih Player</option>
                    {users?.map((user) => (
                      <option key={user.id} value={user.id}>
                        {user.name} {user.sgguserid ? `(SGG: ${user.sgguserid})` : ''}
                      </option>
                    ))}
                  </select>
                  {errors.user_id && (
                    <p className="mt-1 text-sm text-red-400">{errors.user_id}</p>
                  )}
                </div>

                {/* Tournament Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Tournament *
                  </label>
                  <select
                    value={data.tourid}
                    onChange={(e) => setData("tourid", e.target.value)}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-white"
                    required
                  >
                    <option value="">Pilih Tournament</option>
                    {tournaments?.map((tournament) => (
                      <option key={tournament.tourid} value={tournament.tourid}>
                        {tournament.name}
                      </option>
                    ))}
                  </select>
                  {errors.tourid && (
                    <p className="mt-1 text-sm text-red-400">{errors.tourid}</p>
                  )}
                </div>

                {/* Placement */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Placement
                  </label>
                  <input
                    type="number"
                    value={data.placement}
                    onChange={(e) => setData("placement", e.target.value)}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-white"
                    placeholder="Kosongkan jika belum ada hasil"
                    min="1"
                  />
                  {errors.placement && (
                    <p className="mt-1 text-sm text-red-400">{errors.placement}</p>
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
                  {processing ? "Menyimpan..." : editingParticipant ? "Update" : "Simpan"}
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
                    Apakah Anda yakin ingin menghapus participant "{participantToDelete?.user?.name}" dari tournament "{participantToDelete?.tournament?.name}"?
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

export default ParticipantsIndex;