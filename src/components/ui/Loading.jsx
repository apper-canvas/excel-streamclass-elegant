import React from "react";

const Loading = ({ variant = "page" }) => {
  if (variant === "skeleton") {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-4 bg-surface rounded w-3/4"></div>
        <div className="h-4 bg-surface rounded w-1/2"></div>
        <div className="h-4 bg-surface rounded w-5/6"></div>
      </div>
    );
  }

  if (variant === "card") {
    return (
      <div className="bg-surface/50 border border-secondary/20 rounded-xl p-6 animate-pulse">
        <div className="space-y-4">
          <div className="h-6 bg-gray-600 rounded w-3/4"></div>
          <div className="h-4 bg-gray-600 rounded w-1/2"></div>
          <div className="h-4 bg-gray-600 rounded w-5/6"></div>
          <div className="h-32 bg-gray-600 rounded-lg"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="text-center space-y-4">
        <div className="w-12 h-12 border-4 border-secondary/30 border-t-secondary rounded-full animate-spin mx-auto"></div>
        <div className="text-gray-400 font-body">Loading webinar content...</div>
      </div>
    </div>
  );
};

export default Loading;