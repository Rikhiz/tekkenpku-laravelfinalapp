import React, { useState, useMemo } from "react";
import AppLayout from "@/Layouts/AppLayout";
import {
    Calendar,
    MapPin,
    User,
    Filter,
    BoomBox,
    Clock,
    ArrowRight,
    Sparkles,
} from "lucide-react";
import { router } from "@inertiajs/react";
import herobg from "@/images/activity.jpg";

const ActivityIndex = ({
    activities = [],
    upcomingActivities = [],
    completedActivities = [],
    loading = false,
}) => {
    const [filterStatus, setFilterStatus] = useState("all");

    const statusConfig = {
        Mendatang: {
            bgColor: "bg-gradient-to-r from-blue-600 to-cyan-500",
            textColor: "text-white",
            borderColor: "border-blue-400",
            icon: "🔥",
            pulse: true,
        },
        Selesai: {
            bgColor: "bg-gradient-to-r from-gray-700 to-gray-600",
            textColor: "text-gray-200",
            borderColor: "border-gray-400",
            icon: "✓",
        },
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

    const formatTime = (dateString) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        return date.toLocaleTimeString("id-ID", {
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const handleActivityClick = (activityId) => {
        router.visit(`/activity/${activityId}`);
    };

    const filteredActivities = useMemo(() => {
        if (filterStatus === "all") return activities;
        return activities.filter(
            (activity) => activity.status === filterStatus
        );
    }, [activities, filterStatus]);

    return (
        <AppLayout>
            <div className="min-h-screen bg-gradient-to-b from-[#0D0C0C] via-[#0D0C0C] to-[#1a1a1a]">
                {/* Hero Header with Different Style */}
                <div className="relative py-12 sm:py-16 md:py-24 lg:py-52 text-center overflow-hidden">
                    <img
                        src={herobg}
                        alt="Activity Background"
                        className="absolute inset-0 w-full h-full object-cover blur-sm"
                        loading="eager"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-[#0D0C0C]/80 via-[#0D0C0C]/70 to-[#0D0C0C]/80"></div>

                    <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-b from-transparent to-[#0D0C0C] pointer-events-none"></div>

                    <br />
                    <br />
                    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 md:px-8 flex flex-col items-center">
                        {/* Icon & Title */}
                        <div className="flex items-center gap-4 mb-4">
                            <BoomBox className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 text-[#FF2146] drop-shadow-2xl" />
                            <h1 className="text-2xl sm:text-3xl md:text-5xl lg:text-7xl font-black text-white">
                                <span className="bg-gradient-to-r from-[#FF2146] to-[#F2AF29] bg-clip-text text-transparent">
                                    Community Activities
                                </span>
                            </h1>
                        </div>

                        {/* Subtext */}
                        <p className="text-xs sm:text-sm md:text-lg text-gray-200 max-w-2xl mx-auto px-4 mb-6 md:mb-8">
                            Join our community events, meetups, and special
                            activities
                        </p>

                        {/* Activity Stats */}
                        <div className="grid grid-cols-2 gap-4 md:gap-6 w-full max-w-md">
                            <div className="bg-[#FF2146]/20 backdrop-blur-xl border border-[#FF2146]/30 rounded-xl p-4">
                                <div className="text-3xl md:text-4xl font-black text-[#FF2146] mb-1">
                                    {upcomingActivities.length}
                                </div>
                                <div className="text-xs md:text-sm text-gray-300">
                                    Upcoming Events
                                </div>
                            </div>
                            <div className="bg-[#F2AF29]/20 backdrop-blur-xl border border-[#F2AF29]/30 rounded-xl p-4">
                                <div className="text-3xl md:text-4xl font-black text-[#F2AF29] mb-1">
                                    {completedActivities.length}
                                </div>
                                <div className="text-xs md:text-sm text-gray-300">
                                    Past Events
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <br />

                {/* Filters */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 mb-6 md:mb-8">
                    <div className="bg-gradient-to-r from-[#0D0C0C]/90 to-[#69747C]/20 backdrop-blur-xl border border-[#69747C]/30 rounded-xl md:rounded-2xl p-4 md:p-6">
                        <div className="flex items-center gap-2 md:gap-3 mb-3 md:mb-4">
                            <Filter className="w-4 h-4 md:w-5 md:h-5 text-[#FF2146] flex-shrink-0" />
                            <h3 className="text-white font-bold text-sm md:text-base lg:text-lg">
                                Filter Activities
                            </h3>
                        </div>

                        <div className="max-w-md">
                            <label className="text-gray-400 text-xs md:text-sm mb-1.5 md:mb-2 block">
                                Status
                            </label>
                            <select
                                value={filterStatus}
                                onChange={(e) =>
                                    setFilterStatus(e.target.value)
                                }
                                className="w-full bg-[#0D0C0C] border border-[#FF2146]/30 rounded-lg px-3 md:px-4 py-2 text-sm md:text-base text-white focus:border-[#FF2146] focus:outline-none"
                            >
                                <option value="all">All Activities</option>
                                <option value="Mendatang">
                                    Upcoming Events
                                </option>
                                <option value="Selesai">Past Events</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Activities Grid - Different Layout */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 pb-12 md:pb-20">
                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                            {[...Array(4)].map((_, i) => (
                                <div
                                    key={i}
                                    className="animate-pulse bg-[#1a1a1a] rounded-xl h-64"
                                ></div>
                            ))}
                        </div>
                    ) : filteredActivities.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                            {filteredActivities.map((activity) => {
                                const statConfig =
                                    statusConfig[activity.status] ||
                                    statusConfig["Selesai"];

                                return (
                                    <div
                                        key={activity.slug}
                                        onClick={() =>
                                            handleActivityClick(activity.slug)
                                        }
                                        className="group relative overflow-hidden bg-[#F2AF29]/20 backdrop-blur-xl border border-[#F2AF29]/30 rounded-2xl transition-all duration-300 hover:border-[#F2AF29]/30 hover:shadow-lg hover:shadow-[#F2AF29]/20 cursor-pointer"
                                    >
                                        {/* Horizontal Layout */}
                                        <div className="flex flex-col sm:flex-row">
                                            {/* Image Section - Left Side */}
                                            <div className="relative w-full sm:w-64 h-48 sm:h-auto overflow-hidden flex-shrink-0">
                                                <img
                                                    src={
                                                        activity.image_url ||
                                                        "https://picsum.photos/400/300?random=" +
                                                            activity.slug
                                                    }
                                                    alt={activity.name}
                                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                                    loading="lazy"
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-r sm:bg-gradient-to-t from-[#0D0C0C] to-transparent"></div>

                                                {/* Status Badge */}
                                                <div className="absolute top-3 left-3">
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
                                                            {activity.status}
                                                        </span>
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Content Section - Right Side */}
                                            <div className="flex flex-col flex-grow p-5 md:p-6">
                                                <h3 className="text-white font-bold text-lg md:text-xl leading-tight mb-3 group-hover:text-[#F2AF29] transition-colors line-clamp-2">
                                                    {activity.name}
                                                </h3>

                                                {activity.description && (
                                                    <p className="text-gray-400 text-sm leading-relaxed mb-4 line-clamp-2">
                                                        {activity.description}
                                                    </p>
                                                )}

                                                <div className="space-y-3 mb-4">
                                                    {activity.tanggal_kegiatan && (
                                                        <div className="flex items-center gap-2 text-sm">
                                                            <Calendar className="w-4 h-4 text-purple-400 flex-shrink-0" />
                                                            <span className="text-gray-300">
                                                                {formatDate(
                                                                    activity.tanggal_kegiatan
                                                                )}
                                                            </span>
                                                            {formatTime(
                                                                activity.tanggal_kegiatan
                                                            ) && (
                                                                <>
                                                                    <Clock className="w-4 h-4 text-blue-400 flex-shrink-0 ml-2" />
                                                                    <span className="text-gray-300">
                                                                        {formatTime(
                                                                            activity.tanggal_kegiatan
                                                                        )}
                                                                    </span>
                                                                </>
                                                            )}
                                                        </div>
                                                    )}

                                                    <div className="flex items-start gap-2 text-sm">
                                                        <MapPin className="w-4 h-4 text-pink-400 flex-shrink-0 mt-0.5" />
                                                        <span className="text-gray-300 line-clamp-2">
                                                            {activity.alamat}
                                                        </span>
                                                    </div>

                                                    <div className="flex items-center gap-2 text-sm">
                                                        <User className="w-4 h-4 text-blue-400 flex-shrink-0" />
                                                        <span className="text-gray-400">
                                                            Organized by{" "}
                                                        </span>
                                                        <span className="text-white font-semibold">
                                                            {
                                                                activity.created_by
                                                            }
                                                        </span>
                                                    </div>
                                                </div>

                                                {/* View Details Button */}
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleActivityClick(
                                                            activity.slug
                                                        );
                                                    }}
                                                    className="mt-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-[#FF2146] to-[#F2AF29] hover:from-[#F2AF29] hover:to-[#FF2146] text-white font-semibold text-sm rounded-lg transition-all duration-300 group-hover:scale-105 active:scale-95"
                                                >
                                                    <span>View Details</span>
                                                    <ArrowRight className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>

                                        {/* Decorative Elements */}
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-[#FF2146]/10 rounded-full blur-3xl"></div>
                                        <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#FF2146]/20 rounded-full blur-3xl"></div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="text-center py-12 md:py-20">
                            <BoomBox className="w-16 h-16 md:w-20 md:h-20 text-[#FF2146] mx-auto mb-4 md:mb-6" />
                            <h3 className="text-white text-xl md:text-2xl font-bold mb-2">
                                No Activities Found
                            </h3>
                            <p className="text-gray-400 text-sm md:text-base px-4">
                                Check back later for upcoming community events
                            </p>
                        </div>
                    )}
                </div>

                {/* Upcoming Highlight Section */}
                {upcomingActivities.length > 0 && filterStatus === "all" && (
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 pb-12 md:pb-20">
                        <div className="bg-gradient-to-r from-[#FF2146] to-[#F2AF29] backdrop-blur-xl border border-[#F2AF29]/30 rounded-2xl p-6 md:p-8">
                            <div className="flex items-center gap-3 mb-6">
                                <Sparkles className="w-6 h-6 text-[#F2AF29]" />
                                <h2 className="text-2xl md:text-3xl font-black text-white">
                                    Don't Miss Out!
                                </h2>
                            </div>
                            <p className="text-gray-300 text-sm md:text-base mb-4">
                                We have{" "}
                                <span className="text-[#F2AF29] font-bold">
                                    {upcomingActivities.length}
                                </span>{" "}
                                upcoming event
                                {upcomingActivities.length > 1 ? "s" : ""}{" "}
                                waiting for you. Join us and be part of the
                                community!
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </AppLayout>
    );
};

export default ActivityIndex;
