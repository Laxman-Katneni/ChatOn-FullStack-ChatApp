// To add the socket server on top of the current server built with node js and express
// Gonna change it to socket server for real-time communication

import { Server } from "socket.io";
import http from "http"; // Built in to node
import express from "express";

const app = express();
const server = http.createServer(app);

// Socketio server
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173"],
  },
});

// Helper function

export function getReceiverSocketId(user_id) {
  return user_socket_map[user_id];
}

// To store the online users
const user_socket_map = {
  // user_id (coming from db): socket_id
};

// Listening for incoming connections
// Whenever some one connects, get the callback function
io.on("connection", (socket) => {
  // socket - user that has just connected
  console.log("A user has connected", socket.id);
  const user_id = socket.handshake.query.user_id;
  if (user_id) {
    user_socket_map[user_id] = socket.id;
  }

  // send online users
  // io.emit() - Broadcast/send events to every single user that is connected
  io.emit("getOnlineUsers", Object.keys(user_socket_map));

  // to listen for disconnections
  socket.on("disconnect", () => {
    console.log("A user has disconnected", socket.id);
    delete user_socket_map[user_id];
    io.emit("getOnlineUsers", Object.keys(user_socket_map));
  });
});

export { io, app, server };
