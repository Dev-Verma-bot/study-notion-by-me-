import React from "react";
const Boxy_info=({children,color,heading})=>{
    return(
        <div className=" flex flex-col justify-start max-w-[600px] items-start gap-7">
        <div className={`${color} font-bold text-[35px]`}>
                {heading}
        </div>
        <p className="text-white opacity-60">
            {children}
        </p>
        </div>
        
    );
}
export default Boxy_info;