import React, { useState, useRef, useEffect } from "react";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import ChatMessage from "@/components/molecules/ChatMessage";
import { cn } from "@/utils/cn";

const ChatPanel = ({ 
  messages = [], 
  participants = [], 
  onSendMessage, 
  currentUser,
  className 
}) => {
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    
    onSendMessage?.(newMessage.trim());
    setNewMessage("");
    inputRef.current?.focus();
  };

  const getParticipantById = (participantId) => {
    return participants.find(p => p.Id === participantId);
  };

  return (
    <div className={cn("flex flex-col h-full", className)}>
      {/* Chat Header */}
      <div className="flex items-center justify-between p-4 border-b border-secondary/20">
        <div className="flex items-center gap-2">
          <ApperIcon name="MessageSquare" size={16} className="text-secondary" />
          <h3 className="font-display font-semibold text-white">Chat</h3>
        </div>
        <div className="text-xs text-gray-400 font-body">
          {messages.length} messages
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center space-y-2">
              <ApperIcon name="MessageSquare" size={24} className="text-gray-500 mx-auto" />
              <p className="text-sm text-gray-400 font-body">
                No messages yet
              </p>
              <p className="text-xs text-gray-500 font-body">
                Start the conversation!
              </p>
            </div>
          </div>
        ) : (
          messages.map((message) => (
            <ChatMessage
              key={message.Id}
              message={message}
              participant={getParticipantById(message.participantId)}
              isSystem={message.type === "system"}
            />
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="p-4 border-t border-secondary/20">
        <form onSubmit={handleSendMessage} className="space-y-3">
          <div className="relative">
            <Input
              ref={inputRef}
              type="text"
              placeholder="Type your message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className="pr-12"
            />
            <button
              type="submit"
              disabled={!newMessage.trim()}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 text-gray-400 hover:text-secondary disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              <ApperIcon name="Send" size={16} />
            </button>
          </div>
          
          <div className="flex items-center gap-2 text-xs text-gray-500 font-body">
            <ApperIcon name="Info" size={12} />
            <span>Messages are visible to all participants</span>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChatPanel;