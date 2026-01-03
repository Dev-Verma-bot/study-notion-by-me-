import React from "react";
const Ab_Highlight_text=({children,color})=>{
    return(
        
        <span className={`${color} font-bold text-[35px]`}>
                {children}
        </span>
        
    );
}
export default Ab_Highlight_text;