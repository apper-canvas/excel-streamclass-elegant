import questionsData from "@/services/mockData/questions.json";

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

let questions = [...questionsData];

export const getQuestions = async () => {
  await delay(200);
  return [...questions].sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
};

export const getQuestionById = async (id) => {
  await delay(150);
  const question = questions.find(q => q.Id === parseInt(id));
  if (!question) {
    throw new Error("Question not found");
  }
  return { ...question };
};

export const createQuestion = async (questionData) => {
  await delay(300);
  const maxId = Math.max(...questions.map(q => q.Id), 0);
  const newQuestion = {
    Id: maxId + 1,
    upvotes: 0,
    isAnswered: false,
    timestamp: new Date().toISOString(),
    ...questionData
  };
  questions.push(newQuestion);
  return { ...newQuestion };
};

export const updateQuestion = async (id, data) => {
  await delay(250);
  const index = questions.findIndex(q => q.Id === parseInt(id));
  if (index === -1) {
    throw new Error("Question not found");
  }
  questions[index] = { ...questions[index], ...data };
  return { ...questions[index] };
};

export const deleteQuestion = async (id) => {
  await delay(200);
  const index = questions.findIndex(q => q.Id === parseInt(id));
  if (index === -1) {
    throw new Error("Question not found");
  }
  questions.splice(index, 1);
  return true;
};