import express from "express";
import {
  signup,
  login,
  logout,
  update_profile,
  checkAuth,
} from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";
const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);

router.put("/update-profile", protectRoute, update_profile); // To update the profile pic
// Don't want to call this for every user, they should be authenticated, so add middleware to do that

router.get("/check", protectRoute, checkAuth); // Just checks if the user is authenticated or not
export default router;
