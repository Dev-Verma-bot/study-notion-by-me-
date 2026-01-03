const cloudinary= require("cloudinary").v2;
require("dotenv").config()

exports.cloudinary_connect= ()=>{
try{
cloudinary.config({
 cloud_name:process.env.cloud_name,
 api_key:process.env.API_KEY,
 api_secret:process.env.API_SECRET
}
)
console.log("Successfully connected to cloudinary !")
}
catch(error){
    console.log("error");
console.log("error while connecting to cloudinary!");
}

}