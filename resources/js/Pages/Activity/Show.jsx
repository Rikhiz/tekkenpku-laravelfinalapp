import React from "react";
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
} from "lucide-react";
import { router } from "@inertiajs/react";

const ActivityShow = ({ activity }) => {
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
                    {/* Background Image */}
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

                    {/* Content */}
                    <div className="relative h-full max-w-7xl mx-auto px-4 md:px-8 flex flex-col justify-end pb-6 md:pb-12">
                        <div className="space-y-3 md:space-y-4 mt-16 md:mt-0">
                            {/* Status Badge */}
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

                            {/* Title */}
                            <h1 className="text-2xl md:text-4xl lg:text-6xl font-black text-white leading-tight drop-shadow-lg">
                                {activity.name}
                            </h1>

                            {/* Back Button */}
                            <button
                                onClick={() => router.visit("/activity")}
                                className="absolute top-20 md:top-32 left-4 md:left-8 flex items-center gap-1.5 md:gap-2 text-white hover:text-[#F2AF29] transition-colors bg-[#0D0C0C]/80 backdrop-blur-md px-3 md:px-4 py-2 md:py-2.5 rounded-lg border border-[#FF2146]/30 hover:border-[#F2AF29]/60 text-sm md:text-base z-30 shadow-lg"
                            >
                                <ArrowLeft className="w-4 h-4 md:w-5 md:h-5" />
                                <span className="font-semibold">Back</span>
                            </button>

                            {/* Quick Info */}
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
                                <p className="text-gray-300 text-base leading-relaxed">
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
                                        />
                                    </div>
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
                                                    <p className="text-[#F2AF29] text-sm">
                                                        {formatTime(
                                                            activity.tanggal_kegiatan
                                                        )}{" "}
                                                        WIB
                                                    </p>
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
