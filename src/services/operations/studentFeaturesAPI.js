import toast from "react-hot-toast";
import { ApiConnect } from "../ApiConnect";
import { studentEndpoints } from "../Apis";
import rzorpy from "../../assets/Logo/rzp_logo.png"
import { setPaymentLoading } from "../../slices/courseSlice";
import { resetCart } from "../../slices/cartSlice";

const { COURSE_PAYMENT_API,COURSE_VERIFY_API,SEND_PAYMENT_SUCCESS_EMAIL_API}= studentEndpoints
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
                handler: function(response){
                    // send successful payment mail 
                    send_payment_success_mail(response,orderResponse.data.data.amount,token);
                    // verify payment 
                    verify_payment({...response,courses},token,navigate,dispatch)
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
toast.dismiss(toast_id);
}

async function send_payment_success_mail(response, amount, token) {
    try{
        await ApiConnect("POST", SEND_PAYMENT_SUCCESS_EMAIL_API, {
            orderId: response.razorpay_order_id,
            paymentId: response.razorpay_payment_id,
            amount,
        },{
            Authorization: `Bearer ${token}`
        })
    }
    catch(error) {
        console.log("PAYMENT SUCCESS EMAIL ERROR....", error);
    }
}
async function verify_payment(bodyData, token, navigate, dispatch) {
    
console.log(bodyData);
    const toastId = toast.loading("Verifying Payment....");
    dispatch(setPaymentLoading(true));
    
    try{
        const response  = await ApiConnect("POST", COURSE_VERIFY_API, bodyData, {
            Authorization:`Bearer ${token}`,
        })

        if(!response.data.success) {
            throw new Error(response.data.message);
        }
        toast.success("payment Successful, ypou are addded to the course");
        navigate("/dashboard/enrolled-courses");
        dispatch(resetCart());
    }   
    catch(error) {
        console.log("PAYMENT VERIFY ERROR....", error);
        toast.error("Could not verify Payment");
    }
    toast.dismiss(toastId);
    dispatch(setPaymentLoading(false));
}
export default buyCourse;