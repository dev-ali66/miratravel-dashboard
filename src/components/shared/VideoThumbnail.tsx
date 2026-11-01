import { useState, useEffect, useRef } from "react"
import { cn } from "@/lib/utils"

// In-memory cache to ensure each video URL is extracted only once per session
const thumbnailCache = new Map<string, string>()

export interface VideoThumbnailProps {
  src: string
  alt?: string
  className?: string
  containerClassName?: string
  initialSeekTime?: number
  minLuminance?: number
  maxAttempts?: number
}

/**
 * Calculates average luminance across canvas pixels
 * Returns value from 0 (pitch black) to 255 (pure white)
 */
function getCanvasLuminance(ctx: CanvasRenderingContext2D, width: number, height: number): number {
  try {
    const sampleWidth = Math.min(width, 60)
    const sampleHeight = Math.min(height, 35)
    const imgData = ctx.getImageData(0, 0, sampleWidth, sampleHeight)
    const data = imgData.data
    let totalLuminance = 0
    const pixelCount = data.length / 4

    for (let i = 0; i < data.length; i += 4) {
      const r = data[i]
      const g = data[i + 1]
      const b = data[i + 2]
      // Standard ITU-R BT.601 perceptual luminance
      totalLuminance += 0.299 * r + 0.587 * g + 0.114 * b
    }

    return pixelCount > 0 ? totalLuminance / pixelCount : 0
  } catch {
    // If CORS prevents reading pixels, treat as acceptable
    return 100
  }
}

export function VideoThumbnail({
  src,
  alt = "Video thumbnail",
  className,
  containerClassName,
  initialSeekTime = 1.5,
  minLuminance = 18,
  maxAttempts = 3,
}: VideoThumbnailProps) {
  const [thumbUrl, setThumbUrl] = useState<string | null>(() => {
    return src ? thumbnailCache.get(src) || null : null
  })
  const isMountedRef = useRef(true)

  useEffect(() => {
    isMountedRef.current = true

    if (!src) {
      setThumbUrl(null)
      return
    }

    // If already in memory cache, use immediately
    const cached = thumbnailCache.get(src)
    if (cached) {
      setThumbUrl(cached)
      return
    }

    let attemptCount = 0
    let isCleanedUp = false

    // Create an offscreen video element with minimal footprint
    const video = document.createElement("video")
    video.crossOrigin = "anonymous"
    video.preload = "metadata"
    video.muted = true
    video.playsInline = true
    video.autoplay = false

    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d", { willReadFrequently: true })

    const cleanup = () => {
      isCleanedUp = true
      video.removeAttribute("src")
      video.load()
    }

    const tryCaptureFrame = () => {
      if (isCleanedUp || !isMountedRef.current) return

      const vw = video.videoWidth || 320
      const vh = video.videoHeight || 180

      // Small sample canvas for fast luminance calculation and low memory usage
      const targetWidth = Math.min(vw, 320)
      const targetHeight = Math.round((targetWidth / vw) * vh)

      canvas.width = targetWidth
      canvas.height = targetHeight

      if (!ctx) return

      try {
        ctx.drawImage(video, 0, 0, targetWidth, targetHeight)
        const luminance = getCanvasLuminance(ctx, targetWidth, targetHeight)

        // If frame is almost pitch black (e.g. video fade-in) and attempts remain, step forward
        attemptCount++
        if (
          luminance < minLuminance &&
          attemptCount < maxAttempts &&
          video.currentTime + 1.5 < (video.duration || 100)
        ) {
          video.currentTime += 1.5
          return
        }

        // We have a good visual frame!
        const dataUrl = canvas.toDataURL("image/jpeg", 0.8)
        thumbnailCache.set(src, dataUrl)
        if (isMountedRef.current) {
          setThumbUrl(dataUrl)
        }
        cleanup()
      } catch {
        // If security error occurs (e.g. cross-origin), fall back to native video fragment
        cleanup()
      }
    }

    video.onloadedmetadata = () => {
      if (isCleanedUp) return
      const duration = video.duration || 0
      let seekTime = initialSeekTime
      if (duration > 0 && seekTime >= duration) {
        seekTime = Math.max(0.1, duration * 0.1)
      }
      video.currentTime = seekTime
    }

    video.onseeked = () => {
      tryCaptureFrame()
    }

    video.onerror = () => {
      cleanup()
    }

    video.src = src

    return () => {
      isMountedRef.current = false
      cleanup()
    }
  }, [src, initialSeekTime, minLuminance, maxAttempts])

  return (
    <div className={cn("relative h-full w-full overflow-hidden", containerClassName)}>
      {thumbUrl ? (
        <img
          src={thumbUrl}
          alt={alt}
          className={cn("h-full w-full object-cover object-center", className)}
          loading="lazy"
        />
      ) : (
        /* Fallback: lightweight paused native video preview using media fragment (#t=1.5) */
        <video
          src={`${src}#t=${initialSeekTime}`}
          preload="metadata"
          muted
          playsInline
          className={cn("h-full w-full object-cover object-center pointer-events-none", className)}
        />
      )}
    </div>
  )
}
