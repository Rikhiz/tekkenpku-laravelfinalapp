import React from "react";
import AdminLayout from "@/Layouts/AdminLayout";

const LeaderboardIndex = ({ leaderboardAll = [], authUser }) => {
  return (
    <AdminLayout user={authUser}>
      <h1 className="text-2xl font-bold mb-6">Leaderboard</h1>

      <div className="overflow-x-auto">
        <table className="min-w-full text-left border border-gray-700">
          <thead className="bg-gray-800 text-gray-300">
            <tr>
              <th className="px-4 py-2 border border-gray-700">ID</th>
              <th className="px-4 py-2 border border-gray-700">User</th>
              <th className="px-4 py-2 border border-gray-700">Player Name</th>
              <th className="px-4 py-2 border border-gray-700">Major</th>
              <th className="px-4 py-2 border border-gray-700">Minor</th>
              <th className="px-4 py-2 border border-gray-700">Mini</th>
              <th className="px-4 py-2 border border-gray-700">Total Points</th>
              <th className="px-4 py-2 border border-gray-700">Counted Major</th>
              <th className="px-4 py-2 border border-gray-700">Counted Minor</th>
              <th className="px-4 py-2 border border-gray-700">Counted Mini</th>
              <th className="px-4 py-2 border border-gray-700">Total Major</th>
              <th className="px-4 py-2 border border-gray-700">Total Minor</th>
              <th className="px-4 py-2 border border-gray-700">Total Mini</th>
              <th className="px-4 py-2 border border-gray-700">Created At</th>
              <th className="px-4 py-2 border border-gray-700">Updated At</th>
            </tr>
          </thead>
          <tbody>
            {leaderboardAll?.map((l) => (
              <tr key={l.id}>
                <td className="px-4 py-2 border border-gray-700">{l.id}</td>
                <td className="px-4 py-2 border border-gray-700">{l.user?.name ?? "-"}</td>
                <td className="px-4 py-2 border border-gray-700">{l.player_name}</td>
                <td className="px-4 py-2 border border-gray-700">{l.major}</td>
                <td className="px-4 py-2 border border-gray-700">{l.minor}</td>
                <td className="px-4 py-2 border border-gray-700">{l.mini}</td>
                <td className="px-4 py-2 border border-gray-700">{l.total_points}</td>
                <td className="px-4 py-2 border border-gray-700">{l.counted_major_events}</td>
                <td className="px-4 py-2 border border-gray-700">{l.counted_minor_events}</td>
                <td className="px-4 py-2 border border-gray-700">{l.counted_mini_events}</td>
                <td className="px-4 py-2 border border-gray-700">{l.total_major_events}</td>
                <td className="px-4 py-2 border border-gray-700">{l.total_minor_events}</td>
                <td className="px-4 py-2 border border-gray-700">{l.total_mini_events}</td>
                <td className="px-4 py-2 border border-gray-700">{l.created_at}</td>
                <td className="px-4 py-2 border border-gray-700">{l.updated_at}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
};
export default LeaderboardIndex;
