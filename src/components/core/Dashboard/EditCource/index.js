import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import RenderSteps from "../AddCource/RenderSteps";
import { getFullDetailsOfCourse } from "../../../../services/operations/courseDetailsApi";
import { setCourse, setEditCourse } from "../../../../slices/courseSlice";

const Editcourse = () => {
  const { courseId } = useParams();

  const { course } = useSelector((state) => state.course);
  const { token } = useSelector((state) => state.auth);

  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const fetch_course = async () => {
    setLoading(true);

    const response = await getFullDetailsOfCourse(courseId, token);

    if (response?.courseDetails) {
      dispatch(setEditCourse(true));
      dispatch(setCourse(response.courseDetails)); // ✅ FIXED
    }

    setLoading(false);
  };

  useEffect(() => {
    fetch_course();
  }, []);

  if (loading) {
    return <div className="text-white font-bold">Loading...</div>;
  }

  return (
    <div className="w-[60%] mx-auto text-white">
      <h1 className="font-bold text-[30px] mb-5">Edit Course</h1>

      <div >
        {course ? (
          <RenderSteps />
        ) : (
          <p className="text-center font-bold text-[20px] mt-[20%]">
            Course not found !
          </p>
        )}
      </div>
    </div>
  );
};

export default Editcourse;
