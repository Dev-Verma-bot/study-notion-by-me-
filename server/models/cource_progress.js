const mongoose= require("mongoose");
const cource_progress= mongoose.Schema({
   cource_id:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"cource"
   }, 
   userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
   completed_videos:[{
    type:mongoose.Schema.Types.ObjectId,
    ref:"subsection"
   }]

});
module.exports= mongoose.model("cource_progress",cource_progress);