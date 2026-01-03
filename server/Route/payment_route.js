const express = require("express");
const router = express.Router();

const { capture_payment, verify_payment, sendPaymentSuccessEmail } = require("../Controllers/Payment");
const { auth, is_student } = require("../Middleware/auth");

router.post("/capture_payment", auth, is_student, capture_payment);
router.post("/verify_signature", auth, is_student, verify_payment);
router.post("/sendPaymentSuccessEmail", auth, is_student, sendPaymentSuccessEmail);

module.exports = router;
