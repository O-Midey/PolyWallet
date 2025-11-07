import express, { json } from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { connect } from "mongoose";
import walletRoutes from "./routes/walletRoutes.js";
import transactionRoutes from "./routes/transactionRoutes.js";

import path from "path";
import { fileURLToPath } from "url";
import { routeLogger } from "./middlewares/logger.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const PORT = process.env.PORT || 3000;

dotenv.config({ path: path.join(__dirname, "../.env") });

// Middleware
app.use(helmet());
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:5174"],
    credentials: true,
  })
);
app.use(json());
app.use(routeLogger);

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Too many requests from this IP, please try again later.",
});
app.use("/api/", limiter);

// Health check
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    service: "PolyWallet API",
  });
});

// Routes
app.use("/api/wallet", walletRoutes);
app.use("/api/transaction", transactionRoutes);

// Error handling
app.use((err, req, res, next) => {
  console.error("Error:", err);
  res.status(err.status || 500).json({
    error: {
      message: err.message || "Internal server error",
      status: err.status || 500,
    },
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: {
      message: "Route not found",
      status: 404,
    },
  });
});

// MongoDB connection + Server start
connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("✅ MongoDB Connected");
    app.listen(PORT, () => {
      console.log(`🚀 PolyWallet API running on port ${PORT}`);
      console.log(`📡 Network: ${process.env.NETWORK || "polygon-mumbai"}`);
      console.log(
        `🔗 RPC: ${process.env.RPC_URL ? "Connected" : "Not configured"}`
      );
    });
  })
  .catch((err) => console.error("❌ MongoDB Connection Failed:", err));

export default app;
