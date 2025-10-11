import React, { useContext } from 'react';
import { UserContext } from '../context/userContext.jsx';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../utils/axiosInstance.js';
import { API_PATHS } from '../utils/apiPaths.js';
import { LuLogOut, LuUser } from 'react-icons/lu';

function ProfileInfoCard() {
  const {user,clearUser} = useContext(UserContext);
  const navigate= useNavigate();

  const handleLogout=async ()=>{
    await axiosInstance.post(API_PATHS.AUTH.LOGOUT)
      .then((res)=>{
        if(res.status === 200){
          clearUser();
          navigate("/");
        }
      }).catch((err)=>{
        console.error("Logout failed", err);
      })
  }
  return (
   
      <div className="flex items-center bg-white/10 backdrop-blur-md rounded-full px-4 py-2 border border-purple-400/30 hover:border-purple-400/50 transition-all duration-300">
        <div className="relative">
          {user.avatar ? (
            <img
              src={user.avatar}
              alt="user avatar"
              className="w-8 h-8 rounded-full mr-3 border-2 border-purple-400/30"
            />
          ) : (
            <div className="w-8 h-8 bg-purple-400/20 rounded-full mr-3 flex items-center justify-center border-2 border-purple-400/30">
              <LuUser className="text-purple-400 text-sm" />
            </div>
          )}
        </div>
        <div className="mr-3">
          <div className="text-amber-50 font-medium text-sm">{user.fullName}</div> 
          <button
            onClick={handleLogout}
            className="text-xs text-red-400 hover:text-red-300 cursor-pointer flex items-center transition-colors duration-200"    
          >
            <LuLogOut className="mr-1 text-xs" />
            Logout
          </button>
        </div>
      </div>
    
    
  )
}

export default ProfileInfoCard