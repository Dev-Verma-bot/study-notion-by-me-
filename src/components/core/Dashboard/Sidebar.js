import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Sidebar_links from "./Sidebar_links";
import {sidebarLinks} from "../../../data/dashboard-links"
import { VscSettingsGear, VscSignOut } from "react-icons/vsc";
import { useNavigate } from "react-router-dom";
import { logout } from "../../../services/operations/authApi";
import ConfirmationModal from "../../common/ConfirmationModal";
const Sidebar = () => {

  const dispatch = useDispatch();
  const navigate= useNavigate();
  const { loading: authloading } = useSelector((state) => state.auth);
  const { user, loading: profileloading } = useSelector((state) => state.profile);
  const [confirmation_modal,set_confirmation_modal]= useState(null);

  if (authloading || profileloading) {
    return (
      <div className="text-center text-[25px] font-bold text-white">
        Loading...
      </div>
    );
  }

  return (
    <div>
      <div
        className="flex flex-col  min-w-[222px] h-[calc(100vh-3.5rem)] bg-richblack-800
                  border border-richblack-600"
      > 
        <div className="flex flex-col">
          {sidebarLinks.map((p) => {
              if (p.type && user?.role !== p.type) return null
            return (
            <Sidebar_links key={p.id} link={p} iconName={p.icon} />
            )
            })}
        </div>

        <div className=" w-[80%] h-[1px] mx-auto bg-white opacity-60">
        </div>

        <div className=" flex flex-col ">
            <Sidebar_links link={{name:"Settings",path:"dashboard/settings"}} iconName="VscSettingsGear"></Sidebar_links>
           
          <button 
     onClick={() => {
  const modalData = {
    text1: "Are you sure!",
    text2: "You will be logged out from your account.",
    button1_text: "Logout",
    button2_text: "Cancel",
    button1_handler: () => dispatch(logout(navigate)),
    button2_handler: () => set_confirmation_modal(null),
  };
    set_confirmation_modal(modalData);
}}

          >
            <div className=" flex flex-row items-center text-white opacity-60 justify-center gap-x-2"> 
              <VscSignOut className=" text-[20px] "></VscSignOut>
              <span>Logout</span>
                
            </div>
          </button>

        </div>
      </div>
      {confirmation_modal&&<ConfirmationModal modal_data={confirmation_modal}></ConfirmationModal>}
    </div>
  );
};

export default Sidebar;
