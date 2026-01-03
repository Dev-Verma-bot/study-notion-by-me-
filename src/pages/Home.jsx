import React from "react"
import { FaArrowRight } from "react-icons/fa";
import { Link } from "react-router-dom";
import Color_button from "../components/core/Homepage/Color_button";
import banner from "../assets/Images/banner.mp4"
import Highlight_text from "../components/core/Homepage/Highlight_text";
import Codeblocks from "../components/core/Homepage/Codeblocks";
import bgHome from "../assets/Images/bghome.svg"
import Home_tag from "../components/core/Homepage/Home_tag";
import Logo1 from "../assets/TimeLineLogo/Logo1.svg";
import Logo2 from "../assets/TimeLineLogo/Logo2.svg";
import Logo3 from "../assets/TimeLineLogo/Logo3.svg";
import Logo4 from "../assets/TimeLineLogo/Logo4.svg";
import Timeline_image from "../assets/Images/TimelineImage.png";
import Know_with_others from "../assets/Images/Know_your_progress.png";
import Compare_with_others from "../assets/Images/Compare_with_others.png";
import Plan_your_lesson from "../assets/Images/Plan_your_lessons.png";
import Instructor from "../assets/Images/Instructor.png";
import Exploretabs from "../components/core/Homepage/ExploreTabs";
import Review_slider from "../components/common/Review_slider";
import Footer from "../components/common/Footer";
import { useSelector } from "react-redux";
import { ACCOUNT_TYPE } from "../utils/constants";

