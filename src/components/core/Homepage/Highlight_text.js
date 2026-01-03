import React from "react";

const Highlight_text= ({children})=>{
    return (
        <span className="text-blue-100 font-bold text-[35px]">
        {children}
        </span>
    )
}

export default Highlight_text;