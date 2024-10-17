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

interface Props {
  open: boolean;
  onClose: () => void;
  onContinue: () => void;
}

const MatchSuccessDialog: React.FC<Props> = ({ open, onClose, onContinue }) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        style: {
          background: "linear-gradient(135deg, #d4fc79, #96e6a1)",
          borderRadius: "12px",
          padding: "20px",
        },
      }}
    >
      <DialogTitle>
        <Typography
          style={{
            fontFamily: "Poppins, sans-serif",
            fontSize: "24px",
            fontWeight: 600,
            color: "#333",
            textAlign: "center",
            marginBottom: "10px",
          }}
        >
          Match Found!
        </Typography>
      </DialogTitle>
      <DialogContent>
        <Typography
          style={{
            fontFamily: "Roboto, sans-serif",
            fontSize: "16px",
            color: "#555",
            textAlign: "center",
            lineHeight: "1.6",
            margin: "0 10px",
          }}
        >
          You've successfully matched with a peer. You can now proceed to the
          collaboration space or exit.
        </Typography>
      </DialogContent>
      <DialogActions style={{ justifyContent: "center", padding: "20px 0" }}>
        <Box
          display="flex"
          justifyContent="space-around"
          width="100%"
          maxWidth="300px"
        >
          <Button
            onClick={onContinue}
            variant="contained"
            style={{
              backgroundColor: "#28a745",
              color: "#fff",
              fontSize: "14px",
              fontWeight: 500,
              textTransform: "none",
              borderRadius: "30px",
              padding: "8px 20px",
              boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
            }}
          >
            Continue
          </Button>
          <Button
            onClick={onClose}
            variant="outlined"
            style={{
              borderColor: "#28a745",
              color: "#28a745",
              fontSize: "14px",
              fontWeight: 500,
              textTransform: "none",
              borderRadius: "30px",
              padding: "8px 20px",
              boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
            }}
          >
            Exit
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
};

export default MatchSuccessDialog;
