import React from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignUp from "./screens/SignUp/SignUp";
import Login from "./screens/Login/Login";
import LandingPage from "./screens/Landing/LandingPage";
import TopicsPage from "./screens/TopicSelection/TopicsPage";
import LoadingPage from "./screens/MatchingQueue/LoadingPage";
import QuestionManager from "./screens/question/QuestionManager";
import CollaborationPage from "./screens/collaboration/CollaborationPage";
import QuestionAttemptPage from "./screens/Landing/QuestionAttemptPage";

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
        <Route path="/questionAttempt" element={<QuestionAttemptPage />} />
        {/* temp entry point to test collaboration */}
        <Route path="/collaboration" element={<CollaborationPage />} /> 
      </Routes>
    </Router>
  );
};

export default App;
