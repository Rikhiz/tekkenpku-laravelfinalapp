import React, { useState } from "react";
import { Head, useForm, router } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";
import { Shield, User, Plus, Edit3, Trash2 } from "lucide-react";
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

  const openCreate = () => {
    reset();
    setEditing(null);
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
        },
      });
    } else {
      post("/admin/banlist", {
        preserveScroll: true,
        onSuccess: () => {
          setShowModal(false);
          reset();
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

  return (
    <AdminLayout user={authUser}>
      <Head title="Ban List" />

      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              <Shield className="text-red-500" size={32} />
              Ban List
            </h1>
            <p className="text-gray-400 mt-1">
              Manage banned users for Major, Minor, and Mini events
            </p>
          </div>
          <button
            onClick={openCreate}
            className="bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white px-5 py-3 rounded-lg flex items-center gap-2 shadow-lg hover:shadow-red-500/50 transition-all"
          >
            <Plus size={18} />
            Add Ban
          </button>
        </div>

        {/* Table */}
        <div className="bg-gray-900 border border-red-500 rounded-lg overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-white">
              <thead>
                <tr className="border-b border-red-500 bg-gray-800">
                  <th className="py-3 px-4 text-left font-semibold">User</th>
                  <th className="py-3 px-4 text-center font-semibold">Major</th>
                  <th className="py-3 px-4 text-center font-semibold">Minor</th>
                  <th className="py-3 px-4 text-center font-semibold">Mini</th>
                  <th className="py-3 px-4 text-center font-semibold">Actions</th>
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
                        <Shield className="text-gray-600" size={48} />
                        <div>
                          <p className="text-lg font-medium">No banned users</p>
                          <p className="text-sm mt-1">
                            Click "Add Ban" to restrict players
                          </p>
                        </div>
                      </div>
                    </td>
                  </tr>
                ) : (
                  banlists.data.map((ban) => (
                    <tr
                      key={ban.id}
                      className="hover:bg-gray-800 border-b border-gray-700 transition-colors"
                    >
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <User className="text-gray-400" size={18} />
                          <span className="font-semibold">
                            {ban.user?.name || "Unknown"}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-center">
                        {ban.major}
                      </td>
                      <td className="py-3 px-4 text-center">
                        {ban.minor}
                      </td>
                      <td className="py-3 px-4 text-center">
                        {ban.mini}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() => openEdit(ban)}
                            className="text-blue-400 hover:text-blue-300 p-2 hover:bg-gray-700 rounded-lg transition-colors inline-flex items-center gap-1"
                          >
                            <Edit3 size={18} />
                          </button>
                          <button
                            onClick={() => handleDelete(ban.id)}
                            className="text-red-400 hover:text-red-300 p-2 hover:bg-gray-700 rounded-lg transition-colors inline-flex items-center gap-1"
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

      {/* Modal */}
      <Modal
        title={editing ? "Edit Ban" : "Add Ban"}
        show={showModal}
        onClose={() => setShowModal(false)}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* User Select */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              User
            </label>
            <select
              value={data.user_id}
              onChange={(e) => setData("user_id", e.target.value)}
              disabled={!!editing}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg text-white px-3 py-2"
            >
              <option value="">-- Select User --</option>
              {users.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name}
                </option>
              ))}
            </select>
          </div>

          {/* Major */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Major
            </label>
            <select
              value={data.major}
              onChange={(e) => setData("major", e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg text-white px-3 py-2"
            >
              <option value="No">No</option>
              <option value="Yes">Yes</option>
            </select>
          </div>

          {/* Minor */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Minor
            </label>
            <select
              value={data.minor}
              onChange={(e) => setData("minor", e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg text-white px-3 py-2"
            >
              <option value="No">No</option>
              <option value="Yes">Yes</option>
            </select>
          </div>

          {/* Mini */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Mini
            </label>
            <select
              value={data.mini}
              onChange={(e) => setData("mini", e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg text-white px-3 py-2"
            >
              <option value="No">No</option>
              <option value="Yes">Yes</option>
            </select>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={processing}
              className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg"
            >
              {editing ? "Update" : "Save"}
            </button>
          </div>
        </form>
      </Modal>
    </AdminLayout>
  );
};

export default BanListIndex;
