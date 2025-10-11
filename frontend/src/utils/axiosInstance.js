import axios from "axios";
import { BASE_URL } from "./apiPaths";


const axiosInstance = axios.create({
    baseURL: BASE_URL,
    //milli sec the client should wait for a response from the server before giving up.
    timeout: 80000,
    headers:{
        //  Backend sends the response (often in JSON)
        "Content-Type":"application/json",
         //  Frontend sends the request (with JSON body)
        "Accept": "application/json"
    },
    withCredentials: true // Send cookies with requests
});

// response interceptor
axiosInstance.interceptors.response.use(
    (response)=>{
        return response;
    },
    (error)=>{
        // if(error.response && error.response.status === 401){
        //     //redirect to login page 
        //     window.location.href = "/";
           
        // }
          if(error.response && error.response.status === 500){
          console.log("Server error. Please try again later");
        }
        else if(error.code === "ECONNABORTED"){
            console.log("Request timeout. Please try again");
        }
        return Promise.reject(error);

    }
);
export default axiosInstance;