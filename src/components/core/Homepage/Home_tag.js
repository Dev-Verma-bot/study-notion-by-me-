import React from "react";
const Home_tag= ({icon,children,heading})=>{
    return (
        <div className=" flex flex-row gap-14">
            <img src={icon}></img>
            <div className=" flex flex-col gap-1">
                <h1 className=" font-semibold text-lg">{heading}</h1>
                <p className=" text-pure-greys-800">{children}</p>
            </div>
        </div>
    )
}
export default Home_tag 