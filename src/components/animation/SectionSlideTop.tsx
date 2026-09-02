import type { HTMLMotionProps } from "framer-motion"
import type { ReactNode } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { useRef } from "react"

interface SectionSlideTopProps extends HTMLMotionProps<"div"> {
  children: ReactNode
  offset?: number
  // When true the scroll-linked transforms are disabled and
  // the children render normally (useful for admin previews).
  disableEffects?: boolean
}

export const SectionSlideTop = ({
  children,
  offset = 150,
  disableEffects = false,
  ...props
}: SectionSlideTopProps) => {
  const sectionRef = useRef<HTMLDivElement>(null)

  if (disableEffects) {
    return (
      <div
        ref={sectionRef}
        style={{ perspective: "1200px", overflow: "visible" }}
        className="w-full"
        {...(props as any)}
      >
        {children}
      </div>
    )
  }

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  })

  // Scroll-linked transforms for the "cylinder" effect
  const rotateX = useTransform(scrollYProgress, [0, 0.4, 0.6, 1], [-25, 0, 0, 25])
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0])
  const scale = useTransform(scrollYProgress, [0, 0.4, 0.6, 1], [0.85, 1, 1, 0.85])
  const y = useTransform(scrollYProgress, [0, 0.4, 0.6, 1], [offset, 0, 0, -offset])

  return (
    <div ref={sectionRef} style={{ perspective: "1200px", overflow: "visible" }} className="w-full">
      <motion.div
        style={{ rotateX, opacity, scale, y, transformStyle: "preserve-3d" }}
        {...props}
      >
        {children}
      </motion.div>
    </div>
  )
}
