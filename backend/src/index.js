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
//const __dirname = path.resolve(); Error while deploying
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

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
try {
  console.log("⏳ Mounting /api/auth");
  app.use("/api/auth", authRoutes);
  console.log("✅ Mounted /api/auth");
} catch (err) {
  console.error("🔥 Error mounting /api/auth", err);
}

try {
  console.log("⏳ Mounting /api/messages");
  app.use("/api/messages", messageRoutes);
  console.log("✅ Mounted /api/messages");
} catch (err) {
  console.error("🔥 Error mounting /api/messages", err);
}

// If we are in production, go ahead and make the dist folder our static assets/ using static middleware from express
/*
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  // If we visit any route than this, see the react application
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
    // serving both api and the react application under the same place
  });
}*/
if (process.env.NODE_ENV === "production") {
  const clientPath = path.join(__dirname, "../client-build");
  console.log("⚡ Serving React from:", clientPath);

  app.use(express.static(clientPath));

  app.get("*", (req, res) => {
    const indexFile = path.join(clientPath, "index.html");

    if (fs.existsSync(indexFile)) {
      res.sendFile(indexFile);
    } else {
      console.error("❌ index.html does not exist at:", indexFile);
      res.status(500).send("index.html not found.");
    }
  });
}




server.listen(PORT, () => {
  console.log("Server is running on port: " + PORT);
  connect_db();
});
