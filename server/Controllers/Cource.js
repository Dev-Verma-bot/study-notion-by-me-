const cource = require("../models/cource");
const category = require("../models/category");
const user = require("../models/users");
const section = require("../models/section");
const subsection = require("../models/subsection");
const image_upload = require("../util/upload_to_cloudinary");
const { convertSecondsToDuration } = require("../util/secToDuration");
const cource_progress = require("../models/cource_progress");
require("dotenv").config();

// ========================= CREATE COURSE =========================

exports.create_cource = async (req, res) => {
  try {
    // Fetch data
    let {
      name,
      description,
      what_you_will_learn,
      price,
      Tag: _Tag,
      Category,
      status,
      instructions: _instructions,
    } = req.body;

    // Fetch thumbnail (image)
    const thumbnail = req.files?.thumbnailimage;

    // Convert JSON stringified arrays (Tag & instructions)
    let Tag = [];
    let instructions = [];

    try {
      if (_Tag) Tag = JSON.parse(_Tag);
      if (_instructions) instructions = JSON.parse(_instructions);
    } catch (err) {
      return res.status(400).json({
        success: false,
        message: "Invalid JSON format for Tag or instructions",
      });
    }

    // Validate required fields
    if (
      !name ||
      !description ||
      !what_you_will_learn ||
      !price ||
      !thumbnail ||
      !Category ||
      !Tag.length ||
      !instructions.length
    ) {
      return res.status(401).json({
        success: false,
        message: "All fields are required to create a course",
      });
    }

    if (!status || status === undefined) {
      status = "Draft";
    }

    // Fetch instructor
    const instructor = await user.findById(req.user.id);
    if (!instructor) {
      return res.status(401).json({
        success: false,
        message: "Instructor not found for this course",
      });
    }

    // Validate category
    const category_valid = await category.findById(Category);
    if (!category_valid) {
      return res.status(404).json({
        success: false,
        message: "Category details not found",
      });
    }

    // Upload thumbnail to Cloudinary
    const Thumbnail = await image_upload(thumbnail, process.env.cloudinary_folder);

    // Create course in DB
    const response = await cource.create({
      name,
      description,
      instructor: instructor._id,
      what_you_will_learn,
      price,
      thumbnail: Thumbnail.secure_url,
      tag: Tag,
      category: category_valid._id,
      status,
      instructions,
    });

    // Push course in category
    await category.findByIdAndUpdate(
      Category,
      { $push: { cources: response._id } },
      { new: true }
    );

    // Push course in instructor
    await user.findByIdAndUpdate(
      instructor._id,
      { $push: { cources: response._id } },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      data: response,
      message: "Course created successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      data: `${error}`,
      message: "Error while creating course",
    });
  }
};

