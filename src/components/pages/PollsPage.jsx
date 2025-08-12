import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import PollCard from "@/components/molecules/PollCard";
import SearchBar from "@/components/molecules/SearchBar";
import { getPolls, createPoll, votePoll } from "@/services/api/pollService";
import { toast } from "react-toastify";

const PollsPage = () => {
  const [polls, setPolls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newPoll, setNewPoll] = useState({
    question: "",
    options: ["", ""]
  });
  const navigate = useNavigate();

  // Mock current user - in a real app this would come from auth
  const [currentUser] = useState({
    Id: 1,
    name: "Current User",
    role: "host"
  });

  const loadPolls = async () => {
    try {
      setError(null);
      const data = await getPolls();
      setPolls(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPolls();
  }, []);

  const handleCreatePoll = async () => {
    if (!newPoll.question.trim()) {
      toast.error("Please enter a poll question");
      return;
    }
    
    const validOptions = newPoll.options.filter(opt => opt.trim());
    if (validOptions.length < 2) {
      toast.error("Please provide at least 2 options");
      return;
    }

    try {
      const pollData = {
        question: newPoll.question.trim(),
        options: validOptions,
        createdBy: currentUser?.name || "Host",
        webinarId: null // Standalone poll
      };

      const createdPoll = await createPoll(pollData);
      setPolls(prev => [createdPoll, ...prev]);
      setNewPoll({ question: "", options: ["", ""] });
      setShowCreateForm(false);
      toast.success("Poll created successfully!");
    } catch (err) {
      toast.error("Failed to create poll");
    }
  };

  const handleVotePoll = async (pollId, optionIndex) => {
    try {
      const updatedPoll = await votePoll(pollId, {
        optionIndex,
        userId: currentUser?.Id || 1
      });
      
      setPolls(prev => 
        prev.map(p => p.Id === pollId ? updatedPoll : p)
      );
      
      toast.success("Vote submitted successfully");
    } catch (err) {
      toast.error(err.message || "Failed to submit vote");
    }
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

  // Filter and search polls
  const filteredPolls = polls.filter(poll => {
    const matchesSearch = poll.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         poll.createdBy.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter = filterStatus === "all" || 
                         (filterStatus === "active" && poll.isActive) ||
                         (filterStatus === "completed" && !poll.isActive);
    
    return matchesSearch && matchesFilter;
  });

  const activePolls = filteredPolls.filter(poll => poll.isActive);
  const completedPolls = filteredPolls.filter(poll => !poll.isActive);

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadPolls} />;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-display font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            Polls & Surveys
          </h1>
          <p className="text-gray-400 font-body mt-1">
            Create and manage interactive polls for your webinars
          </p>
        </div>
        <Button
          variant="accent"
          icon="Plus"
          onClick={() => setShowCreateForm(true)}
        >
          Create Poll
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-br from-surface/50 to-surface/30 border border-secondary/20 rounded-xl p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-success/20 rounded-xl flex items-center justify-center">
              <ApperIcon name="BarChart3" className="w-6 h-6 text-success" />
            </div>
            <div>
              <div className="text-2xl font-display font-bold text-white">
                {activePolls.length}
              </div>
              <div className="text-sm text-gray-400 font-body">Active Polls</div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-surface/50 to-surface/30 border border-secondary/20 rounded-xl p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-secondary/20 rounded-xl flex items-center justify-center">
              <ApperIcon name="CheckCircle" className="w-6 h-6 text-secondary" />
            </div>
            <div>
              <div className="text-2xl font-display font-bold text-white">
                {completedPolls.length}
              </div>
              <div className="text-sm text-gray-400 font-body">Completed</div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-surface/50 to-surface/30 border border-secondary/20 rounded-xl p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-warning/20 rounded-xl flex items-center justify-center">
              <ApperIcon name="Users" className="w-6 h-6 text-warning" />
            </div>
            <div>
              <div className="text-2xl font-display font-bold text-white">
                {polls.reduce((total, poll) => total + (poll.voters?.length || 0), 0)}
              </div>
              <div className="text-sm text-gray-400 font-body">Total Votes</div>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1">
          <SearchBar
            placeholder="Search polls..."
            value={searchQuery}
            onChange={setSearchQuery}
          />
        </div>
        <div className="flex gap-2">
          <Button
            variant={filterStatus === "all" ? "primary" : "ghost"}
            size="sm"
            onClick={() => setFilterStatus("all")}
          >
            All
          </Button>
          <Button
            variant={filterStatus === "active" ? "primary" : "ghost"}
            size="sm"
            onClick={() => setFilterStatus("active")}
          >
            Active
          </Button>
          <Button
            variant={filterStatus === "completed" ? "primary" : "ghost"}
            size="sm"
            onClick={() => setFilterStatus("completed")}
          >
            Completed
          </Button>
        </div>
      </div>

      {/* Create Poll Form */}
      {showCreateForm && (
        <div className="bg-surface/40 border border-secondary/20 rounded-xl p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-display font-semibold text-white">Create New Poll</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setShowCreateForm(false);
                setNewPoll({ question: "", options: ["", ""] });
              }}
            >
              <ApperIcon name="X" size={16} />
            </Button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Poll Question
              </label>
              <Input
                placeholder="Enter your poll question..."
                value={newPoll.question}
                onChange={(e) => setNewPoll(prev => ({ ...prev, question: e.target.value }))}
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Options
              </label>
              <div className="space-y-2">
                {newPoll.options.map((option, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Input
                      placeholder={`Option ${index + 1}`}
                      value={option}
                      onChange={(e) => handleOptionChange(index, e.target.value)}
                      className="flex-1"
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
                  className="mt-2"
                >
                  <ApperIcon name="Plus" size={14} />
                  Add Option
                </Button>
              )}
            </div>

            <div className="flex gap-2 pt-4">
              <Button
                onClick={handleCreatePoll}
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
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Polls List */}
      {filteredPolls.length === 0 ? (
        <Empty
          title={searchQuery ? "No polls found" : "No polls yet"}
          description={searchQuery ? "Try adjusting your search terms" : "Create your first poll to engage with your audience"}
          icon="BarChart3"
          actionLabel="Create Poll"
          onAction={() => setShowCreateForm(true)}
        />
      ) : (
        <div className="space-y-8">
          {/* Active Polls */}
          {activePolls.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-4">
                <ApperIcon name="Radio" className="w-5 h-5 text-success" />
                <h2 className="text-xl font-display font-semibold text-white">Active Polls</h2>
                <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
              </div>
              <div className="grid gap-6">
                {activePolls.map((poll) => (
                  <PollCard
                    key={poll.Id}
                    poll={poll}
                    currentUser={currentUser}
                    onVote={handleVotePoll}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Completed Polls */}
          {completedPolls.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-4">
                <ApperIcon name="CheckCircle" className="w-5 h-5 text-secondary" />
                <h2 className="text-xl font-display font-semibold text-white">Completed Polls</h2>
              </div>
              <div className="grid gap-6">
                {completedPolls.map((poll) => (
                  <PollCard
                    key={poll.Id}
                    poll={poll}
                    currentUser={currentUser}
                    onVote={handleVotePoll}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PollsPage;