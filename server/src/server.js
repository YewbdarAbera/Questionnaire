import "dotenv/config";
import express from "express";
import cors from "cors";
import { connectDB } from "./config/db.js";
import surveyRoutes from "./routes/surveys.js";

const app = express();

app.use(express.json());

// CORS: allow Vite dev origin (or use Vite proxy instead)
const origins = (process.env.CORS_ORIGIN || "")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);
app.use(cors({ origin: origins.length ? origins : "*" }));

app.get("/api/health", (_req, res) => res.json({ ok: true }));

app.use("/api/surveys", surveyRoutes);

const PORT = process.env.PORT || 4000;
connectDB()
  .then(() => {
    app.listen(PORT, () => console.log(`🚀 API on http://localhost:${PORT}`));
  })
  .catch((err) => {
    console.error("❌ Failed to start API", err);
    process.exit(1);
  });

import adminRoutes from "./routes/admin.js";
app.use("/api/admin", adminRoutes);
