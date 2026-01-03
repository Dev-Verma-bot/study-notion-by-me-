import React, { useEffect, useState } from "react";
import Icon_button from "../../common/Icon_button";
import { IoAdd, IoCheckmarkDoneCircle } from "react-icons/io5";
import { MdAccessTimeFilled, MdDeleteForever } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import {
  deleteCourse,
  fetchInstructorCourses,
} from "../../../services/operations/courseDetailsApi";
import ConfirmationModal from "../../common/ConfirmationModal";
import { useSelector } from "react-redux";

const My_course = () => {
  const navigate = useNavigate();
  const [allcourses, setAllCourses] = useState([]);
  const [modal_data, setModal_data] = useState(null);
  const [loading, Setloading] = useState(false);
  const { token } = useSelector((state) => state.auth);

  const handle_onclick = () => {
    navigate("/dashboard/add-course");
  };

  const fetch_all_courses = async () => {
    Setloading(true);
    const response = await fetchInstructorCourses(token);
    if (response) {
      setAllCourses(response);
    }
    Setloading(false);
  };

  const handle_delete = async (cource_id) => {
    const response = await deleteCourse({ cource_id }, token);
          setModal_data(null);
    
      fetch_all_courses();
    
  };

  const handle_edit = (courseId) => {
    navigate(`/dashboard/edit-course/${courseId}`);
  };

  useEffect(() => {
    fetch_all_courses();
  }, []);

  return (
    <>
      {allcourses.length=== 0 ? (
        <div className="text-white font-bold text-center mt-[20%]">No Courses!</div>
      ) : (
        <div className="flex flex-col w-[80%] mt-[5%] mx-auto text-white">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <p className="font-bold text-[30px]">My Courses</p>
            <Icon_button text="Add Course" onClick={handle_onclick}>
              <IoAdd />
            </Icon_button>
          </div>

          {/* Table */}
          <div>
            {/* Table Header */}
            <div className="grid grid-cols-[40%_15%_15%_15%] py-3 px-4 text-richblack-300 text-[15px] font-bold">
              <p>COURSES</p>
              <p className="text-center">DURATION</p>
              <p className="text-center">PRICE</p>
              <p className="text-center">ACTION</p>
            </div>

            {/* Course Rows */}
            {allcourses.map((p) => {
              const createdDate = new Date(p.created_at);

              const formattedDate = createdDate.toLocaleDateString("en-IN", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              });

              const formattedTime = createdDate.toLocaleTimeString("en-IN", {
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
              });

              return (
                <div
                  key={p._id}
                  className="grid grid-cols-[40%_15%_15%_15%] items-center py-4 px-4 border-t border-richblack-700"
                >
                  {/* Course Info */}
                  <div className="flex items-center gap-4">
                    <img
                      src={p.thumbnail}
                      alt={p.name}
                      className="w-[100px] rounded-md object-cover"
                    />

                    <div className="flex flex-col gap-2">
                      <div>
                        <p className="font-semibold">{p.name}</p>
                        <p className="text-sm text-richblack-200">
                          {p.description}
                        </p>
                      </div>

                      <p className="text-xs text-richblack-300">
                        <span className="text-white">Created :</span>{" "}
                        {formattedDate} at {formattedTime}
                      </p>

                      <div
                        className={`flex items-center gap-2 px-4 py-1 rounded-full w-fit font-bold bg-richblack-800 ${
                          p.status === "Published"
                            ? "text-yellow-50"
                            : "text-pure-greys-5"
                        }`}
                      >
                        {p.status === "Published" ? (
                          <IoCheckmarkDoneCircle />
                        ) : (
                          <MdAccessTimeFilled />
                        )}
                        {p.status}
                      </div>
                    </div>
                  </div>

                  {/* Duration */}
                  <p className="text-center">—</p>

                  {/* Price */}
                  <p className="text-center font-bold text-richblack-50">
                    ₹ {p.price}
                  </p>

                  {/* Action */}
                  <div className="flex justify-center gap-3 text-lg">
                    <button onClick={() => handle_edit(p._id)}>
                      <FaEdit />
                    </button>

                    <button
                      disabled={loading}
                      onClick={() =>
                        setModal_data({
                          text1: `Delete ${p.name}`,
                          text2:
                            "Are you sure you want to delete this course?",
                          button1_text: "Delete",
                          button2_text: "Cancel",
                          button1_handler: loading?()=>{}:() => handle_delete(p._id),
                          button2_handler: loading?()=>{}:() => setModal_data(null),
                        })
                      }
                    >
                      <MdDeleteForever />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {modal_data && <ConfirmationModal modal_data={modal_data} />}
        </div>
      )}
    </>
  );
};

export default My_course;
