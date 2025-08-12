import webinarsData from "@/services/mockData/webinars.json";

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const calendarService = {
  async createEventAndSendInvite(registration) {
    await delay(400);
    
    const webinar = webinarsData.find(w => w.Id === registration.webinarId);
    if (!webinar) {
      throw new Error("Webinar not found for calendar event");
    }
    
    const startDate = new Date(webinar.scheduledDate);
    const endDate = new Date(startDate.getTime() + (webinar.duration * 60000));
    
    // Generate ICS calendar event format
    const calendarEvent = {
      uid: `webinar_${webinar.Id}_${registration.Id}@streamclass.com`,
      dtstart: startDate.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, ''),
      dtend: endDate.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, ''),
      summary: webinar.title,
      description: `${webinar.description}\n\nJoin Link: ${window.location.origin}/join?room=${webinar.roomCode}`,
      location: "Online Webinar",
      organizer: "StreamClass <noreply@streamclass.com>",
      attendee: `${registration.firstName} ${registration.lastName} <${registration.email}>`,
      status: "CONFIRMED",
      sequence: 0,
      created: new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, ''),
      lastModified: new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '')
    };
    
    // Mock calendar invite generation
    const icsContent = this.generateICSContent(calendarEvent);
    
    console.log("Calendar Event Created:", calendarEvent);
    console.log("ICS Content:", icsContent);
    
    return {
      eventId: calendarEvent.uid,
      icsContent,
      status: "created",
      inviteSent: true,
      timestamp: new Date().toISOString()
    };
  },
  
  async sendReminderCalendarUpdate(registration, reminderType = "24h") {
    await delay(300);
    
    const webinar = webinarsData.find(w => w.Id === registration.webinarId);
    if (!webinar) {
      throw new Error("Webinar not found for calendar reminder");
    }
    
    const reminderMinutes = {
      "24h": 1440,
      "1h": 60,
      "15m": 15
    };
    
    const reminderUpdate = {
      eventId: `webinar_${webinar.Id}_${registration.Id}@streamclass.com`,
      reminderType,
      reminderMinutes: reminderMinutes[reminderType],
      updatedAt: new Date().toISOString()
    };
    
    console.log("Calendar Reminder Update:", reminderUpdate);
    
    return reminderUpdate;
  },
  
  generateICSContent(event) {
    return `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//StreamClass//Webinar Calendar//EN
CALSCALE:GREGORIAN
METHOD:REQUEST
BEGIN:VEVENT
UID:${event.uid}
DTSTART:${event.dtstart}
DTEND:${event.dtend}
DTSTAMP:${event.created}
ORGANIZER;CN=StreamClass:MAILTO:noreply@streamclass.com
ATTENDEE;CN=${event.attendee.split('<')[0].trim()};RSVP=TRUE:MAILTO:${event.attendee.split('<')[1].replace('>', '')}
SUMMARY:${event.summary}
DESCRIPTION:${event.description.replace(/\n/g, '\\n')}
LOCATION:${event.location}
STATUS:${event.status}
SEQUENCE:${event.sequence}
CREATED:${event.created}
LAST-MODIFIED:${event.lastModified}
BEGIN:VALARM
TRIGGER:-PT15M
ACTION:DISPLAY
DESCRIPTION:Reminder: ${event.summary} starts in 15 minutes
END:VALARM
BEGIN:VALARM
TRIGGER:-PT1H
ACTION:EMAIL
DESCRIPTION:Reminder: ${event.summary} starts in 1 hour
SUMMARY:Webinar Reminder
ATTENDEE:MAILTO:${event.attendee.split('<')[1].replace('>', '')}
END:VALARM
END:VEVENT
END:VCALENDAR`;
  },
  
  async createRecurringEvent(registration, recurrenceRule) {
    await delay(500);
    
    const webinar = webinarsData.find(w => w.Id === registration.webinarId);
    if (!webinar) {
      throw new Error("Webinar not found for recurring event");
    }
    
    const baseEvent = await this.createEventAndSendInvite(registration);
    
    const recurringEvent = {
      ...baseEvent,
      recurrence: recurrenceRule,
      seriesId: `series_${webinar.Id}_${Date.now()}`,
      isRecurring: true
    };
    
    console.log("Recurring Calendar Event Created:", recurringEvent);
    
    return recurringEvent;
  },
  
  async cancelEvent(eventId, reason = "Event cancelled") {
    await delay(200);
    
    const cancellation = {
      eventId,
      status: "CANCELLED",
      reason,
      cancelledAt: new Date().toISOString()
    };
    
    console.log("Calendar Event Cancelled:", cancellation);
    
    return cancellation;
  }
};