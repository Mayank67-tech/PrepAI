import express from "express"
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import cookieParser from "cookie-parser";

// Required for __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Correct absolute path to .env file in backend folder
dotenv.config({ path: path.resolve(__dirname, "./.env") });
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import sessionRoutes from "./routes/sessionRoutes.js";
import questionRoutes from "./routes/questionRoutes.js"
import {generateInterviewQuestions,generateConceptExplanation} from './controllers/aiControllers.js';
import { verifyJWT } from "./middlewares/authMiddleware.js";
const app=express();
app.use(cors({
    origin: `${process.env.FRONTEND_URL || "http://localhost:5173"}`, 
    credentials: true
}));

//express.json() parses that JSON and attaches it to req.body
app.use(express.json());
app.use(cookieParser());

// Connect to MongoDB before starting the server
connectDB();

//Routes
app.use("/api/auth", authRoutes);
app.use('/api/sessions',sessionRoutes);
app.use('/api/questions',questionRoutes);
app.post("/api/ai/generate-questions", verifyJWT, generateInterviewQuestions);
app.post("/api/ai/generate-explanation", verifyJWT, generateConceptExplanation);

// Global error handler
app.use((err, req, res, next) => {
    // If the error is an instance of ApiError, use its status and message
    if (err && err.statusCode) {
        return res.status(err.statusCode).json({
            success: false,
            message: err.message,
            data: null
        });
    }
    // Otherwise, fallback to generic 500
    res.status(500).json({
        success: false,
        message: err?.message || "Internal Server Error",
        data: null
    });
});

//start server
const PORT= process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});




