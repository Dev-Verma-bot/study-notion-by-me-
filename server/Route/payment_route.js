const express = require("express");
const router = express.Router();

const { capture_payment, razorpay_webhook } = require("../Controllers/Payment");
const { auth, is_student } = require("../Middleware/auth");

router.post("/webhook", razorpay_webhook);
router.post("/capture_payment", auth, is_student, capture_payment);

module.exports = router;
