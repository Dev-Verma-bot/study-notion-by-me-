import React from "react";
import { useSelector } from "react-redux";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/core/Dashboard/Sidebar";

const Dashboard = () => {
  const { loading: authloading } = useSelector((state) => state.auth);
  const { loading: profileloading } = useSelector((state) => state.profile);

  if (authloading || profileloading) {
    return (
      <div className="text-center text-[25px] font-bold text-white">
        Loading...
      </div>
    );
  }

  return (
    <div className="flex flex-row min-h-[calc(100vh-3.5rem)] ">
  <Sidebar />
  <div className="flex-1 h-[calc(100vh-3.5rem)] overflow-auto bg-richblack-900">
    <Outlet />
  </div>
</div>

  );
};

export default Dashboard;
