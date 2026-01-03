const express = require('express');
const { sign_up, login, send_otp, change_pass } = require('../Controllers/Auth');
const { reset_pass, reset_pass_token } = require('../Controllers/reset_pass');
const { auth, is_student, is_instructor, is_admin } = require('../Middleware/auth');
const router = express.Router();



//* ---------------------------------- AUTH SECTION -------------------------------------------
router.post('/signup', sign_up)
router.post('/login', login)
router.post('/sendotp', send_otp)
router.patch('/changePasword', change_pass)
router.post('/reset-password-token', reset_pass_token)
router.post('/reset-password', reset_pass)

//* -------------------------- Authorization middlewares --------------------------------------
router.get('/student', auth, is_student, (req, res) => res.send('Hello Student'))
router.get('/instructor', auth, is_instructor, (req, res) => res.send('Hello Instructor'))
router.get('/admin', auth, is_admin, (req, res) => res.send('Hello Admin'))

module.exports = router;