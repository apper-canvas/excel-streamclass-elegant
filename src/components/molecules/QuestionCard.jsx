import React from "react";
import { format } from "date-fns";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import { cn } from "@/utils/cn";

const QuestionCard = ({ question, participant, onUpvote, onAnswer, showModeratorControls = false, hasUpvoted = false }) => {
  return (
    <div className={cn(
      "p-4 border rounded-lg transition-all duration-200 hover:border-secondary/40",
      question.isAnswered 
        ? "bg-success/5 border-success/20" 
        : "bg-surface/30 border-secondary/20"
    )}>
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
              <span className="text-white font-display font-medium text-xs">
                {participant?.name?.charAt(0).toUpperCase() || "?"}
              </span>
            </div>
            <span className="text-sm font-body font-medium text-gray-200">
              {participant?.name || "Anonymous"}
            </span>
            <span className="text-xs text-gray-500">
              {format(new Date(question.timestamp), "HH:mm")}
            </span>
          </div>
          
          {question.isAnswered && (
            <Badge variant="success" size="small">
              Answered
            </Badge>
          )}
        </div>
        
        <p className="text-sm text-gray-100 font-body leading-relaxed">
          {question.content}
        </p>
        
        <div className="flex items-center justify-between">
          <button
            onClick={() => onUpvote?.(question.Id)}
            className={cn(
              "flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-body font-medium transition-all duration-200",
              hasUpvoted
                ? "bg-accent/20 text-accent border border-accent/30"
                : "text-gray-400 hover:text-accent hover:bg-accent/10"
            )}
          >
            <ApperIcon name="ChevronUp" size={14} />
            <span>{question.upvotes}</span>
          </button>
          
          {showModeratorControls && !question.isAnswered && (
            <Button
              variant="secondary"
              size="small"
              icon="MessageCircle"
              onClick={() => onAnswer?.(question.Id)}
            >
              Mark as Answered
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuestionCard;