import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import uploadRoutes from "./routes/upload.routes.js";
import chatRoutes from "./routes/chat.routes.js";

dotenv.config();

const app = express();

/* middleware */
app.use(cors());
app.use(express.json());

/* test route */
app.get("/", (req, res) => {
  res.json({ status: "Server running" });
});

app.use("/api/upload", uploadRoutes);
app.use("/api/chat", chatRoutes);

/* MongoDB connection */
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected");
  })
  .catch((err) => {
    console.error("❌ MongoDB error:", err);
  });

/* start server */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server listening on ${PORT}`);
});