// ========================= EDIT COURSE =========================
// ========================= EDIT COURSE =========================
exports.editCourse = async (req, res) => {
  try {
    const { cource_id } = req.body;

    if (!cource_id) {
      return res.status(400).json({
        success: false,
        message: "Course ID is required",
      });
    }

    const course = await cource.findById(cource_id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    const updates = req.body;

    // ------------------- HANDLE THUMBNAIL UPDATE -------------------
    if (req.files?.thumbnailImage) {
      const uploaded = await image_upload(
        req.files.thumbnailImage,
        process.env.cloudinary_folder
      );
      course.thumbnail = uploaded.secure_url;
    }

    // ------------------- UPDATE VALID FIELDS ONLY -------------------
    const editableFields = [
      "name",
      "description",
      "price",
      "tag",
      "instructions",
      "what_you_will_learn",
      "status",
      "Category",
    ];

    for (const key in updates) {
      if (Object.prototype.hasOwnProperty.call(updates, key)) {

        if (!editableFields.includes(key)) continue;

        // Parse JSON fields safely
        if (key === "tag" || key === "instructions") {
          try {
            course[key] = JSON.parse(updates[key]);
          } catch {
            return res.status(400).json({
              success: false,
              message: `Invalid JSON for field: ${key}`,
            });
          }
        } else {
          course[key] = updates[key];
        }
      }
    }

    // Save updated course
    await course.save();

    // ------------------- RETURN UPDATED FULL COURSE -------------------
    const updatedCourse = await cource
      .findById(cource_id)
      // .populate({
      //   path: "Instructor",
      //   populate: { path: "description" },
      // })
      .populate("category")
      .populate("rating_and_review")
      .populate({
        path: "cource_content",
        populate: { path: "subsections" },
      })
      .exec();

    return res.status(200).json({
      success: true,
      message: "Course updated successfully",
      data: updatedCourse,
    });
  } catch (error) {
    console.error("Error editing course:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};


// ========================= GET ALL COURSES =========================
exports.get_all_cources = async (req, res) => {
  try {
    const response = await cource
      .find({},
        { created_at:true,
          name: true,
          description: true,
          price: true,
          instructor: true,
          rating_and_review: true,
          students_enrolled: true,
          thumbnail: true,
          status:true

        }
      )
      .exec();

    return res.status(200).json({
      success: true,
      data: response,
      message: "All courses fetched successfully!",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      data: `${error}`,
      message: "Error while fetching all courses",
    });
  }
};

// ========================= GET COURSE DETAILS =========================
exports.get_cource_details = async (req, res) => {
  try {
    const { cource_id } = req.body;

    if (!cource_id) {
      return res.status(401).json({
        success: false,
        message: "Please provide course ID",
      });
    }

    const details = await cource
      .findById(cource_id)
      .populate({
        path: "instructor",
        populate: { path: "profile" },
      })
      .populate({
        path: "cource_content",
        populate: { path: "subsections", select: "-videoUrl" },
      })
      .populate("rating_and_review")
      .populate("category")
      .exec();

    if (!details) {
      return res.status(404).json({
        success: false,
        message: "Course not found for the given ID",
      });
    }

    // Calculate total course duration
    let totalDurationInSeconds = 0;
    details.cource_content.forEach((content) => {
      content.subsections.forEach((subsection) => {
        const time = parseInt(subsection.time_duration);
        totalDurationInSeconds += time;
      });
    });

    const totalDuration = convertSecondsToDuration(totalDurationInSeconds);

    return res.status(200).json({
      success: true,
      data: { details, totalDuration },
      message: "Course details fetched successfully!",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      data: `${error}`,
      message: "Error while fetching course details!",
    });
  }
};

// ========================= GET INSTRUCTOR COURSES =========================
exports.get_instructor_cources = async (req, res) => {
  try {
    const instructorId = req.user.id;
    const instructorCourses = await cource.find({ instructor: instructorId }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      data: instructorCourses,
      message: "Instructor courses fetched successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve instructor courses",
      error: error.message,
    });
  }
};

// ========================= DELETE COURSE =========================
exports.delete_cource = async (req, res) => {
  try {
    const { cource_id } = req.body;

    const course = await cource.findById(cource_id);
    if (!course) {
      return res.status(404).json({ success: false, message: "Course not found" });
    }

    // Unenroll students
    const studentsEnrolled = course.students_enrolled || [];
    for (const studentId of studentsEnrolled) {
      await user.findByIdAndUpdate(studentId, { $pull: { cources: cource_id } });
    }

    // Delete sections and subsections
    const courseSections = course.cource_content || [];
    for (const sectionId of courseSections) {
      const sec = await section.findById(sectionId);
      if (sec) {
        const subs = sec.subsections || [];
        for (const subId of subs) {
          await subsection.findByIdAndDelete(subId);
        }
      }
      await section.findByIdAndDelete(sectionId);
    }

    // Delete the course
    await cource.findByIdAndDelete(cource_id);

    return res.status(200).json({
      success: true,
      message: "Course deleted successfully",
      
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};
exports.getFullCourseDetails = async (req, res) => {
  try {
    const { courseId } = req.body
    const userId = req.user.id
    const courseDetails = await cource.findOne({
      _id: courseId,
    })
      .populate({
        path: "instructor",
        populate: {
          path: "profile",
        },
      })
      .populate("category")
      .populate("rating_and_review")
      .populate({
        path: "cource_content",
        populate: {
          path: "subsections",
        },
      })
      .exec()

    let courseProgressCount = await cource_progress.findOne({
      cource_id: courseId,
      userId: userId,
    })

    console.log("courseProgressCount : ", courseProgressCount)

    if (!courseDetails) {
      return res.status(400).json({
        success: false,
        message: `Could not find course with id: ${courseId}`,
      })
    }

    // if (courseDetails.status === "Draft") {
    //   return res.status(403).json({
    //     success: false,
    //     message: `Accessing a draft course is forbidden`,
    //   });
    // }

    let totalDurationInSeconds = 0
    courseDetails.cource_content.forEach((content) => {
      content.subsections.forEach((subSection) => {
        const timeDurationInSeconds = parseInt(subSection.time_duration)
        totalDurationInSeconds += timeDurationInSeconds
      })
    })

    const totalDuration = convertSecondsToDuration(totalDurationInSeconds)

    return res.status(200).json({
      success: true,
      data: {
        courseDetails,
        totalDuration,
        completedVideos: courseProgressCount?.completedVideos
          ? courseProgressCount?.completedVideos
          : [],
      },
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

