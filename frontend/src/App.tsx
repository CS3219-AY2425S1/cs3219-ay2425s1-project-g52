import React from "react";
import "./App.css";
import QuestionManager from "./components/QuestionManager";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import SignUp from "./screens/SignUp/SignUp";
import Login from "./screens/Login/Login";

const App: React.FC = () => {
  return (
    <Router>
      {/* Define routes for different components */}
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/questions" element={<QuestionManager />} />
      </Routes>
    </Router>
  );
};

export default App;
