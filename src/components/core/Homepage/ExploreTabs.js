import React, { useState } from "react";
import { HomePageExplore } from "../../../data/homepage-explore";
import { useEffect } from "react";
import Highlight_text from "./Highlight_text";
const tabs = HomePageExplore.map(item => item.tag);

const Exploretabs= ()=>{
const [current_tab,Set_current_tab] = useState(tabs[0]);
const [cources,Set_cources]= useState(HomePageExplore[0].courses)
const [current_cource,Set_current_cource]= useState(HomePageExplore[0].courses[0])

const change_cards= (tag)=>{
Set_current_tab(tag);
const cources= HomePageExplore.find((t)=>t.tag==tag).courses
Set_cources(cources);
Set_current_cource(cources[0]);
}

    return (
        <div className=" flex flex-col gap-5 items-center justify-center mx-auto">
            <div className=" flex flex-col gap-2 items-center justify-center mx-auto">
                <h1 className="text-[35px] text-white font-bold"
                 >Unlock the <Highlight_text>Power of Code</Highlight_text></h1>
                 <p className=" text-white opacity-60">Learn to build anything you can imagine</p>
            </div> 
            {/* tags create  */}
            <div className="  rounded-full p-1">
           
                <div className="flex flex-row gap-2 shadow-blue-25 shadow-2xl rounded-full">
                    {
                      tabs.map((tab)=>{
                        return( 
                            <div onClick={()=>change_cards(tab)} className={`text-[16px] p-2 px-8 rounded-full 
                                transition-all cursor-pointer duration-300
                            ${current_tab===tab?" bg-richblack-900 text-white shadow-inner  shadow-blue-100 text-[19px] font-bold": 
                            " text-white opacity-75"}`}>
                               {tab} 
                            </div>
                        );
                      })  
                    }
                </div>
                  
            </div>
            {/* cards create  */}
        <div className="flex max-w-[1200px] flex-row gap-5">
          {cources.map((t) => (
            <div key={t.heading} className="relative z-10">
            {/* <div className="absolute  w-full h-full top-4 left-4 z-0 bg-yellow-100"></div> */}
             {/* Card itself */}
             <div
                className={`z-20  flex p-6 flex-col gap-2 cursor-pointer transition-all duration-200
                 ${t === current_cource
                   ? "text-black bg-white"
                   : "bg-richblack-700  text-white opacity-70"}`}
               onClick={() => Set_current_cource(t)}
             >
               <h1 className="text-[20px] font-bold flex flex-row">{t.heading}</h1>
               <p>{t.description}</p>
                
               <div
                 className={`mt-7 w-[98%] h-[1px] mx-auto ${
                   t === current_cource ? "bg-black" : "bg-white opacity-70"
                 }`}
               ></div>

               <div className="flex flex-row justify-around mt-3 items-center">
                 <h1>{t.level}</h1>
                 <h2>{t.lessionNumber} Lessons</h2>
               </div>
             </div>
           </div>
         ))}
</div>

        </div>
    );
}
export default Exploretabs;