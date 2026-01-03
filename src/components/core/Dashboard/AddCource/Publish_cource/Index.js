import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { editCourseDetails } from "../../../../../services/operations/courseDetailsApi";
import { resetCourseState, setStep } from "../../../../../slices/courseSlice";
import Icon_button from "../../../../common/Icon_button";
import { COURSE_STATUS } from "../../../../../utils/constants";
import { useNavigate } from "react-router-dom";

const PublishCourse = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { token } = useSelector((state) => state.auth);
  const { course } = useSelector((state) => state.course);

  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    getValues,
    setValue,
  } = useForm();

  const isPublished = watch("status");

  // Pre-fill checkbox if course already published
  useEffect(() => {
    if (course?.status === COURSE_STATUS.PUBLISHED) {
      setValue("status", true);
    }
  }, []);

  const goToBack = () => {
    dispatch(setStep(2));
  };

  const goToCourses = () => {
    dispatch(resetCourseState());
    navigate("/dashboard/my-courses");
  };

const submit = async () => {
  const curr_val = getValues();

  if (
    (course?.status === COURSE_STATUS.PUBLISHED && curr_val.status) ||
    (course?.status === COURSE_STATUS.DRAFT && !curr_val.status)
  ) {
    goToCourses();
    return;
  }

  const payload = {
    cource_id: course._id,
    status: curr_val.status ? COURSE_STATUS.PUBLISHED : COURSE_STATUS.DRAFT,
  };

  setLoading(true);
    const result = await editCourseDetails(payload, token);
  setLoading(false);

  if (result) goToCourses();
};


  return (
    <div className="justify-evenly p-9 py-7 gap-4 rounded-md flex flex-col mx-auto 
      border border-blue-100 text-white shadow-md bg-richblack-800"
    >
      <h1 className="font-bold text-[30px]">Publish Settings</h1>

      <form
        onSubmit={handleSubmit(submit)}
        className="text-white flex flex-col gap-6"
      >
        <div className="flex gap-3 items-center cursor-pointer">
          <input
            id="Publish"
            type="checkbox"
            {...register("status")}
          />
          <label htmlFor="Publish">Make this course public</label>
        </div>

        {/* Buttons Row */}
        <div className="flex flex-row justify-end gap-2 items-center">

          <button
            type="button"
            className="flex font-bold flex-row items-center justify-evenly rounded-md py-2 border  px-4 text-black bg-richblack-400
              hover:opacity-60 transition-all duration-150 cursor-pointer"
            onClick={goToBack}
          >
            Back
          </button>

          <button type="submit">
            <Icon_button
              text={isPublished ? "Publish" : "Save Changes"}
            />
          </button>

        </div>
      </form>
    </div>
  );
};

export default PublishCourse;
