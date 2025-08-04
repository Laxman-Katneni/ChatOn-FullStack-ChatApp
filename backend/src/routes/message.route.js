import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import {
  get_users_for_side_bar,
  get_messages,
  send_message,
} from "../controllers/message.controller.js";

const router = express.Router();

router.get("/users", protectRoute, get_users_for_side_bar); // to see the users on the sidebar
router.get("/:id", protectRoute, get_messages); // user_id we'd like to fetch our messages with / /:id is a dynamic value

router.post("/send/:id", protectRoute, send_message); // To send messages

export default router;
