const mongoose= require("mongoose");
const rating_and_review= mongoose.Schema({
user:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"user",
    required:true
},
cource:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"cource",
    required:true
},
rating:{
    type:String,
    required:true
},
review:{
    type:String,
    required:true
}

});
module.exports= mongoose.model("rating_and_review",rating_and_review);