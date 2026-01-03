import React from "react";
import Highlight_text from "../components/core/Homepage/Highlight_text";
import aboutus1 from "../assets/Images/aboutus1.webp";
import aboutus2 from "../assets/Images/aboutus2.webp";
import aboutus3 from "../assets/Images/aboutus3.webp";
import Ab_Highlight_text from "../components/core/About/Ab_Highlight_text";
import Boxy_info from "../components/core/About/Boxy_info";
import funding_stories from "../assets/Images/FoundingStory.png";
import StatsComponenet from "../components/core/About/Stats";
import LearningGrid from "../components/core/About/LearningGrid";
import Contact_Form from "../components/core/About/Contact_Form";
import Review_slider from "../components/common/Review_slider";
import Footer from "../components/common/Footer";
const About=()=>{
    return (
        
            <div>
        <div className="flex flex-col text-white justify-center items-center">
            
            {/* section 1  */}

            <div className="bg-richblack-700  w-full pt-[50px] pb-[250px]">
                <div className="relative max-w-[65%] mx-auto flex flex-col gap-8 justify-center items-center" >
            <div className="text-[35px] font-bold  text-center max-w-[70%] ">
                Driving Innovation in Online Education for a <Highlight_text>
                 Brighter Future</Highlight_text> 
            </div>

            <p className="opacity-50 max-w-[68%] text-center mx-auto">
                Studynotion is at the forefront of driving innovation in online education. We're passionate about creating a brighter
                 future by offering cutting-edge courses, leveraging emerging technologies, and nurturing a vibrant learning community.
            </p>

            <div className="flex flex-row w-full top-[250px] absolute justify-between items-center">
                <img src={aboutus1}></img>
                <img src={aboutus2}></img>
                <img src={aboutus3}></img>
            </div>
            </div>
            </div>

            {/* section 2 */}

            <div className=" pt-[200px] pb-[100px] text-center max-w-[70%] text-[35px] font-bold ">
                We are passionate about revolutionizing the way we learn. Our innovative platform
                <Ab_Highlight_text color={"text-blue-100 "}>
                "combines technology 
                </Ab_Highlight_text>
                <Ab_Highlight_text color={"text-brown-300"}> expertise</Ab_Highlight_text>
                , and community to create an <Ab_Highlight_text color={"text-brown-300"}>
                unparalleled educational experience.
                </Ab_Highlight_text>
                
            </div>

            <div className="bg-richblack-500 h-[1px] w-full mb-[100px]">
            </div>

            {/* section 3  */}
            <div className=" flex flex-col justify-between items-center gap-[200px] w-[80%] mx-auto">
                <div className=" flex flex-row justify-evenly w-full">
                <div className=" flex flex-col gap-[50px] ">
                <Boxy_info heading={"Our Funding Story"} color={"text-yellow-25"}>
                    Our e-learning platform was born out of a shared vision and passion for transforming education. It all began with a group of educators,
                     technologists, and lifelong learners who recognized the need for accessible, flexible, and high-quality learning opportunities in a rapidly evolving digital world.
                </Boxy_info>
                <p className=" opacity-60 max-w-[600px]">
                    As experienced educators ourselves, we witnessed firsthand the limitations and challenges of traditional education systems. We believed that education should not be confined to the walls of a classroom or restricted by geographical boundaries. We envisioned a 
                    platform that could bridge these gaps and empower individuals from all walks of life to unlock their full potential.
                </p>
                </div>

                <img src={funding_stories} className="shadow-yellow-5 shadow-xl"></img>

                </div>
                <div className=" flex flex-row justify-evenly w-[80%] gap-[300px]">
                <Boxy_info heading={"Our Vision"} color={"text-yellow-25"}>
                    With this vision in mind, we set out on a journey to create an e-learning platform that would revolutionize the way people learn. Our team of dedicated experts worked tirelessly to develop a robust and intuitive platform 
                    that combines cutting-edge technology with engaging content, fostering a dynamic and interactive learning experience.
                </Boxy_info>

                <Boxy_info heading={"Our Mission"} color={"text-yellow-25"}>
                  Our mission goes beyond just delivering courses online. We wanted to create a vibrant community of learners, where individuals can connect, collaborate, and learn from one another. We believe that knowledge thrives in an environment of sharing and dialogue,
                   and we foster this spirit of collaboration through forums, live sessions, and networking opportunities.
                </Boxy_info>
                </div>
            </div>
            
            {/* section 4  */}
            <StatsComponenet/>
            {/* section 5 */}
            <LearningGrid/>

            <Contact_Form/>
              <Review_slider/>
            </div>
                 < Footer />
            </div>
    )
} 

export default About;