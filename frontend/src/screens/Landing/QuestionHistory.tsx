import React, { useEffect, useState } from "react";
import axios from "axios";
import { Table, Tooltip, Spin } from "antd";
import { useNavigate } from "react-router-dom";
import "./LandingPage.css"; 
import "./QuestionHistory.css";
import MarkdownTooltip from "./MarkdownTooltip";

interface QuestionAttempt {
  date: string;
  time: string;
  title: string;
  difficulty: string;
  topic: string;
  partner: string;
  description: string;
  code_contents: string;
  solution_code: string;
  whiteboard_state: any;
}

const QuestionHistory: React.FC = () => {
  const [questionHistory, setQuestionHistory] = useState<QuestionAttempt[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [pageSize, setPageSize] = useState(10); // Default page size is 10
  const navigate = useNavigate();

  const username = sessionStorage.getItem("username") || "Guest";

  useEffect(() => {
    // Fetch question history data
    const fetchQuestionHistory = async () => {
      try {
        const response = await axios.get(`http://localhost:5001/history/user/${username}`);
        const data = response.data;
        setQuestionHistory(data);
      } catch (error) {
        console.error("Failed to fetch question history:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestionHistory();
  }, [username]);

  // Columns for the table
  const columns = [
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
    },
    {
      title: "Time",
      dataIndex: "time",
      key: "time",
    },
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      render: (text: string, record: QuestionAttempt) => (
        <MarkdownTooltip title={record.description}>
          <span
            style={{ color: "blue", cursor: "pointer" }}
            onClick={() => navigate("/questionAttempt", { state: { question: record } })}
          >
            {text || "Deleted Question"}
          </span>
        </MarkdownTooltip>
      ),
    },
    {
      title: "Difficulty",
      dataIndex: "difficulty",
      key: "difficulty",
      render: (difficulty: string) => (
        <span className={`difficulty-badge ${difficulty?.toLowerCase()}`}>
          {difficulty || "N.A."}
        </span>
      ),
    },
    {
      title: "Topic",
      dataIndex: "topic",
      key: "topic",
      render: (topic: string) => (
        <span>
          {topic || "N.A."}
        </span>
      ),
    },
    {
      title: "Partner",
      dataIndex: "partner",
      key: "partner",
    },
  ];

  return (
    <div style={{ minHeight: "450px", maxHeight: "100vh", maxWidth: "90vw", overflowY: "auto" }}>
      {loading ? (
        // Loading spinner with custom text
        <Spin tip="Retrieving your attempted questions..." />
      ) : (
        <Table
          columns={columns}
          dataSource={questionHistory}
          rowKey="attempt_id"
          scroll={{ y: 300, x: 800 }}
          pagination={{
            pageSize: pageSize, // Default Size
            showSizeChanger: true,
            pageSizeOptions: ['10', '20', '50'], // Options for selecting number of items
            onShowSizeChange: (_, size) => setPageSize(size)
          }}
        />
      )}
    </div>
  );
};

export default QuestionHistory;