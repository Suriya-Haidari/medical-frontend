import express from "express";
import jwt from "jsonwebtoken";
import db from "../utils/db.js"; 

const router = express.Router();

router.post("/logout", async (req, res) => {
  try {
    // Extract the token from the cookie
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "No token provided." });
    }

    // Verify and decode the token to get the user ID
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Ensure JWT_SECRET is defined in your .env
    const userId = decoded.userId; // Adjust according to your token's payload structure

    // Clear the token cookie from the browser
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });

    // Remove the session_id from the database
    await db.query("UPDATE users SET session_id = NULL WHERE id = $1", [
      userId,
    ]);

    res.json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Logout error:", error); // Log the error for debugging
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ message: "Invalid token." });
    }
    res.status(500).json({ message: "Failed to log out." });
  }
});

export default router;
