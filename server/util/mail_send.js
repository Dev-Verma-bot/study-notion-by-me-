const nodemailer= require("nodemailer");

require("dotenv").config();
const send_mail= async function (email,title,body){
         console.trace("Mail function called from:");
    try{
const transporter = nodemailer.createTransport({
  host: process.env.mail_host,
    port: 465,
  secure: true,
   auth: {
    user: process.env.mail_user,
    pass: process.env.mail_pass,
  },
}
);

const info=await transporter.sendMail({
   from: `"Study Notion" <${process.env.mail_user}>`,
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