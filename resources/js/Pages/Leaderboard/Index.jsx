import React, { useState } from "react";
import AppLayout from "@/Layouts/AppLayout";
import { router } from "@inertiajs/react";
import { Trophy, Medal, Award, ChevronLeft, ChevronRight } from "lucide-react";

const LeaderboardIndex = ({ leaderboards, maxPoints }) => {
    const [hoveredPlayer, setHoveredPlayer] = useState(null);

    const getRankColor = (rank) => {
        if (rank === 1) return "from-yellow-400 to-yellow-600";
        if (rank === 2) return "from-gray-300 to-gray-500";
        if (rank === 3) return "from-orange-400 to-orange-600";
        return "from-red-500 to-orange-500";
    };

    const getRankIcon = (rank) => {
        if (rank === 1) return <Trophy className="text-yellow-400" size={24} />;
        if (rank === 2) return <Medal className="text-gray-400" size={24} />;
        if (rank === 3) return <Award className="text-orange-400" size={24} />;
        return null;
    };

    const handlePageChange = (url) => {
        if (url) {
            router.visit(url);
        }
    };

    return (
        <AppLayout>
            <div className="min-h-screen bg-gradient-to-br from-[#0D0C0C] via-[#0D0C0C] to-[#69747C]/20 py-12 px-4 sm:px-6 lg:px-8">
                {/* Header Section */}
                <div className="max-w-7xl mx-auto mb-12">
                    <div className="text-center space-y-4">
                        <h1 className="text-5xl md:text-6xl font-black bg-gradient-to-r from-[#FF2146] to-[#F2AF29] bg-clip-text text-transparent">
                            LEADERBOARD
                        </h1>
                        <p className="text-[#69747C] text-lg">
                            Top Players Ranking by Total Points
                        </p>
                    </div>
                </div>

                {/* Stats Footer */}
                <div className="max-w-7xl mx-auto mt-12 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-[#0D0C0C]/80 border border-[#69747C]/30 rounded-xl p-6 text-center">
                        <div className="text-4xl font-black bg-gradient-to-r from-[#FF2146] to-[#F2AF29] bg-clip-text text-transparent">
                            {leaderboards.total}
                        </div>
                        <div className="text-[#69747C] font-semibold mt-2">Total Players</div>
                    </div>
                    <div className="bg-[#0D0C0C]/80 border border-[#69747C]/30 rounded-xl p-6 text-center">
                        <div className="text-4xl font-black bg-gradient-to-r from-[#FF2146] to-[#F2AF29] bg-clip-text text-transparent">
                            {maxPoints}
                        </div>
                        <div className="text-[#69747C] font-semibold mt-2">Highest Score</div>
                    </div>
                    <div className="bg-[#0D0C0C]/80 border border-[#69747C]/30 rounded-xl p-6 text-center">
                        <div className="text-4xl font-black bg-gradient-to-r from-[#FF2146] to-[#F2AF29] bg-clip-text text-transparent">
                            {leaderboards.last_page}
                        </div>
                        <div className="text-[#69747C] font-semibold mt-2">Total Pages</div>
                    </div>
                </div>
                <br />
                {/* Leaderboard Container */}
                <div className="max-w-7xl mx-auto">
                    <div className="space-y-3">
                        {leaderboards.data.map((player) => {
                            const percentage = (player.total_points / maxPoints) * 100;
                            const isHovered = hoveredPlayer === player.id;

                            return (
                                <div
                                    key={player.id}
                                    className="relative bg-[#0D0C0C]/80 border border-[#69747C]/30 rounded-xl overflow-visible transition-all duration-300 hover:border-[#FF2146]/50 hover:shadow-lg hover:shadow-[#FF2146]/20"
                                    onMouseEnter={() => setHoveredPlayer(player.id)}
                                    onMouseLeave={() => setHoveredPlayer(null)}
                                >
                                    {/* Background Bar */}
                                    <div
                                        className={`absolute left-0 top-0 h-full bg-gradient-to-r ${getRankColor(
                                            player.rank
                                        )} opacity-20 transition-all duration-500`}
                                        style={{ width: `${percentage}%` }}
                                    />

                                    {/* Player Info Row */}
                                    <div className="relative flex items-center gap-4 p-4">
                                        {/* Rank Badge */}
                                        <div className="flex-shrink-0 w-16 flex items-center justify-center">
                                            {player.rank <= 3 ? (
                                                <div className="flex items-center justify-center">
                                                    {getRankIcon(player.rank)}
                                                </div>
                                            ) : (
                                                <div className="text-2xl font-black text-[#F2F2F2]">
                                                    #{player.rank}
                                                </div>
                                            )}
                                        </div>

                                        {/* Player Name */}
                                        <div className="flex-1 min-w-0">
                                            <h3 className="text-xl font-bold text-[#F2F2F2] truncate">
                                                {player.player_name}
                                            </h3>
                                        </div>

                                        {/* Total Points */}
                                        <div className="flex-shrink-0 text-right">
                                            <div className="text-3xl font-black bg-gradient-to-r from-[#FF2146] to-[#F2AF29] bg-clip-text text-transparent">
                                                {player.total_points}
                                            </div>
                                            <div className="text-xs text-[#69747C] font-medium">
                                                POINTS
                                            </div>
                                        </div>
                                    </div>

                                    {/* Hover Details - Popup from Bottom */}
                                    {isHovered && (
                                        <div className="absolute top-full left-20 mt-2 bg-white rounded-lg shadow-xl border-2 border-[#FF2146] p-3 z-50 animate-fadeIn w-80">
                                            <div className="grid grid-cols-3 gap-3">
                                                {/* Major */}
                                                <div className="text-center">
                                                    <div className="text-[10px] text-gray-500 font-bold mb-1 uppercase">
                                                        Major
                                                    </div>
                                                    <div className="text-xl font-black text-[#FF2146]">
                                                        {player.major}
                                                    </div>
                                                    <div className="text-[9px] text-gray-400">pts</div>
                                                    <div className="text-xs font-semibold text-gray-700 bg-gray-100 rounded px-1 py-0.5 mt-1">
                                                        {player.counted_major_events}/{player.total_major_events}
                                                    </div>
                                                    <div className="text-[9px] text-gray-500 mt-0.5">
                                                        events
                                                    </div>
                                                </div>

                                                {/* Minor */}
                                                <div className="text-center border-x border-gray-200">
                                                    <div className="text-[10px] text-gray-500 font-bold mb-1 uppercase">
                                                        Minor
                                                    </div>
                                                    <div className="text-xl font-black text-[#F2AF29]">
                                                        {player.minor}
                                                    </div>
                                                    <div className="text-[9px] text-gray-400">pts</div>
                                                    <div className="text-xs font-semibold text-gray-700 bg-gray-100 rounded px-1 py-0.5 mt-1">
                                                        {player.counted_minor_events}/{player.total_minor_events}
                                                    </div>
                                                    <div className="text-[9px] text-gray-500 mt-0.5">
                                                        events
                                                    </div>
                                                </div>

                                                {/* Mini */}
                                                <div className="text-center">
                                                    <div className="text-[10px] text-gray-500 font-bold mb-1 uppercase">
                                                        Mini
                                                    </div>
                                                    <div className="text-xl font-black text-[#69747C]">
                                                        {player.mini}
                                                    </div>
                                                    <div className="text-[9px] text-gray-400">pts</div>
                                                    <div className="text-xs font-semibold text-gray-700 bg-gray-100 rounded px-1 py-0.5 mt-1">
                                                        {player.counted_mini_events}/{player.total_mini_events}
                                                    </div>
                                                    <div className="text-[9px] text-gray-500 mt-0.5">
                                                        events
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Arrow pointing up */}
                                            <div className="absolute left-8 -top-2 w-0 h-0 border-l-8 border-r-8 border-b-8 border-transparent border-b-white"></div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    {/* Pagination */}
                    {leaderboards.last_page > 1 && (
                        <div className="mt-8 flex items-center justify-center gap-2">
                            {/* Previous Button */}
                            <button
                                onClick={() => handlePageChange(leaderboards.prev_page_url)}
                                disabled={!leaderboards.prev_page_url}
                                className="px-4 py-2 bg-[#0D0C0C]/80 border border-[#69747C]/30 rounded-lg text-[#F2F2F2] hover:border-[#FF2146] disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-300 flex items-center gap-2"
                            >
                                <ChevronLeft size={18} />
                                Previous
                            </button>

                            {/* Page Numbers */}
                            <div className="flex gap-2">
                                {Array.from({ length: leaderboards.last_page }, (_, i) => i + 1)
                                    .filter((page) => {
                                        const current = leaderboards.current_page;
                                        return (
                                            page === 1 ||
                                            page === leaderboards.last_page ||
                                            (page >= current - 1 && page <= current + 1)
                                        );
                                    })
                                    .map((page, index, array) => {
                                        if (index > 0 && array[index - 1] !== page - 1) {
                                            return (
                                                <React.Fragment key={`ellipsis-${page}`}>
                                                    <span className="px-3 py-2 text-[#69747C]">...</span>
                                                    <button
                                                        onClick={() =>
                                                            handlePageChange(
                                                                leaderboards.path + "?page=" + page
                                                            )
                                                        }
                                                        className={`px-4 py-2 rounded-lg font-semibold transition-all duration-300 ${
                                                            page === leaderboards.current_page
                                                                ? "bg-gradient-to-r from-[#FF2146] to-[#F2AF29] text-white"
                                                                : "bg-[#0D0C0C]/80 border border-[#69747C]/30 text-[#F2F2F2] hover:border-[#FF2146]"
                                                        }`}
                                                    >
                                                        {page}
                                                    </button>
                                                </React.Fragment>
                                            );
                                        }
                                        return (
                                            <button
                                                key={page}
                                                onClick={() =>
                                                    handlePageChange(
                                                        leaderboards.path + "?page=" + page
                                                    )
                                                }
                                                className={`px-4 py-2 rounded-lg font-semibold transition-all duration-300 ${
                                                    page === leaderboards.current_page
                                                        ? "bg-gradient-to-r from-[#FF2146] to-[#F2AF29] text-white"
                                                        : "bg-[#0D0C0C]/80 border border-[#69747C]/30 text-[#F2F2F2] hover:border-[#FF2146]"
                                                }`}
                                            >
                                                {page}
                                            </button>
                                        );
                                    })}
                            </div>

                            {/* Next Button */}
                            <button
                                onClick={() => handlePageChange(leaderboards.next_page_url)}
                                disabled={!leaderboards.next_page_url}
                                className="px-4 py-2 bg-[#0D0C0C]/80 border border-[#69747C]/30 rounded-lg text-[#F2F2F2] hover:border-[#FF2146] disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-300 flex items-center gap-2"
                            >
                                Next
                                <ChevronRight size={18} />
                            </button>
                        </div>
                    )}
                </div>

            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                    @keyframes fadeIn {
                        from {
                            opacity: 0;
                            transform: translateY(10px);
                        }
                        to {
                            opacity: 1;
                            transform: translateY(0);
                        }
                    }
                    .animate-fadeIn {
                        animation: fadeIn 0.2s ease-out;
                    }
                `
            }} />
        </AppLayout>
    );
};

export default LeaderboardIndex;