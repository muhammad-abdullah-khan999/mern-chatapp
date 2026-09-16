import dotenv from "dotenv";
dotenv.config();

import { Server } from "socket.io";
import http from "http";     
import express from "express";

// Create an Express app
const app = express();

// Create an HTTP server using the Express app
const server = http.createServer(app);

// Initialize a new Socket.io server and attach it to the HTTP server
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL,   // Allow connections only from our client URL
  },
});

// Store mapping between user IDs and their socket IDs
// Example: { "user1": "socket123", "user234": "socket234" }
const userSocketMap = {};

// Handle new socket connections
io.on("connection", (socket) => {
  // Get userId from the client's connection query parameters
  const userId = socket.handshake.query.userId;
  console.log("socket.handshake: ", socket.handshake)

  // If no userId is provided, stop further execution
  if (!userId) return;

  // Map the connected user's ID to their socket ID
  userSocketMap[userId] = socket.id;

  // Notify all connected clients about currently online users
  io.emit("onlineUsers", Object.keys(userSocketMap));

  // Handle user disconnection
  socket.on("disconnect", () => {
    // Remove the user from the online list when they disconnect
    delete userSocketMap[userId];

    // Update all clients with the new list of online users
    io.emit("onlineUsers", Object.keys(userSocketMap));
  });
  console.log("onlineUsers :", Object.keys(userSocketMap))
});

// Helper function to get a user's socket ID by their user ID
const getSocketId = (userId) => {
  return userSocketMap[userId];
};

// Export the necessary modules so they can be used elsewhere
export { io, app, server, getSocketId };
