import React from "react";
import ApperIcon from "@/components/ApperIcon";

const Error = ({ message = "Something went wrong", onRetry, showRetry = true }) => {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="text-center space-y-6 max-w-md">
        <div className="w-16 h-16 bg-error/20 rounded-full flex items-center justify-center mx-auto">
          <ApperIcon name="AlertCircle" className="w-8 h-8 text-error" />
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-display font-semibold text-white">
            Oops! Something went wrong
          </h3>
          <p className="text-gray-400 font-body">
            {message}
          </p>
        </div>
        {showRetry && onRetry && (
          <button
            onClick={onRetry}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary to-secondary text-white font-body font-medium rounded-lg hover:from-primary/90 hover:to-secondary/90 transition-all duration-200 transform hover:scale-105"
          >
            <ApperIcon name="RotateCcw" size={16} />
            Try Again
          </button>
        )}
      </div>
    </div>
  );
};

export default Error;