import React from "react";
import Contact_us_form from "../../common/Contact_us_form";

const Contact_Form=()=>{
    return (
  <div className="flex text-white flex-col gap-6 justify-center items-center">
    <h1 className="font-bold text-[35px]">Get in Touch</h1>
    <p className="opacity-50">We'd love to here for you, Please fill out this form.</p>
    <Contact_us_form/>
  </div>
    );
}
export default Contact_Form;