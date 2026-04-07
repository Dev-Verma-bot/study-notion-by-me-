const mongoose = require("mongoose");
const cource = require("../models/cource");
const user = require("../models/users");
const { instance } = require("../config/razorpay");
const send_mail = require("../util/mail_send");
const crypto = require("crypto");
const cource_progress = require("../models/cource_progress");
exports.capture_payment = async (req, res) => {
  const { courses } = req.body;
  const user_id = req.user.id;

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
  console.log("backend courses -> ", courses);
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

      if (course.students_enrolled.some((id) => id.toString() === user_id)) {
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

  const options = {
    amount: price * 100,
    currency: "INR",
    receipt: Math.random().toString(),
    notes: {
      userId: user_id,
      courses: JSON.stringify(courses),
    },
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
      data: error.error,
      message: "Unable to capture payment !",
    });
  }
};

const enroll_students = async (courses, userId) => {
  if (!courses || !userId) {
    console.error("Enrollment Error: Missing userId or courses");
    return;
  }

  for (const courseobj of courses) {
    const courseId = courseobj?.courseID || courseobj;

    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      console.error("Invalid course id received in webhook:", courseId);
      continue;
    }

    try {
      const alreadyEnrolled = await cource.exists({
        _id: courseId,
        students_enrolled: userId,
      });

      if (alreadyEnrolled) {
        continue;
      }

      const enrolled_course = await cource.findOneAndUpdate(
        { _id: courseId },
        { $addToSet: { students_enrolled: userId } },
        { new: true }
      );

      if (!enrolled_course) {
        console.error("Course not found!", courseId);
        continue;
      }

      let courseProgress = await cource_progress.findOne({
        cource_id: courseId,
        userId: userId,
      });

      if (!courseProgress) {
        courseProgress = await cource_progress.create({
          cource_id: courseId,
          userId: userId,
          completed_videos: [],
        });
      }

      const updated_user = await user.findOneAndUpdate(
        { _id: userId },
        {
          $addToSet: {
            cources: courseId,
            cource_progress: courseProgress._id,
          },
        },
        { new: true }
      );

      if (!updated_user) {
        console.error("User not found!", userId);
        continue;
      }

      await send_mail(
        updated_user.email_id,
        `Congratulations!`,
        `You have been successfully enrolled into ${enrolled_course.name}`
      );
    } catch (error) {
      console.error("Enrollment Error:", error);
    }
  }
};


exports.razorpay_webhook = async (req, res) => {
  try {
    console.log("Razorpay webhook received:", req.body?.event);
    const signature = req.headers["x-razorpay-signature"];
    const body = req.rawBody || JSON.stringify(req.body);
    const webhookSecret =
      process.env.RAZORPAY_WEBHOOK_SECRET || process.env.RAZORPAY_SECRET;

    if (!webhookSecret) {
      console.error("Webhook secret is missing");
      return res.status(500).json({ success: false, message: "Webhook secret not configured" });
    }

    const expected_signature = crypto
      .createHmac("sha256", webhookSecret)
      .update(body)
      .digest("hex");

    if (expected_signature !== signature) {
      console.error("Invalid Razorpay webhook signature");
      return res.status(400).json({ success: false, message: "Invalid signature" });
    }

    if (req.body.event === "payment.captured") {
      const payment = req.body.payload.payment.entity;

      const userId = payment.notes?.userId;
      const courses = payment.notes?.courses ? JSON.parse(payment.notes.courses) : null;

      if (userId && courses) {
        await enroll_students(courses, userId);
        console.log("Enrollment done via webhook for user:", userId);
      } else {
        console.error("Webhook payment is missing userId or courses in notes");
      }
    }

    res.status(200).json({ status: "ok" });
  } catch (err) {
    console.error("Webhook error:", err);
    res.status(500).json({ status: "error", message: err.message });
  }
};
