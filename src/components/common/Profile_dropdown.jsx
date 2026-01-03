import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { clearToken } from "../../slices/authSlice";
import { setUser } from "../../slices/profileSlice";
import { logout } from "../../services/operations/authApi";
import ConfirmationModal from "./ConfirmationModal";

const ProfileDropdown = () => {
  const { user } = useSelector((state) => state.profile);
  const profile_image = user?.image || "/default-avatar.png"; // fallback image
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [modal_data,Setmodal_data]= useState(null);
const handleLogout = () => {
  Setmodal_data({
      text1: "Are you sure!",
      text2: "You will be logged out from your account.",
      button1_text: "Logout",
      button2_text: "Cancel",
      button1_handler: () => dispatch(logout(navigate)),
      button2_handler: () => Setmodal_data(null),
    })
};


  return (
    <div className="relative">
      {/* Profile Button */}
      <button
        onClick={() => setOpen(!open)}
        className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center overflow-hidden"
      >
        <img src={profile_image} alt="profile" className="w-full h-full object-cover rounded-full" />
      </button>

      {/* Dropdown Menu */}
      {open && (
        <div
          className="absolute right-0 mt-2 w-40 text-sm 
                     bg-richblack-900 text-white 
                     rounded-md overflow-hidden border border-gray-700 shadow-lg"
        >
          <button
            onClick={() => navigate("dashboard/my-profile")}
            className="block w-full text-left px-4 py-2 hover:bg-richblack-800"
          >
            Profile
          </button>
          <button
            onClick={() => navigate("dashboard/settings")}
            className="block w-full text-left px-4 py-2 hover:bg-richblack-800"
          >
            Settings
          </button>
          <button
            onClick={handleLogout}
            className="block w-full text-left px-4 py-2 text-red-400 hover:bg-richblack-800"
          >
            Logout
          </button>
        </div>
      )}
      {
        modal_data&&<ConfirmationModal modal_data={modal_data}></ConfirmationModal>
      }
    </div>
  );
};

export default ProfileDropdown;
