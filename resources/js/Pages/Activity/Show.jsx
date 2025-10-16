import React, { useMemo, useEffect, useRef } from "react";
import AppLayout from "@/Layouts/AppLayout";
import {
    Calendar,
    MapPin,
    User,
    ArrowLeft,
    Clock,
    Info,
    BoomBox,
    Sparkles,
    Instagram,
} from "lucide-react";
import { router } from "@inertiajs/react";

const ActivityShow = ({ activity }) => {
    const instagramRef = useRef(null);

    // Generate Instagram embed HTML from URL
    const getInstagramEmbed = (url) => {
        if (!url) return null;

        let postUrl = url;

        if (
            url.includes("instagram.com/p/") ||
            url.includes("instagram.com/reel/")
        ) {
            postUrl = url.split("?")[0];
            postUrl = postUrl.replace(/\/$/, "");
        }

        return `
            <blockquote 
                class="instagram-media" 
                data-instgrm-permalink="${postUrl}/?utm_source=ig_embed&utm_campaign=loading"
                data-instgrm-version="14" 
                style="background:#FFF; border:0; border-radius:3px; box-shadow:0 0 1px 0 rgba(0,0,0,0.5),0 1px 10px 0 rgba(0,0,0,0.15); margin: 1px; max-width:540px; min-width:326px; padding:0; width:99.375%; width:-webkit-calc(100% - 2px); width:calc(100% - 2px);">
            </blockquote>
        `;
    };

    useEffect(() => {
        if (!activity.url_ig) return;

        const processInstagram = () => {
            if (window.instgrm && window.instgrm.Embeds) {
                console.log("🔁 Processing Instagram embed...");
                window.instgrm.Embeds.process();
            }
        };

        const loadInstagramScript = () => {
            const existingScript = document.querySelector(
                'script[src="https://www.instagram.com/embed.js"]'
            );

            if (existingScript) {
                // Sudah ada script → cukup proses ulang embed
                processInstagram();
            } else {
                // Belum ada → tambahkan script ke body
                const script = document.createElement("script");
                script.src = "https://www.instagram.com/embed.js";
                script.async = true;
                script.defer = true;
                script.onload = processInstagram;
                document.body.appendChild(script);
            }
        };

        // 🧠 Gunakan MutationObserver untuk pastikan DOM <blockquote> sudah siap
        const observer = new MutationObserver((mutations) => {
            const hasInstagramBlockquote = !!document.querySelector(
                "blockquote.instagram-media"
            );
            if (hasInstagramBlockquote) {
                console.log(
                    "✅ Instagram blockquote detected, loading embed..."
                );
                observer.disconnect();
                setTimeout(loadInstagramScript, 400); // delay 400ms biar DOM benar-benar siap
            }
        });

        observer.observe(document.body, { childList: true, subtree: true });

        // Jalankan fallback kalau observer gagal mendeteksi (misalnya embed langsung ada)
        const fallbackTimer = setTimeout(() => {
            loadInstagramScript();
        }, 800);

        return () => {
            clearTimeout(fallbackTimer);
            observer.disconnect();
        };
    }, [activity.url_ig]);

    const instagramEmbedHTML = useMemo(() => {
        return getInstagramEmbed(activity.url_ig);
    }, [activity.url_ig]);

    const formatDate = (dateString) => {
        if (!dateString) return "TBA";
        const date = new Date(dateString);
        return date.toLocaleDateString("id-ID", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    const formatTime = (dateString) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        return date.toLocaleTimeString("id-ID", {
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    return (
        <AppLayout>
            <div className="min-h-screen bg-gradient-to-b from-[#0D0C0C] via-[#0D0C0C] to-[#1A1A1A]">
                {/* Hero Section */}
                <div className="relative h-[40vh] md:h-[60vh] overflow-hidden">
                    <div className="absolute inset-0">
                        <img
                            src={
                                activity.image_url ||
                                "https://picsum.photos/1920/1080?random=1"
                            }
                            alt={activity.name}
                            className="w-full h-full object-cover"
                            loading="eager"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0D0C0C] via-[#0D0C0C]/80 to-[#0D0C0C]/60"></div>
                    </div>

                    <div className="relative h-full max-w-7xl mx-auto px-4 md:px-8 flex flex-col justify-end pb-6 md:pb-12">
                        <div className="space-y-3 md:space-y-4 mt-16 md:mt-0">
                            <div className="flex flex-wrap gap-2 md:gap-3">
                                <div
                                    className={`${
                                        activity.status === "Mendatang"
                                            ? "bg-[#FF2146]/80 border-[#FF2146]/40"
                                            : "bg-gray-700/60 border-gray-500/40"
                                    } border backdrop-blur-sm rounded-full px-3 md:px-4 py-1 md:py-2 text-xs md:text-base text-white`}
                                >
                                    <span className="font-semibold">
                                        {activity.status === "Mendatang"
                                            ? "🔥 Upcoming Event"
                                            : "✓ Past Event"}
                                    </span>
                                </div>
                            </div>

                            <h1 className="text-2xl md:text-4xl lg:text-6xl font-black text-white leading-tight drop-shadow-lg">
                                {activity.name}
                            </h1>

                            <button
                                onClick={() => router.visit("/activity")}
                                className="absolute top-20 md:top-32 left-4 md:left-8 flex items-center gap-1.5 md:gap-2 text-white hover:text-[#F2AF29] transition-colors bg-[#0D0C0C]/80 backdrop-blur-md px-3 md:px-4 py-2 md:py-2.5 rounded-lg border border-[#FF2146]/30 hover:border-[#F2AF29]/60 text-sm md:text-base z-30 shadow-lg"
                            >
                                <ArrowLeft className="w-4 h-4 md:w-5 md:h-5" />
                                <span className="font-semibold">Back</span>
                            </button>

                            <div className="flex flex-wrap gap-3 md:gap-6 text-white text-xs md:text-base">
                                {activity.tanggal_kegiatan && (
                                    <div className="flex items-center gap-1.5 md:gap-2">
                                        <Calendar className="w-4 h-4 md:w-5 md:h-5 text-[#FF2146]" />
                                        <span>
                                            {formatDate(
                                                activity.tanggal_kegiatan
                                            )}
                                        </span>
                                    </div>
                                )}
                                {formatTime(activity.tanggal_kegiatan) && (
                                    <div className="flex items-center gap-1.5 md:gap-2">
                                        <Clock className="w-4 h-4 md:w-5 md:h-5 text-[#F2AF29]" />
                                        <span>
                                            {formatTime(
                                                activity.tanggal_kegiatan
                                            )}
                                        </span>
                                    </div>
                                )}
                                <div className="flex items-center gap-1.5 md:gap-2">
                                    <MapPin className="w-4 h-4 md:w-5 md:h-5 text-[#FF2146]" />
                                    <span>{activity.alamat}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="max-w-7xl mx-auto px-4 md:px-8 py-6 md:py-12">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-8">
                        {/* Left Column */}
                        <div className="lg:col-span-2 space-y-4 md:space-y-8">
                            {/* Description */}
                            <div className="bg-gradient-to-br from-[#1A1A1A]/70 to-[#0D0C0C]/80 border border-[#FF2146]/30 rounded-2xl p-6 backdrop-blur-xl shadow-xl">
                                <h2 className="text-2xl font-bold text-[#F2AF29] mb-3 flex items-center gap-2">
                                    <Info className="w-6 h-6 text-[#FF2146]" />
                                    Activity Details
                                </h2>
                                <p className="text-gray-300 text-base leading-relaxed whitespace-pre-line">
                                    {activity.description ||
                                        "No description available for this activity."}
                                </p>
                            </div>

                            {/* Image */}
                            {activity.image_url && (
                                <div className="bg-gradient-to-br from-[#1A1A1A]/70 to-[#0D0C0C]/80 border border-[#FF2146]/30 rounded-2xl p-6 backdrop-blur-xl shadow-xl">
                                    <h2 className="text-2xl font-bold text-[#F2AF29] mb-3 flex items-center gap-2">
                                        <BoomBox className="w-6 h-6 text-[#FF2146]" />
                                        Event Photos
                                    </h2>
                                    <div className="rounded-lg overflow-hidden border border-[#FF2146]/30">
                                        <img
                                            src={activity.image_url}
                                            alt={activity.name}
                                            className="w-full h-full object-cover"
                                            loading="lazy"
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Instagram Embed */}
                            {activity.url_ig && instagramEmbedHTML && (
                                <div className="bg-gradient-to-br from-[#1A1A1A]/70 to-[#0D0C0C]/80 border border-[#FF2146]/30 rounded-2xl p-6 backdrop-blur-xl shadow-xl">
                                    <h2 className="text-2xl font-bold text-[#F2AF29] mb-4 flex items-center gap-2">
                                        <Instagram className="w-6 h-6 text-pink-500" />
                                        Activity Highlights
                                    </h2>
                                    <div
                                        ref={instagramRef}
                                        className="flex justify-center items-center"
                                    >
                                        <div
                                            className="w-full max-w-xl mx-auto"
                                            dangerouslySetInnerHTML={{
                                                __html: instagramEmbedHTML,
                                            }}
                                        />
                                    </div>
                                    <p className="text-gray-400 text-sm mt-3 text-center">
                                        Check out our Instagram for more
                                        activity moments
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Right Column */}
                        <div className="space-y-6">
                            <div className="bg-gradient-to-br from-[#1A1A1A]/70 to-[#0D0C0C]/80 border border-[#FF2146]/30 rounded-2xl p-6 backdrop-blur-xl shadow-xl">
                                <h3 className="text-xl font-bold text-[#F2AF29] mb-4">
                                    Event Information
                                </h3>

                                <div className="space-y-4 text-white">
                                    {activity.tanggal_kegiatan && (
                                        <div className="pb-3 border-b border-[#FF2146]/30">
                                            <div className="flex gap-2">
                                                <Calendar className="w-5 h-5 text-[#FF2146]" />
                                                <div>
                                                    <p className="text-gray-400 text-sm">
                                                        Date & Time
                                                    </p>
                                                    <p className="font-semibold">
                                                        {formatDate(
                                                            activity.tanggal_kegiatan
                                                        )}
                                                    </p>
                                                    {formatTime(
                                                        activity.tanggal_kegiatan
                                                    ) && (
                                                        <p className="text-[#F2AF29] text-sm">
                                                            {formatTime(
                                                                activity.tanggal_kegiatan
                                                            )}{" "}
                                                            WIB
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    <div className="pb-3 border-b border-[#FF2146]/30">
                                        <div className="flex gap-2">
                                            <MapPin className="w-5 h-5 text-[#F2AF29]" />
                                            <div>
                                                <p className="text-gray-400 text-sm">
                                                    Location
                                                </p>
                                                <p className="font-semibold">
                                                    {activity.alamat}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="pb-3 border-b border-[#FF2146]/30">
                                        <div className="flex gap-2">
                                            <User className="w-5 h-5 text-[#FF2146]" />
                                            <div>
                                                <p className="text-gray-400 text-sm">
                                                    Organized By
                                                </p>
                                                <p className="font-semibold">
                                                    {activity.created_by}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <div className="flex gap-2">
                                            <Info className="w-5 h-5 text-[#F2AF29]" />
                                            <div>
                                                <p className="text-gray-400 text-sm">
                                                    Status
                                                </p>
                                                <p
                                                    className={`font-bold ${
                                                        activity.status ===
                                                        "Mendatang"
                                                            ? "text-[#F2AF29]"
                                                            : "text-gray-400"
                                                    }`}
                                                >
                                                    {activity.status}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Social Links */}
                            {activity.url_ig && (
                                <div className="bg-gradient-to-br from-[#1A1A1A]/70 to-[#0D0C0C]/80 border border-[#FF2146]/30 rounded-2xl p-6 backdrop-blur-xl shadow-xl">
                                    <h3 className="text-xl font-bold text-[#F2AF29] mb-3">
                                        Social Media
                                    </h3>
                                    <a
                                        href={activity.url_ig}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-3 p-3 rounded-lg bg-pink-500/10 border border-pink-500/30 hover:bg-pink-500/20 transition-all duration-300 group"
                                    >
                                        <Instagram className="w-5 h-5 text-pink-500 flex-shrink-0" />
                                        <span className="text-white font-semibold flex-1">
                                            View on Instagram
                                        </span>
                                        <ArrowLeft className="w-4 h-4 text-gray-400 group-hover:text-pink-500 transition-colors rotate-180" />
                                    </a>
                                </div>
                            )}

                            <div className="bg-gradient-to-br from-[#1A1A1A]/70 to-[#0D0C0C]/80 border border-[#FF2146]/30 rounded-2xl p-6 backdrop-blur-xl shadow-xl">
                                <h3 className="text-xl font-bold text-[#F2AF29] mb-3">
                                    More Events
                                </h3>
                                <button
                                    onClick={() => router.visit("/activity")}
                                    className="w-full px-4 py-2.5 bg-gradient-to-r from-[#FF2146] to-[#F2AF29] hover:from-[#F2AF29] hover:to-[#FF2146] text-white font-semibold rounded-lg transition-all hover:scale-105"
                                >
                                    Browse All Activities
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
};

export default ActivityShow;
