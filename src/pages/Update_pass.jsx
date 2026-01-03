import React, { useEffect, useState } from "react";
import { FaCircleCheck } from "react-icons/fa6";
import { Link } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import { ApiConnect } from "../services/ApiConnect";
import { auth } from "../services/Apis";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setLoading, setReset_pass_form } from "../slices/authSlice";
const Update_pass = () => {

  const dispatch= useDispatch();
  const {loading,reset_pass_form}= useSelector((state)=>state.auth)
  const Navigate= useNavigate();
  const { reset_pass_token } = useParams();   

    const [form, set_form_data] = useState({
    token:reset_pass_token,
    new_pass:"",
    cnfrm_pass: ""
  });
 
  const form_handler = (event) => {
    const { type, name, checked, value } = event.target;
    set_form_data((prev_data) => ({
      ...prev_data,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const submit_handler =async (event) => {
    
    event.preventDefault();
            dispatch(setReset_pass_form(form));
    Navigate("/reset_pass/reset_complete"); 
 
  };

  return (
    <div className="flex text-white flex-col items-center mt-[10%] gap-6 mx-auto text-center justify-center max-w-[500px]">
      <div className="font-bold text-[35px]">Create new password</div>

      <p className="opacity-75">
        Almost done. Enter your new password and you are all set!
      </p>

      <form onSubmit={submit_handler} className="flex flex-col gap-4 w-full">
        <label htmlFor="new_pass" className="text[35px] font-bold">
          New password <span className="text-yellow-50">*</span>
        </label>
        <input
          placeholder="Enter new password"
          name="new_pass"
          value={form.new_pass}
          type="password"
          onChange={form_handler}
          id="new_pass"
          required
          autoComplete="new-password"
         className="bg-richblack-900 text-white border-richblack-400 border rounded-sm 
                    text-center p-3" />

        <label htmlFor="cnfrm_pass" className="text[35px] font-bold">
          Confirm new password <span className="text-yellow-100">*</span>
        </label>
        <input
          placeholder="Confirm new password"
          name="cnfrm_pass"
          value={form.cnfrm_pass}
          type="password"
          onChange={form_handler}
          id="cnfrm_pass"
          required
          autoComplete="new-password"
          className="bg-richblack-900 text-white border-richblack-400 border rounded-sm 
                    text-center p-3"
        />

        <button
          type="submit"
          className="py-2 px-4 cursor-pointer font-semibold bg-yellow-50 text-black rounded-md border-none hover:scale-95 transition-all duration-200"
        >
          Reset Password
        </button>
      </form>

      <div className="grid grid-cols-2 justify-evenly items-center text-center mt-6 text-caribbeangreen-600 gap-1 text-sm">
        <div className="flex flex-row gap-1 items-center">
          <FaCircleCheck /> One lowercase character
        </div>
        <div className="flex flex-row gap-1 items-center">
          <FaCircleCheck /> One uppercase character
        </div>
        <div className="flex flex-row gap-1 items-center">
          <FaCircleCheck /> One special character
        </div>
        <div className="flex flex-row gap-1 items-center">
          <FaCircleCheck /> 8 characters minimum
        </div>
        <div className="flex flex-row gap-1 items-center">
          <FaCircleCheck /> One number
        </div>
      </div>

      <Link to={"/login"} className="flex flex-row items-center gap-1 mt-6">
        <FaArrowLeft />
        Back to login
      </Link>
    </div>
  );
};

export default Update_pass;
