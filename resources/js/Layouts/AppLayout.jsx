import React, { useState, useEffect } from "react";
import Header from "@/Components/Header";
import Footer from "@/Components/Footer";
import tpcputih from "@/images/tpcputih.png"

const LoadingScreen = () => {
    return (
        <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#0D0C0C]">
            <img
                src={tpcputih} // sesuaikan path logo
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
        // delay 1.2 detik biar smooth
        const timer = setTimeout(() => setLoading(false), 1200);
        return () => clearTimeout(timer);
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
