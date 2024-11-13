import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
} from "@mui/material";

const dialogStyles = {
  backgroundColor: "#f9f9f9",
  color: "black",
  textAlign: "center" as const,
  border: "1px solid #ccc",
};

const buttonStyles = {
  border: "2px solid black",
  color: "black",
  backgroundColor: "#e0e0e0",
  width: "100%",
  padding: "15px",
  borderRadius: "10px",
  margin: "10px 0",
  textTransform: "none" as const,
  transition: "background-color 0.3s",
};

const easyButtonStyles = {
  ...buttonStyles,
  "&:hover": {
    backgroundColor: "lightgreen",
    color: "black",
  },
};

const mediumButtonStyles = {
  ...buttonStyles,
  "&:hover": {
    backgroundColor: "yellow",
    color: "black",
  },
};

const hardButtonStyles = {
  ...buttonStyles,
  "&:hover": {
    backgroundColor: "red",
    color: "white",
  },
};

const DifficultyDialog: React.FC<{
  open: boolean;
  onClose: () => void;
  onSelect: (value: number) => void;
}> = ({ open, onClose, onSelect }) => {
  const handleSelect = (level: number) => {
    onSelect(level);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{ style: dialogStyles }}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>
        <Typography style={{ 
          color: "black" ,
          fontFamily: "Poppins, sans-serif",
          fontSize: "24px",
          fontWeight: 600,
          textAlign: "center",
          marginTop: "20px",
          }}>
          Choose Your Difficulty Level
        </Typography>
      </DialogTitle>
      <DialogContent>
        <Box padding={3}>
          <Button onClick={() => handleSelect(1)} sx={easyButtonStyles}>
            Easy
          </Button>

          <Button onClick={() => handleSelect(2)} sx={mediumButtonStyles}>
            Medium
          </Button>

          <Button onClick={() => handleSelect(3)} sx={hardButtonStyles}>
            Hard
          </Button>
        </Box>
      </DialogContent>
      <DialogActions style={{ justifyContent: "center" }}>
        <Button
          onClick={onClose}
          variant="outlined"
          sx={{ color: "black", borderColor: "black" }}
        >
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DifficultyDialog;
