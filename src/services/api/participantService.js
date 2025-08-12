import participantsData from "@/services/mockData/participants.json";

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

let participants = [...participantsData];

export const getParticipants = async () => {
  await delay(200);
  return [...participants];
};

export const getParticipantById = async (id) => {
  await delay(150);
  const participant = participants.find(p => p.Id === parseInt(id));
  if (!participant) {
    throw new Error("Participant not found");
  }
  return { ...participant };
};

export const createParticipant = async (participantData) => {
  await delay(300);
  const maxId = Math.max(...participants.map(p => p.Id), 0);
  const newParticipant = {
    Id: maxId + 1,
    joinedAt: new Date().toISOString(),
    isVideoOn: false,
    isAudioOn: true,
    connectionStatus: "connected",
    ...participantData
  };
  participants.push(newParticipant);
  return { ...newParticipant };
};

export const registerParticipant = async (registrationData) => {
  await delay(300);
  const maxId = Math.max(...participants.map(p => p.Id), 0);
  const newRegistration = {
    Id: maxId + 1,
    registeredAt: new Date().toISOString(),
    status: "registered",
    isVideoOn: false,
    isAudioOn: true,
    connectionStatus: "pending",
    ...registrationData
  };
  participants.push(newRegistration);
  
  // Send confirmation email and calendar invite
  if (registrationData.email) {
    // Mock email service integration would go here
    console.log(`Confirmation email sent to ${registrationData.email}`);
  }
  
  return { ...newRegistration };
};

export const updateParticipant = async (id, data) => {
  await delay(200);
  const index = participants.findIndex(p => p.Id === parseInt(id));
  if (index === -1) {
    throw new Error("Participant not found");
  }
  participants[index] = { ...participants[index], ...data };
  return { ...participants[index] };
};

export const deleteParticipant = async (id) => {
  await delay(200);
  const index = participants.findIndex(p => p.Id === parseInt(id));
  if (index === -1) {
    throw new Error("Participant not found");
  }
  participants.splice(index, 1);
  return true;
};