import {combineReducers} from "@reduxjs/toolkit"
import authReducer from "../slices/authSlice"
import profileReducer from "../slices/profileSlice"
import cartReducer from "../slices/cartSlice"
import courceReducer from "../slices/courseSlice"
import view_cource_reducer from "../slices/viewCourseSlice"
const rootReducers= combineReducers({
auth:authReducer,
profile:profileReducer,
cart:cartReducer,
course:courceReducer,
viewCourse:view_cource_reducer
}
)
export default rootReducers;