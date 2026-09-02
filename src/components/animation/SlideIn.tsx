import type { HTMLMotionProps } from "framer-motion"
import type { ReactNode } from "react"
import { motion } from "framer-motion"

interface SlideInProps extends HTMLMotionProps<"div"> {
  children: ReactNode
  direction?: "up" | "down" | "left" | "right"
  delay?: number
  duration?: number
  distance?: number
}

export const SlideIn = ({
  children,
  direction = "up",
  delay = 0,
  duration = 0.5,
  distance = 30,
  ...props
}: SlideInProps) => {
  const getInitialPosition = () => {
    switch (direction) {
      case "up":
        return { y: distance, opacity: 0 }
      case "down":
        return { y: -distance, opacity: 0 }
      case "left":
        return { x: distance, opacity: 0 }
      case "right":
        return { x: -distance, opacity: 0 }
      default:
        return { y: distance, opacity: 0 }
    }
  }

  return (
    <motion.div
      initial={getInitialPosition()}
      whileInView={{ y: 0, x: 0, opacity: 1 }}
      viewport={{ once: true }}
      exit={getInitialPosition()}
      transition={{ duration, delay, ease: "easeOut" }}
      {...props}
    >
      {children}
    </motion.div>
  )
}
