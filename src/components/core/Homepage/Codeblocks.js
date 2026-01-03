import React from "react";
import Color_button from "./Color_button";
import { FaArrowRight } from "react-icons/fa";
import { TypeAnimation } from "react-type-animation";
const Codeblocks= ({heading,subheading,button1,button2,block_code,block_color, position})=>{
    return (
        <div className={`flex ${position} ${block_color} gap-10 py-16 justify-evenly max-w-[80%] mx-auto`}>

{/* section 1  */}
        <div className="flex flex-col gap-8 max-w-[50%]">
            <h1 className=" text-white text-[35px] font-bold">
                {heading}
            </h1>
            <p className="text-white opacity-60 text-[18px]">
                {subheading}
            </p>

            <div className=" flex flex-row gap-3">
            <Color_button className="flex " active={button1.active} Link_to={button1.link_to} >
            
            {button1.text} 
            <FaArrowRight/>
            
            </Color_button>
            <Color_button active={button2.active} Link_to={button2.link_to} >{button2.text}</Color_button>
            </div>
            </div> 
{/* section 2 */}
           <div className="border p-7 border-pure-greys-500 rounded-xl  flex flex-row w-[35%] gap-4 justify-start items-start h-fit">
                 <div className="flex flex-col items-start text-pure-greys-500">
                    <p>1</p>
                    <p>2</p>
                    <p>3</p>
                    <p>4</p>
                    <p>5</p>
                    <p>6</p>
                    <p>7</p>
                    <p>8</p>
                    <p>9</p>
                    <p>10</p>
                    <p>11</p>
                </div>

            <div className="flex flex-col items-start font-bold font-mono">
            <TypeAnimation
            sequence={[block_code, 2000, ""]}
            cursor={1}
            repeat={Infinity}
            omitDeletionAnimation={1}
            style={{
                whiteSpace: "pre-line",
                display: "block",
                    }}
            />
        </div>
            </div>
        </div>
    )
}
export default Codeblocks;