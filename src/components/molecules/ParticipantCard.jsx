import React from "react";
import ApperIcon from "@/components/ApperIcon";
import Badge from "@/components/atoms/Badge";
import { cn } from "@/utils/cn";

const ParticipantCard = ({ participant, showControls = false, onMute, onRemove }) => {
  const getRoleVariant = (role) => {
    switch (role) {
      case "host": return "accent";
      case "presenter": return "success";
      default: return "default";
    }
  };

  const getStatusColor = (status) => {
    return status === "connected" ? "text-success" : "text-error";
  };

  return (
    <div className="flex items-center justify-between p-3 bg-surface/30 border border-secondary/20 rounded-lg hover:border-secondary/40 transition-colors duration-200">
      <div className="flex items-center gap-3">
        <div className="relative">
          <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
            <span className="text-white font-display font-semibold text-sm">
              {participant.name.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className={cn("absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-surface", getStatusColor(participant.connectionStatus))}>
            <div className="w-full h-full bg-current rounded-full"></div>
          </div>
        </div>
        
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-white font-body font-medium text-sm">
              {participant.name}
            </span>
            <Badge variant={getRoleVariant(participant.role)} size="small">
              {participant.role}
            </Badge>
          </div>
          
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <ApperIcon 
              name={participant.isVideoOn ? "Video" : "VideoOff"} 
              size={12}
              className={participant.isVideoOn ? "text-success" : "text-gray-500"}
            />
            <ApperIcon 
              name={participant.isAudioOn ? "Mic" : "MicOff"} 
              size={12}
              className={participant.isAudioOn ? "text-success" : "text-gray-500"}
            />
          </div>
        </div>
      </div>

      {showControls && (
        <div className="flex items-center gap-1">
          <button
            onClick={() => onMute?.(participant.Id)}
            className="p-1.5 text-gray-400 hover:text-warning hover:bg-warning/10 rounded-md transition-colors duration-200"
            title="Mute participant"
          >
            <ApperIcon name="MicOff" size={14} />
          </button>
          <button
            onClick={() => onRemove?.(participant.Id)}
            className="p-1.5 text-gray-400 hover:text-error hover:bg-error/10 rounded-md transition-colors duration-200"
            title="Remove participant"
          >
            <ApperIcon name="UserX" size={14} />
          </button>
        </div>
      )}
    </div>
  );
};

export default ParticipantCard;