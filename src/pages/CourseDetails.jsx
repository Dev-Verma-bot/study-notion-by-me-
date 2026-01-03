import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import buyCourse from "../services/operations/studentFeaturesAPI";
import { useNavigate, useParams } from "react-router-dom";
import { fetchCourseDetails } from "../services/operations/courseDetailsApi.js";
import RatingStars from "../components/common/RatingStars.jsx";
import GetAvgRating from "../utils/avgRating.js";
import { formattedDate } from "../utils/dateFormatter.js";
import { GoGoal } from "react-icons/go";
import { IoIosTimer } from "react-icons/io";
import { LiaMousePointerSolid } from "react-icons/lia";
import { FiGlobe, FiCheckCircle } from "react-icons/fi";
import Icon_button from "../components/common/Icon_button.jsx";
import { SlCalender } from "react-icons/sl";
import { addToCart } from "../slices/cartSlice";
import { AiOutlineFileDone } from "react-icons/ai";
import Footer from "../components/common/Footer.jsx"
import ConfirmationModal from "../components/common/ConfirmationModal.jsx";
import toast from "react-hot-toast";
import copy from 'copy-to-clipboard';
import CourseAccordionBar from "../components/core/Course/CourseAccordinationbar.jsx";
import { FaShareSquare } from "react-icons/fa"
import { ACCOUNT_TYPE } from "../utils/constants.js";

