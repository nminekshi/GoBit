const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret-change-this";

// Simple auth middleware for admin-only access
function requireAdmin(req, res, next) {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;

  if (!token) {
    return res.status(401).json({ message: "Missing authorization token" });
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    if (payload.role !== "admin") {
      return res.status(403).json({ message: "Admin access required" });
    }
    req.user = payload;
    return next();
  } catch (err) {
    console.error("JWT verification failed", err);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}

// GET /users - list all users (admin only)
router.get("/", requireAdmin, async (_req, res) => {
  try {
    const users = await User.find({}, "username email mobile role createdAt updatedAt").sort({ createdAt: -1 });
    return res.json({ users });
  } catch (err) {
    console.error("Error fetching users", err);
    return res.status(500).json({ message: "Failed to fetch users" });
  }
});

// GET /users/:id - fetch a single user (admin only)
router.get("/:id", requireAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id, "username email mobile role createdAt updatedAt");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.json({ user });
  } catch (err) {
    console.error("Error fetching user", err);
    return res.status(500).json({ message: "Failed to fetch user" });
  }
});

// DELETE /users/:id - delete a user (admin only)
router.delete("/:id", requireAdmin, async (req, res) => {
  try {
    if (req.params.id === req.user.id) {
      return res.status(400).json({ message: "You cannot delete your own admin account" });
    }

    const deleted = await User.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.json({ message: "User deleted" });
  } catch (err) {
    console.error("Error deleting user", err);
    return res.status(500).json({ message: "Failed to delete user" });
  }
});

module.exports = router;
