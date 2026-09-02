import { useRef } from "react"
import { useVideoUpload } from "@/hooks/cms/useVideoUpload"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import {
    Upload,
    Video as VideoIcon,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface VideoUploadFieldProps
    extends Omit<
        React.HTMLAttributes<HTMLDivElement>,
        "onChange"
    > {
    label: string
    value: string
    fieldName: string
    onChange: (value: string) => void
}

export function VideoUploadField({
    label,
    value,
    fieldName,
    onChange,
    className,
    ...props
}: VideoUploadFieldProps) {
    const {
        mutate: uploadVideo,
        isPending: isUploading,
    } = useVideoUpload()

    const fileInputRef =
        useRef<HTMLInputElement>(null)

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
                    "relative w-full h-[220px] rounded-xl border-2 border-dashed border-border flex items-center justify-center p-2 cursor-pointer transition-colors hover:bg-muted/50",
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
                            className="w-full h-full object-cover opacity-90 group-hover:opacity-60 transition-opacity duration-300"
                            controls
                            muted
                            playsInline
                            onClick={(e) =>
                                e.stopPropagation()
                            }
                        />

                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                            <Button
                                type="button"
                                variant="secondary"
                                className="gap-2 shadow-md rounded-full px-6"
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
        </div>
    )
}