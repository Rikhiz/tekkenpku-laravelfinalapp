// resources/js/Components/Modal.jsx
import React from "react";
import { X } from "lucide-react";

const Modal = ({ title, show, onClose, children, width = "w-96" }) => {
    if (!show) return null;

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 px-4">
            <div
                className={`relative bg-gradient-to-br from-[#0D0C0C]/95 to-[#1a1a1a]/90 
                border border-[#69747C]/30 rounded-2xl shadow-2xl 
                max-h-[90vh] overflow-y-auto ${width}`}
            >
                {/* Header */}
                <div className="flex justify-between items-center px-6 py-4 border-b border-[#69747C]/30">
                    <h2 className="text-lg md:text-xl font-bold text-white tracking-wide">
                        {title}
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 text-white rounded-lg hover:bg-[#FF2146]/20 hover:text-[#FF2146] transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Body */}
                <div className="px-6 py-5 text-[#F2F2F2] text-sm md:text-base">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default Modal;
