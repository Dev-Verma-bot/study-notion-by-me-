const express = require('express');
const { auth, is_instructor } = require('../Middleware/auth');
const { update_profile, getAllUserDetails, getEnrolledCourses,
     updateDisplayPicture, delete_account, instructor_dashboard } = require('../Controllers/Profile');
const { reset_pass } = require('../Controllers/reset_pass');
const router = express.Router();


router.delete("/deleteProfile", auth, delete_account)
router.put("/updateProfile", auth, update_profile)
router.get("/getUserDetails", auth, getAllUserDetails)
router.put("/reset-password",reset_pass)
// Get Enrolled Courses
router.get("/getEnrolledCourses", auth, getEnrolledCourses)
router.put("/updateDisplayPicture", auth, updateDisplayPicture)
router.get("/instructorDashboard",auth,is_instructor,instructor_dashboard)
module.exports = router