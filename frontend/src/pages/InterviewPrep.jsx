import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import moment from 'moment';
import { AnimatePresence, motion } from 'framer-motion';
import { LuCircleAlert, LuListCollapse, LuSparkles, LuCalendar, LuUser, LuBriefcase, LuTarget, LuFileText, LuMessageSquare } from 'react-icons/lu';
import { toast } from "react-hot-toast";
import axiosInstance from '../utils/axiosInstance';
import { API_PATHS } from '../utils/apiPaths';
import Navbar from '../components/Navbar';
import QuestionList from '../components/cards/QuestionList.jsx';

const InterviewPrep = () => {
  const { sessionId } = useParams();

  const [sessionData, setSessionData] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");

  const [openLearnMoreDrawer, setOpenLearnMoreDrawer] = useState(false);
  const [explanation, setExplanation] = useState(null);

  const [isLoading, setIsLoading] = useState(false);
  const [isUpdateLoader, setIsUpdateLoader] = useState(false);

  // Fetch session data by session id
  const fetchSessionDetailsById = async () => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.get(API_PATHS.SESSION.GET_ONE(sessionId));
      console.log(response);
      if (!response.status || response.status !== 200) {
        throw new Error("Failed to fetch session details");
      }
      if(response.status === 200 && response.data?.data){
        setSessionData(response.data.data);
      }

    } catch (error) {
      console.log(error);
      setErrorMsg(error.message || "Something went wrong while fetching session details");
      toast.error(error.message || "Failed to fetch session details");
    } finally {
      setIsLoading(false);
    }
  };

  // Generate Concept Explanation
  const generateConceptExplanation = async (question) => {
    if (!question || !question.question) return;
    setIsUpdateLoader(true);
    try {
      const response = await axiosInstance.post(API_PATHS.AI.GENERATE_EXPLANATION, { question: question.question });
      if (response.status === 200 && response.data.data) {
        setExplanation(response.data.data);
        setOpenLearnMoreDrawer(true);
        toast.success('Explanation generated!');
      } else {
        toast.error('Failed to generate explanation');
      }
    } catch (error) {
      toast.error('Failed to generate explanation');
    } finally {
      setIsUpdateLoader(false);
    }
  };

  // Pin Question
  const toggleQuestionPinStatus = async (question) => {
    if (!question || !question._id) return;
    setIsUpdateLoader(true);
    try {
      const response = await axiosInstance.patch(API_PATHS.QUESTION.PIN(question._id));
      if (response.status === 200) {
        setSessionData(prevState => {
          const updatedQuestions = prevState.questions.map(q => {
            if (q._id === question._id) {
              return { ...q, isPinned: !q.isPinned };
            }
            return q;
          });
          return { ...prevState, questions: updatedQuestions };
        });
        toast.success('Question pin status updated');
      } else {
        toast.error('Failed to update pin status');
      }
    } catch (error) {
      toast.error('Failed to update pin status');
    } finally {
      setIsUpdateLoader(false);
    }
  };

  // Upload More Questions
  const uploadMoreQuestions = async () => {
    if (!sessionData) return;
    setIsUpdateLoader(true);
    try {
      // Generate more questions using AI
      const aiResponse = await axiosInstance.post(API_PATHS.AI.GENERATE_QUESTIONS, {
        role: sessionData.role,
        experience: sessionData.experience,
        topicsToFocus: sessionData.topicsToFocus,
        numberOfQuestions: 5
      });
      if (aiResponse.status === 200 && aiResponse.data.data) {
        // Add these questions to the session
        const addResponse = await axiosInstance.post(API_PATHS.QUESTION.ADD_TO_SESSION, {
          sessionId: sessionId,
          questions: aiResponse.data.data
        });
        if (addResponse.status === 201) {
          toast.success('New questions added successfully!');
          await fetchSessionDetailsById();
        } else {
          toast.error('Failed to add new questions');
        }
      } else {
        toast.error('Failed to generate new questions');
      }
    } catch (error) {
      toast.error('Failed to add more questions');
    } finally {
      setIsUpdateLoader(false);
    }
  };

  useEffect(()=>{
    if(sessionId){
   fetchSessionDetailsById();
    }
   return () => {};
   
  },[]);
  



  return (
    <div className='min-h-screen bg-black text-amber-50'>
      <Navbar/>  
      <div className="container mx-auto px-4 py-8">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400"></div>
          </div>
        ) : sessionData ? (
          <div className="max-w-6xl mx-auto space-y-8">
            {/* Session Header Card */}
            <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 backdrop-blur-md rounded-2xl shadow-2xl p-8 border border-purple-400/30 hover:border-purple-400/50 transition-all duration-300">
              <div className="flex items-center mb-6">
                <LuSparkles className="text-3xl text-purple-400 mr-4" />
                <h1 className="text-3xl font-bold text-amber-50">Interview Preparation Session</h1>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Role */}
                <div className="bg-white/5 rounded-xl p-4 border border-white/10 hover:border-purple-400/30 transition-all duration-200">
                  <div className="flex items-center mb-2">
                    <LuBriefcase className="text-purple-400 mr-2" />
                    <span className="font-semibold text-purple-400">Role</span>
                  </div>
                  <div className="text-amber-50 font-medium">{sessionData.role}</div>
                </div>

                {/* Experience */}
                <div className="bg-white/5 rounded-xl p-4 border border-white/10 hover:border-purple-400/30 transition-all duration-200">
                  <div className="flex items-center mb-2">
                    <LuUser className="text-purple-400 mr-2" />
                    <span className="font-semibold text-purple-400">Experience</span>
                  </div>
                  <div className="text-amber-50 font-medium">{sessionData.experience}</div>
                </div>

                {/* Topics */}
                <div className="bg-white/5 rounded-xl p-4 border border-white/10 hover:border-purple-400/30 transition-all duration-200">
                  <div className="flex items-center mb-2">
                    <LuTarget className="text-purple-400 mr-2" />
                    <span className="font-semibold text-purple-400">Focus Topics</span>
                  </div>
                  <div className="text-amber-50 font-medium">{sessionData.topicsToFocus}</div>
                </div>

                {/* Description */}
                <div className="bg-white/5 rounded-xl p-4 border border-white/10 hover:border-purple-400/30 transition-all duration-200">
                  <div className="flex items-center mb-2">
                    <LuFileText className="text-purple-400 mr-2" />
                    <span className="font-semibold text-purple-400">Description</span>
                  </div>
                  <div className="text-amber-50 font-medium">{sessionData.description}</div>
                </div>

                {/* Created Date */}
                <div className="bg-white/5 rounded-xl p-4 border border-white/10 hover:border-purple-400/30 transition-all duration-200">
                  <div className="flex items-center mb-2">
                    <LuCalendar className="text-purple-400 mr-2" />
                    <span className="font-semibold text-purple-400">Created</span>
                  </div>
                  <div className="text-amber-50 font-medium">{moment(sessionData.createdAt).format('MMM DD, YYYY')}</div>
                </div>

                {/* Questions Count */}
                <div className="bg-white/5 rounded-xl p-4 border border-white/10 hover:border-purple-400/30 transition-all duration-200">
                  <div className="flex items-center mb-2">
                    <LuMessageSquare className="text-purple-400 mr-2" />
                    <span className="font-semibold text-purple-400">Questions</span>
                  </div>
                  <div className="text-amber-50 font-medium">{sessionData.questions?.length ?? 0} Questions</div>
                </div>
              </div>
            </div>

            {/* Questions List */}
            <div className="flex flex-col gap-4">
              <div className="flex justify-end mb-2">
                <button
                  onClick={uploadMoreQuestions}
                  disabled={isUpdateLoader}
                  className="flex items-center gap-2 px-5 py-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold shadow hover:from-purple-600 hover:to-pink-600 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  <LuSparkles className="text-lg" />
                  {isUpdateLoader ? 'Loading...' : 'Generate More Questions'}
                </button>
              </div>
              <QuestionList
                questions={sessionData.questions}
                onExplain={generateConceptExplanation}
                onPin={toggleQuestionPinStatus}
                onNote={() => {/* TODO: open note modal */}}
                pinnedIds={sessionData.questions?.filter(q => q.isPinned).map(q => q._id) || []}
              />
            </div>
          </div>
        ) : errorMsg ? (
          <div className="max-w-2xl mx-auto">
            <div className="bg-red-500/10 backdrop-blur-md rounded-2xl shadow-xl p-8 border border-red-400/30 text-center">
              <div className="text-red-400 text-6xl mb-4">⚠️</div>
              <h2 className="text-2xl font-bold text-red-400 mb-2">Error Loading Session</h2>
              <p className="text-red-300">{errorMsg}</p>
            </div>
          </div>
        ) : (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-xl p-8 border border-purple-400/30 text-center">
              <LuSparkles className="text-6xl text-purple-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-amber-50 mb-2">Session Not Found</h2>
              <p className="text-amber-50/70">The session you're looking for doesn't exist or has been removed.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
  
};

export default InterviewPrep;
