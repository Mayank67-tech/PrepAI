import express from "express";
import { createSession, getSessionById, deleteSession, getMySessions } from "../controllers/sessionControllers.js";
import { verifyJWT } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.route('/create').post(verifyJWT, createSession);
router.route('/my-sessions').get(verifyJWT, getMySessions);
router.route('/:id').get(verifyJWT, getSessionById);
router.route('/:id').delete(verifyJWT, deleteSession);


export default router;