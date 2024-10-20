import React from "react";
import "./TopicCard.css";

interface TopicCardProps {
  topic: string;
  imageUrl: string;
  onClick: () => void;
}

const TopicCard: React.FC<TopicCardProps> = ({ topic, imageUrl, onClick }) => {
  return (
    <div className="topic-card" onClick={onClick}>
      <div className="topic-image-container">
        <img src={imageUrl} alt={topic} className="topic-image" />
      </div>
      <div className="topic-name">{topic}</div>
    </div>
  );
};

export default TopicCard;
