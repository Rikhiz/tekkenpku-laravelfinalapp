// resources/js/Components/Header.jsx
import React, { useState, useEffect } from "react";
import { Menu, User, LogOut, Shield } from "lucide-react";
import logo from "../images/tpcputih.png";
import { router, usePage } from "@inertiajs/react";
import LoginModal from "@/Components/LoginModal";
import TooltipWrapper from "@/Components/TooltipWrapper";

const Header = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [showUserMenu, setShowUserMenu] = useState(false);
    
    // Get authenticated user from Inertia shared props
    const { auth } = usePage().props;
    const user = auth?.user;

    const navLinks = [
        { label: "LEADERBOARD", href: "/leaderboards" },
        { label: "TOURNAMENTS", href: "/tournaments" },
        { label: "ACTIVITY", href: "/activity" },
        { label: "GALLERY", href: "/gallery" },
        { label: "ABOUT", href: "/about" },
    ];

    const handleNavigation = (href) => {
        router.visit(href);
        setIsMobileMenuOpen(false);
    };

    const handleLogout = () => {
        router.post(route('logout'));
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

    // Close user menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (showUserMenu && !e.target.closest('.user-menu-container')) {
                setShowUserMenu(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [showUserMenu]);

    return (
        <>
            <nav
                className={`
                    fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out
                    ${isScrolled
                        ? "bg-[#0D0C0C]/95 backdrop-blur-md shadow-lg border-b border-[#FF2146]/20"
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
                    {/* Logo */}
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

                    {/* Desktop Navigation */}
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

                    {/* Auth Section - Desktop */}
                    <div className="hidden md:flex items-center gap-4">
                        {user ? (
                            // User is logged in
                            <div className="relative user-menu-container">
                                <button
                                    onClick={() => setShowUserMenu(!showUserMenu)}
                                    className={`
                                        flex items-center gap-3 px-2 py-2 bg-gradient-to-r from-[#69747C]/20 to-[#69747C]/10 
                                        border border-[#69747C]/30 hover:border-[#FF2146]/50 rounded-lg transition-all duration-300
                                        ${isScrolled ? "text-sm" : "text-base"}
                                    `}
                                >
                                    <div className="flex items-center gap-2">
                                        {/* Avatar Image */}
                                        <img 
                                            src={user.avatar} 
                                            alt={user.name}
                                            className="w-8 h-8 rounded-full object-cover border-2 border-[#FF2146]/30"
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&size=128&background=FF2146&color=F2F2F2&bold=true`;
                                            }}
                                        />
                                        {user.role === 'admin' && (
                                            <Shield className="w-4 h-4 text-[#F2AF29]" />
                                        )}
                                        <span className="text-[#F2F2F2] font-semibold max-w-[120px] truncate pr-2">
                                            {user.name}
                                        </span>
                                    </div>
                                </button>

                                {/* User Dropdown Menu */}
                                {showUserMenu && (
                                    <div className="absolute right-0 mt-2 w-64 bg-[#0D0C0C]/95 backdrop-blur-md border border-[#69747C]/30 rounded-lg shadow-2xl overflow-hidden">
                                        {/* User Info */}
                                        <div className="p-4 border-b border-[#69747C]/20">
                                            <div className="flex items-center gap-3">
                                                <div className="w-12 h-12 bg-gradient-to-r from-[#FF2146] to-[#F2AF29] rounded-full flex items-center justify-center">
                                                    <span className="text-white font-bold text-lg">
                                                        {user.name.charAt(0).toUpperCase()}
                                                    </span>
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-[#F2F2F2] font-semibold truncate">
                                                        {user.name}
                                                    </p>
                                                    <p className="text-[#69747C] text-xs truncate">
                                                        {user.email || 'No email'}
                                                    </p>
                                                    <span className={`
                                                        inline-block mt-1 px-2 py-0.5 text-xs rounded-full
                                                        ${user.role === 'admin' 
                                                            ? 'bg-[#F2AF29]/20 text-[#F2AF29]' 
                                                            : 'bg-[#FF2146]/20 text-[#FF2146]'}
                                                    `}>
                                                        {user.role === 'admin' ? '👑 Admin' : '🎮 Player'}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Menu Items */}
                                        <div className="p-2">
                                            {user.role === 'admin' && (
                                                <button
                                                    onClick={() => {
                                                        handleNavigation('/admin/dashboard');
                                                        setShowUserMenu(false);
                                                    }}
                                                    className="w-full flex items-center gap-3 px-3 py-2 text-[#F2F2F2] hover:bg-[#FF2146]/10 rounded-md transition-colors"
                                                >
                                                    <Shield className="w-4 h-4" />
                                                    <span>Admin Dashboard</span>
                                                </button>
                                            )}
                                            <button
                                                onClick={() => {
                                                    handleNavigation('/profile');
                                                    setShowUserMenu(false);
                                                }}
                                                className="w-full flex items-center gap-3 px-3 py-2 text-[#F2F2F2] hover:bg-[#FF2146]/10 rounded-md transition-colors"
                                            >
                                                <User className="w-4 h-4" />
                                                <span>Profile</span>
                                            </button>
                                        </div>

                                        {/* Logout */}
                                        <div className="p-2 border-t border-[#69747C]/20">
                                            <button
                                                onClick={handleLogout}
                                                className="w-full flex items-center gap-3 px-3 py-2 text-[#FF2146] hover:bg-[#FF2146]/10 rounded-md transition-colors"
                                            >
                                                <LogOut className="w-4 h-4" />
                                                <span>Logout</span>
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            // User not logged in
                            <TooltipWrapper text="Login / Register" position="bottom">
                                <button
                                    onClick={() => setShowLoginModal(true)}
                                    className={`
                                        bg-gradient-to-r from-[#FF2146] to-[#F2AF29] text-[#F2F2F2] rounded-lg 
                                        hover:from-[#FF2146]/90 hover:to-[#F2AF29]/90 hover:shadow-lg hover:scale-105
                                        transition-all duration-300 font-bold relative overflow-hidden group
                                        ${isScrolled ? "px-4 py-2 text-sm" : "px-6 py-2.5 text-base"}
                                    `}
                                >
                                    <span className="relative z-10">Sign In</span>
                                    <div className="absolute inset-0 bg-white/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                </button>
                            </TooltipWrapper>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
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

                {/* Mobile Menu */}
                {isMobileMenuOpen && (
                    <div
                        className={`md:hidden border-t border-[#FF2146]/20 
                            ${isScrolled
                                ? "bg-[#0D0C0C]/95 backdrop-blur-md"
                                : "bg-[#0D0C0C]/90 backdrop-blur-sm"
                            }
                        `}
                    >
                        <div className="px-4 py-4 space-y-2">
                            {/* User Info Mobile */}
                            {user && (
                                <div className="mb-4 p-3 bg-[#69747C]/10 border border-[#69747C]/30 rounded-lg">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-gradient-to-r from-[#FF2146] to-[#F2AF29] rounded-full flex items-center justify-center flex-shrink-0">
                                            <span className="text-white font-bold">
                                                {user.name.charAt(0).toUpperCase()}
                                            </span>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-[#F2F2F2] font-semibold truncate text-sm">
                                                {user.name}
                                            </p>
                                            <span className={`
                                                inline-block mt-1 px-2 py-0.5 text-xs rounded-full
                                                ${user.role === 'admin' 
                                                    ? 'bg-[#F2AF29]/20 text-[#F2AF29]' 
                                                    : 'bg-[#FF2146]/20 text-[#FF2146]'}
                                            `}>
                                                {user.role === 'admin' ? '👑 Admin' : '🎮 Player'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Navigation Links */}
                            {navLinks.map((link) => (
                                <button
                                    key={link.href}
                                    onClick={() => handleNavigation(link.href)}
                                    className="block w-full text-left text-[#F2F2F2] hover:text-[#FF2146] hover:bg-[#FF2146]/10 transition-all duration-300 font-bold text-base py-3 px-4 rounded-lg border border-transparent hover:border-[#FF2146]/20"
                                >
                                    {link.label}
                                </button>
                            ))}

                            {/* Auth Buttons Mobile */}
                            {user ? (
                                <>
                                    {user.role === 'admin' && (
                                        <button
                                            onClick={() => handleNavigation('/admin/dashboard')}
                                            className="w-full flex items-center justify-center gap-2 bg-[#F2AF29]/20 border border-[#F2AF29]/30 text-[#F2AF29] px-4 py-3 rounded-lg hover:bg-[#F2AF29]/30 transition-all duration-300 font-bold"
                                        >
                                            <Shield size={18} />
                                            <span>Admin Dashboard</span>
                                        </button>
                                    )}
                                    <button
                                        onClick={handleLogout}
                                        className="w-full flex items-center justify-center gap-2 bg-[#FF2146]/20 border border-[#FF2146]/30 text-[#FF2146] px-4 py-3 rounded-lg hover:bg-[#FF2146]/30 transition-all duration-300 font-bold"
                                    >
                                        <LogOut size={18} />
                                        <span>Logout</span>
                                    </button>
                                </>
                            ) : (
                                <button
                                    onClick={() => {
                                        setShowLoginModal(true);
                                        setIsMobileMenuOpen(false);
                                    }}
                                    className="w-full bg-gradient-to-r from-[#FF2146] to-[#F2AF29] text-[#F2F2F2] px-4 py-3 rounded-lg hover:from-[#FF2146]/90 hover:to-[#F2AF29]/90 hover:shadow-lg transition-all duration-300 font-bold relative overflow-hidden group"
                                >
                                    <span className="relative z-10">Sign In</span>
                                    <div className="absolute inset-0 bg-white/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                </button>
                            )}
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