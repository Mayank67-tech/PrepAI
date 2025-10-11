import React from 'react'
import {useState} from 'react'
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import SignUp from './SignUp';
import { validateEmail } from '../../utils/helper';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
function Login({setCurrentPage}) {

  const [email,setEmail]=useState("");
  const [password,setPassword] = useState("");
  const [error,setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  const navigate =useNavigate();

  const handleLogin=async(e) =>{
    e.preventDefault();

    if(!validateEmail(email)){
      setError("Enter a valid email address");
      return;
    }

    if(!password || password.length < 8){
      setError("Enter a valid password");
      return;
    }
    
    //login api call
    try{
      const response = await axiosInstance.post(API_PATHS.AUTH.LOGIN,{
        email,
        password,
      });
      if(response.status === 200){
        navigate("/dashboard");
      }
    }
    catch(error){
      if(error.response && error.response.data.message){
        setError(error.response.data.message);
      }
      else{
        setError("Something went wrong. Please try again");
      }
    }


  
  }
  return (
    <div className="p-2">
      <div >
        <p className = "font-[800] text-3xl">Welcome Back</p>
        <p className="text-xs">Please enter your details to login</p>
      </div>

      <form onSubmit={handleLogin} className="flex flex-col gap-4 mt-6">
        <label className="flex flex-col text-sm font-medium text-gray-700">
          Email
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="john@example.com"
            type="email"
            className="mt-1 px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400 text-base  "
            aria-label="email"
            required

          />
        </label>
      
      <label className="flex flex-col text-sm font-medium text-gray-700">
        Password
        <div className="relative">
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Min 8 Characters"
            type={showPassword ? "text" : "password"}
            className="mt-1 px-3 py-2 pr-10 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400 text-base w-full"
            required
          />
          <button
            type="button"
            className="absolute inset-y-0 right-2 flex items-center text-gray-400 hover:text-purple-500"
            onClick={() => setShowPassword((prev) => !prev)}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>
      </label>


      {error && <p className='text-red-500 text-sm'>{error}</p>}

      <button type="submit"
        className="mt-2 py-2 px-6 rounded-full font-bold text-white bg-gradient-to-r from-purple-500 via-pink-500 to-yellow-500 shadow-lg
         hover:from-purple-600 hover:via-pink-600 hover:to-yellow-400 transition-all duration-200
          focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 hover:cursor-pointer ">
        LOGIN
      </button>
     <div className="flex text-sm">
      <p>
        Don't have an account? 
      </p>
      <button
      className='ml-1 text-purple-500 hover:text-purple-800 hover:underline'
      onClick={()=>{
        setCurrentPage("signup")
      }}
      >
        SignUp
      </button>
      </div>
      </form>
    </div>
  )
}

export default Login