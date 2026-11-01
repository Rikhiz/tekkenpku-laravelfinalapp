import React, { useState } from "react";
import AppLayout from "@/Layouts/AppLayout";
import { router } from "@inertiajs/react";
import logo from "@/images/logosss.png";
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
    mostover8,
    mostover4,
    availableSeasons = [],
    selectedSeason,
    finalsChampion,
    board = 'normal'
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
        if (category === 1) return { color: "bg-yellow-500", text: "FINALS" };
        if (category === 2) return { color: "bg-red-500", text: "PRIME" };
        if (category === 3) return { color: "bg-blue-500", text: "CORE" };
        if (category === 4) return { color: "bg-green-500", text: "BIT" };
        if (category === 5) return { color: "bg-purple-500", text: "SCOUT" };
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
            router.visit(url, { preserveState: true, preserveScroll: true });
        }
    };

    const getPageUrl = (pageNumber) => {
        const params = new URLSearchParams();
        if (selectedSeason !== undefined && selectedSeason !== null && selectedSeason !== "") {
            params.set("season", selectedSeason);
        }
        if (board) {
            params.set("board", board);
        }
        params.set("page", pageNumber);
        return `/leaderboards?${params.toString()}`;
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
                        <h1 className="flex items-center justify-center gap-3 md:gap-4 text-5xl md:text-6xl font-black bg-gradient-to-r from-[#C23B69] to-[#E57A9D] bg-clip-text text-transparent">
                            <Award className="w-12 h-12 md:w-16 md:h-16 text-[#C23B69] drop-shadow-2xl" />
                            LEADERBOARD
                        </h1>
                        <p className="text-[#69747C] text-lg">
                            Top Players Ranking For Super Smash Society League
                        </p>
                        
                        {/* Season Selection UI */}
                        <div className="flex justify-center flex-wrap gap-4 mt-8">
                            {availableSeasons.map((season) => (
                                <button
                                    key={season}
                                    onClick={() => router.visit(`/leaderboards?season=${season}&board=${board}`, { preserveState: true, preserveScroll: true })}
                                    className={`relative group overflow-hidden rounded-xl border-2 transition-all duration-300 w-28 md:w-36 h-10 md:h-12 ${
                                        parseInt(selectedSeason) === parseInt(season)
                                            ? "border-[#C23B69] shadow-[0_0_15px_rgba(255,33,70,0.5)] scale-105"
                                            : "border-[#69747C]/30 hover:border-[#C23B69]/50"
                                    }`}
                                >
                                    <img
                                        src={logo}
                                        alt="Season Logo"
                                        className="absolute inset-0 w-full h-full object-cover object-center opacity-40 group-hover:opacity-70 transition-opacity"
                                    />
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <span
                                            className={`font-black text-sm md:text-base drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)] ${
                                                parseInt(selectedSeason) === parseInt(season)
                                                    ? "text-white"
                                                    : "text-gray-300 group-hover:text-white"
                                            }`}
                                        >
                                            SEASON {season}
                                        </span>
                                    </div>
                                </button>
                            ))}
                        </div>
                        
                        {/* Finals Champion Banner */}
                        {finalsChampion && (
                            <div className="mt-8 animate-slideDownFull">
                                <div className="bg-gradient-to-r from-yellow-500/20 via-yellow-400/10 to-yellow-500/20 border border-yellow-500/50 rounded-2xl p-6 md:p-8 relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 p-4 opacity-20">
                                        <Trophy size={100} className="text-yellow-400 transform rotate-12" />
                                    </div>
                                    <h2 className="text-sm md:text-lg font-bold text-yellow-400 mb-2 uppercase tracking-widest">
                                        SEASON {selectedSeason} CHAMPION
                                    </h2>
                                    <div className="flex items-center justify-center gap-4">
                                        <div className="text-5xl md:text-7xl font-black text-white drop-shadow-[0_0_10px_rgba(250,204,21,0.5)]">
                                            {finalsChampion.user?.name}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Leaderboard Type Toggle */}
                <div className="max-w-xs mx-auto mt-6 flex p-1 bg-[#1a1a1a] rounded-lg border border-[#69747C]/30 shadow-inner">
                    <button
                        onClick={() => router.visit(`/leaderboards?season=${selectedSeason}&board=normal`, { preserveScroll: true, preserveState: true })}
                        className={`flex-1 py-1.5 px-2 rounded font-bold text-xs transition-all duration-300 ${
                            board === 'normal'
                                ? 'bg-[#C23B69] text-white shadow-md shadow-[#C23B69]/30'
                                : 'text-[#69747C] hover:text-white'
                        }`}
                    >
                        Reguler Leaderboard
                    </button>
                    <button
                        onClick={() => router.visit(`/leaderboards?season=${selectedSeason}&board=scout`, { preserveScroll: true, preserveState: true })}
                        className={`flex-1 py-1.5 px-2 rounded font-bold text-xs transition-all duration-300 ${
                            board === 'scout'
                                ? 'bg-purple-600 text-white shadow-md shadow-purple-500/30'
                                : 'text-[#69747C] hover:text-white'
                        }`}
                    >
                        Scout Leaderboard
                    </button>
                </div>

                {/* Stats Footer */}
                {leaderboards.data.length > 0 && (
                    <>
                        <div className="max-w-7xl mx-auto mt-12 grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-[#0D0C0C]/80 border border-[#69747C]/30 rounded-xl p-6 text-center hover:border-[#C23B69]/50 transition-all">
                                <div className="text-2xl md:text-3xl font-black bg-gradient-to-r from-[#C23B69] to-[#E57A9D] bg-clip-text text-transparent truncate">
                                    {mostover8?.user?.name || "-"}
                                </div>
                                <div className="text-[#69747C] font-semibold mt-2">
                                    Most Top 8
                                </div>
                            </div>
                            <div className="bg-[#0D0C0C]/80 border border-[#69747C]/30 rounded-xl p-6 text-center hover:border-[#C23B69]/50 transition-all">
                                <div className="text-2xl md:text-3xl font-black bg-gradient-to-r from-[#C23B69] to-[#E57A9D] bg-clip-text text-transparent truncate">
                                    {mostover4?.user?.name || "-"}
                                </div>
                                <div className="text-[#69747C] font-semibold mt-2">
                                    Most Total Events Played
                                </div>
                            </div>
                        </div>
                        <br />
                    </>
                )}

                {/* Leaderboard Container */}
                <div className="max-w-7xl mx-auto">
                    {leaderboards.data.length > 0 ? (
                        <div className="space-y-4">
                            {leaderboards.data.map((player) => {
                                const mainPoints = board === 'scout' ? player.scout || 0 : player.total_points || 0;
                                const highestPoints = board === 'scout' ? (leaderboards.data[0]?.scout || 1) : (leaderboards.data[0]?.total_points || 1);
                                const percentage = Math.min((mainPoints / highestPoints) * 100, 100);
                            const isExpanded = isPlayerExpanded(player.id);
                            const isTopThree = player.rank <= 3;
                            const barHeight = isTopThree ? "h-28" : "h-20";

                            return (
                                <div key={player.id} className="relative group">
                                    <div
                                        className={`relative bg-[#0D0C0C]/80 border border-[#69747C]/30 rounded-xl transition-all duration-300 hover:border-[#C23B69]/50 hover:shadow-lg hover:shadow-[#C23B69]/20 ${barHeight} ${
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
                                                <div className="absolute bottom-0 left-0 right-0 bg-[#C23B69]/90 text-white text-center py-1 text-xs font-semibold animate-slideUp rounded-b-xl">
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
                                                    className={`font-black bg-gradient-to-r ${board === 'scout' ? 'from-purple-500' : 'from-[#C23B69]'} to-[#E57A9D] bg-clip-text text-transparent ${
                                                        isTopThree
                                                            ? "text-2xl md:text-4xl"
                                                            : "text-xl md:text-3xl"
                                                    }`}
                                                >
                                                    {mainPoints}
                                                </div>
                                                <div className="text-[10px] md:text-xs text-[#69747C] font-medium">
                                                    POINTS
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Expanded Details - Dropdown Below */}
                                    {isExpanded && (
                                        <div className="bg-gradient-to-br from-[#0D0C0C] to-[#1a1a1a] rounded-b-xl border-x-2 border-b-2 border-[#C23B69] shadow-2xl overflow-hidden animate-slideDownFull">
                                            {/* Single Row Layout */}
                                            <div className="p-3 md:p-4">
                                                <div className="flex flex-col lg:flex-row gap-3 md:gap-4 ">
                                                    {/* Points Summary - Right Side - Horizontal */}
                                                    <div className="flex-shrink-0 order-1 lg:order-2 ">
                                                        <h4 className="text-xs font-bold text-[#F2F2F2] mb-2 flex items-center gap-1">
                                                            <Trophy
                                                                size={12}
                                                                className="text-[#C23B69]"
                                                            />
                                                            Points
                                                        </h4>
                                                        <div className="flex gap-2">
                                                            {/* Finals */}
                                                            <div className="bg-[#0D0C0C]/60 border border-yellow-500/30 rounded-lg p-2 w-16 md:w-20 lg:w-24 h-[90px] md:h-[116px] flex flex-col justify-between">
                                                                <div className="text-[8px] text-[#69747C] font-bold uppercase truncate text-center">FINALS</div>
                                                                <div className="text-lg md:text-3xl font-black text-yellow-500 leading-none text-center">{player.finals}</div>
                                                                <div className="text-[8px] text-[#69747C] text-center">{player.counted_finals_events}/{player.total_finals_events}</div>
                                                            </div>
                                                            
                                                            {/* Prime */}
                                                            <div className="bg-[#0D0C0C]/60 border border-red-500/30 rounded-lg p-2 w-16 md:w-20 lg:w-24 h-[90px] md:h-[116px] flex flex-col justify-between">
                                                                <div className="text-[8px] text-[#69747C] font-bold uppercase truncate text-center">PRIME</div>
                                                                <div className="text-lg md:text-3xl font-black text-red-500 leading-none text-center">{player.prime}</div>
                                                                <div className="text-[8px] text-[#69747C] text-center">{player.counted_prime_events}/{player.total_prime_events}</div>
                                                            </div>

                                                            {/* Core */}
                                                            <div className="bg-[#0D0C0C]/60 border border-blue-500/30 rounded-lg p-2 w-16 md:w-20 lg:w-24 h-[90px] md:h-[116px] flex flex-col justify-between">
                                                                <div className="text-[8px] text-[#69747C] font-bold uppercase truncate text-center">CORE</div>
                                                                <div className="text-lg md:text-3xl font-black text-blue-500 leading-none text-center">{player.core}</div>
                                                                <div className="text-[8px] text-[#69747C] text-center">{player.counted_core_events}/{player.total_core_events}</div>
                                                            </div>

                                                            {/* Bit */}
                                                            <div className="bg-[#0D0C0C]/60 border border-green-500/30 rounded-lg p-2 w-16 md:w-20 lg:w-24 h-[90px] md:h-[116px] flex flex-col justify-between">
                                                                <div className="text-[8px] text-[#69747C] font-bold uppercase truncate text-center">BIT</div>
                                                                <div className="text-lg md:text-3xl font-black text-green-500 leading-none text-center">{player.bit}</div>
                                                                <div className="text-[8px] text-[#69747C] text-center">{player.counted_bit_events}/{player.total_bit_events}</div>
                                                            </div>

                                                            {/* Scout */}
                                                            <div className="bg-[#0D0C0C]/60 border border-purple-500/30 rounded-lg p-2 w-16 md:w-20 lg:w-24 h-[90px] md:h-[116px] flex flex-col justify-between">
                                                                <div className="text-[8px] text-[#69747C] font-bold uppercase truncate text-center">SCOUT</div>
                                                                <div className="text-lg md:text-3xl font-black text-purple-500 leading-none text-center">{player.scout}</div>
                                                                <div className="text-[8px] text-[#69747C] text-center">{player.counted_scout_events}/{player.total_scout_events}</div>
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
                                                                        className="text-[#C23B69]"
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
                                                                                    className="flex-shrink-0 bg-[#0D0C0C]/60 border border-[#69747C]/20 rounded-lg p-2 hover:border-[#C23B69]/40 transition-all cursor-pointer hover:scale-95 w-20"
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
                    ) : (
                        <div className="flex flex-col items-center justify-center py-20 text-center">
                            <Trophy className="w-20 h-20 text-[#69747C]/50 mb-6" />
                            <h2 className="text-2xl font-bold text-[#F2F2F2] mb-2">No Rankings Yet</h2>
                            <p className="text-[#69747C] max-w-md">
                                There are currently no players on the {board === 'scout' ? 'Scout Leaderboard' : 'Leaderboard'} for this season. Complete tournaments to see the rankings!
                            </p>
                        </div>
                    )}

                    {/* Pagination - Modified for array data */}
                    {leaderboards.data && leaderboards.data.length > 0 && leaderboards.last_page > 1 && (
                        <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
                            {/* Previous Button */}
                            <button
                                onClick={() =>
                                    handlePageChange(leaderboards.prev_page_url)
                                }
                                disabled={!leaderboards.prev_page_url}
                                className="px-3 md:px-4 py-2 bg-[#0D0C0C]/80 border border-[#69747C]/30 rounded-lg text-[#F2F2F2] hover:border-[#C23B69] disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-300 flex items-center gap-1 md:gap-2 text-sm md:text-base"
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
                                                                getPageUrl(page)
                                                            )
                                                        }
                                                        className={`px-3 md:px-4 py-2 rounded-lg font-semibold transition-all duration-300 text-sm md:text-base ${
                                                            page ===
                                                            leaderboards.current_page
                                                                ? "bg-gradient-to-r from-[#C23B69] to-[#E57A9D] text-white"
                                                                : "bg-[#0D0C0C]/80 border border-[#69747C]/30 text-[#F2F2F2] hover:border-[#C23B69]"
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
                                                        getPageUrl(page)
                                                    )
                                                }
                                                className={`px-3 md:px-4 py-2 rounded-lg font-semibold transition-all duration-300 text-sm md:text-base ${
                                                    page ===
                                                    leaderboards.current_page
                                                        ? "bg-gradient-to-r from-[#C23B69] to-[#E57A9D] text-white"
                                                        : "bg-[#0D0C0C]/80 border border-[#69747C]/30 text-[#F2F2F2] hover:border-[#C23B69]"
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
                                className="px-3 md:px-4 py-2 bg-[#0D0C0C]/80 border border-[#69747C]/30 rounded-lg text-[#F2F2F2] hover:border-[#C23B69] disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-300 flex items-center gap-1 md:gap-2 text-sm md:text-base"
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
                        background: #C23B69;
                        border-radius: 10px;
                    }
                    .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                        background: #E57A9D;
                    }
                `,
                }}
            />
        </AppLayout>
    );
};

export default LeaderboardIndex;

