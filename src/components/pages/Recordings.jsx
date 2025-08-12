import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import SearchBar from "@/components/molecules/SearchBar";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { getWebinars } from "@/services/api/webinarService";
import { cn } from "@/utils/cn";

const Recordings = () => {
  const [webinars, setWebinars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const navigate = useNavigate();

  const loadWebinars = async () => {
    try {
      setError(null);
      const data = await getWebinars();
      // Only show ended webinars (recordings)
      setWebinars(data.filter(w => w.status === "ended"));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWebinars();
  }, []);

  const filteredWebinars = webinars.filter(webinar =>
    webinar.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    webinar.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedWebinars = [...filteredWebinars].sort((a, b) => {
    const dateA = new Date(a.scheduledAt);
    const dateB = new Date(b.scheduledAt);
    
    switch (sortBy) {
      case "newest":
        return dateB - dateA;
      case "oldest":
        return dateA - dateB;
      case "title":
        return a.title.localeCompare(b.title);
      default:
        return dateB - dateA;
    }
  });

  const handlePlay = (webinar) => {
    // In a real app, this would open a video player
    navigate(`/recordings/${webinar.Id}`);
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadWebinars} />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-display font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            Recordings
          </h1>
          <p className="text-gray-400 font-body mt-1">
            Access your webinar recordings and archives
          </p>
        </div>

        <div className="flex items-center gap-4">
          <SearchBar
            placeholder="Search recordings..."
            onSearch={setSearchTerm}
            className="w-64"
          />
          
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 bg-surface border border-secondary/30 rounded-lg text-white font-body text-sm focus:outline-none focus:ring-2 focus:ring-secondary/50"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="title">Title A-Z</option>
          </select>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-br from-surface/50 to-surface/30 border border-secondary/20 rounded-xl p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-secondary/20 rounded-xl flex items-center justify-center">
              <ApperIcon name="Video" className="w-6 h-6 text-secondary" />
            </div>
            <div>
              <div className="text-2xl font-display font-bold text-white">
                {webinars.length}
              </div>
              <div className="text-sm text-gray-400 font-body">Total Recordings</div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-surface/50 to-surface/30 border border-secondary/20 rounded-xl p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-accent/20 rounded-xl flex items-center justify-center">
              <ApperIcon name="Clock" className="w-6 h-6 text-accent" />
            </div>
            <div>
              <div className="text-2xl font-display font-bold text-white">
                {Math.round(webinars.length * 45)}m
              </div>
              <div className="text-sm text-gray-400 font-body">Total Duration</div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-surface/50 to-surface/30 border border-secondary/20 rounded-xl p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-success/20 rounded-xl flex items-center justify-center">
              <ApperIcon name="Download" className="w-6 h-6 text-success" />
            </div>
            <div>
              <div className="text-2xl font-display font-bold text-white">
                {filteredWebinars.length}
              </div>
              <div className="text-sm text-gray-400 font-body">Available</div>
            </div>
          </div>
        </div>
      </div>

      {/* Recordings List */}
      {sortedWebinars.length === 0 ? (
        webinars.length === 0 ? (
          <Empty
            title="No recordings yet"
            description="Your completed webinars will appear here as recordings."
            icon="Video"
            actionLabel="Go to Dashboard"
            onAction={() => navigate("/")}
          />
        ) : (
          <Empty
            title="No recordings found"
            description="Try adjusting your search terms to find recordings."
            icon="Search"
            actionLabel="Clear Search"
            onAction={() => setSearchTerm("")}
          />
        )
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {sortedWebinars.map((webinar) => (
            <div
              key={webinar.Id}
              className="bg-gradient-to-br from-surface/50 to-surface/30 border border-secondary/20 rounded-xl overflow-hidden hover:shadow-xl hover:scale-102 transition-all duration-300"
            >
              {/* Thumbnail */}
              <div className="relative aspect-video bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm">
                  <ApperIcon name="Play" className="w-8 h-8 text-white ml-1" />
                </div>
                
                <div className="absolute top-3 left-3 bg-black/50 backdrop-blur-sm px-2 py-1 rounded text-xs text-white font-body">
                  {Math.floor(Math.random() * 60) + 15}:00
                </div>
                
                <div className="absolute top-3 right-3 bg-secondary/80 backdrop-blur-sm px-2 py-1 rounded text-xs text-white font-body">
                  HD
                </div>
              </div>

              {/* Content */}
              <div className="p-6 space-y-4">
                <div className="space-y-2">
                  <h3 className="font-display font-semibold text-lg text-white leading-tight">
                    {webinar.title}
                  </h3>
                  {webinar.description && (
                    <p className="text-gray-300 font-body text-sm leading-relaxed line-clamp-2">
                      {webinar.description}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-4 text-xs text-gray-400 font-body">
                  <div className="flex items-center gap-1">
                    <ApperIcon name="Calendar" size={12} />
                    <span>{format(new Date(webinar.scheduledAt), "MMM d, yyyy")}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <ApperIcon name="Users" size={12} />
                    <span>{Math.floor(Math.random() * 50) + 10} viewers</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-2 border-t border-secondary/20">
                  <Button
                    variant="accent"
                    size="medium"
                    icon="Play"
                    onClick={() => handlePlay(webinar)}
                    className="flex-1"
                  >
                    Watch
                  </Button>
                  
                  <Button
                    variant="secondary"
                    size="medium"
                    icon="Download"
                    title="Download recording"
                  />
                  
                  <Button
                    variant="secondary"
                    size="medium"
                    icon="Share"
                    title="Share recording"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Recordings;