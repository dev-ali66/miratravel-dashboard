import { useRef, useState } from "react"
import { ImagePlus, Loader2, Trash2 } from "lucide-react"

import { uploadFile, removeFiles } from "@/services/fileUpload"

import { cn } from "@/lib/utils"

interface ImageUploaderProps {
  value?: string
  onChange: (url: string) => void

  fieldName: string
  label: string

  className?: string
}

export function ImageUploader({
  value,
  onChange,
  fieldName,
  label,
  className,
}: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  const [uploading, setUploading] = useState(false)

  const [removing, setRemoving] = useState(false)

  const [error, setError] = useState<string | null>(null)

  const handleUpload = async (file: File) => {
    try {
      setError(null)
      setUploading(true)

      const url = await uploadFile(file, fieldName)

      onChange(url)
    } catch (error) {
      console.error(error)

      setError("Image upload failed.")
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

      setError("Failed to remove image.")
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
      <label className="text-sm font-medium">{label}</label>

      {value ? (
        <div className="group relative">
          <div className="aspect-video overflow-hidden rounded-lg border bg-muted">
            <img
              src={value}
              alt={label}
              className="h-full w-full object-cover"
            />
          </div>

          <button
            type="button"
            disabled={removing}
            onClick={handleRemove}
            className="absolute top-2 right-2 rounded-md bg-background/90 p-2 text-destructive opacity-0 shadow transition-opacity group-hover:opacity-100"
          >
            {removing ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Trash2 className="h-4 w-4" />
            )}
          </button>
        </div>
      ) : (
        <button
          type="button"
          disabled={uploading}
          onClick={() => inputRef.current?.click()}
          className="flex aspect-video w-full flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-border transition hover:border-primary/50 hover:bg-muted/30"
        >
          {uploading ? (
            <>
              <Loader2 className="h-6 w-6 animate-spin text-primary" />

              <span className="text-xs">Uploading...</span>
            </>
          ) : (
            <>
              <ImagePlus className="h-6 w-6 text-muted-foreground" />

              <span className="text-sm">Upload {label}</span>
            </>
          )}
        </button>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleChange}
        className="hidden"
      />

      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  )
}
