import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import cookieParser from "cookie-parser";

import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import sessionRoutes from "./routes/sessionRoutes.js";
import questionRoutes from "./routes/questionRoutes.js";
import {
  generateInterviewQuestions,
  generateConceptExplanation
} from "./controllers/aiControllers.js";
import { verifyJWT } from "./middlewares/authMiddleware.js";

/* ===============================
   ENV CONFIG
================================ */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "./.env") });

/* ===============================
   APP INIT
================================ */
const app = express();

/* ===============================
   CORS (VERY IMPORTANT)
   Works for:
   - localhost
   - Vercel frontend
================================ */
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true
  })
);

/* ===============================
   MIDDLEWARES
================================ */
app.use(express.json());
app.use(cookieParser());

/* ===============================
   DATABASE
================================ */
connectDB();

/* ===============================
   ROUTES
================================ */
app.use("/api/auth", authRoutes);
app.use("/api/sessions", sessionRoutes);
app.use("/api/questions", questionRoutes);

app.post("/api/ai/generate-questions", verifyJWT, generateInterviewQuestions);
app.post("/api/ai/generate-explanation", verifyJWT, generateConceptExplanation);

/* ===============================
   GLOBAL ERROR HANDLER
================================ */
app.use((err, req, res, next) => {
  console.error(err);

  if (err?.statusCode) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      data: null
    });
  }

  res.status(500).json({
    success: false,
    message: "Internal Server Error",
    data: null
  });
});

/* ===============================
   SERVER START
================================ */
const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
