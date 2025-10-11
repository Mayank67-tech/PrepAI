import * as genAI from '@google/generative-ai';
import {questionAnswerPrompt, conceptExplainPrompt} from '../utils/prompts.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';


// console.log("Google API Key:", process.env.GOOGLE_AI_API_KEY);


 const ai = new genAI.GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY);


//generate interview questions and answers using gemini
const generateInterviewQuestions =asyncHandler(async (req, res) => {
   const {role,experience,topicsToFocus, numberOfQuestions} = req.body;

   if(!role || !experience || !topicsToFocus || !numberOfQuestions) {
       throw new ApiError(400, "All fields are required");
   }
   console.log("[Gemini] Received request body:", req.body);
   const prompt= questionAnswerPrompt({ role, experience, topicsToFocus, numberOfQuestions });
   console.log("[Gemini] Prompt for question generation (numberOfQuestions:", numberOfQuestions, "):\n", prompt);
   if(!prompt) {
       throw new ApiError(400, "Invalid prompt");
   }
    
   
   const model = ai.getGenerativeModel({ model: "gemini-2.5-pro", generationConfig: { temperature: 0.9 } });

const result = await model.generateContent(prompt);
const response = await result.response;
const rawText = await response.text();
// console.log( rawText);

const cleanedText = rawText
    .replace(/^```json\s*/,"") // Remove starting ```json
    .replace(/```$/,"") //remove ending ```
    .replace(/[\u0000-\u001F\u007F-\u009F]/g, "") // Remove most control chars
    .trim();
// console.log(cleanedText);

//parsing the cleaned text
let data;
try {
    data = JSON.parse(cleanedText);
} catch (e) {
    console.error("Failed to parse Gemini response as JSON", e);
    return res.status(500).json({
        message: "Failed to parse AI response as JSON. See server logs for details.",
        rawText,
        cleanedText
    });
}

res.status(200).json(
    new ApiResponse(200,data, "Interview questions generated successfully")
);
}
);


//generate concept explanation using gemini
 const generateConceptExplanation = asyncHandler(async (req, res) => {
    // console.log("REQ BODY:", req.body);
    const {question} = req.body 

    if (!question) {
        return res.status(400).json({ message: "Missing required field" });
    }

    const prompt = conceptExplainPrompt(question);
    const model = ai.getGenerativeModel({ model: "gemini-2.5-pro" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const rawText = await response.text();

    const cleanedText = rawText
        .replace(/^```json\s*/, "")
        .replace(/```$/, "")
        .replace(/[\u0000-\u001F\u007F-\u009F]/g, "") // Remove most control chars
        .trim();

    console.log("Gemini rawText:\n", rawText);
    console.log("Gemini cleanedText:\n", cleanedText);

    let data;
    try {
        data = JSON.parse(cleanedText);
    } catch (e) {
        console.error("Failed to parse Gemini response as JSON", e);
        return res.status(500).json({
            message: "Failed to parse AI response as JSON. See server logs for details.",
            rawText,
            cleanedText
        });
    }

    res.status(200).json(
        new ApiResponse(200, data, "Concept explanation generated successfully")
    );
});

export {generateInterviewQuestions,generateConceptExplanation};