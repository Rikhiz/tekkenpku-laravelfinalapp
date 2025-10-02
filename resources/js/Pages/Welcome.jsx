import React, { useState, useEffect } from "react";
import AppLayout from "@/Layouts/AppLayout";
import TypingEffect from "@/Components/TypingEffect";
import { Trophy, Gamepad2 } from "lucide-react";
import { useInView } from "react-intersection-observer";
import herobg from "@/images/hero-background.jpg";
import { Link, router } from "@inertiajs/react";

const Welcome = ({
    videoTournaments = [],
    latestTournaments = [],
    stats = [],
}) => {
    const [isVisible, setIsVisible] = useState(false);

    // observer buat lazy render section
    const [videoRef, videoInView] = useInView({
        triggerOnce: true,
        rootMargin: "200px",
    });
    const [tournamentRef, tournamentInView] = useInView({
        triggerOnce: true,
        rootMargin: "200px",
    });

    useEffect(() => {
        setIsVisible(true);
    }, []);

    const formatStatValue = (value, label) => {
        const formatCompact = (num) => {
            if (num >= 1_000_000_000) {
                return `Rp${(num / 1_000_000_000).toFixed(1)}M`; // Miliar
            } else if (num >= 1_000_000) {
                return `Rp${(num / 1_000_000).toFixed(1)}JT`; // Juta
            } else if (num >= 1_000) {
                return `Rp${(num / 1_000).toFixed(1)}Rb`; // Ribu
            }
            return `Rp${num}`;
        };

        if (label === "Total Prize Pool") {
            return formatCompact(value);
        }

        return value.toLocaleString("id-ID");
    };

    const getThumbnail = (video) => {
        if (!video) return "https://placehold.co/480x360?text=No+Image";

        const getYoutubeId = (url) => {
            if (!url) return null;
            const regExp =
                /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
            const match = url.match(regExp);
            return match && match[2].length === 11 ? match[2] : null;
        };

        const videoId = getYoutubeId(video.youtube_url || video.url_yt);

        if (videoId) {
            return `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;
        }

        return video.image_url || "https://placehold.co/480x360?text=No+Image";
    };

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
            month: "short",
            day: "numeric",
        });
    };

    const getRelativeTime = (dateString) => {
        if (!dateString) return "Recently";
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now - date);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 0) return "Today";
        if (diffDays === 1) return "Yesterday";
        if (diffDays < 7) return `${diffDays} days ago`;
        if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
        return `${Math.floor(diffDays / 30)} months ago`;
    };

    const handleTournamentClick = (tournamentId) => {
        router.visit(`/tournaments/${tournamentId}`);
    };

    return (
        <AppLayout>
            {/* Hero Section - Mobile Optimized */}
            <div className="relative min-h-screen overflow-hidden">
                {/* Background */}
                <div className="absolute inset-0 z-0">
                    <img
                        src={herobg}
                        alt="Hero Background"
                        loading="lazy"
                        className="relative w-full h-full object-cover "
                    />
                    <div className="absolute inset-0 bg-gradient-to-br from-[#0D0C0C]/10 via-[#0D0C0C]/20 to-[#0D0C0C]/50"></div>
                    <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-b from-transparent to-[#0D0C0C] pointer-events-none"></div>
                </div>

                {/* Animated Blobs */}
                <div className="absolute inset-0 z-10 overflow-hidden">
                    <div className="absolute top-10 left-5 md:top-20 md:left-10 w-48 h-48 md:w-72 md:h-72 bg-[#FF2146]/10 rounded-full blur-3xl animate-pulse"></div>
                    <div className="absolute bottom-10 right-5 md:bottom-20 md:right-10 w-64 h-64 md:w-96 md:h-96 bg-[#F2AF29]/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
                </div>

                {/* Content */}
                <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 md:px-8 min-h-screen flex items-center py-20 md:py-0">
                    <div className="w-full flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12">
                        {/* Text Content */}
                        <div
                            className={`w-full lg:w-4/5 xl:w-2/3 space-y-4 md:space-y-6 lg:space-y-8 text-center lg:text-left transform transition-all duration-1000 ${
                                isVisible
                                    ? "translate-x-0 opacity-100"
                                    : "-translate-x-10 opacity-0"
                            }`}
                        >
                            <br />
                            <br />
                            <br />
                            <br />
                            <div className="space-y-3 md:space-y-4 lg:space-y-6">
                                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black leading-tight text-white px-2">
                                    Selamat Datang di
                                    <br />
                                    <TypingEffect
                                        text={` <span class="bg-gradient-to-r from-[#FF2146] to-[#F2AF29] bg-clip-text text-transparent">Tekken Pekanbaru Community Hub</span>`}
                                        speed={80}
                                    />
                                </h1>
                                <p className="text-[#F2F2F2] text-sm sm:text-base md:text-lg lg:text-xl max-w-2xl leading-relaxed mx-auto lg:mx-0 px-2">
                                    Tempat seru buat kamu yang suka main
                                    kompetitif. Ikut turnamen, kenalan sama
                                    pemain lain, dan rebut posisi teratas di
                                    leaderboard. Mau main iseng atau jadi pro,
                                    semuanya bisa bersinar di sini.
                                </p>
                            </div>

                            {/* CTA Buttons */}
                            <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center lg:justify-start px-2">
                                <Link
                                    href={route("tournaments.index")}
                                    className="group relative px-6 md:px-8 py-3 md:py-4 bg-gradient-to-r from-[#FF2146] to-[#F2AF29] hover:from-[#FF2146]/90 hover:to-[#F2AF29]/90 text-[#F2F2F2] font-bold rounded-xl shadow-2xl transform hover:scale-105 active:scale-95 transition-all duration-300 flex items-center justify-center gap-2 overflow-hidden"
                                >
                                    <Gamepad2 className="w-4 h-4 md:w-5 md:h-5 z-10 flex-shrink-0" />
                                    <span className="z-10 text-sm md:text-base">
                                        Ikut Tournament
                                    </span>
                                    <div className="absolute inset-0 bg-white/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                </Link>
                                <Link href={route("about")}>
                                    <button className="w-full px-6 md:px-8 py-3 md:py-4 bg-gradient-to-r from-[#69747C]/20 to-[#69747C]/10 border-2 border-[#69747C] hover:border-[#F2AF29] text-[#F2F2F2] font-semibold rounded-xl transition-all duration-300 hover:bg-[#F2AF29]/10 hover:text-[#F2AF29] active:scale-95 text-sm md:text-base">
                                        Pelajari Tentang Kami
                                    </button>
                                </Link>
                            </div>

                            {/* Stats - Desktop */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 pt-4 lg:pt-8">
                                {stats.map((stat, index) => (
                                    <div
                                        key={index}
                                        className="text-center lg:text-left space-y-1"
                                    >
                                        <div className="text-xl lg:text-2xl xl:text-3xl font-black bg-gradient-to-r from-[#FF2146] to-[#F2AF29] bg-clip-text text-transparent break-words">
                                            {formatStatValue(
                                                stat.value,
                                                stat.label
                                            )}
                                        </div>
                                        <div className="text-[#69747C] text-xs lg:text-sm">
                                            {stat.label}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Character Image */}
                        <div
                            className={`w-full lg:w-2/5 xl:w-1/3 flex justify-center lg:justify-end transform transition-all duration-1000 delay-300 ${
                                isVisible
                                    ? "translate-x-0 opacity-100"
                                    : "translate-x-10 opacity-0"
                            }`}
                        ></div>

                        {/* Stats - Mobile */}
                        <div className="md:hidden grid grid-cols-2 gap-3 w-full pt-2 px-2">
                            {stats.map((stat, index) => (
                                <div
                                    key={index}
                                    className="text-center space-y-1 bg-gradient-to-br from-[#0D0C0C]/50 to-[#69747C]/10 backdrop-blur-sm border border-[#69747C]/20 rounded-lg p-3"
                                >
                                    <div className="text-lg sm:text-xl font-black bg-gradient-to-r from-[#FF2146] to-[#F2AF29] bg-clip-text text-transparent break-words">
                                        {formatStatValue(
                                            stat.value,
                                            stat.label
                                        )}
                                    </div>
                                    <div className="text-[#69747C] text-xs leading-tight">
                                        {stat.label}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="bg-gradient-to-b from-[#0D0C0C] to-[#0D0C0C]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-12 md:py-16 lg:py-20">
                    {/* Latest Video Tournament Section */}
                    <div ref={videoRef} className="mb-12 md:mb-16 lg:mb-20">
                        {videoInView && (
                            <>
                                <div className="flex items-center gap-2 md:gap-3 mb-6 md:mb-8">
                                    <div className="p-2 bg-gradient-to-r from-[#FF2146] to-[#F2AF29] rounded-lg md:rounded-xl flex-shrink-0">
                                        <Gamepad2 className="w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 text-[#F2F2F2]" />
                                    </div>
                                    <h2 className="text-[#F2F2F2] text-xl sm:text-2xl lg:text-3xl font-bold">
                                        Latest Live Tournament
                                    </h2>
                                </div>

                                {videoTournaments.length > 0 ? (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
                                        {videoTournaments.map((video) => (
                                            <div
                                                key={video.id}
                                                className="group relative overflow-hidden bg-gradient-to-br from-[#0D0C0C]/90 to-[#69747C]/20 backdrop-blur-xl border border-[#69747C]/30 rounded-xl md:rounded-2xl transition-all duration-500 hover:border-[#FF2146]/50 hover:transform hover:scale-[1.02]"
                                            >
                                                <div className="relative aspect-video overflow-hidden rounded-t-xl md:rounded-t-2xl">
                                                    <img
                                                        src={getThumbnail(
                                                            video
                                                        )}
                                                        alt={video.name}
                                                        loading="lazy"
                                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                                    />
                                                    <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-all duration-300"></div>
                                                    <div className="absolute inset-0 flex items-center justify-center">
                                                        <a
                                                            href={video.url_yt}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="w-12 h-12 md:w-16 md:h-16 bg-[#FF2146]/90 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300"
                                                        >
                                                            <div className="w-0 h-0 border-l-[10px] md:border-l-[12px] border-l-[#F2F2F2] border-t-[6px] md:border-t-[8px] border-t-transparent border-b-[6px] md:border-b-[8px] border-b-transparent ml-1"></div>
                                                        </a>
                                                    </div>
                                                </div>
                                                <div className="p-4 md:p-6">
                                                    <h3 className="text-[#F2F2F2] font-bold text-base md:text-lg mb-2 group-hover:text-[#FF2146] transition-colors line-clamp-2">
                                                        {video.name}
                                                    </h3>
                                                    <p className="text-[#69747C] text-xs md:text-sm leading-relaxed mb-3 line-clamp-2">
                                                        {video.description ||
                                                            "Watch the highlights from this amazing tournament"}
                                                    </p>
                                                    <div className="flex items-center justify-between text-xs text-[#69747C]">
                                                        <span>
                                                            {getRelativeTime(
                                                                video.start_date
                                                            )}
                                                        </span>
                                                        <span className="truncate ml-2">
                                                            {formatDate(
                                                                video.start_date
                                                            )}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="bg-gradient-to-br from-[#0D0C0C]/90 to-[#69747C]/20 backdrop-blur-xl border border-[#69747C]/30 rounded-xl md:rounded-2xl p-8 md:p-12 text-center">
                                        <Gamepad2 className="w-12 h-12 md:w-16 md:h-16 text-[#69747C] mx-auto mb-4" />
                                        <h3 className="text-[#F2F2F2] text-lg md:text-xl font-bold mb-2">
                                            No Video Content Available
                                        </h3>
                                        <p className="text-[#69747C] text-sm md:text-base">
                                            Tournament videos will be published
                                            here soon. Stay tuned!
                                        </p>
                                    </div>
                                )}
                            </>
                        )}
                    </div>

                    {/* Latest Tournament Section */}
                    <div
                        ref={tournamentRef}
                        className="bg-gradient-to-br from-[#0D0C0C]/90 to-[#69747C]/20 backdrop-blur-xl border border-[#69747C]/30 rounded-xl md:rounded-2xl p-4 md:p-6 lg:p-8 relative overflow-hidden"
                    >
                        {tournamentInView && (
                            <>
                                <div className="absolute inset-0 bg-gradient-to-r from-[#FF2146]/5 to-[#F2AF29]/5"></div>
                                <div className="relative z-10">
                                    <div className="flex items-center gap-2 md:gap-3 mb-6 lg:mb-8">
                                        <div className="p-2 bg-gradient-to-r from-[#FF2146] to-[#F2AF29] rounded-lg md:rounded-xl flex-shrink-0">
                                            <Trophy className="w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 text-[#F2F2F2]" />
                                        </div>
                                        <h2 className="text-[#F2F2F2] text-xl sm:text-2xl lg:text-3xl font-bold">
                                            Latest Tournament
                                        </h2>
                                    </div>

                                    {latestTournaments.length > 0 ? (
                                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 lg:gap-8">
                                            {latestTournaments.map(
                                                (tournament) => (
                                                    <div
                                                        key={tournament.id}
                                                        className="group relative overflow-hidden bg-gradient-to-r from-[#0D0C0C]/70 to-[#69747C]/20 rounded-lg md:rounded-xl border border-[#69747C]/20 hover:border-[#FF2146]/50 transition-all duration-300 hover:transform hover:scale-[1.02]"
                                                    >
                                                        <div className="p-4 md:p-6">
                                                            <div className="flex items-center justify-between mb-3 md:mb-4 gap-2">
                                                                <span
                                                                    className={`px-2 md:px-3 py-1 text-xs font-medium rounded-full ${tournament.status_color} flex-shrink-0`}
                                                                >
                                                                    {
                                                                        tournament.status
                                                                    }
                                                                </span>
                                                                <span className="text-[#69747C] text-xs md:text-sm truncate">
                                                                    {formatDate(
                                                                        tournament.start_date
                                                                    )}
                                                                </span>
                                                            </div>

                                                            <h3 className="text-[#F2F2F2] font-bold text-base md:text-lg lg:text-xl mb-2 md:mb-3 group-hover:text-[#FF2146] transition-colors line-clamp-2">
                                                                {
                                                                    tournament.name
                                                                }
                                                            </h3>

                                                            <p className="text-[#69747C] leading-relaxed text-xs md:text-sm mb-3 md:mb-4 line-clamp-2 md:line-clamp-3">
                                                                {tournament.description ||
                                                                    "Join this exciting tournament and compete with the best players!"}
                                                            </p>

                                                            <div className="grid grid-cols-2 gap-3 md:gap-4 mb-3 md:mb-4">
                                                                <div className="text-center bg-[#0D0C0C]/50 rounded-lg p-2 md:p-3">
                                                                    <div className="text-base md:text-lg font-bold bg-gradient-to-r from-[#FF2146] to-[#F2AF29] bg-clip-text text-transparent truncate">
                                                                        {formatCurrency(
                                                                            tournament.prize_pool
                                                                        )}
                                                                    </div>
                                                                    <div className="text-[#69747C] text-xs">
                                                                        Prize
                                                                        Pool
                                                                    </div>
                                                                </div>
                                                                <div className="text-center bg-[#0D0C0C]/50 rounded-lg p-2 md:p-3">
                                                                    <div className="text-base md:text-lg font-bold bg-gradient-to-r from-[#FF2146] to-[#F2AF29] bg-clip-text text-transparent">
                                                                        {
                                                                            tournament.participants
                                                                        }
                                                                        /
                                                                        {tournament.max_participants ||
                                                                            "∞"}
                                                                    </div>
                                                                    <div className="text-[#69747C] text-xs">
                                                                        Participants
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            {tournament.status ===
                                                                "Pendaftaran Dibuka" && (
                                                                <button
                                                                    onClick={() =>
                                                                        handleTournamentClick(
                                                                            tournament.id
                                                                        )
                                                                    }
                                                                    className="w-full px-3 md:px-4 py-2 bg-gradient-to-r from-[#FF2146] to-[#F2AF29] hover:from-[#FF2146]/90 hover:to-[#F2AF29]/90 text-[#F2F2F2] font-semibold text-sm md:text-base rounded-lg transition-all duration-300 transform hover:scale-105 active:scale-95"
                                                                >
                                                                    Register Now
                                                                </button>
                                                            )}

                                                            {tournament.status ===
                                                                "Selesai" && (
                                                                <button
                                                                    onClick={() =>
                                                                        handleTournamentClick(
                                                                            tournament.id
                                                                        )
                                                                    }
                                                                    className="w-full px-3 md:px-4 py-2 bg-gradient-to-r from-[#69747C]/20 to-[#69747C]/10 border border-[#69747C] hover:border-[#F2AF29] text-[#F2F2F2] font-semibold text-sm md:text-base rounded-lg transition-all duration-300 hover:bg-[#F2AF29]/10 hover:text-[#F2AF29] active:scale-95"
                                                                >
                                                                    View Results
                                                                </button>
                                                            )}
                                                        </div>
                                                    </div>
                                                )
                                            )}
                                        </div>
                                    ) : (
                                        <div className="text-center py-8 md:py-12">
                                            <Trophy className="w-12 h-12 md:w-16 md:h-16 text-[#69747C] mx-auto mb-4" />
                                            <h3 className="text-[#F2F2F2] text-lg md:text-xl font-bold mb-2">
                                                No Tournaments Available
                                            </h3>
                                            <p className="text-[#69747C] text-sm md:text-base">
                                                Check back soon for upcoming
                                                tournaments!
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
};

export default Welcome;
