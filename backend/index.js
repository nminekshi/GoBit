require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const {
  closeExpiredLiveAuctions,
  closeExpiredNormalAuctions,
  placeBid,
  processAutoBids,
  processSmartAgentsByAuction,
  processAllSmartAgents,
  clearAutomationLocks,
} = require("./services/auctionService");

const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/users");
const auctionRoutes = require("./routes/auctions");

const app = express();
const PORT = process.env.PORT || 4000;
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/fyp";
const isTestEnv = process.env.NODE_ENV === "test";

if (!process.env.MONGODB_URI) {
  console.warn("MONGODB_URI not set; falling back to mongodb://127.0.0.1:27017/fyp for local dev.");
}

// Basic middleware
app.use(cors());
app.use(express.json());
// PayHere sends urlencoded form data to the notify URL
app.use(express.urlencoded({ extended: true }));

async function connectMongo() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error("Error connecting to MongoDB:", err);
    throw err;
  }
}

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
  socket.on("join-user", (userId) => {
    if (!userId) return;
    socket.userId = userId.toString();
    socket.join(`user:${userId}`);
  });

  socket.on("leave-user", (userId) => {
    if (!userId) return;
    socket.leave(`user:${userId}`);
  });

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
      const { auctionId, bidAmount } = payload || {};
      const userId = socket.userId; // Use verified userId from socket
      if (!auctionId || !userId) {
        return socket.emit("bid:error", { auctionId, message: "Authentication required or missing auction" });
      }
      const updatedAuction = await placeBid({ auctionId, bidderId: userId, bidAmount });
      io.to(`auction:${auctionId}`).emit("auction:update", updatedAuction);
      
      const lastBid = updatedAuction.bids[updatedAuction.bids.length - 1];
      if (lastBid && lastBid.isSuspicious) {
          io.emit("admin:fraud_alert", {
              auctionId: updatedAuction._id,
              auctionTitle: updatedAuction.title,
              bid: lastBid
          });
      }

      await processAutoBids(auctionId, io);
      await processSmartAgentsByAuction(auctionId, io);
      socket.emit("bid:ok", { auctionId });
    } catch (err) {
      socket.emit("bid:error", { auctionId: payload?.auctionId, message: err.message || "Bid failed" });
    }
  });
});

if (!isTestEnv) {
  connectMongo()
    .then(async () => {
      setInterval(() => closeExpiredLiveAuctions(io), 5000);
      setInterval(() => closeExpiredNormalAuctions(io), 10000);
      setInterval(() => {
        processAllSmartAgents(io).catch((err) => {
          console.error("Smart agent scheduler error:", err.message);
        });
      }, 8000);

      await clearAutomationLocks();
      console.log("Automation locks cleared");

      server.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
      });
    })
    .catch((err) => {
      console.error("Failed to connect to MongoDB", err);
      process.exit(1);
    });
}

module.exports = app;
