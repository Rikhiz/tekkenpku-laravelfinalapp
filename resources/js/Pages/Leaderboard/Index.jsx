import React, { useState } from "react";
import AppLayout from "@/Layouts/AppLayout";
import { router } from "@inertiajs/react";
import {
    Trophy,
    Medal,
    Award,
    ChevronLeft,
    ChevronRight,
    Star,
    Calendar,
    Users,
    Target,
} from "lucide-react";

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
        if (rank === 3) return <Star className="text-orange-400" size={28} />;
        return null;
    };

    const getCategoryBadge = (category) => {
        if (category === 1) return { color: "bg-red-500", text: "MAJOR" };
        if (category === 2) return { color: "bg-blue-500", text: "MINOR" };
        if (category === 3) return { color: "bg-green-500", text: "MINI" };
        return { color: "bg-gray-400", text: "UNKNOWN" };
    };

    const getPlacementColor = (placement) => {
        if (placement === 1) return "text-yellow-400 font-black";
        if (placement === 2) return "text-gray-300 font-bold";
        if (placement === 3) return "text-orange-400 font-bold";
        if (placement <= 4) return "text-blue-400 font-semibold";
        if (placement <= 8) return "text-green-400 font-semibold";
        return "text-gray-400";
    };

    const handlePageChange = (url) => {
        if (url) {
            router.visit(url);
        }
    };

    const handlePlayerClick = (playerId) => {
        setExpandedPlayer(expandedPlayer === playerId ? null : playerId);
    };

    const handleTournamentClick = (urlStartgg, e) => {
        e.stopPropagation();
        router.visit(`/tournaments/${urlStartgg}`);
    };

    const isPlayerExpanded = (playerId) => {
        return expandedPlayer === playerId;
    };
    

    return (
        <AppLayout>
            <div className="min-h-screen bg-gradient-to-br from-[#0D0C0C] via-[#0D0C0C] to-[#69747C]/20 py-12 px-4 sm:px-6 lg:px-8">
                {/* Header Section */}
                <br />
                <br />
                <br />
                <br />
                <br />
                <div className="max-w-7xl mx-auto mb-12">
                    <div className="text-center space-y-4">
                        <h1 className="flex items-center justify-center gap-3 md:gap-4 text-5xl md:text-6xl font-black bg-gradient-to-r from-[#FF2146] to-[#F2AF29] bg-clip-text text-transparent">
                            <Award className="w-12 h-12 md:w-16 md:h-16 text-[#FF2146] drop-shadow-2xl" />
                            LEADERBOARD
                        </h1>
                        <p className="text-[#69747C] text-lg">
                            Top Players Ranking For Super Smash Society League
                        </p>
                    </div>
                </div>

                {/* Stats Footer */}
                <div className="max-w-7xl mx-auto mt-12 grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-[#0D0C0C]/80 border border-[#69747C]/30 rounded-xl p-6 text-center hover:border-[#FF2146]/50 transition-all">
                        <div className="text-4xl font-black bg-gradient-to-r from-[#FF2146] to-[#F2AF29] bg-clip-text text-transparent">
                            {leaderboards.total|| "N/A"}
                        </div>
                        <div className="text-[#69747C] font-semibold mt-2">
                            Total Players
                        </div>
                    </div>
                    <div className="bg-[#0D0C0C]/80 border border-[#69747C]/30 rounded-xl p-6 text-center hover:border-[#FF2146]/50 transition-all">
                        <div className="text-2xl md:text-3xl font-black bg-gradient-to-r from-[#FF2146] to-[#F2AF29] bg-clip-text text-transparent truncate">
                            {mostover8.user?.name || "N/A"}
                        </div>
                        <div className="text-[#69747C] font-semibold mt-2">
                            Most Top 8
                        </div>
                    </div>
                    <div className="bg-[#0D0C0C]/80 border border-[#69747C]/30 rounded-xl p-6 text-center hover:border-[#FF2146]/50 transition-all">
                        <div className="text-2xl md:text-3xl font-black bg-gradient-to-r from-[#FF2146] to-[#F2AF29] bg-clip-text text-transparent truncate">
                            {mostover4.user?.name || "N/A"}
                        </div>
                        <div className="text-[#69747C] font-semibold mt-2">
                            Most Top 4
                        </div>
                    </div>
                    <div className="bg-[#0D0C0C]/80 border border-[#69747C]/30 rounded-xl p-6 text-center hover:border-[#FF2146]/50 transition-all">
                        <div className="text-4xl font-black bg-gradient-to-r from-[#FF2146] to-[#F2AF29] bg-clip-text text-transparent">
                            {tourtotal || "N/A"}
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
                                <div key={player.id} className="relative group">
                                    <div
                                        className={`relative bg-[#0D0C0C]/80 border border-[#69747C]/30 rounded-xl transition-all duration-300 hover:border-[#FF2146]/50 hover:shadow-lg hover:shadow-[#FF2146]/20 ${barHeight} ${
                                            isExpanded ? "rounded-b-none" : ""
                                        } cursor-pointer overflow-hidden`}
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
                                        {/* Hover hint */}
                                        {hoveredPlayer === player.id &&
                                            !isExpanded && (
                                                <div className="absolute bottom-0 left-0 right-0 bg-[#FF2146]/90 text-white text-center py-1 text-xs font-semibold animate-slideUp rounded-b-xl">
                                                    👆 Click to see details
                                                </div>
                                            )}

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

                                    {/* Expanded Details - Dropdown Below */}
                                    {isExpanded && (
                                        <div className="bg-gradient-to-br from-[#0D0C0C] to-[#1a1a1a] rounded-b-xl border-x-2 border-b-2 border-[#FF2146] shadow-2xl overflow-hidden animate-slideDownFull">
                                            {/* Single Row Layout */}
                                            <div className="p-3 md:p-4">
                                                <div className="flex flex-col lg:flex-row gap-3 md:gap-4 ">
                                                    {/* Points Summary - Right Side - Horizontal */}
                                                    <div className="flex-shrink-0 order-1 lg:order-2 ">
                                                        <h4 className="text-xs font-bold text-[#F2F2F2] mb-2 flex items-center gap-1">
                                                            <Trophy
                                                                size={12}
                                                                className="text-[#FF2146]"
                                                            />
                                                            Points
                                                        </h4>
                                                        <div className="flex gap-2">
                                                            {/* Major */}
                                                            <div className="bg-[#0D0C0C]/60 border border-red-500/30 rounded-lg p-2 w-24 h-[90px] md:h-[116px] flex flex-col justify-between">
                                                                <div className="text-[8px] text-[#69747C] font-bold uppercase">
                                                                    MAJOR
                                                                </div>
                                                                <div className="text-2xl md:text-3xl font-black text-red-500 leading-none text-center">
                                                                    {
                                                                        player.major
                                                                    }
                                                                </div>
                                                                <div className="text-[8px] text-[#69747C] text-center">
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
                                                            <div className="bg-[#0D0C0C]/60 border border-blue-500/30 rounded-lg p-2 w-24 h-[90px] md:h-[116px] flex flex-col justify-between">
                                                                <div className="text-[8px] text-[#69747C] font-bold uppercase">
                                                                    MINOR
                                                                </div>
                                                                <div className="text-3xl font-black text-blue-500 leading-none text-center">
                                                                    {
                                                                        player.minor
                                                                    }
                                                                </div>
                                                                <div className="text-[8px] text-[#69747C] text-center">
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
                                                            <div className="bg-[#0D0C0C]/60 border border-green-500/30 rounded-lg p-2 w-24 h-[90px] md:h-[116px] flex flex-col justify-between">
                                                                <div className="text-[8px] text-[#69747C] font-bold uppercase">
                                                                    MINI
                                                                </div>
                                                                <div className="text-3xl font-black text-green-500 leading-none text-center">
                                                                    {
                                                                        player.mini
                                                                    }
                                                                </div>
                                                                <div className="text-[8px] text-[#69747C] text-center">
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

                                                    {/* Tournament History - Horizontal Scroll */}
                                                    <div className="flex-1 min-w-0">
                                                        {player.tournaments &&
                                                        player.tournaments
                                                            .length > 0 ? (
                                                            <>
                                                                <h4 className="text-xs font-bold text-[#F2F2F2] mb-2 flex items-center gap-1">
                                                                    <Target
                                                                        size={
                                                                            12
                                                                        }
                                                                        className="text-[#FF2146]"
                                                                    />
                                                                    Tournament
                                                                    History
                                                                </h4>
                                                                <div className="flex gap-2 overflow-x-auto custom-scrollbar pb-2">
                                                                    {player.tournaments.map(
                                                                        (
                                                                            tournament,
                                                                            index
                                                                        ) => {
                                                                            const categoryBadge =
                                                                                getCategoryBadge(
                                                                                    tournament.category
                                                                                );
                                                                            return (
                                                                                <div
                                                                                    key={
                                                                                        index
                                                                                    }
                                                                                    className="flex-shrink-0 bg-[#0D0C0C]/60 border border-[#69747C]/20 rounded-lg p-2 hover:border-[#FF2146]/40 transition-all cursor-pointer hover:scale-95 w-20"
                                                                                    onClick={(
                                                                                        e
                                                                                    ) =>
                                                                                        handleTournamentClick(
                                                                                            tournament.url_startgg,
                                                                                            e
                                                                                        )
                                                                                    }
                                                                                >
                                                                                    {/* Category Badge */}
                                                                                    <span
                                                                                        className={`text-[8px] px-1 py-0.5 rounded ${categoryBadge.color} text-white font-bold block w-fit mb-1`}
                                                                                    >
                                                                                        {
                                                                                            categoryBadge.text
                                                                                        }
                                                                                    </span>

                                                                                    {/* Tournament Name */}
                                                                                    <h5 className="text-[9px] font-semibold text-[#F2F2F2] mb-1 line-clamp-2 leading-tight h-7 truncate">
                                                                                        {
                                                                                            tournament.tournament_name
                                                                                        }
                                                                                    </h5>

                                                                                    {/* Placement */}
                                                                                    <div
                                                                                        className={`text-xl font-black text-center mb-1 ${getPlacementColor(
                                                                                            tournament.placement
                                                                                        )}`}
                                                                                    >
                                                                                        #
                                                                                        {
                                                                                            tournament.placement
                                                                                        }
                                                                                    </div>

                                                                                    {/* Date */}
                                                                                    <div className="text-[8px] text-[#69747C] text-center truncate">
                                                                                        {tournament.start_date &&
                                                                                            new Date(
                                                                                                tournament.start_date
                                                                                            ).toLocaleDateString(
                                                                                                "en-US",
                                                                                                {
                                                                                                    month: "short",
                                                                                                    day: "numeric",
                                                                                                }
                                                                                            )}
                                                                                    </div>
                                                                                </div>
                                                                            );
                                                                        }
                                                                    )}
                                                                </div>
                                                            </>
                                                        ) : (
                                                            <div className="text-center text-[#69747C] text-xs py-4">
                                                                No tournament
                                                                history
                                                                available
                                                            </div>
                                                        )}
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
                            transform: translateY(-10px);
                            opacity: 0;
                        }
                        to {
                            transform: translateY(0);
                            opacity: 1;
                        }
                    }
                    
                    @keyframes slideDownFull {
                        from {
                            max-height: 0;
                            opacity: 0;
                        }
                        to {
                            max-height: 300px;
                            opacity: 1;
                        }
                    }
                    
                    .animate-slideDown {
                        animation: slideDown 0.3s ease-out forwards;
                    }
                    
                    .animate-slideDownFull {
                        animation: slideDownFull 0.4s ease-out forwards;
                    }
                    
                    .custom-scrollbar::-webkit-scrollbar {
                        height: 4px;
                        width: 4px;
                    }
                    .custom-scrollbar::-webkit-scrollbar-track {
                        background: #0D0C0C;
                        border-radius: 10px;
                    }
                    .custom-scrollbar::-webkit-scrollbar-thumb {
                        background: #FF2146;
                        border-radius: 10px;
                    }
                    .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                        background: #F2AF29;
                    }
                `,
                }}
            />
        </AppLayout>
    );
};

export default LeaderboardIndex;
