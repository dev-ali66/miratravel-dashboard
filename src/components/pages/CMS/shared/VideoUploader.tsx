import { useRef, useState } from "react"
import { Video, Loader2, Trash2, Upload } from "lucide-react"

import { uploadFile, removeFiles } from "@/services/fileUpload"

import { cn } from "@/lib/utils"

interface VideoUploaderProps {
  value?: string
  onChange: (url: string) => void

  fieldName: string
  label: string

  className?: string
}

export function VideoUploader({
  value,
  onChange,
  fieldName,
  label,
  className,
}: VideoUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  const [uploading, setUploading] = useState(false)

  const [removing, setRemoving] = useState(false)

  const [error, setError] = useState<string | null>(null)

  const handleUpload = async (file: File) => {
    try {
      setError(null)
      setUploading(true)

      // Remove old video first
      if (value) {
        await removeFiles([value])
      }

      const url = await uploadFile(file, fieldName)

      onChange(url)
    } catch (error) {
      console.error(error)

      setError("Video upload failed.")
    } finally {
      setUploading(false)
    }
  }

  const handleRemove = async () => {
    if (!value) return

    try {
      setError(null)
      setRemoving(true)

      await removeFiles([value])

      onChange("")
    } catch (error) {
      console.error(error)

      setError("Failed to remove video.")
    } finally {
      setRemoving(false)
    }
  }

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]

    if (!file) return

    handleUpload(file)

    event.target.value = ""
  }

  return (
    <div className={cn("space-y-2", className)}>
      <label className="flex items-center gap-2 text-sm font-medium">
        <Video className="h-4 w-4 text-muted-foreground" />

        {label}
      </label>

      {value ? (
        <div className="group relative">
          <div className="aspect-video overflow-hidden rounded-lg border bg-muted">
            <video
              src={value}
              autoPlay
              muted
              loop
              playsInline
              controls={false}
              className="h-full w-full object-cover"
            />
          </div>

          {/* Hover Actions */}
          <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/30 opacity-0 transition-opacity group-hover:opacity-100">
            <button
              type="button"
              disabled={uploading || removing}
              onClick={() => inputRef.current?.click()}
              className="rounded-md bg-background px-4 py-2 text-sm font-medium text-foreground shadow"
            >
              Change Video
            </button>

            <button
              type="button"
              disabled={removing || uploading}
              onClick={handleRemove}
              className="rounded-md bg-background p-2 text-destructive shadow"
            >
              {removing ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Trash2 className="h-4 w-4" />
              )}
            </button>
          </div>

          {/* Uploading Overlay */}
          {uploading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-background/70">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />

              <span className="text-sm font-medium">Uploading video...</span>
            </div>
          )}

          <input
            ref={inputRef}
            type="file"
            accept="video/*"
            onChange={handleChange}
            className="hidden"
          />
        </div>
      ) : (
        <>
          <button
            type="button"
            disabled={uploading}
            onClick={() => inputRef.current?.click()}
            className="flex aspect-video w-full flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-border transition hover:border-primary/50 hover:bg-muted/30"
          >
            {uploading ? (
              <>
                <Loader2 className="h-6 w-6 animate-spin text-primary" />

                <span className="text-xs">Uploading video...</span>
              </>
            ) : (
              <>
                <Upload className="h-7 w-7 text-muted-foreground" />

                <span className="text-sm">Upload {label}</span>

                <span className="text-xs text-muted-foreground">
                  MP4, WebM, MOV
                </span>
              </>
            )}
          </button>

          <input
            ref={inputRef}
            type="file"
            accept="video/*"
            onChange={handleChange}
            className="hidden"
          />
        </>
      )}

      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  )
}
