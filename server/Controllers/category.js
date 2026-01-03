const category= require("../models/category");
// create tags 
exports.create_category= async( req,res)=>{
try{
    // fetch data 
const {category_name,description}= req.body;
// validate 
if(!category_name||!description){
    return res.status(401).json({
        success:false,
        data:"Unable to make category",
        messege:"please fill all details "
    })
}

// create db entry 
const response= await category.create({
    name:category_name,
    description:description,
})

    return res.status(200).json({
        success:true,
        data:response,
        message:"category created suessfully !",
        })
}
catch(error){
        return res.status(500).json({
        success:false,
        data:`${error}`,
        message:"Error while creating category",
        })
}
}
// fetch all tags 
exports.fetch_all_category= async(req,res)=>{

try{

    // fetch from  db  
    const response= await category.find({},{cources:0})

    return res.status(200).json({
        success:true,
        data:response,
        message:"aLL categories fetched successfully !",
        })
}
catch(error){
        return res.status(500).json({
        success:false,
        data:`${error}`,
        message:"Error while fetching all categories",
        })
}
}
// category_page_details 

// fetch all cources related to category 
// fetch different category cources 
// fetch top selling cources 

exports.category_page_detalis = async (req, res) => {
  try {
    const { categoryId } = req.body
    console.log("PRINTING CATEGORY ID:", categoryId)

    // ================= SELECTED CATEGORY =================
    const selectedCategory = await category
      .findById(categoryId)
      .populate({
        path: "cources", // keep consistent with your schema
        match: { status: "Published" },
        populate: { path: "rating_and_review" },
      })

    if (!selectedCategory) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      })
    }

    if (!selectedCategory.cources || selectedCategory.cources.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No courses found for the selected category",
      })
    }

    // ================= DIFFERENT CATEGORY =================
    const categoriesExceptSelected = await category.find({
      _id: { $ne: categoryId },
    })

    let differentCategory = null

    if (categoriesExceptSelected.length > 0) {
      const randomIndex = Math.floor(
        Math.random() * categoriesExceptSelected.length
      )

      differentCategory = await category
        .findById(categoriesExceptSelected[randomIndex]._id)
        .populate({
          path: "cources",
          match: { status: "Published" },
        })
    }

    // ================= MOST SELLING COURSES =================
    const allCategories = await category
      .find()
      .populate({
        path: "cources",
        match: { status: "Published" },
        populate: { path: "instructor" },
      })

    const allCourses = allCategories.flatMap(
      (cat) => cat.cources || []
    )

    const mostSellingCourses = allCourses
      .sort((a, b) => b.sold - a.sold)
      .slice(0, 10)

    // ================= RESPONSE =================
    return res.status(200).json({
      success: true,
      data: {
        selectedCategory,
        differentCategory,
        mostSellingCourses,
      },
    })
  } catch (error) {
    console.error(error)
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    })
  }
}
