import React from 'react';
import { Modal, Box, Typography, Button } from '@mui/material';
import { Question } from '../api/interfaces';

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
          padding: 2,
          backgroundColor: 'white',
          borderRadius: 2,
          maxWidth: 700,
          margin: 'auto',
          marginTop: '20%',
        }}
      >
        <Typography variant="h5">
          Question Description
        </Typography>
        <Typography variant="body1" gutterBottom>
          <strong>Description:</strong> {question.qDescription}
        </Typography>
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
