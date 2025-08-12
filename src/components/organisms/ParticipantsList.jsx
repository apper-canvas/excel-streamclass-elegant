import React, { useState } from "react";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import SearchBar from "@/components/molecules/SearchBar";
import ParticipantCard from "@/components/molecules/ParticipantCard";
import { cn } from "@/utils/cn";

const ParticipantsList = ({ 
  participants = [], 
  onMuteParticipant, 
  onRemoveParticipant,
  isHost = false,
  className 
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  const filteredParticipants = participants.filter(participant => {
    const matchesSearch = participant.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === "all" || participant.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const sortedParticipants = [...filteredParticipants].sort((a, b) => {
    // Sort by role first (host, presenter, attendee), then by connection status, then by name
    const roleOrder = { host: 0, presenter: 1, attendee: 2 };
    if (roleOrder[a.role] !== roleOrder[b.role]) {
      return roleOrder[a.role] - roleOrder[b.role];
    }
    if (a.connectionStatus !== b.connectionStatus) {
      return a.connectionStatus === "connected" ? -1 : 1;
    }
    return a.name.localeCompare(b.name);
  });

  const stats = {
    total: participants.length,
    connected: participants.filter(p => p.connectionStatus === "connected").length,
    hosts: participants.filter(p => p.role === "host").length,
    presenters: participants.filter(p => p.role === "presenter").length,
    attendees: participants.filter(p => p.role === "attendee").length
  };

  return (
    <div className={cn("flex flex-col h-full", className)}>
      {/* Header */}
      <div className="p-4 border-b border-secondary/20 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ApperIcon name="Users" size={16} className="text-secondary" />
            <h3 className="font-display font-semibold text-white">Participants</h3>
          </div>
          <div className="text-xs text-gray-400 font-body">
            {stats.connected}/{stats.total} online
          </div>
        </div>

        {/* Search */}
        <SearchBar
          placeholder="Search participants..."
          onSearch={setSearchTerm}
        />

        {/* Role Filter */}
        <div className="flex gap-2 overflow-x-auto">
          {[
            { key: "all", label: "All", count: stats.total },
            { key: "host", label: "Hosts", count: stats.hosts },
            { key: "presenter", label: "Presenters", count: stats.presenters },
            { key: "attendee", label: "Attendees", count: stats.attendees }
          ].map(({ key, label, count }) => (
            <button
              key={key}
              onClick={() => setRoleFilter(key)}
              className={cn(
                "px-3 py-1.5 text-xs font-body font-medium rounded-md whitespace-nowrap transition-all duration-200",
                roleFilter === key
                  ? "bg-secondary/20 text-secondary border border-secondary/30"
                  : "text-gray-400 hover:text-gray-200 hover:bg-surface/50"
              )}
            >
              {label} ({count})
            </button>
          ))}
        </div>
      </div>

      {/* Participants List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {sortedParticipants.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center space-y-2">
              <ApperIcon name="Users" size={24} className="text-gray-500 mx-auto" />
              <p className="text-sm text-gray-400 font-body">
                {searchTerm ? "No participants found" : "No participants yet"}
              </p>
              {searchTerm && (
                <Button
                  variant="ghost"
                  size="small"
                  onClick={() => setSearchTerm("")}
                >
                  Clear search
                </Button>
              )}
            </div>
          </div>
        ) : (
          sortedParticipants.map((participant) => (
            <ParticipantCard
              key={participant.Id}
              participant={participant}
              showControls={isHost && participant.role !== "host"}
              onMute={onMuteParticipant}
              onRemove={onRemoveParticipant}
            />
          ))
        )}
      </div>

      {/* Host Actions */}
      {isHost && participants.length > 0 && (
        <div className="p-4 border-t border-secondary/20 space-y-2">
          <div className="flex gap-2">
            <Button
              variant="secondary"
              size="small"
              icon="MicOff"
              className="flex-1"
            >
              Mute All
            </Button>
            <Button
              variant="secondary"
              size="small"
              icon="VideoOff"
              className="flex-1"
            >
              Stop All Video
            </Button>
          </div>
          
          <div className="text-xs text-gray-500 font-body flex items-center gap-1">
            <ApperIcon name="Shield" size={12} />
            Host controls available
          </div>
        </div>
      )}
    </div>
  );
};

export default ParticipantsList;