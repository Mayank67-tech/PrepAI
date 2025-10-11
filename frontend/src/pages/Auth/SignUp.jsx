import React from 'react'
import { useState } from 'react';
import {Eye} from 'lucide-react'
import { EyeOff } from 'lucide-react';
import ProfilePhotoSelector from '../../components/ProfilePhotoSelector';
import { validateEmail } from '../../utils/helper';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

function SignUp({setCurrentPage}) {
  const [profilePic,setProfilePic]=useState("");
  const [preview, setPreview] = useState(null);
  const [fullName,setFullName]=useState("");
  const [email,setEmail] = useState("");
  const [password,setPassword] =useState("");
  const [showPassword ,setShowPassword]=useState(false);
  const [error,setError] = useState("");
  const navigate = useNavigate();

  const handleFormSubmit= async (e)=>{
    e.preventDefault();

    if(!fullName){
      setError("Please enter fullname.");
      return;
    }
    
    if(!validateEmail(email)){
      setError("Please eneter a  valid email address.");
      return;
    }
    if(!password || password.length<8){
      setError("Please enter a valid password");
      return;
    }

    try{
      const formData = new FormData();
      formData.append("fullName", fullName);
      formData.append("email", email);
      formData.append("password", password);
      if (profilePic) {
        formData.append("avatar", profilePic);
      }
      const response = await axiosInstance.post(API_PATHS.AUTH.REGISTER, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if(response.status === 201){
        toast.success("Signup successful! You can now log in.");
        navigate("/");
      }
    }
    



  }

  return (
    <div className="p-2 ">
      <div >
        <p className = "font-[800] text-3xl">Create your account</p>
      </div>
<form onSubmit={handleFormSubmit} className="flex flex-col gap-4 " >
      
      <ProfilePhotoSelector image={profilePic} setImage={setProfilePic} preview={preview} setPreview={setPreview} />

       <label className="flex flex-col text-sm font-medium text-gray-700">
          Fullname
          <input
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="John Doe"
            type="name"
            className="mt-1 px-3 py-2 rounded-md border border-gray-300
             focus:outline-none focus:ring-2 focus:ring-purple-400 text-base  caret-black hover:caret-black hover:text-black"
            aria-label="fullname"
            required

          />
        </label>

         <label className="flex flex-col text-sm font-medium text-gray-700">
          Email
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="john@example.com"
            type="email"
            className="mt-1 px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400 text-base  caret-black hover:caret-black hover:text-black"
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
            className="mt-1 px-3 py-2 pr-10 rounded-md border cursor-text
             border-gray-300 focus:outline-none focus:ring-2
              focus:ring-purple-400 text-base w-full caret-black hover:caret-black hover:text-black"
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

       {error && <p className='text-red-600'>{error}</p>}
      <button type="submit"
        className="mt-2 py-2 px-6 rounded-full font-bold text-white bg-gradient-to-r from-purple-500 via-pink-500 to-yellow-500 shadow-lg
         hover:from-purple-600 hover:via-pink-600 hover:to-yellow-400 transition-all duration-200
          focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 hover:cursor-pointer ">
        SIGN UP
      </button>
     <div className="flex text-sm">
      <p>
        Already Have an account? 
      </p>
      <button
      className='ml-1 text-purple-500 hover:text-purple-800 hover:underline'
      onClick={()=>{
        setCurrentPage("login")
      }}
      >
        Login
      </button>
     </div>
      
</form>
      
    </div>
  )
}

export default SignUp