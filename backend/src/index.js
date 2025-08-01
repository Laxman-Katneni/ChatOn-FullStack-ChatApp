import express from "express";
import authRoutes from "./routes/auth.route.js";
import dotenv from "dotenv";
import { connect_db } from "./lib/db.js";
import cookieParser from "cookie-parser"; // To be able to grab the token from the cookie
import messageRoutes from "./routes/message.route.js";
import cors from "cors";
import { app, server } from "./lib/socket.js";
import { fileURLToPath } from "url";
import { dirname } from "path";
import fs from "fs";

import path from "path"; // For Deployment
dotenv.config();

//const app = express(); Removing as created one in socket.js

const PORT = process.env.PORT;
const __dirname = path.resolve();

//app.use(express.json()); // Middleware to allow extracting the json data from the body
// PayloadTooLargeError: request entity too large // as by default, max limit is 100kb, which is kinda small for images
app.use(express.json({ limit: "10mb" }));

app.use(cookieParser()); // Allows us to parse the cookie

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true, // To allow cookies or authorization headers
  })
);

app.use("/api/auth", authRoutes); // Authentication
app.use("/api/messages", messageRoutes); // Messages

// If we are in production, go ahead and make the dist folder our static assets/ using static middleware from express

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  // If we visit any route than this, see the react application
  app.get("/*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
    // serving both api and the react application under the same place
  });
}

server.listen(PORT, () => {
  console.log("Server is running on port: " + PORT);
  connect_db();
});
