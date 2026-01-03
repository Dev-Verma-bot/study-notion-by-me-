import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { ApiConnect } from "../../services/ApiConnect";
import { contactusEndpoint } from "../../services/Apis";
import countryCode from "../../data/countrycode.json"
const ContactUsForm = () => {
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitSuccessful },
  } = useForm();

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset({
        first_name: "",
        last_name: "",
        email: "",
        phoneNo: "",
        message: "",
      });
    }
  }, [isSubmitSuccessful, reset]);

  const submit_contact_form =async (data) => {
    setLoading(true);
        try{
        const response={status:"ok"};
                setLoading(false);
    }
    catch(error){
                setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(submit_contact_form)}>
        <div className="flex flex-col gap-4 w-fit">
      <div className="flex flex-row gap-3">
           {/* First Name */}
      <div className=" flex flex-col gap-2">
        <label htmlFor="first_name">First Name</label>
        <input
        className="bg-richblack-800 rounded-md p-2 "
          type="text"
          id="first_name"
          name="first_name"
          placeholder="Enter first name"
          {...register("first_name", { required: true })}
        
        />
        {errors.first_name && <span>Enter first name</span>}
      </div>
      {/* last name  */}
        <div className=" flex flex-col gap-2">
        <label htmlFor="last_name">Last Name</label>
        <input
             className="bg-richblack-800 rounded-md p-2 "
          type="text"
          id="last_name"
          name="last_name"
          placeholder="Enter last name"
          {...register("last_name")}
        
        />
      </div>
    </div>
   {/* Email  */}
        <div className=" flex flex-col gap-2">
        <label htmlFor="email">Email</label>
        <input
          type="text"
          id="email"
          name="email"
          placeholder="Enter email name"
               className="bg-richblack-800 rounded-md p-2 "
          {...register("email", { required: true })}
        
        />
        {errors.email && <span>Enter email</span>}
      </div>    

{/* phone no  */}

<div className="flex flex-col">
    <label htmlFor="phoneNo">Phone Number</label>
    <div className="flex flex-row gap-3">
        {/* dropdown  */}
        
        <select
        className="bg-richblack-800 rounded-md p-2 max-w-[66px]"
        name="dropdown"
        id="dropdown"
        {...register("countryCode",{required:true})}
        >
         {countryCode.map((k, index) => (
        <option key={index} value={k.code}>
            {k.code} - {k.country}
        </option>
        ))}

        </select>

        {/* phone no  */}
        <div className=" flex flex-col">
        <input
  type="number"
  id="phoneNo"
  name="phoneNo"
  placeholder="XXXXXXXXXX"
  
  className="bg-richblack-800 rounded-md p-2"
  {...register("phoneNo", {
    required: {value:true,message:"Please enter phone no."},
    maxLength:{value:10,message:"Invalid phone no."},
    minLength:{value:8,message:"Invalid phone no."},
  })}
/>
        </div>
        
    </div>
    
{errors.phoneNo && <span>{errors.phoneNo.message}</span>}     

</div>
    {/* message  */}
       <div className=" flex flex-col gap-2">
        <label htmlFor="message">Message</label>
        <textarea
            cols={30}
            rows={7 }
          id="message"
          name="message"
          placeholder="Enter message"
               className="bg-richblack-800 rounded-md p-2 "
          {...register("message",{required:true})}
        />
        {errors.message&&(
            <span>Enter message</span>
        )}
      </div> 
</div>
     
      <button className="my-8 bg-yellow-50 text-black text-[20px] font-bold 
      w-full py-2 hover:scale-95 duration-200 transition-all" 
      type="submit" >
        {loading ? "Submitting..." : "Submit"}
      </button>
    </form>
  );
};

export default ContactUsForm;