const CourseDetails = () => {
  const { token } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { courseID } = useParams();
  const { user } = useSelector((state) => state.profile);
  const [loading, Setloading] = useState(false);
  
  const [totalNoOfLectures, setTotalNoOfLectures] = useState(0)
  const [payment_loading, Setpayment_loading] = useState(false);
  const [course_detail, Setcourse_detail] = useState(null);
  const [avg_rating, Setavg_rating] = useState(0);
  const [buyed, Setbuyed] = useState(false);  
  const [Date, SetDate] = useState("");
  const [confirmation_modal, setconfirmation_modal] = useState(null);
  const [isActive, setIsActive] = useState([]);

  const fetch_course = async () => {
    Setloading(true);
    try {
      const response = await fetchCourseDetails(courseID);
      if (response) {
        Setcourse_detail(response);
        const reviews = response?.data?.details?.rating_and_review || [];
        const date = response?.data?.details?.created_at;
        const rating = GetAvgRating(reviews);
        const formated_date = formattedDate(date);
        SetDate(formated_date);
        Setavg_rating(rating);   
        
        let lectures = 0
        response?.data?.details?.cource_content?.forEach((sec) => {
          lectures += sec.subsections.length || 0
        })
        setTotalNoOfLectures(lectures)
          
        if(user && response?.data?.details?.students_enrolled.includes(user._id))
            Setbuyed(true);
      }
    } catch(error) {
        Setcourse_detail(null);
    }
    Setloading(false);
  };

  useEffect(() => {
    fetch_course();
  }, [courseID]);

  const handle_add_to_cart = () => {
    if(!user) {
      setconfirmation_modal({
        text1: "You are not logged in",
        text2: "Please login to use add to cart feature",
        button1_text: "Login",
        button1_handler: () => navigate("/login"),
        button2_text: "Cancel", 
        button2_handler: () => setconfirmation_modal(null)
      })
      return;
    }
    if(user.role === ACCOUNT_TYPE.INSTRUCTOR) {
        toast.error("You are instructor can't add course to cart!")
        return;
    }
    if(token) dispatch(addToCart(course_detail?.data?.details))
  }

  const handleshare = () => {
    copy(window.location.href);
    toast.success("Link copied to clipboard");
  }

  const handleBuyCourse = () => {
    if (token) {
      Setpayment_loading(true);
      buyCourse([{courseID}], token, user, navigate, dispatch); 
      Setpayment_loading(false);
    } else {
      setconfirmation_modal({
        text1: "You are not logged in",
        text2: "Please login to purchase course",
        button1_text: "Login",
        button1_handler: () => navigate("/login"),
        button2_text: "Cancel",
        button2_handler: () => setconfirmation_modal(null)
      })
    }
  };

  const handleActive = (id) => {
    setIsActive(
        !isActive.includes(id) 
        ? isActive.concat(id) 
        : isActive.filter((e) => e !== id)
    )
  }

  if(loading || payment_loading) {
    return <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center text-white">Loading...</div>
  }

  if (!course_detail) {
    return <div className="text-white text-center mt-10">Course not found</div>;
  }

  return (
    <div className="text-white text-center font-inter relative ">
        
         {/* box  */}
         <div className="absolute top-4 right-[12%] flex flex-col items-center bg-richblack-700 max-w-[400px] pb-4 gap-4">
              <img src={course_detail?.data?.details?.thumbnail} alt="thumbnail" />
              <p className="font-semibold">Rs {course_detail?.data?.details?.price} </p>
              {
                buyed === false ?    
                <Icon_button className="text-black" onClick={handle_add_to_cart}>Add to cart</Icon_button>
                :
                <div className="flex flex-row items-center font-bold gap-2">
                  <FiCheckCircle className="text-yellow-5 text-lg"/>
                  Purchased
                </div>
              }
              {
                buyed === false ?    
                <Icon_button className="text-black " onClick={handleBuyCourse}>Buy Now</Icon_button>
                :
                <Icon_button className="font-bold" onClick={() => {
                    navigate(`/view-course/${course_detail?.data?.details?._id}/section/${course_detail?.data?.details?.cource_content?.[0]?._id}/sub-section/${course_detail?.data?.details?.cource_content?.[0]?.subsections?.[0]?._id}`)
                }} outline={true}>
                 <GoGoal />
                 Start learning
                 </Icon_button>
              }

              <p className="text-pure-greys-50">30 days Money-Back Guarantee</p>
              
              <div className="text-caribbeangreen-100 flex font-semibold flex-col items-start justify-start">
                <p className="text-white">This course includes:</p>
                <p className="flex gap-2 items-center"><IoIosTimer /> hours on-demand video</p>
                <p className="flex gap-2 items-center"><LiaMousePointerSolid /> Full Lifetime access</p>
                <p className="flex gap-2 items-center"><SlCalender />Access on Mobile and TV</p>
                <p className="flex gap-2 items-center"><AiOutlineFileDone/>Certificate of completion</p>
              </div>
              <div onClick={handleshare} className="flex items-center text-yellow-25 cursor-pointer">
                <FaShareSquare className="text-[15px] font-extrabold"/>
                Share
              </div>
         </div>

      <div className="bg-richblack-800 py-6 px-[10%] " >
        <div className="flex flex-col w-[60%] items-start gap-3 justify-start">
          <p className="gap-3 text-[15px] text-pure-greys-200 flex items-center">
            <span>Home</span><span className="mx-2">/</span><span>Learning</span><span className="mx-2">/</span>
            <span className="text-yellow-50">{course_detail?.data?.details?.category?.name}</span>
          </p>
          <p className="font-semibold text-[25px]">{course_detail?.data?.details?.name}</p>
          <p className="text-pure-greys-300 text-left">{course_detail?.data?.details?.description}</p>
          <div className="flex flex-row gap-2">
            <p className="text-yellow-50">{avg_rating}</p>
            <RatingStars Review_Count={course_detail?.data?.details?.rating_and_review?.length || 0} Star_Size={20} />
            <p>({course_detail?.data?.details?.rating_and_review?.length || 0} reviews)</p>
            <p>{course_detail?.data?.details?.students_enrolled?.length || 0} students enrolled</p>
          </div>
          <p>Created by {course_detail?.data?.details?.instructor?.first_name} {course_detail?.data?.details?.instructor?.last_name}</p>
          <div className="flex flex-row items-center gap-4 text-pure-greys-50">
            <p>Created at {Date}</p>
            <p className="flex items-center gap-2"><FiGlobe/> English</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col justify-start items-start ml-[10%] mr-[40%] p-[1.3%] border border-pure-greys-500 mt-10">
        <h1 className="text-[30px] font-semibold mb-4">Course instructions</h1>
        <div className="flex flex-col items-start gap-2 text-pure-greys-50">
          {course_detail?.data?.details?.instructions.map((item, k) => (
            <p key={k}>• {item}</p>
          ))}
        </div>
      </div>

      <div className="flex flex-col justify-start items-start ml-[10%] mr-[40%] p-[1.3%] border border-pure-greys-500 mt-5">
        <h1 className="text-[30px] font-semibold mb-4">What you'll learn</h1>
        <p className="text-pure-greys-50 text-left">{course_detail?.data?.details?.what_you_will_learn}</p>
      </div>

      <div className="flex mt-[50px] flex-col px-[10%]">
        <p className="text-[28px] font-semibold text-start my-2">Course Content</p>
        <div className="flex flex-wrap justify-between gap-2">
          <div className="flex gap-2">
            <span>{(course_detail?.data?.details?.cource_content ?? []).length} section(s)</span>
            <span>{totalNoOfLectures} lecture(s)</span>
            <span>{course_detail?.data?.totalDuration || "0"} total length</span>
          </div>
          <button className="text-yellow-25" onClick={() => setIsActive([])}>Collapse all sections</button>
        </div>
      </div>

      <div className="px-[10%] mb-10">
        {(course_detail?.data?.details?.cource_content ?? []).map((course) => (
          <CourseAccordionBar
            key={course._id}
            course={{ ...course, subSections: course.subsections || [] }}
            isActive={isActive}
            handleActive={handleActive}
          />
        ))}
      </div>

      <div className="flex flex-col my-[50px] justify-start items-start ml-[10%] mr-[40%] gap-4">
        <h1 className=" font-extrabold text-[24px]">Author</h1>
        <div className="flex flex-row items-center gap-3">
          <img className="rounded-full w-[60px] h-[60px]" src={course_detail?.data?.details?.instructor?.image} alt="author" />
          <p className="font-bold text-[20px]">{course_detail?.data?.details?.instructor?.first_name} {course_detail?.data?.details?.instructor?.last_name}</p>
        </div>
        <p className="text-pure-greys-100 text-left">{course_detail?.data?.details?.instructor?.additionalDetails?.about || "No Bio Available"}</p>
      </div>
      
      <Footer />
      {confirmation_modal && <ConfirmationModal modal_data={confirmation_modal} />}
    </div>
  );
};

export default CourseDetails;