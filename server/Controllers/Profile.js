const profile = require("../models/profile");
const cource_progress = require("../models/cource_progress");
const user= require("../models/users");
const image_upload = require("../util/upload_to_cloudinary");
const cource = require("../models/cource");
const rating_and_review = require("../models/rating_and_review");
// update profile 
exports.update_profile=async (req ,res)=>{
  try{
  // fetch data 
    const {gender="",dob="",about_user="",contact_no}= req.body;
    const id= req.user.id;
    // validate 
    if(!id){
        return res.status(401).json({
            success:false,
            data:"unable to update profile",
            message:"Unable to find user id !"
        })
    }
    // diff ways simply create db entry in profile and and add id is user db
    // find user
    const User = await user.findById(id);
    // find profile id and update in db 
    const updated_profile= await profile.findByIdAndUpdate(User.profile,{
        gender,dob,about_user,contact_no
    },{new:true});
    


 return res.status(200).json({
        success: true,
        data:updated_profile,
        message: "profile updated successfully !",
      });

}
catch(error){
 return res.status(500).json({
        success: false,
        data:`${error}`,
        message: "Error while updating profile !",
      });

    }
}
exports.delete_account = async (req, res) => {
  try {
    const id = req.user.id;

    const userDetails = await user.findById(id);
    if (!userDetails) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const enrolledCourses = userDetails.cources || [];
    if (enrolledCourses.length > 0) {
      await cource.updateMany(
        { _id: { $in: enrolledCourses } },
        { $pull: { students_enrolled: id } }
      );
    }

    await rating_and_review.deleteMany({ user: id });

    await profile.findByIdAndDelete(userDetails.profile);

    await user.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "Account deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      data: error.message,
      message: "Error while deleting account!",
    });
  }
};

//* Get all the user accounts
exports.getAllUserDetails = async (req, res) => {
    try {
        const id = req.user.id;

        const userData = await user.findById(id).populate('profile').exec();

        res.status(200).json({
            status: 'success',
            user: userData
        })
    }
    catch (err) {
        res.status(500).json({
            status: 'fail',
            data: 'Failed to get the user details',
            message: err.message
        })
    }
}

//* Update the display picture of the user
exports.updateDisplayPicture = async (req, res) => {
    try {
        const displayPic = req.files.displayPicture;
        const userId = req.user.id;
        const image = await image_upload(
            displayPic,
            process.env.cloudinary_folder,
            1000,
            1000
        )
        console.log("Display Pic: ", image)

        //* Update the profile
        const updatedProfile = await user.findByIdAndUpdate(
            { _id: userId },
            { image: image.secure_url },
            { new: true }
        )

        return res.status(201).json({
            status: 'success',
            message: 'Image updated successfully!',
            profile: updatedProfile,
        })
    }
    catch (err) {
        return res.status(500).json({
            success: false,
            data: 'Failed to update the profile picture',
            message: err.message,
        })
    }
}


//* Get enrolled courses

exports.getEnrolledCourses = async (req, res) => {
    try {
        const userId = req.user.id;
        let userDetails = await user.findOne({ _id: userId })
            .populate({
                path: "cources",
                populate: {
                    path: "cource_content",
                    populate: {
                        path: "subsections",
                    },
                },
            })
            .exec();

        if (!userDetails) {
            return res.status(404).json({
                success: false,
                message: "User not found!",
            });
        }

        userDetails = userDetails.toObject();

        for (var i = 0; i < userDetails.cources.length; i++) {
            let totalLectures = 0;
            
            userDetails.cources[i].cource_content.forEach((section) => {
                totalLectures += section.subsections.length;
            });

            let courseProgressCount = await cource_progress.findOne({
                cource_id: userDetails.cources[i]._id,
                userId: userId,
            });

            let completedCount = courseProgressCount?.completed_videos?.length || 0;

            if (totalLectures === 0) {
                userDetails.cources[i].progressPercentage = 100;
            } else {
                const multiplier = Math.pow(10, 2);
                userDetails.cources[i].progressPercentage =
                    Math.round((completedCount / totalLectures) * 100 * multiplier) / multiplier;
            }
        }

        return res.status(200).json({
            success: true,
            data: userDetails.cources,
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};

exports.instructor_dashboard= async (req,res)=>{
    try{
        const user_id=req.user.id;
        if(!user_id){
            return res.status(404).json({
                success:false,
                message:"Please provide user id"
            })
        }
        const enrolled_courses= await cource.find({instructor:user_id});

        if(enrolled_courses.length===0){
            return res.status(404).json({
                success:false,
                messasge:"No cources available with the given user id." 
            })
        }

        const course_data= enrolled_courses.map((k)=>{
            const total_students = k.students_enrolled.length;
            const total_ammount_generated= total_students*k.price;

            const response= {
                _id:k._id,
                courseName:k.name,
                courseDescription:k.description,
                totalStudentsEnrolled:total_students,
                totalAmountGenerated:total_ammount_generated
            }
            return response;
    })

        return res.status(200).json({
            success:true,
            message:"Instructor dashboard details fetched successfully",
            data:course_data
        })
    }
    catch (error){
        return res.status(500).json({
            success:false,
            message:"Unable to fetch instructor dashboard details.",
            data:error
        })
    }
}