import React from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Profile_edit_btn from "./Profile_edit_btn";
const MyProfile=()=>{

    const {user}= useSelector((state)=>state.profile);
    const navigate= useNavigate();
    return (
        <div >
            <div className="text-white mx-auto h-screen flex w-[90%] flex-col justify-evenly">

                {/* box-1  */}
                <div className="py-10 relative flex flex-row items-center justify-evenly bg-richblack-600">
                    <div className=" flex flex-row items-center gap-3">
                        <img src={user.image} width={50} className="rounded-full"></img>
                        <div className=" flex flex-col items-start justify-between">
                            <p className=" text-[20px] font-bold">{user.first_name} {user.last_name}</p>
                            <p className=" opacity-60">{user.email_id}</p>
                        </div>
                    </div>
                    <div>
                        <Profile_edit_btn Onclick={()=>{navigate("/dashboard/settings")}}>Edit</Profile_edit_btn>
                    </div>
                </div>

                {/* box-2   */}
                <div className="py-10 relative flex flex-row items-center justify-evenly bg-richblack-600">
                        
                        <div className=" flex flex-col items-start justify-between">
                            <p className=" text-[20px] font-bold">About</p>
                            <p className=" opacity-60">{user?.profile?.about_user ?? "Write something about yourself"}</p>
                        </div>
                    <div>
                        <Profile_edit_btn Onclick={()=>{navigate("/dashboard/settings")}}>Edit</Profile_edit_btn>
                    </div>
                </div>

                {/* box-3  */}

<div className="py-10 relative flex flex-row  items-center justify-evenly bg-richblack-600">

  {/* Left Column */}
  <div className="flex flex-col gap-6  ">
    <p className="text-[20px] font-bold">Personal Details</p>
    <div>
      <p className="opacity-60">First Name</p>
      <p className="font-bold">{user.first_name}</p>
    </div>
    <div>
      <p className="opacity-60">Email address</p>
      <p className="font-bold">{user?.email_id}</p>
    </div>
    <div>
      <p className="opacity-60">Date of birth</p>
      <p className="font-bold">{user?.profile?.dob ?? "..."}</p>
    </div>
  </div>

  {/* Right Column */}
  <div className="flex flex-col  gap-6">
    <div className="self-start text-[17px] font-bold">
      <Profile_edit_btn Onclick={() => { navigate("/dashboard/settings") }}>
        Edit
      </Profile_edit_btn>
    </div>
    <div>
      <p className="opacity-60">Last Name</p>
      <p className="font-bold">{user.last_name}</p>
    </div>
    <div>
      <p className="opacity-60">Gender</p>
      <p className="font-bold">{user?.profile?.gender ?? "..."}</p>
    </div>
    <div>
      <p className="opacity-60">Contact no.</p>
      <p className="font-bold">{user?.profile?.contact_no ?? "..."}</p>
    </div>
  </div>

</div>

            </div>
        </div>
    );
}
export default MyProfile;