import React from 'react';
import { Modal, Box, Typography, Button } from '@mui/material';

interface DuplicateTitleModalProps {
  open: boolean;
  onClose: () => void;
}

const DuplicateTitleModal: React.FC<DuplicateTitleModalProps> = ({ open, onClose }) => {
  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          padding: 2,
          backgroundColor: 'white',
          borderRadius: 2,
          maxWidth: 500,
          margin: 'auto',
          marginTop: '20%',
          boxShadow: 24,
        }}
      >
        <Typography variant="h6">Duplicate Title Detected</Typography>
        <Typography variant="body1" sx={{ marginTop: 1 }}>
          A question with this title already exists. Please choose a unique title.
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 2 }}>
          <Button variant="contained" color="primary" onClick={onClose}>
            OK
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default DuplicateTitleModal;
