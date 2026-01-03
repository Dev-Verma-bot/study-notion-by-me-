import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { IoIosAddCircleOutline } from "react-icons/io";
import Icon_button from "../../../../common/Icon_button";
import { useDispatch, useSelector } from "react-redux";
import { LuArrowBigRightDash } from "react-icons/lu";
import Nested_view from "./Nested_view";
import { LuArrowBigLeft } from "react-icons/lu";
import { setCourse, setEditCourse, setStep } from "../../../../../slices/courseSlice";
import toast from "react-hot-toast";
import { createSection, updateSection } from "../../../../../services/operations/courseDetailsApi";

const Course_builder_form = () => {
  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    watch,
    formState: { errors },
  } = useForm();

  const [edit_section, setEdit_section] = useState(null);
  const {course}= useSelector((state)=>state.course);
  const dispatch= useDispatch();
  const [loading,Setloading]= useState(false);
  const {token}= useSelector((state)=>state.auth);
  const cancel_edit=()=>{
    setEdit_section(null);
    setValue("section_name","");
  }
  const Go_to_back= ()=>{
    dispatch(setStep(1));
    dispatch(setEditCourse(1));    
  }
    const Go_to_next= ()=>{
    
    if(course.cource_content.length==0){
      toast.error("Please add atleast one section!");
      return;
    }
    if(course.cource_content.some((section)=>section.subsections.length==0)){
     toast.error("Please add atleast one lecture to each section!");
      return;
    }
    dispatch(setStep(3));  
  }
  const handle_change_section_name=(section_name,section_id)=>{
    if(edit_section===section_id){
      cancel_edit();
      return ;
    }
    setEdit_section(section_id);
    setValue("section_name",section_name);
  }
  const on_submit= async(data)=>{
    Setloading(true);
    let result;

    if(edit_section){
      result= await updateSection(
        {
          section_name:data.section_name,
          cource_id:course._id,
          section_id:edit_section,
        },token);
    }
    else{
      result=await createSection(
        {
          section_name:data.section_name,
          cource_id:course._id,
        },token);
    }
        if(result){
      dispatch(setCourse(result));
      setEdit_section(null);
      setValue("section_name","");
    }
    Setloading(false);
  }
  return (
    <div
      className="justify-evenly p-9 py-7 gap-4 rounded-md flex flex-col mx-auto 
                 border border-blue-100 text-white shadow-md bg-richblack-800"
    >
      <div className="font-bold">Course Builder</div>

    <form onSubmit={handleSubmit(on_submit)} className="flex flex-col items-start gap-4 justify-evenly">
      <div className="w-[90%] flex flex-col gap-2">
        <label htmlFor="name">
          Section Name <span className="text-yellow-100">*</span>
        </label>
        <input
          id="name"
          placeholder="Enter Section Name"
          {...register("section_name", { required: true })}
          className="w-full px-4 py-3 rounded-md bg-richblack-700 text-white border border-richblack-500 focus:ring-2 focus:ring-blue-100 placeholder:text-richblack-300"
        />
        {errors.name && <span>Enter name</span>}
      </div>

      {/* Create/Edit Section Button */}
      <div className="flex gap-3 flex-row items-center justify-evenly">
      {edit_section ? (
        <Icon_button  type="submit" text="Edit_Section" outline={true}
        customClasses={"flex flex-row items-center justify between  text-yellow-100"}
        >
          <IoIosAddCircleOutline className="text-yellow-100"/>
        </Icon_button>
       
      ) : (
        <Icon_button  type="submit" text="Create_Section" outline={true}
          customClasses={"text-yellow-100 items-center justify between  flex flex-row"}>
          <IoIosAddCircleOutline className="text-yellow-100"/>
        </Icon_button>
      )}
      {
        edit_section&&<button
        type="button"
        onClick={cancel_edit}
        className="text-white font-bold cursor-pointer underline
         hover:text-yellow-25 transition-all duration-150">Cancel Edit</button>
      }
      </div>

    </form>
     {course?.cource_content?.length > 0 && (
  <Nested_view handle_change_section_name={handle_change_section_name} />
)}


      {/* back and next button  */}
      <div className="flex flex-row gap-2 items-center">
        <button
        className="flex font-bold flex-row items-center justify-evenly rounded-md py-2 border  px-4 text-black bg-richblack-400
         hover:bg-none hover:opacity-60 transition-all duration-150 cursor-pointer"
        onClick={Go_to_back}>
         <LuArrowBigLeft className="text-black" />

          Back
        </button>
        <Icon_button text={"Next"} onClick={Go_to_next}>
        
        </Icon_button>
      </div>
      
    </div>
  );
};

export default Course_builder_form;
