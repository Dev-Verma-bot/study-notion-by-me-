import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "react-hot-toast"
import { HiOutlineCurrencyRupee } from "react-icons/hi"
import { MdNavigateNext } from "react-icons/md"
import { useDispatch, useSelector } from "react-redux"
import {
  addCourseDetails,
  editCourseDetails,
  fetchCourseCategories,
} from "../../../../../services/operations/courseDetailsApi"
import { setCourse, setStep } from "../../../../../slices/courseSlice"
import { COURSE_STATUS } from "../../../../../utils/constants"
import Icon_button from "../../../../common/Icon_button"
import Upload from "../Upload"
import ChipInput from "./ChipInput"
import RequirementsField from "./RequirementForm"

export default function CourseInformationForm() {
  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    reset,
    watch,
    formState: { errors, isSubmitSuccessful },
  } = useForm()
  const dispatch = useDispatch()
  const { token } = useSelector((state) => state.auth)
  const { course, editCourse } = useSelector((state) => state.course)
  const [loading, setLoading] = useState(false)
  const [courseCategories, setCourseCategories] = useState([])

  useEffect(() => {
    const getCategories = async () => {
      setLoading(true)
      const categories = await fetchCourseCategories()
      if (categories?.length > 0) setCourseCategories(categories)
      setLoading(false)
    }

    if (editCourse && course) {
      setValue("name", course.name)
      setValue("description", course.description)
      setValue("price", course.price)
      setValue("Tag", course.tag)
      setValue("what_you_will_learn", course.what_you_will_learn)
      setValue("Category", course.category)
      setValue("instructions", course.instructions)
      setValue("course_image", course.thumbnail)
    }

    getCategories()
  }, [editCourse, course, setValue])

  const isFormUpdated = () => {
    const currentValues = getValues()
    return (
      currentValues.name !== course.name ||
      currentValues.description !== course.description ||
      currentValues.price !== course.price ||
      JSON.stringify(currentValues.Tag) !== JSON.stringify(course.tag) ||
      currentValues.what_you_will_learn !== course.what_you_will_learn ||
      currentValues.Category?._id !== course.category?._id ||
      JSON.stringify(currentValues.instructions) !==
        JSON.stringify(course.instructions) ||
      currentValues.course_image !== course.thumbnail
    )
  }

  const onSubmit = async (data) => {
    const formData = new FormData()

    if (editCourse) {
      if (!isFormUpdated()) {
        toast.error("No changes made to the form!")
        return
      }

      const currentValues = getValues()
      formData.append("cource_id", course._id)
      if (currentValues.name !== course.name) formData.append("name", data.name)
      if (currentValues.description !== course.description)
        formData.append("description", data.description)
      if (currentValues.price !== course.price)
        formData.append("price", data.price)
      if (currentValues.what_you_will_learn !== course.what_you_will_learn)
        formData.append("what_you_will_learn", data.what_you_will_learn)
      if (JSON.stringify(currentValues.Tag) !== JSON.stringify(course.tag))
        formData.append("Tag", JSON.stringify(data.Tag))
      if (currentValues.Category !== course.category)
        formData.append("Category", data.Category)
      if (
        JSON.stringify(currentValues.instructions) !==
        JSON.stringify(course.instructions)
      ) {
        formData.append("instructions", JSON.stringify(data.instructions))
      }
      if (currentValues.course_image !== course.thumbnail)
        formData.append("thumbnailimage", data.course_image)

      setLoading(true)
      const result = await editCourseDetails(formData, token)
      setLoading(false)

      if (result) {
        dispatch(setCourse(result))
        dispatch(setStep(2))
      }
      return
    }

    formData.append("name", data.name)
    formData.append("description", data.description)
    formData.append("what_you_will_learn", data.what_you_will_learn)
    formData.append("price", data.price)
    formData.append("Tag", JSON.stringify(data.Tag))
    formData.append("Category", data.Category)
    formData.append("status", COURSE_STATUS.DRAFT)
    formData.append("instructions", JSON.stringify(data.instructions))
    formData.append("thumbnailimage", data.course_image)

    setLoading(true)
    const result = await addCourseDetails(formData, token)
    setLoading(false)
    if (result) {
      dispatch(setCourse(result))
      dispatch(setStep(2))
    }
  }

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset({
        name: "",
        description: "",
        what_you_will_learn: "",
        price: "",
        Tag: [],
        Category: "",
        instructions: [],
        course_image: "",
      })
    }
  }, [isSubmitSuccessful, reset])

  const selectedCategory = watch("Category")

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="py-7 gap-4 rounded-md flex flex-col mx-auto items-center border border-blue-100 text-white shadow-md bg-richblack-800"
    >
      <div className="w-[90%] flex flex-col gap-2">
        <label htmlFor="name">
          Course Title <span className="text-yellow-100">*</span>
        </label>
        <input
          id="name"
          placeholder="Enter Course Title"
          {...register("name", { required: true })}
          className="w-full px-4 py-3 rounded-md bg-richblack-700 text-white border border-richblack-500 focus:ring-2 focus:ring-blue-100 placeholder:text-richblack-300"
        />
        {errors.name && <span>Enter Title</span>}
      </div>

      <div className="w-[90%] flex flex-col gap-2">
        <label htmlFor="description">
          Course Description <span className="text-yellow-100">*</span>
        </label>
        <textarea
          id="description"
          rows="7"
          placeholder="Enter Course Description"
          {...register("description", { required: true })}
          className="w-full px-4 py-3 rounded-md bg-richblack-700 text-white border border-richblack-500 focus:ring-2 focus:ring-blue-100 placeholder:text-richblack-300"
        />
        {errors.description && <span>Enter Description</span>}
      </div>

      <div className="w-[90%] flex flex-col gap-2">
        <label htmlFor="price">
          Course Price <span className="text-yellow-100">*</span>
        </label>
        <div className="relative">
          <HiOutlineCurrencyRupee className="absolute left-3 top-1/2 -translate-y-1/2 text-xl text-richblack-400" />
          <input
            id="price"
            placeholder="Enter Price (INR)"
            {...register("price", { required: true, valueAsNumber: true })}
            className="w-full px-10 py-3 rounded-md bg-richblack-700 text-white border border-richblack-500 focus:ring-2 focus:ring-blue-100 placeholder:text-richblack-300"
          />
        </div>
        {errors.price && <span>Enter Price</span>}
      </div>

      <div className="w-[90%] flex flex-col gap-2">
        <label htmlFor="Category">
          Category <span className="text-yellow-100">*</span>
        </label>
        <select
          id="Category"
          defaultValue=""
          {...register("Category", { required: true })}
          className={`w-full px-4 py-3 rounded-md bg-richblack-700 border border-richblack-500 focus:ring-2 focus:ring-blue-100 transition-all duration-200 ${
            !selectedCategory ? "text-richblack-300" : "text-white"
          }`}
        >
          <option value="" disabled hidden>
            {loading ? "Loading categories..." : "Choose a category..."}
          </option>
          {courseCategories.map((cat) => (
            <option key={cat._id} value={cat._id} className="text-white">
              {cat.name}
            </option>
          ))}
        </select>
        {errors.Category && (
          <span className="text-red-400 text-sm">Choose Category</span>
        )}
      </div>

      <ChipInput
        label="Tags"
        name="Tag"
        placeholder="Enter Tags and press Enter"
        register={register}
        setValue={setValue}
        getValues={getValues}
        errors={errors}
      />

      <Upload
        name="course_image"
        label="Course Thumbnail"
        register={register}
        setValue={setValue}
        errors={errors}
        editData={editCourse ? course?.thumbnail : null}
      />

      <div className="w-[90%] flex flex-col gap-2">
        <label htmlFor="what_you_will_learn">
          Benefits of the Course <span className="text-yellow-100">*</span>
        </label>
        <textarea
          id="what_you_will_learn"
          rows="7"
          placeholder="Enter Benefits of the Course"
          {...register("what_you_will_learn", { required: true })}
          className="w-full px-4 py-3 rounded-md bg-richblack-700 text-white border border-richblack-500 focus:ring-2 focus:ring-blue-100 placeholder:text-richblack-300"
        />
        {errors.what_you_will_learn && <span>Enter Course Benefits</span>}
      </div>

      <RequirementsField
        name="instructions"
        label="Requirements / Instructions"
        register={register}
        setValue={setValue}
        getValues={getValues}
        errors={errors}
      />

      <div className="flex justify-end gap-x-2 w-[90%] pt-3">
        {editCourse && (
          <button
            type="button"
            onClick={() => dispatch(setStep(2))}
            disabled={loading}
            className="flex items-center gap-x-2 rounded-md bg-richblack-300 py-[8px] px-[20px] font-semibold text-richblack-900"
          >
            Continue Without Saving
          </button>
        )}
        <Icon_button
          disabled={loading}
          text={!editCourse ? "Next" : "Save Changes"}
          type="Submit"
        >
          <MdNavigateNext />
        </Icon_button>
      </div>
    </form>
  )
}