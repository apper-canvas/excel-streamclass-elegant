import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Layout from "@/components/organisms/Layout";
import Dashboard from "@/components/pages/Dashboard";
import WebinarRoom from "@/components/pages/WebinarRoom";
import JoinRoom from "@/components/pages/JoinRoom";
import Schedule from "@/components/pages/Schedule";
import Recordings from "@/components/pages/Recordings";

const App = () => {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/room/:roomCode" element={<WebinarRoom />} />
          <Route path="/join" element={<JoinRoom />} />
          <Route path="/schedule" element={<Schedule />} />
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