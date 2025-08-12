import messagesData from "@/services/mockData/messages.json";

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

let messages = [...messagesData];

export const getMessages = async () => {
  await delay(200);
  return [...messages].sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
};

export const getMessageById = async (id) => {
  await delay(150);
  const message = messages.find(m => m.Id === parseInt(id));
  if (!message) {
    throw new Error("Message not found");
  }
  return { ...message };
};

export const createMessage = async (messageData) => {
  await delay(250);
  const maxId = Math.max(...messages.map(m => m.Id), 0);
  const newMessage = {
    Id: maxId + 1,
    timestamp: new Date().toISOString(),
    type: "chat",
    ...messageData
  };
  messages.push(newMessage);
  return { ...newMessage };
};

export const updateMessage = async (id, data) => {
  await delay(200);
  const index = messages.findIndex(m => m.Id === parseInt(id));
  if (index === -1) {
    throw new Error("Message not found");
  }
  messages[index] = { ...messages[index], ...data };
  return { ...messages[index] };
};

export const deleteMessage = async (id) => {
  await delay(200);
  const index = messages.findIndex(m => m.Id === parseInt(id));
  if (index === -1) {
    throw new Error("Message not found");
  }
  messages.splice(index, 1);
  return true;
};