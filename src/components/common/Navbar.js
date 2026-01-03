import React, { useState, useEffect } from "react";
import logo_full_light from "../../assets/Logo/Logo-Full-Light.png";
import { NavbarLinks } from "../../data/navbar-links";
import { Link, matchPath, NavLink } from "react-router-dom";
import { FaSearch } from "react-icons/fa";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { FaCartShopping } from "react-icons/fa6";
import Profile_dropdown from "./Profile_dropdown";
import { ApiConnect } from "../../services/ApiConnect";
import { categories } from "../../services/Apis";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";

const Navbar = () => {
  const { token } = useSelector((state) => state.auth);
  const { user } = useSelector((state) => state.profile);
  const { totalItems } = useSelector((state) => state.cart);
  const location = useLocation();
  const [sub_links, set_sub_links] = useState([]);

  const fetch_sublinks = async () => {
    try {
      const result = await ApiConnect("GET", categories.category_api);
      set_sub_links(result.data.data);
    } catch (error) {
          }
  };

  useEffect(() => {
    fetch_sublinks();
  }, []);

  const match_route = (route) => {
    return matchPath({ path: route }, location.pathname);
  };

  return (
    <div className="border-b items-center pb-2 z-[9999] shadow-blue-300 shadow-xl flex flex-row justify-evenly mt-4">
      {/* Logo */}
      <Link to={"/"}>
        <img src={logo_full_light} alt="Logo" className="w-[160px]" />
      </Link>

      {/* Center navigation links */}
      <div className="flex flex-row items-center gap-6 text-[18px]">
        {NavbarLinks.map((t) => {
          return t.title === "Catalog" ? (
            <div key={t.title} className="relative text-white flex flex-row items-center">
              {/* Hover group only on Catalog text + arrow */}
              <div className="cursor-pointer group flex items-center gap-1">
                <p>{t.title}</p>
                <MdOutlineKeyboardArrowDown className="text-[22px]" />

                {/* small rotated box (triangle pointer) */}
                <div
                  className="opacity-0 group-hover:opacity-100 absolute top-7 left-10
                  rotate-45 w-[20px] h-[20px] bg-richblack-900 transition-all duration-200"
                ></div>

                {/* Dropdown menu */}
                <div
                  className="opacity-0 invisible group-hover:visible group-hover:opacity-100
                  absolute top-9 left-0 w-max flex flex-col gap-2 p-4 
                  bg-richblack-900 text-white shadow-lg rounded-md transition-all duration-200 z-[9999]"
                >
                  {sub_links.length > 0 ? (
                    sub_links.map((sub, index) => (
                      <Link
                        to={`/catalog/${sub.name}`}
                        key={index}
                        className="hover:bg-richblack-800 px-6 py-2 rounded-md transition-all duration-200 hover:text-yellow-50"
                      >
                        {sub.name}
                      </Link>
                    ))
                  ) : (
                    <p className="text-sm text-gray-400">No categories</p>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <Link
              key={t.title}
              className={`${
                match_route(t?.path)
                  ? "text-yellow-400"
                  : "text-white opacity-80 hover:opacity-100"
              } transition-all duration-200`}
              to={t?.path}
            >
              {t.title}
            </Link>
          );
        })}

        {/* Search bar */}
        {/* <div className="bg-richblack-800 p-2 rounded-full flex flex-row items-center gap-2 max-w-[140px]">
          <input
            placeholder="Search"
            className="outline-none bg-richblack-800 border-none text-white w-[70%] placeholder:opacity-70"
          />
          <FaSearch className="text-white opacity-90" />
        </div> */}
      </div>

      {/* Right section (login/signup/cart/profile) */}
      <div className="flex flex-row gap-3 items-center">
        {/* Cart for students */}
        {user && user.accountType !== "Instructor" && (
          <Link to={"/dashboard/cart"} className="relative">
            <FaCartShopping className="text-white text-[22px]" />
            {totalItems > 0 && (
              <div className="rounded-full text-[12px] absolute -top-2 -right-2 bg-yellow-50 font-bold text-black w-4 h-4 flex items-center justify-center">
                {totalItems}
              </div>
            )}
          </Link>
        )}

        {/* Login & Signup buttons */}
        {!token && (
          <>
            <NavLink to={"/login"}>
              <button className="bg-richblack-800 opacity-80 text-white rounded-md px-4 py-1 hover:opacity-100 transition">
                Login
              </button>
            </NavLink>
            <NavLink to={"/signup"}>
              <button className="bg-richblack-800 opacity-80 text-white rounded-md px-4 py-1 hover:opacity-100 transition">
                Sign Up
              </button>
            </NavLink>
          </>
        )}

        {/* Profile Dropdown */}
        {token && <Profile_dropdown />}
      </div>
    </div>
  );
};

export default Navbar;
