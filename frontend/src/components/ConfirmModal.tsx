import React from 'react';
import { Modal, Box, Typography, Button } from '@mui/material';

interface ConfirmModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (questionId: string) => void;
  questionId: string | null; 
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({ open, onClose, onConfirm, questionId }) => {
  const handleConfirm = () => {
    if (questionId) {
      onConfirm(questionId); // Pass the questionId to onConfirm
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={{ padding: 2, backgroundColor: 'white', borderRadius: 2, maxWidth: 500, margin: 'auto', marginTop: '20%' }}>
        <Typography variant="h6">Are you sure you want to delete this question?</Typography>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: 2 }}>
          <Button variant="contained" color="error" onClick={handleConfirm}>
            Yes, Delete
          </Button>
          <Button variant="outlined" onClick={onClose}>
            Cancel
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default ConfirmModal;
