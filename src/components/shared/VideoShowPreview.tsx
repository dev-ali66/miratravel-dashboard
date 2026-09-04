import { cn } from "@/lib/utils"

interface VideoShowPreviewProps {
    src: string
    poster?: string
    alt?: string
    mode?: "background" | "foreground"
    className?: string
    autoplay?: boolean
    muted?: boolean
    loop?: boolean
    opacity?: number
    overlayColor?: string
    overlayOpacity?: number
}

export function VideoShowPreview({
    src,
    poster,
    alt = "Video preview",
    mode = "foreground",
    className,
    autoplay = true,
    muted = true,
    loop = true,
    opacity = 100,
    overlayColor = "#000000",
    overlayOpacity = 0,
}: VideoShowPreviewProps) {
    return (
        <div
            className={cn(
                "relative overflow-hidden",
                mode === "background" && "absolute inset-0",
                className
            )}
        >
            <video
                src={src}
                poster={poster}
                aria-label={alt}
                autoPlay={autoplay}
                muted={muted}
                loop={loop}
                playsInline
                className="h-full w-full object-cover"
                style={{ opacity: opacity / 100 }}
            />

            {overlayOpacity > 0 && (
                <div
                    className="pointer-events-none absolute inset-0"
                    style={{
                        backgroundColor: overlayColor,
                        opacity: overlayOpacity / 100,
                    }}
                />
            )}
        </div>
    )
}