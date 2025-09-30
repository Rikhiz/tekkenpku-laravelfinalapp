import React from "react";
import AppLayout from "@/Layouts/AppLayout";
import { Target, Eye, Gamepad2, Users, Instagram } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import herobg from "@/images/hero-background.jpg";

const SectionTitle = ({ icon: Icon, color, children }) => (
    <div className="flex items-center gap-3 mb-6">
        <Icon className={color} size={34} />
        <div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-white uppercase tracking-wide">
                {children}
            </h2>
            <div className="h-1 w-20 mt-2 rounded bg-gradient-to-r from-[#FF2146] to-[#F2AF29]" />
        </div>
    </div>
);

const About = ({ community }) => {
    const { scrollY } = useScroll();

    // Parallax transform untuk teks
    const yHeading = useTransform(scrollY, [0, 300], [0, -80]); // naik pas scroll
    const yTagline = useTransform(scrollY, [0, 300], [0, -40]); // lebih halus
    const opacity = useTransform(scrollY, [0, 200], [1, 0.4]); // makin pudar

    return (
        <AppLayout>
            <section className="relative min-h-screen bg-gradient-to-b from-[#0D0C0C] via-[#0D0C0C] to-[#1A1A1A]">
                {/* Hero Header */}
                <div
                    className="relative py-32 text-center overflow-hidden bg-fixed bg-center bg-cover"
                    style={{ backgroundImage: `url(${herobg})` }}
                >
                    {/* Overlay Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-r from-[#0D0C0C]/80 via-[#0D0C0C]/70 to-[#0D0C0C]/80"></div>
                    <div className="absolute top-10 right-10 w-72 h-72 bg-[#FF2146]/20 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-10 left-10 w-72 h-72 bg-[#F2AF29]/20 rounded-full blur-3xl"></div>

                    {/* Content */}
                    <motion.div
                        className="relative max-w-3xl mx-auto px-6"
                        style={{ y: yHeading, opacity }}
                    >
                        <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-white mb-6">
                            <span className="bg-gradient-to-r from-[#FF2146] to-[#F2AF29] bg-clip-text text-transparent">
                                Tekken Pekanbaru Community
                            </span>
                        </h1>
                    </motion.div>

                    <motion.p
                        className="relative mt-6 text-lg text-gray-200 max-w-2xl mx-auto px-6"
                        style={{ y: yTagline, opacity }}
                    >
                        {community.tagline ||
                            "Pekanbaru based Tekken community. Routine offline meetup, events and tournaments."}
                    </motion.p>
                </div>

                {/* Content */}
                <div className="relative max-w-5xl mx-auto px-6 py-16 grid gap-12 md:grid-cols-2">
                    {/* Mission */}
                    {community.mission && (
                        <motion.div
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            viewport={{ once: true, amount: 0.3 }}
                            className="p-8 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 hover:border-[#FF2146]/40 transition"
                        >
                            <SectionTitle icon={Target} color="text-[#FF2146]">
                                Mission
                            </SectionTitle>
                            <p className="text-gray-300 leading-relaxed">
                                {community.mission}
                            </p>
                        </motion.div>
                    )}

                    {/* Vision */}
                    {community.vision && (
                        <motion.div
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.3 }}
                            viewport={{ once: true, amount: 0.3 }}
                            className="p-8 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 hover:border-[#F2AF29]/40 transition"
                        >
                            <SectionTitle icon={Eye} color="text-[#F2AF29]">
                                Vision
                            </SectionTitle>
                            <p className="text-gray-300 leading-relaxed">
                                {community.vision}
                            </p>
                        </motion.div>
                    )}

                    {/* What We Do */}
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        viewport={{ once: true, amount: 0.3 }}
                        className="p-8 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 hover:border-[#FF2146]/40 transition md:col-span-2"
                    >
                        <SectionTitle icon={Gamepad2} color="text-[#FF2146]">
                            What We Do
                        </SectionTitle>
                        <ul className="list-disc list-inside text-gray-300 leading-relaxed space-y-2">
                            <li>
                                Organize monthly Tekken tournaments (online &
                                offline)
                            </li>
                            <li>
                                Community meetups, trainings, and casual
                                sessions
                            </li>
                            <li>
                                Collaboration with local gaming hubs & sponsors
                            </li>
                            <li>
                                Streaming and content sharing for matches &
                                highlights
                            </li>
                        </ul>
                    </motion.div>

                    {/* Join Us */}
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.5 }}
                        viewport={{ once: true, amount: 0.3 }}
                        className="p-8 bg-gradient-to-r from-[#FF2146]/20 to-[#F2AF29]/20 backdrop-blur-md rounded-2xl border border-white/10 md:col-span-2"
                    >
                        <SectionTitle icon={Users} color="text-[#FF2146]">
                            Join Us
                        </SectionTitle>
                        <p className="text-gray-300 leading-relaxed">
                            We welcome Tekken players of all levels — beginner
                            to tournament-ready. Stay updated by following us on
                            Instagram:
                        </p>
                        <a
                            href="https://www.instagram.com/tekkenpku"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-6 inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold bg-gradient-to-r from-[#FF2146] to-[#F2AF29] text-white hover:scale-105 transition"
                        >
                            <Instagram size={22} />
                            @tekkenpku
                        </a>
                    </motion.div>
                </div>
            </section>
        </AppLayout>
    );
};

export default About;
