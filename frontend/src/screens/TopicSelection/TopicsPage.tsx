import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import TopicCard from "./TopicCard";
import DifficultyDialog from "./DifficultyDialog";
import "./TopicsPage.css";
import { FiSearch } from "react-icons/fi";
import { FiArrowLeft } from "react-icons/fi";

const topics = [
  "Strings",
  "Algorithms",
  "Data Structures",
  "Bit Manipulation",
  "Recursion",
  "Databases",
  "Arrays",
  "Brainteaser",
];

const topicImages: { [key: string]: string } = {
  Strings: require("../../assets/images/strings.png"),
  Algorithms: require("../../assets/images/algo.png"),
  "Data Structures": require("../../assets/images/ds.png"),
  "Bit Manipulation": require("../../assets/images/bitmanp.png"),
  Recursion: require("../../assets/images/recurs.png"),
  Databases: require("../../assets/images/db.png"),
  Arrays: require("../../assets/images/arrays.png"),
  Brainteaser: require("../../assets/images/brainteasers.png"),
};

interface LocationState {
  username: string;
}

const TopicsPage: React.FC = () => {
  const location = useLocation();
  const state = location.state as LocationState | undefined;
  // const username = state?.username || "Guest";
  const username = sessionStorage.getItem("username") || "Guest";

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedDifficulty, setSelectedDifficulty] = useState<number | null>(
    null
  );

  const navigate = useNavigate();

  const filteredTopics = topics.filter((topic) =>
    topic.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleTopicClick = (topic: string) => {
    setSelectedTopic(topic);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  const handleSelectDifficulty = async (difficulty: number) => {
    setSelectedDifficulty(difficulty);
    setDialogOpen(false);

    const matchingRequest = {
      userId: username,
      topic: selectedTopic,
      difficulty:
        difficulty === 1 ? "easy" : difficulty === 2 ? "medium" : "hard",
    };

    try {
      const response = await fetch("http://localhost:3002/match", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(matchingRequest),
      });

      if (response.ok) {
        navigate("/loadingPage", {
          state: {
            userId: username,
            topic: selectedTopic,
            difficulty: matchingRequest.difficulty,
          },
        });
      } else {
        console.error("Failed to send matching request");
      }
    } catch (error) {
      console.error("Error sending matching request:", error);
    }

    console.log(`Selected Topic: ${selectedTopic}, Difficulty: ${difficulty}`);
  };

  return (
    <div className="topics-page">
      <button onClick={() => navigate("/landingPage")} className="back-button">
        <FiArrowLeft className="back-icon" />
      </button>
      <div className="search-bar-container">
        <FiSearch className="search-icon" />
        <input
          type="text"
          placeholder="Search topics..."
          className="search-bar"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="topics-grid">
        {filteredTopics.map((topic) => (
          <TopicCard
            key={topic}
            topic={topic}
            imageUrl={topicImages[topic]}
            onClick={() => handleTopicClick(topic)}
          />
        ))}
      </div>
      <DifficultyDialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        onSelect={handleSelectDifficulty}
      />

      {/* {selectedTopic && selectedDifficulty !== null && (
        <div className="selected-info">
          <h3>Selected Topic: {selectedTopic}</h3>
          <h4>
            Difficulty Level:{" "}
            {selectedDifficulty === 1
              ? "Easy"
              : selectedDifficulty === 2
              ? "Medium"
              : "Hard"}
          </h4>
        </div>
      )} */}
    </div>
  );
};

export default TopicsPage;
