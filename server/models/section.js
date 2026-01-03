const mongoose= require("mongoose");
const section= mongoose.Schema({
section_name:{
    type:String,
    required:true,
    trim:true
},
subsections:[{
    type:mongoose.Schema.Types.ObjectId,
    ref:"subsection"
}]

});
module.exports= mongoose.model("section",section);