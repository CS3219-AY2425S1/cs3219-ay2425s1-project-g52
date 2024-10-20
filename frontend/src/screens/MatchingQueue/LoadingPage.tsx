import React, { useState, useEffect, useCallback, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { MagnifyingGlass } from "react-loader-spinner";
import MatchNotFoundDialog from "./MatchNotFoundDialog";
import MatchSuccessDialog from "./MatchSuccessDialog";
import "./LoadingPage.css";

interface LocationState {
  userId: string;
  topic: string;
  difficulty: string;
}

const LoadingPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as LocationState;
  const userId = state.userId;
  const topic = state.topic;
  const difficulty = state.difficulty;

  const [progress, setProgress] = useState<number>(0);
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [matchSuccess, setMatchSuccess] = useState<boolean>(false);
  const intervalIdRef = useRef<NodeJS.Timeout | null>(null);

  const startProgress = useCallback(() => {
    if (intervalIdRef.current) clearInterval(intervalIdRef.current);
    intervalIdRef.current = setInterval(() => {
      setProgress((prevProgress) => {
        const newProgress = prevProgress + 100 / 30;
        if (newProgress >= 100) {
          clearInterval(intervalIdRef.current!);
          setProgress(100);
          setDialogOpen(true);
        }
        return newProgress;
      });
    }, 1000);
  }, []);

  useEffect(() => {
    startProgress();

    const ws = new WebSocket(`ws://localhost:8080/${userId}`);

    ws.onopen = () => {
      console.log("WebSocket connection established");
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log("Received WebSocket message:", data);

      if (data.status === "matched") {
        setMatchSuccess(true);
        if (intervalIdRef.current) clearInterval(intervalIdRef.current);
      } else if (data.status === "timeout") {
        setDialogOpen(true);
        if (intervalIdRef.current) clearInterval(intervalIdRef.current);
      }
    };

    ws.onclose = () => {
      console.log("WebSocket connection closed");
    };

    return () => {
      ws.close();
      if (intervalIdRef.current) clearInterval(intervalIdRef.current);
    };
  }, [startProgress, userId]);

  const handleCancel = async () => {
    if (intervalIdRef.current) clearInterval(intervalIdRef.current);
    setProgress(0);

    try {
      await fetch(`http://localhost:3002/match/${userId}`, {
        method: "DELETE",
      });
    } catch (error) {
      console.error("Error cancelling matching request:", error);
    }

    navigate("/topicsPage", { state: { username: userId } });
  };

  const handleRetry = async () => {
    setDialogOpen(false);
    setProgress(0);
    startProgress();

    try {
      const matchingRequest = {
        userId,
        topic,
        difficulty,
      };

      const response = await fetch("http://localhost:3002/match", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(matchingRequest),
      });

      if (!response.ok) {
        console.error("Failed to resend matching request");
      }
    } catch (error) {
      console.error("Error resending matching request:", error);
    }
  };

  const handleDialogClose = async () => {
    if (intervalIdRef.current) clearInterval(intervalIdRef.current);
    setProgress(0);

    try {
      await fetch(`http://localhost:3002/match/${userId}`, {
        method: "DELETE",
      });
    } catch (error) {
      console.error("Error cancelling matching request:", error);
    }

    navigate("/topicsPage", { state: { username: userId } });
  };

  const handleContinue = () => {
    navigate("/questionsPage", { state: { userId } });
  };

  return (
    <div className="loading-page">
      <div className="content">
        <h1 className="main-text">
          Hang tight {userId}! A peer match will be found soon.
        </h1>

        <MagnifyingGlass
          visible={true}
          height={150}
          width={150}
          ariaLabel="magnifying-glass-loading"
          wrapperClass="magnifying-glass-wrapper"
          glassColor="#c0efff"
          color="#ffffff"
        />

        <div className="progress-container">
          <progress value={progress} max="100"></progress>
        </div>

        <div className="pro-tip">
          <h2>Pro Tip:</h2>
          <p>
            Focus on edge cases. They often reveal weaknesses in your solution
            and can help you refine your code.
          </p>
        </div>

        <button className="cancel-button" onClick={handleCancel}>
          Cancel
        </button>

        {matchSuccess && (
          <MatchSuccessDialog
            open={matchSuccess}
            onClose={() =>
              navigate("/topicsPage", { state: { username: userId } })
            }
            onContinue={handleContinue}
          />
        )}

        <MatchNotFoundDialog
          open={dialogOpen}
          onClose={handleDialogClose}
          onRetry={handleRetry}
        />
      </div>
    </div>
  );
};

export default LoadingPage;
