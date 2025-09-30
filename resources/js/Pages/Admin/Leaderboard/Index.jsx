import React, { useState } from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import { Calculator, Trophy, Eye, RefreshCw, Users, Award } from "lucide-react";
import { router } from "@inertiajs/react";

const LeaderboardIndex = ({ leaderboardAll = [], authUser }) => {
  const [calculating, setCalculating] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  // Point calculation function based on placement and category
  const calculatePoints = (placement, entrants, category) => {
    const pointTable = {
      1: { // Major Events
        1: 800, 2: 560, 3: 430, 4: 220, 5: 150,
        7: 120, 9: 70, 13: 50, 17: 30
      },
      2: { // Minor Events
        1: 400, 2: 300, 3: 220, 4: 150, 5: 70,
        7: 50, 9: 30, 13: 15, 17: 10
      },
      3: { // Mini Events
        1: 220, 2: 150, 3: 100, 4: 70, 5: 50,
        7: 30, 9: 15, 13: 10, 17: 5
      }
    };

    const categoryPoints = pointTable[category];
    if (!categoryPoints) return 0;

    if (placement === 1) return categoryPoints[1];
    if (placement === 2) return categoryPoints[2];
    if (placement === 3) return categoryPoints[3];
    if (placement === 4) return categoryPoints[4];
    if (placement >= 5 && placement <= 6) return categoryPoints[5];
    if (placement >= 7 && placement <= 8) return categoryPoints[7];
    if (placement >= 9 && placement <= 12) return categoryPoints[9];
    if (placement >= 13 && placement <= 16) return categoryPoints[13];
    if (placement >= 17) return categoryPoints[17];

    return 0;
  };

  // Recalculate leaderboard from relasitour data
  const handleRecalculate = async () => {
    setCalculating(true);
    try {
      // Send request to backend to recalculate
      router.post('/admin/leaderboard/recalculate', {}, {
        preserveScroll: true,
        onSuccess: () => {
          alert('Leaderboard recalculated successfully!');
        },
        onError: (errors) => {
          alert('Failed to recalculate: ' + Object.values(errors).join(', '));
        },
        onFinish: () => {
          setCalculating(false);
        }
      });
    } catch (error) {
      console.error('Recalculation error:', error);
      alert('Failed to recalculate leaderboard');
      setCalculating(false);
    }
  };

  // Sort leaderboard by total points
  const sortedLeaderboard = [...leaderboardAll].sort((a, b) => 
    (b.total_points || 0) - (a.total_points || 0)
  );

  // Player details modal
  const PlayerDetailsModal = ({ player, onClose }) => {
    if (!player) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
        <div className="bg-gray-900 border border-red-500 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div className="sticky top-0 bg-gray-800 border-b border-red-500 p-6 flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <Trophy className="text-yellow-400" size={24} />
                {player.player_name}
              </h2>
              <p className="text-gray-400 mt-1">User: {player.user?.name || 'N/A'}</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white text-2xl"
            >
              ×
            </button>
          </div>

          <div className="p-6">
            {/* Total Points Summary */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-gray-800 border border-yellow-500 rounded-lg p-4">
                <div className="text-yellow-400 text-sm mb-1">Major Points</div>
                <div className="text-3xl font-bold text-white">{player.major || 0}</div>
                <div className="text-gray-400 text-xs mt-1">
                  {player.counted_major_events || 0}/1 counted
                </div>
              </div>
              <div className="bg-gray-800 border border-blue-500 rounded-lg p-4">
                <div className="text-blue-400 text-sm mb-1">Minor Points</div>
                <div className="text-3xl font-bold text-white">{player.minor || 0}</div>
                <div className="text-gray-400 text-xs mt-1">
                  {player.counted_minor_events || 0}/2 counted
                </div>
              </div>
              <div className="bg-gray-800 border border-green-500 rounded-lg p-4">
                <div className="text-green-400 text-sm mb-1">Mini Points</div>
                <div className="text-3xl font-bold text-white">{player.mini || 0}</div>
                <div className="text-gray-400 text-xs mt-1">
                  {player.counted_mini_events || 0}/4 counted
                </div>
              </div>
              <div className="bg-gray-800 border border-red-500 rounded-lg p-4">
                <div className="text-red-400 text-sm mb-1">Total Points</div>
                <div className="text-3xl font-bold text-white">{player.total_points || 0}</div>
                <div className="text-gray-400 text-xs mt-1">Overall Score</div>
              </div>
            </div>

            {/* Events Participated */}
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
              <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                <Users size={18} />
                Events Participated
              </h3>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-yellow-400 text-2xl font-bold">
                    {player.total_major_events || 0}
                  </div>
                  <div className="text-gray-400 text-sm">Major Events</div>
                </div>
                <div>
                  <div className="text-blue-400 text-2xl font-bold">
                    {player.total_minor_events || 0}
                  </div>
                  <div className="text-gray-400 text-sm">Minor Events</div>
                </div>
                <div>
                  <div className="text-green-400 text-2xl font-bold">
                    {player.total_mini_events || 0}
                  </div>
                  <div className="text-gray-400 text-sm">Mini Events</div>
                </div>
              </div>
            </div>

            {/* Timestamps */}
            <div className="mt-4 text-sm text-gray-400 space-y-1">
              <div>Created: {new Date(player.created_at).toLocaleString()}</div>
              <div>Last Updated: {new Date(player.updated_at).toLocaleString()}</div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <AdminLayout user={authUser}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              <Award className="text-red-500" size={32} />
              Global Leaderboard
            </h1>
            <p className="text-gray-400 mt-1">Tournament ranking system</p>
          </div>
          <button
            onClick={handleRecalculate}
            disabled={calculating}
            className="bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 disabled:from-gray-600 disabled:to-gray-600 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-all shadow-lg hover:shadow-green-500/50"
          >
            {calculating ? (
              <RefreshCw size={18} className="animate-spin" />
            ) : (
              <Calculator size={18} />
            )}
            {calculating ? "Calculating..." : "Recalculate Points"}
          </button>
        </div>

        {/* Rules Card */}
        <div className="bg-gradient-to-r from-blue-900 to-blue-800 border border-blue-500 rounded-lg p-5 shadow-lg">
          <h3 className="text-blue-200 font-semibold mb-2 flex items-center gap-2">
            <Trophy size={18} />
            Leaderboard Scoring Rules
          </h3>
          <p className="text-blue-100 text-sm leading-relaxed">
            Players are ranked by total points from: <strong>Top 1 Major event</strong> + <strong>Top 2 Minor events</strong> + <strong>Top 4 Mini events</strong>
          </p>
          <p className="text-blue-200 text-xs mt-2">
            Additional events in each category are recorded but not counted towards total points.
          </p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-900 border border-gray-700 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <Users className="text-blue-400" size={24} />
              <div>
                <div className="text-gray-400 text-sm">Total Players</div>
                <div className="text-2xl font-bold text-white">{sortedLeaderboard.length}</div>
              </div>
            </div>
          </div>
          <div className="bg-gray-900 border border-gray-700 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <Trophy className="text-yellow-400" size={24} />
              <div>
                <div className="text-gray-400 text-sm">Top Player</div>
                <div className="text-lg font-bold text-white truncate">
                  {sortedLeaderboard[0]?.player_name || 'N/A'}
                </div>
              </div>
            </div>
          </div>
          <div className="bg-gray-900 border border-gray-700 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <Award className="text-red-400" size={24} />
              <div>
                <div className="text-gray-400 text-sm">Highest Score</div>
                <div className="text-2xl font-bold text-white">
                  {sortedLeaderboard[0]?.total_points || 0}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Leaderboard Table */}
        <div className="bg-gray-900 border border-red-500 rounded-lg overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-white">
              <thead>
                <tr className="border-b border-red-500 bg-gray-800">
                  <th className="py-4 px-4 text-left font-semibold">Rank</th>
                  <th className="py-4 px-4 text-left font-semibold">Player</th>
                  <th className="py-4 px-4 text-left font-semibold">User Account</th>
                  <th className="py-4 px-4 text-center font-semibold">Major</th>
                  <th className="py-4 px-4 text-center font-semibold">Minor</th>
                  <th className="py-4 px-4 text-center font-semibold">Mini</th>
                  <th className="py-4 px-4 text-center font-semibold">Total Points</th>
                  <th className="py-4 px-4 text-center font-semibold">Events</th>
                  <th className="py-4 px-4 text-center font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {sortedLeaderboard.length === 0 ? (
                  <tr>
                    <td colSpan="9" className="text-center text-gray-400 py-12">
                      <div className="flex flex-col items-center gap-3">
                        <Trophy className="text-gray-600" size={48} />
                        <div>
                          <p className="text-lg font-medium">No leaderboard data</p>
                          <p className="text-sm mt-1">Click "Recalculate Points" to generate leaderboard from tournament results</p>
                        </div>
                      </div>
                    </td>
                  </tr>
                ) : (
                  sortedLeaderboard.map((player, index) => (
                    <tr
                      key={player.id}
                      className="hover:bg-gray-800 border-b border-gray-700 transition-colors"
                    >
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          {index === 0 && <Trophy className="text-yellow-400" size={20} />}
                          {index === 1 && <Trophy className="text-gray-400" size={20} />}
                          {index === 2 && <Trophy className="text-orange-400" size={20} />}
                          <span className="font-bold text-lg">#{index + 1}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="font-semibold text-white">{player.player_name}</div>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-gray-400">{player.user?.name || '-'}</span>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <div className="flex flex-col items-center">
                          <span className="text-yellow-400 font-bold text-lg">{player.major || 0}</span>
                          <span className="text-gray-500 text-xs">
                            {player.counted_major_events || 0}/1
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <div className="flex flex-col items-center">
                          <span className="text-blue-400 font-bold text-lg">{player.minor || 0}</span>
                          <span className="text-gray-500 text-xs">
                            {player.counted_minor_events || 0}/2
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <div className="flex flex-col items-center">
                          <span className="text-green-400 font-bold text-lg">{player.mini || 0}</span>
                          <span className="text-gray-500 text-xs">
                            {player.counted_mini_events || 0}/4
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <span className="text-red-400 font-bold text-2xl">
                          {player.total_points || 0}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="text-xs text-gray-400 text-center space-y-1">
                          <div>Major: {player.total_major_events || 0}</div>
                          <div>Minor: {player.total_minor_events || 0}</div>
                          <div>Mini: {player.total_mini_events || 0}</div>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <button
                          onClick={() => {
                            setSelectedPlayer(player);
                            setShowDetails(true);
                          }}
                          className="text-blue-400 hover:text-blue-300 p-2 hover:bg-gray-700 rounded-lg transition-colors inline-flex items-center gap-1"
                          title="View Details"
                        >
                          <Eye size={18} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer Info */}
        {sortedLeaderboard.length > 0 && (
          <div className="bg-gray-900 border border-gray-700 rounded-lg p-4">
            <p className="text-sm text-gray-400">
              <strong className="text-white">Scoring Rule:</strong> Only the highest-scoring events count towards total points: 
              Top 1 Major + Top 2 Minor + Top 4 Mini events per player.
            </p>
          </div>
        )}
      </div>

      {/* Player Details Modal */}
      {showDetails && (
        <PlayerDetailsModal
          player={selectedPlayer}
          onClose={() => {
            setShowDetails(false);
            setSelectedPlayer(null);
          }}
        />
      )}
    </AdminLayout>
  );
};

export default LeaderboardIndex;