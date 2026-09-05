import { motion, useMotionValue, useSpring, useTransform } from "framer-motion"
import * as React from "react"

import { cn } from "@/lib/utils"

interface Hover3DProps {
  children: React.ReactNode
  className?: string
  tiltMax?: number
}

export const Hover3D = ({
  children,
  className,
  tiltMax = 10,
}: Hover3DProps) => {
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const mouseXSpring = useSpring(x)
  const mouseYSpring = useSpring(y)

  const rotateX = useTransform(
    mouseYSpring,
    [-0.5, 0.5],
    [`${tiltMax}deg`, `-${tiltMax}deg`]
  )
  const rotateY = useTransform(
    mouseXSpring,
    [-0.5, 0.5],
    [`-${tiltMax}deg`, `${tiltMax}deg`]
  )

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const width = rect.width
    const height = rect.height
    const mouseX = e.clientX - rect.left
    const mouseY = e.clientY - rect.top
    const xPct = mouseX / width - 0.5
    const yPct = mouseY / height - 0.5
    x.set(xPct)
    y.set(yPct)
  }

  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      className={cn("transition-all duration-200 ease-linear", className)}
    >
      {children}
    </motion.div>
  )
}
