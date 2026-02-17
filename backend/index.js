require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/users");
const auctionRoutes = require("./routes/auctions");

const app = express();
const PORT = process.env.PORT || 4000;
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/fyp";

if (!process.env.MONGODB_URI) {
  console.warn("MONGODB_URI not set; falling back to mongodb://127.0.0.1:27017/fyp for local dev.");
}

// Basic middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
    process.exit(1);
  });

// Simple health route
app.get("/", (req, res) => {
  res.send("Backend API is running and connected to MongoDB");
});

// Auth routes
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/auctions", auctionRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
