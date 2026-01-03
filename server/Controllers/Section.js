const section = require("../models/section");
const cource = require("../models/cource");
const subsection = require("../models/subsection");

// CREATE section (unchanged)
exports.create_section = async (req, res) => {
  try {
    const { cource_id, section_name } = req.body;

    if (!section_name || !cource_id) {
      return res.status(401).json({
        success: false,
        data: "Unable to create section",
        message: "Please fill all the credentials and try again.",
      });
    }

    const response = await section.create({ section_name });

    await cource.findByIdAndUpdate(
      cource_id,
      { $push: { cource_content: response._id } },
      { new: true }
    );

    const updatedCourse = await cource
      .findById(cource_id)
      .populate({
        path: "cource_content",
        populate: { path: "subsections" },
      })
      .exec();

    return res.status(200).json({
      success: true,
      data: updatedCourse,
      message: "Section created successfully!",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      data: `${error}`,
      message: "Error while creating section!",
    });
  }
};

// UPDATE section (modified)
exports.update_section = async (req, res) => {
  try {
    const { section_name, section_id, cource_id } = req.body;

    if (!section_name || !section_id || !cource_id) {
      return res.status(401).json({
        success: false,
        data: "Unable to update section",
        message: "Please fill all the credentials and try again.",
      });
    }

    const updated_section = await section.findByIdAndUpdate(
      section_id,
      { section_name },
      { new: true }
    );

    if (!updated_section) {
      return res.status(401).json({
        success: false,
        data: "Unable to update section",
        message: "Unable to find section with given section id!",
      });
    }

    // ✅ Fetch updated course with populated sections and subsections
    const updatedCourse = await cource
      .findById(cource_id)
      .populate({
        path: "cource_content",
        populate: { path: "subsections" },
      })
      .exec();

    return res.status(200).json({
      success: true,
      data: updatedCourse,
      message: "Section updated successfully!",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      data: `${error}`,
      message: "Error while updating section!",
    });
  }
};

// DELETE section (modified)
exports.delete_section = async (req, res) => {
  try {
    const { section_id, cource_id } = req.body;

    if (!section_id || !cource_id) {
      return res.status(401).json({
        success: false,
        data: "Unable to delete section",
        message: "Please fill all the credentials and try again.",
      });
    }

    // ✅ First, remove section reference from course
    await cource.findByIdAndUpdate(cource_id, {
      $pull: { cource_content: section_id },
    });

    // ✅ Find section before deleting to get its subsections
    const sectionData = await section.findById(section_id);
    if (!sectionData) {
      return res.status(404).json({
        success: false,
        message: "Section not found",
      });
    }

    // ✅ Delete all associated subsections
    await subsection.deleteMany({ _id: { $in: sectionData.subsections } });

    // ✅ Now delete the section itself
    await section.findByIdAndDelete(section_id);

    // ✅ Fetch updated course after deletion
    const updatedCourse = await cource
      .findById(cource_id)
      .populate({
        path: "cource_content",
        populate: { path: "subsections" },
      })
      .exec();

    return res.status(200).json({
      success: true,
      data: updatedCourse,
      message: "Section deleted successfully!",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      data: `${error}`,
      message: "Error while deleting section!",
    });
  }
};
  