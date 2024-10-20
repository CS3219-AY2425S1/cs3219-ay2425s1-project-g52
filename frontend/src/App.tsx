import React from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignUp from "./screens/SignUp/SignUp";
import Login from "./screens/Login/Login";
import LandingPage from "./screens/Landing/LandingPage";
import TopicsPage from "./screens/TopicSelection/TopicsPage";
import LoadingPage from "./screens/MatchingQueue/LoadingPage";
import QuestionManager from "./components/QuestionManager";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signupPage" element={<SignUp />} />
        <Route path="/landingPage" element={<LandingPage />} />
        <Route path="/questionsPage" element={<QuestionManager />} />
        <Route path="/topicsPage" element={<TopicsPage />} />
        <Route path="/loadingPage" element={<LoadingPage />} />
      </Routes>
    </Router>
  );
};

export default App;
