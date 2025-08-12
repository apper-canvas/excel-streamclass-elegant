import webinarsData from "@/services/mockData/webinars.json";

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

let webinars = [...webinarsData];

export const getWebinars = async () => {
  await delay(300);
  return [...webinars];
};

export const getWebinarById = async (id) => {
  await delay(200);
  const webinar = webinars.find(w => w.Id === parseInt(id));
  if (!webinar) {
    throw new Error("Webinar not found");
  }
  return { ...webinar };
};

export const getWebinarByRoomCode = async (roomCode) => {
  await delay(250);
  const webinar = webinars.find(w => w.roomCode === roomCode);
  if (!webinar) {
    throw new Error("Webinar room not found");
  }
  return { ...webinar };
};

export const createWebinar = async (webinarData) => {
  await delay(400);
  const maxId = Math.max(...webinars.map(w => w.Id), 0);
  const newWebinar = {
    Id: maxId + 1,
    ...webinarData,
    hostId: "1", // Mock current user ID
    isRecording: false,
    status: "scheduled"
  };
  webinars.unshift(newWebinar);
  return { ...newWebinar };
};

export const updateWebinar = async (id, data) => {
  await delay(300);
  const index = webinars.findIndex(w => w.Id === parseInt(id));
  if (index === -1) {
    throw new Error("Webinar not found");
  }
  webinars[index] = { ...webinars[index], ...data };
  return { ...webinars[index] };
};

export const deleteWebinar = async (id) => {
  await delay(250);
  const index = webinars.findIndex(w => w.Id === parseInt(id));
  if (index === -1) {
    throw new Error("Webinar not found");
  }
  webinars.splice(index, 1);
  return true;
};

// Default export as service object
const webinarService = {
  getWebinars,
  getWebinarById,
  getWebinarByRoomCode,
  createWebinar,
  updateWebinar,
  deleteWebinar
};

export default webinarService;