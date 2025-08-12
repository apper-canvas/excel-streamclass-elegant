import React from "react";
import { Route, Router, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import PollsPage from "@/components/pages/PollsPage";
import Layout from "@/components/organisms/Layout";
import Recordings from "@/components/pages/Recordings";
import Dashboard from "@/components/pages/Dashboard";
import Schedule from "@/components/pages/Schedule";
import WebinarRoom from "@/components/pages/WebinarRoom";
import JoinRoom from "@/components/pages/JoinRoom";
import messages from "@/services/mockData/messages.json";
import questions from "@/services/mockData/questions.json";
import participants from "@/services/mockData/participants.json";
import webinars from "@/services/mockData/webinars.json";
import polls from "@/services/mockData/polls.json";

const App = () => {
  return (
    <Router>
      <Layout>
<Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/room/:roomCode" element={<WebinarRoom />} />
          <Route path="/join" element={<JoinRoom />} />
          <Route path="/schedule" element={<Schedule />} />
          <Route path="/polls" element={<PollsPage />} />
          <Route path="/recordings" element={<Recordings />} />
          <Route path="/recordings/:id" element={<Recordings />} />
        </Routes>
      </Layout>
      
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </Router>
  );
};

export default App;