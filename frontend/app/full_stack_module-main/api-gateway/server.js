import express from "express";
import { createProxyMiddleware } from "http-proxy-middleware";
import morgan from "morgan";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// User Service
app.use(
  "/users",
  createProxyMiddleware({
    target: process.env.USER_SERVICE_URL,
    changeOrigin: true,
  })
);

// Auth Service
app.use(
  "/auth",
  createProxyMiddleware({
    target: process.env.AUTH_SERVICE_URL,
    changeOrigin: true,
  })
);

// Product Service
app.use(
  "/products",
  createProxyMiddleware({
    target: process.env.PRODUCT_SERVICE_URL,
    changeOrigin: true,
  })
);

// Fallback
app.use("*", (req, res) => {
  res.status(404).json({ message: "Route not found in API Gateway" });
});

app.listen(process.env.PORT, () => {
  console.log(`🚀 API Gateway running on port ${process.env.PORT}`);
});
