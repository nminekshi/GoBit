require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const { closeExpiredLiveAuctions, closeExpiredNormalAuctions, placeBid } = require("./services/auctionService");

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

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CORS_ORIGIN?.split(",") || ["http://localhost:3000", "http://127.0.0.1:3000"],
    methods: ["GET", "POST"],
  },
});

app.set("io", io);

io.on("connection", (socket) => {
  socket.on("join-auction", (auctionId) => {
    if (!auctionId) return;
    socket.join(`auction:${auctionId}`);
  });

  socket.on("leave-auction", (auctionId) => {
    if (!auctionId) return;
    socket.leave(`auction:${auctionId}`);
  });

  socket.on("live:bid", async (payload) => {
    try {
      const { auctionId, bidAmount, userId } = payload || {};
      if (!auctionId || !userId) {
        return socket.emit("bid:error", { auctionId, message: "Missing auction or user" });
      }
      const updatedAuction = await placeBid({ auctionId, bidderId: userId, bidAmount });
      io.to(`auction:${auctionId}`).emit("auction:update", updatedAuction);
      socket.emit("bid:ok", { auctionId });
    } catch (err) {
      socket.emit("bid:error", { auctionId: payload?.auctionId, message: err.message || "Bid failed" });
    }
  });
});

setInterval(() => closeExpiredLiveAuctions(io), 5000);
setInterval(() => closeExpiredNormalAuctions(io), 10000);

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
