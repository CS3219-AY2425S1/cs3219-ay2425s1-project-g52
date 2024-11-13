import axios from "axios";
import { v4 as uuidv4 } from "uuid";

// Function to create a room
const createRoom = async ({ participants, question }) => {
  console.log("question:", question);
  const url = process.env.COLLABORATION_SERVICE_URL + "/create-room";
  const requestBody = {
    roomId: uuidv4(),
    participants: participants,
    question: question,
  };

  console.log("requestBody", JSON.stringify(requestBody));

  try {
    // Making POST request using axios
    const response = await axios.post(url, requestBody, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Return the response data
    return response.data;
  } catch (error) {
    console.error("Error creating room:", error.message);
    return { status: 500, message: error.message };
  }
};

// Function to test POST request to an external API
const testPostRequest = async () => {
  const url = "http://localhost:8000/api/v1/questions";
  const requestBody = {
    qId: "99",
    qTitle: "test",
    qDescription: "test",
    qCategory: ["Strings"],
    qComplexity: "easy",
  };

  try {
    // Making POST request using axios
    const response = await axios.post(url, requestBody, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error making POST request:", error.message);
  }
};

// Function to check if a room exists
const checkRoomExists = async (roomId) => {
  const url = `http://localhost:4000/room-exists/${roomId}`;
  console.log("Checking room existence with URL:", url);

  try {
    // Making GET request using axios
    const response = await axios.get(url, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Return the response data
    return response.data;
  } catch (error) {
    console.error("Error checking room existence:", error.message);
    return { status: 500, message: error.message };
  }
};

export { createRoom, testPostRequest, checkRoomExists };
