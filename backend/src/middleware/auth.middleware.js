import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const protectRoute = async (req, res, next) => {
  // next calls the next func in the auth.route.js
  try {
    const token = req.cookies.jwt; // That is the name given to the token that is sent to the cookie
    if (!token) {
      return res.status(401).json({ message: "No Token Provided" });
    }
    // The user_id is in the token in cookie as we gave the id as payload when creating the token, but we gotta parse it to get it
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      return res.status(401).json({ message: "Invalid Token" });
    }

    const user = await User.findById(decoded.user_id).select("-password"); // To not include the password
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    req.user = user;
    next();
  } catch (error) {
    console.log("Error in protectRoute middleware: " + error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
