/**
 * EXAMPLE: How to integrate email sending into your auth routes
 * 
 * This file shows you how to add email functionality to your registration process.
 * You can copy the relevant parts into your actual routes/auth.js file.
 */

const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/User");
const { sendWelcomeEmail } = require("../utils/emailService");

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret-change-this";

// Helper to create JWT
function createToken(user) {
    return jwt.sign(
        {
            id: user._id,
            username: user.username,
            email: user.email,
            role: user.role,
        },
        JWT_SECRET,
        { expiresIn: "7d" }
    );
}

// Register with Email Notification
router.post("/register", async (req, res) => {
    try {
        const { username, email, mobile, password, role } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({ message: "Username, email and password are required" });
        }

        const existingUser = await User.findOne({
            $or: [{ email: email.toLowerCase() }, { username }],
        });

        if (existingUser) {
            return res.status(409).json({ message: "User with this email or username already exists" });
        }

        const passwordHash = await bcrypt.hash(password, 10);

        const user = await User.create({
            username,
            email: email.toLowerCase(),
            mobile,
            passwordHash,
            role: ["buyer", "seller", "admin"].includes(role) ? role : "buyer",
        });

        const token = createToken(user);

        // ✅ NEW: Send welcome email after successful registration
        try {
            await sendWelcomeEmail(user.email, user.username);
            console.log(`Welcome email sent to ${user.email}`);
        } catch (emailError) {
            // Don't fail the registration if email fails
            // Just log the error
            console.error("Failed to send welcome email:", emailError);
        }

        return res.status(201).json({
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role,
            },
        });
    } catch (err) {
        console.error("Error in /auth/register", err);
        return res.status(500).json({ message: "Internal server error" });
    }
});

// Login (unchanged)
router.post("/login", async (req, res) => {
    try {
        const { username, password, role } = req.body;

        if (!username || !password) {
            return res.status(400).json({ message: "Username and password are required" });
        }

        const user = await User.findOne({ username });

        if (!user) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        if (role && role !== user.role) {
            return res.status(403).json({ message: "This account does not have access to the selected role" });
        }

        const token = createToken(user);

        return res.json({
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role,
            },
        });
    } catch (err) {
        console.error("Error in /auth/login", err);
        return res.status(500).json({ message: "Internal server error" });
    }
});

module.exports = router;

/**
 * TO INTEGRATE THIS INTO YOUR ACTUAL AUTH ROUTES:
 * 
 * 1. Add this import at the top of routes/auth.js:
 *    const { sendWelcomeEmail } = require("../utils/emailService");
 * 
 * 2. Add the email sending code to your /register route (around line 52):
 *    try {
 *      await sendWelcomeEmail(user.email, user.username);
 *      console.log(`Welcome email sent to ${user.email}`);
 *    } catch (emailError) {
 *      console.error("Failed to send welcome email:", emailError);
 *    }
 * 
 * That's it! New users will now receive a welcome email when they register.
 */
