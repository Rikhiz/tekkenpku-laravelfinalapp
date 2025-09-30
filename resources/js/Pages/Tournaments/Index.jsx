import React, { useState } from "react";
import AppLayout from "@/Layouts/AppLayout";
import {
    Trophy,
    Calendar,
    Users,
    Award,
    DollarSign,
    Youtube,
    ExternalLink,
    Filter,
} from "lucide-react";
import { router } from "@inertiajs/react";

const TournamentsIndex = ({ tournaments = [] }) => {
    const [filterCategory, setFilterCategory] = useState("all");
    const [filterStatus, setFilterStatus] = useState("all");

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
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    const handleTournamentClick = (tournamentId) => {
        router.visit(`/tournaments/${tournamentId}`);
    };

    // Filter tournaments
    const filteredTournaments = tournaments.filter((tournament) => {
        const categoryMatch =
            filterCategory === "all" ||
            tournament.category === parseInt(filterCategory);
        const statusMatch =
            filterStatus === "all" || tournament.status === filterStatus;
        return categoryMatch && statusMatch;
    });

    return (
        <AppLayout>
            <div className="min-h-screen bg-gradient-to-b from-[#0D0C0C] via-[#0D0C0C] to-[#1a1a1a]">
                {/* Hero Header */}
                <div className="relative py-20 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-[#FF2146]/10 to-[#F2AF29]/10"></div>
                    <div className="absolute top-10 right-10 w-96 h-96 bg-[#FF2146]/5 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-10 left-10 w-96 h-96 bg-[#F2AF29]/5 rounded-full blur-3xl"></div>

                    <div className="relative max-w-7xl mx-auto px-4 md:px-8 text-center">
                        <div className="inline-flex items-center gap-3 bg-gradient-to-r from-[#FF2146]/20 to-[#F2AF29]/20 backdrop-blur-sm border border-[#FF2146]/30 rounded-full px-6 py-2 mb-6">
                            <Trophy className="w-5 h-5 text-[#F2AF29]" />
                            <span className="text-[#F2F2F2] font-semibold">
                                Official Tournaments
                            </span>
                        </div>

                        <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-white mb-6">
                            <span className="bg-gradient-to-r from-[#FF2146] to-[#F2AF29] bg-clip-text text-transparent">
                                Tournaments
                            </span>
                        </h1>
                        <p className="text-[#69747C] text-lg md:text-xl max-w-2xl mx-auto">
                            Join competitive tournaments, showcase your skills,
                            and win amazing prizes
                        </p>
                    </div>
                </div>

                <br />

                {/* Filters */}
                <div className="max-w-7xl mx-auto px-4 md:px-8 mb-8">
                    <div className="bg-gradient-to-r from-[#0D0C0C]/90 to-[#69747C]/20 backdrop-blur-xl border border-[#69747C]/30 rounded-2xl p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <Filter className="w-5 h-5 text-[#F2AF29]" />
                            <h3 className="text-white font-bold text-lg">
                                Filter Tournaments
                            </h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="text-[#69747C] text-sm mb-2 block">
                                    Category
                                </label>
                                <select
                                    value={filterCategory}
                                    onChange={(e) =>
                                        setFilterCategory(e.target.value)
                                    }
                                    className="w-full bg-[#0D0C0C] border border-[#69747C]/30 rounded-lg px-4 py-2 text-white focus:border-[#FF2146] focus:outline-none"
                                >
                                    <option value="all">All Categories</option>
                                    <option value="1">Major Events</option>
                                    <option value="2">Minor Events</option>
                                    <option value="3">Mini Events</option>
                                </select>
                            </div>

                            <div>
                                <label className="text-[#69747C] text-sm mb-2 block">
                                    Status
                                </label>
                                <select
                                    value={filterStatus}
                                    onChange={(e) =>
                                        setFilterStatus(e.target.value)
                                    }
                                    className="w-full bg-[#0D0C0C] border border-[#69747C]/30 rounded-lg px-4 py-2 text-white focus:border-[#FF2146] focus:outline-none"
                                >
                                    <option value="all">All Status</option>
                                    <option value="Pendaftaran Dibuka">
                                        Pendaftaran Dibuka
                                    </option>
                                    <option value="Selesai">Selesai</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tournaments Grid */}
                <div className="max-w-7xl mx-auto px-4 md:px-8 pb-20">
                    {filteredTournaments.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredTournaments.map((tournament) => (
                                <div
                                    key={tournament.id}
                                    onClick={() =>
                                        handleTournamentClick(tournament.id)
                                    }
                                    className="group relative overflow-hidden bg-gradient-to-br from-[#0D0C0C]/90 to-[#69747C]/20 backdrop-blur-xl border border-[#69747C]/30 rounded-2xl transition-all duration-500 hover:border-[#FF2146]/50 hover:transform hover:scale-[1.02] cursor-pointer"
                                >
                                    {/* Gambar */}
                                    <div className="relative h-48 overflow-hidden">
                                        <img
                                            src={
                                                tournament.image_url ||
                                                "https://via.placeholder.com/400x300?text=Tournament"
                                            }
                                            alt={tournament.name}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-[#0D0C0C] to-transparent"></div>

                                        {/* Category Badge */}
                                        <div
                                            className={`absolute top-4 left-4 ${tournament.category_bg} border border-current backdrop-blur-sm rounded-full px-3 py-1`}
                                        >
                                            <span
                                                className={`${tournament.category_color} text-xs font-bold`}
                                            >
                                                {tournament.category_name}
                                            </span>
                                        </div>

                                        {/* Status Badge */}
                                        <div
                                            className={`absolute top-4 right-4 ${tournament.status_color} border backdrop-blur-sm rounded-full px-3 py-1`}
                                        >
                                            <span className="text-xs font-semibold">
                                                {tournament.status}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Konten */}
                                    <div className="p-6">
                                        {/* Nama Turnamen */}
                                        <h3 className="text-[#F2F2F2] font-bold text-xl mb-3 group-hover:text-[#FF2146] transition-colors line-clamp-2">
                                            {tournament.name}
                                        </h3>

                                        {/* Deskripsi */}
                                        <p className="text-[#69747C] text-sm mb-4 line-clamp-2">
                                            {tournament.description ||
                                                "Join this tournament and compete!"}
                                        </p>

                                        {/* Info Grid */}
                                        <div className="space-y-3 mb-4">
                                            {/* Prize */}
                                            <div className="flex items-center gap-2 text-sm">
                                                <DollarSign className="w-4 h-4 text-[#F2AF29]" />
                                                <span className="text-[#69747C]">
                                                    Prize:
                                                </span>
                                                <span className="text-[#F2F2F2] font-semibold">
                                                    {formatCurrency(
                                                        tournament.prize_pool
                                                    )}
                                                </span>
                                            </div>

                                            {/* Participants */}
                                            <div className="flex items-center gap-2 text-sm">
                                                <Users className="w-4 h-4 text-[#FF2146]" />
                                                <span className="text-[#69747C]">
                                                    Participants:
                                                </span>
                                                <span className="text-[#F2F2F2] font-semibold">
                                                    {tournament.participants}/
                                                    {tournament.max_participants ||
                                                        "∞"}
                                                </span>
                                            </div>

                                            {/* Start Date */}
                                            <div className="flex items-center gap-2 text-sm">
                                                <Calendar className="w-4 h-4 text-[#69747C]" />
                                                <span className="text-[#69747C] truncate">
                                                    {formatDate(
                                                        tournament.start_date
                                                    )}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Links */}
                                        {(tournament.url_yt ||
                                            tournament.url_startgg) && (
                                            <div className="flex gap-2 mb-4">
                                                {tournament.url_yt && (
                                                    <a
                                                        href={tournament.url_yt}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        onClick={(e) =>
                                                            e.stopPropagation()
                                                        }
                                                        className="flex items-center gap-1 text-xs text-[#FF2146] hover:text-[#FF2146]/80 transition-colors"
                                                    >
                                                        <Youtube className="w-4 h-4" />
                                                        Watch
                                                    </a>
                                                )}
                                                {tournament.url_startgg && (
                                                    <a
                                                        href={
                                                            tournament.url_startgg
                                                        }
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        onClick={(e) =>
                                                            e.stopPropagation()
                                                        }
                                                        className="flex items-center gap-1 text-xs text-[#F2AF29] hover:text-[#F2AF29]/80 transition-colors"
                                                    >
                                                        <ExternalLink className="w-4 h-4" />
                                                        Start.gg
                                                    </a>
                                                )}
                                            </div>
                                        )}

                                        {/* Tombol */}
                                        <button className="w-full px-4 py-2 bg-gradient-to-r from-[#FF2146] to-[#F2AF29] hover:from-[#FF2146]/90 hover:to-[#F2AF29]/90 text-[#F2F2F2] font-semibold rounded-lg transition-all duration-300 transform group-hover:scale-105">
                                            View Details
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20">
                            <Trophy className="w-20 h-20 text-[#69747C] mx-auto mb-6" />
                            <h3 className="text-[#F2F2F2] text-2xl font-bold mb-2">
                                No Tournaments Found
                            </h3>
                            <p className="text-[#69747C]">
                                Try adjusting your filters or check back later
                                for new tournaments
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
};

export default TournamentsIndex;
