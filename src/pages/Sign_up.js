import React, { useState } from "react";
import frame from "../assets/Images/frame.png"
import login_img from "../assets/Images/Instructor.png"
import { MdOutlineRemoveRedEye } from "react-icons/md";
import { LuEyeOff } from "react-icons/lu";
import { useNavigate } from "react-router-dom";
import { setEmail, setSign_up_data } from "../slices/authSlice";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { sendOtp } from "../services/operations/authApi";
const Sign_up=({Seen1 ,SetSeen1,Seen2,SetSeen2})=>{
    
      const dispatch = useDispatch();
const {signupData} = useSelector((state)=>state.auth);
    const navigate = useNavigate();

async function Submit_handler(event) {
    event.preventDefault(); // Prevent page reload

    
    const final_data={
        ...form_data,account_type:curr_value,
    }
       
    dispatch(setSign_up_data(final_data));
    // dispatch otp send function 
          
    dispatch(sendOtp(final_data.Email_add, navigate))
    

}

    function form_handler(event){
        const {type,name,checked,value}=event.target;

        Setform_data(
             (prev_data)=>{
             return {...prev_data,[name]:type==="checkbox"?checked:value};
            }
        );
        } 
        
const [curr_value,Setcurr_value]=useState('Student');
    const [form_data,Setform_data]=useState({First_name:"",Last_name:"",Email_add:"",Password:"",cnfrm_password:""});
        const [format1,Setformat1]=useState("Password")
        const [format2,Setformat2]=useState("Password")
            return(        
        <div>
            <div className="text-white grid grid-cols-2  justify-between pt-10 max-w-[1080px] mx-auto">
                <form onSubmit={Submit_handler} className="relative w-[80%] mt-5">
                    <h1 className=" text-[20px] max-w-[300px] font-bold pb-2">Join the millions learning to code with StudyNotion for free</h1>
                  
                    <p1 className=" opacity-65"> Build Skills for today, tomorrow, and beyond.</p1>
                    <br/>
                    <p2 className="text-blue-500 italic">Education to future-proof your career.</p2>
                    <br/>
                    <br/>
                    <div className="cursor-pointer  flex flex-row gap-1 bg-slate-800 rounded-full max-w-[182px] py-1 pl-1">
                        <div onClick={()=>{
                            Setcurr_value("Student");
                        }} className={`${curr_value==="Student"? "py-2 px-3 text-white bg-black rounded-full":"py-2 px-3  bg-slate-800 text-gray-500 rounded-full" }`}>Student</div>
                        <div onClick={()=>{
                            Setcurr_value("Instructor");
                        }} className={`${curr_value==="Instructor"? "py-2 px-3 text-white bg-black rounded-full":"py-2 px-3  bg-slate-800 text-gray-500 rounded-full" }`}>Instructor</div>
                        </div>
                    <br/>
                    <div className="flex flex-row ">
                        <div>
                    <label htmlFor="First_name">First Name <span className="text-red-700">'</span></label>
                     <input
                    type="text"
                    onChange={form_handler}
                    placeholder="Enter first name"
                    name="First_name"
                    id="First_name"
                    value={form_data.First_name}
                    className="bg-richblack-800 w-[95%] max-w-[90%] p-3 border border-gray-600 bg-slate-800 rounded-md
                     focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent"
                    />
                    </div>
        
                    <div>
                    <label htmlFor="Last_name">Last Name <span className="text-red-700">'</span></label>
                    <input
                    type="text"
                    onChange={form_handler}
                    placeholder="Enter Last Name"
                    name="Last_name"
                    id="Last_name"
                    value={form_data.Last_name}
                    className="bg-richblack-800 w-[95%] max-w-[90%] p-3 border border-gray-600 bg-slate-800 rounded-md
   focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent"
                    />
                    </div>
                    </div>
                    <br/>
                    <label htmlFor="Address">Enter Address <span className="text-red-700">'</span></label>
                     <input
                    type="text"
                    onChange={form_handler}
                    placeholder="Enter email address"
                    name="Email_add"
                    id="Address"
                    value={form_data.Email_add}
                    className="bg-richblack-800 w-[95%] p-3 border border-gray-600 bg-slate-800 rounded-md
                     focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent"
                    />
                
                <div className="pt-5 grid grid-cols-2">
                                  <div className="relative">{
                                            Seen1&&<MdOutlineRemoveRedEye onClick={()=>{SetSeen1(false);
                                                Setformat1("Password");
                                            }
                                            } className="text-gray-400 absolute top-10 right-[40px] cursor-pointer "/>
                        
                                            }
                                            {
                                                
                                            !Seen1&&<LuEyeOff  onClick={()=>{SetSeen1(true);
                                                Setformat1("text");
                                            }} className="text-gray-400 absolute top-10 right-[40px] cursor-pointer "/>
                                
                                            }
                                            
                                            <label htmlFor="Password"> Password <span className="text-red-700">'</span></label>
                                            <input
                                            type={format1}
                        
                                            onChange={form_handler}
                                            
                                            placeholder="Passward"
                                            name="Password"
                                            id="Password"
                                            value={form_data.Password}
                                            className="bg-richblack-800 w-[95%] max-w-[90%] p-3 border border-gray-600 bg-slate-800 rounded-md
                           focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent"
                                            />
                        
                            </div>
                            <div className="relative">{
                                            Seen2&&<MdOutlineRemoveRedEye onClick={()=>{SetSeen2(false);
                                                Setformat2("Password");
                                            }
                                            } className="text-gray-400 absolute top-10 right-[40px] cursor-pointer "/>
                        
                                            }
                                            {
                                                
                                            !Seen2&&<LuEyeOff  onClick={()=>{SetSeen2(true);
                                                Setformat2("text");
                                            }} className="text-gray-400 absolute top-10 right-[40px] cursor-pointer "/>
                                
                                            }
                                            
                                            <label htmlFor="cnfrm_Password">Confirm Password <span className="text-red-700">'</span></label>
                                            <input
                                            type={format2}
                        
                                            onChange={form_handler}
                                            
                                            placeholder="Confirm Passward"
                                            name="cnfrm_password"
                                            id="cnfrm_Password"
                                            value={form_data.cnfrm_password}
                                            className="bg-richblack-800 w-[95%] max-w-[90%] p-3 border border-gray-600 bg-slate-800 rounded-md
                           focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent"
                                            />
                        
                            </div></div>
                   
                    <button className="mt-14 bg-yellow-50 text-black border-none rounded-md font-semibold w-[95%] py-2">Create Account</button>
                    
                    <div className=" ml-[32%] text-gray-400 mt-12">Sign in with Google</div>
                </form>
            
                <div className=" relative">
                <img className=" absolute top-4 left-4"  src={frame}></img>
                <img className=" absolute" src={login_img}></img>
                </div>
            </div>
        </div>
    );
}
export default Sign_up;