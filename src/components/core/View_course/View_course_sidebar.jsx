import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { BsChevronDown } from "react-icons/bs";
import { IoIosArrowBack } from "react-icons/io";
import Icon_button from "../../common/Icon_button";

const View_course_sidebar = ({ Setreview_modal }) => {
  const [activeStatus, setActiveStatus] = useState("");
  const [videoBarActive, setVideoBarActive] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  
  const { sectionID, subsectionID } = useParams();
  const {
    courseSectionData,
    courseEntireData,
    totalNoOfLectures,
    completedLectures,
  } = useSelector((state) => state.viewCourse);

  
  useEffect(() => {
    (() => {
      if (!courseSectionData || !courseSectionData.length) return;

      const currentSectionIndx = courseSectionData.findIndex(
        (data) => data._id === sectionID
      );

      const currentSubSectionIndx = courseSectionData[currentSectionIndx]
        ?.subsections?.findIndex((data) => data._id === subsectionID);

      const activeSubSectionId =
        courseSectionData[currentSectionIndx]?.subsections?.[
          currentSubSectionIndx
        ]?._id;

      setActiveStatus(courseSectionData?.[currentSectionIndx]?._id);
      setVideoBarActive(activeSubSectionId);
    })();
  }, [courseSectionData, courseEntireData, location.pathname, sectionID, subsectionID]);

   return (
    <>
      <div className="flex h-[calc(100vh-3.5rem)] w-[320px] max-w-[350px] flex-col border-r-[1px] border-r-richblack-700 bg-richblack-800">
        {/* Header Section */}
        <div className="mx-5 flex flex-col items-start justify-between gap-2 gap-y-4 border-b border-richblack-600 py-5 text-lg font-bold text-richblack-25">
          <div className="flex w-full items-center justify-between ">
            <div
              onClick={() => navigate(`/dashboard/enrolled-courses`)}
              className="flex h-[35px] w-[35px] items-center justify-center rounded-full bg-richblack-100 p-1 text-richblack-700 hover:scale-90 cursor-pointer"
              title="back"
            >
              <IoIosArrowBack size={30} />
            </div>
            <Icon_button
              text="Add Review"
              customClasses="ml-auto"
              onClick={() => Setreview_modal(true)}
            />
          </div>
          <div className="flex flex-col">
            <p>{courseEntireData?.name}</p>
            <p className="text-sm font-semibold text-richblack-500">
              {completedLectures?.length} / {totalNoOfLectures}
            </p>
          </div>
        </div>

        {/* Sections and Subsections */}
        <div className="h-[calc(100vh-5rem)] overflow-y-auto">
          {courseSectionData.map((section, index) => (
            <div
              className="mt-2 cursor-pointer text-sm text-richblack-5"
              onClick={() => setActiveStatus(section?._id)}
              key={index}
            >
              {/* Section Accordion */}
              <div className="flex flex-row justify-between bg-richblack-600 px-5 py-4">
                <div className="w-[70%] font-semibold">
                  {section?.section_name}
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={`${
                      activeStatus === section?._id ? "rotate-0" : "rotate-180"
                    } transition-all duration-500`}
                  >
                    <BsChevronDown />
                  </span>
                </div>
              </div>

              {/* Sub-sections (Lectures) */}
              {activeStatus === section?._id && (
                <div className="transition-[height] duration-500 ease-in-out">
                  {section.subsections?.map((topic, i) => (
                    <div
                      className={`flex gap-3 px-5 py-2 ${
                        videoBarActive === topic._id
                          ? "bg-yellow-200 font-semibold text-richblack-800"
                          : "hover:bg-richblack-900"
                      } `}
                      key={i}
                      onClick={(e) => {
                        e.stopPropagation(); // Prevents toggling the section accordion
                        navigate(
                          `/view-course/${courseEntireData?._id}/section/${section?._id}/sub-section/${topic?._id}`
                        );
                        // setVideoBarActive(topic._id);
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={completedLectures?.includes(topic?._id)}
                        readOnly
                        onClick={(e) => e.stopPropagation()}
                      />
                      {topic.title}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default View_course_sidebar;