const subsection = require("../models/subsection");
const section = require("../models/section");
const cource = require("../models/cource");
const image_upload = require("../util/upload_to_cloudinary");

// ======================= CREATE SUBSECTION ===========================
exports.create_subsection = async (req, res) => {
  try {
    const { section_id, title, description, cource_id } = req.body;

    const video = req.files?.video;

    if (!section_id || !title || !description || !video || !cource_id) {
      return res.status(401).json({
        success: false,
        message: "All fields are required",
      });
    }

    const uploadDetails = await image_upload(
      video,
      process.env.cloudinary_folder
    );

    const response = await subsection.create({
      title,
      description,
      time_duration: `${uploadDetails.duration}`,
      video_url: uploadDetails.secure_url,
    });

    await section.findByIdAndUpdate(
      section_id,
      { $push: { subsections: response._id } },
      { new: true }
    );

    // 📌 RETURN UPDATED FULL COURSE
    const updated_course = await cource
      .findById(cource_id)
      .populate({
        path: "cource_content",
        populate: { path: "subsections" },
      });

    return res.status(200).json({
      success: true,
      data: updated_course,
      message: "Sub-section created successfully!",
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error while creating sub-section",
      error: error.message,
    });
  }
};

// ======================= UPDATE SUBSECTION ===========================
exports.update_subsection = async (req, res) => {
  try {
    const { title, description, subsection_id, cource_id } = req.body;

    if (!subsection_id || !cource_id) {
      return res.status(401).json({
        success: false,
        message: "Subsection ID & Course ID are required",
      });
    }

    const subSectionData = await subsection.findById(subsection_id);

    if (!subSectionData) {
      return res.status(404).json({
        success: false,
        message: "SubSection not found",
      });
    }

    if (title !== undefined) subSectionData.title = title;
    if (description !== undefined) subSectionData.description = description;

    if (req.files && req.files.video) {
      const uploadDetails = await image_upload(
        req.files.video,
        process.env.cloudinary_folder
      );

      subSectionData.video_url = uploadDetails.secure_url;
      subSectionData.time_duration = `${uploadDetails.duration}`;
    }

    await subSectionData.save();

    // 📌 RETURN UPDATED FULL COURSE
    const updated_course = await cource
      .findById(cource_id)
      .populate({
        path: "cource_content",
        populate: { path: "subsections" },
      });

    return res.status(200).json({
      success: true,
      data: updated_course,
      message: "Sub-section updated successfully!",
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error while updating sub-section",
      error: error.message,
    });
  }
};

// ======================= DELETE SUBSECTION ===========================
exports.delete_subsection = async (req, res) => {
  try {
    const { section_id, subsection_id, cource_id } = req.body;

    if (!section_id || !subsection_id || !cource_id) {
      return res.status(401).json({
        success: false,
        message: "Section ID, Subsection ID & Course ID required",
      });
    }

    const deletedSubSection = await subsection.findByIdAndDelete(subsection_id);

    if (!deletedSubSection) {
      return res.status(404).json({
        success: false,
        message: "Sub-section not found",
      });
    }

    await section.findByIdAndUpdate(
      section_id,
      { $pull: { subsections: subsection_id } },
      { new: true }
    );

    // 📌 RETURN UPDATED FULL COURSE
    const updated_course = await cource
      .findById(cource_id)
      .populate({
        path: "cource_content",
        populate: { path: "subsections" },
      });

    return res.status(200).json({
      success: true,
      data: updated_course,
      message: "Sub-section deleted successfully!",
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error while deleting sub-section",
      error: error.message,
    });
  }
};
