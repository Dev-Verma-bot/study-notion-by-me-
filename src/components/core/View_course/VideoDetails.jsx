import React, { useEffect, useRef, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate, useParams } from "react-router-dom"

import "video-react/dist/video-react.css"
import { useLocation } from "react-router-dom"
import { BigPlayButton, Player } from "video-react"

import { markLectureAsComplete } from "../../../services/operations/courseDetailsApi"
import { updateCompletedLectures } from "../../../slices/viewCourseSlice"
import Icon_button from "../../common/Icon_button"

const VideoDetails = () => {
  // Destructured names matching your URL params
  const { courseID, sectionID, subsectionID } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const playerRef = useRef(null)
  const dispatch = useDispatch()
  const { token } = useSelector((state) => state.auth)
  const { courseSectionData, courseEntireData, completedLectures } =
    useSelector((state) => state.viewCourse)

  const [videoData, setVideoData] = useState(null)
  const [previewSource, setPreviewSource] = useState("")
  const [videoEnded, setVideoEnded] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const setVideoDetails = async () => {
      // 1. Safety check for data availability
      if (!courseSectionData || courseSectionData?.length === 0) return

      // 2. Redirect if params are missing
      if (!courseID || !sectionID || !subsectionID) {
        navigate(`/dashboard/enrolled-courses`)
        return
      }

      // 3. Find specific section matching JSON: section._id
      const filteredSection = courseSectionData?.find(
        (section) => section?._id === sectionID
      )
      
      // 4. Find specific subsection matching JSON: section.subsections (plural)
      const filteredVideoData = filteredSection?.subsections?.find(
        (sub) => sub?._id === subsectionID
      )

      if (filteredVideoData) {
        setVideoData(filteredVideoData)
        setPreviewSource(courseEntireData?.thumbnail)
        setVideoEnded(false)
      }
    }
    setVideoDetails()
  }, [courseSectionData, courseEntireData, location.pathname, sectionID, subsectionID, navigate, courseID])

  // check if the lecture is the first video
  const isFirstVideo = () => {
    const currentSectionIndx = courseSectionData?.findIndex(
      (data) => data?._id === sectionID
    )

    const currentSubSectionIndx = courseSectionData?.[currentSectionIndx]?.subsections?.findIndex(
      (data) => data?._id === subsectionID
    )

    return currentSectionIndx === 0 && currentSubSectionIndx === 0
  }

  // go to the next video
  const goToNextVideo = () => {
    const currentSectionIndx = courseSectionData?.findIndex(
      (data) => data?._id === sectionID
    )

    const noOfSubsections = courseSectionData?.[currentSectionIndx]?.subsections?.length || 0

    const currentSubSectionIndx = courseSectionData?.[currentSectionIndx]?.subsections?.findIndex(
      (data) => data?._id === subsectionID
    )

    if (currentSubSectionIndx !== noOfSubsections - 1) {
      const nextSubSectionId = courseSectionData?.[currentSectionIndx]?.subsections?.[currentSubSectionIndx + 1]?._id
      navigate(`/view-course/${courseID}/section/${sectionID}/sub-section/${nextSubSectionId}`)
    } else {
      const nextSectionId = courseSectionData?.[currentSectionIndx + 1]?._id
      const nextSubSectionId = courseSectionData?.[currentSectionIndx + 1]?.subsections?.[0]?._id
      if(nextSectionId && nextSubSectionId) {
        navigate(`/view-course/${courseID}/section/${nextSectionId}/sub-section/${nextSubSectionId}`)
      }
    }
  }

  // check if the lecture is the last video
  const isLastVideo = () => {
    const currentSectionIndx = courseSectionData?.findIndex(
      (data) => data?._id === sectionID
    )

    const noOfSubsections = courseSectionData?.[currentSectionIndx]?.subsections?.length || 0

    const currentSubSectionIndx = courseSectionData?.[currentSectionIndx]?.subsections?.findIndex(
      (data) => data?._id === subsectionID
    )

    return (
      currentSectionIndx === (courseSectionData?.length || 0) - 1 &&
      currentSubSectionIndx === noOfSubsections - 1
    )
  }

  // go to the previous video
  const goToPrevVideo = () => {
    const currentSectionIndx = courseSectionData?.findIndex(
      (data) => data?._id === sectionID
    )

    const currentSubSectionIndx = courseSectionData?.[currentSectionIndx]?.subsections?.findIndex(
      (data) => data?._id === subsectionID
    )

    if (currentSubSectionIndx !== 0) {
      const prevSubSectionId = courseSectionData?.[currentSectionIndx]?.subsections?.[currentSubSectionIndx - 1]?._id
      navigate(`/view-course/${courseID}/section/${sectionID}/sub-section/${prevSubSectionId}`)
    } else {
      const prevSectionId = courseSectionData?.[currentSectionIndx - 1]?._id
      const prevSubSectionLength = courseSectionData?.[currentSectionIndx - 1]?.subsections?.length || 0
      const prevSubSectionId = courseSectionData?.[currentSectionIndx - 1]?.subsections?.[prevSubSectionLength - 1]?._id
      
      if(prevSectionId && prevSubSectionId) {
        navigate(`/view-course/${courseID}/section/${prevSectionId}/sub-section/${prevSubSectionId}`)
      }
    }
  }

  const handleLectureCompletion = async () => {
    setLoading(true)
    const res = await markLectureAsComplete(
      { courseId: courseID, subsectionId: subsectionID },
      token
    )
        if (res) {
      dispatch(updateCompletedLectures(subsectionID));
    }
    setLoading(false)
  }

  return (
    <div className="flex flex-col gap-5 text-white">
      {!videoData ? (
        <img
          src={previewSource}
          alt="Preview"
          className="h-full w-full rounded-md object-cover"
        />
      ) : (
        <Player
          ref={playerRef}
          aspectRatio="16:9"
          playsInline
          onEnded={() => setVideoEnded(true)}
          src={videoData?.video_url} // Changed to video_url to match your JSON
        >
          <BigPlayButton position="center" />
          
          {videoEnded && (
            <div
              style={{
                backgroundImage:
                  "linear-gradient(to top, rgb(0, 0, 0), rgba(0,0,0,0.7), rgba(0,0,0,0.5), rgba(0,0,0,0.1)",
              }}
              className="full absolute inset-0 z-[100] grid h-full place-content-center font-inter bg-black/40 backdrop-blur-sm"
            >
              {!completedLectures?.includes(subsectionID) && (
                <Icon_button
                  disabled={loading}
                  onClick={() => handleLectureCompletion()}
                  text={!loading ? "Mark As Completed" : "Loading..."}
                  customClasses="text-xl max-w-max px-4 mx-auto"
                />
              )}
              <Icon_button
                disabled={loading}
                onClick={() => {
                  if (playerRef?.current) {
                    playerRef?.current?.seek(0)
                    setVideoEnded(false)
                  }
                }}
                text="Rewatch"
                customClasses="text-xl max-w-max px-4 mx-auto mt-2"
              />
              <div className="mt-10 flex min-w-[250px] justify-center gap-x-4 text-xl">
                {!isFirstVideo() && (
                  <button onClick={goToPrevVideo} className="blackButton">
                    Prev
                  </button>
                )}
                {!isLastVideo() && (
                  <button onClick={goToNextVideo} className="blackButton">
                    Next
                  </button>
                )}
              </div>
            </div>
          )}
        </Player>
      )}

      <h1 className="mt-4 text-3xl font-semibold">{videoData?.title}</h1>
      <p className="pt-2 pb-6">{videoData?.description}</p>
    </div>
  )
}

export default VideoDetails