const Home = () => {
    const { user } = useSelector((state) => state.profile);

    const getLearnMoreProps = () => ({
        text: user ? (user.role === ACCOUNT_TYPE.INSTRUCTOR ? "View Dashboard" : "Start Learning") : "Learn More",
        link: user ? (user.role === ACCOUNT_TYPE.INSTRUCTOR ? "/dashboard/instructor" : "/dashboard/enrolled-courses") : "/signup"
    });

    const getStartProps = () => ({
        text: user?.role === ACCOUNT_TYPE.INSTRUCTOR ? "View My Courses" : "Start Learning Today",
        link: user ? (user.role === ACCOUNT_TYPE.INSTRUCTOR ? "/dashboard/my-courses" : "/dashboard/enrolled-courses") : "/signup"
    });

    return (
        <div>
            {/* section 1 */}
            <div>
                <div className="flex flex-col items-center mx-auto gap-5 justify-center pt-[100px] max-w-[75%] ">

                    {!user && (
                        <Link to={"/signup"}>
                            <div className="group mx-auto mt-16 w-fit rounded-full bg-richblack-800 p-1 font-bold text-richblack-200 drop-shadow-[0_1.5px_rgba(255,255,255,0.25)] transition-all duration-200 hover:scale-95 hover:drop-shadow-none">
                                <div className="flex flex-row items-center gap-2 rounded-full px-10 py-[5px] transition-all duration-200 group-hover:bg-richblack-900">
                                    <p>Become an Instructor</p>
                                    <FaArrowRight />
                                </div>
                            </div>
                        </Link>
                    )}

                    <div className="text-white font-bold text-[35px]">
                        Empower Your Future With <span className="text-blue-100">Coding Skills</span>
                    </div>
                    <div className="text-white opacity-60 text-[18px] text-center">
                        With our online coding courses, you can learn at your own pace, from anywhere in the world, and
                        get access to a wealth of resources, including hands-on projects, quizzes, and personalized feedback from instructors.
                    </div>

                    <div className=" flex flex-row gap-7">
                        <Color_button active={1} Link_to={getLearnMoreProps().link}>
                            {getLearnMoreProps().text} <FaArrowRight />
                        </Color_button>

                        {/* Updated "Book a Demo" Logic */}
                        {(!user || user?.role === ACCOUNT_TYPE.INSTRUCTOR) && (
                            <Color_button 
                                active={0} 
                                Link_to={user ? "/dashboard/add-course" : "/login"}
                            >
                                {user ? "Create New Course" : "Book a Demo"}
                            </Color_button>
                        )}
                    </div>

                    <div className="relative s py-5 flex flex-col max-w-[1250px] mt-2 ">
                        <div className="w-full h-5 absolute top-5 shadow-[10px_-5px_50px_-5px] shadow-blue-200 "></div>
                        <div className="absolute z-10 w-[100%] h-[95%] left-[20px] top-[40px] bg-white"></div>
                        <video muted loop autoPlay className="z-40">
                            <source src={banner} type="video/mp4" />
                        </video>
                    </div>
                </div>

                {/* block 1 */}
                <Codeblocks
                    heading={<div>Unlock Your <Highlight_text> coding potential</Highlight_text> with our online courses</div>}
                    subheading={`Our courses are designed and taught by industry experts who have years of experience in coding and are passionate about sharing their knowledge with you.`}
                    button1={{ text: "Profile", active: 1, link_to:!user?"/signup":"/dashboard/my-profile" }}
                    button2={{ text: getLearnMoreProps().text, active: 0, link_to: getLearnMoreProps().link }}
                    position={`flex-row`}
                    block_code={`<!DOCTYPE html>\n <html lang="en">\n<head>\n<title>This is myPage</title>\n</head>\n<body>\n<h1><a href="/">Header</a></h1>\n<nav> <a href="/one">One</a> <a href="/two">Two</a> <a href="/three">Three</a>\n</nav>\n</body>`}
                    block_color={"text-yellow-25"}
                />

                {/* block 2 */}
                <Codeblocks
                    heading={<div>Start <Highlight_text> coding in seconds</Highlight_text> </div>}
                    subheading={`Go ahead, give it a try. Our hands-on learning environment means you'll be writing real code from your very first lesson.`}
                    button1={{ text: "Profile", active: 1, link_to:!user?"/signup":"/dashboard/my-profile" }}
                    button2={{ text: getLearnMoreProps().text, active: 0, link_to: getLearnMoreProps().link }}
                    position={`flex-row-reverse`}
                    block_code={`<!DOCTYPE html>\n <html lang="en">\n<head>\n<title>This is myPage</title>\n</head>\n<body>\n<h1><a href="/">Header</a></h1>\n<nav> <a href="/one">One</a> <a href="/two">Two</a> <a href="/three">Three</a>\n</nav>\n</body>`}
                    block_color={"text-yellow-25"}
                />
                <Exploretabs />
            </div>

            {/* section 2 */}
            <div className=" bg-white flex flex-col gap-5 pb-[150px] font-inter">
                {/* part 1 */}
                <div
                    className=" bg-auto w-full py-[150px]"
                    style={{ backgroundImage: `url(${bgHome})` }}
                >
                    <div className="flex flex-row justify-center gap-6 items-center ">
                        <Color_button active={1} Link_to={"/catalog/Networking"}>Explore Catalog</Color_button>
                        <Color_button active={0} Link_to={getLearnMoreProps().link}>{getLearnMoreProps().text}</Color_button>
                    </div>
                </div>

                {/* part 2 */}
                <div className=" flex flex-row justify-evenly items-center max-w-[1100px] mx-auto ">
                    <h1 className=" font-bold text-[35px] w-[50%]">
                        Get the Skills you need for a <Highlight_text>Job that is in demand</Highlight_text>
                    </h1>
                    <div className="max-w-[45%] flex flex-col justify-evenly gap-10">
                        <p>The modern StudyNotion is the dictates its own terms. Today, to be a competitive specialist requires more than professional skills.</p>
                        <Color_button active={1} Link_to={getLearnMoreProps().link}>{getLearnMoreProps().text}</Color_button>
                    </div>
                </div>

                {/* part 3 */}
                <div className=" mx-auto my-[50px] items-center justify-evenly gap-[100px] flex flex-row">
                    <div className=" flex flex-col gap-4 m-auto">
                        <Home_tag icon={Logo1} heading={"Leadership"} >Fully commited to the success company</Home_tag>
                        <Home_tag icon={Logo2} heading={"Responsibility"} >Students will always be our top priority</Home_tag>
                        <Home_tag icon={Logo3} heading={"Flexibility"} >The ability to switch is an important skill</Home_tag>
                        <Home_tag icon={Logo4} heading={"Solve the problem"} >Cude your way to a solution</Home_tag>
                    </div>

                    <div className=" relative ">
                        <img src={Timeline_image} alt="timeline" />
                        <div className="absolute -bottom-10 left-[20%] bg-caribbeangreen-700 h-[100px] max-w-[450px] mx-auto text-white flex flex-row items-center justify-between pl-10 gap-2 ">
                            <h1 className="text-[30px] font-bold ">10</h1>
                            <h2 className=" opacity-70">YEARS OF EXPERIENCE</h2>
                            <div className="absolute right-[50%] h-[80%] bg-white w-[1px]"></div>
                            <h1 className="text-[30px] font-bold">250</h1>
                            <h2 className=" opacity-70">TYPES OF COURSES</h2>
                        </div>
                    </div>
                </div>

                {/* part 4 */}
                <div className=" flex flex-col gap-10 items-center mx-auto">
                    <div className=" flex flex-col max-w-[850px] gap-5 text-center">
                        <div className=" font-bold text-[35px]">
                            Your Swiss Knife for <Highlight_text>learning any language</Highlight_text>
                        </div>
                        <div className=" opacity-70 text-[17px] text-center ">
                            Using spin making learning multiple languages easy. with 20+ languages realistic voice-over, progress tracking, custom schedule and more.
                        </div>
                    </div>
                </div>

                {/* part 5 */}
                <div className=" mx-auto w-full items-center">
                    <div className="relative mx-auto flex overflow-hidden h-[600px] flex-row justify-center z-20 items-center">
                        <img className="absolute top-14 left-[20%] z-30" src={Know_with_others} alt="progress" />
                        <img className="absolute -top-1 left-[36%] z-40" src={Compare_with_others} alt="compare" />
                        <img className="absolute top-5 right-[20%] z-50" src={Plan_your_lesson} alt="plan" />
                    </div>
                    <div className="flex justify-center">
                        <Color_button Link_to={getLearnMoreProps().link} className="mx-auto" active={true}>
                            {getLearnMoreProps().text}
                        </Color_button>
                    </div>
                </div>
            </div>

            {/* section 3 */}
            <div className=" mt-[50px] justify-center items-center flex flex-col gap-10">
                <div className="flex flex-row max-w-[1300px] justify-evenly h-full mx-auto items-center">
                    <div className=" flex flex-row gap-5 relative ">
                        <img src={Instructor} className="z-20" alt="instructor" />
                        <div className=" bg-white w-full z-10 h-full bottom-4 absolute right-4"></div>
                    </div>

                    <div className=" flex flex-col gap-10 items-centre max-w-[30%]">
                        <h1 className=" text-[35px] font-bold text-white ">Become an <br /> <Highlight_text>Instructor</Highlight_text></h1>
                        <p className=" text-white opacity-70 ">Instructors from around the world teach millions of students on StudyNotion. We provide the tools and skills to teach what you love.</p>
                        <div className=" relative flex flex-row items-end justify-end">
                            {/* Updated Start Learning Today Logic */}
                            <Color_button active={true} Link_to={getStartProps().link}>
                                {getStartProps().text}
                            </Color_button>
                        </div>
                    </div>
                </div>
            </div>
            <Review_slider />
            <Footer />
        </div>
    )
}

export default Home;