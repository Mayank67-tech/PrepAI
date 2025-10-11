import React from 'react'
import { useState } from 'react'
import { features } from '../utils/data.js'
import heroimage from '../assets/heroimage.png'
import { useNavigate } from 'react-router-dom'
import {LuSparkles} from 'react-icons/lu'
import Login from './Auth/Login.jsx'
import SignUp from './Auth/SignUp.jsx'
import Modal from '../components/Modal.jsx'
import { useContext } from 'react'
import { UserContext } from '../context/userContext.jsx'
import ProfileInfoCard from '../components/ProfileInfoCard.jsx'

function LandingPage() {
  const {user} = useContext(UserContext);

    const navigate=useNavigate();
     
    const [openAuth,setOpenAuth] = useState(false);
    const [currentPage,setCurrentPage] = useState("login");

   const handleOnClickLoginSignup= function (){
    setOpenAuth(!openAuth);
    }
    const handleOnCLickGetStarted = function (){
      if(user){
        navigate("/dashboard");
      } else {
       handleOnClickLoginSignup();
      }
    }


  return (
    <div className="text-amber-50">
        
            
            {/* header */}
            <div className="container mx-auto px-4 pt-6 pb-[200px] relative z-10  ">
                <div className="flex justify-between  items-center">
                  <button onClick={()=>navigate("/")}  className="cursor-pointer">
                <div className='text-2xl black border px-1 font-bold'>PrepAI</div>
                </button>
               { user ? 
               ( <ProfileInfoCard/>  )
               : ( <button onClick={handleOnClickLoginSignup} 
                className='bg-purple-700 p-1.5 px-3 rounded-full text-sm text-semibold
                hover:bg-violet-600 hover:cursor-pointer '>Login/SignUp</button> )}
            </div>
            </div>

            {/* Centered section */}
            <div className="flex flex-col items-center justify-center gap-3">
                <div className="flex items-center mb-2">
                    <div className="text-xl flex items-center border-purple-500 border-2 border-solid bg-purple animate-pulse px-2 rounded-full ">
                        <LuSparkles className="mr-2" /> AI Powered
                    </div>
                </div>
                <div className='text-6xl text-center'>
                    Master your Interview prep with <span className="bg-gradient-to-r from-purple-500 via-pink-500 to-yellow-500 bg-clip-text text-transparent animate-gradient-x font-bold mr-1 pl-1 py-2">AI-Powered </span>Learning
                </div>
                {/* Description and Get Started button */}
                <div className="mt-8 flex flex-col items-center">
                    <p className="max-w-4xl text-lg text-amber-50 text-center mb-6">
                        Get role-specific questions, expand answers when you need them, dive deeper into concepts, and organize everything your way. From preparation to mastery — your ultimate interview toolkit is here.
                    </p>
                    <button className="bg-gray-800 text-white font-semibold rounded-full 
                    px-6 py-3 my-3 text-base hover:bg-neutral-800 transition-all hover:cursor-pointer  " onClick={handleOnCLickGetStarted}>
                        Get Started
                    </button>
                </div>
            </div>

          <div className=' flex justify-center items-center mt-36 '>
            <section>
              <img
                src={heroimage}
                alt="hero image"
                className="w-full max-w-s sm:max-w-l md:max-w-xl lg:max-w-3xl xl:max-w-6xl"
              />
            </section>
          </div>
         <div className='flex justify-center align-center  text-3xl font-bold py-20'>
            Feautres that boost your learning
         </div>

         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 px-4 max-w-6xl mx-auto pb-16">
            {features.map((item) => (
             <div key={item.id} className="bg-white/10 border border-purple-400 shadow-lg hover:shadow-2xl transition-shadow duration-300 max-w-md w-full py-6 px-6 flex flex-col rounded-3xl backdrop-blur-md hover:scale-[1.03] hover:border-purple-500 border-glow">
                <div className='font-bold text-xl text-purple-400 mb-2 flex items-center'>
                  {item.title}
                </div>
                <div className="text-amber-50 text-base opacity-90">{item.description}</div>
            </div>
            ))}
         </div>
{/* todo
add footer href */}
         <footer className="w-full bg-gradient-to-r from-purple-900 via-purple-800 to-purple-900 py-8 mt-8">
           <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between text-amber-50">
             <div className="text-lg font-bold mb-2 md:mb-0">PrepAI &copy; {new Date().getFullYear()}</div>
             <div className="flex gap-6 text-sm opacity-80">
               <a href="#" className="hover:text-purple-300 transition">Privacy Policy</a>
               <a href="#" className="hover:text-purple-300 transition">Terms of Service</a>
               <a href="#" className="hover:text-purple-300 transition">Contact</a>
             </div>
           </div>
         </footer>
{/*  
 Modal */}

 <Modal
 isOpen = {openAuth}
 onClose={()=>{
    setOpenAuth(false);
    setCurrentPage("login");
 }}
 hideHeader
 >

    <div>
        {currentPage === "login" &&(
            <Login setCurrentPage={setCurrentPage} />
        )}
         {currentPage === "signup" &&(
            <SignUp setCurrentPage={setCurrentPage} />
        )}
    </div>

 </Modal>

        
    </div>
  )
}

export default LandingPage