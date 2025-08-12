import React from "react";
import ApperIcon from "@/components/ApperIcon";

const Empty = ({ 
  title = "No content found", 
  description = "There's nothing to show here yet.", 
  actionLabel,
  onAction,
  icon = "Inbox"
}) => {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="text-center space-y-6 max-w-md">
        <div className="w-16 h-16 bg-secondary/20 rounded-full flex items-center justify-center mx-auto">
          <ApperIcon name={icon} className="w-8 h-8 text-secondary" />
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-display font-semibold text-white">
            {title}
          </h3>
          <p className="text-gray-400 font-body">
            {description}
          </p>
        </div>
        {actionLabel && onAction && (
          <button
            onClick={onAction}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-accent to-amber-600 text-white font-body font-medium rounded-lg hover:from-accent/90 hover:to-amber-600/90 transition-all duration-200 transform hover:scale-105"
          >
            <ApperIcon name="Plus" size={16} />
            {actionLabel}
          </button>
        )}
      </div>
    </div>
  );
};

export default Empty;