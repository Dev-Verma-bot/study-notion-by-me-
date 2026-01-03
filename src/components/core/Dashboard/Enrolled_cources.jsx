import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import ProgressBar from "@ramonak/react-progress-bar";
import { getUserEnrolledCourses } from "../../../services/operations/profileApi";

const EnrolledCourses = () => {
  const { token } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [enrolledCourses, setEnrolledCourses] = useState(null);

  // Helper function to format seconds into a readable string
  const formatDuration = (totalSeconds) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = Math.floor(totalSeconds % 60);

    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m ${seconds}s`;
  };

  const fetchEnrolledCourses = async () => {
    try {
      const response = await getUserEnrolledCourses(token);
      // IMPORTANT: Based on your JSON, the array is inside response.data.data
      // If your profileApi already returns 'response.data', then use 'response.data' here.
      const rawCourses = response?.data?.data || response?.data || response || [];

      
      const coursesWithDuration = rawCourses.map((course) => {
        let totalDurationSeconds = 0;
        
        // Matches your backend spelling "cource_content"
        course.cource_content?.forEach((section) => {
          section.subsections?.forEach((sub) => {
            totalDurationSeconds += parseFloat(sub.time_duration || 0);
          });
        });

        return {
          ...course,
          totalDuration: formatDuration(totalDurationSeconds),
        };
      });

      setEnrolledCourses(coursesWithDuration);
    } catch (error) {
            setEnrolledCourses([]); // Set to empty array to stop loading state
    }
  };

  useEffect(() => {
    fetchEnrolledCourses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="text-white mt-[2%] w-[90%] mx-auto">
      <div className="text-3xl  font-bold mb-5">Enrolled Courses</div>

      {enrolledCourses === null ? (
        <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
          <div className="spinner">Loading...</div>
        </div>
      ) : enrolledCourses.length === 0 ? (
        <p className="grid h-[10vh] w-full place-content-center text-richblack-5">
          You have not enrolled in any course yet.
        </p>
      ) : (
        <div className="my-8 text-richblack-5">
          {/* Table Headings */}
          <div className="flex rounded-t-lg bg-richblack-500">
            <p className="w-[45%] px-5 py-3">Course Name</p>
            <p className="w-1/4 px-2 py-3">Duration</p>
            <p className="flex-1 px-2 py-3">Progress</p>
          </div>

          {/* Course List Mapping */}
          {enrolledCourses.map((course, index, arr) => (
            <div
              key={course._id}
              className={`flex items-center border border-richblack-700 ${
                index === arr.length - 1 ? "rounded-b-lg" : "rounded-none"
              }`}
            >
              {/* Course Info & Navigation */}
              <div
                className="flex w-[45%] cursor-pointer items-center gap-4 px-5 py-3"
                onClick={() => {
                  navigate(
                    `/view-course/${course?._id}/section/${course?.cource_content?.[0]?._id}/sub-section/${course?.cource_content?.[0]?.subsections?.[0]?._id}`
                  );
                }}
              >
                <img
                  src={course.thumbnail}
                  alt="thumbnail"
                  className="h-14 w-14 rounded-lg object-cover"
                />
                <div className="flex max-w-xs flex-col gap-2">
                  <p className="font-semibold">{course.name}</p>
                  <p className="text-xs text-richblack-300">
                    {course.description.length > 50
                      ? `${course.description.slice(0, 50)}...`
                      : course.description}
                  </p>
                </div>
              </div>

              {/* Duration */}
              <div className="w-1/4 px-2 py-3">
                {course?.totalDuration}
              </div>

              {/* Progress Bar */}
              <div className="flex w-1/5 flex-col gap-2 px-2 py-3">
                <p>Progress: {course.progressPercentage || 0}%</p>
                <ProgressBar
                  completed={course.progressPercentage || 0}
                  height="8px"
                  isLabelVisible={false}
                  baseBgColor="#2C333F"
                  bgColor="#47A5C5"
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EnrolledCourses;