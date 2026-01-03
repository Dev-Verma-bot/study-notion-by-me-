const BASE_URL= process.env.REACT_APP_BASE_URL;
// 




// AUTH ENDPOINTS
export const auth = {
  otp_api: BASE_URL + "/user/sendotp",
  sign_up_api: BASE_URL + "/user/signup",
  login_api: BASE_URL + "/user/login",
  RESETPASSTOKEN_API: BASE_URL + "/user/reset-password-token",
  RESETPASSWORD_API: BASE_URL + "/user/reset-password",
}

// PROFILE ENDPOINTS
export const profileEndpoints = {
  GET_USER_DETAILS_API: BASE_URL + "/profile/getUserDetails",
  GET_USER_ENROLLED_COURSES_API: BASE_URL + "/user_profile/getEnrolledCourses",
  GET_INSTRUCTOR_DATA_API: BASE_URL + "/user_profile/instructorDashboard",
}

// STUDENTS ENDPOINTS
export const studentEndpoints = {
  COURSE_PAYMENT_API: BASE_URL + "/payment/capture_payment",
  COURSE_VERIFY_API: BASE_URL + "/payment/verify_signature",
  SEND_PAYMENT_SUCCESS_EMAIL_API: BASE_URL + "/payment/sendPaymentSuccessEmail",
}

// COURSE ENDPOINTS
export const courseEndpoints = {
  GET_ALL_COURSE_API: BASE_URL + "/cource/getAllCourses",
  COURSE_DETAILS_API: BASE_URL + "/cource/getCourseDetails",
  EDIT_COURSE_API: BASE_URL + "/cource/editCourse",
  COURSE_CATEGORIES_API: BASE_URL + "/cource/showAllCategories",
  CREATE_COURSE_API: BASE_URL + "/cource/createCourse",
  CREATE_SECTION_API: BASE_URL + "/cource/addSection",
  CREATE_SUBSECTION_API: BASE_URL + "/cource/addSubSection",
  UPDATE_SECTION_API: BASE_URL + "/cource/updateSection",
  UPDATE_SUBSECTION_API: BASE_URL + "/cource/updateSubSection",
  GET_ALL_INSTRUCTOR_COURSES_API: BASE_URL + "/cource/getInstructorCourses",
  DELETE_SECTION_API: BASE_URL + "/cource/deleteSection",
  DELETE_SUBSECTION_API: BASE_URL + "/cource/deleteSubSection",
  DELETE_COURSE_API: BASE_URL + "/cource/deleteCourse",
  GET_FULL_COURSE_DETAILS_AUTHENTICATED:BASE_URL + "/cource/getFullCourseDetails",
  LECTURE_COMPLETION_API: BASE_URL + "/cource/updateCourseProgress",
  CREATE_RATING_API: BASE_URL + "/cource/createRating",
  GET_COURCE_PROGRESS_PERCENTAGE_API:BASE_URL+"/cource/get_cource_progrees_percentage"
}

// RATINGS AND REVIEWS
export const ratingsEndpoints = {
  REVIEWS_DETAILS_API: BASE_URL + "/cource/getReviews",
}

// CATAGORIES API
export const categories= {
    category_api:BASE_URL+"/cource/showAllCategories"
}

// CATALOG PAGE DATA
export const catalogData = {
  CATALOGPAGEDATA_API: BASE_URL + "/cource/categoryPageDetails",
}
// CONTACT-US API
export const contactusEndpoint = {
  CONTACT_US_API: BASE_URL + "/reach/contact",
}

// SETTINGS PAGE API
export const settingsEndpoints = {
  UPDATE_DISPLAY_PICTURE_API: BASE_URL + "/user_profile/updateDisplayPicture",
  UPDATE_PROFILE_API: BASE_URL + "/user_profile/updateProfile",
  CHANGE_PASSWORD_API: BASE_URL + "/user_profile/changePasword",
  DELETE_PROFILE_API: BASE_URL + "/user_profile/deleteProfile",
}