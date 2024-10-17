import React from "react";
import { useNavigate } from "react-router-dom";
import "./LandingPage.css";

const LandingPage: React.FC = () => {
  const username = localStorage.getItem("username") || "Guest";
  const navigate = useNavigate();

  const questions = [
    { title: "Two Sum", difficulty: "Easy" },
    { title: "Reverse Integer", difficulty: "Medium" },
    { title: "Regular Expression Matching", difficulty: "Hard" },
  ];

  const usageStreak = 7;

  const handleStartSession = () => {
    navigate("/topicsPage", { state: { username } });
  };

  return (
    <div className="landing-page-container">
      <header className="landing-page-header">
        <div className="welcome-section">
          <h1 className="welcome-message">Welcome, {username}</h1>
          <button className="start-session-button" onClick={handleStartSession}>
            Start a Session
          </button>
        </div>
      </header>

      <main className="main-content">
        <section className="history-section">
          <h2 className="section-title">Question History</h2>
          <ul className="question-list">
            {questions.map((question, index) => (
              <li className="question-item" key={index}>
                <span className="question-title">{question.title}</span>
                <span
                  className={`difficulty-badge ${question.difficulty.toLowerCase()}`}
                >
                  {question.difficulty}
                </span>
              </li>
            ))}
          </ul>
        </section>

        <section className="streak-section">
          <h2 className="section-title">Usage Streak</h2>
          <div className="streak-display">
            <span className="streak-number">{usageStreak}</span>
            <span className="streak-label">Days</span>
          </div>
        </section>
      </main>
    </div>
  );
};

export default LandingPage;
