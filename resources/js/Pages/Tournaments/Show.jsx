import React, { useMemo } from "react";
import AppLayout from "@/Layouts/AppLayout";
import { Trophy, Calendar, Users, Award, DollarSign, Youtube, ExternalLink, ArrowLeft, Medal } from "lucide-react";
import { router } from "@inertiajs/react";

const TournamentShow = ({ tournament }) => {
    const formatCurrency = (amount) => {
        if (!amount) return "TBA";
        if (typeof amount === "string" && amount.includes("Rp")) {
            return amount;
        }
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(amount);
    };

    const formatDate = (dateString) => {
        if (!dateString) return "TBA";
        const date = new Date(dateString);
        return date.toLocaleDateString("id-ID", {
            weekday: 'long',
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    const getMedalColor = (placement) => {
        if (placement === 1) return "text-yellow-400";
        if (placement === 2) return "text-gray-400";
        if (placement === 3) return "text-orange-400";
        return "text-[#69747C]";
    };

    const getMedalBg = (placement) => {
        if (placement === 1) return "bg-yellow-400/10 border-yellow-400/30";
        if (placement === 2) return "bg-gray-400/10 border-gray-400/30";
        if (placement === 3) return "bg-orange-400/10 border-orange-400/30";
        return "bg-[#69747C]/10 border-[#69747C]/30";
    };

    const getPlacementLabel = (placement) => {
        if (placement === 1) return '🥇 1st';
        if (placement === 2) return '🥈 2nd';
        if (placement === 3) return '🥉 3rd';
        return `#${placement}`;
    };

    // Memoize participants untuk performa
    const sortedParticipants = useMemo(() => {
        if (!tournament.participants) return [];
        return [...tournament.participants].sort((a, b) => {
            if (!a.placement) return 1;
            if (!b.placement) return -1;
            return a.placement - b.placement;
        });
    }, [tournament.participants]);

    return (
        <AppLayout>
            <div className="min-h-screen bg-gradient-to-b from-[#0D0C0C] via-[#0D0C0C] to-[#1a1a1a]">
                {/* Hero Section - Optimized for Mobile with Fixed Back Button */}
                <div className="relative h-[40vh] md:h-[60vh] overflow-hidden">
                    {/* Background Image */}
                    <div className="absolute inset-0">
                        <img
                            src={tournament.image_url || 'https://via.placeholder.com/1920x1080?text=Tournament'}
                            alt={tournament.name}
                            className="w-full h-full object-cover"
                            loading="eager"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0D0C0C] via-[#0D0C0C]/80 to-[#0D0C0C]/60"></div>
                    </div>

                    {/* Content */}
                    <div className="relative h-full max-w-7xl mx-auto px-4 md:px-8 flex flex-col justify-end pb-6 md:pb-12">
                        {/* Back Button - Fixed Position Below Header */}
                        <button
                            onClick={() => router.visit('/tournaments')}
                            className="absolute top-20 md:top-24 left-4 md:left-8 flex items-center gap-1.5 md:gap-2 text-[#F2F2F2] hover:text-[#FF2146] transition-colors bg-[#0D0C0C]/80 backdrop-blur-md px-3 md:px-4 py-2 md:py-2.5 rounded-lg border border-[#69747C]/30 hover:border-[#FF2146]/50 text-sm md:text-base z-30 shadow-lg"
                        >
                            <ArrowLeft className="w-4 h-4 md:w-5 md:h-5" />
                            <span className="font-semibold">Back</span>
                        </button>

                        {/* Tournament Info */}
                        <div className="space-y-3 md:space-y-4 mt-16 md:mt-0">
                            {/* Badges */}
                            <div className="flex flex-wrap gap-2 md:gap-3">
                                <div className={`${tournament.category_bg} border border-current backdrop-blur-sm rounded-full px-3 md:px-4 py-1 md:py-2 text-xs md:text-base`}>
                                    <span className={`${tournament.category_color} font-bold`}>
                                        {tournament.category_name} Event
                                    </span>
                                </div>
                                <div className={`${tournament.status_color} border backdrop-blur-sm rounded-full px-3 md:px-4 py-1 md:py-2 text-xs md:text-base`}>
                                    <span className="font-semibold">
                                        {tournament.status}
                                    </span>
                                </div>
                            </div>

                            {/* Title */}
                            <h1 className="text-2xl md:text-4xl lg:text-6xl font-black text-white leading-tight">
                                {tournament.name}
                            </h1>

                            {/* Quick Info */}
                            <div className="flex flex-wrap gap-3 md:gap-6 text-[#F2F2F2] text-xs md:text-base">
                                <div className="flex items-center gap-1.5 md:gap-2">
                                    <Calendar className="w-4 h-4 md:w-5 md:h-5 text-[#F2AF29] flex-shrink-0" />
                                    <span className="truncate">{formatDate(tournament.start_date)}</span>
                                </div>
                                <div className="flex items-center gap-1.5 md:gap-2">
                                    <Users className="w-4 h-4 md:w-5 md:h-5 text-[#FF2146] flex-shrink-0" />
                                    <span>{tournament.participants_count} Participants</span>
                                </div>
                                <div className="flex items-center gap-1.5 md:gap-2">
                                    <DollarSign className="w-4 h-4 md:w-5 md:h-5 text-[#F2AF29] flex-shrink-0" />
                                    <span className="truncate">{formatCurrency(tournament.prize_pool)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="max-w-7xl mx-auto px-4 md:px-8 py-6 md:py-12">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-8">
                        {/* Left Column - Main Info */}
                        <div className="lg:col-span-2 space-y-4 md:space-y-8">
                            {/* Description */}
                            <div className="bg-gradient-to-br from-[#0D0C0C]/90 to-[#69747C]/20 backdrop-blur-xl border border-[#69747C]/30 rounded-xl md:rounded-2xl p-4 md:p-6">
                                <h2 className="text-lg md:text-2xl font-bold text-white mb-3 md:mb-4 flex items-center gap-2">
                                    <Trophy className="w-5 h-5 md:w-6 md:h-6 text-[#F2AF29]" />
                                    About Tournament
                                </h2>
                                <p className="text-[#F2F2F2] text-sm md:text-base leading-relaxed">
                                    {tournament.description || 'No description available for this tournament.'}
                                </p>
                            </div>

                            {/* Start.gg Registration Embed */}
                            {tournament.url_startgg && tournament.status === 'Pendaftaran Dibuka' && (
                                <div className="bg-gradient-to-br from-[#0D0C0C]/90 to-[#69747C]/20 backdrop-blur-xl border border-[#69747C]/30 rounded-xl md:rounded-2xl p-4 md:p-6">
                                    <h2 className="text-lg md:text-2xl font-bold text-white mb-4 md:mb-6 flex items-center gap-2">
                                        <Award className="w-5 h-5 md:w-6 md:h-6 text-[#F2AF29]" />
                                        Tournament Registration
                                    </h2>
                                    <div className="relative w-full overflow-hidden rounded-lg border border-[#69747C]/30">
                                        <iframe 
                                            src={`https://www.start.gg/tournament/${tournament.url_startgg}/register/embed`}
                                            frameBorder="0"
                                            height="600"
                                            width="100%"
                                            className="w-full"
                                            title="Tournament Registration"
                                        />
                                    </div>
                                    <p className="text-[#69747C] text-xs md:text-sm mt-3">
                                        Register directly through Start.gg to join this tournament
                                    </p>
                                </div>
                            )}

                            {/* Participants List */}
                            {sortedParticipants.length > 0 && (
                                <div className="bg-gradient-to-br from-[#0D0C0C]/90 to-[#69747C]/20 backdrop-blur-xl border border-[#69747C]/30 rounded-xl md:rounded-2xl p-4 md:p-6">
                                    <h2 className="text-lg md:text-2xl font-bold text-white mb-4 md:mb-6 flex items-center gap-2">
                                        <Users className="w-5 h-5 md:w-6 md:h-6 text-[#FF2146]" />
                                        Participants & Results
                                    </h2>
                                    
                                    <div className="space-y-2 md:space-y-3">
                                        {sortedParticipants.map((participant, index) => (
                                            <div
                                                key={participant.id}
                                                className={`flex items-center justify-between p-3 md:p-4 rounded-lg border ${getMedalBg(participant.placement)} transition-all duration-300 active:scale-95 md:hover:scale-[1.02]`}
                                            >
                                                <div className="flex items-center gap-2 md:gap-4 min-w-0 flex-1">
                                                    {participant.placement && participant.placement <= 3 ? (
                                                        <Medal className={`w-5 h-5 md:w-6 md:h-6 flex-shrink-0 ${getMedalColor(participant.placement)}`} />
                                                    ) : (
                                                        <div className="w-5 h-5 md:w-6 md:h-6 flex items-center justify-center flex-shrink-0">
                                                            <span className="text-[#69747C] font-bold text-xs md:text-sm">
                                                                #{participant.placement || index + 1}
                                                            </span>
                                                        </div>
                                                    )}
                                                    <span className="text-[#F2F2F2] font-semibold text-sm md:text-base truncate">
                                                        {participant.name}
                                                    </span>
                                                </div>
                                                {participant.placement && (
                                                    <div className={`px-2 md:px-3 py-0.5 md:py-1 rounded-full ${getMedalBg(participant.placement)} flex-shrink-0`}>
                                                        <span className={`font-bold text-xs md:text-sm ${getMedalColor(participant.placement)}`}>
                                                            {getPlacementLabel(participant.placement)}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Right Column - Sidebar */}
                        <div className="space-y-4 md:space-y-6">
                            {/* Tournament Stats */}
                            <div className="bg-gradient-to-br from-[#0D0C0C]/90 to-[#69747C]/20 backdrop-blur-xl border border-[#69747C]/30 rounded-xl md:rounded-2xl p-4 md:p-6">
                                <h3 className="text-lg md:text-xl font-bold text-white mb-3 md:mb-4">Tournament Info</h3>
                                
                                <div className="space-y-3 md:space-y-4">
                                    <div className="flex justify-between items-center pb-2 md:pb-3 border-b border-[#69747C]/30">
                                        <span className="text-[#69747C] text-sm md:text-base">Prize Pool</span>
                                        <span className="text-[#F2AF29] font-bold text-sm md:text-base truncate ml-2">
                                            {formatCurrency(tournament.prize_pool)}
                                        </span>
                                    </div>
                                    
                                    <div className="flex justify-between items-center pb-2 md:pb-3 border-b border-[#69747C]/30">
                                        <span className="text-[#69747C] text-sm md:text-base">Participants</span>
                                        <span className="text-[#F2F2F2] font-bold text-sm md:text-base">
                                            {tournament.participants_count}/{tournament.max_participants || '∞'}
                                        </span>
                                    </div>
                                    
                                    <div className="flex justify-between items-center pb-2 md:pb-3 border-b border-[#69747C]/30">
                                        <span className="text-[#69747C] text-sm md:text-base">Category</span>
                                        <span className={`${tournament.category_color} font-bold text-sm md:text-base`}>
                                            {tournament.category_name}
                                        </span>
                                    </div>
                                    
                                    <div className="flex justify-between items-center pb-2 md:pb-3 border-b border-[#69747C]/30">
                                        <span className="text-[#69747C] text-sm md:text-base">Status</span>
                                        <span className={`font-bold text-sm md:text-base ${tournament.status === 'Pendaftaran Dibuka' ? 'text-[#F2AF29]' : 'text-[#69747C]'}`}>
                                            {tournament.status}
                                        </span>
                                    </div>
                                    
                                    <div className="flex justify-between items-center">
                                        <span className="text-[#69747C] text-sm md:text-base">Organizer</span>
                                        <span className="text-[#F2F2F2] font-semibold text-sm md:text-base truncate ml-2">
                                            {tournament.created_by}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* External Links */}
                            <div className="bg-gradient-to-br from-[#0D0C0C]/90 to-[#69747C]/20 backdrop-blur-xl border border-[#69747C]/30 rounded-xl md:rounded-2xl p-4 md:p-6">
                                <h3 className="text-lg md:text-xl font-bold text-white mb-3 md:mb-4">Links</h3>
                                
                                <div className="space-y-2 md:space-y-3">
                                    {tournament.url_yt && (
                                        <a
                                            href={tournament.url_yt}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-2 md:gap-3 p-2.5 md:p-3 rounded-lg bg-[#FF2146]/10 border border-[#FF2146]/30 hover:bg-[#FF2146]/20 active:scale-95 transition-all duration-300 group"
                                        >
                                            <Youtube className="w-4 h-4 md:w-5 md:h-5 text-[#FF2146] flex-shrink-0" />
                                            <span className="text-[#F2F2F2] font-semibold flex-1 text-sm md:text-base">Watch on YouTube</span>
                                            <ExternalLink className="w-3.5 h-3.5 md:w-4 md:h-4 text-[#69747C] group-hover:text-[#FF2146] transition-colors flex-shrink-0" />
                                        </a>
                                    )}
                                    
                                    {tournament.url_startgg && (
                                        <a
                                            href={`https://www.start.gg/tournament/${tournament.url_startgg}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-2 md:gap-3 p-2.5 md:p-3 rounded-lg bg-[#F2AF29]/10 border border-[#F2AF29]/30 hover:bg-[#F2AF29]/20 active:scale-95 transition-all duration-300 group"
                                        >
                                            <Award className="w-4 h-4 md:w-5 md:h-5 text-[#F2AF29] flex-shrink-0" />
                                            <span className="text-[#F2F2F2] font-semibold flex-1 text-sm md:text-base">View on Start.gg</span>
                                            <ExternalLink className="w-3.5 h-3.5 md:w-4 md:h-4 text-[#69747C] group-hover:text-[#F2AF29] transition-colors flex-shrink-0" />
                                        </a>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
};

export default TournamentShow;