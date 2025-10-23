// resources/js/Pages/Profile/Index.jsx
import React from "react";
import AppLayout from "@/Layouts/AppLayout";
import { router, Head } from "@inertiajs/react";
import { 
    Trophy, 
    Medal, 
    TrendingUp, 
    Calendar, 
    Award,
    Flame,
    Target,
    Zap
} from "lucide-react";

const ProfileIndex = ({ tournaments = [], stats = {}, leaderboardStats = null, auth }) => {
    const user = auth.user;

    const getMedalColor = (placement) => {
        if (placement === 1) return "text-yellow-400";
        if (placement === 2) return "text-gray-400";
        if (placement === 3) return "text-orange-400";
        return "text-[#69747C]";
    };

    const getMedalEmoji = (placement) => {
        if (placement === 1) return "🥇";
        if (placement === 2) return "🥈";
        if (placement === 3) return "🥉";
        return `#${placement}`;
    };

    const formatDate = (dateString) => {
        if (!dateString) return "TBA";
        const date = new Date(dateString);
        return date.toLocaleDateString("id-ID", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    const handleTournamentClick = (urlStartgg) => {
        router.visit(`/tournaments/${urlStartgg}`);
    };

    return (
        <>
            <Head title={`${user.name} - Profile`} />
            
            <AppLayout>
                <div className="min-h-screen bg-gradient-to-b from-[#0D0C0C] via-[#0D0C0C] to-[#1a1a1a] pt-24 pb-12 px-4 sm:px-6 lg:px-8">
                    {/* Background Effects */}
                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                        <div className="absolute top-20 left-10 w-72 h-72 bg-[#FF2146]/10 rounded-full blur-3xl animate-pulse"></div>
                        <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#F2AF29]/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
                    </div>

                    <div className="relative max-w-7xl mx-auto">
                        {/* Profile Header */}
                        <div className="mb-8">
                            <div className="flex flex-col md:flex-row items-center md:items-start gap-6 bg-gradient-to-br from-[#0D0C0C]/90 to-[#69747C]/20 backdrop-blur-xl border border-[#69747C]/30 rounded-2xl p-6 md:p-8">
                                {/* Avatar */}
                                <div className="relative">
                                    <img
                                        src={user.avatar}
                                        alt={user.name}
                                        className="w-32 h-32 md:w-40 md:h-40 rounded-2xl object-cover border-4 border-[#FF2146]/50 shadow-2xl"
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&size=256&background=FF2146&color=F2F2F2&bold=true`;
                                        }}
                                    />
                                    {user.role === 'admin' && (
                                        <div className="absolute -bottom-2 -right-2 bg-[#F2AF29] text-[#0D0C0C] rounded-full p-2 border-2 border-[#0D0C0C]">
                                            <Award className="w-5 h-5" />
                                        </div>
                                    )}
                                </div>

                                {/* User Info */}
                                <div className="flex-1 text-center md:text-left">
                                    <h1 className="text-3xl md:text-4xl font-black bg-gradient-to-r from-[#FF2146] to-[#F2AF29] bg-clip-text text-transparent mb-2">
                                        {user.name}
                                    </h1>
                                    <div className="flex flex-wrap justify-center md:justify-start gap-2 mb-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                            user.role === 'admin' 
                                                ? 'bg-[#F2AF29]/20 text-[#F2AF29] border border-[#F2AF29]/30' 
                                                : 'bg-[#FF2146]/20 text-[#FF2146] border border-[#FF2146]/30'
                                        }`}>
                                            {user.role === 'admin' ? '👑 Admin' : '🎮 Player'}
                                        </span>
                                        {user.sgguserid && (
                                            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#69747C]/20 text-[#69747C] border border-[#69747C]/30">
                                                SGG ID: {user.sgguserid}
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-[#69747C] text-sm">
                                        {user.email || 'No email provided'}
                                    </p>
                                </div>

                                {/* Leaderboard Stats - Quick View */}
                                {leaderboardStats && (
                                    <div className="bg-[#0D0C0C]/50 border border-[#69747C]/30 rounded-xl p-4 min-w-[200px]">
                                        <div className="text-center">
                                            <div className="text-3xl font-black bg-gradient-to-r from-[#FF2146] to-[#F2AF29] bg-clip-text text-transparent">
                                                {leaderboardStats.total_points}
                                            </div>
                                            <div className="text-xs text-[#69747C] mt-1">Total Points</div>
                                        </div>
                                        <div className="grid grid-cols-3 gap-2 mt-3 text-center">
                                            <div>
                                                <div className="text-sm font-bold text-red-400">{leaderboardStats.major}</div>
                                                <div className="text-xs text-[#69747C]">Major</div>
                                            </div>
                                            <div>
                                                <div className="text-sm font-bold text-blue-400">{leaderboardStats.minor}</div>
                                                <div className="text-xs text-[#69747C]">Minor</div>
                                            </div>
                                            <div>
                                                <div className="text-sm font-bold text-green-400">{leaderboardStats.mini}</div>
                                                <div className="text-xs text-[#69747C]">Mini</div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                            <div className="bg-gradient-to-br from-[#0D0C0C]/90 to-[#69747C]/20 backdrop-blur-xl border border-[#69747C]/30 rounded-xl p-4 hover:border-[#FF2146]/50 transition-all duration-300">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="p-2 bg-[#FF2146]/20 rounded-lg">
                                        <Trophy className="w-5 h-5 text-[#FF2146]" />
                                    </div>
                                    <div className="text-2xl font-black text-[#F2F2F2]">
                                        {stats.total_tournaments}
                                    </div>
                                </div>
                                <div className="text-xs text-[#69747C]">Total Tournaments</div>
                            </div>

                            <div className="bg-gradient-to-br from-[#0D0C0C]/90 to-[#69747C]/20 backdrop-blur-xl border border-[#69747C]/30 rounded-xl p-4 hover:border-[#F2AF29]/50 transition-all duration-300">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="p-2 bg-yellow-400/20 rounded-lg">
                                        <Medal className="w-5 h-5 text-yellow-400" />
                                    </div>
                                    <div className="text-2xl font-black text-[#F2F2F2]">
                                        {stats.total_wins}
                                    </div>
                                </div>
                                <div className="text-xs text-[#69747C]">1st Place Wins</div>
                            </div>

                            <div className="bg-gradient-to-br from-[#0D0C0C]/90 to-[#69747C]/20 backdrop-blur-xl border border-[#69747C]/30 rounded-xl p-4 hover:border-[#FF2146]/50 transition-all duration-300">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="p-2 bg-orange-400/20 rounded-lg">
                                        <Flame className="w-5 h-5 text-orange-400" />
                                    </div>
                                    <div className="text-2xl font-black text-[#F2F2F2]">
                                        {stats.podium_finishes}
                                    </div>
                                </div>
                                <div className="text-xs text-[#69747C]">Podium Finishes</div>
                            </div>

                            <div className="bg-gradient-to-br from-[#0D0C0C]/90 to-[#69747C]/20 backdrop-blur-xl border border-[#69747C]/30 rounded-xl p-4 hover:border-[#F2AF29]/50 transition-all duration-300">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="p-2 bg-[#F2AF29]/20 rounded-lg">
                                        <Target className="w-5 h-5 text-[#F2AF29]" />
                                    </div>
                                    <div className="text-2xl font-black text-[#F2F2F2]">
                                        {stats.average_placement ? stats.average_placement.toFixed(1) : 'N/A'}
                                    </div>
                                </div>
                                <div className="text-xs text-[#69747C]">Avg. Placement</div>
                            </div>
                        </div>

                        {/* Tournament History */}
                        <div className="bg-gradient-to-br from-[#0D0C0C]/90 to-[#69747C]/20 backdrop-blur-xl border border-[#69747C]/30 rounded-2xl p-6 md:p-8">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-black text-[#F2F2F2] flex items-center gap-2">
                                    <TrendingUp className="w-6 h-6 text-[#FF2146]" />
                                    Tournament History
                                </h2>
                                <div className="text-sm text-[#69747C]">
                                    {tournaments.length} {tournaments.length === 1 ? 'Event' : 'Events'}
                                </div>
                            </div>

                            {tournaments.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {tournaments.map((tournament) => (
                                        <button
                                            key={tournament.id}
                                            onClick={() => handleTournamentClick(tournament.url_startgg)}
                                            className="group relative bg-[#0D0C0C]/50 border border-[#69747C]/30 rounded-xl overflow-hidden hover:border-[#FF2146]/50 transition-all duration-300 hover:transform hover:scale-[1.02] text-left"
                                        >
                                            {/* Image */}
                                            <div className="relative h-40 overflow-hidden">
                                                <img
                                                    src={tournament.image_url || 'https://placehold.co/600x400?text=Tournament'}
                                                    alt={tournament.name}
                                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-[#0D0C0C] via-[#0D0C0C]/60 to-transparent"></div>
                                                
                                                {/* Placement Badge */}
                                                {tournament.placement && (
                                                    <div className="absolute top-3 right-3 bg-[#0D0C0C]/90 backdrop-blur-md border border-[#69747C]/30 rounded-full px-3 py-1.5 flex items-center gap-1.5">
                                                        <span className={`text-lg ${getMedalColor(tournament.placement)}`}>
                                                            {getMedalEmoji(tournament.placement)}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Content */}
                                            <div className="p-4">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <span className={`${tournament.category_bg} ${tournament.category_color} border border-current rounded-full px-2 py-0.5 text-xs font-semibold`}>
                                                        {tournament.category_name}
                                                    </span>
                                                    <span className={`${tournament.status_color} border rounded-full px-2 py-0.5 text-xs font-semibold`}>
                                                        {tournament.status}
                                                    </span>
                                                </div>

                                                <h3 className="text-[#F2F2F2] font-bold text-sm mb-2 line-clamp-2 group-hover:text-[#FF2146] transition-colors">
                                                    {tournament.name}
                                                </h3>

                                                <div className="flex items-center gap-2 text-xs text-[#69747C]">
                                                    <Calendar className="w-3 h-3" />
                                                    <span>{formatDate(tournament.start_date)}</span>
                                                </div>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-12">
                                    <div className="inline-flex items-center justify-center w-16 h-16 bg-[#69747C]/10 rounded-full mb-4">
                                        <Trophy className="w-8 h-8 text-[#69747C]" />
                                    </div>
                                    <h3 className="text-[#F2F2F2] font-bold text-lg mb-2">
                                        No Tournaments Yet
                                    </h3>
                                    <p className="text-[#69747C] text-sm max-w-md mx-auto">
                                        Start competing in tournaments to build your history and climb the leaderboard!
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </AppLayout>
        </>
    );
};

export default ProfileIndex;