import React from "react";
import { Link } from "react-router-dom";
const Color_button= ({active,children,Link_to})=>{
    return (
        <Link to={Link_to}>
            <button className={`text-center text-[13px] px-6 py-3 flex flex-row items-center gap-2 rounded-md font-bold hover:scale-95 transition-all duration-200
                ${active?"bg-yellow-50 text-black":"bg-richblack-800 text-white"}`} >
                {children}</button>
        </Link>
    )
}

export default Color_button