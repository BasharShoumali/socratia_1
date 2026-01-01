import express from "express";
import cors from "cors";
import dotenv from "dotenv";

// Auth/Admin (your new system)
import { connectDB } from "./src/config/db.js";
import authRoutes from "./src/routes/auth.routes.js";
import adminRoutes from "./src/routes/admin.routes.js";

// Old features (upload/chat) - keep if these files exist in your repo
import uploadRoutes from "./routes/upload.routes.js";
import chatRoutes from "./routes/chat.routes.js";

dotenv.config();

const app = express();

// --- Config ---
const PORT = process.env.PORT || 5000;

const ALLOWED_ORIGINS = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "http://localhost:3000",
  "http://127.0.0.1:3000",
];

// --- Middlewares ---
app.use(express.json({ limit: "10mb" }));

app.use(
  cors({
    origin: (origin, cb) => {
      if (!origin) return cb(null, true);
      if (ALLOWED_ORIGINS.includes(origin)) return cb(null, true);
      return cb(new Error(`CORS blocked for origin: ${origin}`));
    },
    credentials: true,
  })
);

// --- Routes ---
app.get("/", (req, res) => {
  res.json({ status: "Server running" });
});

app.get("/api/health", (req, res) => {
  res.status(200).json({
    ok: true,
    service: "socratia-api",
    time: new Date().toISOString(),
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/chat", chatRoutes);

// 404 fallback
app.use((req, res) => {
  res.status(404).json({ ok: false, error: "Route not found" });
});

// --- Start (connect DB first, then start server) ---
async function start() {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`✅ SOCRATIA backend running on http://localhost:${PORT}`);
  });
}

start();
