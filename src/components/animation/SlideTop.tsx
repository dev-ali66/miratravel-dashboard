import type { HTMLMotionProps } from "framer-motion"
import type { ReactNode } from "react"
import { motion } from "framer-motion"

interface SlideProps extends HTMLMotionProps<"div"> {
  children: ReactNode
  delay?: number
  duration?: number
  distance?: number
}

export const SlideTop = ({
  children,
  delay = 0,
  duration = 0.5,
  distance = 30,
  ...props
}: SlideProps) => {
  return (
    <motion.div
      initial={{ y: -distance, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      viewport={{ once: true }}
      exit={{ y: -distance, opacity: 0 }}
      transition={{ duration, delay, ease: "easeOut" }}
      {...props}
    >
      {children}
    </motion.div>
  )
}
