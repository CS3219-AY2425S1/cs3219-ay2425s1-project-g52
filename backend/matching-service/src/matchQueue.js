import { getChannel } from "./connections.js";
import { notifyUser } from './websocket.js';
import { TOPICS, DIFFICULTIES } from './constants/constants.js';

const activeUsers = new Set();
const userTimeouts = new Map();

const notifyMatch = (userId1, userId2) => {
  notifyUser(userId1, 'matched');
  notifyUser(userId2, 'matched');
};

export const initializeMatchQueue = async (channel) => {
  for (const topic of TOPICS) {
    const topicQueueName = `${topic}_queue`;
    await channel.assertQueue(topicQueueName, { durable: true });
    console.log(`Queue ${topicQueueName} initialized`);

    for (const difficulty of DIFFICULTIES) {
      const difficultyQueueName = `${topic}_${difficulty}_queue`;
      await channel.assertQueue(difficultyQueueName, { durable: true });
      console.log(`Queue ${difficultyQueueName} initialized`);
    }
  }
  console.log("Match queues initialized");
};

export const addUser = async (user) => {
  if (activeUsers.has(user.userId)) {
    notifyUser(user.userId, 'Active request exists');
    throw new Error(`User ${user.userId} already has an active match request`);
  }

  activeUsers.add(user.userId);

  try {
    const queueName = `${user.topic}_queue`;
    const channel = getChannel();
    await channel.sendToQueue(queueName, Buffer.from(JSON.stringify(user)), {
      persistent: true,
    });
    console.log(`User ${user.userId} added to the ${queueName}`);

    if (userTimeouts.has(user.userId)) {
      clearTimeout(userTimeouts.get(user.userId));
    }

    const timeoutId = setTimeout(async () => {
      await removeUserFromQueue(user, channel);
      notifyUser(user.userId, 'timeout');
      activeUsers.delete(user.userId);
      userTimeouts.delete(user.userId);
      console.log(`User ${user.userId} removed from activeUsers set due to timeout`);
    }, 30000);

    userTimeouts.set(user.userId, timeoutId);

    return { success: `User ${user.userId} added to the ${queueName}` };
  } catch (error) {
    activeUsers.delete(user.userId);
    console.error("Error adding user to the match queue:", error);
    throw new Error("Failed to add user to the match queue");
  }
};

const fetchMatchQueue = async (queueName, channel) => {
  const users = [];
  await new Promise((resolve) => {
    channel.consume(queueName, (msg) => {
      if (msg) {
        users.push(JSON.parse(msg.content.toString()));
        channel.ack(msg);
      }
    }, { noAck: false }).then((result) => {
      setTimeout(() => {
        channel.cancel(result.consumerTag);
        resolve();
      }, 1000);
    });
  });
  console.log(`Fetched users from ${queueName}:`, users);
  return users;
};

const meetHardMatchingCriteria = (user1, user2) => {
  return (
    user1.topic === user2.topic &&
    user1.difficulty === user2.difficulty &&
    user1.userId !== user2.userId
  );
};

const meetSoftMatchingCriteria = (user1, user2) => {
  return user1.topic === user2.topic && user1.userId !== user2.userId;
};

export const checkForMatches = async (matchRequest, topic, channel, difficulties) => {
  const specificQueueName = `${topic}_${matchRequest.difficulty}_queue`;
  const specificQueue = await fetchMatchQueue(specificQueueName, channel);
  console.log(`Match queue for ${specificQueueName}:`, specificQueue);

  const hardMatch = specificQueue.find((user) =>
    meetHardMatchingCriteria(user, matchRequest)
  );

  if (hardMatch) {
    console.log(`Hard match found: ${hardMatch.userId} with ${matchRequest.userId}`);
    notifyMatch(hardMatch.userId, matchRequest.userId);
    activeUsers.delete(matchRequest.userId);
    activeUsers.delete(hardMatch.userId);
    console.log(`Queue after match: ${JSON.stringify(await fetchMatchQueue(specificQueueName, channel))}`);
    return true;
  }

  for (const difficulty of difficulties) {
    if (difficulty === matchRequest.difficulty) continue; 

    const queueName = `${topic}_${difficulty}_queue`;
    const matchQueue = await fetchMatchQueue(queueName, channel);
    console.log(`Match queue for ${queueName}:`, matchQueue);

    const softMatch = matchQueue.find((user) =>
      meetSoftMatchingCriteria(user, matchRequest)
    );

    if (softMatch) {
      console.log(`Soft match found: ${softMatch.userId} with ${matchRequest.userId}`);
      notifyMatch(softMatch.userId, matchRequest.userId);
      activeUsers.delete(matchRequest.userId);
      activeUsers.delete(softMatch.userId);
      console.log(`Queue after match: ${JSON.stringify(await fetchMatchQueue(queueName, channel))}`);
      return true;
    }
  }

  console.log(`No match found for ${matchRequest.userId} in any difficulty queue for topic ${topic}`);
  return false;
};

export const requeueUser = async (user, channel) => {
  const queueName = `${user.topic}_${user.difficulty}_queue`;
  await channel.sendToQueue(queueName, Buffer.from(JSON.stringify(user)), {
    persistent: true,
  });
  console.log(`User ${user.userId} requeued to ${queueName}`);
};

const removeUserFromQueueByName = async (userId, queueName, channel) => {
  const users = await fetchMatchQueue(queueName, channel);
  const userIndex = users.findIndex(u => u.userId === userId);

  if (userIndex !== -1) {
    users.splice(userIndex, 1);
    await channel.purgeQueue(queueName);
    for (const remainingUser of users) {
      await channel.sendToQueue(queueName, Buffer.from(JSON.stringify(remainingUser)), {
        persistent: true,
      });
    }
    console.log(`User ${userId} removed from ${queueName}`);
    activeUsers.delete(userId);
  }
};

const removeUserFromQueue = async (user, channel) => {
  const queueName = `${user.topic}_${user.difficulty}_queue`;
  await removeUserFromQueueByName(user.userId, queueName, channel);
};

export const removeUserFromAllQueues = async (userId, topic, difficulty, channel) => {
  const topicQueueName = `${topic}_queue`;
  await removeUserFromQueueByName(userId, topicQueueName, channel);

  const queueName = `${topic}_${difficulty}_queue`;
  await removeUserFromQueueByName(userId, queueName, channel);
};