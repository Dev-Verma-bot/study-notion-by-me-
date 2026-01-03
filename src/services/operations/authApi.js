import react from "react";
import { setLoading, setReset_pass_token, setSign_up_data, setToken } from "../../slices/authSlice";
import { ApiConnect } from "../ApiConnect";
import toast from "react-hot-toast";
import { auth } from "../Apis";
import { setUser } from "../../slices/profileSlice";

export function getPasswordResetToken(email , setEmailSent) {
    const RESETPASSTOKEN_API= auth.RESETPASSTOKEN_API;
    return async(dispatch) => {
    dispatch(setLoading(true));
    try{
      const response = await ApiConnect("POST", RESETPASSTOKEN_API, {email})
      
      dispatch(setReset_pass_token(response.data.token));
      
      if(!response.data.success) {
        throw new Error(response.data.message);
      }

      toast.success("Reset Email Sent");
      setEmailSent(true);
    }
    catch(error) {
            toast.error("Failed to send email for resetting password i.e. Email not registered !");
      setEmailSent(false);
    }
    dispatch(setLoading(false));
  }
}

export function sendOtp(email, navigate) {
  return async (dispatch) => {
    const toastId = toast.loading("Loading...")
    dispatch(setLoading(true))
    try {
      const response = await ApiConnect("POST", auth.otp_api, {
        email,
        checkUserPresent: true,
      })
      console.log("SENDOTP API RESPONSE............", response)

      dispatch(setSign_up_data({Otp:response.data.data.value}))
      console.log(response.data.success)

      if (!response.data.success) {
        throw new Error(response.data.message)
      }

      toast.success("OTP Sent Successfully")
      navigate("/verify_email")
    } catch (error) {
      console.log("SENDOTP API ERROR............", error)
      toast.error("Could Not Send OTP")
    }
    dispatch(setLoading(false))
    toast.dismiss(toastId)
  }
}

export function signUp(
  account_type,
  First_name,
  Last_name,
  Email_add,
  Password,
  cnfrm_password,
  Otp,
  navigate

  
) {
  return async (dispatch) => {
    const toastId = toast.loading("Loading...")
    dispatch(setLoading(true))
    try {
      const response = await ApiConnect("POST", auth.sign_up_api, {
        account_type,
        First_name,
        Last_name,
        Email_add,
        Password,
        cnfrm_password,
        Otp,
      })

      console.log("SIGNUP API RESPONSE............", response)

      if (!response.data.success) {
        throw new Error(response.data.message)
      }
      toast.success("Signup Successful")
      navigate("/login")
    } catch (error) {
      console.log("SIGNUP API ERROR............", error)
      toast.error("Signup Failed")
      navigate("/signup")
    }
    dispatch(setLoading(false))
    toast.dismiss(toastId)
  }
}

export function logout(navigate) {
  return (dispatch) => {
    dispatch(setToken(null))
    dispatch(setUser(null))
    // dispatch(resetCart())
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    toast.success("Logged Out")
    navigate("/")
  }
}
