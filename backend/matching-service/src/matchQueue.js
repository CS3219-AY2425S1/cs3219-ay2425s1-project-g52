import { UserMatchRequest } from "./models/UserMatchRequest.js";
import { getChannel } from "./connections.js";

let channel;

export const initializeMatchQueue = async () => {
  channel = getChannel();
  if (!channel) {
    throw new Error("No Rabbitmq channel initialized");
  }
};

export const removeUser = async (userId) => {
  await UserMatchRequest.deleteOne({ userId });
  const message = `{"userId":"${userId}","action":"remove"}`;
  channel.sendToQueue("match_requests", Buffer.from(message), {
    persistent: true,
  });
};

// Add user to the queue and match it
export const addUser = async (user) => {
  try {
    const checkExisting = await UserMatchRequest.findOne({
      userId: user.userId,
    });
    if (checkExisting) {
      console.log(`User ${user.userId} already has an active session.`);
      updateUser(
        user.userId,
        "error: You can only request one session at a time."
      );
      return { error: "You can only request one session at a time." };
    }

    const userMatchRequest = new UserMatchRequest(user);
    console.log("User added:", userMatchRequest);
    await userMatchRequest.save();
    channel.sendToQueue(
      "match_requests",
      Buffer.from(JSON.stringify(userMatchRequest)),
      { persistent: true }
    );

    setTimeout(async () => {
      const existingUser = await UserMatchRequest.findOne({
        userId: userMatchRequest.userId,
      });
      if (existingUser) {
        updateUser(userMatchRequest.userId, "timeout");
        await UserMatchRequest.deleteOne({ userId: userMatchRequest.userId });
      }
    }, 30000);

    return { success: "User added to match queue" };
  } catch (error) {
    console.error("Error in addUser:", error);
    return { error: "Internal Server Error" };
  }
};

// Get the match queue from MongoDB
export const getMatchQueue = async () => {
  try {
    return await UserMatchRequest.find();
  } catch (error) {
    console.error("Error in getMatchQueue:", error);
    throw new Error("Internal Server Error");
  }
};

const updateUser = (userId, status) => {
  const message = `{"userId":"${userId}","status":"${status}"}`;
  channel.sendToQueue("notifications", Buffer.from(message), {
    persistent: true,
  });
};
