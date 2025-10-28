import React, { useState, useEffect } from "react";
import { usePage } from "@inertiajs/react";
import Swal from "sweetalert2";
import Header from "@/Components/Header";
import Footer from "@/Components/Footer";
import tpcputih from "@/images/tpcputih.png";

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
    const { flash } = usePage().props;

    useEffect(() => {
        if (flash?.error) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: flash.error,
                background: '#1E1E1E', // warna latar gelap
                color: '#FFFFFF', // teks putih
                confirmButtonColor: '#FF2146', // warna tombol
                confirmButtonText: 'Tutup',
                customClass: {
                    popup: 'swal2-dark-popup', // opsional: bisa dipakai untuk animasi CSS tambahan
                },
                showClass: {
                    popup: 'animate__animated animate__fadeInDown', // animasi masuk
                },
                hideClass: {
                    popup: 'animate__animated animate__fadeOutUp', // animasi keluar
                },
            });
        } else if (flash?.success) {
            Swal.fire({
                icon: 'success',
                title: 'Berhasil!',
                text: flash.success,
                background: '#1E1E1E',
                color: '#FFFFFF',
                confirmButtonColor: '#22C55E',
                confirmButtonText: 'OK',
                showClass: {
                    popup: 'animate__animated animate__fadeInDown',
                },
                hideClass: {
                    popup: 'animate__animated animate__fadeOutUp',
                },
            });
        }
    }, [flash]);

    useEffect(() => {
        let pageLoaded = false;
        let timerComplete = false;

        const checkPageLoad = () => {
            pageLoaded = true;
            checkBothComplete();
        };

        const timer = setTimeout(() => {
            timerComplete = true;
            checkBothComplete();
        }, 1200);

        const checkBothComplete = () => {
            if (pageLoaded && timerComplete) {
                setLoading(false);
            }
        };

        if (document.readyState === "complete") {
            checkPageLoad();
        } else {
            window.addEventListener("load", checkPageLoad);
        }

        return () => {
            clearTimeout(timer);
            window.removeEventListener("load", checkPageLoad);
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
