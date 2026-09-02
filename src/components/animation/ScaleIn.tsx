import type { HTMLMotionProps } from "framer-motion"
import type { ReactNode } from "react"
import { motion } from "framer-motion"

interface ScaleInProps extends HTMLMotionProps<"div"> {
  children: ReactNode
  delay?: number
  duration?: number
  initialScale?: number
}

export const ScaleIn = ({
  children,
  delay = 0,
  duration = 0.4,
  initialScale = 0.9,
  ...props
}: ScaleInProps) => {
  return (
    <motion.div
      initial={{ scale: initialScale, opacity: 0 }}
      whileInView={{ scale: 1, opacity: 1 }}
      viewport={{ once: true }}
      exit={{ scale: initialScale, opacity: 0 }}
      transition={{ duration, delay, ease: "easeOut" }}
      {...props}
    >
      {children}
    </motion.div>
  )
}
