import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import ApperIcon from "@/components/ApperIcon";
import SearchBar from "@/components/molecules/SearchBar";
import { registrationService } from "@/services/api/registrationService";

const RegistrationManager = ({ webinarId }) => {
  const [registrations, setRegistrations] = useState([]);
  const [filteredRegistrations, setFilteredRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sendingReminders, setSendingReminders] = useState(false);

  useEffect(() => {
    loadRegistrations();
  }, [webinarId]);

  useEffect(() => {
    filterRegistrations();
  }, [registrations, searchQuery, statusFilter]);

  const loadRegistrations = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = webinarId 
        ? await registrationService.getRegistrationsByWebinar(webinarId)
        : await registrationService.getRegistrations();
      
      setRegistrations(data);
    } catch (err) {
      setError(err.message);
      toast.error("Failed to load registrations");
    } finally {
      setLoading(false);
    }
  };

  const filterRegistrations = () => {
    let filtered = registrations;

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(reg => 
        reg.firstName?.toLowerCase().includes(query) ||
        reg.lastName?.toLowerCase().includes(query) ||
        reg.email?.toLowerCase().includes(query) ||
        reg.company?.toLowerCase().includes(query)
      );
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(reg => reg.status === statusFilter);
    }

    setFilteredRegistrations(filtered);
  };

  const handleSendReminders = async (reminderType = "email") => {
    if (!webinarId) {
      toast.error("Please select a webinar to send reminders");
      return;
    }

    try {
      setSendingReminders(true);
      const results = await registrationService.sendReminders(webinarId, reminderType);
      
      const sentCount = results.filter(r => r.status === "sent").length;
      const failedCount = results.filter(r => r.status === "failed").length;
      
      if (sentCount > 0) {
        toast.success(`Sent ${sentCount} reminder${sentCount !== 1 ? 's' : ''}`);
      }
      
      if (failedCount > 0) {
        toast.warning(`${failedCount} reminder${failedCount !== 1 ? 's' : ''} failed to send`);
      }
      
      // Reload registrations to show updated reminder status
      await loadRegistrations();
    } catch (err) {
      toast.error(err.message || "Failed to send reminders");
    } finally {
      setSendingReminders(false);
    }
  };

  const handleDeleteRegistration = async (registrationId) => {
    if (!window.confirm("Are you sure you want to delete this registration?")) {
      return;
    }

    try {
      await registrationService.deleteRegistration(registrationId);
      toast.success("Registration deleted successfully");
      await loadRegistrations();
    } catch (err) {
      toast.error(err.message || "Failed to delete registration");
    }
  };

  const getStatusBadge = (status) => {
    const variants = {
      confirmed: "success",
      pending: "warning", 
      cancelled: "error"
    };
    
    return (
      <Badge variant={variants[status] || "secondary"}>
        {status}
      </Badge>
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  if (loading) {
    return <Loading message="Loading registrations..." />;
  }

  if (error) {
    return (
      <Error 
        message={error}
        onRetry={loadRegistrations}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-100 font-display">
            Registrations
          </h2>
          <p className="text-gray-400 font-body">
            {registrations.length} total registration{registrations.length !== 1 ? 's' : ''}
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleSendReminders("email")}
            disabled={sendingReminders || !webinarId}
          >
            {sendingReminders ? (
              <ApperIcon name="Loader2" size={16} className="mr-2 animate-spin" />
            ) : (
              <ApperIcon name="Mail" size={16} className="mr-2" />
            )}
            Send Reminders
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search by name, email, or company..."
          />
        </div>
        
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 bg-surface border border-secondary/30 rounded-lg text-gray-100 font-body focus:outline-none focus:ring-2 focus:ring-primary/50"
        >
          <option value="all">All Status</option>
          <option value="confirmed">Confirmed</option>
          <option value="pending">Pending</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {/* Registrations List */}
      {filteredRegistrations.length === 0 ? (
        <div className="text-center py-12 bg-surface border border-secondary/30 rounded-lg">
          <ApperIcon name="UserX" size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-xl font-semibold text-gray-300 font-display mb-2">
            {searchQuery || statusFilter !== "all" ? "No matching registrations" : "No registrations yet"}
          </h3>
          <p className="text-gray-400 font-body">
            {searchQuery || statusFilter !== "all" 
              ? "Try adjusting your filters"
              : "Registrations will appear here once people sign up"
            }
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredRegistrations.map(registration => (
            <div
              key={registration.Id}
              className="bg-surface border border-secondary/30 rounded-lg p-6 hover:border-secondary/50 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-100 font-display">
                      {registration.firstName} {registration.lastName}
                    </h3>
                    {getStatusBadge(registration.status)}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-400 font-body">
                        <ApperIcon name="Mail" size={14} className="inline mr-1" />
                        {registration.email}
                      </p>
                      {registration.phone && (
                        <p className="text-gray-400 font-body mt-1">
                          <ApperIcon name="Phone" size={14} className="inline mr-1" />
                          {registration.phone}
                        </p>
                      )}
                    </div>
                    
                    <div>
                      {registration.company && (
                        <p className="text-gray-400 font-body">
                          <ApperIcon name="Building" size={14} className="inline mr-1" />
                          {registration.company}
                        </p>
                      )}
                      {registration.jobTitle && (
                        <p className="text-gray-400 font-body mt-1">
                          <ApperIcon name="Briefcase" size={14} className="inline mr-1" />
                          {registration.jobTitle}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
                    <span>
                      Registered: {formatDate(registration.registeredAt)}
                    </span>
                    {registration.remindersSent?.length > 0 && (
                      <span>
                        <ApperIcon name="Bell" size={12} className="inline mr-1" />
                        {registration.remindersSent.length} reminder{registration.remindersSent.length !== 1 ? 's' : ''} sent
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="flex gap-2 ml-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteRegistration(registration.Id)}
                    className="text-error hover:text-error hover:bg-error/10"
                  >
                    <ApperIcon name="Trash2" size={16} />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RegistrationManager;