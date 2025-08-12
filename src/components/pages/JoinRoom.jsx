import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import FormField from "@/components/molecules/FormField";
import { getWebinarByRoomCode } from "@/services/api/webinarService";
import { toast } from "react-toastify";

const JoinRoom = () => {
  const [formData, setFormData] = useState({
    roomCode: "",
    name: ""
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [previewWebinar, setPreviewWebinar] = useState(null);
  const navigate = useNavigate();

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }

    // Auto-preview webinar when room code changes
    if (field === "roomCode" && value.length === 6) {
      checkRoomCode(value);
    }
  };

  const checkRoomCode = async (roomCode) => {
    try {
      const webinar = await getWebinarByRoomCode(roomCode);
      setPreviewWebinar(webinar);
      setErrors(prev => ({ ...prev, roomCode: null }));
    } catch (err) {
      setPreviewWebinar(null);
      setErrors(prev => ({ ...prev, roomCode: "Invalid room code" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.roomCode.trim()) {
      newErrors.roomCode = "Room code is required";
    } else if (formData.roomCode.length !== 6) {
      newErrors.roomCode = "Room code must be 6 characters";
    }
    
    if (!formData.name.trim()) {
      newErrors.name = "Your name is required";
    }
    
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    try {
      // In a real app, we would join the participant to the webinar here
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      
      // Navigate to the webinar room
      navigate(`/room/${formData.roomCode}`, {
        state: { participantName: formData.name }
      });
    } catch (err) {
      toast.error("Failed to join webinar");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-md space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-gradient-to-r from-primary to-secondary rounded-2xl flex items-center justify-center mx-auto">
            <ApperIcon name="LogIn" className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-display font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Join Webinar
            </h1>
            <p className="text-gray-400 font-body mt-2">
              Enter your details to join the live session
            </p>
          </div>
        </div>

        {/* Join Form */}
        <div className="bg-gradient-to-br from-surface/50 to-surface/30 border border-secondary/20 rounded-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <FormField
              label="Room Code"
              required
              id="roomCode"
              placeholder="Enter 6-character code"
              value={formData.roomCode}
              onChange={(e) => handleInputChange("roomCode", e.target.value.toUpperCase())}
              error={errors.roomCode}
              className="text-center text-lg font-mono tracking-wider"
              maxLength={6}
            />

            <FormField
              label="Your Name"
              required
              id="name"
              placeholder="Enter your full name"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              error={errors.name}
            />

            {/* Webinar Preview */}
            {previewWebinar && (
              <div className="p-4 bg-secondary/10 border border-secondary/30 rounded-lg">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-primary to-secondary rounded-lg flex items-center justify-center flex-shrink-0">
                    <ApperIcon name="Video" className="w-4 h-4 text-white" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-display font-medium text-white">
                      {previewWebinar.title}
                    </h3>
                    {previewWebinar.description && (
                      <p className="text-sm text-gray-300 font-body">
                        {previewWebinar.description}
                      </p>
                    )}
                    <div className="flex items-center gap-2 text-xs text-gray-400 font-body">
                      <div className={`w-2 h-2 rounded-full ${
                        previewWebinar.status === "live" ? "bg-error animate-pulse" : 
                        previewWebinar.status === "scheduled" ? "bg-warning" : "bg-gray-500"
                      }`}></div>
                      <span className="capitalize">{previewWebinar.status}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <Button
              type="submit"
              variant="accent"
              size="large"
              loading={loading}
              disabled={!previewWebinar}
              className="w-full"
              icon="LogIn"
            >
              Join Webinar
            </Button>
          </form>
        </div>

        {/* Quick Tips */}
        <div className="bg-surface/30 border border-secondary/20 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <ApperIcon name="Info" className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" />
            <div className="space-y-2 text-sm font-body">
              <p className="text-gray-200 font-medium">Before joining:</p>
              <ul className="text-gray-400 space-y-1 text-xs">
                <li>• Make sure your microphone and camera are working</li>
                <li>• Use a stable internet connection</li>
                <li>• Close other applications for better performance</li>
                <li>• Find a quiet environment for the best experience</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Back Link */}
        <div className="text-center">
          <button
            onClick={() => navigate("/")}
            className="text-gray-400 hover:text-white font-body text-sm transition-colors duration-200"
          >
            ← Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default JoinRoom;