import type { HTMLMotionProps } from "framer-motion"
import type { ReactNode } from "react"
import { motion } from "framer-motion"

interface SlideProps extends HTMLMotionProps<"div"> {
  children: ReactNode
  delay?: number
  duration?: number
  distance?: number
}

export const SlideLeft = ({
  children,
  delay = 0,
  duration = 0.5,
  distance = 30,
  ...props
}: SlideProps) => {
  return (
    <motion.div
      initial={{ x: -distance, opacity: 0 }}
      whileInView={{ x: 0, opacity: 1 }}
      viewport={{ once: true }}
      exit={{ x: -distance, opacity: 0 }}
      transition={{ duration, delay, ease: "easeOut" }}
      {...props}
    >
      {children}
    </motion.div>
  )
}
