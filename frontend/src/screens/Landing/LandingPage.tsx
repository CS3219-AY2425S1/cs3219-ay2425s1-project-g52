import { useState, useEffect } from "react";
import { Button } from "antd";
import { useNavigate } from "react-router-dom";
import QuestionHistory from "./QuestionHistory";
import "./LandingPage.css";
import { checkActiveSession, getActiveSession } from '../../api/collaboration-api';

const LandingPage: React.FC = () => {
  const username: string = sessionStorage.getItem("username") || "Guest";
  const isAdmin: boolean = (sessionStorage.getItem("isAdmin") == "true") || false;
  const navigate = useNavigate();

  // const usageStreak = 7;
  const [hasActiveSession, setHasActiveSession] = useState(false);
 
  useEffect(() => {
    // Check if the user has an active session
    const fetchActiveSessionStatus = async () => {
      try {
        const response = await checkActiveSession(username);
        setHasActiveSession(response);
      } catch (error) {
        console.error("Error checking active session:", error);
      }
    };

    fetchActiveSessionStatus();
  }, [username]);

  const handleStartSession = () => {
    navigate("/topicsPage", { state: { username } });
  };

  const handleResumeSession = async () => {
    try {
      // Fetch the active session details
      const sessionData = await getActiveSession(username);
  
      // Navigate to the collaboration page with the retrieved session data
      navigate("/collaboration", {
        state: { 
          roomId: sessionData.roomId, 
          username: username, 
          question: sessionData.question 
        },
      });

    } catch (error) {
      console.error("Error resuming session:", error);
    }
  };

  const handleLogOut = () => {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("username");
    navigate("/");
  };

  return (
    <div className="landing-page-container">
      <div className="top-container">
        <div className="access-questionPage">
          <button className="access-questionsPage-button"
            onClick={() => navigate("/questionsPage", {
              state: { 
                username: username, 
                isAdmin: isAdmin
              },
            })}
          >
            Access Question Database
          </button>
        </div>
        
        <Button
          style={{
            backgroundColor: "#1D192A",
            color: "white",
            borderRadius: 20,
            width: 75,
            height: 40,
          }}
          onClick={handleLogOut}
        >
          Log Out
        </Button>
      </div>

      <header className="landing-page-header">
        <div className="welcome-section">
          <h1 className="welcome-message">Welcome, {username}</h1>

          <div style={{ display: "flex", justifyContent: "center", gap: "10px", marginTop: "10px" }}>
            {!hasActiveSession && (
              <button className="start-session-button" onClick={handleStartSession}>
                Start a Session
              </button>
            )}

            {hasActiveSession && (
              <div>
                <p style={{marginBottom: "10px"}}>You have an active session. Please end it to begin a new one.</p>
                <button className="start-session-button" onClick={handleResumeSession}>
                  Resume Session
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="main-content">
        <section className="history-section">
          <h2 className="section-title">Question History</h2>
          <QuestionHistory />
        </section>

        {/* <section className="streak-section">
          <h2 className="section-title">Usage Streak</h2>
          <div className="streak-display">
            <span className="streak-number">{usageStreak}</span>
            <span className="streak-label">Days</span>
          </div>
        </section> */}
      </main>
    </div>
  );
};

export default LandingPage;