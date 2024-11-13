import { useState, useRef, useEffect } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Avatar,
  Paper,
} from "@mui/material";

type Message = {
  username: string;
  text: string;
  timestamp: string;
};

type ChatBoxProps = {
  socket: any;
  roomId: string;
  username: string;
};

// Helper function to generate a random color
const getRandomColor = (): string => {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

const ChatBox: React.FC<ChatBoxProps> = ({ socket, roomId, username }) => {
  const [message, setMessage] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [userColors, setUserColors] = useState<{ [key: string]: string }>({});
  const messageEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = (): void => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (socket) {
      socket.on("receiveMessage", (newMessage: Message) => {
        setUserColors((prevColors) => {
          if (!prevColors[newMessage.username]) {
            return { ...prevColors, [newMessage.username]: getRandomColor() };
          }
          return prevColors;
        });

        setMessages((prevMessages) => [...prevMessages, newMessage]);
      });

      return () => {
        socket.off("receiveMessage");
      };
    }
  }, [socket]);

  const handleSendMessage = (): void => {
    if (message.trim() && socket) {
      const newMessage = {
        username,
        text: message.trim(),
        timestamp: new Date().toLocaleTimeString(),
      };

      socket.emit("sendMessage", { ...newMessage, roomId });

      setMessage("");
    }
  };

  const handleEnterKey = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  const getFirstLetter = (name: string): string => {
    return name.charAt(0).toUpperCase();
  };

  const getMessageBoxWidth = (message: string): string => {
    return message.length > 100 ? "500px" : "300px";
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        height: "100%",
      }}
    >
      <Paper
        elevation={0}
        sx={{
          p: 2,
          pb: 1,
          mb: 2,
          flexGrow: 1,
          overflowY: "auto",
          backgroundColor: "#f5f5f5",
        }}
      >
        {messages.map((msg, idx) => (
          <Box
            key={idx}
            sx={{ display: "flex", alignItems: "flex-start", mb: 0.5 }}
          >
            <Avatar
              sx={{
                mr: 2,
                backgroundColor: userColors[msg.username] || "#1976d2",
                width: 32,
                height: 32,
                fontSize: 14,
              }}
            >
              {getFirstLetter(msg.username)}
            </Avatar>

            <Box>
              <Typography
                variant="body2"
                sx={{
                  fontWeight: "bold",
                  color: "#333",
                  fontSize: "12px",
                }}
              >
                {msg.username}
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  backgroundColor: "white",
                  padding: "6px 10px",
                  borderRadius: "12px",
                  maxWidth: getMessageBoxWidth(msg.text),
                  wordWrap: "break-word",
                  boxShadow: "0px 1px 3px rgba(0,0,0,0.1)",
                  fontSize: "13px",
                }}
              >
                {msg.text}
              </Typography>
              <Typography
                variant="caption"
                sx={{ color: "#999", mt: 0.5, fontSize: "10px" }}
              >
                {msg.timestamp}
              </Typography>
            </Box>
          </Box>
        ))}
        <div ref={messageEndRef} />
      </Paper>

      <Box sx={{ display: "flex", gap: 1 }}>
        <TextField
          fullWidth
          variant="outlined"
          size="small"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleEnterKey}
          placeholder="Say something"
          sx={{
            backgroundColor: "#f5f5f5",
            borderRadius: "20px",
            "& .MuiOutlinedInput-root": {
              borderRadius: "20px",
            },
          }}
        />

        <Button
          variant="contained"
          onClick={handleSendMessage}
          sx={{ backgroundColor: "#1976d2", color: "white" }}
        >
          Send
        </Button>
      </Box>
    </Box>
  );
};

export default ChatBox;
