import jwt from "jsonwebtoken";
export const generate_token = (user_id, res) => {
  const token = jwt.sign({ user_id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
  res.cookie("jwt", token, {
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7D->MS
    httpOnly: true, // To prevent XSS (Cross-Site Scripting) attacks
    sameSite: true, // To prevent CSRF(Cross-Site Request Forgery) attacks
    secure: process.env.NODE_ENV !== "development", // https vs http // only allow http in development
  });
  return token;
};
