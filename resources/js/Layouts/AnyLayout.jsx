import React from 'react';
import Header from '@/Components/Header';
import Footer from '@/Components/Footer';

const AnyLayout = ({ children }) => {
    return (
        <div className="min-h-screen bg-gray-900 flex flex-col">
            <Header />

            {/* Konten utama dengan jarak atas & bawah */}
            <main className="flex-1 pt-20 pb-20 px-4 md:px-8">
                {children}
            </main>

            <Footer />
        </div>
    );
};

export default AnyLayout;
