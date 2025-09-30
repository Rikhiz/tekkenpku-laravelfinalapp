import React, { useState, useEffect } from "react";
import AppLayout from "@/Layouts/AppLayout";
import TypingEffect from "@/Components/TypingEffect";
import { Trophy, Users, TrendingUp, Gamepad2 } from "lucide-react";
import tkchar from "@/images/tkchar.png";
import herobg from "@/images/hero-background.jpg";

const Welcome = ({
    videoTournaments = [],
    latestTournaments = [],
    stats = [],
}) => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        setIsVisible(true);
    }, []);

    const formatStatValue = (value, label) => {
        if (label === "Total Prize Pool") {
            return new Intl.NumberFormat("id-ID", {
                style: "currency",
                currency: "IDR",
                minimumFractionDigits: 0,
            }).format(value);
        }
        return value.toLocaleString("id-ID");
    };

    const getThumbnail = (video) => {
        if (!video) return "https://via.placeholder.com/480x360?text=No+Image";

        // helper ambil YouTube ID
        const getYoutubeId = (url) => {
            if (!url) return null;
            const regExp =
                /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
            const match = url.match(regExp);
            return match && match[2].length === 11 ? match[2] : null;
        };

        const videoId = getYoutubeId(video.youtube_url || video.url_yt);

        return (
            video.image_url ||
            "https://via.placeholder.com/480x360?text=No+Image"
        );
    };
    const formatCurrency = (amount) => {
        if (!amount) return "TBA";
        // Check if amount is already formatted string with "Rp"
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

    return (
        <AppLayout>
            {/* Hero Section */}
            <div className="relative h-screen overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <img
                        src={herobg}
                        alt="Hero Background"
                        className="w-full h-full object-cover blur-sm"
                    />
                    <div className="absolute inset-0 bg-gradient-to-br from-[#0D0C0C]/80 via-[#0D0C0C]/60 to-[#0D0C0C]/90"></div>
                </div>

                <div className="absolute inset-0 z-10">
                    <div className="absolute top-20 left-10 w-72 h-72 bg-[#FF2146]/10 rounded-full blur-3xl animate-pulse"></div>
                    <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#F2AF29]/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-radial from-[#FF2146]/5 to-transparent rounded-full"></div>
                </div>

                <div className="relative z-20 max-w-7xl mx-auto px-4 md:px-8 h-full flex items-center">
                    <div className="w-full flex flex-col lg:flex-row items-center justify-between h-full gap-8 lg:gap-12">
                        <div
                            className={`w-full lg:w-3/5 xl:w-2/3 space-y-6 lg:space-y-8 text-center lg:text-left transform transition-all duration-1000 ${
                                isVisible
                                    ? "translate-x-0 opacity-100"
                                    : "-translate-x-10 opacity-0"
                            }`}
                        >
                            <div className="space-y-4 lg:space-y-6">
                                <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black leading-tight text-white">
                                    Welcome to
                                    <br />
                                    <TypingEffect
                                        text={` <span class="bg-gradient-to-r from-[#FF2146] to-[#F2AF29] bg-clip-text text-transparent">Tekken Pekanbaru Comunity</span>`}
                                        speed={80}
                                    />
                                </h1>
                                <p className="text-[#F2F2F2] text-lg md:text-xl max-w-2xl leading-relaxed mx-auto lg:mx-0">
                                    Join thrilling competitions, connect with
                                    the community, and showcase your skills in
                                    the ultimate gaming arena.
                                </p>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                                <button className="group relative px-6 lg:px-8 py-3 lg:py-4 bg-gradient-to-r from-[#FF2146] to-[#F2AF29] hover:from-[#FF2146]/90 hover:to-[#F2AF29]/90 text-[#F2F2F2] font-bold rounded-xl shadow-2xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2 overflow-hidden">
                                    <Gamepad2 className="w-5 h-5 z-10" />
                                    <span className="z-10">
                                        Join Tournament
                                    </span>
                                    <div className="absolute inset-0 bg-white/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                </button>
                                <button className="px-6 lg:px-8 py-3 lg:py-4 bg-gradient-to-r from-[#69747C]/20 to-[#69747C]/10 border-2 border-[#69747C] hover:border-[#F2AF29] text-[#F2F2F2] font-semibold rounded-xl transition-all duration-300 hover:bg-[#F2AF29]/10 hover:text-[#F2AF29]">
                                    Learn More
                                </button>
                            </div>

                            <div className="hidden md:grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 pt-6 lg:pt-8">
                                {stats.map((stat, index) => (
                                    <div
                                        key={index}
                                        className="text-center lg:text-left space-y-1"
                                    >
                                        <div className="text-xl lg:text-2xl xl:text-3xl font-black bg-gradient-to-r from-[#FF2146] to-[#F2AF29] bg-clip-text text-transparent">
                                            {formatStatValue(stat.value, stat.label)}
                                        </div>
                                        <div className="text-[#69747C] text-sm">
                                            {stat.label}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div
                            className={`w-full lg:w-2/5 xl:w-1/3 flex justify-center lg:justify-end transform transition-all duration-1000 delay-300 ${
                                isVisible
                                    ? "translate-x-0 opacity-100"
                                    : "translate-x-10 opacity-0"
                            }`}
                        >
                            <div className="relative">
                                <div className="absolute inset-0 bg-gradient-to-r from-[#FF2146]/20 to-[#F2AF29]/20 rounded-full blur-3xl transform scale-110"></div>
                                <img
                                    src={tkchar}
                                    alt="Tekken Character"
                                    className="relative w-48 md:w-64 lg:w-80 xl:w-96 max-w-full h-auto object-contain drop-shadow-2xl hover:scale-105 transition-transform duration-500"
                                />
                            </div>
                        </div>

                        <div className="md:hidden grid grid-cols-2 gap-4 w-full pt-4">
                            {stats.map((stat, index) => (
                                <div
                                    key={index}
                                    className="text-center space-y-1"
                                >
                                    <div className="text-xl font-black bg-gradient-to-r from-[#FF2146] to-[#F2AF29] bg-clip-text text-transparent">
                                        {stat.value}
                                    </div>
                                    <div className="text-[#69747C] text-xs">
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
                <div className="max-w-7xl mx-auto px-4 md:px-8 py-16 lg:py-20">
                    {/* Latest Video Tournament Section */}
                    <div className="mb-16 lg:mb-20">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="p-2 lg:p-3 bg-gradient-to-r from-[#FF2146] to-[#F2AF29] rounded-xl">
                                <Gamepad2 className="w-5 h-5 lg:w-6 lg:h-6 text-[#F2F2F2]" />
                            </div>
                            <h2 className="text-[#F2F2F2] text-2xl lg:text-3xl font-bold">
                                Latest Video Tournament
                            </h2>
                        </div>

                        {videoTournaments.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8">
                                {videoTournaments.map((video, index) => (
                                    <div
                                        key={video.id}
                                        className="group relative overflow-hidden bg-gradient-to-br from-[#0D0C0C]/90 to-[#69747C]/20 backdrop-blur-xl border border-[#69747C]/30 rounded-2xl transition-all duration-500 hover:border-[#FF2146]/50 hover:transform hover:scale-105"
                                    >
                                        <div className="relative aspect-video overflow-hidden rounded-t-2xl">
                                            <img
                                                src={getThumbnail(video)}
                                                alt={video.name}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                            />
                                            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-all duration-300"></div>
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <a
                                                    href={video.url_yt}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="w-16 h-16 bg-[#FF2146]/90 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300"
                                                >
                                                    <div className="w-0 h-0 border-l-[12px] border-l-[#F2F2F2] border-t-[8px] border-t-transparent border-b-[8px] border-b-transparent ml-1"></div>
                                                </a>
                                            </div>
                                        </div>
                                        <div className="p-6">
                                            <h3 className="text-[#F2F2F2] font-bold text-lg mb-2 group-hover:text-[#FF2146] transition-colors line-clamp-2">
                                                {video.name}
                                            </h3>
                                            <p className="text-[#69747C] text-sm leading-relaxed mb-3 line-clamp-2">
                                                {video.description ||
                                                    "Watch the highlights from this amazing tournament"}
                                            </p>
                                            <div className="flex items-center justify-between text-xs text-[#69747C]">
                                                <span>
                                                    {getRelativeTime(
                                                        video.created_at
                                                    )}
                                                </span>
                                                <span>
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
                            <div className="bg-gradient-to-br from-[#0D0C0C]/90 to-[#69747C]/20 backdrop-blur-xl border border-[#69747C]/30 rounded-2xl p-12 text-center">
                                <Gamepad2 className="w-16 h-16 text-[#69747C] mx-auto mb-4" />
                                <h3 className="text-[#F2F2F2] text-xl font-bold mb-2">
                                    No Video Content Available
                                </h3>
                                <p className="text-[#69747C]">
                                    Tournament videos will be published here
                                    soon. Stay tuned!
                                </p>
                            </div>
                        )}
                    </div>

                    <br />

                    {/* Latest Tournament Section */}
                    <div className="bg-gradient-to-br from-[#0D0C0C]/90 to-[#69747C]/20 backdrop-blur-xl border border-[#69747C]/30 rounded-2xl p-6 lg:p-8 relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-r from-[#FF2146]/5 to-[#F2AF29]/5"></div>
                        <div className="relative z-10">
                            <div className="flex items-center gap-3 mb-6 lg:mb-8">
                                <div className="p-2 lg:p-3 bg-gradient-to-r from-[#FF2146] to-[#F2AF29] rounded-xl">
                                    <Trophy className="w-5 h-5 lg:w-6 lg:h-6 text-[#F2F2F2]" />
                                </div>
                                <h2 className="text-[#F2F2F2] text-2xl lg:text-3xl font-bold">
                                    Latest Tournament
                                </h2>
                            </div>

                            {latestTournaments.length > 0 ? (
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
                                    {latestTournaments.map((tournament) => (
                                        <div
                                            key={tournament.id}
                                            className="group relative overflow-hidden bg-gradient-to-r from-[#0D0C0C]/70 to-[#69747C]/20 rounded-xl border border-[#69747C]/20 hover:border-[#FF2146]/50 transition-all duration-300 hover:transform hover:scale-[1.02]"
                                        >
                                            <div className="p-6">
                                                <div className="flex items-center justify-between mb-4">
                                                    <span
                                                        className={`px-3 py-1 text-xs font-medium rounded-full ${tournament.status_color}`}
                                                    >
                                                        {tournament.status}
                                                    </span>
                                                    <span className="text-[#69747C] text-sm">
                                                        {formatDate(
                                                            tournament.start_date
                                                        )}
                                                    </span>
                                                </div>

                                                <h3 className="text-[#F2F2F2] font-bold text-xl mb-3 group-hover:text-[#FF2146] transition-colors line-clamp-2">
                                                    {tournament.name}
                                                </h3>

                                                <p className="text-[#69747C] leading-relaxed text-sm mb-4 line-clamp-3">
                                                    {tournament.description ||
                                                        "Join this exciting tournament and compete with the best players!"}
                                                </p>

                                                <div className="grid grid-cols-2 gap-4 mb-4">
                                                    <div className="text-center">
                                                        <div className="text-lg font-bold bg-gradient-to-r from-[#FF2146] to-[#F2AF29] bg-clip-text text-transparent">
                                                            {formatCurrency(
                                                                tournament.prize_pool
                                                            )}
                                                        </div>
                                                        <div className="text-[#69747C] text-xs">
                                                            Prize Pool
                                                        </div>
                                                    </div>
                                                    <div className="text-center">
                                                        <div className="text-lg font-bold bg-gradient-to-r from-[#FF2146] to-[#F2AF29] bg-clip-text text-transparent">
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
                                                    "UPCOMING" && (
                                                    <button className="w-full px-4 py-2 bg-gradient-to-r from-[#FF2146] to-[#F2AF29] hover:from-[#FF2146]/90 hover:to-[#F2AF29]/90 text-[#F2F2F2] font-semibold rounded-lg transition-all duration-300 transform hover:scale-105">
                                                        Register Now
                                                    </button>
                                                )}

                                                {tournament.status ===
                                                    "LIVE NOW" && (
                                                    <button className="w-full px-4 py-2 bg-gradient-to-r from-[#FF2146] to-[#F2AF29] hover:from-[#FF2146]/90 hover:to-[#F2AF29]/90 text-[#F2F2F2] font-semibold rounded-lg transition-all duration-300 transform hover:scale-105">
                                                        Watch Live
                                                    </button>
                                                )}

                                                {tournament.status ===
                                                    "COMPLETED" && (
                                                    <button className="w-full px-4 py-2 bg-gradient-to-r from-[#69747C]/20 to-[#69747C]/10 border border-[#69747C] hover:border-[#F2AF29] text-[#F2F2F2] font-semibold rounded-lg transition-all duration-300 hover:bg-[#F2AF29]/10 hover:text-[#F2AF29]">
                                                        View Results
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-12">
                                    <Trophy className="w-16 h-16 text-[#69747C] mx-auto mb-4" />
                                    <h3 className="text-[#F2F2F2] text-xl font-bold mb-2">
                                        No Tournaments Available
                                    </h3>
                                    <p className="text-[#69747C]">
                                        Check back soon for upcoming
                                        tournaments!
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
};

export default Welcome;
