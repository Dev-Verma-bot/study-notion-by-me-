const mongoose= require("mongoose");
const subsection= mongoose.Schema({
title:{
    type:String,
    required:true,
    trim:true
},
time_duration:{
    type:String,
    required:true,
},
description:{
    type:String,
    required:true,
},
video_url:{
    type:String,
    required:true,
}

});
module.exports= mongoose.model("subsection",subsection);