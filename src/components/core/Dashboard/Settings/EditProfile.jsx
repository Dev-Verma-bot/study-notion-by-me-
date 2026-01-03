import { useForm } from "react-hook-form"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"

import { updateProfile } from "../../../../services/operations/SettingsAPI"
import Icon_button from "../../../common/Icon_button"

const genders = ["Male", "Female", "Non-Binary", "Prefer not to say", "Other"]

export default function EditProfile() {
  const { user } = useSelector((state) => state.profile)
  const { token } = useSelector((state) => state.auth)
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()

  const submitProfileForm = async (data) => {
    // console.log("Form Data - ", data)
    // console.log("User - ", user)
    try {
      dispatch(updateProfile(token, data))
    } catch (error) {
      console.log("ERROR MESSAGE - ", error.message)
    }
  }

  return (
    <form onSubmit={handleSubmit(submitProfileForm)}>
      {/* Profile Information */}
      <div className="my-10 flex flex-col gap-y-6 rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-8 px-12">
        <h2 className="text-lg font-semibold text-richblack-5">
          Profile Information
        </h2>

        {/* First Name & Last Name */}
        <div className="flex flex-col gap-5 lg:flex-row">
          {/* First Name */}
          <div className="flex flex-col gap-2 lg:w-[48%]">
            <label htmlFor="first_name" className="lable-style">
              First Name
            </label>
            <input
              type="text"
              name="first_name"
              id="first_name"
              placeholder="Enter first name"
              className="form-style"
              {...register("first_name", { required: true })}
              defaultValue={user?.first_name}
            />
            {errors.first_name && (
              <span className="-mt-1 text-[12px] text-yellow-100">
                Please enter your first name.
              </span>
            )}
          </div>

          {/* Last Name */}
          <div className="flex flex-col gap-2 lg:w-[48%]">
            <label htmlFor="last_name" className="lable-style">
              Last Name
            </label>
            <input
              type="text"
              name="last_name"
              id="last_name"
              placeholder="Enter last name"
              className="form-style"
              {...register("last_name", { required: true })}
              defaultValue={user?.last_name}
            />
            {errors.last_name && (
              <span className="-mt-1 text-[12px] text-yellow-100">
                Please enter your last name.
              </span>
            )}
          </div>
        </div>

        {/* Date of Birth & Gender */}
        <div className="flex flex-col gap-5 lg:flex-row">
          {/* Date of Birth */}
          <div className="flex flex-col gap-2 lg:w-[48%]">
            <label htmlFor="dob" className="lable-style">
              Date of Birth
            </label>
            <input
              type="date"
              name="dob"
              id="dob"
              className="form-style"
              {...register("dob", {
                required: {
                  value: true,
                  message: "Please enter your Date of Birth.",
                },
                max: {
                  value: new Date().toISOString().split("T")[0],
                  message: "Date of Birth cannot be in the future.",
                },
              })}
              defaultValue={user?.profile?.dob}
            />
            {errors.dob && (
              <span className="-mt-1 text-[12px] text-yellow-100">
                {errors.dob.message}
              </span>
            )}
          </div>

          {/* Gender */}
          <div className="flex flex-col gap-2 lg:w-[48%]">
            <label htmlFor="gender" className="lable-style">
              Gender
            </label>
            <select
              name="gender"
              id="gender"
              className="form-style"
              {...register("gender", { required: true })}
              defaultValue={user?.profile?.gender}
            >
              <option value="">-- Select Gender --</option>
              {genders.map((ele, i) => (
                <option key={i} value={ele}>
                  {ele}
                </option>
              ))}
            </select>
            {errors.gender && (
              <span className="-mt-1 text-[12px] text-yellow-100">
                Please select your gender.
              </span>
            )}
          </div>
        </div>

        {/* Contact Number & About */}
        <div className="flex flex-col gap-5 lg:flex-row">
          {/* Contact Number */}
          <div className="flex flex-col gap-2 lg:w-[48%]">
            <label htmlFor="contact_no" className="lable-style">
              Contact Number
            </label>
            <input
              type="tel"
              name="contact_no"
              id="contact_no"
              placeholder="Enter Contact Number"
              className="form-style"
              {...register("contact_no", {
                required: {
                  value: true,
                  message: "Please enter your Contact Number.",
                },
                maxLength: { value: 12, message: "Invalid Contact Number" },
                minLength: { value: 10, message: "Invalid Contact Number" },
              })}
              defaultValue={user?.profile?.contact_no}
            />
            {errors.contact_no && (
              <span className="-mt-1 text-[12px] text-yellow-100">
                {errors.contact_no.message}
              </span>
            )}
          </div>

          {/* About User */}
          <div className="flex flex-col gap-2 lg:w-[48%]">
            <label htmlFor="about_user" className="lable-style">
              About
            </label>
            <input
              type="text"
              name="about_user"
              id="about_user"
              placeholder="Enter Bio Details"
              className="form-style"
              {...register("about_user", { required: true })}
              defaultValue={user?.profile?.about_user}
            />
            {errors.about_user && (
              <span className="-mt-1 text-[12px] text-yellow-100">
                Please enter something about yourself.
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Submit/Cancel Buttons */}
      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={() => navigate("/dashboard/my-profile")}
          className="cursor-pointer rounded-md bg-richblack-700 py-2 px-5 font-semibold text-richblack-50"
        >
          Cancel
        </button>
        <Icon_button type="submit" text="Save" />
      </div>
    </form>
  )
}
