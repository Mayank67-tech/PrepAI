import React from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Auth/Login.jsx";
import SignUp from "./pages/Auth/SignUp.jsx";
import Dashboard from './pages/Home/Dashboard.jsx';
import InterviewPrep from './pages/InterviewPrep.jsx';
import LandingPage from './pages/LandingPage.jsx';
import { Toaster } from "react-hot-toast";
import UserProvider from './context/userContext.jsx';

function App() {
  return (
    <UserProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          
          <Route 
            path="/dashboard" 
            element={
                <Dashboard />
            } 
          />
          
          <Route 
            path="/interview-prep/:sessionId" 
            element={
                <InterviewPrep />
            } 
          />
        </Routes>

        <Toaster
          toastOptions={{
            style: { fontSize: "13px" },
            success: { icon: '✅' },
            error: { icon: '❌' },
          }}
        />
      </Router>
    </UserProvider>
  );
}

export default App;
