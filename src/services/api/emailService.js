import webinarsData from "@/services/mockData/webinars.json";

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const emailService = {
  async sendConfirmationEmail(registration) {
    await delay(300);
    
    const webinar = webinarsData.find(w => w.Id === registration.webinarId);
    if (!webinar) {
      throw new Error("Webinar not found for confirmation email");
    }
    
    // Mock email sending logic
    const emailContent = {
      to: registration.email,
      subject: `Registration Confirmed: ${webinar.title}`,
      body: `
        Dear ${registration.firstName} ${registration.lastName},
        
        Thank you for registering for "${webinar.title}".
        
        Event Details:
        - Date: ${new Date(webinar.scheduledDate).toLocaleDateString()}
        - Time: ${new Date(webinar.scheduledDate).toLocaleTimeString()}
        - Duration: ${webinar.duration} minutes
        
        Join Link: ${window.location.origin}/join?room=${webinar.roomCode}
        
        We look forward to seeing you there!
        
        Best regards,
        StreamClass Team
      `,
      type: "confirmation"
    };
    
    console.log("Confirmation Email:", emailContent);
    
    // Simulate successful email sending
    return {
      messageId: `conf_${Date.now()}_${registration.Id}`,
      status: "sent",
      timestamp: new Date().toISOString()
    };
  },
  
  async sendReminderEmail(registration, reminderType = "24h") {
    await delay(250);
    
    const webinar = webinarsData.find(w => w.Id === registration.webinarId);
    if (!webinar) {
      throw new Error("Webinar not found for reminder email");
    }
    
    const reminderMessages = {
      "24h": "This is a friendly reminder that your webinar starts in 24 hours.",
      "1h": "Your webinar starts in 1 hour. Get ready!",
      "15m": "Your webinar is starting in 15 minutes. Join now!"
    };
    
    const emailContent = {
      to: registration.email,
      subject: `Reminder: "${webinar.title}" ${reminderType === "15m" ? "Starting Soon!" : "Tomorrow"}`,
      body: `
        Dear ${registration.firstName} ${registration.lastName},
        
        ${reminderMessages[reminderType]}
        
        Event: ${webinar.title}
        Date: ${new Date(webinar.scheduledDate).toLocaleDateString()}
        Time: ${new Date(webinar.scheduledDate).toLocaleTimeString()}
        
        Join Link: ${window.location.origin}/join?room=${webinar.roomCode}
        
        See you there!
        
        Best regards,
        StreamClass Team
      `,
      type: "reminder",
      reminderType
    };
    
    console.log("Reminder Email:", emailContent);
    
    return {
      messageId: `rem_${Date.now()}_${registration.Id}`,
      status: "sent",
      timestamp: new Date().toISOString(),
      reminderType
    };
  },
  
  async sendBulkReminders(registrations, reminderType = "24h") {
    await delay(500);
    
    const results = [];
    for (const registration of registrations) {
      try {
        const result = await this.sendReminderEmail(registration, reminderType);
        results.push({
          registrationId: registration.Id,
          email: registration.email,
          status: "sent",
          messageId: result.messageId
        });
      } catch (error) {
        results.push({
          registrationId: registration.Id,
          email: registration.email,
          status: "failed",
          error: error.message
        });
      }
    }
    
    return {
      total: registrations.length,
      sent: results.filter(r => r.status === "sent").length,
      failed: results.filter(r => r.status === "failed").length,
      results
    };
  },
  
  async getEmailTemplate(type) {
    await delay(100);
    
    const templates = {
      confirmation: {
        subject: "Registration Confirmed: {{webinarTitle}}",
        body: `
          Dear {{firstName}} {{lastName}},
          
          Thank you for registering for "{{webinarTitle}}".
          
          Event Details:
          - Date: {{webinarDate}}
          - Time: {{webinarTime}}
          - Duration: {{webinarDuration}} minutes
          
          Join Link: {{joinLink}}
          
          We look forward to seeing you there!
          
          Best regards,
          StreamClass Team
        `
      },
      reminder: {
        subject: "Reminder: {{webinarTitle}} {{timePhrase}}",
        body: `
          Dear {{firstName}} {{lastName}},
          
          {{reminderMessage}}
          
          Event: {{webinarTitle}}
          Date: {{webinarDate}}
          Time: {{webinarTime}}
          
          Join Link: {{joinLink}}
          
          See you there!
          
          Best regards,
          StreamClass Team
        `
      }
    };
    
    return templates[type] || templates.confirmation;
  }
};