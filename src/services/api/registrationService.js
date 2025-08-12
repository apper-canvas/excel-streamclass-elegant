import registrationsData from "@/services/mockData/registrations.json";
import formConfigurationsData from "@/services/mockData/formConfigurations.json";
import { emailService } from "./emailService";
import { calendarService } from "./calendarService";

let registrations = [...registrationsData];
let formConfigurations = [...formConfigurationsData];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Registration CRUD operations
export const getRegistrations = async () => {
  await delay(200);
  return [...registrations];
};

export const getRegistrationsByWebinar = async (webinarId) => {
  await delay(200);
  return registrations.filter(r => r.webinarId === parseInt(webinarId));
};

export const getRegistrationById = async (id) => {
  await delay(150);
  const registration = registrations.find(r => r.Id === parseInt(id));
  if (!registration) {
    throw new Error("Registration not found");
  }
  return { ...registration };
};

export const createRegistration = async (registrationData) => {
  await delay(300);
  const maxId = Math.max(...registrations.map(r => r.Id), 0);
  const newRegistration = {
    Id: maxId + 1,
    registeredAt: new Date().toISOString(),
    status: "confirmed",
    remindersSent: [],
    ...registrationData
  };
  
  registrations.push(newRegistration);
  
  // Send confirmation email
  if (newRegistration.email) {
    try {
      await emailService.sendConfirmationEmail(newRegistration);
      console.log(`Confirmation email sent to ${newRegistration.email}`);
    } catch (error) {
      console.error("Failed to send confirmation email:", error);
    }
  }
  
  // Create calendar event and send invite
  if (newRegistration.webinarId) {
    try {
      await calendarService.createEventAndSendInvite(newRegistration);
      console.log(`Calendar invite sent to ${newRegistration.email}`);
    } catch (error) {
      console.error("Failed to send calendar invite:", error);
    }
  }
  
  return { ...newRegistration };
};

export const updateRegistration = async (id, updateData) => {
  await delay(250);
  const index = registrations.findIndex(r => r.Id === parseInt(id));
  if (index === -1) {
    throw new Error("Registration not found");
  }
  
  registrations[index] = { ...registrations[index], ...updateData };
  return { ...registrations[index] };
};

export const deleteRegistration = async (id) => {
  await delay(200);
  const index = registrations.findIndex(r => r.Id === parseInt(id));
  if (index === -1) {
    throw new Error("Registration not found");
  }
  
  registrations.splice(index, 1);
  return true;
};

// Form configuration operations
export const getFormConfigurations = async () => {
  await delay(200);
  return [...formConfigurations];
};

export const getFormConfigurationById = async (id) => {
  await delay(150);
  const config = formConfigurations.find(c => c.Id === parseInt(id));
  if (!config) {
    throw new Error("Form configuration not found");
  }
  return { ...config };
};

export const getActiveFormConfiguration = async () => {
  await delay(150);
  const activeConfig = formConfigurations.find(c => c.isActive);
  return activeConfig ? { ...activeConfig } : formConfigurations[0];
};

export const createFormConfiguration = async (configData) => {
  await delay(300);
  const maxId = Math.max(...formConfigurations.map(c => c.Id), 0);
  const newConfig = {
    Id: maxId + 1,
    createdAt: new Date().toISOString(),
    isActive: false,
    ...configData
  };
  
  formConfigurations.push(newConfig);
  return { ...newConfig };
};

export const updateFormConfiguration = async (id, updateData) => {
  await delay(250);
  const index = formConfigurations.findIndex(c => c.Id === parseInt(id));
  if (index === -1) {
    throw new Error("Form configuration not found");
  }
  
  // If setting this config as active, deactivate others
  if (updateData.isActive) {
    formConfigurations.forEach((config, idx) => {
      if (idx !== index) {
        config.isActive = false;
      }
    });
  }
  
  formConfigurations[index] = { ...formConfigurations[index], ...updateData };
  return { ...formConfigurations[index] };
};

export const sendReminders = async (webinarId, reminderType = "email") => {
  await delay(500);
  const webinarRegistrations = registrations.filter(r => r.webinarId === parseInt(webinarId));
  const results = [];
  
  for (const registration of webinarRegistrations) {
    try {
      if (reminderType === "email") {
        await emailService.sendReminderEmail(registration);
      }
      
      // Update registration with reminder sent
      const reminderRecord = {
        type: reminderType,
        sentAt: new Date().toISOString(),
        status: "delivered"
      };
      
      registration.remindersSent = registration.remindersSent || [];
      registration.remindersSent.push(reminderRecord);
      
      results.push({
        registrationId: registration.Id,
        status: "sent",
        email: registration.email
      });
    } catch (error) {
      results.push({
        registrationId: registration.Id,
        status: "failed",
        email: registration.email,
        error: error.message
      });
    }
  }
  
  return results;
};