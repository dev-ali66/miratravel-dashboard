import { useRef, useState } from "react"
import { useVideoUpload } from "@/hooks/cms/useVideoUpload"
import { removeFiles } from "@/services/fileUpload"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import {
    Loader2,
    Trash2,
    Upload,
    Video as VideoIcon,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { ColorField, NumberField } from "@/components/pages/CMS/shared/FormControls"

interface VideoUploadFieldProps
    extends Omit<
        React.HTMLAttributes<HTMLDivElement>,
        "onChange"
    > {
    label: string
    value: string
    fieldName: string
    onChange: (value: string) => void
    opacity?: number
    onOpacityChange?: (value: number) => void
    overlayColor?: string
    onOverlayColorChange?: (value: string) => void
    overlayOpacity?: number
    onOverlayOpacityChange?: (value: number) => void
}

export function VideoUploadField({
    label,
    value,
    fieldName,
    onChange,
    opacity = 100,
    onOpacityChange,
    overlayColor = "#000000",
    onOverlayColorChange,
    overlayOpacity = 0,
    onOverlayOpacityChange,
    className,
    ...props
}: VideoUploadFieldProps) {
    const {
        mutate: uploadVideo,
        isPending: isUploading,
    } = useVideoUpload()

    const fileInputRef =
        useRef<HTMLInputElement>(null)

    const [isRemoving, setIsRemoving] =
        useState(false)

    const handleFileChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const file = e.target.files?.[0]

        if (!file) return

        const fileRemove = value ? [value] : []

        uploadVideo(
            {
                file,
                fieldName,
                fileRemove,
            },
            {
                onSuccess: (res) => {
                    const uploadedVideos =
                        res.data?.[fieldName]

                    const newVideo =
                        uploadedVideos?.[0]

                    if (newVideo) {
                        onChange(newVideo)
                    }

                },
            }
        )

        e.target.value = ""
    }

    const handleRemove = async (e: React.MouseEvent) => {
        e.stopPropagation()

        if (!value || isRemoving) return

        try {
            setIsRemoving(true)
            await removeFiles([value])
            onChange("")
        } finally {
            setIsRemoving(false)
        }
    }

    return (
        <div
            className={cn(
                "flex flex-col gap-3",
                className
            )}
            {...props}
        >
            <div className="flex items-center gap-2 text-foreground">
                <VideoIcon className="w-4 h-4 text-muted-foreground" />

                <Label className="text-sm font-bold text-inherit">
                    {label}
                </Label>
            </div>

            <div
                className={cn(
                    "relative w-full h-55 rounded-xl border-2 border-dashed border-border flex items-center justify-center p-2 cursor-pointer transition-colors hover:bg-muted/50",
                    isUploading &&
                        "pointer-events-none opacity-50"
                )}
                onClick={() =>
                    fileInputRef.current?.click()
                }
            >
                <input
                    type="file"
                    accept="video/*"
                    className="hidden"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                />

                {isUploading ? (
                    <div className="flex flex-col items-center gap-2">
                        <div className="size-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />

                        <span className="text-sm font-medium">
                            Uploading...
                        </span>
                    </div>
                ) : value ? (
                    <div className="relative w-full h-full rounded-lg overflow-hidden flex items-center justify-center bg-black group">
                        <video
                            src={value}
                            style={{ opacity: opacity / 100 }}
                            className="w-full h-full object-cover transition-opacity duration-300"
                            controls
                            muted
                            playsInline
                            onClick={(e) =>
                                e.stopPropagation()
                            }
                        />

                        {overlayOpacity > 0 && (
                            <div
                                className="pointer-events-none absolute inset-0 z-10"
                                style={{ backgroundColor: overlayColor, opacity: overlayOpacity / 100 }}
                            />
                        )}

                        <Button
                            type="button"
                            variant="destructive"
                            disabled={isRemoving || isUploading}
                            aria-label="Delete video"
                            className="absolute left-3 top-3 z-30 size-9 rounded-full p-0 shadow-md"
                            onClick={handleRemove}
                        >
                            {isRemoving ? (
                                <Loader2 className="size-4 animate-spin" />
                            ) : (
                                <Trash2 className="size-4" />
                            )}
                        </Button>

                        <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                            <Button
                                type="button"
                                variant="secondary"
                                className="pointer-events-auto gap-2 rounded-full px-6 shadow-md"
                                onClick={(e) => {
                                    e.stopPropagation()
                                    fileInputRef.current?.click()
                                }}
                            >
                                <div className="w-2 h-2 rounded-full bg-primary" />
                                Change Video
                            </Button>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col items-center gap-2 text-muted-foreground">
                        <Upload className="w-8 h-8 opacity-50 mb-2" />

                        <span className="text-sm font-medium">
                            Click to upload video
                        </span>

                        <span className="text-xs text-muted-foreground/70">
                            MP4, WebM, MOV
                        </span>
                    </div>
                )}
            </div>
            {value && onOpacityChange && (
                <NumberField
                    label="Video opacity (%)"
                    value={opacity}
                    onChange={(value) => onOpacityChange(Math.max(0, Math.min(100, value)))}
                />
            )}
            {value && onOverlayColorChange && onOverlayOpacityChange && (
                <div className="flex flex-col gap-3">
                    <ColorField
                        label="Overlay color"
                        value={overlayColor}
                        onChange={onOverlayColorChange}
                    />
                    <div className="flex items-center gap-3">
                        <Label className="w-28 shrink-0 text-xs font-semibold text-foreground">
                            Overlay opacity
                        </Label>
                        <input
                            type="range"
                            min="0"
                            max="100"
                            value={overlayOpacity}
                            onChange={(e) => onOverlayOpacityChange(Number(e.target.value))}
                            className="w-full accent-primary"
                        />
                        <span className="w-10 text-right text-xs font-mono text-muted-foreground">
                            {overlayOpacity}%
                        </span>
                    </div>
                </div>
            )}
        </div>
    )
}