import React from "react";
import Review_slider from "../components/common/Review_slider";
import Footer from "../components/common/Footer";
import { TbMessages } from "react-icons/tb";
import { FaEarthAmericas } from "react-icons/fa6";
import { IoCall } from "react-icons/io5";
import ContactUsForm from "../components/common/Contact_us_form";
const ContactUs_page=()=>{
    const data= [
        {
            heading:"Chat on us",
            description:"Our friendly team is here to help.",
            address:"info@studynotion.com",
            logo:<TbMessages />
        },
        {
            heading:"Visit us",
            description:"Come and say hello at our office HQ.",
            address:"Akshya Nagar 1st Block 1st Cross, Rammurthy nagar, Bangalore-560016",
            logo:<FaEarthAmericas />
        },
        {
            heading:"Call us",
            description:"Mon - Fri From 8am to 5pm",
            address:"+91 6366 000 666",
            logo:<IoCall />
        }
    ]
    return (
        <div>
        <div className=" flex text-white flex-row justify-center gap-[80px] first-letter
                    items-start py-[100px]">

        {/* left side box  */}
        <div className=" flex flex-col p-[50px]  gap-6 rounded-xl bg-richblack-800">
            {
            data.map((k,index)=>(
                <div key={index} className=" flex flex-col gap-2">
                <div className=" font-bold text-[19px] flex flex-row gap-2 justify-start items-center">
                    {k.logo}
                    <p>{k.heading}</p>
                </div>
                <div className="opacity-60 flex flex-col gap-1">
                <p>{k.description}</p>
                <p>{k.address}</p>
                </div>
                </div>
            ))
            }
        </div>
        {/* right side form  */}
        <div className=" border-white border p-[50px] rounded-xl border-opacity-40">
        <div className=" flex flex-col justify-evenly  items-center gap-4 
          max-w-[450px]">
            <div className=" flex flex-col items-start gap-3 ">
            <h1 className="text-[30px] font-bold">Got a Idea? We've got the skills. Let's team up</h1>
            <p className="opacity-70">Tell us more about yourself and what you're got in mind.</p>
            </div>
            <ContactUsForm/>
        </div>
        </div>
        </div>
          <Review_slider/>
    <Footer/>
    
        </div>
    );
}
export default ContactUs_page;