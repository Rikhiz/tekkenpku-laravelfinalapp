import React from "react";

const TooltipWrapper = ({ children, text, position = "bottom" }) => {
  const positionClasses = {
    top: "bottom-full mb-2 left-1/2 -translate-x-1/2",
    bottom: "top-full mt-2 left-1/2 -translate-x-1/2",
    left: "right-full mr-2 top-1/2 -translate-y-1/2",
    right: "left-full ml-2 top-1/2 -translate-y-1/2",
  };

  return (
    <div className="relative group inline-flex items-center">
      {children}
      <div
        className={`
          absolute ${positionClasses[position]} 
          bg-black/80 text-white text-xs px-2 py-1 rounded 
          opacity-0 group-hover:opacity-100 
          pointer-events-none whitespace-nowrap 
          transition-opacity duration-300 z-50
        `}
      >
        {text}
      </div>
    </div>
  );
};

export default TooltipWrapper;
