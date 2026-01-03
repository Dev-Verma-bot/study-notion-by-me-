
const express = require("express")
const { auth, is_instructor, is_admin, is_student } = require("../Middleware/auth")
const { create_cource,editCourse, get_all_cources, get_cource_details, get_instructor_cources, delete_cource, getFullCourseDetails } = require("../Controllers/Cource")
const { create_section, update_section, delete_section } = require("../Controllers/Section")
const { update_subsection, delete_subsection, create_subsection } = require("../Controllers/Subsection")
const { create_category, fetch_all_category, category_page_detalis } = require("../Controllers/category")
const { create_rating_and_review, get_average_rating, get_all_rating_review } = require("../Controllers/Rating_and_review")
const { updateCourseProgress, getProgressPercentage } = require("../Controllers/CourseProgress")
const router = express.Router()



// Courses can Only be Created by Instructors
router.post("/createCourse", auth, is_instructor, create_cource)
router.post("/editCourse", auth, is_instructor, editCourse)
router.delete(
  "/deleteCourse",
  auth,
  is_instructor,
  delete_cource
);

//Add a Section to a Course
router.post("/addSection", auth, is_instructor, create_section)
// Update a Section
router.post("/updateSection", auth, is_instructor, update_section)
// Delete a Section
router.post("/deleteSection", auth, is_instructor, delete_section)
// Edit Sub Section
router.post("/updateSubSection", auth, is_instructor, update_subsection)
// Delete Sub Section
router.post("/deleteSubSection", auth, is_instructor, delete_subsection)
// Add a Sub Section to a Section
router.post("/addSubSection", auth, is_instructor, create_subsection)
// Get all Registered Courses
router.get("/getAllCourses", get_all_cources)
// Get Details for a Specific Courses
router.post("/getCourseDetails", get_cource_details)

router.post("/createCategory", auth, is_admin, create_category)
router.get("/showAllCategories", fetch_all_category)
router.post("/categoryPageDetails", category_page_detalis)

router.post("/createRating", auth, is_student, create_rating_and_review)
router.get("/getAverageRating", get_average_rating)
router.get("/getReviews", get_all_rating_review)
router.get("/getInstructorCourses", auth,is_instructor,get_instructor_cources)

router.post("/getFullCourseDetails", auth, getFullCourseDetails)

router.post("/updateCourseProgress", auth,is_student, updateCourseProgress);


module.exports = router