export const BASE_URL = `${import.meta.env.VITE_BACKEND_URL || "http://localhost:8000"}`;

export const API_PATHS={
    AUTH:{
        REGISTER: "/api/auth/register", // Signup
        LOGIN:"/api/auth/login", //Authenticate user and return JWT token
        GET_PROFILE: "/api/auth/current-user", // get logged-in user details
        LOGOUT: "/api/auth/logout", //logiut 
    },

    AI:{
        GENERATE_QUESTIONS: "/api/ai/generate-questions", //generate interview questions and answers using Gemini
        GENERATE_EXPLANATION: "/api/ai/generate-explanation", //generate concept explanation using Gemini
    },

    SESSION:{
        CREATE: "/api/sessions/create", // create a new interview practics session with questions
        GET_ALL: "/api/sessions/my-sessions", // get all user sessions
        GET_ONE : (id) => `/api/sessions/${id}`, //get session details with question
        DELETE:(id) => `/api/sessions/${id}`, //delete a session
    },

    QUESTION:{
        ADD_TO_SESSION: "/api/questions/add", // add more questions to a session
        PIN: (id) => `/api/questions/${id}/pin`, // pin or unpin a question
        UPDATE_NOTE: (id)=> `/api/questions/${id}/note`, // Update/Add a note to a question
    },
};

