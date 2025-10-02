import React from "react";
import AppLayout from "@/Layouts/AppLayout";
import { Target, Eye, Gamepad2, Users, Instagram } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import herobg from "@/images/about-background.png";

const SectionTitle = ({ icon: Icon, color, children }) => (
    <div className="flex items-center gap-3 mb-6 text-center sm:text-left justify-center sm:justify-start">
        <Icon className={color} size={30} />
        <div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white uppercase tracking-wide">
                {children}
            </h2>
            <div className="h-1 w-16 sm:w-20 mt-2 rounded bg-gradient-to-r from-[#FF2146] to-[#F2AF29] mx-auto sm:mx-0" />
        </div>
    </div>
);

const About = ({ community }) => {
    const { scrollY } = useScroll();

    // Parallax efek teks
    const yHeading = useTransform(scrollY, [0, 300], [0, -80]);
    const yTagline = useTransform(scrollY, [0, 300], [0, -40]);
    const opacity = useTransform(scrollY, [0, 200], [1, 0.4]);

    return (
        <AppLayout>
            <section className="relative min-h-screen bg-gradient-to-b from-[#0D0C0C] via-[#0D0C0C] to-[#1A1A1A]">
                {/* Hero Header */}
                <div
                    className="relative py-24 sm:py-32 text-center overflow-hidden bg-fixed bg-center bg-cover"
                    style={{ backgroundImage: `url(${herobg})` }}
                >
                    <div className="absolute inset-0 bg-gradient-to-br from-[#0D0C0C]/10 via-[#0D0C0C]/20 to-[#0D0C0C]/50"></div>
                    <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-b from-transparent to-[#0D0C0C] pointer-events-none"></div>
                    {/* Overlay Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-r from-[#0D0C0C]/80 via-[#0D0C0C]/70 to-[#0D0C0C]/80"></div>
                    <div className="absolute top-10 right-10 w-72 h-72 bg-[#FF2146]/20 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-10 left-10 w-72 h-72 bg-[#F2AF29]/20 rounded-full blur-3xl"></div>

                    {/* Content */}
                    <motion.div
                        className="relative max-w-3xl mx-auto px-4 sm:px-6"
                        style={{ y: yHeading, opacity }}
                    >
                        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white mb-6">
                            <span className="bg-gradient-to-r from-[#FF2146] to-[#F2AF29] bg-clip-text text-transparent">
                                Tekken Pekanbaru Community
                            </span>
                        </h1>
                    </motion.div>

                    <motion.p
                        className="relative mt-6 text-base sm:text-lg text-gray-200 max-w-2xl mx-auto px-4 sm:px-6"
                        style={{ y: yTagline, opacity }}
                    >
                        {community.tagline ||
                            "Komunitas Tekken berbasis di Pekanbaru. Rutin mengadakan gathering offline, event, dan turnamen."}
                    </motion.p>
                </div>

                {/* Content */}
                <div className="relative max-w-5xl mx-auto px-4 sm:px-6 py-12 sm:py-16 grid gap-10 sm:gap-12 md:grid-cols-2">
                    {/* Misi */}
                    {community.mission && (
                        <motion.div
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            viewport={{ once: true, amount: 0.3 }}
                            className="p-6 sm:p-8 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 hover:border-[#FF2146]/40 transition"
                        >
                            <SectionTitle icon={Target} color="text-[#FF2146]">
                                Misi
                            </SectionTitle>
                            <p className="text-gray-300 leading-relaxed text-sm sm:text-base">
                                {community.mission}
                            </p>
                        </motion.div>
                    )}

                    {/* Visi */}
                    {community.vision && (
                        <motion.div
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.3 }}
                            viewport={{ once: true, amount: 0.3 }}
                            className="p-6 sm:p-8 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 hover:border-[#F2AF29]/40 transition"
                        >
                            <SectionTitle icon={Eye} color="text-[#F2AF29]">
                                Visi
                            </SectionTitle>
                            <p className="text-gray-300 leading-relaxed text-sm sm:text-base">
                                {community.vision}
                            </p>
                        </motion.div>
                    )}

                    {/* Kegiatan Kami */}
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        viewport={{ once: true, amount: 0.3 }}
                        className="p-6 sm:p-8 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 hover:border-[#FF2146]/40 transition md:col-span-2"
                    >
                        <SectionTitle icon={Gamepad2} color="text-[#FF2146]">
                            Kegiatan Kami
                        </SectionTitle>
                        <ul className="list-disc list-inside text-gray-300 leading-relaxed space-y-2 text-sm sm:text-base">
                            <li>Mengadakan turnamen Tekken bulanan (online & offline)</li>
                            <li>Meetup komunitas, latihan bareng, dan sesi santai</li>
                            <li>Kolaborasi dengan gaming hub & sponsor lokal</li>
                            <li>Streaming serta berbagi konten pertandingan & highlight</li>
                        </ul>
                    </motion.div>

                    {/* Bergabunglah Bersama Kami */}
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.5 }}
                        viewport={{ once: true, amount: 0.3 }}
                        className="p-6 sm:p-8 bg-gradient-to-r from-[#FF2146]/20 to-[#F2AF29]/20 backdrop-blur-md rounded-2xl border border-white/10 md:col-span-2"
                    >
                        <SectionTitle icon={Users} color="text-[#FF2146]">
                            Bergabunglah Bersama Kami
                        </SectionTitle>
                        <p className="text-gray-300 leading-relaxed text-sm sm:text-base">
                            Kami menyambut semua pemain Tekken dari berbagai level — 
                            mulai dari pemula hingga yang siap berlaga di turnamen. 
                            Tetap terhubung dengan mengikuti kami di Instagram:
                        </p>
                        <a
                            href="https://www.instagram.com/tekkenpku"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-6 inline-flex items-center gap-2 px-5 py-3 rounded-xl font-semibold bg-gradient-to-r from-[#FF2146] to-[#F2AF29] text-white hover:scale-105 transition text-sm sm:text-base"
                        >
                            <Instagram size={20} />
                            @tekkenpku
                        </a>
                    </motion.div>
                </div>
            </section>
        </AppLayout>
    );
};

export default About;
