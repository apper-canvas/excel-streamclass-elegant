import React from "react";
import { format, formatDistance } from "date-fns";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import { cn } from "@/utils/cn";

const WebinarCard = ({ 
  webinar, 
  onJoin, 
  onEdit, 
  onDelete, 
  showActions = true,
  className 
}) => {
  const getStatusVariant = (status) => {
    switch (status) {
      case "live": return "error";
      case "scheduled": return "warning";
      case "ended": return "default";
      default: return "default";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "live": return "Radio";
      case "scheduled": return "Clock";
      case "ended": return "CheckCircle";
      default: return "Calendar";
    }
  };

  const isLive = webinar.status === "live";
  const isScheduled = webinar.status === "scheduled";
  const scheduledDate = new Date(webinar.scheduledAt);
  const now = new Date();

  return (
    <div className={cn(
      "p-6 bg-gradient-to-br from-surface/50 to-surface/30 border rounded-xl transition-all duration-300 hover:shadow-xl hover:scale-102",
      isLive ? "border-error/50 shadow-error/20" : "border-secondary/20",
      className
    )}>
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <h3 className="font-display font-semibold text-lg text-white leading-tight">
                {webinar.title}
              </h3>
              <Badge variant={getStatusVariant(webinar.status)}>
                <ApperIcon name={getStatusIcon(webinar.status)} size={12} className="mr-1" />
                {webinar.status.toUpperCase()}
              </Badge>
            </div>
            
            {webinar.description && (
              <p className="text-gray-300 font-body text-sm leading-relaxed">
                {webinar.description}
              </p>
            )}
          </div>
        </div>

        {/* Details */}
        <div className="space-y-3">
          <div className="flex items-center gap-4 text-sm text-gray-400 font-body">
            <div className="flex items-center gap-2">
              <ApperIcon name="Calendar" size={14} />
              <span>{format(scheduledDate, "MMM dd, yyyy")}</span>
            </div>
            <div className="flex items-center gap-2">
              <ApperIcon name="Clock" size={14} />
              <span>{format(scheduledDate, "HH:mm")}</span>
            </div>
          </div>

          <div className="flex items-center gap-4 text-sm font-body">
            <div className="flex items-center gap-2 text-gray-400">
              <ApperIcon name="Hash" size={14} />
              <span className="font-mono">{webinar.roomCode}</span>
            </div>
            
            {webinar.isRecording && (
              <div className="flex items-center gap-1 text-error">
                <div className="w-2 h-2 bg-error rounded-full animate-pulse"></div>
                <span className="text-xs">Recording</span>
              </div>
            )}
          </div>

          {/* Time info */}
          <div className="text-xs text-gray-500 font-body">
            {isLive ? (
              <span>Started {formatDistance(scheduledDate, now, { addSuffix: true })}</span>
            ) : isScheduled ? (
              scheduledDate > now ? (
                <span>Starts {formatDistance(scheduledDate, now, { addSuffix: true })}</span>
              ) : (
                <span className="text-warning">Should have started {formatDistance(scheduledDate, now, { addSuffix: true })}</span>
              )
            ) : (
              <span>Ended {formatDistance(scheduledDate, now, { addSuffix: true })}</span>
            )}
          </div>
        </div>

        {/* Actions */}
        {showActions && (
          <div className="flex items-center gap-3 pt-2 border-t border-secondary/20">
            {isLive ? (
              <Button
                variant="accent"
                size="medium"
                icon="Play"
                onClick={() => onJoin?.(webinar)}
                className="flex-1"
              >
                Join Live
              </Button>
            ) : isScheduled ? (
              <Button
                variant="primary"
                size="medium"
                icon="Calendar"
                onClick={() => onJoin?.(webinar)}
                className="flex-1"
              >
                Join Room
              </Button>
            ) : (
              <Button
                variant="secondary"
                size="medium"
                icon="Play"
                onClick={() => onJoin?.(webinar)}
                className="flex-1"
              >
                View Recording
              </Button>
            )}

            <Button
              variant="ghost"
              size="medium"
              icon="Edit"
              onClick={() => onEdit?.(webinar)}
            />
            
            <Button
              variant="ghost"
              size="medium"
              icon="Trash2"
              onClick={() => onDelete?.(webinar)}
              className="hover:text-error hover:bg-error/10"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default WebinarCard;