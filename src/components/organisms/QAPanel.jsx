import React, { useState } from "react";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import QuestionCard from "@/components/molecules/QuestionCard";
import { cn } from "@/utils/cn";

const QAPanel = ({ 
  questions = [], 
  participants = [], 
  onSubmitQuestion, 
  onUpvoteQuestion, 
  onAnswerQuestion,
  currentUser,
  isHost = false,
  className 
}) => {
  const [newQuestion, setNewQuestion] = useState("");
  const [filter, setFilter] = useState("all"); // all, answered, unanswered

  const handleSubmitQuestion = (e) => {
    e.preventDefault();
    if (!newQuestion.trim()) return;
    
    onSubmitQuestion?.(newQuestion.trim());
    setNewQuestion("");
  };

  const getParticipantById = (participantId) => {
    return participants.find(p => p.Id === participantId);
  };

  const filteredQuestions = questions.filter(question => {
    if (filter === "answered") return question.isAnswered;
    if (filter === "unanswered") return !question.isAnswered;
    return true;
  });

  const sortedQuestions = [...filteredQuestions].sort((a, b) => {
    // Sort by answered status first (unanswered first), then by upvotes
    if (a.isAnswered !== b.isAnswered) {
      return a.isAnswered - b.isAnswered;
    }
    return b.upvotes - a.upvotes;
  });

  const stats = {
    total: questions.length,
    answered: questions.filter(q => q.isAnswered).length,
    unanswered: questions.filter(q => !q.isAnswered).length
  };

  return (
    <div className={cn("flex flex-col h-full", className)}>
      {/* Q&A Header */}
      <div className="p-4 border-b border-secondary/20 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ApperIcon name="HelpCircle" size={16} className="text-secondary" />
            <h3 className="font-display font-semibold text-white">Q&A</h3>
          </div>
          <div className="text-xs text-gray-400 font-body">
            {stats.total} questions
          </div>
        </div>

        {/* Filter Buttons */}
        <div className="flex gap-2">
          {[
            { key: "all", label: "All", count: stats.total },
            { key: "unanswered", label: "Pending", count: stats.unanswered },
            { key: "answered", label: "Answered", count: stats.answered }
          ].map(({ key, label, count }) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={cn(
                "px-3 py-1.5 text-xs font-body font-medium rounded-md transition-all duration-200",
                filter === key
                  ? "bg-secondary/20 text-secondary border border-secondary/30"
                  : "text-gray-400 hover:text-gray-200 hover:bg-surface/50"
              )}
            >
              {label} ({count})
            </button>
          ))}
        </div>
      </div>

      {/* Questions List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {sortedQuestions.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center space-y-2">
              <ApperIcon name="HelpCircle" size={24} className="text-gray-500 mx-auto" />
              <p className="text-sm text-gray-400 font-body">
                {filter === "all" ? "No questions yet" : 
                 filter === "answered" ? "No answered questions" : 
                 "No pending questions"}
              </p>
              <p className="text-xs text-gray-500 font-body">
                {filter === "all" && "Ask the first question!"}
              </p>
            </div>
          </div>
        ) : (
          sortedQuestions.map((question) => (
            <QuestionCard
              key={question.Id}
              question={question}
              participant={getParticipantById(question.participantId)}
              onUpvote={onUpvoteQuestion}
              onAnswer={onAnswerQuestion}
              showModeratorControls={isHost}
              hasUpvoted={false} // TODO: Track user upvotes
            />
          ))
        )}
      </div>

      {/* Question Input */}
      <div className="p-4 border-t border-secondary/20">
        <form onSubmit={handleSubmitQuestion} className="space-y-3">
          <Input
            type="text"
            placeholder="Ask a question..."
            value={newQuestion}
            onChange={(e) => setNewQuestion(e.target.value)}
          />
          
          <div className="flex items-center justify-between">
            <div className="text-xs text-gray-500 font-body flex items-center gap-1">
              <ApperIcon name="Info" size={12} />
              Questions are visible to all participants
            </div>
            
            <Button
              type="submit"
              variant="accent"
              size="small"
              disabled={!newQuestion.trim()}
              icon="Send"
            >
              Ask
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default QAPanel;