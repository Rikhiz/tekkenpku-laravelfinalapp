// resources/js/Components/Footer.jsx
import React, { useState } from "react";
import { FaWhatsapp, FaDiscord, FaInstagram, FaYoutube } from "react-icons/fa";

const Footer = () => {
    const [hoveredSocial, setHoveredSocial] = useState(null);

    const socials = [
        {
            label: "WhatsApp",
            icon: <FaWhatsapp size={22} />,
            tooltip: "WhatsApp",
            link: "https://chat.whatsapp.com/Crz5d5RsOBTHSSl7fHvaC7",
        },
        {
            label: "Discord",
            icon: <FaDiscord size={22} />,
            tooltip: "Discord",
            link: "https://discord.gg/QzFd5fTv",
        },
        {
            label: "Instagram",
            icon: <FaInstagram size={22} />,
            tooltip: "Instagram",
            link: "https://www.instagram.com/tekkenpku",
        },
        {
            label: "YouTube",
            icon: <FaYoutube size={22} />,
            tooltip: "YouTube",
            link: "https://www.youtube.com/@tekkenpekanbarucommunity",
        },
    ];

    const gradients = [
        "from-[#FF2146] to-[#F2AF29]",
        "from-[#F2AF29] to-[#FF2146]",
        "from-[#FF2146] to-[#69747C]",
        "from-[#69747C] to-[#F2AF29]",
    ];

    return (
        <footer className="relative bg-gradient-to-br from-[#0D0C0C] via-[#0D0C0C] to-[#69747C]/20 border-t border-[#69747C]/30">
            {/* Animated Background */}
            <div className="absolute inset-0">
                <div className="absolute top-0 left-1/4 w-64 h-64 bg-[#FF2146]/5 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-[#F2AF29]/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-8 py-16">
                {/* Main Footer Content */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
                    {/* Brand Section */}
                    <div className="space-y-5 lg:col-span-2">
                        <h3 className="text-3xl font-extrabold bg-gradient-to-r from-[#FF2146] to-[#F2AF29] bg-clip-text text-transparent">
                            TPC HUB
                        </h3>
                        <p className="text-[#9CA3AF] leading-relaxed max-w-2xl">
                            Routine offline meetup, event and tournament. Play,
                            Grow and Connect with us here
                            <span className="font-semibold text-[#F2AF29]">
                                {" "}
                                TPC HUB{" "}
                            </span>
                            is your battleground to grow, compete, and shine.
                        </p>

                        {/* Social Buttons */}
                        <div className="flex space-x-5 pt-2">
                            {socials.map((social, idx) => (
                                <div
                                    key={social.label}
                                    className="relative group"
                                >
                                    <button
                                        type="button"
                                        onClick={() =>
                                            window.open(social.link, "_blank")
                                        }
                                        className={`w-12 h-12 bg-gradient-to-r ${gradients[idx]} rounded-full flex items-center justify-center 
                               hover:scale-110 transition-transform cursor-pointer relative`}
                                        onMouseEnter={() =>
                                            setHoveredSocial(idx)
                                        }
                                        onMouseLeave={() =>
                                            setHoveredSocial(null)
                                        }
                                    >
                                        <span className="text-[#F2F2F2] text-sm font-bold">
                                            {social.icon}
                                        </span>
                                    </button>

                                    {/* Tooltip */}
                                    <div
                                        className={`absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 transition-all duration-200 ${
                                            hoveredSocial === idx
                                                ? "opacity-100 visible translate-y-0"
                                                : "opacity-0 invisible translate-y-2"
                                        }`}
                                    >
                                        <div className="bg-[#0D0C0C] text-[#F2F2F2] text-xs font-medium px-3 py-2 rounded-lg shadow-lg border border-[#69747C]/30 whitespace-nowrap">
                                            {social.tooltip}
                                            <div className="absolute top-full left-1/2 transform -translate-x-1/2">
                                                <div className="w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-[#0D0C0C]"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-[#69747C]/30 pt-8">
                    <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                        <div className="text-[#69747C] text-sm">
                            © 2025 Tekken Pekanbaru Community. All rights
                            reserved.
                        </div>
                        <div className="flex space-x-6 text-sm">
                            <a
                                href="#"
                                className="text-[#69747C] hover:text-[#FF2146] transition-colors"
                            >
                                RikaBogor
                            </a>
                            <a
                                href="#"
                                className="text-[#69747C] hover:text-[#FF2146] transition-colors"
                            >
                                Salam
                            </a>
                            <a
                                href="#"
                                className="text-[#69747C] hover:text-[#FF2146] transition-colors"
                            >
                                NakiRika
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            {/* Floating Elements */}
            <div className="absolute top-10 right-10 w-32 h-32 bg-gradient-to-r from-[#FF2146]/10 to-[#F2AF29]/10 rounded-full blur-2xl animate-bounce"></div>
            <div className="absolute bottom-10 left-10 w-24 h-24 bg-gradient-to-r from-[#F2AF29]/10 to-[#69747C]/10 rounded-full blur-2xl animate-bounce delay-500"></div>
        </footer>
    );
};

export default Footer;
