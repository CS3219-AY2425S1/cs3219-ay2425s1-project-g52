import { Box, Typography } from "@mui/material";

interface OutputDetails {
    status: { id: number };
    compile_output: string;
    stdout: string;
    stderr: string;
  }
  
  interface OutputProps {
    outputDetails: OutputDetails;
  }

const Output: React.FC<OutputProps> = ({ outputDetails }) => {
  const getOutput = () => {
    let statusId = outputDetails?.status?.id;

    if (statusId === 6) {
      // compilation error
      return (
        <Typography
          component="pre"
          sx={{ padding: "8px", fontSize: "0.875rem", color: "error.main" }}
        >
          {atob(outputDetails?.compile_output)}
        </Typography>
      );
    } else if (statusId === 3) {
      return (
        <Typography
          component="pre"
          sx={{ padding: "8px", fontSize: "0.875rem", color: "success.main" }}
        >
          {atob(outputDetails.stdout) !== null
            ? `${atob(outputDetails.stdout)}`
            : null}
        </Typography>
      );
    } else if (statusId === 5) {
      return (
        <Typography
          component="pre"
          sx={{ padding: "8px", fontSize: "0.875rem", color: "error.main" }}
        >
          {"Time Limit Exceeded"}
        </Typography>
      );
    } else {
      return (
        <Typography
          component="pre"
          sx={{ padding: "8px", fontSize: "0.875rem", color: "error.main" }}
        >
          {atob(outputDetails?.stderr)}
        </Typography>
      );
    }
  };

  return (
    <>
      <Typography
        variant="h6"
        fontWeight="bold"
        sx={{
          color: "white"
        }}
      >
        Output
      </Typography>
      <Box
        sx={{
          width: "100%",
          height: "100%",
          backgroundColor: "#1e293b",
          borderRadius: "8px",
          color: "#FFFFFF",
          fontSize: "0.875rem",
          fontWeight: "normal",
          padding: "8px",
          wordWrap: "break-word", // Ensure long lines wrap
          overflowWrap: "break-word", // For better compatibility with different browsers
          overflowY: "auto", // Allow vertical scrolling for overflow content
          
        }}
      >
        {outputDetails ? getOutput() : null}
      </Box>
    </>
  );
};

export default Output;
