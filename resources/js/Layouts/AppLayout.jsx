import React, { useState, useEffect } from "react";
import Header from "@/Components/Header";
import Footer from "@/Components/Footer";
import tpcputih from "@/images/tpcputih.png"

const LoadingScreen = () => {
    return (
        <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#0D0C0C]">
            <img
                src={tpcputih}
                alt="Loading..."
                className="w-24 h-24 animate-bounce"
            />
            <p className="mt-4 text-[#FF2146] font-bold text-lg animate-pulse">
                Loading...
            </p>
        </div>
    );
};

const AppLayout = ({ children }) => {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let pageLoaded = false;
        let timerComplete = false;

        // Cek apakah halaman sudah selesai load
        const checkPageLoad = () => {
            pageLoaded = true;
            checkBothComplete();
        };

        // Cek apakah timer sudah selesai
        const timer = setTimeout(() => {
            timerComplete = true;
            checkBothComplete();
        }, 1200);

        // Fungsi untuk cek apakah keduanya sudah selesai
        const checkBothComplete = () => {
            if (pageLoaded && timerComplete) {
                setLoading(false);
            }
        };

        // Tunggu halaman selesai load
        if (document.readyState === 'complete') {
            checkPageLoad();
        } else {
            window.addEventListener('load', checkPageLoad);
        }

        // Cleanup
        return () => {
            clearTimeout(timer);
            window.removeEventListener('load', checkPageLoad);
        };
    }, []);

    return (
        <>
            {loading ? (
                <LoadingScreen />
            ) : (
                <div className="min-h-screen bg-gray-900 flex flex-col">
                    <Header />
                    
                    <main className="flex-1">{children}</main>

                    <Footer />
                </div>
            )}
        </>
    );
};

export default AppLayout;   