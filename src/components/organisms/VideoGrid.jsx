import React from "react";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import { cn } from "@/utils/cn";

const VideoGrid = ({ 
  participants = [], 
  isScreenSharing = false, 
  mainSpeaker = null,
  onToggleScreenShare,
  onToggleVideo,
  onToggleAudio,
  currentUser
}) => {
  const getMainVideo = () => {
    if (isScreenSharing) {
      return {
        type: "screen",
        title: "Screen Share",
        subtitle: mainSpeaker?.name || "Presenter"
      };
    }
    
    if (mainSpeaker) {
      return {
        type: "participant",
        participant: mainSpeaker,
        title: mainSpeaker.name,
        subtitle: mainSpeaker.role
      };
    }
    
    return null;
  };

  const mainVideo = getMainVideo();
  const otherParticipants = participants.filter(p => p.Id !== mainSpeaker?.Id);

  return (
    <div className="flex-1 bg-background/50 rounded-xl border border-secondary/20 overflow-hidden">
      {/* Main Video Area */}
      <div className="relative h-[400px] lg:h-[500px] bg-gradient-to-br from-surface/50 to-surface/30">
        {mainVideo ? (
          <>
            {/* Video Content */}
            <div className="absolute inset-0 flex items-center justify-center">
              {mainVideo.type === "screen" ? (
                <div className="text-center space-y-4">
                  <div className="w-20 h-20 bg-accent/20 rounded-full flex items-center justify-center mx-auto">
                    <ApperIcon name="Monitor" className="w-10 h-10 text-accent" />
                  </div>
                  <div>
                    <h3 className="text-xl font-display font-semibold text-white">
                      {mainVideo.title}
                    </h3>
                    <p className="text-gray-400 font-body">
                      by {mainVideo.subtitle}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="text-center space-y-4">
                  {mainVideo.participant.isVideoOn ? (
                    <div className="w-32 h-32 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center mx-auto">
                      <span className="text-4xl font-display font-bold text-white">
                        {mainVideo.participant.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  ) : (
                    <div className="w-32 h-32 bg-surface/50 rounded-full flex items-center justify-center mx-auto">
                      <ApperIcon name="VideoOff" className="w-16 h-16 text-gray-500" />
                    </div>
                  )}
                  <div>
                    <h3 className="text-xl font-display font-semibold text-white">
                      {mainVideo.title}
                    </h3>
                    <p className="text-gray-400 font-body capitalize">
                      {mainVideo.subtitle}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Video Overlay Info */}
            <div className="absolute top-4 left-4 flex items-center gap-3">
              <div className="bg-black/50 backdrop-blur-md px-3 py-2 rounded-lg">
                <div className="flex items-center gap-2 text-white">
                  <div className="w-2 h-2 bg-error rounded-full animate-pulse"></div>
                  <span className="text-sm font-body font-medium">LIVE</span>
                </div>
              </div>
              
              {mainVideo.type === "participant" && (
                <div className="bg-black/50 backdrop-blur-md px-3 py-2 rounded-lg">
                  <div className="flex items-center gap-2">
                    <ApperIcon 
                      name={mainVideo.participant.isAudioOn ? "Mic" : "MicOff"} 
                      size={14} 
                      className={mainVideo.participant.isAudioOn ? "text-success" : "text-gray-400"} 
                    />
                    <ApperIcon 
                      name={mainVideo.participant.isVideoOn ? "Video" : "VideoOff"} 
                      size={14} 
                      className={mainVideo.participant.isVideoOn ? "text-success" : "text-gray-400"} 
                    />
                  </div>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center space-y-4">
              <div className="w-20 h-20 bg-secondary/20 rounded-full flex items-center justify-center mx-auto">
                <ApperIcon name="Users" className="w-10 h-10 text-secondary" />
              </div>
              <div>
                <h3 className="text-xl font-display font-semibold text-white">
                  Waiting for presenter
                </h3>
                <p className="text-gray-400 font-body">
                  The webinar will begin shortly
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Participant Thumbnails */}
      {otherParticipants.length > 0 && (
        <div className="p-4 border-t border-secondary/20">
          <div className="flex gap-3 overflow-x-auto">
            {otherParticipants.slice(0, 6).map((participant) => (
              <div
                key={participant.Id}
                className="flex-shrink-0 relative group cursor-pointer"
              >
                <div className="w-16 h-12 bg-surface/50 rounded-lg border border-secondary/20 flex items-center justify-center hover:border-secondary/40 transition-colors duration-200">
                  {participant.isVideoOn ? (
                    <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
                      <span className="text-white font-display font-medium text-xs">
                        {participant.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  ) : (
                    <ApperIcon name="VideoOff" size={16} className="text-gray-500" />
                  )}
                </div>
                
                {/* Audio indicator */}
                <div className={cn(
                  "absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-background flex items-center justify-center",
                  participant.isAudioOn ? "bg-success" : "bg-gray-600"
                )}>
                  <ApperIcon 
                    name={participant.isAudioOn ? "Mic" : "MicOff"} 
                    size={8} 
                    className="text-white" 
                  />
                </div>
                
                {/* Name tooltip */}
                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black/80 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
                  {participant.name}
                </div>
              </div>
            ))}
            
            {otherParticipants.length > 6 && (
              <div className="flex-shrink-0 w-16 h-12 bg-surface/30 rounded-lg border border-secondary/20 flex items-center justify-center">
                <span className="text-xs text-gray-400 font-body">
                  +{otherParticipants.length - 6}
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Control Bar */}
      <div className="p-4 bg-surface/30 border-t border-secondary/20">
        <div className="flex items-center justify-center gap-4">
          <Button
            variant="secondary"
            size="medium"
            icon={currentUser?.isVideoOn ? "Video" : "VideoOff"}
            onClick={onToggleVideo}
            className={cn(
              !currentUser?.isVideoOn && "bg-error/20 border-error/30 hover:bg-error/30"
            )}
          >
            {currentUser?.isVideoOn ? "Video On" : "Video Off"}
          </Button>
          
          <Button
            variant="secondary"
            size="medium"
            icon={currentUser?.isAudioOn ? "Mic" : "MicOff"}
            onClick={onToggleAudio}
            className={cn(
              !currentUser?.isAudioOn && "bg-error/20 border-error/30 hover:bg-error/30"
            )}
          >
            {currentUser?.isAudioOn ? "Unmuted" : "Muted"}
          </Button>
          
          <Button
            variant={isScreenSharing ? "accent" : "secondary"}
            size="medium"
            icon="Monitor"
            onClick={onToggleScreenShare}
          >
            {isScreenSharing ? "Stop Sharing" : "Share Screen"}
          </Button>
          
          <Button
            variant="danger"
            size="medium"
            icon="PhoneOff"
          >
            Leave
          </Button>
        </div>
      </div>
    </div>
  );
};

export default VideoGrid;