import react, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { ApiConnect } from "../services/ApiConnect";
import { setLoading, setReset_pass_form } from "../slices/authSlice";
import { useDispatch } from "react-redux";
import { auth } from "../services/Apis";
import { FaArrowLeft } from "react-icons/fa";

const Reset_complete= ()=>{
const dispatch= useDispatch();
    const {reset_pass_form,loading,email}= useSelector((state)=>state.auth);
    const [successfully_changed,Setsuccessfully_changed]=useState(false);
    
async function reset_pass(){
     try{
        
          dispatch(setLoading(true));
        const response= await ApiConnect("POST",auth.RESETPASSWORD_API,reset_pass_form); 
        dispatch(setLoading(false));
        Setsuccessfully_changed(true);
        }
        catch(error){
                                toast.error("Error happen");
        dispatch(setLoading(false));
        }
};
useEffect(()=>{reset_pass()},[]);
    return (
        loading?<div className=" text-[20px] mx-auto text-white">Loading...</div>:
        successfully_changed?
        <div>
         <div className="flex text-white flex-col items-center mt-[10%] gap-6 mx-auto text-center justify-center max-w-[500px]">
          <h1 className="font-bold text-[35px]">Reset complete!</h1>
          <p className="opacity-75">{`
           All done! We have send an email to ${email} to confirm`}</p>

            <Link to = {"/login"}
            className="text-center text-[15px] w-full py-3 rounded-md 
            font-bold hover:scale-95 transition-all duration-200 bg-yellow-50 text-black"
          
          >
            Return to Login
          </Link>
        </div>
        </div>:
       <div>
         <div className="flex text-white flex-col items-center mt-[10%] gap-6 mx-auto text-center justify-center max-w-[500px]">
          <h1 className="font-bold text-[35px]">Try again!</h1>
          <p className="opacity-75">
           Ops link expired! Please try again.</p>

            <Link to = {"/reset_pass"}
            className="text-center text-[15px] w-full py-3 rounded-md max-w-[100px]
            font-bold hover:scale-95 transition-all duration-200 bg-yellow-50 text-black"
          
          >
            Back
          </Link>
           <Link to = {"/login"}
            className="flex items-center flex-row gap-2 justify-center text-[15px] "
          >
           <FaArrowLeft/>
           <p>
            Back to Login
            </p>
          </Link>
        </div>
        </div>  )
}
export default Reset_complete;