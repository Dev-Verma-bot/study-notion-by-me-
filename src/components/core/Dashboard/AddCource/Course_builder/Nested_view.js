import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RxDropdownMenu } from "react-icons/rx";
import { MdEdit } from "react-icons/md";
import { MdDeleteForever } from "react-icons/md";
import { deleteSection, deleteSubSection } from "../../../../../services/operations/courseDetailsApi";
import toast from "react-hot-toast";
import { IoMdArrowDropdown } from "react-icons/io";
import ConfirmationModal from "../../../../common/ConfirmationModal";
import { setCourse } from "../../../../../slices/courseSlice";
import { IoMdAdd } from "react-icons/io";
import Subsection_modal from "./Subsection_modal";

const Nested_view = ({ handle_change_section_name }) => {
  const { course } = useSelector((state) => state.course);
  const { token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const [add_subsection, Setadd_subsection] = useState(null);
  const [view_subsection, Setview_subsection] = useState(null);
  const [edit_subsection, Setedit_subsection] = useState(null);
  const [confrmation_modal, Setconfrmation_modal] = useState(null);
  const [loading, Setloading] = useState(false);

  // delete section ----------
  const handle_delete_section = async (section_id) => {
    Setloading(true);
    const result = await deleteSection({ section_id, cource_id: course._id }, token);
    Setloading(false);

    if (result) {
      dispatch(setCourse(result));
    }
    Setconfrmation_modal(null);
  };

  // delete subsection -----------
  const handle_delete_subsection = async (subsection_id,section_id) => {
    Setloading(true);
    const result = await deleteSubSection({ section_id:section_id,subsection_id, cource_id: course._id }, token);
    Setloading(false);

    if (result) {
      dispatch(setCourse(result));
    }
    Setconfrmation_modal(null);
  };

  return (
    <div className="text-white bg-richblack-700 rounded-md p-2 my-7 px-4 shadow-blue-300 shadow-lg">
      <div>
        {course?.cource_content?.map((k) => (
          <details key={k._id} open>
            <summary className="border-b-2 flex flex-row justify-between border-richblack-400 items-center">
              <div className="cursor-default flex flex-row items-center gap-4">
                <RxDropdownMenu />
                <p>{k.section_name}</p>
              </div>

              <div className="flex flex-row items-center gap-3">
                <button
                  onClick={() => handle_change_section_name(k.section_name, k._id)}
                >
                  <MdEdit />
                </button>

                <button
                  onClick={() =>
                    Setconfrmation_modal({
                      text1: "Delete this section!",
                      text2: "All lectures in this section will be deleted.",
                      button1_text: "Delete",
                      button2_text: "Cancel",
                      button1_handler: () => handle_delete_section(k._id),
                      button2_handler: () => Setconfrmation_modal(null),
                    })
                  }
                >
                  <MdDeleteForever />
                </button>

                <IoMdArrowDropdown />
              </div>
            </summary>

            {/* ================= Subsections ================= */}
            <div className="ml-6 mt-3">
              {k?.subsections?.map((t) => {
                return (
                  <div
                    key={t?._id}
                    className="flex flex-row justify-between items-center py-2"
                    onClick={() => {
                          Setedit_subsection(null);
                          Setadd_subsection(null);
                          Setview_subsection(t)
                        }}
                  >
                    <div className="flex flex-row gap-3 cursor-default items-center">
                      <RxDropdownMenu />
                      <p>{t.title}</p>
                    </div>

                    <div className="flex flex-row gap-3 items-center">
                      {/* edit */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          Setedit_subsection({ ...t, section_id: k._id });
                          Setadd_subsection(null);
                          Setview_subsection(null)
                        }}
                      >
                        <MdEdit />
                      </button>

                      {/* delete */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          Setconfrmation_modal({
                            text1: `Delete ${t.title}?`,
                            text2: "Are you sure to delete this lecture?",
                            button1_text: "Delete",
                            button2_text: "Cancel",
                            button1_handler: () => handle_delete_subsection(t._id,k._id),
                            button2_handler: () => Setconfrmation_modal(null),
                          });
                        }}
                      >
                        <MdDeleteForever />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* ADD SUBSECTION BUTTON */}
            <button
              className="flex flex-row gap-3 items-center bg-none border-none text-yellow-100 my-2"
              onClick={() => (Setadd_subsection({ section_id: k._id })
                            ,Setedit_subsection(null),Setview_subsection(null))}
            >
              <IoMdAdd />
              <p>Add Subsection</p>
            </button>
          </details>
        ))}

        {/* Confirmation Modal */}
        {confrmation_modal && (
          <ConfirmationModal modal_data={confrmation_modal} />
        )}

        {/* Subsection Modals */}
        {add_subsection && (
          <Subsection_modal
            modal_data={add_subsection}
            Setmodal_data={Setadd_subsection}
            add={true}
          />
        )}

        {edit_subsection && (
          <Subsection_modal
            modal_data={edit_subsection}
            Setmodal_data={Setedit_subsection}
            edit={true}
          />
        )}

        {view_subsection && (
          <Subsection_modal
            modal_data={view_subsection}
            Setmodal_data={Setview_subsection}
            view={true}
          />
        )}
      </div>
    </div>
  );
};

export default Nested_view;
