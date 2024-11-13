import React from 'react';
import { Modal, Box, Typography, Button } from '@mui/material';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';  // Import KaTeX styles for LaTeX rendering
import { Question } from '../../api/interfaces';

interface QuestionDescriptionModalProps {
  open: boolean;
  onClose: () => void;
  question: Question | null;
}

const QuestionDescriptionModal: React.FC<QuestionDescriptionModalProps> = ({ open, onClose, question }) => {
  if (!question) return null;

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          padding: 3,
          backgroundColor: 'white',
          borderRadius: 2,
          maxWidth: 700,
          margin: 'auto',
          marginTop: '20%',
          boxShadow: 24,
        }}
      >
        <Typography variant="h5" gutterBottom>
          Question Description
        </Typography>

        {/* Render Markdown and LaTeX using react-markdown */}
        <Box sx={{ marginBottom: 2 }}>
          <ReactMarkdown
            remarkPlugins={[remarkMath]}
            rehypePlugins={[rehypeKatex]}
          >
            {question.qDescription || 'Error Displaying Question Description...'}
          </ReactMarkdown>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end'}}>
          <Button variant="outlined" onClick={onClose}>
            Close
          </Button>
        </Box>

      </Box>
    </Modal>
  );
};

export default QuestionDescriptionModal;
