import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Session } from "../models/session.model.js";
import { Question } from "../models/question.model.js";
import mongoose from "mongoose";

// create a new session and its questions
const createSession = asyncHandler(async (req, res) => {
    const { role, experience, topicsToFocus, description, questions } = req.body;
    const userId = req.user._id;

    const session = await Session.create({
        user: userId,
        role,
        experience,
        topicsToFocus,
        description,
    });
    // returns an array of Promises, we need to wait for all of them to finish
    const questionDocs = await Promise.all(
        questions.map(async (q) => {
            const question = await Question.create({
                session: session._id,
                question: q.question,
                answer: q.answer,
            });
            return question._id;
        })
    );
    session.questions = questionDocs;
    await session.save();
    return res.status(201).json(
        new ApiResponse(201, session, "Session created successfully")
    );
});


const getSessionById = asyncHandler(async (req, res) => {
    //session id 
    const id = req.params.id;

    const session = await Session.findById(id)
        .populate({
            path: "questions",
            options: { sort: { isPinned: -1, createdAt: 1 } },
        });

    if (!session) {
        throw new ApiError(404, "Session not found");
    }

    res.status(200).json(new ApiResponse(200, session, "Session fetched by id successfully"));
});


const getMySessions = asyncHandler(async (req, res) => {
    const session = await Session.find({user :req.user._id})
    .sort({createdAt:-1})
    .populate("questions");

    res.status(200).json(new ApiResponse(200,session,"Session fetched successfully"));
});
const deleteSession = asyncHandler(async (req, res) => {
 
    const session = await Session.findById(req.params.id);

    if (!session) {
        throw new ApiError(404, "Session not found");
    }

    if (!session.user.equals(req.user._id)) {
        throw new ApiError(401, "Not authorized to delete this session");
    }

    // Delete all questions related to that session
    await Question.deleteMany({ session: session._id });

    // Then delete the session
    await Session.findByIdAndDelete(session._id);

    res.status(200).json(new ApiResponse(200, null, "Session deleted successfully"));
});



export { createSession, getSessionById, deleteSession, getMySessions };




