import React, { useState, useEffect } from "react";
import { Menu } from "lucide-react";
import logo from "../images/tpcputih.png";
import { router } from "@inertiajs/react";
import LoginModal from "@/Components/LoginModal";
import TooltipWrapper from "@/Components/TooltipWrapper";

const Header = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);

    const navLinks = [
        { label: "LEADERBOARD", href: "/leaderboards" },
        { label: "TOURNAMENTS", href: "/tournaments" },
        { label: "ACTIVITY", href: "/activity" },
        { label: "GALLERY", href: "/gallery" },
        { label: "ABOUT", href: "/about" },
    ];

    const handleNavigation = (href) => {
        router.visit(href);
    };

    useEffect(() => {
        let ticking = false;
        let lastScrollY = 0;

        const handleScroll = () => {
            lastScrollY = window.scrollY;

            if (!ticking) {
                window.requestAnimationFrame(() => {
                    if (lastScrollY > 50) {
                        setIsScrolled(true);
                    } else if (lastScrollY < 30) {
                        setIsScrolled(false);
                    }
                    ticking = false;
                });
                ticking = true;
            }
        };

        window.addEventListener("scroll", handleScroll, { passive: true });

        if (window.scrollY > 50) {
            setIsScrolled(true);
        }

        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    return (
        <>
            <nav
                className={`
          fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out
          ${
              isScrolled
                  ? "bg-[#0D0C0C]/95 backdrop-blur-md hadow-lg border-b border-[#FF2146]/20"
                  : "bg-transparent"
          }
        `}
            >
                <div
                    className={`
            max-w-7xl mx-auto flex items-center justify-between transition-all duration-500
            ${isScrolled ? "px-6 py-2" : "p-4"}
          `}
                >
                    <TooltipWrapper text="Go to Home" position="bottom">
                        <button
                            onClick={() => handleNavigation("/")}
                            className="text-white hover:scale-110 transition-all duration-300 hover:drop-shadow-lg"
                        >
                            <img
                                src={logo}
                                alt="Logo"
                                className={`
        transition-all duration-500 hover:brightness-110
        ${isScrolled ? "size-12" : "size-20"}
      `}
                            />
                        </button>
                    </TooltipWrapper>

                    <div className="hidden md:flex items-center space-x-8">
                        {navLinks.map((link) => (
                            <TooltipWrapper
                                key={link.href}
                                text={link.label}
                                position="bottom"
                            >
                                <button
                                    onClick={() => handleNavigation(link.href)}
                                    className={`
          relative text-[#F2F2F2] hover:text-[#FF2146] transition-all duration-300 font-black
          ${isScrolled ? "text-lg" : "text-xl"}
          before:content-[''] before:absolute before:w-0 before:h-0.5 before:bottom-0 before:left-0 
          before:bg-gradient-to-r before:from-[#FF2146] before:to-[#F2AF29]
          hover:before:w-full before:transition-all before:duration-300
        `}
                                >
                                    {link.label}
                                </button>
                            </TooltipWrapper>
                        ))}
                    </div>

                    <TooltipWrapper text="ADMIN ONLY" position="bottom">
                        <button
                            onClick={() => setShowLoginModal(true)}
                            className={`
      hidden md:block bg-gradient-to-r from-[#FF2146] to-[#F2AF29] text-[#F2F2F2] rounded-lg 
      hover:from-[#FF2146]/90 hover:to-[#F2AF29]/90 hover:shadow-lg hover:scale-105
      transition-all duration-300 font-bold relative overflow-hidden group
      ${isScrolled ? "px-4 py-2 text-sm" : "px-6 py-2.5 text-base"}
    `}
                        >
                            <span className="relative z-10">Sign In</span>
                            <div className="absolute inset-0 bg-white/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        </button>
                    </TooltipWrapper>

                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className={`
              md:hidden text-[#F2F2F2] hover:text-[#FF2146] transition-all duration-300 p-2 rounded-lg
              hover:bg-[#FF2146]/10 border border-transparent hover:border-[#FF2146]/30
            `}
                    >
                        <Menu size={isScrolled ? 20 : 24} />
                    </button>
                </div>

                {isMobileMenuOpen && (
                    <div
                        className={`md:hidden border-t border-[#FF2146]/20 
      ${
          isScrolled
              ? "bg-black backdrop-blur-md"
              : "bg-white/20 backdrop-blur-sm"
      }
    `}
                    >
                        <div className="px-4 py-4 space-y-1">
                            {navLinks.map((link) => (
                                <button
                                    key={link.href}
                                    onClick={() => {
                                        handleNavigation(link.href);
                                        setIsMobileMenuOpen(false);
                                    }}
                                    className={`
                    block w-full text-left text-[#F2F2F2] hover:text-[#FF2146] hover:bg-[#FF2146]/10
                    transition-all duration-300 font-bold text-lg py-3 px-4 rounded-lg
                    border border-transparent hover:border-[#FF2146]/20
                  `}
                                >
                                    {link.label}
                                </button>
                            ))}
                            <button
                                onClick={() => {
                                    setShowLoginModal(true);
                                    setIsMobileMenuOpen(false);
                                }}
                                className={`
                  block w-full bg-gradient-to-r from-[#FF2146] to-[#F2AF29] text-[#F2F2F2] 
                  px-4 py-3 rounded-lg hover:from-[#FF2146]/90 hover:to-[#F2AF29]/90 
                  hover:shadow-lg transition-all duration-300 mt-4 font-bold
                  relative overflow-hidden group
                `}
                            >
                                <span className="relative z-10">Sign In</span>
                                <div className="absolute inset-0 bg-white/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            </button>
                        </div>
                    </div>
                )}
            </nav>

            <LoginModal
                show={showLoginModal}
                onClose={() => setShowLoginModal(false)}
            />
        </>
    );
};

export default Header;
