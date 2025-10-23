// resources/js/Pages/Auth/CompleteRegistration.jsx
import React, { useState } from "react";
import { Head, useForm } from "@inertiajs/react";
import { Mail, Lock, User, AlertCircle, CheckCircle, Eye, EyeOff } from "lucide-react";
import logo from "@/images/tpcputih.png";

const CompleteRegistration = ({ userData }) => {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const { data, setData, post, processing, errors } = useForm({
        email: "",
        password: "",
        password_confirmation: "",
    });

    const gamerTag = userData?.player?.gamerTag || "Player";
    const prefix = userData?.player?.prefix;
    const fullName = prefix ? `${prefix} | ${gamerTag}` : gamerTag;
    const playerId = userData?.player?.id;
    const profileImage = userData?.images?.find((img) => img.type === "profile")?.url || null;
    const location = userData?.location?.city 
        ? `${userData.location.city}, ${userData.location.country}` 
        : userData?.location?.country || "Unknown";

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route("oauth.complete"), {
            onError: (errors) => {
                console.error("Registration errors:", errors);
            }
        });
    };

    return (
        <>
            <Head title="Complete Registration" />

            <div className="min-h-screen bg-gradient-to-br from-[#0D0C0C] via-[#1a1a1a] to-[#0D0C0C] flex items-center justify-center p-4">
                {/* Background Effects */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-20 left-10 w-72 h-72 bg-[#FF2146]/10 rounded-full blur-3xl animate-pulse"></div>
                    <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#F2AF29]/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
                </div>

                <div className="relative w-full max-w-md z-10">
                    {/* Logo */}
                    <div className="flex justify-center mb-6">
                        <img src={logo} alt="TPC Logo" className="w-24 h-24" />
                    </div>

                    {/* Card */}
                    <div className="bg-gradient-to-br from-[#0D0C0C]/90 to-[#1a1a1a]/90 backdrop-blur-xl border border-[#69747C]/30 rounded-2xl shadow-2xl overflow-hidden">
                        {/* Header */}
                        <div className="p-6 border-b border-[#69747C]/20 text-center">
                            <div className="flex justify-center mb-4">
                                {profileImage ? (
                                    <img
                                        src={profileImage}
                                        alt={fullName}
                                        className="w-20 h-20 rounded-full border-4 border-[#FF2146]/30 object-cover"
                                    />
                                ) : (
                                    <div className="w-20 h-20 rounded-full border-4 border-[#FF2146]/30 bg-gradient-to-r from-[#FF2146] to-[#F2AF29] flex items-center justify-center">
                                        <span className="text-white font-bold text-2xl">
                                            {gamerTag.charAt(0).toUpperCase()}
                                        </span>
                                    </div>
                                )}
                            </div>
                            <h1 className="text-2xl font-bold text-[#F2F2F2] mb-1">
                                Welcome, {fullName}!
                            </h1>
                            <p className="text-[#69747C] text-sm mb-3">
                                Complete your registration to join Tekken Pekanbaru Community
                            </p>
                            
                            {/* Player Info */}
                            <div className="space-y-2">
                                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#FF2146]/20 border border-[#FF2146]/30 rounded-full">
                                    <CheckCircle size={16} className="text-[#FF2146]" />
                                    <span className="text-xs text-[#FF2146] font-semibold">
                                        start.gg ID: {playerId}
                                    </span>
                                </div>
                                
                                {location && (
                                    <div className="text-xs text-[#69747C]">
                                        📍 {location}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Body */}
                        <div className="p-6">
                            <form onSubmit={handleSubmit} className="space-y-4">
                                {/* Player Name Display */}
                                <div>
                                    <label className="block text-sm font-medium text-[#F2F2F2] mb-2">
                                        Player Name
                                    </label>
                                    <div className="relative">
                                        <User
                                            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#69747C]"
                                            size={20}
                                        />
                                        <input
                                            type="text"
                                            value={fullName}
                                            disabled
                                            className="w-full pl-10 pr-4 py-3 bg-[#0D0C0C]/30 border border-[#69747C]/20 rounded-lg text-[#69747C] cursor-not-allowed"
                                        />
                                    </div>
                                    <p className="text-xs text-[#69747C] mt-1 flex items-center gap-1">
                                        <CheckCircle size={12} className="text-green-500" />
                                        Synced from start.gg
                                    </p>
                                </div>

                                {/* Email */}
                                <div>
                                    <label className="block text-sm font-medium text-[#F2F2F2] mb-2">
                                        Email <span className="text-[#FF2146]">*</span>
                                    </label>
                                    <div className="relative">
                                        <Mail
                                            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#69747C]"
                                            size={20}
                                        />
                                        <input
                                            type="email"
                                            value={data.email}
                                            onChange={(e) => setData("email", e.target.value)}
                                            className={`w-full pl-10 pr-4 py-3 bg-[#0D0C0C]/50 border rounded-lg text-[#F2F2F2] placeholder-[#69747C] focus:outline-none transition-colors ${
                                                errors.email 
                                                    ? "border-[#FF2146] focus:border-[#FF2146]" 
                                                    : "border-[#69747C]/30 focus:border-[#FF2146]"
                                            }`}
                                            placeholder="your@email.com"
                                            required
                                        />
                                    </div>
                                    {errors.email && (
                                        <div className="flex items-center gap-2 mt-2 text-[#FF2146] text-sm">
                                            <AlertCircle size={16} />
                                            <span>{errors.email}</span>
                                        </div>
                                    )}
                                    <p className="text-xs text-[#69747C] mt-1">
                                        We'll use this for important notifications
                                    </p>
                                </div>

                                {/* Password */}
                                <div>
                                    <label className="block text-sm font-medium text-[#F2F2F2] mb-2">
                                        Password <span className="text-[#FF2146]">*</span>
                                    </label>
                                    <div className="relative">
                                        <Lock
                                            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#69747C]"
                                            size={20}
                                        />
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            value={data.password}
                                            onChange={(e) => setData("password", e.target.value)}
                                            className={`w-full pl-10 pr-12 py-3 bg-[#0D0C0C]/50 border rounded-lg text-[#F2F2F2] placeholder-[#69747C] focus:outline-none transition-colors ${
                                                errors.password 
                                                    ? "border-[#FF2146] focus:border-[#FF2146]" 
                                                    : "border-[#69747C]/30 focus:border-[#FF2146]"
                                            }`}
                                            placeholder="Min. 6 characters"
                                            required
                                            minLength={6}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#69747C] hover:text-[#F2F2F2] transition-colors"
                                        >
                                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                        </button>
                                    </div>
                                    {errors.password && (
                                        <div className="flex items-center gap-2 mt-2 text-[#FF2146] text-sm">
                                            <AlertCircle size={16} />
                                            <span>{errors.password}</span>
                                        </div>
                                    )}
                                </div>

                                {/* Confirm Password */}
                                <div>
                                    <label className="block text-sm font-medium text-[#F2F2F2] mb-2">
                                        Confirm Password <span className="text-[#FF2146]">*</span>
                                    </label>
                                    <div className="relative">
                                        <Lock
                                            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#69747C]"
                                            size={20}
                                        />
                                        <input
                                            type={showConfirmPassword ? "text" : "password"}
                                            value={data.password_confirmation}
                                            onChange={(e) => setData("password_confirmation", e.target.value)}
                                            className="w-full pl-10 pr-12 py-3 bg-[#0D0C0C]/50 border border-[#69747C]/30 rounded-lg text-[#F2F2F2] placeholder-[#69747C] focus:outline-none focus:border-[#FF2146] transition-colors"
                                            placeholder="Re-enter password"
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#69747C] hover:text-[#F2F2F2] transition-colors"
                                        >
                                            {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                        </button>
                                    </div>
                                    {data.password && data.password_confirmation && data.password !== data.password_confirmation && (
                                        <div className="flex items-center gap-2 mt-2 text-[#FF2146] text-sm">
                                            <AlertCircle size={16} />
                                            <span>Passwords do not match</span>
                                        </div>
                                    )}
                                </div>

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    disabled={processing || data.password !== data.password_confirmation}
                                    className="w-full px-4 py-3 bg-gradient-to-r from-[#FF2146] to-[#F2AF29] hover:from-[#FF2146]/90 hover:to-[#F2AF29]/90 text-white font-bold rounded-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none relative overflow-hidden group"
                                >
                                    <span className="relative z-10">
                                        {processing ? "Creating Account..." : "Complete Registration"}
                                    </span>
                                    <div className="absolute inset-0 bg-white/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                </button>
                            </form>
                        </div>

                        {/* Footer */}
                        <div className="p-4 bg-[#0D0C0C]/50 border-t border-[#69747C]/20 text-center">
                            <p className="text-xs text-[#69747C]">
                                By completing registration, you agree to join{" "}
                                <span className="text-[#FF2146] font-semibold">Tekken Pekanbaru Community</span>
                            </p>
                        </div>
                    </div>

                    {/* Help Text */}
                    <div className="mt-6 text-center">
                        <p className="text-[#69747C] text-sm">
                            Having trouble?{" "}
                            <a href="mailto:support@tekkenpekanbaru.com" className="text-[#FF2146] hover:underline">
                                Contact Support
                            </a>
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
};

export default CompleteRegistration;