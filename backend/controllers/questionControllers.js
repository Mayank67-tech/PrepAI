import { Question } from "../models/question.model.js";
import {Session} from  "../models/session.model.js"
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";


const addQuestionToSession = asyncHandler(async(req,res)=>{
    const {sessionId,questions} = req.body;
    
     if(!sessionId ||!questions || !Array.isArray(questions)){
        throw new ApiError(400,"Invalid input data");
     }

     const session = await Session.findById(sessionId);

     if(!session){
        throw new ApiError(404,"Session not found");
     }

     const createdQuestion = await Question.insertMany(
        questions.map((q) => ({
            session: session._id,
            question: q.question,
            answer: q.answer,
        }))
     )

     //Update session to add new question
     session.questions.push(...createdQuestion.map((q)=>q._id));
     await session.save();
    const updatedSession = await Session.findById(sessionId).populate('questions');

    res.status(201).json(new ApiResponse(201, updatedSession, "Added questions to the session successfully"));
});

const togglePinQuestion =asyncHandler(async(req,res)=>{
  const question  = await Question.findById(req.params.id);


  if(!question){
    throw new ApiError(404,"Question  not found")
  }

  question.isPinned= !question.isPinned;
  await question.save;

  res.status(200).json(new ApiResponse(200,question,'Toggled pin '))
  
});

const updateQuestionNote=asyncHandler(async(req,res)=>{
    const {note} = req.body;
    
    const question =await Question.findById(req.params.id);
    if(!question){
        throw new ApiError(404,"Question not found");
    }

    question.note= note;
    await question.save();

    return res.status(200).json(new ApiResponse(200,question,"Note added successfully"));

});


export  {addQuestionToSession,togglePinQuestion,updateQuestionNote};