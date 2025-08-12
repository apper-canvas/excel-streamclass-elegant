import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import FormField from "@/components/molecules/FormField";
import Button from "@/components/atoms/Button";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import ApperIcon from "@/components/ApperIcon";
import { registrationService } from "@/services/api/registrationService";
import { webinarService } from "@/services/api/webinarService";

const Registration = () => {
  const { webinarId } = useParams();
  const navigate = useNavigate();
  
  const [webinar, setWebinar] = useState(null);
  const [formConfig, setFormConfig] = useState(null);
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadRegistrationData();
  }, [webinarId]);

  const loadRegistrationData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [configData, webinarData] = await Promise.all([
        registrationService.getActiveFormConfiguration(),
        webinarId ? webinarService.getWebinarById(webinarId) : Promise.resolve(null)
      ]);

      setFormConfig(configData);
      setWebinar(webinarData);

      // Initialize form data with empty values
      const initialData = {};
      configData.fields.forEach(field => {
        initialData[field.id] = field.type === "checkbox" ? false : "";
      });
      
      if (webinarData) {
        initialData.webinarId = parseInt(webinarId);
      }
      
      setFormData(initialData);
    } catch (err) {
      setError(err.message);
      toast.error("Failed to load registration form");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (fieldId, value) => {
    setFormData(prev => ({
      ...prev,
      [fieldId]: value
    }));
    
    // Clear error when user starts typing
    if (errors[fieldId]) {
      setErrors(prev => ({
        ...prev,
        [fieldId]: null
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    formConfig.fields.forEach(field => {
      if (field.required) {
        const value = formData[field.id];
        if (!value || (typeof value === "string" && value.trim() === "")) {
          newErrors[field.id] = `${field.label} is required`;
        }
      }
      
      // Email validation
      if (field.type === "email" && formData[field.id]) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData[field.id])) {
          newErrors[field.id] = "Please enter a valid email address";
        }
      }
    });
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error("Please fix the errors in the form");
      return;
    }

    try {
      setSubmitting(true);
      
      // Prepare registration data
      const registrationData = { ...formData };
      
      // Handle custom fields
      const customFields = {};
      formConfig.fields.forEach(field => {
        if (!["firstName", "lastName", "email", "company", "jobTitle", "phone"].includes(field.id)) {
          customFields[field.id] = formData[field.id];
          delete registrationData[field.id];
        }
      });
      
      if (Object.keys(customFields).length > 0) {
        registrationData.customFields = customFields;
      }

      const result = await registrationService.createRegistration(registrationData);
      
      toast.success("Registration successful! Confirmation email sent.");
      
      // Navigate to appropriate page
      if (webinar) {
        navigate(`/schedule`, { 
          state: { 
            message: `Successfully registered for "${webinar.title}"`,
            registrationId: result.Id 
          }
        });
      } else {
        navigate("/dashboard", {
          state: {
            message: "Registration completed successfully",
            registrationId: result.Id
          }
        });
      }
    } catch (err) {
      toast.error(err.message || "Registration failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Loading message="Loading registration form..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Error 
          message={error}
          onRetry={loadRegistrationData}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <ApperIcon name="UserPlus" size={32} className="text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-gray-100 font-display mb-2">
            {webinar ? `Register for ${webinar.title}` : "Event Registration"}
          </h1>
          <p className="text-gray-400 font-body">
            {webinar 
              ? `Join us on ${new Date(webinar.scheduledDate).toLocaleDateString()}`
              : "Complete the form below to register for this event"
            }
          </p>
        </div>

        {/* Webinar Details Card */}
        {webinar && (
          <div className="bg-surface border border-secondary/30 rounded-lg p-6 mb-8">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-gray-100 font-display mb-2">
                  {webinar.title}
                </h3>
                <p className="text-gray-400 font-body mb-4">{webinar.description}</p>
                <div className="flex flex-wrap gap-4 text-sm text-gray-300">
                  <div className="flex items-center">
                    <ApperIcon name="Calendar" size={16} className="mr-2 text-primary" />
                    {new Date(webinar.scheduledDate).toLocaleDateString()}
                  </div>
                  <div className="flex items-center">
                    <ApperIcon name="Clock" size={16} className="mr-2 text-primary" />
                    {new Date(webinar.scheduledDate).toLocaleTimeString()}
                  </div>
                  <div className="flex items-center">
                    <ApperIcon name="Timer" size={16} className="mr-2 text-primary" />
                    {webinar.duration} minutes
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-primary font-display">
                  {webinar.registrationCount || 0}
                </p>
                <p className="text-sm text-gray-400">registered</p>
              </div>
            </div>
          </div>
        )}

        {/* Registration Form */}
        <div className="bg-surface border border-secondary/30 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-100 font-display mb-6">
            Registration Information
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {formConfig.fields
              .sort((a, b) => a.order - b.order)
              .map(field => (
                <FormField
                  key={field.id}
                  id={field.id}
                  type={field.type}
                  label={field.label}
                  required={field.required}
                  options={field.options}
                  error={errors[field.id]}
                  value={formData[field.id] || ""}
                  checked={field.type === "checkbox" ? formData[field.id] : undefined}
                  onChange={(e) => {
                    const value = field.type === "checkbox" 
                      ? e.target.checked 
                      : e.target.value;
                    handleInputChange(field.id, value);
                  }}
                  placeholder={field.placeholder || `Enter ${field.label.toLowerCase()}`}
                />
              ))}
            
            {/* Submit Button */}
            <div className="pt-4">
              <Button
                type="submit"
                disabled={submitting}
                className="w-full"
                size="lg"
              >
                {submitting ? (
                  <>
                    <ApperIcon name="Loader2" size={16} className="mr-2 animate-spin" />
                    Registering...
                  </>
                ) : (
                  <>
                    <ApperIcon name="UserPlus" size={16} className="mr-2" />
                    Complete Registration
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>

        {/* Benefits Section */}
        <div className="mt-8 bg-surface border border-secondary/30 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-100 font-display mb-4 flex items-center">
            <ApperIcon name="CheckCircle" size={20} className="mr-2 text-success" />
            What you'll receive:
          </h3>
          <ul className="space-y-2 text-gray-300 font-body">
            <li className="flex items-center">
              <ApperIcon name="Mail" size={16} className="mr-3 text-primary" />
              Instant confirmation email with event details
            </li>
            <li className="flex items-center">
              <ApperIcon name="Calendar" size={16} className="mr-3 text-primary" />
              Calendar invite with automatic reminders
            </li>
            <li className="flex items-center">
              <ApperIcon name="Bell" size={16} className="mr-3 text-primary" />
              Email reminders 24 hours and 1 hour before the event
            </li>
            <li className="flex items-center">
              <ApperIcon name="Link" size={16} className="mr-3 text-primary" />
              Direct join link for easy access
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Registration;