import amqp from "amqplib";

let channel;
let connection;

// Connect to RabbitMQ
export async function connectRabbitMQ() {
  try {
    connection = await amqp.connect(process.env.RABBITMQ_URL || "amqp://rabbitmq:5672");
    channel = await connection.createChannel();
    console.log("Connected to RabbitMQ");
  } catch (error) {
    console.error("Error connecting to RabbitMQ:", error);
    throw error;
  }
}

export function getChannel() {
  if (!channel) {
    throw new Error("Channel is not initialized. Please connect first.");
  }
  return channel;
}