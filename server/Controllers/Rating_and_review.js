    const cource = require("../models/cource");
    const rating_and_review = require("../models/rating_and_review");

    // create rating and review 
    exports.create_rating_and_review= async(req,res)=>{
    try{
        // fetch data 
        const {cource_id,rating,review}= req.body;
        const user_id= req.user.id;

        // validate 
        if(!cource_id||!rating||!review){
            return res.status(401).json({
                success:false,
                data:"Unable to create rating and review!",
                message:"Please provide all details"
            })
        }
        // check user buyed cource 
        const Cource= await cource.findById(cource_id);

        if(!Cource.students_enrolled.includes(user_id)){
        return res.status(401).json({
                success:false,
                data:"Unable to create rating and review!",
                message:"User not enrolled in cource !"
            })
        }

        // check if user already rated  
        const user_rated= await rating_and_review.findOne({user:user_id,cource: cource_id});
        
        // validate 
        if(user_rated){
                return res.status(401).json({
                success:false,
                data:"Unable to create rating and review!",
                message:"User already have rate and reviewed the cource !"
            })
        }

        // create entry in db 
        const response= await rating_and_review.create({rating:rating,
                                                        review:review,
                                                        user:user_id,
                                                        cource:cource_id,
        })

        // update cource 
        const updated_cource= await cource.findByIdAndUpdate(cource_id,{$push:{rating_and_review:response._id}},{new:true});

        return res.status(200).json({
            success:true,
            data:response,
            message:"Rating and review created successfully !"
        })
    }
    catch(error){
        return res.status(500).json({
            success:false,
            data:`${error}`,
            message:"error while creating Rating and review !"
        })
    }
    }

    // get average rating 
    exports.get_average_rating= async (req,res)=>{
    try{
        // fetch cource id 
    const {cource_id}= req.body;

    // get average rating using agregate 

    const result =await rating_and_review.aggregate([
        {
            $match:{
                cource:cource_id,
            }
        },
        {
            $group:{
                _id:null, averageRating:{$avg:"$rating"}
            }
        }

    ])

    // validate 
    if(result.length===0){
        return res.status(200).json({
            success:true,
            data:0,
            message:"No rating and review exists hence avg rating and review -> 0 "
        })
    }

    return res.status(200).json({
        success:true,
        data:result[0].averageRating,
        message:"Average Rating and Review calculated successfully !"
    })
    }
    catch(error){
        
    return res.status(500).json({
        success:false,
        data:`${error}`,
        message:"Error while calculating average rating and reviw !"
    })
    }
    }

    // get all rating and review 
    exports.get_all_rating_review = async (req, res)=>{
        try{
            const response= await rating_and_review.find({})
                                                    .sort({rating:"desc"})
                                                .populate({ 
                                                    path: "user", 
                                                    select: "first_name last_name email_id image" 
                                                    })
                                                    .populate({ 
                                                    path: "cource", 
                                                    select: "name description" 
                                                    }).exec()

                                                                            
            
            return res.status(200).json({
                success:true,
                data:response,
                message:"All rating and review fetched successfully !"
            })
        }
    catch(error){
            return res.status(500).json({
                success:false,
                data:`${error}`,
                message:"Error while fetching all rating and review !"
            })
    }
    }