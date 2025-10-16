import React, { useState, useMemo } from "react";
import AppLayout from "@/Layouts/AppLayout";
import Modal from "@/Components/Modal";
import logosss from "@/images/logosss.png";
import arcade from "@/images/arcade.png";
import monthly from "@/images/monthlylogo.png";
import twtasia2 from "@/images/twtasia2.png";
import ndclogo from "@/images/ndclogo.png";
import whifflogo from "@/images/whifflogo.png";

import {
    Trophy,
    Calendar,
    Users,
    DollarSign,
    Youtube,
    ExternalLink,
    Filter,
    ShieldAlert,
    ShieldBan,
    Clock,
    Home,
    Shield,
} from "lucide-react";
import { router } from "@inertiajs/react";
import herobg from "@/images/tournament-background.png";

const TournamentsIndex = ({
    tournaments = [],
    banList = [],
    loading = false,
}) => {
    const [filterCategory, setFilterCategory] = useState("all");
    const [filterStatus, setFilterStatus] = useState("all");
    const [showBanListModal, setShowBanListModal] = useState(false);

    const categoryConfig = {
        1: {
            name: "MAJOR",
            bgColor: "bg-gradient-to-r from-red-600 to-red-500",
            textColor: "text-white",
            borderColor: "border-red-400",
            glowColor: "shadow-red-500/50",
        },
        2: {
            name: "MINOR",
            bgColor: "bg-gradient-to-r from-yellow-500 to-amber-500",
            textColor: "text-white",
            borderColor: "border-yellow-400",
            glowColor: "shadow-yellow-500/50",
        },
        3: {
            name: "MINI",
            bgColor: "bg-gradient-to-r from-green-600 to-emerald-500",
            textColor: "text-white",
            borderColor: "border-green-400",
            glowColor: "shadow-green-500/50",
        },
        4: {
            name: "Non-Sanctioned",
            bgColor: "bg-white",
            textColor: "text-black",
            borderColor: "border-green-400",
            glowColor: "shadow-green-500/50",
        },
    };

    const statusConfig = {
        Selesai: {
            bgColor: "bg-gradient-to-r from-gray-700 to-gray-600",
            textColor: "text-gray-200",
            borderColor: "border-gray-400",
            icon: "✓",
        },
        "Pendaftaran Dibuka": {
            bgColor: "bg-gradient-to-r from-emerald-600 to-green-500",
            textColor: "text-white",
            borderColor: "border-emerald-400",
            icon: "🔥",
            pulse: true,
        },
    };

    const formatCurrency = (amount) => {
        if (!amount) return "TBA";
        if (typeof amount === "string" && amount.includes("Rp")) {
            return amount;
        }

        // Format pakai Intl.NumberFormat dulu
        let formatted = new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(amount);

        // Hapus spasi (termasuk non-breaking space)
        return formatted.replace(/\s/g, "");
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

    const formatDateTime = (dateString) => {
        if (!dateString) return "N/A";
        const date = new Date(dateString);
        return date.toLocaleString("id-ID", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const handleTournamentClick = (tournamentId) => {
        router.visit(`/tournaments/${tournamentId}`);
    };

    const filteredTournaments = useMemo(() => {
        return tournaments.filter((tournament) => {
            const categoryMatch =
                filterCategory === "all" ||
                tournament.category == filterCategory;
            const statusMatch =
                filterStatus === "all" || tournament.status === filterStatus;
            return categoryMatch && statusMatch;
        });
    }, [tournaments, filterCategory, filterStatus]);

    const getBanBadge = (status) => {
        return status === "Yes" || status === true ? (
            <span className="inline-flex items-center gap-1 bg-red-500/20 text-red-400 border border-red-500/30 rounded-full px-2 py-0.5 text-xs font-semibold">
                <ShieldBan className="w-3 h-3" />
                Banned
            </span>
        ) : (
            <span className="inline-flex items-center gap-1 bg-green-500/20 text-green-400 border border-green-500/30 rounded-full px-2 py-0.5 text-xs font-semibold">
                ✓ Active
            </span>
        );
    };

    return (
        <AppLayout>
            <div className="min-h-screen bg-gradient-to-b from-[#0D0C0C] via-[#0D0C0C] to-[#1a1a1a]">
                {/* Hero Header */}
                <div className="relative py-12 sm:py-16 md:py-24 lg:py-48 text-center overflow-hidden">
                    <img
                        src={herobg}
                        alt="Hero Background"
                        className="absolute inset-0 w-full h-full object-cover blur-sm"
                        loading="eager"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-[#0D0C0C]/80 via-[#0D0C0C]/70 to-[#0D0C0C]/80"></div>

                    <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-b from-transparent to-[#0D0C0C] pointer-events-none"></div>
                    <br />
                    <br />
                    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 md:px-8 flex flex-col items-center">
                        {/* Title */}
                        <h1 className="flex items-center justify-center gap-3 sm:gap-4 text-2xl sm:text-3xl md:text-5xl lg:text-7xl font-black text-white mb-3 md:mb-4 lg:mb-6 px-2">
                            <Trophy className="w-10 h-10 sm:w-14 sm:h-14 md:w-20 md:h-20 text-[#FF2146] drop-shadow-2xl" />
                            <span className="bg-gradient-to-r from-[#FF2146] to-[#F2AF29] bg-clip-text text-transparent">
                                TOURNAMENTS
                            </span>
                        </h1>

                        {/* Flex container bawah tombol */}
                        <div className="flex items-center justify-center gap-4 mt-2">
                            {/* Contoh item 1: Logo lebih kecil */}
                            <img
                                src={logosss}
                                alt="Tournament Logo"
                                className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 object-contain mb-4 md:mb-6 drop-shadow-xl"
                            />
                            <img
                                src={arcade}
                                alt="Tournament Logo"
                                className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 object-contain mb-4 md:mb-6 drop-shadow-xl"
                            />
                            <img
                                src={monthly}
                                alt="Tournament Logo"
                                className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 object-contain mb-4 md:mb-6 drop-shadow-xl"
                            />
                            <img
                                src={twtasia2}
                                alt="Tournament Logo"
                                className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 object-contain mb-4 md:mb-6 drop-shadow-xl"
                            />
                            <img
                                src={ndclogo}
                                alt="Tournament Logo"
                                className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 object-contain mb-4 md:mb-6 drop-shadow-xl"
                            />
                            <img
                                src={whifflogo}
                                alt="Tournament Logo"
                                className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 object-contain mb-4 md:mb-6 drop-shadow-xl"
                            />
                        </div>

                        {/* Subtext */}
                        <p className="text-xs sm:text-sm md:text-lg text-gray-200 max-w-2xl mx-auto px-4 mb-4 md:mb-6">
                            Join competitive tournaments, showcase your skills,
                            and win amazing prizes
                        </p>

                        {/* Ban List Button */}
                        <button
                            onClick={() => setShowBanListModal(true)}
                            className="inline-flex items-center gap-2 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 active:scale-95 text-white font-semibold px-4 sm:px-5 md:px-6 py-2 sm:py-2.5 md:py-3 rounded-lg transition-all duration-300 hover:scale-105 shadow-lg text-sm md:text-base mb-4"
                        >
                            <ShieldAlert className="w-4 h-4 md:w-5 md:h-5 flex-shrink-0" />
                            <span>Ban List ({banList.length})</span>
                        </button>
                    </div>
                </div>

                <br />

                {/* Filters */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 mb-6 md:mb-8">
                    <div className="bg-gradient-to-r from-[#0D0C0C]/90 to-[#69747C]/20 backdrop-blur-xl border border-[#69747C]/30 rounded-xl md:rounded-2xl p-4 md:p-6">
                        <div className="flex items-center gap-2 md:gap-3 mb-3 md:mb-4">
                            <Filter className="w-4 h-4 md:w-5 md:h-5 text-[#F2AF29] flex-shrink-0" />
                            <h3 className="text-white font-bold text-sm md:text-base lg:text-lg">
                                Filter Tournaments
                            </h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                            <div>
                                <label className="text-[#69747C] text-xs md:text-sm mb-1.5 md:mb-2 block">
                                    Category
                                </label>
                                <select
                                    value={filterCategory}
                                    onChange={(e) =>
                                        setFilterCategory(e.target.value)
                                    }
                                    className="w-full bg-[#0D0C0C] border border-[#69747C]/30 rounded-lg px-3 md:px-4 py-2 text-sm md:text-base text-white focus:border-[#FF2146] focus:outline-none"
                                >
                                    <option value="all">All Categories</option>
                                    <option value="1">Major Events</option>
                                    <option value="2">Minor Events</option>
                                    <option value="3">Mini Events</option>
                                    <option value="4">Non-Sanction</option>
                                </select>
                            </div>

                            <div>
                                <label className="text-[#69747C] text-xs md:text-sm mb-1.5 md:mb-2 block">
                                    Status
                                </label>
                                <select
                                    value={filterStatus}
                                    onChange={(e) =>
                                        setFilterStatus(e.target.value)
                                    }
                                    className="w-full bg-[#0D0C0C] border border-[#69747C]/30 rounded-lg px-3 md:px-4 py-2 text-sm md:text-base text-white focus:border-[#FF2146] focus:outline-none"
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
                <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 pb-12 md:pb-20">
                    {loading ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                            {[...Array(6)].map((_, i) => (
                                <div
                                    key={i}
                                    className="animate-pulse bg-[#1a1a1a] rounded-xl h-[520px] sm:h-[540px]"
                                ></div>
                            ))}
                        </div>
                    ) : filteredTournaments.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                            {filteredTournaments.map((tournament) => {
                                const catConfig =
                                    categoryConfig[tournament.category] ||
                                    categoryConfig[3];
                                const statConfig =
                                    statusConfig[tournament.status] ||
                                    statusConfig["Selesai"];

                                return (
                                    <div
                                        key={tournament.id}
                                        onClick={() =>
                                            handleTournamentClick(
                                                tournament.url_startgg
                                            )
                                        }
                                        className="group relative flex flex-col overflow-hidden bg-gradient-to-br from-[#0D0C0C]/90 to-[#69747C]/20 backdrop-blur-xl border border-[#69747C]/30 rounded-xl md:rounded-2xl transition-all duration-300 hover:border-[#FF2146]/50 active:scale-95 md:hover:scale-[1.02] cursor-pointer h-[560px] sm:h-[580px]"
                                    >
                                        {/* Image Section */}
                                        <div className="relative h-40 sm:h-44 md:h-48 overflow-hidden flex-shrink-0">
                                            <img
                                                src={
                                                    tournament.image_url ||
                                                    "https://picsum.photos/400/300?random=1"
                                                }
                                                alt={tournament.name}
                                                className="opacity-60 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                                loading="lazy"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-[#0D0C0C] to-transparent"></div>

                                            {/* Category Badge */}
                                            <div className="absolute top-2 sm:top-3 left-2 sm:left-3">
                                                <span
                                                    className={`inline-flex items-center gap-1.5 ${catConfig.bgColor} ${catConfig.textColor} border ${catConfig.borderColor} backdrop-blur-sm rounded-full px-3 py-1 shadow-lg ${catConfig.glowColor}`}
                                                >
                                                    <Trophy className="w-3 h-3" />
                                                    <span className="text-xs font-bold tracking-wider">
                                                        {catConfig.name}
                                                    </span>
                                                </span>
                                            </div>

                                            {/* Status Badge */}
                                            <div className="absolute top-2 sm:top-3 right-2 sm:right-3">
                                                <span
                                                    className={`inline-flex items-center gap-1.5 ${
                                                        statConfig.bgColor
                                                    } ${
                                                        statConfig.textColor
                                                    } border ${
                                                        statConfig.borderColor
                                                    } backdrop-blur-sm rounded-full px-3 py-1 shadow-lg ${
                                                        statConfig.pulse
                                                            ? "animate-pulse"
                                                            : ""
                                                    }`}
                                                >
                                                    <span className="text-xs">
                                                        {statConfig.icon}
                                                    </span>
                                                    <span className="text-xs font-semibold">
                                                        {tournament.status}
                                                    </span>
                                                </span>
                                            </div>
                                        </div>

                                        {/* Content Section */}
                                        <div className="flex flex-col flex-grow p-4 md:p-5">
                                            <div className="h-12 sm:h-14 mb-2 md:mb-3">
                                                <h3 className="text-[#F2F2F2] font-bold text-sm sm:text-base md:text-lg leading-tight group-hover:text-[#FF2146] transition-colors line-clamp-2">
                                                    {tournament.name}
                                                </h3>
                                            </div>

                                            <div className="h-10 mb-3 md:mb-4">
                                                <p className="text-[#69747C] text-xs md:text-sm leading-relaxed line-clamp-2">
                                                    {tournament.description ||
                                                        "Join this tournament and compete!"}
                                                </p>
                                            </div>

                                            <div className="space-y-2 mb-3 md:mb-4">
                                                {tournament.dojo && (
                                                    <div className="flex items-center gap-2 text-xs md:text-sm h-5">
                                                        <Home className="w-3.5 h-3.5 md:w-4 md:h-4 text-[#FF2146] flex-shrink-0" />
                                                        <span className="text-[#69747C] flex-shrink-0">
                                                            Format:
                                                        </span>
                                                        <span className="text-[#F2AF29] font-semibold truncate">
                                                            {tournament.dojo}
                                                        </span>
                                                    </div>
                                                )}
                                                <div className="flex items-center gap-2 text-xs md:text-sm h-5">
                                                    <DollarSign className="w-3.5 h-3.5 md:w-4 md:h-4 text-[#F2AF29] flex-shrink-0" />
                                                    <span className="text-[#69747C] flex-shrink-0">
                                                        Prize:
                                                    </span>
                                                    <span className="text-[#F2F2F2] font-semibold truncate">
                                                        {formatCurrency(
                                                            tournament.prize_pool
                                                        )}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-2 text-xs md:text-sm h-5">
                                                    <Users className="w-3.5 h-3.5 md:w-4 md:h-4 text-[#FF2146] flex-shrink-0" />
                                                    <span className="text-[#69747C] flex-shrink-0">
                                                        Participants:
                                                    </span>
                                                    <span className="text-[#F2F2F2] font-semibold">
                                                        {tournament.participants ||
                                                            0}
                                                        /
                                                        {tournament.max_participants ||
                                                            "∞"}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-2 text-xs md:text-sm h-5">
                                                    <Calendar className="w-3.5 h-3.5 md:w-4 md:h-4 text-[#69747C] flex-shrink-0" />
                                                    <span className="text-[#69747C] text-xs md:text-sm truncate">
                                                        {formatDate(
                                                            tournament.start_date
                                                        )}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="h-6 mb-3 md:mb-4">
                                                {(tournament.url_yt ||
                                                    tournament.url_startgg) && (
                                                    <div className="flex gap-3">
                                                        {tournament.url_yt && (
                                                            <a
                                                                href={
                                                                    tournament.url_yt
                                                                }
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                onClick={(e) =>
                                                                    e.stopPropagation()
                                                                }
                                                                className="flex items-center gap-1 text-xs text-[#FF2146] hover:text-[#FF2146]/80 transition-colors"
                                                            >
                                                                <Youtube className="w-3.5 h-3.5 flex-shrink-0" />
                                                                <span>
                                                                    Watch
                                                                </span>
                                                            </a>
                                                        )}
                                                        {tournament.url_startgg && (
                                                            <a
                                                                href={`https://www.start.gg/tournament/${tournament.url_startgg}`}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                onClick={(e) =>
                                                                    e.stopPropagation()
                                                                }
                                                                className="flex items-center gap-1 text-xs text-[#F2AF29] hover:text-[#F2AF29]/80 transition-colors"
                                                            >
                                                                <ExternalLink className="w-3.5 h-3.5 flex-shrink-0" />
                                                                <span>
                                                                    Start.gg
                                                                </span>
                                                            </a>
                                                        )}
                                                    </div>
                                                )}
                                            </div>

                                            <div className="mt-auto">
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleTournamentClick(
                                                            tournament.url_startgg
                                                        );
                                                    }}
                                                    className="w-full px-3 md:px-4 py-2 md:py-2.5 bg-gradient-to-r from-[#FF2146] to-[#F2AF29] hover:from-[#FF2146]/90 hover:to-[#F2AF29]/90 text-[#F2F2F2] font-semibold text-xs sm:text-sm md:text-base rounded-lg transition-all duration-300 active:scale-95 md:group-hover:scale-105"
                                                >
                                                    {tournament.status ===
                                                    "Pendaftaran Dibuka"
                                                        ? "Register Now"
                                                        : "View Details"}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="text-center py-12 md:py-20">
                            <Trophy className="w-16 h-16 md:w-20 md:h-20 text-[#69747C] mx-auto mb-4 md:mb-6" />
                            <h3 className="text-[#F2F2F2] text-xl md:text-2xl font-bold mb-2">
                                No Tournaments Found
                            </h3>
                            <p className="text-[#69747C] text-sm md:text-base px-4">
                                Try adjusting your filters or check back later
                                for new tournaments
                            </p>
                        </div>
                    )}
                </div>

                {/* Ban List Modal */}
                <Modal
                    title="Tournament Ban List"
                    show={showBanListModal}
                    onClose={() => setShowBanListModal(false)}
                    width="w-full max-w-4xl"
                >
                    <div className="space-y-4">
                        {banList.length > 0 ? (
                            <div className="overflow-x-auto -mx-4 sm:mx-0">
                                <div className="inline-block min-w-full align-middle px-4 sm:px-0">
                                    <table className="min-w-full">
                                        <thead>
                                            <tr className="border-b border-[#69747C]/30">
                                                <th className="text-left py-3 px-2 sm:px-4 text-[#F2AF29] font-semibold text-xs sm:text-sm">
                                                    Player
                                                </th>
                                                <th className="hidden sm:table-cell text-left py-3 px-4 text-[#F2AF29] font-semibold text-sm">
                                                    Email
                                                </th>
                                                <th className="text-center py-3 px-2 sm:px-4 text-[#F2AF29] font-semibold text-xs sm:text-sm">
                                                    Major
                                                </th>
                                                <th className="text-center py-3 px-2 sm:px-4 text-[#F2AF29] font-semibold text-xs sm:text-sm">
                                                    Minor
                                                </th>
                                                <th className="text-center py-3 px-2 sm:px-4 text-[#F2AF29] font-semibold text-xs sm:text-sm">
                                                    Mini
                                                </th>
                                                <th className="hidden md:table-cell text-left py-3 px-4 text-[#F2AF29] font-semibold text-sm">
                                                    Banned Since
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {banList.map((ban) => (
                                                <tr
                                                    key={ban.id}
                                                    className="border-b border-[#69747C]/20 hover:bg-[#69747C]/10 transition-colors"
                                                >
                                                    <td className="py-3 px-2 sm:px-4">
                                                        <div className="text-white font-medium text-xs sm:text-sm">
                                                            {ban.user_name}
                                                        </div>
                                                        <div className="sm:hidden text-[#69747C] text-xs mt-0.5">
                                                            {ban.user_email}
                                                        </div>
                                                    </td>
                                                    <td className="hidden sm:table-cell py-3 px-4 text-[#69747C] text-sm">
                                                        {ban.user_email}
                                                    </td>
                                                    <td className="py-3 px-2 sm:px-4 text-center">
                                                        {getBanBadge(ban.major)}
                                                    </td>
                                                    <td className="py-3 px-2 sm:px-4 text-center">
                                                        {getBanBadge(ban.minor)}
                                                    </td>
                                                    <td className="py-3 px-2 sm:px-4 text-center">
                                                        {getBanBadge(ban.mini)}
                                                    </td>
                                                    <td className="hidden md:table-cell py-3 px-4 text-[#69747C] text-sm">
                                                        <div className="flex items-center gap-1">
                                                            <Clock className="w-3.5 h-3.5 flex-shrink-0" />
                                                            <span>
                                                                {formatDateTime(
                                                                    ban.created_at
                                                                )}
                                                            </span>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <ShieldAlert className="w-16 h-16 text-[#69747C] mx-auto mb-4" />
                                <h3 className="text-white text-lg font-bold mb-2">
                                    No Banned Players
                                </h3>
                                <p className="text-[#69747C] text-sm">
                                    Currently there are no players on the ban
                                    list
                                </p>
                            </div>
                        )}

                        <div className="pt-4 border-t border-[#69747C]/30">
                            <div className="flex items-start gap-2 text-xs text-[#69747C]">
                                <ShieldAlert className="w-4 h-4 flex-shrink-0 mt-0.5" />
                                <p>
                                    Players on this list are restricted from
                                    participating in tournaments based on their
                                    ban category (Major, Minor, or Mini events).
                                </p>
                            </div>
                        </div>
                    </div>
                </Modal>
            </div>
        </AppLayout>
    );
};

export default TournamentsIndex;
