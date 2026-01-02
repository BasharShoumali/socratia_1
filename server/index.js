import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";

import authRoutes from "./src/routes/auth.routes.js";
import adminRoutes from "./src/routes/admin.routes.js";

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);

// Health check
app.get("/", (req, res) => {
  res.send("Socratia API is running");
});

// ✅ Global error handler (so 500 errors show in terminal)
app.use((err, req, res, next) => {
  console.error("🔥 SERVER ERROR:", err);
  res.status(err.status || 500).json({
    ok: false,
    error: err.message || "Server error",
  });
});

// DB connect
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(process.env.PORT || 5000, () => {
      console.log("Server running on port", process.env.PORT);
    });
  })
  .catch((err) => console.error("Mongo error:", err));
