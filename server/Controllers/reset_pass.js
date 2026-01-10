const user = require("../models/users");
const send_mail = require("../util/mail_send");
const bcrypt= require("bcrypt");
exports.reset_pass_token = async (req, res) => {
    try {
        // fetch data 
        const { email } = req.body;

        // validate
        if (!email) {
            return res.status(400).json({
                success: false,
                data: null,
                message: "Please provide email to proceed.",
            });
        }

        // check if user exists
        const User = await user.findOne({ email_id: email });
        if (!User) {
            return res.status(404).json({
                success: false,
                data: null,
                message: "User does not exist with the provided email.",
            });
        }

        // generate token
        const token = crypto.randomUUID();

        // update token and expiry in DB
        const updatedUser = await user.findOneAndUpdate(
            { email_id: email },
            {
                reset_token: token,
                reset_token_expires_time: Date.now() + 5 * 60 * 1000,
            },
            { new: true }
        );

        // create frontend URL
        const url = `https://study-notion-by-me.vercel.app/reset_pass/${token}`;

        // send email
        await send_mail(
            email,
            "Reset Password",
            `<h1>Reset your password by clicking the link below:</h1>
            <p>This link is valid for 5 minutes.<br>
            <a href="${url}">${url}</a></p>`
        );

        return res.status(200).json({
            success: true,
            data: "Reset password link sent successfully.",
            message: "Token created and email sent.",
            token
        });
    } 
    catch (error) {
            return res.status(500).json({
            success: false,
            data:`${error}`,
            message: "Something went wrong while generating reset token.",
        });
    }
}

exports.reset_pass = async (req, res) => {
  try {
    // fetch data
    const { token, new_pass, cnfrm_pass } = req.body;

    // validate 
    if (!new_pass || !token || !cnfrm_pass) {
      return res.status(401).json({
        success: false,
        data: null,
        message: "Please fill all the credentials and try again.",
      });
    }

    // confirm passwords match
    if (new_pass !== cnfrm_pass) {
      return res.status(401).json({
        success: false,
        data: null,
        message: "New password and confirm password must be the same!",
      });
    }

    // find user by token
    const User = await user.findOne({ reset_token: token });
    if (!User) {
      return res.status(404).json({
        success: false,
        data: null,
        message: "User not found! (invalid token)",
      });
    }

    // check if token expired
    const token_expired = Date.now() > User.reset_token_expires_time;
    if (token_expired) {
      return res.status(401).json({
        success: false,
        data: null,
        message: "Reset password token has expired. Please try again.",
      });
    }

    // hash new password
    const newHashedPass = await bcrypt.hash(new_pass, 10);

    // update password and clear token from db
    const updatedUser = await user.findOneAndUpdate(
      { reset_token: token },
      {
        password: newHashedPass,
        reset_token: null,                    
        reset_token_expires_time: null       
      },
      { new: true }
    );

    // send confirmation email
    await send_mail(
      User.email_id,
      "Password changed successfully",
      "Your password has been reset successfully! Thank you."
    );

    return res.status(200).json({
      success: true,
      data: updatedUser,
      message: "Password reset successfully!",
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      data: `${error}`,
      message: "Unable to reset password!",
    });
  }
};
