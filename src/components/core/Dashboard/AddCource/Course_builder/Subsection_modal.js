import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import {
  createSubSection,
  updateSubSection,
} from "../../../../../services/operations/courseDetailsApi";
import { setCourse } from "../../../../../slices/courseSlice";
import { MdCancel } from "react-icons/md";
import Upload from "../Upload";
import Icon_button from "../../../../common/Icon_button";

const Subsection_modal = ({
  modal_data,
  Setmodal_data,
  view = false,
  add = false,
  edit = false,
}) => {
  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm();

  const dispatch = useDispatch();
  const [loading, Setloading] = useState(false);

  const { course } = useSelector((state) => state.course);
  const { token } = useSelector((state) => state.auth);

  // Prefill when editing or viewing
  useEffect(() => {
    if (view || edit) {
      setValue("title", modal_data.title);
      setValue("description", modal_data.description);
    
    }
  }, []);

  const handle_add_subsection = async () => {
    const data = getValues();
    const form = new FormData();

    form.append("cource_id", course._id);
    form.append("section_id", modal_data.section_id); // modal_data contains sectionId
    form.append("title", data.title);
    form.append("description", data.description);

    if (data.video) form.append("video", data.video);

    Setloading(true);
    const result = await createSubSection(form, token);
    Setloading(false);

    if (result) {
      dispatch(setCourse(result));
      toast.success("Lecture added!");
    }

    Setmodal_data(null);
  };

  const handle_edit_subsection = async () => {
    const currval = getValues();
    const form = new FormData();

    form.append("cource_id", course._id);
    form.append("section_id", modal_data.section_id);
    form.append("subsection_id", modal_data._id);
    form.append("title", currval.title);
    form.append("description", currval.description);

    // Only append video if user SELECTED a new file
    if (currval.video && currval.video instanceof File) {
      form.append("video", currval.video);
    }

    Setloading(true);
    const result = await updateSubSection(form, token);
    Setloading(false);

    if (result) {
      dispatch(setCourse(result));
      toast.success("Lecture updated!");
    }

    Setmodal_data(null);
  };

const is_form_updated = () => {
  const curr = getValues();

  const titleChanged = curr.title !== modal_data.title;
  const descChanged = curr.description !== modal_data.description;

  const videoChanged = curr.video instanceof File;

  return titleChanged || descChanged || videoChanged;
};



  const on_submit = async () => {
    if (view) return;

    if (edit) {
      if (!is_form_updated()) {
        toast.error("Nothing to update!");
        return;
      }
      return handle_edit_subsection();
    }

    if (add) return handle_add_subsection();
  };

  return (
    <form onSubmit={handleSubmit(on_submit)}>
      <div className="bg-richblack-800 pb-5 shadow-blue-100 flex flex-col gap-5 items-center rounded-md text-white border-richblack-25">
        <div className="flex flex-row w-full rounded-t-md py-6 items-center justify-between bg-richblack-700">
          <p className="font-bold text-[20px]">
            {add && "Adding Lecture"}
            {view && "Viewing Lecture"}
            {edit && "Editing Lecture"}
          </p>

          <div
            onClick={() => (!loading ? Setmodal_data(null) : {})}
            className="text-richblack-5 cursor-pointer text-[25px]"
          >
            <MdCancel />
          </div>
        </div>

        {/* UPLOAD FIELD */}
        <Upload
          name={"video"}
          label={"Lecture"}
          video={true}
          register={register}
          setValue={setValue}
          errors={errors}
          viewData={view ? modal_data.video_url : null}
          editData={edit ? modal_data.video_url : null}
          required={add}
        />

        <div className="w-[90%] flex flex-col gap-2">
          <label htmlFor="name">
            Lecture Title <span className="text-yellow-100">*</span>
          </label>
          <input
            id="name"
            placeholder="Enter Lecture Title"
            {...register("title", { required: true })}
            className="w-full px-4 py-3 rounded-md bg-richblack-700 text-white border border-richblack-500"
          />
          {errors.title && <span>Enter Title</span>}
        </div>

        {/* DESCRIPTION */}
        <div className="w-[90%] flex flex-col gap-2">
          <label htmlFor="description">
            Lecture Description <span className="text-yellow-100">*</span>
          </label>
          <textarea
            id="description"
            rows="7"
            placeholder="Enter Lecture Description"
            {...register("description", { required: true })}
            className="w-full px-4 py-3 rounded-md bg-richblack-700 text-white border border-richblack-500"
          />
          {errors.description && <span>Enter Description</span>}
        </div>

      <Icon_button
  disabled={loading}
  text={!edit ? (!view ? "Add" : "Back") : "Save Changes"}
  type={view ? "button" : "submit"}
  onClick={view ? () => Setmodal_data(null) : ""}
/>
  </div>
    </form>
  );
};

export default Subsection_modal;
