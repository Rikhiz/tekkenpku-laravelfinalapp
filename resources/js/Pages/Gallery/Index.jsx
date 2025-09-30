import React from "react";
import AppLayout from "@/Layouts/AppLayout";
import { Image } from "lucide-react";

const GalleryIndex = () => {
    return (
        <AppLayout>
            <div className="min-h-[75vh] flex flex-col items-center justify-center text-center px-6 py-16">
                <div className="max-w-md w-full p-10 bg-gradient-to-br from-[#1a1a1a]/90 to-[#69747C]/20 backdrop-blur-xl 
                                border border-[#69747C]/30 rounded-3xl shadow-2xl 
                                transition-all duration-300 hover:scale-[1.02] hover:border-[#FF2146]/50">
                    
                    <div className="flex justify-center mb-6">
                        <div className="p-4 bg-[#FF2146]/10 rounded-full">
                            <Image className="w-16 h-16 text-[#FF2146]" />
                        </div>
                    </div>
                    
                    <h1 className="text-4xl font-extrabold text-[#F2F2F2] mb-4">
                        Gallery
                    </h1>
                    
                    <p className="text-[#F2F2F2] text-lg leading-relaxed">
                        🚧 Coming Soon... <br />
                        Stay tuned for the latest updates!
                    </p>
                </div>
            </div>
        </AppLayout>
    );
};

export default GalleryIndex;
