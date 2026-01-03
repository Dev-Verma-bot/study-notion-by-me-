const mongoose= require("mongoose");
const send_mail = require("../util/mail_send");
const otp= mongoose.Schema({
   email:{
    type:String,
    trim:true,
    required:true
   },
   value:{
    type:String,
    required:true
   },
   created_at:{
    type:Date,
    default:Date.now(),
    expires:5*60,
   }

});

// async function Send_verificaton_mail(email,otp) {
//     try{
//     const response= send_mail(email,"verification code ",otp);
//         //     }
//     catch(error){
//         //         throw(error);
//     }   
// }
// otp.pre("save",async function(next){
//     await Send_verificaton_mail(this.email,this.otp);
//     next();
// })
module.exports= mongoose.model("otp",otp);