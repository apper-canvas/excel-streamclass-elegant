import React, { useState } from "react";
import ApperIcon from "@/components/ApperIcon";
import ChatPanel from "@/components/organisms/ChatPanel";
import QAPanel from "@/components/organisms/QAPanel";
import ParticipantsList from "@/components/organisms/ParticipantsList";
import { cn } from "@/utils/cn";

const WebinarSidebar = ({ 
  messages = [], 
  questions = [], 
  participants = [], 
  onSendMessage,
  onSubmitQuestion,
  onUpvoteQuestion,
  onAnswerQuestion,
  onMuteParticipant,
  onRemoveParticipant,
  currentUser,
  isHost = false,
  className 
}) => {
  const [activeTab, setActiveTab] = useState("chat");

  const tabs = [
    { 
      key: "chat", 
      label: "Chat", 
      icon: "MessageSquare", 
      count: messages.length 
    },
    { 
      key: "qa", 
      label: "Q&A", 
      icon: "HelpCircle", 
      count: questions.filter(q => !q.isAnswered).length 
    },
    { 
      key: "participants", 
      label: "People", 
      icon: "Users", 
      count: participants.filter(p => p.connectionStatus === "connected").length 
    }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case "chat":
        return (
          <ChatPanel
            messages={messages}
            participants={participants}
            onSendMessage={onSendMessage}
            currentUser={currentUser}
          />
        );
      case "qa":
        return (
          <QAPanel
            questions={questions}
            participants={participants}
            onSubmitQuestion={onSubmitQuestion}
            onUpvoteQuestion={onUpvoteQuestion}
            onAnswerQuestion={onAnswerQuestion}
            currentUser={currentUser}
            isHost={isHost}
          />
        );
      case "participants":
        return (
          <ParticipantsList
            participants={participants}
            onMuteParticipant={onMuteParticipant}
            onRemoveParticipant={onRemoveParticipant}
            isHost={isHost}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className={cn("w-80 bg-surface/50 border-l border-secondary/20 flex flex-col", className)}>
      {/* Tab Navigation */}
      <div className="border-b border-secondary/20">
        <div className="flex">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={cn(
                "flex-1 flex items-center justify-center gap-2 p-4 text-sm font-body font-medium transition-all duration-200 relative",
                activeTab === tab.key
                  ? "text-white bg-secondary/10 border-b-2 border-secondary"
                  : "text-gray-400 hover:text-gray-200 hover:bg-surface/30"
              )}
            >
              <ApperIcon name={tab.icon} size={16} />
              <span className="hidden sm:inline">{tab.label}</span>
              {tab.count > 0 && (
                <span className={cn(
                  "text-xs px-1.5 py-0.5 rounded-full font-medium",
                  activeTab === tab.key
                    ? "bg-secondary text-white"
                    : "bg-gray-600 text-gray-200"
                )}>
                  {tab.count > 99 ? "99+" : tab.count}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-hidden">
        {renderTabContent()}
      </div>
    </div>
  );
};

export default WebinarSidebar;