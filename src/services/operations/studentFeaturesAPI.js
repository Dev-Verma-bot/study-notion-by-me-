import toast from "react-hot-toast";
import { ApiConnect } from "../ApiConnect";
import { studentEndpoints } from "../Apis";
import rzorpy from "../../assets/Logo/rzp_logo.png"
import { resetCart } from "../../slices/cartSlice";

const { COURSE_PAYMENT_API }= studentEndpoints
{/* <script src="https://checkout.razorpay.com/v1/checkout.js"></script> */}
// whole loadScript is equivalent to above line 
function loadScript(src){
    return new Promise ((resolve)=>{
        const script= document.createElement("script");
        script.src= src;
        script.onload=()=>{
            resolve(true);
        }
        script.onerror=()=>{
            resolve(false);
        }
        document.body.appendChild(script);
    })
}

const buyCourse= async (courses,token,userDetails,navigate,dispatch)=>{
const toast_id= toast.loading("Loading...");
            try{
            const res= await loadScript("https://checkout.razorpay.com/v1/checkout.js");

            if(!res){
                toast.error("Razorpay SDK failed to load !");
                return;
            }

            // initiate the order 

            const courseIds = courses.map(course => course.courseID);

            const orderResponse = await ApiConnect(
            "POST",
            COURSE_PAYMENT_API,
            { courses: courseIds },
            {
                Authorization: `Bearer ${token}`,
            }
            );
            console.log("Order responsne -> " ,orderResponse); 


            if(!orderResponse.data.success) 
                throw new Error (orderResponse.data.message);

            // create options 
            const options= {
                key:"rzp_test_RtPeoxJOmGDsPE",
                currency:orderResponse.data.data.currency,
                amount:`${orderResponse.data.data.amount}`,
                order_id:orderResponse.data.data.id,
                name:"Study Notion",
                description:"Thank You for purchasing the course.",
                image:rzorpy,
                prefill:{
                    name:`${userDetails.first_name}`,
                    email:`${userDetails.email_id}`
                },
                handler: async function(){
                    toast.success("Payment successful. Enrollment is being confirmed.");
                    dispatch(resetCart());
                    navigate("/dashboard/enrolled-courses");
                }
            }

            // open payment dialog box 
                const payment_object= new window.Razorpay(options);

                payment_object.open();
                payment_object.on("payment.failed",function(response){
                    toast.error("OOPS,payment failed ! ");
                    console.log(response.error);
                })

                    }
catch(error){   
    console.log("Payment API Error ... ",error)
    toast.error("Could not make payment !")

}
finally{
toast.dismiss(toast_id);
}
}
export default buyCourse;
