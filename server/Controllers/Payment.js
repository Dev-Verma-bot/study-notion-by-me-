const mongoose = require("mongoose");
const cource = require("../models/cource");
const user = require("../models/users");
const { instance } = require("../config/razorpay");
const send_mail = require("../util/mail_send");
const crypto = require("crypto");
const { paymentSuccessEmail } = require("../mail/templates/paymentSuccessEmail");
const cource_progress= require("../models/cource_progress");
exports.capture_payment = async (req, res) => {
  const { courses } = req.body;
  const user_id = req.user.id;

  // verify
  if (!courses || courses.length === 0) {
    return res.status(401).json({
      success: false,
      data: null,
      message: "Please provide course id.",
    });
  }

  if (!user_id) {
    return res.status(401).json({
      success: false,
      data: null,
      message: "Please provide user id.",
    });
  }

  let price = 0;
  console.log("backend courses -> ",courses);
  for (const courseID of courses) {
    let course;
    try {
      course = await cource.findById(courseID);

      if (!course) {
        return res.status(404).json({
          success: false,
          message: `Unable to fetch course with the course_id -> ${courseID}`,
        });
      }

      // ✅ FIXED ObjectId comparison
      if (
        course.students_enrolled.some(
          (id) => id.toString() === user_id
        )
      ) {
        return res.status(200).json({
          success: false,
          message: `Student already enrolled for course -> ${course.name}`,
        });
      }

      price += course.price;
    } catch (error) {
      return res.status(500).json({
        success: false,
        data: error.message,
        message: "Failed to capture payment !",
      });
    }
  }

  // capture payment
  const options = {
    amount: price * 100,
    currency: "INR",
    receipt: Math.random().toString(),
  };
  try {
    const payment_response = await instance.orders.create(options);
    return res.status(200).json({
      
      success: true,
      data: payment_response,
      message: "Payment captured successfully!",
    });
  } catch (error) {
    return res.status(404).json({
      success: false,
      data:  error.error,
      message: "Unable to capture payment !",
    });
  }
};

exports.verify_payment = async (req, res) => {
  const razorpay_order_id = req.body?.razorpay_order_id;
  const razorpay_payment_id = req.body?.razorpay_payment_id;
  const razorpay_signature = req.body?.razorpay_signature;
  const courses = req.body?.courses;
  const userId = req.user.id;

  if (
    !razorpay_order_id ||
    !razorpay_payment_id ||
    !razorpay_signature ||
    !courses ||
    !userId
  ) {
    return res.status(404).json({
      success: false,
      data: "Payment failed",
      message: "Please pass all the entries !",
    });
  }

  let body = razorpay_order_id + "|" + razorpay_payment_id;

  const expected_signature = crypto
    .createHmac("sha256", process.env.RAZORPAY_SECRET)
    .update(body.toString())
    .digest("hex");

  if (expected_signature === razorpay_signature) {

    await enroll_students(courses, userId, res);
    
    return res.status(200).json({
      success: true,
      message: "Payment Successfull ! ",
    });
  }

  return res.status(500).json({
    success: false,
    message: "payment failed ! ",
  });
};

exports.sendPaymentSuccessEmail = async (req, res) => {
  const { orderId, paymentId, amount } = req.body;
  const userId = req.user.id;

  if (!orderId || !paymentId || !amount || !userId) {
    return res
      .status(400)
      .json({ success: false, message: "Please provide all the details" });
  }

  try {
    const enrolledStudent = await user.findById(userId);

    await send_mail(
      enrolledStudent.email_id,
      `Payment Received`,
      paymentSuccessEmail(
        `${enrolledStudent.first_name} ${enrolledStudent.last_name}`,
        amount / 100,
        orderId,
        paymentId
      )
    );

    return res.status(200).json({ success: true });
  } catch (error) {
    return res
      .status(400)
      .json({ success: false, message: "Could not send email" });
  }
};
 const enroll_students = async (courses, userId, res) => {
  if (!courses || !userId) {
    return res.status(404).json({
      success: false,
      message: "Please provide data for userid and courseid !",
    });
  }

  for (const courseobj of courses) {
    const courseId = courseobj.courseID; 

    try {
      // 1. Add student to Course
      const enrolled_course = await cource.findOneAndUpdate(
        { _id: courseId },
        { $push: { students_enrolled: userId } },
        { new: true }
      );

      if (!enrolled_course) {
        return res.status(500).json({
          success: false,
          message: "Course not found!",
        });
      }

      // 2. CREATE COURSE PROGRESS FOR THE STUDENT
      // This solves the "null" issue in your VideoDetails controller
      const newCourseProgress = await cource_progress.create({
        cource_id: courseId,
        userId: userId,
        completed_videos: [],
      });

      // 3. Add Course and Progress to User
      const updated_user = await user.findOneAndUpdate(
        { _id: userId },
        { 
          $push: { 
            cources: courseId,
            cource_progress: newCourseProgress._id // Link the progress ID to user if your schema supports it
          } 
        },
        { new: true }
      );

      if (!updated_user) {
        return res.status(500).json({
          success: false,
          message: "User not found!",
        });
      }

      // 4. Send Enrollment Email
      await send_mail(
        updated_user.email_id,
        `Congratulations!`,
        `You have been successfully enrolled into ${enrolled_course.name}`
      );

    } catch (error) {
      console.error("Enrollment Error:", error);
      // We don't return here to allow other courses in the loop to process
    }
  }
};