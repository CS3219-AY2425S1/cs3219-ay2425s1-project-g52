import { Box, Typography, ToggleButton, ToggleButtonGroup, IconButton } from "@mui/material";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CodeEditorHistory from "./CodeEditorHistory"; 
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import WhiteboardHistory from "./WhiteBoardHistory";
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';  // Import KaTeX styles for LaTeX rendering

const QuestionAttemptPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { question } = location.state;
  const [codeContent, setCodeContent] = useState<'attempt' | 'solution'>('attempt');

  // Handle the change of code between attempted and suggested solution
  const handleCodeContentChange = (event: React.MouseEvent<HTMLElement>, newCodeContent: 'attempt' | 'solution') => {
    if (newCodeContent !== null) {
      setCodeContent(newCodeContent);
    }
  };

  const handleBackClick = () => {
    navigate('/landingPage');
  };

  return (
    <Box
      sx={{
        pt: 1,
        px: 4,
        pb: 4,
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        position: "relative",
      }}
    >
      {/* Back button on top */}
      <IconButton
        onClick={handleBackClick}
        sx={{
          position: "absolute",
          top: 16,
          left: 16,
          color: "white",
          fontSize: 32,
        }}
      >
        <ArrowBackIcon fontSize="inherit" />
      </IconButton>

      <Box
        sx={{
          width: "100%",
          maxWidth: "900px",
          mb: 4,
          p: 2,
          backgroundColor: "#1e1e1e",
          borderRadius: 2,
          textAlign: "center",
          position: "relative",
        }}
      >
        <Typography
          variant="h3"
          component="h3"
          sx={{ fontWeight: 700, color: "white" }}
        >
          {question.title}
        </Typography>
        <Typography
          variant="body1"
          component="body"
          sx={{ fontWeight: 700, color: "white", textAlign: "left" }}
        >
          {/* Render Markdown and LaTeX using react-markdown */}
          <Box sx={{ marginBottom: 2 }}>
            <ReactMarkdown
              remarkPlugins={[remarkMath]}
              rehypePlugins={[rehypeKatex]}
            >
              {question.description || 'OOPS! Error Displaying Question Description. (Question may have been deleted)'}
            </ReactMarkdown>
          </Box>
        </Typography>
      </Box>

      {/* Toggle button to change between the attempted and suggested solution */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          mb: 2,
          width: "100%",
          justifyContent: "flex-start",
        }}
      >
        <ToggleButtonGroup
          value={codeContent}
          exclusive
          onChange={handleCodeContentChange}
        >
          <ToggleButton
            value="attempt"
            sx={{
              color: "white",
              backgroundColor: codeContent === 'attempt' ? "#3a3a3a" : "#5a5a5a",
              '&.Mui-selected': {
                backgroundColor: "#3a3a3a",
                color: "white",
              },
              '&:hover': {
                backgroundColor: "#5a5a5a",
              },
            }}
          >
            Attempt
          </ToggleButton>
          <ToggleButton
            value="solution"
            sx={{
              color: "white",
              backgroundColor: codeContent === 'solution' ? "#3a3a3a" : "#5a5a5a",
              '&.Mui-selected': {
                backgroundColor: "#3a3a3a",
                color: "white",
              },
              '&:hover': {
                backgroundColor: "#5a5a5a",
              },
            }}
          >
            Solution
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>

      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          width: "100%",
          height: "calc(100vh - 200px)",
          gap: 2,
        }}
      >
        {/* Code editor with attmepted code */}
        <Box
          sx={{
            flex: 1,
            maxWidth: "550px",
            height: "100%",
            overflow: "auto",
          }}
        >
          <CodeEditorHistory code={codeContent === 'attempt' ? question.code_contents : question.solution_code} />
        </Box>

        {/* Whiteboard */}
        <Box
          sx={{
            flex: 1,
            backgroundColor: "#2e2e2e",
            display: "flex",
            flexDirection: "column",
            position: "relative",
          }}
        >
          <Box
            sx={{
              flex: 1,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <WhiteboardHistory state={question.whiteboard_state} />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default QuestionAttemptPage;