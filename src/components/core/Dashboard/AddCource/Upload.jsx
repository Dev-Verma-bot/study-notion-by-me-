import { useEffect, useRef, useState, useCallback } from "react"
import { useDropzone } from "react-dropzone"
import { FiUploadCloud } from "react-icons/fi"
import { useSelector } from "react-redux"
import "video-react/dist/video-react.css"
import { Player } from "video-react"

export default function Upload({
  name,
  label,
  register,
  setValue,
  errors,
  video = false,
  viewData = null,
  editData = null,
}) {
  const { course } = useSelector((state) => state.course)
  const [selectedFile, setSelectedFile] = useState(null)
  const [previewSource, setPreviewSource] = useState(
    viewData ? viewData : editData ? editData : ""
  )
  const inputRef = useRef(null)

  // ============ Handle file drop ============
  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0]
    if (file) {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onloadend = () => {
        setPreviewSource(reader.result)
      }
      setSelectedFile(file)
    }
  }, [])

  // ============ Dropzone setup ============
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: !video
      ? { "image/*": [".jpeg", ".jpg", ".png"] }
      : { "video/*": [".mp4"] },
    onDrop,
    disabled: !!viewData, 
  })

useEffect(() => {
  register(name, { required: !editData && !viewData }) 
}, [register, name, viewData, editData])


  useEffect(() => {
    setValue(name, selectedFile)
  }, [selectedFile, name, setValue])

  // ============ JSX ============
  return (
    <div className="flex flex-col space-y-2 w-[90%]">
      <label className=" text-richblack-5" htmlFor={name}>
        {label} {!viewData && <sup className="text-yellow-100">*</sup>}
      </label>

      {/* 🔥 Correctly use getRootProps like official example */}
      <div
        {...getRootProps({
          className: `
            ${isDragActive ? "bg-richblack-600" : "bg-richblack-700"}
            flex min-h-[250px]
            ${viewData ? "cursor-default" : "cursor-pointer"}
            items-center justify-center
            rounded-md border-2 border-dotted border-richblack-500
          `,
          onClick: viewData ? (e) => e.preventDefault() : undefined,
        })}
      >
        {!viewData && <input {...getInputProps()} ref={inputRef} />}

        {/* Preview */}
        {previewSource ? (
          <div className="flex w-full flex-col p-6">
            {!video ? (
              <img
                src={previewSource}
                alt="Preview"
                className="h-full w-full rounded-md object-cover"
              />
            ) : (
              <Player aspectRatio="16:9" playsInline src={previewSource} />
            )}

            {!viewData && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  setPreviewSource("")
                  setSelectedFile(null)
                  setValue(name, null)
                }}
                className="mt-3 text-richblack-400 underline"
              >
                Cancel
              </button>
            )}
          </div>
        ) : (
          // Placeholder content
          <div className="flex w-full flex-col items-center p-6">
            <div className="grid aspect-square w-14 place-items-center rounded-full bg-pure-greys-800">
              <FiUploadCloud className="text-2xl text-yellow-50" />
            </div>
            <p className="mt-2 max-w-[200px] text-center text-sm text-richblack-200">
              Drag and drop a {!video ? "image" : "video"}, or click to{" "}
              <span className="font-semibold text-yellow-50">Browse</span> a file
            </p>
            <ul className="mt-10 flex list-disc justify-between space-x-12 text-center text-xs text-richblack-200">
              <li>Aspect ratio 16:9</li>
              <li>Recommended size 1024x576</li>
            </ul>
          </div>
        )}
      </div>

      {/* Error message */}
      {errors[name] && (
        <span className="ml-2 text-xs tracking-wide text-pink-200">
          {label} is required
        </span>
      )}
    </div>
  )
}
