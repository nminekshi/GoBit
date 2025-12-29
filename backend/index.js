require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");

const app = express();
const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error("Missing MONGODB_URI in environment. Please set it in a .env file.");
  process.exit(1);
}

// Basic middleware
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

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
