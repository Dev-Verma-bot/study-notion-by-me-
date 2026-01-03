import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import { FaStar } from "react-icons/fa";
import ReactStars from "react-rating-stars-component";
import toast from "react-hot-toast";

// Swiper CSS
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

import { ratingsEndpoints } from "../../services/Apis";
import { ApiConnect } from "../../services/ApiConnect";

const Review_slider = () => {
    const [review_data, setReview_data] = useState([]);

    const fetch_review_data = async () => {
        const toastId = toast.loading("Loading reviews...");
        try {
            const response = await ApiConnect("GET", ratingsEndpoints.REVIEWS_DETAILS_API);

            if (response?.data?.success) {
                setReview_data(response?.data?.data);
            }
        } catch (error) {
                        toast.error("Could not fetch reviews");
        }
        toast.dismiss(toastId);
    };

    useEffect(() => {
        fetch_review_data();
    }, []);

    return (
        <div className="w-[80%] mx-auto py-12">
            <p className="text-[30px] mb-[50px] text-white font-bold font-inter text-center">
                Rating and reviews from other learners
            </p>
            <div className="max-w-maxContent tab-container mx-auto">
                <Swiper
                    modules={[Autoplay, Pagination, Navigation]}
                    slidesPerView={1}
                    spaceBetween={25}
                    loop={review_data.length > 1}
                    autoplay={{
                        delay: 1500,
                        disableOnInteraction: false,
                    }}
                    breakpoints={{
                        1024: {
                            slidesPerView: 4,
                        },
                    }}
                    className="w-full"
                >
                    {review_data.map((review, index) => (
                        <SwiperSlide key={index}>
                            <div className="flex flex-col gap-3 border-none bg-richblack-800 p-4 text-[14px] text-richblack-5 min-h-[180px]">
                                
                                {/* User Info Section */}
                                <div className="flex items-center gap-4">
                                    <img
                                        // Default image if user.image is null
                                        src={review?.user?.image || `https://api.dicebear.com/5.x/initials/svg?seed=User`}
                                        alt="profile"
                                        className="h-9 w-9 rounded-full object-cover"
                                    />
                                    <div className="flex flex-col">
                                        <h1 className="font-semibold text-richblack-5 capitalize">
                                            {/* Default name if user details are null */}
                                            {review?.user 
                                                ? `${review?.user?.first_name} ${review?.user?.last_name}` 
                                                : "User"
                                            }
                                        </h1>
                                        <h2 className="text-[12px] font-medium text-richblack-500">
                                            {review?.cource?.name}
                                        </h2>
                                    </div>
                                </div>

                                {/* Review Text */}
                                <p className="font-medium text-richblack-25">
                                    {review?.review.split(" ").length > 5
                                        ? `${review?.review.split(" ").slice(0, 5).join(" ")}...`
                                        : `${review?.review}`}
                                </p>

                                {/* Rating Section */}
                                <div className="flex items-center gap-2">
                                    <h3 className="font-semibold text-yellow-100">
                                        {Number(review?.rating || 0).toFixed(1)}
                                    </h3>
                                    <ReactStars
                                        count={5}
                                        value={Number(review?.rating || 0)}
                                        size={20}
                                        edit={false}
                                        activeColor="#ffd700"
                                        emptyIcon={<FaStar />}
                                        fullIcon={<FaStar />}
                                    />
                                </div>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </div>
    );
};

export default Review_slider;