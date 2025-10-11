import React, { useContext } from 'react'
import ProfileInfoCard from './ProfileInfoCard'
import { useNavigate } from 'react-router-dom'
import { UserContext } from '../context/userContext'
import { LuSparkles, LuBrain } from 'react-icons/lu'


function Navbar() {
    const navigate = useNavigate();
    const user=useContext(UserContext).user;
  return (
      <div className="sticky top-0 z-50 bg-black/80 backdrop-blur-md border-b border-purple-400/20 text-amber-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            {/* Logo Section */}
             <button onClick={()=>navigate("/")}  className="cursor-pointer">
                <div className='text-2xl black border px-1 font-bold'>PrepAI</div>
                </button>

            {/* User Section */}
            <div className="flex items-center">
              { user ? 
                ( <ProfileInfoCard/>  )
                : (
                  <button 
                    onClick={() => navigate("/")}
                    className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold px-6 py-2 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-purple-500/25"
                  >
                    Get Started
                  </button>
                )
              }
            </div>
          </div>
        </div>
      </div>
  )
}

export default Navbar
