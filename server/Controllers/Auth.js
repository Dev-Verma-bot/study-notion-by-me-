const user = require("../models/users");
const otp = require("../models/otp");
const otp_generator = require("otp-generator");
const bcrypt= require("bcrypt");
const profile= require("../models/profile");
const jwt= require("jsonwebtoken");
const send_mail = require("../util/mail_send");

require("dotenv").config();
// send otp 
exports.send_otp = async (req, res) => {
 console.log("send_otp called", new Date().toISOString(), req.body.email);
 
    try {
        const { email } = req.body;

        // check user exists 
        const exists = await user.findOne({ email_id: email });
        if (exists) {
            return res.status(500).json({
                success: false,
                data: "User exists with following mail !",
            });
        }

        // generate otp 
        let OTP = otp_generator.generate(6, {
            upperCaseAlphabets: false,
            lowerCaseAlphabets: false,
            specialChars: false,
        });

        let result = await otp.findOne({ value: OTP });

        // generate unique otp 
        while (result) {
            OTP = otp_generator.generate(6, {
                upperCaseAlphabets: false,
                lowerCaseAlphabets: false,
                specialChars: false,
            });
            result = await otp.findOne({ value: OTP });
        }

        // create db entry 
        const otp_entry = await otp.create({
            email,
            value: OTP,
        });

        console.log(otp_entry);
        
        // send mail 
        await send_mail(email,"Study Notion",`<h1>Sign up otp -> </h1> <br>${otp_entry.value}`)
        return res.status(200).json({
            success: true,
            data: otp_entry,
            message: "Otp sent successfully"
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            data: `${error}`,
            message: "Unable to send OTP!"
        });
    }
};
// sign up
exports.sign_up = async (req, res) => {
  try {
    // fetch_data
    const {
      First_name,
      Last_name,
      Email_add,
      Password,
      cnfrm_password,
      account_type,
      Otp,
      contact_no,
    } = req.body;

    // validate all entries filled 
    if (!First_name || !Last_name || !Email_add || !Password || !cnfrm_password || !account_type) {
      return res.status(401).json({
        success: false,
        data: "unable to sign up!",
        message: "please fill all entries to proceed further"
      });
    }

    // check both pass match 
    if (Password !== cnfrm_password) {
      return res.status(401).json({
        success: false,
        message: "unable to sign_up password and confirm pass are different!"
      });
    }

    // check email exists 
    const email_exists = await user.findOne({ email_id: Email_add });
    if (email_exists) {
      return res.status(401).json({
        success: false,
        message: "unable to sign_up email id already exist!"
      });
    }

    // find recent otp
    const recent_otp = await otp.find({ email: Email_add }).sort({ created_at: -1 }).limit(1);

    console.log("recent_otp : ", recent_otp);
    // validate otp 
    if (recent_otp.length === 0) {
      return res.status(401).json({
        success: false,
        data: "unable to sign_up",
        message: "Otp not found",
      });
    }

    // check otp matches
    if (recent_otp[0].value !== Otp) {
      return res.status(401).json({
        success: false,
        data: "unable to sign_up",
        message: "wrong otp please enter valid otp!",
      });
    }

    // hash the password 
    const hashed_pass = await bcrypt.hash(Password, 10);

    const Profile = await profile.create({
      gender: null,
      dob: null,
      about_user: null,
      contact_no: contact_no,
    });

    // create db entry 
    const sign_up_response = await user.create({
      first_name: First_name,
      last_name: Last_name,
      email_id: Email_add,
      password: hashed_pass,
      role: account_type,
      profile: Profile._id,
      contact_no,
      image: `https://api.dicebear.com/5.x/initials/svg?seed=${First_name}/${Last_name}`
    });

    return res.status(200).json({
      success: true,
      sign_up_response,
      message: "Sign up successfully !",
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      data: `${error}`,
      message: "Error in sign up !",
    });
  }
};


// log-in 
exports.login = async (req, res) => {
    try {
        const { email, pass} = req.body;

        // validate 
        if (!email || !pass) {
            return res.status(401).json({
                success: false,
                data: "unable to login",
                messege: "please fill all entries to proceed further"
            });
        }

        // check user exists?
        const User = await user.findOne({ email_id: email });

        if (!User) {
            return res.status(401).json({
                success: false,
                data: "unable to login",
                message: "user not exists (new user please sign up)",
            });
        }

        // check pass match 
        const pass_match = await bcrypt.compare(pass, User.password);

        if (!pass_match) {
            return res.status(401).json({
                success: false,
                data: "unable to login",
                message: "Invalid password please enter valid password!",
            });
        }

        // create jwt token
        const payload = {
            email_id: email,
            id:User._id,
            role: User.role,
        };
        const optional = {
            expiresIn: "30d"
        };
        const secret = process.env.jwt_secret;
        const token = jwt.sign(payload, secret, optional);
        
        // save token in fetched user object 
        const userObject = User.toObject();
        userObject.token = token;
        userObject.password = undefined;

        // send token via cookie
        const cookie_optional = {
            expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
            httpOnly: true
        };

        res.cookie("token", token, cookie_optional).status(200).json({
            success: true,
            data: userObject,
            message: "Congrats! User logged in successfully"
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            data: `${error}`,
            message: "Unable to log-in!"
        });
    }
};
// change pass 
exports.change_pass = async (req, res) => {
  try {
    // fetch data
    const { email, old_pass, new_pass, cnfrm_pass } = req.body;

    // validate 
    if (!old_pass || !new_pass || !email || !cnfrm_pass) {
      return res.status(401).json({
        success: false,
        data: "unable to change password!",
        message: "Please fill all the credentials and try again.",
      });
    }

    // validate new pass and confirm pass     
    if (new_pass !== cnfrm_pass) {
      return res.status(401).json({
        success: false,
        data: "unable to change password!",
        message: "New password and confirm password must be same!",
      });
    }

    // find user  
    const User = await user.findOne({ email_id: email });
    if (!User) {
      return res.status(404).json({
        success: false,
        message: "User not found!",
      });
    }

    // check if old_pass matches db
    const passMatch = await bcrypt.compare(old_pass, User.password);
    if (!passMatch) {
      return res.status(401).json({
        success: false,
        data: "unable to change password!",
        message: "Incorrect old password!",
      });
    }

    // hash new password
    const newHashedPass = await bcrypt.hash(new_pass, 10);

    // update password in db
    const updatedUser = await user.findOneAndUpdate(
      { email_id: email },
      { password: newHashedPass },
      { new: true }
    );
    // send mail 
    
    send_mail(email,"Password changed Successfully","your password has been changed succussfully thank u !");

    return res.status(200).json({
      success: true,
      data: updatedUser,
      message: "Password changed successfully!",
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      data: `${error}`,
      message: "Unable to change password!",
    });
  }
};

