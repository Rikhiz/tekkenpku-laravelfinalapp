import React, { useState } from "react";
import AppLayout from "@/Layouts/AppLayout";
import { router } from "@inertiajs/react";
import { Trophy, Medal, Award, ChevronLeft, ChevronRight } from "lucide-react";

const LeaderboardIndex = ({
    leaderboards,
    maxPoints,
    mostover8,
    mostover4,
    tourtotal,
}) => {
    const [hoveredPlayer, setHoveredPlayer] = useState(null);
    const [expandedPlayer, setExpandedPlayer] = useState(null);

    const getRankColor = (rank) => {
        if (rank === 1) return "from-yellow-400 to-yellow-600";
        if (rank === 2) return "from-gray-300 to-gray-500";
        if (rank === 3) return "from-orange-400 to-orange-600";
        return "from-red-500 to-orange-500";
    };

    const getRankIcon = (rank) => {
        if (rank === 1) return <Trophy className="text-yellow-400" size={32} />;
        if (rank === 2) return <Medal className="text-gray-400" size={28} />;
        if (rank === 3) return <Award className="text-orange-400" size={28} />;
        return null;
    };

    const handlePageChange = (url) => {
        if (url) {
            router.visit(url);
        }
    };

    const handlePlayerClick = (playerId) => {
        setExpandedPlayer(expandedPlayer === playerId ? null : playerId);
    };

    const isPlayerExpanded = (playerId) => {
        return expandedPlayer === playerId || hoveredPlayer === playerId;
    };

    return (
        <AppLayout>
            <div className="min-h-screen bg-gradient-to-br from-[#0D0C0C] via-[#0D0C0C] to-[#69747C]/20 py-12 px-4 sm:px-6 lg:px-8">
                {/* Header Section */}
                <br />
                <br />
                <br />
                <br /> <br />
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
                <div className="max-w-7xl mx-auto mt-12 grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-[#0D0C0C]/80 border border-[#69747C]/30 rounded-xl p-6 text-center">
                        <div className="text-4xl font-black bg-gradient-to-r from-[#FF2146] to-[#F2AF29] bg-clip-text text-transparent">
                            {leaderboards.total}
                        </div>
                        <div className="text-[#69747C] font-semibold mt-2">
                            Total Players
                        </div>
                    </div>
                    <div className="bg-[#0D0C0C]/80 border border-[#69747C]/30 rounded-xl p-6 text-center">
                        <div className="text-4xl font-black bg-gradient-to-r from-[#FF2146] to-[#F2AF29] bg-clip-text text-transparent">
                            {mostover8.user?.name}
                        </div>
                        <div className="text-[#69747C] font-semibold mt-2">
                            Most Top 8
                        </div>
                    </div>
                    <div className="bg-[#0D0C0C]/80 border border-[#69747C]/30 rounded-xl p-6 text-center">
                        <div className="text-4xl font-black bg-gradient-to-r from-[#FF2146] to-[#F2AF29] bg-clip-text text-transparent">
                            {mostover4.user?.name}
                        </div>
                        <div className="text-[#69747C] font-semibold mt-2">
                            Most Top 4
                        </div>
                    </div>
                    <div className="bg-[#0D0C0C]/80 border border-[#69747C]/30 rounded-xl p-6 text-center">
                        <div className="text-4xl font-black bg-gradient-to-r from-[#FF2146] to-[#F2AF29] bg-clip-text text-transparent">
                            {tourtotal}
                        </div>
                        <div className="text-[#69747C] font-semibold mt-2">
                            Total Tournaments
                        </div>
                    </div>
                </div>
                <br />
                {/* Leaderboard Container */}
                <div className="max-w-7xl mx-auto">
                    <div className="space-y-4">
                        {leaderboards.data.map((player) => {
                            const percentage =
                                (player.total_points / maxPoints) * 100;
                            const isExpanded = isPlayerExpanded(player.id);
                            const isTopThree = player.rank <= 3;
                            const barHeight = isTopThree ? "h-28" : "h-20";

                            return (
                                <div key={player.id} className="relative">
                                    <div
                                        className={`relative bg-[#0D0C0C]/80 border border-[#69747C]/30 rounded-xl transition-all duration-300 hover:border-[#FF2146]/50 hover:shadow-lg hover:shadow-[#FF2146]/20 ${barHeight} ${
                                            isExpanded ? "mb-2" : "mb-0"
                                        } cursor-pointer md:cursor-default`}
                                        onMouseEnter={() =>
                                            setHoveredPlayer(player.id)
                                        }
                                        onMouseLeave={() =>
                                            setHoveredPlayer(null)
                                        }
                                        onClick={() =>
                                            handlePlayerClick(player.id)
                                        }
                                    >
                                        {/* Background Bar */}
                                        <div
                                            className={`absolute left-0 top-0 h-full bg-gradient-to-r ${getRankColor(
                                                player.rank
                                            )} opacity-20 transition-all duration-500 rounded-xl`}
                                            style={{ width: `${percentage}%` }}
                                        />

                                        {/* Player Info Row */}
                                        <div className="relative flex items-center gap-3 md:gap-4 h-full px-3 md:px-4">
                                            {/* Rank Badge */}
                                            <div
                                                className={`flex-shrink-0 flex items-center justify-center ${
                                                    isTopThree
                                                        ? "w-16 md:w-20"
                                                        : "w-12 md:w-16"
                                                }`}
                                            >
                                                {player.rank <= 3 ? (
                                                    <div className="flex items-center justify-center">
                                                        {getRankIcon(
                                                            player.rank
                                                        )}
                                                    </div>
                                                ) : (
                                                    <div className="text-xl md:text-2xl font-black text-[#F2F2F2]">
                                                        #{player.rank}
                                                    </div>
                                                )}
                                            </div>

                                            {/* Player Name */}
                                            <div className="flex-1 min-w-0">
                                                <h3
                                                    className={`font-bold text-[#F2F2F2] truncate ${
                                                        isTopThree
                                                            ? "text-lg md:text-2xl"
                                                            : "text-base md:text-xl"
                                                    }`}
                                                >
                                                    {player.player_name}
                                                </h3>
                                            </div>

                                            {/* Total Points */}
                                            <div className="flex-shrink-0 text-right">
                                                <div
                                                    className={`font-black bg-gradient-to-r from-[#FF2146] to-[#F2AF29] bg-clip-text text-transparent ${
                                                        isTopThree
                                                            ? "text-2xl md:text-4xl"
                                                            : "text-xl md:text-3xl"
                                                    }`}
                                                >
                                                    {player.total_points}
                                                </div>
                                                <div className="text-[10px] md:text-xs text-[#69747C] font-medium">
                                                    POINTS
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Hover/Click Details - Dropdown from Bar */}
                                    {isExpanded && (
                                        <div className="bg-gradient-to-br from-[#0D0C0C] to-[#1a1a1a] rounded-b-xl border-x-2 border-b-2 border-[#FF2146] shadow-2xl overflow-hidden animate-slideDown">
                                            <div className="flex divide-x divide-[#69747C]/30">
                                                {/* Major */}
                                                <div className="flex-1 text-center py-3 px-2">
                                                    <div className="text-[10px] text-[#69747C] font-bold mb-1 uppercase tracking-wider">
                                                        Major
                                                    </div>
                                                    <div className="text-2xl font-black text-[#FF2146] leading-none mb-1">
                                                        {player.major}
                                                    </div>
                                                    <div className="text-[9px] text-[#69747C] mb-1.5">
                                                        pts
                                                    </div>
                                                    <div className="block w-fit mx-auto text-xs font-bold text-white bg-gradient-to-r from-[#FF2146] to-[#ff4d6b] rounded-t px-2 py-0.5 mt-1">
                                                        {
                                                            player.counted_major_events
                                                        }
                                                        /
                                                        {
                                                            player.total_major_events
                                                        }
                                                    </div>
                                                </div>

                                                {/* Minor */}
                                                <div className="flex-1 text-center py-3 px-2">
                                                    <div className="text-[10px] text-[#69747C] font-bold mb-1 uppercase tracking-wider">
                                                        Minor
                                                    </div>
                                                    <div className="text-2xl font-black text-[#F2AF29] leading-none mb-1">
                                                        {player.minor}
                                                    </div>
                                                    <div className="text-[9px] text-[#69747C] mb-1.5">
                                                        pts
                                                    </div>
                                                    <div className="block w-fit mx-auto text-xs font-bold text-white bg-gradient-to-r from-[#F2AF29] to-[#f5c563] rounded-t px-2 py-0.5 mt-1">
                                                        {
                                                            player.counted_minor_events
                                                        }
                                                        /
                                                        {
                                                            player.total_minor_events
                                                        }
                                                    </div>
                                                </div>

                                                {/* Mini */}
                                                <div className="flex-1 text-center py-3 px-2">
                                                    <div className="text-[10px] text-[#69747C] font-bold mb-1 uppercase tracking-wider">
                                                        Mini
                                                    </div>
                                                    <div className="text-2xl font-black text-[#69747C] leading-none mb-1">
                                                        {player.mini}
                                                    </div>
                                                    <div className="text-[9px] text-[#69747C] mb-1.5">
                                                        pts
                                                    </div>
                                                    <div className="block w-fit mx-auto text-xs font-bold text-white bg-[#69747C] rounded-t px-2 py-0.5 mt-1">
                                                        {
                                                            player.counted_mini_events
                                                        }
                                                        /
                                                        {
                                                            player.total_mini_events
                                                        }
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    {/* Pagination */}
                    {leaderboards.last_page > 1 && (
                        <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
                            {/* Previous Button */}
                            <button
                                onClick={() =>
                                    handlePageChange(leaderboards.prev_page_url)
                                }
                                disabled={!leaderboards.prev_page_url}
                                className="px-3 md:px-4 py-2 bg-[#0D0C0C]/80 border border-[#69747C]/30 rounded-lg text-[#F2F2F2] hover:border-[#FF2146] disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-300 flex items-center gap-1 md:gap-2 text-sm md:text-base"
                            >
                                <ChevronLeft size={18} />
                                <span className="hidden sm:inline">
                                    Previous
                                </span>
                                <span className="sm:hidden">Prev</span>
                            </button>

                            {/* Page Numbers */}
                            <div className="flex gap-1 md:gap-2">
                                {Array.from(
                                    { length: leaderboards.last_page },
                                    (_, i) => i + 1
                                )
                                    .filter((page) => {
                                        const current =
                                            leaderboards.current_page;
                                        return (
                                            page === 1 ||
                                            page === leaderboards.last_page ||
                                            (page >= current - 1 &&
                                                page <= current + 1)
                                        );
                                    })
                                    .map((page, index, array) => {
                                        if (
                                            index > 0 &&
                                            array[index - 1] !== page - 1
                                        ) {
                                            return (
                                                <React.Fragment
                                                    key={`ellipsis-${page}`}
                                                >
                                                    <span className="px-2 py-2 text-[#69747C] text-sm">
                                                        ...
                                                    </span>
                                                    <button
                                                        onClick={() =>
                                                            handlePageChange(
                                                                leaderboards.path +
                                                                    "?page=" +
                                                                    page
                                                            )
                                                        }
                                                        className={`px-3 md:px-4 py-2 rounded-lg font-semibold transition-all duration-300 text-sm md:text-base ${
                                                            page ===
                                                            leaderboards.current_page
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
                                                        leaderboards.path +
                                                            "?page=" +
                                                            page
                                                    )
                                                }
                                                className={`px-3 md:px-4 py-2 rounded-lg font-semibold transition-all duration-300 text-sm md:text-base ${
                                                    page ===
                                                    leaderboards.current_page
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
                                onClick={() =>
                                    handlePageChange(leaderboards.next_page_url)
                                }
                                disabled={!leaderboards.next_page_url}
                                className="px-3 md:px-4 py-2 bg-[#0D0C0C]/80 border border-[#69747C]/30 rounded-lg text-[#F2F2F2] hover:border-[#FF2146] disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-300 flex items-center gap-1 md:gap-2 text-sm md:text-base"
                            >
                                Next
                                <ChevronRight size={18} />
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <style
                dangerouslySetInnerHTML={{
                    __html: `
                    @keyframes slideDown {
                        from {
                            max-height: 0;
                            opacity: 0;
                        }
                        to {
                            max-height: 100px;
                            opacity: 1;
                        }
                    }
                    .animate-slideDown {
                        animation: slideDown 0.3s ease-out forwards;
                    }
                `,
                }}
            />
        </AppLayout>
    );
};

export default LeaderboardIndex;
