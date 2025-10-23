import React from "react";
import AppLayout from "@/Layouts/AppLayout";
import { Card, CardContent } from "@/Components/card";
import { User, Mail, Calendar, Shield, Gamepad2 } from "lucide-react";

const Profile = ({ auth }) => {
    const user = auth.user;

    return (
        <AppLayout>
            <div className="min-h-screen bg-gradient-to-b from-[#0D0C0C] to-[#0D0C0C] flex items-center justify-center px-4 py-15">
                <div className="relative w-full max-w-5xl bg-gradient-to-br from-[#0D0C0C]/80 to-[#69747C]/10 border border-[#69747C]/30 backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden p-6 md:p-10">
                    {/* Glow Accents */}
                    <div className="absolute top-0 left-0 w-64 h-64 bg-[#FF2146]/20 rounded-full blur-3xl -z-10"></div>
                    <div className="absolute bottom-0 right-0 w-64 h-64 bg-[#F2AF29]/20 rounded-full blur-3xl -z-10"></div>

                    {/* Header */}
                    <div className="flex flex-col md:flex-row items-center gap-6 md:gap-10 mb-8">
                        <img
                            src={
                                user.avatar ||
                                "https://placehold.co/200x200?text=No+Avatar"
                            }
                            alt="Profile"
                            className="w-36 h-36 md:w-48 md:h-48 rounded-full object-cover border-4 border-[#FF2146]/70 shadow-lg"
                        />
                        <div className="text-center md:text-left space-y-2">
                            <h1 className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-[#FF2146] to-[#F2AF29] bg-clip-text text-transparent">
                                {user.name}
                            </h1>
                            <p className="text-[#69747C] text-sm md:text-base">
                                {user.role === "admin" ? (
                                    <span className="text-[#FF2146] font-semibold">
                                        Admin
                                    </span>
                                ) : (
                                    "Player"
                                )}
                            </p>
                        </div>
                    </div>

                    {/* Info Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-[#F2F2F2]">
                        <Card className="bg-gradient-to-br from-[#0D0C0C]/90 to-[#69747C]/10 border border-[#69747C]/30 rounded-xl">
                            <CardContent className="p-4 flex items-center gap-4">
                                <Mail className="w-5 h-5 text-[#F2AF29]" />
                                <div>
                                    <div className="text-xs text-[#69747C]">
                                        Email
                                    </div>
                                    <div>{user.email || "Tidak tersedia"}</div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="bg-gradient-to-br from-[#0D0C0C]/90 to-[#69747C]/10 border border-[#69747C]/30 rounded-xl">
                            <CardContent className="p-4 flex items-center gap-4">
                                <Gamepad2 className="w-5 h-5 text-[#FF2146]" />
                                <div>
                                    <div className="text-xs text-[#69747C]">
                                        StartGG ID
                                    </div>
                                    <div>{user.sgguserid || "Belum terhubung"}</div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="bg-gradient-to-br from-[#0D0C0C]/90 to-[#69747C]/10 border border-[#69747C]/30 rounded-xl">
                            <CardContent className="p-4 flex items-center gap-4">
                                <Calendar className="w-5 h-5 text-[#F2AF29]" />
                                <div>
                                    <div className="text-xs text-[#69747C]">
                                        Bergabung Sejak
                                    </div>
                                    <div>
                                        {new Date(
                                            user.created_at
                                        ).toLocaleDateString("id-ID", {
                                            year: "numeric",
                                            month: "long",
                                            day: "numeric",
                                        })}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="bg-gradient-to-br from-[#0D0C0C]/90 to-[#69747C]/10 border border-[#69747C]/30 rounded-xl">
                            <CardContent className="p-4 flex items-center gap-4">
                                <Shield className="w-5 h-5 text-[#FF2146]" />
                                <div>
                                    <div className="text-xs text-[#69747C]">
                                        Role
                                    </div>
                                    <div className="capitalize">
                                        {user.role}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
};

export default Profile;
