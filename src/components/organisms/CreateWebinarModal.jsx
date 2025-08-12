import React, { useState } from "react";
import { format } from "date-fns";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import FormField from "@/components/molecules/FormField";
import { cn } from "@/utils/cn";

const CreateWebinarModal = ({ isOpen, onClose, onSubmit, loading = false }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    scheduledAt: "",
    roomCode: ""
  });
  const [errors, setErrors] = useState({});

  const generateRoomCode = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let result = "";
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    }
    
    if (!formData.scheduledAt) {
      newErrors.scheduledAt = "Date and time is required";
    } else {
      const scheduledDate = new Date(formData.scheduledAt);
      if (scheduledDate <= new Date()) {
        newErrors.scheduledAt = "Date must be in the future";
      }
    }
    
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const roomCode = formData.roomCode || generateRoomCode();
    
    onSubmit?.({
      ...formData,
      roomCode,
      scheduledAt: new Date(formData.scheduledAt).toISOString()
    });
  };

  const handleGenerateCode = () => {
    handleInputChange("roomCode", generateRoomCode());
  };

  const handleReset = () => {
    setFormData({
      title: "",
      description: "",
      scheduledAt: "",
      roomCode: ""
    });
    setErrors({});
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-md bg-surface border border-secondary/20 rounded-xl shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-secondary/20">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-r from-primary to-secondary rounded-lg flex items-center justify-center">
              <ApperIcon name="Plus" className="w-4 h-4 text-white" />
            </div>
            <h2 className="text-lg font-display font-semibold text-white">
              Create Webinar
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white hover:bg-surface/50 rounded-lg transition-colors duration-200"
          >
            <ApperIcon name="X" size={16} />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <FormField
            label="Webinar Title"
            required
            id="title"
            placeholder="Enter webinar title"
            value={formData.title}
            onChange={(e) => handleInputChange("title", e.target.value)}
            error={errors.title}
          />

          <FormField
            label="Description"
            id="description"
            placeholder="Brief description of the webinar"
            value={formData.description}
            onChange={(e) => handleInputChange("description", e.target.value)}
            error={errors.description}
          />

          <FormField
            label="Date & Time"
            required
            id="scheduledAt"
            type="datetime-local"
            value={formData.scheduledAt}
            onChange={(e) => handleInputChange("scheduledAt", e.target.value)}
            error={errors.scheduledAt}
            min={format(new Date(), "yyyy-MM-dd'T'HH:mm")}
          />

          <div className="space-y-2">
            <FormField
              label="Room Code"
              id="roomCode"
              placeholder="Auto-generated"
              value={formData.roomCode}
              onChange={(e) => handleInputChange("roomCode", e.target.value.toUpperCase())}
              error={errors.roomCode}
            />
            <Button
              type="button"
              variant="secondary"
              size="small"
              icon="Shuffle"
              onClick={handleGenerateCode}
            >
              Generate Code
            </Button>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t border-secondary/20">
            <Button
              type="button"
              variant="secondary"
              onClick={handleReset}
              className="flex-1"
            >
              Reset
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={onClose}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="accent"
              loading={loading}
              className="flex-1"
            >
              Create
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateWebinarModal;