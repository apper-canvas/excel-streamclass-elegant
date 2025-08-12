import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import VideoGrid from "@/components/organisms/VideoGrid";
import WebinarSidebar from "@/components/organisms/WebinarSidebar";
import { getWebinarByRoomCode } from "@/services/api/webinarService";
import { getParticipants } from "@/services/api/participantService";
import { getMessages, createMessage } from "@/services/api/messageService";
import { getQuestions, createQuestion, updateQuestion } from "@/services/api/questionService";
import { getPolls, createPoll, votePoll } from "@/services/api/pollService";
import { toast } from "react-toastify";

const WebinarRoom = () => {
  const { roomCode } = useParams();
  const navigate = useNavigate();
  
const [webinar, setWebinar] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [messages, setMessages] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [polls, setPolls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  // Mock current user - in a real app this would come from auth
  const [currentUser] = useState({
    Id: 1,
    name: "Current User",
    role: "host",
    isVideoOn: true,
    isAudioOn: true,
    connectionStatus: "connected"
  });

const loadRoomData = async () => {
    try {
      setError(null);
      const [webinarData, participantsData, messagesData, questionsData, pollsData] = await Promise.all([
        getWebinarByRoomCode(roomCode),
        getParticipants(),
        getMessages(),
        getQuestions(),
        getPolls()
      ]);
      
      setWebinar(webinarData);
      setParticipants(participantsData);
      setMessages(messagesData);
      setQuestions(questionsData);
      setPolls(pollsData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRoomData();
  }, [roomCode]);

  const handleSendMessage = async (content) => {
    try {
      const newMessage = await createMessage({
        participantId: currentUser.Id,
        content,
        type: "chat",
        timestamp: new Date().toISOString()
      });
      setMessages(prev => [...prev, newMessage]);
    } catch (err) {
      toast.error("Failed to send message");
    }
  };

  const handleSubmitQuestion = async (content) => {
    try {
      const newQuestion = await createQuestion({
        participantId: currentUser.Id,
        content,
        upvotes: 0,
        isAnswered: false,
        timestamp: new Date().toISOString()
      });
      setQuestions(prev => [...prev, newQuestion]);
      toast.success("Question submitted!");
    } catch (err) {
      toast.error("Failed to submit question");
    }
  };

  const handleUpvoteQuestion = async (questionId) => {
    try {
      const question = questions.find(q => q.Id === questionId);
      if (!question) return;

      const updatedQuestion = await updateQuestion(questionId, {
        ...question,
        upvotes: question.upvotes + 1
      });
      
      setQuestions(prev => 
        prev.map(q => q.Id === questionId ? updatedQuestion : q)
      );
    } catch (err) {
      toast.error("Failed to upvote question");
    }
  };

const handleAnswerQuestion = async (questionId) => {
    try {
      const question = questions.find(q => q.Id === questionId);
      if (!question) return;

      const updatedQuestion = await updateQuestion(questionId, {
        ...question,
        isAnswered: true
      });
      
      setQuestions(prev => 
        prev.map(q => q.Id === questionId ? updatedQuestion : q)
      );
      
      toast.success("Question marked as answered");
    } catch (err) {
      toast.error("Failed to answer question");
    }
  };

  const handleCreatePoll = async (pollData) => {
    try {
      const newPoll = await createPoll({
        ...pollData,
        createdBy: currentUser?.name || "Host",
        webinarId: webinar?.Id
      });
      
      setPolls(prev => [...prev, newPoll]);
      toast.success("Poll created successfully");
    } catch (err) {
      toast.error("Failed to create poll");
    }
  };

  const handleVotePoll = async (pollId, optionIndex) => {
    try {
      const updatedPoll = await votePoll(pollId, {
        optionIndex,
        userId: currentUser?.Id || 1
      });
      
      setPolls(prev => 
        prev.map(p => p.Id === pollId ? updatedPoll : p)
      );
      
      toast.success("Vote submitted successfully");
    } catch (err) {
      toast.error("Failed to submit vote");
    }
  };

  const handleToggleVideo = () => {
    // In a real app, this would toggle the user's video stream
    toast.info("Video toggled");
  };

  const handleToggleAudio = () => {
    // In a real app, this would toggle the user's audio stream
    toast.info("Audio toggled");
  };

  const handleToggleScreenShare = () => {
    setIsScreenSharing(prev => !prev);
    toast.info(isScreenSharing ? "Screen sharing stopped" : "Screen sharing started");
  };
  const handleMuteParticipant = (participantId) => {
    toast.info("Participant muted");
  };

  const handleRemoveParticipant = (participantId) => {
    toast.info("Participant removed");
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadRoomData} />;
  if (!webinar) {
    return (
      <Error 
        message="Webinar room not found" 
        onRetry={() => navigate("/")}
        showRetry={false}
      />
    );
  }

  const mainSpeaker = participants.find(p => p.role === "host" || p.role === "presenter");
  const isHost = currentUser.role === "host";

  return (
    <div className="h-screen bg-background flex flex-col">
      {/* Room Header */}
<div className="bg-surface/50 border-b border-secondary/20 px-6 py-4 relative z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/")}
              className="p-2 text-gray-400 hover:text-white hover:bg-surface/50 rounded-lg transition-colors duration-200"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </button>
            <div>
              <h1 className="text-xl font-display font-semibold text-white">
                {webinar.title}
              </h1>
              <div className="flex items-center gap-3 text-sm text-gray-400 font-body">
                <span>Room: {webinar.roomCode}</span>
                <span>•</span>
                <span>{participants.filter(p => p.connectionStatus === "connected").length} participants</span>
                {webinar.isRecording && (
                  <>
                    <span>•</span>
                    <div className="flex items-center gap-1 text-error">
                      <div className="w-2 h-2 bg-error rounded-full animate-pulse"></div>
                      <span>Recording</span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
            <span className="text-sm font-body font-medium text-success">LIVE</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Video Area */}
        <div className="flex-1 p-6">
          <VideoGrid
            participants={participants}
            isScreenSharing={isScreenSharing}
            mainSpeaker={mainSpeaker}
            currentUser={currentUser}
            onToggleVideo={handleToggleVideo}
            onToggleAudio={handleToggleAudio}
            onToggleScreenShare={handleToggleScreenShare}
          />
        </div>

{/* Sidebar */}
        <WebinarSidebar
          messages={messages}
          questions={questions}
          polls={polls}
          participants={participants}
          currentUser={currentUser}
          isHost={isHost}
          onSendMessage={handleSendMessage}
          onSubmitQuestion={handleSubmitQuestion}
          onUpvoteQuestion={handleUpvoteQuestion}
          onAnswerQuestion={handleAnswerQuestion}
          onCreatePoll={handleCreatePoll}
          onVotePoll={handleVotePoll}
          onMuteParticipant={handleMuteParticipant}
          onRemoveParticipant={handleRemoveParticipant}
          className="w-80 flex-shrink-0 bg-surface border-l border-gray-700"
        />
      </div>
    </div>
  );
};

export default WebinarRoom;