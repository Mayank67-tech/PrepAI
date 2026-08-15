import { GoogleGenAI } from '@google/genai';
import {questionAnswerPrompt, conceptExplainPrompt} from '../utils/prompts.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';

// Built lazily: this module is imported before server.js runs dotenv.config(),
// so reading the key at module scope would capture undefined.
let aiClient;
const getAiClient = () => {
    if (aiClient === undefined) {
        aiClient = process.env.GOOGLE_AI_API_KEY
            ? new GoogleGenAI({ apiKey: process.env.GOOGLE_AI_API_KEY })
            : null;
        if (!aiClient) {
            console.warn("GOOGLE_AI_API_KEY is not set; AI routes will serve fallback content.");
        }
    }
    return aiClient;
};

const tryGeminiGeneration = async (prompt, fallbackText = "") => {
    const client = getAiClient();
    if (!client) {
        return fallbackText;
    }

    const candidateModels = [
        "gemini-flash-latest",
        "gemini-3.5-flash",
        "gemini-3.1-flash-lite",
        "gemini-flash-lite-latest"
    ];

    for (const modelName of candidateModels) {
        try {
            const response = await client.models.generateContent({
                model: modelName,
                contents: prompt,
            });

            const rawText = typeof response?.text === "string"
                ? response.text
                : typeof response?.output_text === "string"
                    ? response.output_text
                    : JSON.stringify(response || {});

            if (rawText && rawText.trim()) {
                return rawText;
            }
        } catch (error) {
            console.warn(`Gemini model ${modelName} unavailable:`, error?.message || error);
        }
    }

    return fallbackText;
};

// Gemini sometimes wraps JSON in a ```json fence or includes stray control
// characters; strip both before parsing.
const parseAiJson = (rawText) => {
    if (!rawText) return null;

    const cleanedText = rawText
        .replace(/^```json\s*/, "")
        .replace(/```$/, "")
        .replace(/[\u0000-\u001F\u007F-\u009F]/g, "")
        .trim();

    try {
        return JSON.parse(cleanedText);
    } catch {
        return null;
    }
};

const normalizeQuestionText = (text) =>
    String(text || "")
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, "")
        .replace(/\s+/g, " ")
        .trim();

// Drops any candidate that matches (case/punctuation-insensitively) a
// previously-asked question or an earlier item in this same batch.
const dedupeQuestions = (candidates, existingQuestions = []) => {
    const seen = new Set(existingQuestions.map(normalizeQuestionText).filter(Boolean));
    const unique = [];

    for (const candidate of candidates) {
        const key = normalizeQuestionText(candidate?.question);
        if (!key || seen.has(key)) continue;
        seen.add(key);
        unique.push(candidate);
    }

    return unique;
};

const getRoleSpecificTopics = (role, customTopics) => {
    const normalizedRole = (role || "").toLowerCase();
    const topicList = (customTopics || "")
        .split(",")
        .map((topic) => topic.trim())
        .filter(Boolean);

    if (normalizedRole.includes("frontend") || normalizedRole.includes("ui") || normalizedRole.includes("react")) {
        return topicList.length > 0 ? topicList : ["React", "JavaScript", "DOM rendering", "state management", "performance optimization", "API integration"];
    }

    if (normalizedRole.includes("backend") || normalizedRole.includes("node") || normalizedRole.includes("java") || normalizedRole.includes("api")) {
        return topicList.length > 0 ? topicList : ["Node.js", "REST APIs", "database design", "authentication", "caching", "microservices"];
    }

    if (normalizedRole.includes("full stack") || normalizedRole.includes("fullstack")) {
        return topicList.length > 0 ? topicList : ["React", "Node.js", "MongoDB", "API design", "deployment", "auth flows"];
    }

    if (normalizedRole.includes("data") || normalizedRole.includes("analyst") || normalizedRole.includes("python")) {
        return topicList.length > 0 ? topicList : ["SQL", "Python", "data modeling", "ETL", "statistics", "dashboarding"];
    }

    return topicList.length > 0 ? topicList : ["system design", "problem solving", "technical communication", "trade-offs", "scalability", "debugging"];
};

