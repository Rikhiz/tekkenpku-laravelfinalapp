import React from "react";
import AdminLayout from "@/Layouts/AdminLayout";

const ParticipantsIndex = ({ participantsAll = [], authUser }) => {
  return (
    <AdminLayout user={authUser}>
      <h1 className="text-2xl font-bold mb-6">Participants</h1>

      <div className="overflow-x-auto">
        <table className="min-w-full text-left border border-gray-700">
          <thead className="bg-gray-800 text-gray-300">
            <tr>
              <th className="px-4 py-2 border border-gray-700">ID</th>
              <th className="px-4 py-2 border border-gray-700">User</th>
              <th className="px-4 py-2 border border-gray-700">Tournament</th>
              <th className="px-4 py-2 border border-gray-700">Placement</th>
              <th className="px-4 py-2 border border-gray-700">Created At</th>
              <th className="px-4 py-2 border border-gray-700">Updated At</th>
            </tr>
          </thead>
          <tbody>
            {participantsAll?.map((p) => (
              <tr key={p.id}>
                <td className="px-4 py-2 border border-gray-700">{p.id}</td>
                <td className="px-4 py-2 border border-gray-700">{p.user?.name ?? "-"}</td>
                <td className="px-4 py-2 border border-gray-700">{p.tournament?.name ?? "-"}</td>
                <td className="px-4 py-2 border border-gray-700">{p.placement}</td>
                <td className="px-4 py-2 border border-gray-700">{p.created_at}</td>
                <td className="px-4 py-2 border border-gray-700">{p.updated_at}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
};

export default ParticipantsIndex;
