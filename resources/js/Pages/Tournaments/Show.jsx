import React from "react";
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

    return (
        <AppLayout>
            <div className="min-h-screen bg-gradient-to-b from-[#0D0C0C] via-[#0D0C0C] to-[#1a1a1a]">
                {/* Hero Section with Background Image */}
                <div className="relative h-[60vh] overflow-hidden">
                    {/* Background Image */}
                    <div className="absolute inset-0">
                        <img
                            src={tournament.image_url || 'https://via.placeholder.com/1920x1080?text=Tournament'}
                            alt={tournament.name}
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0D0C0C] via-[#0D0C0C]/80 to-[#0D0C0C]/60"></div>
                    </div>

                    {/* Content */}
                    <div className="relative h-full max-w-7xl mx-auto px-4 md:px-8 flex flex-col justify-end pb-12">
                        {/* Back Button */}
                        <button
                            onClick={() => router.visit('/tournaments')}
                            className="absolute top-8 left-4 md:left-8 flex items-center gap-2 text-[#F2F2F2] hover:text-[#FF2146] transition-colors bg-[#0D0C0C]/50 backdrop-blur-sm px-4 py-2 rounded-lg border border-[#69747C]/30 hover:border-[#FF2146]/50"
                        >
                            <ArrowLeft className="w-5 h-5" />
                            <span className="font-semibold">Back</span>
                        </button>

                        {/* Tournament Info */}
                        <div className="space-y-4">
                            {/* Badges */}
                            <div className="flex flex-wrap gap-3">
                                <div className={`${tournament.category_bg} border border-current backdrop-blur-sm rounded-full px-4 py-2`}>
                                    <span className={`${tournament.category_color} font-bold`}>
                                        {tournament.category_name} Event
                                    </span>
                                </div>
                                <div className={`${tournament.status_color} border backdrop-blur-sm rounded-full px-4 py-2`}>
                                    <span className="font-semibold">
                                        {tournament.status}
                                    </span>
                                </div>
                            </div>

                            {/* Title */}
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight">
                                {tournament.name}
                            </h1>

                            {/* Quick Info */}
                            <div className="flex flex-wrap gap-6 text-[#F2F2F2]">
                                <div className="flex items-center gap-2">
                                    <Calendar className="w-5 h-5 text-[#F2AF29]" />
                                    <span>{formatDate(tournament.start_date)}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Users className="w-5 h-5 text-[#FF2146]" />
                                    <span>{tournament.participants_count} Participants</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <DollarSign className="w-5 h-5 text-[#F2AF29]" />
                                    <span>{formatCurrency(tournament.prize_pool)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="max-w-7xl mx-auto px-4 md:px-8 py-12">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Left Column - Main Info */}
                        <div className="lg:col-span-2 space-y-8">
                            {/* Description */}
                            <div className="bg-gradient-to-br from-[#0D0C0C]/90 to-[#69747C]/20 backdrop-blur-xl border border-[#69747C]/30 rounded-2xl p-6">
                                <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                                    <Trophy className="w-6 h-6 text-[#F2AF29]" />
                                    About Tournament
                                </h2>
                                <p className="text-[#F2F2F2] leading-relaxed">
                                    {tournament.description || 'No description available for this tournament.'}
                                </p>
                            </div>

                            {/* Participants List */}
                            {tournament.participants && tournament.participants.length > 0 && (
                                <div className="bg-gradient-to-br from-[#0D0C0C]/90 to-[#69747C]/20 backdrop-blur-xl border border-[#69747C]/30 rounded-2xl p-6">
                                    <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                                        <Users className="w-6 h-6 text-[#FF2146]" />
                                        Participants & Results
                                    </h2>
                                    
                                    <div className="space-y-3">
                                        {tournament.participants.map((participant, index) => (
                                            <div
                                                key={participant.id}
                                                className={`flex items-center justify-between p-4 rounded-lg border ${getMedalBg(participant.placement)} transition-all duration-300 hover:scale-[1.02]`}
                                            >
                                                <div className="flex items-center gap-4">
                                                    {participant.placement && participant.placement <= 3 ? (
                                                        <Medal className={`w-6 h-6 ${getMedalColor(participant.placement)}`} />
                                                    ) : (
                                                        <div className="w-6 h-6 flex items-center justify-center">
                                                            <span className="text-[#69747C] font-bold text-sm">
                                                                #{participant.placement || index + 1}
                                                            </span>
                                                        </div>
                                                    )}
                                                    <span className="text-[#F2F2F2] font-semibold">
                                                        {participant.name}
                                                    </span>
                                                </div>
                                                {participant.placement && (
                                                    <div className={`px-3 py-1 rounded-full ${getMedalBg(participant.placement)}`}>
                                                        <span className={`font-bold text-sm ${getMedalColor(participant.placement)}`}>
                                                            {participant.placement === 1 ? '🥇 1st' : 
                                                             participant.placement === 2 ? '🥈 2nd' : 
                                                             participant.placement === 3 ? '🥉 3rd' : 
                                                             `#${participant.placement}`}
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
                        <div className="space-y-6">
                            {/* Tournament Stats */}
                            <div className="bg-gradient-to-br from-[#0D0C0C]/90 to-[#69747C]/20 backdrop-blur-xl border border-[#69747C]/30 rounded-2xl p-6">
                                <h3 className="text-xl font-bold text-white mb-4">Tournament Info</h3>
                                
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center pb-3 border-b border-[#69747C]/30">
                                        <span className="text-[#69747C]">Prize Pool</span>
                                        <span className="text-[#F2AF29] font-bold">
                                            {formatCurrency(tournament.prize_pool)}
                                        </span>
                                    </div>
                                    
                                    <div className="flex justify-between items-center pb-3 border-b border-[#69747C]/30">
                                        <span className="text-[#69747C]">Participants</span>
                                        <span className="text-[#F2F2F2] font-bold">
                                            {tournament.participants_count}/{tournament.max_participants || '∞'}
                                        </span>
                                    </div>
                                    
                                    <div className="flex justify-between items-center pb-3 border-b border-[#69747C]/30">
                                        <span className="text-[#69747C]">Category</span>
                                        <span className={`${tournament.category_color} font-bold`}>
                                            {tournament.category_name}
                                        </span>
                                    </div>
                                    
                                    <div className="flex justify-between items-center pb-3 border-b border-[#69747C]/30">
                                        <span className="text-[#69747C]">Status</span>
                                        <span className={`font-bold ${tournament.status === 'Pendaftaran Dibuka' ? 'text-[#F2AF29]' : 'text-[#69747C]'}`}>
                                            {tournament.status}
                                        </span>
                                    </div>
                                    
                                    <div className="flex justify-between items-center">
                                        <span className="text-[#69747C]">Organizer</span>
                                        <span className="text-[#F2F2F2] font-semibold">
                                            {tournament.created_by}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* External Links */}
                            <div className="bg-gradient-to-br from-[#0D0C0C]/90 to-[#69747C]/20 backdrop-blur-xl border border-[#69747C]/30 rounded-2xl p-6">
                                <h3 className="text-xl font-bold text-white mb-4">Links</h3>
                                
                                <div className="space-y-3">
                                    {tournament.url_yt && (
                                        <a
                                            href={tournament.url_yt}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-3 p-3 rounded-lg bg-[#FF2146]/10 border border-[#FF2146]/30 hover:bg-[#FF2146]/20 transition-all duration-300 group"
                                        >
                                            <Youtube className="w-5 h-5 text-[#FF2146]" />
                                            <span className="text-[#F2F2F2] font-semibold flex-1">Watch on YouTube</span>
                                            <ExternalLink className="w-4 h-4 text-[#69747C] group-hover:text-[#FF2146] transition-colors" />
                                        </a>
                                    )}
                                    
                                    {tournament.url_startgg && (
                                        <a
                                            href={tournament.url_startgg}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-3 p-3 rounded-lg bg-[#F2AF29]/10 border border-[#F2AF29]/30 hover:bg-[#F2AF29]/20 transition-all duration-300 group"
                                        >
                                            <Award className="w-5 h-5 text-[#F2AF29]" />
                                            <span className="text-[#F2F2F2] font-semibold flex-1">View on Start.gg</span>
                                            <ExternalLink className="w-4 h-4 text-[#69747C] group-hover:text-[#F2AF29] transition-colors" />
                                        </a>
                                    )}
                                </div>
                            </div>

                            {/* Action Button */}
                            {tournament.status === 'Pendaftaran Dibuka' && (
                                <button className="w-full px-6 py-4 bg-gradient-to-r from-[#FF2146] to-[#F2AF29] hover:from-[#FF2146]/90 hover:to-[#F2AF29]/90 text-[#F2F2F2] font-bold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-[#FF2146]/50">
                                    Register Now
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
};

export default TournamentShow;