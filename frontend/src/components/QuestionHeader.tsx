import { Box, Button, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

interface QuestionHeaderProps {
  onAdd: () => void;
}

const QuestionHeader: React.FC<QuestionHeaderProps> = ({ onAdd }) => {
  return (
    <Box
      sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2, width: "100%" }}
    >
      <Typography variant="h4" color="white" gutterBottom sx={{ flexGrow: 4, textAlign: "center" }}>
        Questions List
      </Typography>

      <Button
        variant="contained"
        color="success"
        startIcon={<AddIcon />}
        onClick={onAdd}
        sx={{ marginRight: 1 }}
      >
        Add Question
      </Button>
    </Box>
  );
};

export default QuestionHeader;
