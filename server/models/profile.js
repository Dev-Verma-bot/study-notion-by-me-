const mongoose= require("mongoose");
const profile= mongoose.Schema({
   gender:{
    type:String,
    trim:true
   },
   dob:{
    type:String,
   },
   about_user:{
    type:String,
    trim:true
   },
   contact_no:{
    type:Number,
    trim:true
   }

});
module.exports= mongoose.model("profile",profile);