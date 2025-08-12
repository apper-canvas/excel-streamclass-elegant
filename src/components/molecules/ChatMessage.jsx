import React from "react";
import { format } from "date-fns";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const ChatMessage = ({ message, participant, isSystem = false }) => {
  if (isSystem) {
    return (
      <div className="flex items-center gap-2 py-2 px-3 text-xs text-gray-400 font-body">
        <ApperIcon name="Info" size={12} />
        <span>{message.content}</span>
        <span className="ml-auto">
          {format(new Date(message.timestamp), "HH:mm")}
        </span>
      </div>
    );
  }

  const getRoleColor = (role) => {
    switch (role) {
      case "host": return "text-accent";
      case "presenter": return "text-success";
      default: return "text-secondary";
    }
  };

  return (
    <div className="group py-2 px-3 hover:bg-surface/20 rounded-lg transition-colors duration-200">
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0">
          <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
            <span className="text-white font-display font-medium text-xs">
              {participant?.name?.charAt(0).toUpperCase() || "?"}
            </span>
          </div>
        </div>
        
        <div className="flex-1 min-w-0 space-y-1">
          <div className="flex items-center gap-2">
            <span className={cn("text-sm font-body font-medium", getRoleColor(participant?.role))}>
              {participant?.name || "Unknown"}
            </span>
            <span className="text-xs text-gray-500">
              {format(new Date(message.timestamp), "HH:mm")}
            </span>
          </div>
          
          <p className="text-sm text-gray-100 font-body leading-relaxed break-words">
            {message.content}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;