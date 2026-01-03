import { useEffect, useRef, useState } from "react"
import { AiOutlineDown } from "react-icons/ai"
import CourseSubSectionAccordion from "./CourseSubSectionAccordion"

export default function CourseAccordionBar({ course, isActive, handleActive }) {
  const contentEl = useRef(null)

  const [active, setActive] = useState(false)
  const [sectionHeight, setSectionHeight] = useState(0)

  useEffect(() => {
    setActive(isActive?.includes(course?._id))
  }, [isActive, course?._id])

  useEffect(() => {
    setSectionHeight(active ? contentEl.current?.scrollHeight : 0)
  }, [active])

  const subSections = course?.subsections || []   // ✅ BACKEND MATCH

  return (
    <div className="overflow-hidden border border-richblack-600 bg-richblack-700 text-richblack-5 last:mb-0">
      <div
        className="flex cursor-pointer items-start justify-between bg-opacity-20 px-7 py-6"
        onClick={() => handleActive(course?._id)}
      >
        <div className="flex items-center gap-2">
          <i className={isActive?.includes(course?._id) ? "rotate-180" : "rotate-0"}>
            <AiOutlineDown />
          </i>
          <p>{course?.section_name}</p> {/* ✅ FIX */}
        </div>

        <div className="space-x-4">
          <span className="text-yellow-25">
            {`${subSections.length} lecture(s)`} {/* ✅ SAFE */}
          </span>
        </div>
      </div>

      <div
        ref={contentEl}
        className="relative h-0 overflow-hidden bg-richblack-900 transition-[height] duration-[0.35s]"
        style={{ height: sectionHeight }}
      >
        <div className="flex flex-col gap-2 px-7 py-6 font-semibold">
          {subSections.map((subSec, i) => (
            <CourseSubSectionAccordion subSec={subSec} key={i} />
          ))}
        </div>
      </div>
    </div>
  )
}
