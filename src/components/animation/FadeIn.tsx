import type { HTMLMotionProps } from "framer-motion"
import type { ReactNode } from "react"
import { motion } from "framer-motion"

interface FadeInProps extends HTMLMotionProps<"div"> {
  children: ReactNode
  delay?: number
  duration?: number
}

export const FadeIn = ({
  children,
  delay = 0,
  duration = 0.5,
  ...props
}: FadeInProps) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      exit={{ opacity: 0 }}
      transition={{ duration, delay, ease: "easeInOut" }}
      {...props}
    >
      {children}
    </motion.div>
  )
}
