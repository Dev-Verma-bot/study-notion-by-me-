import react, { useState } from "react";
import { Link } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { getPasswordResetToken } from "../services/operations/authApi";
const Forgot_pass= ()=>{
const dispatch= useDispatch();
const [email_sent,set_email_sent]= useState(false);
const loading = useSelector((state)=>state.auth).loading;

    const submit_handler= (event)=>{
        event.preventDefault();
        
        dispatch(getPasswordResetToken(form_data.email,set_email_sent))
        set_email_sent(true);
        // dispatch(Get_Password_reset_token(form_data.email,set_email_sent))
        
    }

    const form_handler = (event)=>{
        const {type,name,checked,value}= event.target;
        set_form_data((prev_data)=>{
            return {...prev_data,[name]:type==="checkbox"?checked:value}
        })
    }
    const [form_data,set_form_data]= useState({email:""});
    return (
        <div>{
            loading?(<div className="text-white">Loading ...</div>):(
                email_sent?
         <div className=" flex text-white flex-col items-center mt-[10%] gap-6 mx-auto text-center justify-center max-w-[500px]">
                <div className="font-bold text-[35px]">Check email</div>
                <p className="opacity-75">
                    {`We have sent reset email to ${form_data.email}`}
                </p>
             <button type="submit" onClick={()=>{set_email_sent(false)}} className=" py-2 px-4 cursor-pointer font-semibold bg-yellow-50
                 text-black rounded-md border-none hover:scale-95 transition-all duration-200 ">Resend Email</button>
             
                <Link to={"/login"} className="flex flex-row items-center gap-1">
                <FaArrowLeft />
                Back to login</Link>
            </div> :
        <div className=" flex text-white flex-col items-center mt-[10%] gap-6 mx-auto text-center justify-center max-w-[500px]">
                <div className="font-bold text-[35px]">Reset your password</div>
                <p className="opacity-75">
                    Have no fear. We will email you instructions to reset your password.If you dont 
                    have access to your email we can try account recovery. 
                </p>
                <form onSubmit={submit_handler}>
                <label htmlFor="Address">Email address <span className="text-yellow-100">*</span></label>
                <br/>
                <br/>
                <input  
                placeholder="Enter email address "
                type="email"
                onChange={form_handler}
                name="email"
                id="Address"
                value={form_data.email}
                className="bg-richblack-900 text-white border-richblack-400 border rounded-sm 
                    text-center p-3"
                ></input>
                <br/>
                <br/>
                <button type="submit" className=" py-2 px-4 cursor-pointer font-semibold bg-yellow-50
                 text-black rounded-md border-none hover:scale-95 transition-all duration-200 ">Reset Password</button>
                 </form>
                <Link to={"/login"} className="flex flex-row items-center gap-1">
                <FaArrowLeft />
                Back to login</Link>
            </div>
           
             
           
            )
                }
            </div>
    )
}
export default Forgot_pass;