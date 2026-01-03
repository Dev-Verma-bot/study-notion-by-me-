import React, { useState } from "react"
import { useForm } from "react-hook-form"
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"

import { changePassword } from "../../../../services/operations/SettingsAPI"
import Icon_button from "../../../common/Icon_button"

export default function UpdatePassword() {
  const { token } = useSelector((state) => state.auth)
  const { user } = useSelector((state) => state.profile) // assuming profile slice stores user info
  const navigate = useNavigate()

  const [showOldPassword, setShowOldPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()

  const submitPasswordForm = async (data) => {
    // append email to data before sending
    const payload = {
      email: user?.email_id, // adjust according to your schema (email / email_id)
      old_pass: data.old_pass,
      new_pass: data.new_pass,
      cnfrm_pass: data.cnfrm_pass,
    }

    console.log("Password Data - ", payload)
    try {
      await changePassword(token, payload)
    } catch (error) {
      console.log("ERROR MESSAGE - ", error.message)
    }
  }

  return (
    <form onSubmit={handleSubmit(submitPasswordForm)}>
      <div className="my-10 flex flex-col gap-y-6 rounded-md border border-richblack-700 bg-richblack-800 p-8 px-12">
        <h2 className="text-lg font-semibold text-richblack-5">Password</h2>

        <div className="flex flex-col gap-5 lg:flex-row">
          {/* Old Password */}
          <div className="relative flex flex-col gap-2 lg:w-[48%]">
            <label htmlFor="old_pass" className="label-style">
              Current Password
            </label>
            <input
              type={showOldPassword ? "text" : "password"}
              id="old_pass"
              placeholder="Enter Current Password"
              className="form-style"
              {...register("old_pass", { required: true })}
            />
            <span
              onClick={() => setShowOldPassword((prev) => !prev)}
              className="absolute right-3 top-[38px] z-[10] cursor-pointer"
            >
              {showOldPassword ? (
                <AiOutlineEyeInvisible fontSize={24} fill="#AFB2BF" />
              ) : (
                <AiOutlineEye fontSize={24} fill="#AFB2BF" />
              )}
            </span>
            {errors.old_pass && (
              <span className="-mt-1 text-[12px] text-yellow-100">
                Please enter your Current Password.
              </span>
            )}
          </div>

          {/* New Password */}
          <div className="relative flex flex-col gap-2 lg:w-[48%]">
            <label htmlFor="new_pass" className="label-style">
              New Password
            </label>
            <input
              type={showNewPassword ? "text" : "password"}
              id="new_pass"
              placeholder="Enter New Password"
              className="form-style"
              {...register("new_pass", { required: true })}
            />
            <span
              onClick={() => setShowNewPassword((prev) => !prev)}
              className="absolute right-3 top-[38px] z-[10] cursor-pointer"
            >
              {showNewPassword ? (
                <AiOutlineEyeInvisible fontSize={24} fill="#AFB2BF" />
              ) : (
                <AiOutlineEye fontSize={24} fill="#AFB2BF" />
              )}
            </span>
            {errors.new_pass && (
              <span className="-mt-1 text-[12px] text-yellow-100">
                Please enter your New Password.
              </span>
            )}
          </div>
        </div>

        {/* Confirm Password */}
        <div className="relative flex flex-col gap-2 lg:w-[48%]">
          <label htmlFor="cnfrm_pass" className="label-style">
            Confirm New Password
          </label>
          <input
            type={showConfirmPassword ? "text" : "password"}
            id="cnfrm_pass"
            placeholder="Confirm New Password"
            className="form-style"
            {...register("cnfrm_pass", { required: true })}
          />
          <span
            onClick={() => setShowConfirmPassword((prev) => !prev)}
            className="absolute right-3 top-[38px] z-[10] cursor-pointer"
          >
            {showConfirmPassword ? (
              <AiOutlineEyeInvisible fontSize={24} fill="#AFB2BF" />
            ) : (
              <AiOutlineEye fontSize={24} fill="#AFB2BF" />
            )}
          </span>
          {errors.cnfrm_pass && (
            <span className="-mt-1 text-[12px] text-yellow-100">
              Please confirm your New Password.
            </span>
          )}
        </div>
      </div>

      {/* Buttons */}
      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={() => navigate("/dashboard/my-profile")}
          className="cursor-pointer rounded-md bg-richblack-700 py-2 px-5 font-semibold text-richblack-50"
        >
          Cancel
        </button>
        <Icon_button type="submit" text="Update" />
      </div>
    </form>
  )
}
