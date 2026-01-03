import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getFullDetailsOfCourse } from "../services/operations/courseDetailsApi";
import { 
    setCompletedLectures, 
    setCourseSectionData, 
    setEntireCourseData, 
    setTotalNoOfLectures 
} from "../slices/viewCourseSlice";
import Course_review_modal from "../components/core/View_course/Course_review_modal";
import { Outlet } from "react-router-dom";
import View_course_sidebar from "../components/core/View_course/View_course_sidebar";

const View_course = () => {
    const [review_modal, Setreview_modal] = useState(false);
    const { courseID } = useParams();
    const { token } = useSelector((state) => state.auth);
    const dispatch = useDispatch();

    const fetch_course_details = async () => {
        try {
            const response = await getFullDetailsOfCourse(courseID, token);
            
            if (response) {
                const sections = response?.courseDetails?.cource_content || [];
                
                dispatch(setCourseSectionData(sections));
                dispatch(setEntireCourseData(response?.courseDetails));
                dispatch(setCompletedLectures(response?.completedVideos || []));

                let lectures = 0;
                sections.forEach((sec) => {
                    lectures += sec?.subsections?.length || 0;
                });
                dispatch(setTotalNoOfLectures(lectures));
            }
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetch_course_details();
    }, [courseID, token]);

    return (
        <>
            <div className="relative flex min-h-[calc(100vh-3.5rem)]">
                <View_course_sidebar Setreview_modal={Setreview_modal} />
                <div className="flex-1 h-[calc(100vh-3.5rem)] overflow-auto bg-richblack-900">
                    <div className="mx-6">
                        <Outlet />
                    </div>
                </div>
            </div>
            {review_modal && (
                <Course_review_modal Setreview_modal={Setreview_modal} />
            )}
        </>
    );
};

export default View_course;