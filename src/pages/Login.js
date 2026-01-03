import React, { useState } from "react";
import frame from "../assets/Images/frame.png";
import login_img from "../assets/Images/login.webp";
import toast from "react-hot-toast";
import { useNavigate, Link } from "react-router-dom";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import { LuEyeOff } from "react-icons/lu";
import { ApiConnect } from "../services/ApiConnect";
import { auth } from "../services/Apis";
import { useDispatch } from "react-redux";
import { setToken } from "../slices/authSlice";
import { setUser } from "../slices/profileSlice";

const Login = ({ Seen, SetSeen }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [format, setFormat] = useState("password");
  const [form_data, setFormData] = useState({ email: "", pass: "" });

  // form handler
  function form_handler(event) {
    const { type, name, checked, value } = event.target;
    setFormData((prev_data) => ({
      ...prev_data,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  // submit handler
  async function Submit_handler(event) {
    event.preventDefault();

    try {
      const response = await ApiConnect("POST", auth.login_api, form_data);

               const user  = response.data.data;

      // save in redux (and localStorage because of slice logic)
      dispatch(setToken(user.token));
      dispatch(setUser(user));

      toast.success(response.data.message || "Login successful");
      navigate("/dashboard/my-profile");
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
          }
  }

  return (
    <div>
      <div className="text-white grid grid-cols-2 justify-between pt-10 max-w-[1080px] mx-auto">
        <form onSubmit={Submit_handler} className="relative">
          <h1 className="font-bold text-[35px]">Welcome Back</h1>
          <br />
          <p className="font-bold opacity-65">
            Build Skills for today, tomorrow, and beyond.
          </p>
          <br />
          <p className="text-blue-500 italic font-bold">
            Education to future-proof your career.
          </p>
          <br />
          <br />
          <label htmlFor="Address">
            Enter Address <span className="text-red-700">*</span>
          </label>

          <input
            required
            type="text"
            onChange={form_handler}
            placeholder="Enter email address"
            name="email"
            id="Address"
            value={form_data.email}
            className="bg-richblack-800 w-[95%] max-w-[90%] p-3 border border-gray-600 bg-slate-800 rounded-md
                     focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent"
          />

          <br />
          <div className="relative">
            {Seen && (
              <MdOutlineRemoveRedEye
                onClick={() => {
                  SetSeen(false);
                  setFormat("password");
                }}
                className="text-gray-400 absolute top-10 right-[70px] cursor-pointer "
              />
            )}

            {!Seen && (
              <LuEyeOff
                onClick={() => {
                  SetSeen(true);
                  setFormat("text");
                }}
                className="text-gray-400 absolute top-10 right-[70px] cursor-pointer "
              />
            )}

            <label htmlFor="Password">
              Enter Password <span className="text-red-700">*</span>
            </label>
            <input
              type={format}
              required
              onChange={form_handler}
              placeholder="Enter Password"
              name="pass"
              id="Password"
              value={form_data.pass}
              className="bg-richblack-800 w-[95%] max-w-[90%] p-3 border border-gray-600 bg-slate-800 rounded-md
   focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent"
            />
          </div>

          <Link
            to={"/reset_pass"}
            className="cursor-pointer text-green-300 opacity-55 absolute right-[10%]"
          >
            Forget Password
          </Link>

          <button
            type="submit"
            className="mt-14 bg-yellow-50 text-black border-none rounded-md font-semibold w-[95%] max-w-[90%] py-2"
          >
            Submit
          </button>

          <div className="ml-[32%] text-gray-400 mt-14">Sign in with Google</div>
        </form>

        <div className="relative">
          <img className="absolute top-4 left-4" src={frame} alt="frame" />
          <img className="absolute" src={login_img} alt="login" />
        </div>
      </div>
    </div>
  );
};

export default Login;
