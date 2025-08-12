import pollsData from "@/services/mockData/polls.json";

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

let polls = [...pollsData];

export const getPolls = async () => {
  await delay(200);
  return [...polls].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
};

export const getPollById = async (id) => {
  await delay(150);
  const poll = polls.find(p => p.Id === parseInt(id));
  if (!poll) {
    throw new Error("Poll not found");
  }
  return { ...poll };
};

export const createPoll = async (pollData) => {
  await delay(300);
  const maxId = Math.max(...polls.map(p => p.Id), 0);
  const newPoll = {
    Id: maxId + 1,
    isActive: true,
    createdAt: new Date().toISOString(),
    votes: pollData.options.map(() => 0),
    voters: [],
    ...pollData
  };
  polls.push(newPoll);
  return { ...newPoll };
};

export const votePoll = async (id, voteData) => {
  await delay(250);
  const index = polls.findIndex(p => p.Id === parseInt(id));
  if (index === -1) {
    throw new Error("Poll not found");
  }
  
  const poll = polls[index];
  const { optionIndex, userId } = voteData;
  
  // Check if user already voted
  if (poll.voters.includes(userId)) {
    throw new Error("You have already voted on this poll");
  }
  
  // Add vote
  poll.votes[optionIndex]++;
  poll.voters.push(userId);
  
  return { ...polls[index] };
};

export const updatePoll = async (id, data) => {
  await delay(250);
  const index = polls.findIndex(p => p.Id === parseInt(id));
  if (index === -1) {
    throw new Error("Poll not found");
  }
  polls[index] = { ...polls[index], ...data };
  return { ...polls[index] };
};

export const deletePoll = async (id) => {
  await delay(200);
  const index = polls.findIndex(p => p.Id === parseInt(id));
  if (index === -1) {
    throw new Error("Poll not found");
  }
  polls.splice(index, 1);
  return true;
};