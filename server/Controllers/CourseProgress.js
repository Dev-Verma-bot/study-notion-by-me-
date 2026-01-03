const mongoose = require("mongoose")
const section= require("../models/section")
const subsection = require("../models/subsection")
const cource_progress = require("../models/cource_progress")
const cource = require("../models/cource")

exports.updateCourseProgress = async (req, res) => {
  const { courseId, subsectionId } = req.body
  const user_id = req.user.id
    
  try {
    // Check if the subsection is valid
    const Subsection = await subsection.findById(subsectionId)
    if (!Subsection) {
      return res.status(404).json({ error: "Invalid subsection" })
    }

    // Find the course progress document for the user and course
    let courseProgress = await cource_progress.findOne({
      cource_id: courseId,
      userId: user_id,
    })
    console.log("course progress response -> ",courseProgress);

    if (!courseProgress) {
      // If course progress doesn't exist, create a new one
      return res.status(404).json({
        success: false,
        message: "Course progress Does Not Exist",
      })
    } else {
      // If course progress exists, check if the subsection is already completed
      if (courseProgress.completed_videos.includes(subsectionId)) {
        return res.status(400).json({ error: "Subsection already completed" })
      }

      // Push the subsection into the completedVideos array
      courseProgress.completed_videos.push(subsectionId)
    }

    // Save the updated course progress
    await courseProgress.save()

    return res.status(200).json({ message: "Course progress updated" })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ error: "Internal server error" })
  }
}

