import React from "react";

const LoadingScreen = () => {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#0D0C0C]">
      {/* Bisa diganti logo kamu */}
      <div className="animate-pulse text-center">
        <img
          src="/images/test.png"
          alt="Loading..."
          className="w-24 h-24 mx-auto mb-4 animate-bounce"
        />
        <p className="text-[#FF2146] font-bold text-xl">Loading...</p>
      </div>
    </div>
  );
};

export default LoadingScreen;
