# AI Interview Preparation Platform

A full-stack web application to help users prepare for technical interviews using AI-generated questions, explanations, and session management.

## Features

- **User Authentication:** Secure sign up and login.
- **Interview Sessions:** Create sessions based on role, experience, and focus topics.
- **AI-Generated Questions:** Generate and add new questions to sessions using AI.
- **Concept Explanations:** Get AI-powered explanations for any question.
- **Pin & Manage Questions:** Pin important questions, add notes, and manage your session.
- **Modern UI:** Responsive, modern interface built with React and Tailwind CSS.

## Tech Stack

- **Frontend:** React, Vite, Tailwind CSS, Framer Motion, React Icons
- **Backend:** Node.js, Express.js, MongoDB
- **AI Integration:** OpenAI or similar LLM API (configurable)

## Project Structure

```
AI_Interview_Preperation_Platform/
├── backend/
│   ├── controllers/         # API controllers
│   ├── middlewares/        # Express middlewares
│   ├── models/             # Mongoose models
│   ├── public/             # Static/public files
│   ├── routes/             # Express routes
│   ├── utils/              # Utility functions
│   ├── config/             # DB and other configs
│   ├── server.js           # Entry point
│   └── package.json        # Backend dependencies
└── frontend/
    ├── src/
    │   ├── components/      # React components
    │   ├── context/         # React context
    │   ├── pages/           # App pages
    │   ├── utils/           # Frontend utilities
    │   └── assets/          # Images and assets
    ├── public/              # Static files
    ├── index.html           # Main HTML
    ├── package.json         # Frontend dependencies
    └── vite.config.js       # Vite config
```

## Getting Started

### Prerequisites
- Node.js (v16+ recommended)
- MongoDB (local or cloud)

### Backend Setup
1. Navigate to the backend folder:
   ```sh
   cd backend
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Configure environment variables (e.g., MongoDB URI, AI API keys) in a `.env` file.
4. Start the backend server:
   ```sh
   npm start
   ```

### Frontend Setup
1. Navigate to the frontend folder:
   ```sh
   cd frontend
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Start the frontend dev server:
   ```sh
   npm run dev
   ```
4. Open [http://localhost:5173](http://localhost:5173) in your browser.

## Environment Variables
- **Backend:**
  - `MONGODB_URI` - MongoDB connection string
  - `OPENAI_API_KEY` - (or similar) for AI features
  - Other relevant keys as needed

## License

This project is for educational and personal use. See `LICENSE` for more details.

---

**Contributions welcome!**
