const nodemailer= require("nodemailer");

require("dotenv").config();
const send_mail= async function (email,title,body){
         console.trace("Mail function called from:");
    try{
const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
    port: 465,
  secure: true,
   auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
}
);

const info=await transporter.sendMail({
   from: `"Study Notion" <${process.env.MAIL_USER}>`,
    to:email,
    subject:title,
    html:`${body}`
})
return info;
}
catch(error){
        console.log("unable to send mail")
}
}

module.exports= send_mail;
