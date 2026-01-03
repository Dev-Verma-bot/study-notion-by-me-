import { Route, Routes } from "react-router-dom";
import "./App.css";
import Home from "./pages/Home";
import Navbar from "./components/common/Navbar";
import { useState } from "react";
import Login from "./pages/Login";
import Sign_up from "./pages/Sign_up";
import Forgot_pass from "./pages/Forgot_pass";
import Update_pass from "./pages/Update_pass";
import { useSelector } from "react-redux";
import Error_page from "./pages/Error";
import Reset_complete from "./pages/Reset_complete";
import Verify_email from "./pages/Verify_email";
import About from "./pages/About";
import ContactUs_page from "./pages/Contactus";
import Dashboard from "./pages/Dashboard";
import MyProfile from "./components/core/Dashboard/MyProfile";
import PrivateRoute from "./components/core/auth/PrivateRoute";
import Settings from "./components/core/Dashboard/Settings";
import Enrolled_cources from "./components/core/Dashboard/Enrolled_cources";
import Cart from "./components/core/Dashboard/Cart";
import AddCourse from "./components/core/Dashboard/AddCource/Index";
import Course_builder_form from "./components/core/Dashboard/AddCource/Course_builder/Course_builder_form";
import My_course from "./components/core/Dashboard/My_course";
import Editcourse from "./components/core/Dashboard/EditCource";
import Catalog from "./pages/Catalog";
import VideoDetails from "./components/core/View_course/VideoDetails";
import CourseDetails from "./pages/CourseDetails";
import { ACCOUNT_TYPE } from "./utils/constants";
import View_course from "./pages/View_course";
import Instructor from "./components/core/Dashboard/Instructor_dashboard/Instructor";
function App() {
  const [Seen, SetSeen] = useState(false);
  const [Seen1, SetSeen1] = useState(false);
  const [Seen2, SetSeen2] = useState(false);

  // Access token from Redux store
  const { reset_pass_token } = useSelector((state) => state.auth);
  const {user}= useSelector((state)=>state.profile)
  if (reset_pass_token !== "") {
            
  }

  return (
    <div className="w-screen bg-richblack-900 flex flex-col min-h-screen gap-3 font-inter">
      <Navbar />
      <Routes>
        <Route
          path="/login"
          element={<Login  Seen={Seen} SetSeen={SetSeen} />}
        />
        <Route
          path="/Signup"
          element={
            <Sign_up Seen1={Seen1} Seen2={Seen2} SetSeen1={SetSeen1} SetSeen2={SetSeen2} />
          }
        />
        <Route path="/reset_pass" element={<Forgot_pass />} />
        <Route path="/verify_email" element={<Verify_email/>} />
        <Route path="/reset_pass/:reset_pass_token" element={<Update_pass />} />
        <Route path="/" element={<Home />} />
        <Route path= "/reset_pass/reset_complete" element ={<Reset_complete/>}></Route>
        <Route path="/about" element={<About/>}></Route>
        <Route path="/contact" element={<ContactUs_page/>}></Route>
        <Route path="/catalog/:catalogName" element={<Catalog/>}></Route>
        <Route path="/courses/:courseID" element={<CourseDetails/>}></Route>
        
          <Route 
          element={
            <PrivateRoute>
              <Dashboard/>
            </PrivateRoute>
          }
          >
           <Route path="dashboard/my-profile" element={<MyProfile/>} />
           <Route path="dashboard/Settings" element={<Settings />} />
           

              {
        user?.role === "Student" && (
          <>
          <Route path="dashboard/cart" element={<Cart />} />
          <Route path="dashboard/enrolled-courses" element={<Enrolled_cources/>}/>
          </>
        )
      }
              {
        user?.role === "Instructor" && (
          <>
          <Route path="dashboard/add-course" element={<AddCourse/>} />
          <Route path="dashboard/my-courses" element ={<My_course/>}/>
          <Route path="dashboard/edit-course/:courseId" element={<Editcourse/>}/>
          <Route path="dashboard/instructor" element={<Instructor/>}/>
          </>
        )
      }
          </Route>
          <Route path="course_builder" element={<Course_builder_form></Course_builder_form>}></Route>
      

         <Route 
          element={
            <PrivateRoute>
              <View_course/>
            </PrivateRoute>
          }
          >
            {
              user?.role===ACCOUNT_TYPE.STUDENT&&(
                <>
                <Route
                path="view-course/:courseID/section/:sectionID/sub-section/:subsectionID"
                element={<VideoDetails/>}
                />
                </>
              )
            }
            </Route>      
        <Route path="*" element={<Error_page/>}></Route>
      </Routes>
    </div>
  );
}

export default App;
