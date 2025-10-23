import React from "react";

export function Card({ className = "", children, ...props }) {
    return (
        <div
            className={`rounded-xl bg-gradient-to-br from-[#0D0C0C]/90 to-[#69747C]/10 border border-[#69747C]/30 shadow-md ${className}`}
            {...props}
        >
            {children}
        </div>
    );
}

export function CardContent({ className = "", children, ...props }) {
    return (
        <div className={`p-4 md:p-6 ${className}`} {...props}>
            {children}
        </div>
    );
}
