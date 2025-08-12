import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import WebinarCard from "@/components/organisms/WebinarCard";
import CreateWebinarModal from "@/components/organisms/CreateWebinarModal";
import { getWebinars, createWebinar, deleteWebinar } from "@/services/api/webinarService";
import { toast } from "react-toastify";

const Dashboard = () => {
  const [webinars, setWebinars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const navigate = useNavigate();

  const loadWebinars = async () => {
    try {
      setError(null);
      const data = await getWebinars();
      setWebinars(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWebinars();
  }, []);

  const handleCreateWebinar = async (webinarData) => {
    try {
      setCreateLoading(true);
      const newWebinar = await createWebinar(webinarData);
      setWebinars(prev => [newWebinar, ...prev]);
      setShowCreateModal(false);
      toast.success("Webinar created successfully!");
    } catch (err) {
      toast.error("Failed to create webinar");
    } finally {
      setCreateLoading(false);
    }
  };

  const handleJoinWebinar = (webinar) => {
    if (webinar.status === "live") {
      navigate(`/room/${webinar.roomCode}`);
    } else if (webinar.status === "scheduled") {
      navigate(`/room/${webinar.roomCode}`);
    } else {
      navigate(`/recordings/${webinar.Id}`);
    }
  };

  const handleDeleteWebinar = async (webinar) => {
    if (window.confirm("Are you sure you want to delete this webinar?")) {
      try {
        await deleteWebinar(webinar.Id);
        setWebinars(prev => prev.filter(w => w.Id !== webinar.Id));
        toast.success("Webinar deleted successfully");
      } catch (err) {
        toast.error("Failed to delete webinar");
      }
    }
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadWebinars} />;

  const liveWebinars = webinars.filter(w => w.status === "live");
  const scheduledWebinars = webinars.filter(w => w.status === "scheduled");
  const recentWebinars = webinars.filter(w => w.status === "ended").slice(0, 4);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-display font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            Dashboard
          </h1>
          <p className="text-gray-400 font-body mt-1">
            Manage your webinars and sessions
          </p>
        </div>
        <Button
          variant="accent"
          icon="Plus"
          onClick={() => setShowCreateModal(true)}
        >
          Create Webinar
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-br from-surface/50 to-surface/30 border border-secondary/20 rounded-xl p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-error/20 rounded-xl flex items-center justify-center">
              <ApperIcon name="Radio" className="w-6 h-6 text-error" />
            </div>
            <div>
              <div className="text-2xl font-display font-bold text-white">
                {liveWebinars.length}
              </div>
              <div className="text-sm text-gray-400 font-body">Live Now</div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-surface/50 to-surface/30 border border-secondary/20 rounded-xl p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-warning/20 rounded-xl flex items-center justify-center">
              <ApperIcon name="Calendar" className="w-6 h-6 text-warning" />
            </div>
            <div>
              <div className="text-2xl font-display font-bold text-white">
                {scheduledWebinars.length}
              </div>
              <div className="text-sm text-gray-400 font-body">Scheduled</div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-surface/50 to-surface/30 border border-secondary/20 rounded-xl p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-secondary/20 rounded-xl flex items-center justify-center">
              <ApperIcon name="Video" className="w-6 h-6 text-secondary" />
            </div>
            <div>
              <div className="text-2xl font-display font-bold text-white">
                {webinars.filter(w => w.status === "ended").length}
              </div>
              <div className="text-sm text-gray-400 font-body">Recorded</div>
            </div>
          </div>
        </div>
      </div>

      {/* Live Webinars */}
      {liveWebinars.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <ApperIcon name="Radio" className="w-5 h-5 text-error" />
            <h2 className="text-xl font-display font-semibold text-white">Live Now</h2>
            <div className="w-2 h-2 bg-error rounded-full animate-pulse"></div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {liveWebinars.map((webinar) => (
              <WebinarCard
                key={webinar.Id}
                webinar={webinar}
                onJoin={handleJoinWebinar}
                onDelete={handleDeleteWebinar}
              />
            ))}
          </div>
        </div>
      )}

      {/* Scheduled Webinars */}
      {scheduledWebinars.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <ApperIcon name="Calendar" className="w-5 h-5 text-warning" />
            <h2 className="text-xl font-display font-semibold text-white">Upcoming</h2>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {scheduledWebinars.map((webinar) => (
              <WebinarCard
                key={webinar.Id}
                webinar={webinar}
                onJoin={handleJoinWebinar}
                onDelete={handleDeleteWebinar}
              />
            ))}
          </div>
        </div>
      )}

      {/* Recent Recordings */}
      {recentWebinars.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <ApperIcon name="Video" className="w-5 h-5 text-secondary" />
              <h2 className="text-xl font-display font-semibold text-white">Recent Recordings</h2>
            </div>
            <Button
              variant="ghost"
              size="small"
              onClick={() => navigate("/recordings")}
            >
              View All
            </Button>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {recentWebinars.map((webinar) => (
              <WebinarCard
                key={webinar.Id}
                webinar={webinar}
                onJoin={handleJoinWebinar}
                onDelete={handleDeleteWebinar}
              />
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {webinars.length === 0 && (
        <Empty
          title="No webinars yet"
          description="Create your first webinar to get started with hosting live sessions."
          icon="Video"
          actionLabel="Create Webinar"
          onAction={() => setShowCreateModal(true)}
        />
      )}

      {/* Create Webinar Modal */}
      <CreateWebinarModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreateWebinar}
        loading={createLoading}
      />
    </div>
  );
};

export default Dashboard;