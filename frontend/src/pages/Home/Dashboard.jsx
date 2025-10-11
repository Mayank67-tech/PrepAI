import React, { useState, useEffect, useContext } from 'react'
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import { toast } from 'react-hot-toast';
import { UserContext } from '../../context/userContext';
import ProfileInfoCard from '../../components/ProfileInfoCard';
import Navbar from '../../components/Navbar';
function Dashboard() {
  const navigate = useNavigate();
  const [openCreateSessionModal, setOpenCreateSessionModal] = useState(false);
  const [sessions, setSessions] = useState([]); 
  // const [openDeleteAlert, setOpenDeleteAlert] = useState(false);
  const [newSessionTitle, setNewSessionTitle] = useState("");
  const [newSessionDescription, setNewSessionDescription] = useState("");
  const [newSessionTopics, setNewSessionTopics] = useState("");
  const [newSessionExperience, setNewSessionExperience] = useState("");
  const [loading, setLoading] = useState(false);
  const user = useContext(UserContext)?.user;

  const fetchSessions = async () => {
    try { 
      setLoading(true);
      const res = await axiosInstance.get(API_PATHS.SESSION.GET_ALL);
      // console.log( res.data);
      setSessions(res.data.data || []);
    } catch (error) {
      toast.error("Error fetching sessions");
      console.error("Error fetching sessions:", error);
    } finally {
      setLoading(false);
    }
  }

  const createSession = async () => {
    if (!newSessionTitle ) {
      toast.error("Session title is required");
      return;
    }
    if(!newSessionExperience) {
      toast.error("Experience is required");
      return; 
    }
    try {
      setLoading(true);

      const aiResponse = await axiosInstance.post(API_PATHS.AI.GENERATE_QUESTIONS, {
        role: newSessionTitle,  
        experience: newSessionExperience,
        topicsToFocus: newSessionTopics,
        numberOfQuestions: 10,
      });
      console.log("AI Response:", aiResponse.data);
      console.log("Generated Questions:", aiResponse.data.data);
      const generatedQuestions = aiResponse.data.data || [];
      const res = await axiosInstance.post(API_PATHS.SESSION.CREATE, {
        role: newSessionTitle,
        experience: newSessionExperience,
        topicsToFocus: newSessionTopics,
        description: newSessionDescription,
        questions: generatedQuestions,
      });
      console.log(res);
      toast.success("Session created!");
      if(res.data?.data?._id){
        navigate(`/interview-prep/${res.data.data._id}`); 
      }
    } catch(error) {
      toast.error("Error creating session");
      console.error("Error creating session:", error);
    } finally {
      setLoading(false);
    }
  }

  const deleteSession = async (sessionId) => {
    try {
      setLoading(true);
      await axiosInstance.delete(API_PATHS.SESSION.DELETE(sessionId));
      toast.success("Session deleted");
      fetchSessions();
    } catch (error) {
      toast.error("Error deleting session");
      console.error("Error deleting session:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchSessions();
  }, []);

  return (
    <div>
      {/* <div className="p-4 text-white">
        <div className="container mx-auto px-4 pt-6 relative z-10  ">
          <div className="flex justify-between  items-center">
            <button onClick={()=>navigate("/")}  className="cursor-pointer">
                <div className='text-2xl black border px-1 font-bold'>PrepAI</div>
                </button>
            { user ? 
              ( <ProfileInfoCard/>  )
              : null}
          </div>
        </div>
      </div> */}
      <Navbar />
      {/* Create Session Modal */}
      
      {openCreateSessionModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-lg border border-gray-200 animate-fadeIn relative">
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-black text-xl font-bold focus:outline-none"
              onClick={() => setOpenCreateSessionModal(false)}
              aria-label="Close"
            >&#10005;</button>
            <h2 className="text-xl font-bold mb-1 text-gray-900">Start a New Interview Journey</h2>
            <p className="text-xs text-gray-500 mb-6">Fill out a few quick details and unlock your personalized set of interview questions!</p>
            <form onSubmit={e => { e.preventDefault(); createSession(); }}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Target Role</label>
                <input
                  className="w-full border border-gray-300 rounded-md p-2 text-base focus:outline-none focus:ring-2 focus:ring-purple-400 placeholder-gray-400"
                  placeholder="e.g., Frontend Developer, UI/UX Designer, etc."
                  value={newSessionTitle}
                  onChange={e => setNewSessionTitle(e.target.value)}
                  maxLength={50}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Years of Experience</label>
                <input
                  className="w-full border border-gray-300 rounded-md p-2 text-base focus:outline-none focus:ring-2 focus:ring-purple-400 placeholder-gray-400"
                  placeholder="e.g., 1 year, 3 years, 5+ years"
                  value={newSessionExperience}
                  onChange={e => setNewSessionExperience(e.target.value)}
                  maxLength={30}
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Topics to Focus On</label>
                <input
                  className="w-full border border-gray-300 rounded-md p-2 text-base focus:outline-none focus:ring-2 focus:ring-purple-400 placeholder-gray-400"
                  placeholder="(Comma-separated, e.g., React, Node.js, MongoDB)"
                  value={newSessionTopics}
                  onChange={e => setNewSessionTopics(e.target.value)}
                />
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <input
                  className="w-full border border-gray-300 rounded-md p-2 text-base focus:outline-none focus:ring-2 focus:ring-purple-400 placeholder-gray-400"
                  placeholder="(Any specific goals or notes for this session)"
                  value={newSessionDescription}
                  onChange={e => setNewSessionDescription(e.target.value)}
                />
              </div>
              <button
                type="submit"
                className="w-full py-3 rounded-md bg-black text-white font-semibold text-base hover:bg-gray-900 transition-all cursor-pointer"
                disabled={loading} onClick={createSession} 
              >{loading ? 'Creating...' : 'Create Session'}</button>
            </form>
          </div>
        </div>  
      )}
    
      {/* Sessions List */}
      <div className="mt-4 w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="text-center text-lg text-gray-500 w-full col-span-3">Loading...</div>
        ) : sessions.length === 0 ? (
          <div className="text-center text-lg text-gray-400 w-full col-span-3">No sessions found.</div>
        ) : (
          sessions.map((session) => (
            <div key={session._id} onClick={() => navigate(`/interview-prep/${session._id}`)} className="cursor-pointer">
              <div className="rounded-2xl border border-gray-200 bg-[#f8fdfc] shadow flex flex-col p-6 w-full">
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-br from-green-200 to-blue-100 font-bold text-2xl text-gray-700">
                    {session.role?.slice(0,2).toUpperCase()}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-lg text-gray-800">{session.role}</span>
                      <span className="text-xs text-gray-500">{session.topicsToFocus || ''}</span>
                    </div>
                    <div className="text-gray-500 text-sm mb-1">{session.description || <span className='italic text-gray-400'>No description</span>}</div>
                    <div className="flex flex-wrap gap-2 mt-1">
                      <span className="bg-gray-100 rounded-full px-3 py-1 text-xs text-gray-700 border">Experience: {session.experience || 'N/A'}</span>
                      <span className="bg-gray-100 rounded-full px-3 py-1 text-xs text-gray-700 border">Q&A:{session.questions ? session.questions.length : (session.qaCount || 0)}</span>
                      <span className="bg-gray-100 rounded-full px-3 py-1 text-xs text-gray-700 border">Last Updated: {session.updatedAt ? new Date(session.updatedAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : 'N/A'}</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation(); 
                    deleteSession(session._id);
                  }}
                  className="mt-4 px-4 py-2 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-lg font-semibold shadow hover:from-red-600 hover:to-pink-600 transition-all"
                >
                  Delete Session
                </button>
              </div>
            </div>
          ))
        )}
      </div>
      {/*  Create Session Button  */}
      <div className="fixed bottom-8 right-8 z-50 group">
        <button
          onClick={() => setOpenCreateSessionModal(true)}
          className="bg-gradient-to-r from-purple-500 via-pink-500 to-yellow-500 text-white px-7 py-4 rounded-full shadow-xl hover:scale-110 transition-transform duration-200 focus:outline-none focus:ring-4 focus:ring-purple-300 flex items-center gap-2 text-lg font-bold group-hover:bg-gradient-to-l group-hover:from-yellow-400 group-hover:to-purple-600"
        >
          <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"></path></svg>
          Create Session
        </button>
        <div className="absolute bottom-full right-0 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
          <div className="bg-black text-white text-xs rounded px-3 py-1 shadow-lg">Start a new interview prep session</div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard