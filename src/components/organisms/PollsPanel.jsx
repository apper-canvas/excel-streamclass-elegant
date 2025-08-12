import React, { useState } from "react";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Label from "@/components/atoms/Label";
import PollCard from "@/components/molecules/PollCard";
import { cn } from "@/utils/cn";

const PollsPanel = ({
  polls = [],
  currentUser,
  isHost = false,
  onCreatePoll,
  onVotePoll
}) => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newPoll, setNewPoll] = useState({
    question: "",
    options: ["", ""]
  });

  const handleCreatePoll = () => {
    if (!newPoll.question.trim()) return;
    
    const validOptions = newPoll.options.filter(opt => opt.trim());
    if (validOptions.length < 2) return;

    onCreatePoll({
      question: newPoll.question.trim(),
      options: validOptions
    });

    setNewPoll({ question: "", options: ["", ""] });
    setShowCreateForm(false);
  };

  const handleOptionChange = (index, value) => {
    const updatedOptions = [...newPoll.options];
    updatedOptions[index] = value;
    setNewPoll(prev => ({ ...prev, options: updatedOptions }));
  };

  const addOption = () => {
    if (newPoll.options.length < 4) {
      setNewPoll(prev => ({
        ...prev,
        options: [...prev.options, ""]
      }));
    }
  };

  const removeOption = (index) => {
    if (newPoll.options.length > 2) {
      setNewPoll(prev => ({
        ...prev,
        options: prev.options.filter((_, i) => i !== index)
      }));
    }
  };

  const activePolls = polls.filter(poll => poll.isActive);
  const completedPolls = polls.filter(poll => !poll.isActive);

  return (
    <div className="h-full flex flex-col bg-surface/30">
      {/* Header */}
      <div className="p-4 border-b border-secondary/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ApperIcon name="BarChart3" size={20} className="text-secondary" />
            <h3 className="font-display font-semibold text-white">Polls</h3>
          </div>
          {isHost && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowCreateForm(!showCreateForm)}
              className="text-secondary hover:text-secondary hover:bg-secondary/10"
            >
              <ApperIcon name="Plus" size={16} />
            </Button>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* Create Poll Form */}
        {showCreateForm && isHost && (
          <div className="p-4 bg-surface/50 border-b border-secondary/20">
            <div className="space-y-4">
              <div>
                <Label className="text-gray-300 text-sm font-medium mb-2">
                  Poll Question
                </Label>
                <Input
                  placeholder="Enter your poll question..."
                  value={newPoll.question}
                  onChange={(e) => setNewPoll(prev => ({ ...prev, question: e.target.value }))}
                  className="bg-background border-secondary/30"
                />
              </div>

              <div>
                <Label className="text-gray-300 text-sm font-medium mb-2">
                  Options
                </Label>
                <div className="space-y-2">
                  {newPoll.options.map((option, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Input
                        placeholder={`Option ${index + 1}`}
                        value={option}
                        onChange={(e) => handleOptionChange(index, e.target.value)}
                        className="flex-1 bg-background border-secondary/30"
                      />
                      {newPoll.options.length > 2 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeOption(index)}
                          className="text-gray-400 hover:text-error p-2"
                        >
                          <ApperIcon name="X" size={14} />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>

                {newPoll.options.length < 4 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={addOption}
                    className="mt-2 text-secondary hover:text-secondary hover:bg-secondary/10"
                  >
                    <ApperIcon name="Plus" size={14} />
                    Add Option
                  </Button>
                )}
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={handleCreatePoll}
                  className="flex-1"
                  disabled={!newPoll.question.trim() || newPoll.options.filter(opt => opt.trim()).length < 2}
                >
                  Create Poll
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => {
                    setShowCreateForm(false);
                    setNewPoll({ question: "", options: ["", ""] });
                  }}
                  className="text-gray-400 hover:text-gray-200"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Polls List */}
        <div className="p-4 space-y-4">
          {activePolls.length === 0 && completedPolls.length === 0 ? (
            <div className="text-center py-12">
              <ApperIcon name="BarChart3" size={48} className="mx-auto text-gray-600 mb-4" />
              <p className="text-gray-400 font-body">No polls yet</p>
              {isHost && (
                <p className="text-gray-500 text-sm mt-2">
                  Create a poll to engage with participants
                </p>
              )}
            </div>
          ) : (
            <>
              {activePolls.map((poll) => (
                <PollCard
                  key={poll.Id}
                  poll={poll}
                  currentUser={currentUser}
                  onVote={onVotePoll}
                />
              ))}
              
              {completedPolls.length > 0 && (
                <>
                  <div className="pt-4 border-t border-secondary/20">
                    <h4 className="text-sm font-medium text-gray-400 mb-3">
                      Completed Polls
                    </h4>
                  </div>
                  {completedPolls.map((poll) => (
                    <PollCard
                      key={poll.Id}
                      poll={poll}
                      currentUser={currentUser}
                      onVote={onVotePoll}
                    />
                  ))}
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default PollsPanel;