const buildFallbackQuestionSet = ({ role, experience, topicsToFocus, numberOfQuestions, startIndex = 0 }) => {
    const normalizedRole = role?.trim() || "Software Engineer";
    const normalizedExperience = experience?.trim() || "1 year";
    const focusTopics = getRoleSpecificTopics(normalizedRole, topicsToFocus);
    const questionPatterns = [
        "How would you explain {topic} to a junior developer in a real project and why does it matter?",
        "What trade-offs would you consider when choosing {topic} for a production system?",
        "Describe a situation where {topic} caused a bug or bottleneck. How would you investigate and fix it?",
        "How would you optimize or improve the use of {topic} in a scalable application?",
        "What are the most important concepts a candidate should understand about {topic} before an interview?",
        "If you had to debug a production issue related to {topic}, what would your investigation workflow look like?",
        "When would you prefer {topic} over an alternative approach, and when would you avoid it?",
        "How would you design a small feature or module using {topic} to make it maintainable and testable?"
    ];

    return Array.from({ length: Number(numberOfQuestions) || 5 }, (_, i) => {
        const index = startIndex + i;
        const topic = focusTopics[index % focusTopics.length];
        const pattern = questionPatterns[index % questionPatterns.length];
        const question = pattern.replace("{topic}", topic);

        return {
            question: `For a ${normalizedRole} with ${normalizedExperience} of experience, ${question}`,
            answer: `A strong answer should begin by defining ${topic} clearly, explain why it matters in ${normalizedRole} work, and then walk through a practical example or implementation scenario. Cover trade-offs, edge cases, performance or maintainability concerns, and how you would validate the solution in production. Good answers usually show both technical understanding and judgment under real-world constraints.`
        };
    });
};

// Generate interview questions and answers using Gemini, falling back to a
// locally-generated question set if the AI call or JSON parse fails.
const generateInterviewQuestions = asyncHandler(async (req, res) => {
    const { role, experience, topicsToFocus, numberOfQuestions, existingQuestions } = req.body;
    const normalizedTopics = (topicsToFocus ?? "").trim() || "General interview preparation";
    const normalizedCount = Number(numberOfQuestions);
    const normalizedExistingQuestions = Array.isArray(existingQuestions)
        ? existingQuestions.map((q) => String(q || "").trim()).filter(Boolean).slice(0, 100)
        : [];

    if (!role || !experience || !numberOfQuestions) {
        throw new ApiError(400, "Role, experience, and question count are required");
    }

    if (!Number.isFinite(normalizedCount) || normalizedCount <= 0) {
        throw new ApiError(400, "numberOfQuestions must be a positive number");
    }

    const fallbackData = buildFallbackQuestionSet({
        role,
        experience,
        topicsToFocus: normalizedTopics,
        numberOfQuestions: normalizedCount,
        startIndex: normalizedExistingQuestions.length
    });

    const prompt = questionAnswerPrompt({
        role,
        experience,
        topicsToFocus: normalizedTopics,
        numberOfQuestions: normalizedCount,
        existingQuestions: normalizedExistingQuestions
    });

    const rawText = await tryGeminiGeneration(prompt, "");
    const parsed = parseAiJson(rawText);
    const uniqueData = Array.isArray(parsed)
        ? dedupeQuestions(parsed, normalizedExistingQuestions)
        : null;

    if (!uniqueData || uniqueData.length === 0) {
        const message = parsed === null
            ? "AI response format failed; returned local fallback questions"
            : Array.isArray(parsed) && parsed.length > 0
                ? "AI returned only duplicate questions; using local fallback questions"
                : "AI returned empty response; using local fallback questions";

        return res.status(200).json(new ApiResponse(200, fallbackData, message));
    }

    return res.status(200).json(
        new ApiResponse(200, uniqueData, "Interview questions generated successfully")
    );
});

// Generate a concept explanation for a given interview question using
// Gemini, falling back to a generic explanation if the AI call fails.
const generateConceptExplanation = asyncHandler(async (req, res) => {
    const { question } = req.body;

    if (!question) {
        throw new ApiError(400, "Question is required");
    }

    const fallbackData = {
        title: "Concept overview",
        explanation: `Here is a practical explanation of "${question}": start with the core idea, explain why it matters in software engineering, and then walk through a small example or scenario. Focus on the problem it solves, the trade-offs involved, and how you would apply it in a real project. This gives a clear, beginner-friendly understanding without overcomplicating the concept.`
    };

    const prompt = conceptExplainPrompt(question);
    const rawText = await tryGeminiGeneration(prompt, "");
    const data = parseAiJson(rawText);

    if (!data) {
        return res.status(200).json(
            new ApiResponse(200, fallbackData, "AI response format failed; returned local explanation fallback")
        );
    }

    return res.status(200).json(
        new ApiResponse(200, data, "Concept explanation generated successfully")
    );
});

export {generateInterviewQuestions,generateConceptExplanation};