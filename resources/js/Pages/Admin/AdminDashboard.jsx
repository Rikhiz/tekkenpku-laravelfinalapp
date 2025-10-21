import React from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import { Users, Trophy, Image, Gamepad2 } from "lucide-react";

const AdminDashboard = ({ auth, stats }) => {
    return (
        <AdminLayout user={auth.user}>
            <div className="space-y-6">
                {/* Welcome Section */}
                <div className="bg-gray-800 rounded-2xl p-6">
                    <h1 className="text-3xl font-bold text-white mb-2">
                        Welcome back, {auth.user.name}!
                    </h1>
                    <p className="text-gray-400">
                        Ini adalah halaman utama admin panel kamu.
                    </p>
                </div>

                {/* Statistics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-700 hover:border-gray-600 transition-colors">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-400 text-sm font-medium mb-1">
                                    Total Users
                                </p>
                                <p className="text-3xl font-bold text-white">
                                    {stats.users}
                                </p>
                            </div>
                            <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
                                <Users size={24} className="text-white" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-700 hover:border-gray-600 transition-colors">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-400 text-sm font-medium mb-1">
                                    Tournaments
                                </p>
                                <p className="text-3xl font-bold text-white">
                                    {stats.tournaments}
                                </p>
                            </div>
                            <div className="w-12 h-12 bg-yellow-500 rounded-xl flex items-center justify-center">
                                <Trophy size={24} className="text-white" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-700 hover:border-gray-600 transition-colors">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-400 text-sm font-medium mb-1">
                                    Galleries
                                </p>
                                <p className="text-3xl font-bold text-white">
                                    {stats.galleries}
                                </p>
                            </div>
                            <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center">
                                <Image size={24} className="text-white" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-700 hover:border-gray-600 transition-colors">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-400 text-sm font-medium mb-1">
                                    StartGG Relations
                                </p>
                                <p className="text-3xl font-bold text-white">
                                    {stats.relasi}
                                </p>
                            </div>
                            <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
                                <Gamepad2 size={24} className="text-white" />
                            </div>
                        </div>
                    </div>
                </div>
                {/* Rules Card */}
                <div className="bg-gradient-to-r from-blue-900 to-blue-800 border border-blue-500 rounded-xl p-6 shadow-lg">
                    <h3 className="text-blue-100 font-semibold mb-3 flex items-center gap-2 text-lg">
                        ⚙️ Urutan Sinkronisasi Data
                    </h3>

                    <ol className="list-decimal list-inside text-blue-50 space-y-2 text-sm leading-relaxed">
                        <li>
                            <span className="font-semibold text-blue-200">
                                Atur Tournament Data
                            </span>{" "}
                            — pastikan seluruh informasi turnamen (nama,
                            kategori, tanggal, dan status) sudah benar sebelum
                            lanjut.
                        </li>
                        <li>
                            <span className="font-semibold text-blue-200">
                                Sync User
                            </span>{" "}
                            — sinkronkan data pengguna agar akun yang
                            berpartisipasi sudah terhubung dengan sistem.
                        </li>
                        <li>
                            <span className="font-semibold text-blue-200">
                                Sync Participant
                            </span>{" "}
                            — pastikan semua peserta sudah masuk dan sesuai
                            dengan daftar pemain di Start.gg.
                        </li>
                        <li>
                            <span className="font-semibold text-blue-200">
                                Sync Leaderboard
                            </span>{" "}
                            — setelah data peserta lengkap, barulah update
                            leaderboard untuk hasil akhir.
                        </li>
                    </ol>
                </div>

                {/* System Status */}
                <div className="bg-gray-800 rounded-2xl p-6">
                    <h2 className="text-xl font-bold text-white mb-4">
                        System Status
                    </h2>
                    <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                            <span className="text-white">
                                Database Connection
                            </span>
                            <span className="text-green-400 font-semibold">
                                ✓ Connected
                            </span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                            <span className="text-white">StartGG API</span>
                            <span className="text-green-400 font-semibold">
                                ✓ Active
                            </span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                            <span className="text-white">Total Records</span>
                            <span className="text-blue-400 font-semibold">
                                {stats.users +
                                    stats.tournaments +
                                    stats.galleries +
                                    stats.relasi}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default AdminDashboard;
