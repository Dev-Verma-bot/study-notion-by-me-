const mongoose= require("mongoose");
const category= mongoose.Schema({
name:{
    type:String,
    required:true,
    trim:true
},
description:{
    type:String,
    required:true
},
cources:[{
    type:mongoose.Schema.Types.ObjectId,
    ref:"cource",
    required:true,
}]

});
module.exports= mongoose.model("category",category);