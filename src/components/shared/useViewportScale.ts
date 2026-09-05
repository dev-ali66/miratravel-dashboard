import * as React from "react"

export const DESIGN_WIDTH = 1920
export const DESIGN_HEIGHT = 1080

export function useViewportScale(
  designWidth = DESIGN_WIDTH,
  designHeight = DESIGN_HEIGHT
) {
  const [scale, setScale] = React.useState(() => {
    if (typeof window === "undefined") {
      return 1
    }

    const scaleX = window.innerWidth / designWidth
    const scaleY = window.innerHeight / designHeight

    return Math.min(scaleX, scaleY)
  })

  React.useEffect(() => {
    const updateScale = () => {
      const scaleX = window.innerWidth / designWidth
      const scaleY = window.innerHeight / designHeight

      setScale(Math.min(scaleX, scaleY))
    }

    updateScale()
    window.addEventListener("resize", updateScale)

    return () => {
      window.removeEventListener("resize", updateScale)
    }
  }, [designHeight, designWidth])

  return scale
}
