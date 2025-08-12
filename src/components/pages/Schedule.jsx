import React, { useState, useEffect } from "react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isSameMonth, isToday } from "date-fns";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import CreateWebinarModal from "@/components/organisms/CreateWebinarModal";
import { getWebinars, createWebinar } from "@/services/api/webinarService";
import { toast } from "react-toastify";
import { cn } from "@/utils/cn";

const Schedule = () => {
  const [webinars, setWebinars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);

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
      toast.success("Webinar scheduled successfully!");
    } catch (err) {
      toast.error("Failed to schedule webinar");
    } finally {
      setCreateLoading(false);
    }
  };

  const navigateMonth = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + direction);
    setCurrentDate(newDate);
  };

  const getWebinarsForDate = (date) => {
    return webinars.filter(webinar => 
      isSameDay(new Date(webinar.scheduledAt), date)
    );
  };

  const getWebinarsForSelectedDate = () => {
    if (!selectedDate) return [];
    return getWebinarsForDate(selectedDate);
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadWebinars} />;

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarDays = eachDayOfInterval({ start: monthStart, end: monthEnd });
  
  const selectedWebinars = getWebinarsForSelectedDate();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-display font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            Schedule
          </h1>
          <p className="text-gray-400 font-body mt-1">
            Plan and manage your webinar calendar
          </p>
        </div>
        <Button
          variant="accent"
          icon="Plus"
          onClick={() => setShowCreateModal(true)}
        >
          Schedule Webinar
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Calendar */}
        <div className="lg:col-span-2">
          <div className="bg-gradient-to-br from-surface/50 to-surface/30 border border-secondary/20 rounded-xl overflow-hidden">
            {/* Calendar Header */}
            <div className="flex items-center justify-between p-6 border-b border-secondary/20">
              <h2 className="text-xl font-display font-semibold text-white">
                {format(currentDate, "MMMM yyyy")}
              </h2>
              <div className="flex gap-2">
                <Button
                  variant="secondary"
                  size="small"
                  icon="ChevronLeft"
                  onClick={() => navigateMonth(-1)}
                />
                <Button
                  variant="secondary"
                  size="small"
                  onClick={() => setCurrentDate(new Date())}
                >
                  Today
                </Button>
                <Button
                  variant="secondary"
                  size="small"
                  icon="ChevronRight"
                  onClick={() => navigateMonth(1)}
                />
              </div>
            </div>

            {/* Calendar Grid */}
            <div className="p-6">
              {/* Day Headers */}
              <div className="grid grid-cols-7 gap-2 mb-4">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => (
                  <div key={day} className="text-center text-sm font-body font-medium text-gray-400 py-2">
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar Days */}
              <div className="grid grid-cols-7 gap-2">
                {calendarDays.map(day => {
                  const dayWebinars = getWebinarsForDate(day);
                  const isSelected = selectedDate && isSameDay(day, selectedDate);
                  const isCurrentMonth = isSameMonth(day, currentDate);
                  
                  return (
                    <button
                      key={day.toISOString()}
                      onClick={() => setSelectedDate(day)}
                      className={cn(
                        "relative p-2 min-h-[60px] text-left rounded-lg transition-all duration-200 border",
                        isSelected
                          ? "bg-secondary/20 border-secondary text-white"
                          : "hover:bg-surface/30 border-transparent",
                        !isCurrentMonth && "opacity-40",
                        isToday(day) && !isSelected && "bg-accent/10 border-accent/30"
                      )}
                    >
                      <div className={cn(
                        "text-sm font-body font-medium",
                        isToday(day) ? "text-accent" : isSelected ? "text-white" : "text-gray-200"
                      )}>
                        {format(day, "d")}
                      </div>
                      
                      {dayWebinars.length > 0 && (
                        <div className="mt-1 space-y-1">
                          {dayWebinars.slice(0, 2).map(webinar => (
                            <div
                              key={webinar.Id}
                              className={cn(
                                "text-xs px-1.5 py-0.5 rounded text-white truncate",
                                webinar.status === "live" ? "bg-error" :
                                webinar.status === "scheduled" ? "bg-warning" : "bg-secondary"
                              )}
                              title={webinar.title}
                            >
                              {format(new Date(webinar.scheduledAt), "HH:mm")} {webinar.title}
                            </div>
                          ))}
                          {dayWebinars.length > 2 && (
                            <div className="text-xs text-gray-400">
                              +{dayWebinars.length - 2} more
                            </div>
                          )}
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Selected Date Details */}
        <div>
          <div className="bg-gradient-to-br from-surface/50 to-surface/30 border border-secondary/20 rounded-xl">
            <div className="p-6 border-b border-secondary/20">
              <div className="flex items-center gap-3">
                <ApperIcon name="Calendar" className="w-5 h-5 text-secondary" />
                <h3 className="font-display font-semibold text-white">
                  {selectedDate ? format(selectedDate, "MMMM d, yyyy") : "Select a date"}
                </h3>
              </div>
            </div>

            <div className="p-6">
              {selectedDate ? (
                selectedWebinars.length > 0 ? (
                  <div className="space-y-4">
                    {selectedWebinars.map(webinar => (
                      <div key={webinar.Id} className="p-4 bg-surface/30 border border-secondary/20 rounded-lg">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <h4 className="font-display font-medium text-white">
                              {webinar.title}
                            </h4>
                            <div className={cn(
                              "text-xs px-2 py-1 rounded-full font-medium",
                              webinar.status === "live" ? "bg-error/20 text-error" :
                              webinar.status === "scheduled" ? "bg-warning/20 text-warning" :
                              "bg-secondary/20 text-secondary"
                            )}>
                              {webinar.status.toUpperCase()}
                            </div>
                          </div>
                          
                          {webinar.description && (
                            <p className="text-sm text-gray-300 font-body">
                              {webinar.description}
                            </p>
                          )}
                          
                          <div className="flex items-center gap-4 text-xs text-gray-400 font-body">
                            <div className="flex items-center gap-1">
                              <ApperIcon name="Clock" size={12} />
                              {format(new Date(webinar.scheduledAt), "HH:mm")}
                            </div>
                            <div className="flex items-center gap-1">
                              <ApperIcon name="Hash" size={12} />
                              {webinar.roomCode}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <ApperIcon name="Calendar" size={24} className="text-gray-500 mx-auto mb-2" />
                    <p className="text-gray-400 font-body text-sm">
                      No webinars scheduled for this date
                    </p>
                    <Button
                      variant="accent"
                      size="small"
                      icon="Plus"
                      onClick={() => setShowCreateModal(true)}
                      className="mt-3"
                    >
                      Schedule One
                    </Button>
                  </div>
                )
              ) : (
                <div className="text-center py-8">
                  <ApperIcon name="MousePointer" size={24} className="text-gray-500 mx-auto mb-2" />
                  <p className="text-gray-400 font-body text-sm">
                    Click on a date to view scheduled webinars
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="mt-6 bg-gradient-to-br from-surface/50 to-surface/30 border border-secondary/20 rounded-xl p-6">
            <h3 className="font-display font-semibold text-white mb-4 flex items-center gap-2">
              <ApperIcon name="BarChart3" size={16} />
              This Month
            </h3>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm font-body">
                <span className="text-gray-400">Total Webinars</span>
                <span className="text-white font-medium">
                  {webinars.filter(w => isSameMonth(new Date(w.scheduledAt), currentDate)).length}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm font-body">
                <span className="text-gray-400">Scheduled</span>
                <span className="text-warning font-medium">
                  {webinars.filter(w => 
                    w.status === "scheduled" && isSameMonth(new Date(w.scheduledAt), currentDate)
                  ).length}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm font-body">
                <span className="text-gray-400">Completed</span>
                <span className="text-success font-medium">
                  {webinars.filter(w => 
                    w.status === "ended" && isSameMonth(new Date(w.scheduledAt), currentDate)
                  ).length}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

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

export default Schedule;