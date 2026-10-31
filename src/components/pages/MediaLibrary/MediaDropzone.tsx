import React, { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { UploadCloud, FileUp, Sparkles, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { mediaService, type MediaAsset } from "@/services/mediaService"

interface MediaDropzoneProps {
  onUploadSuccess: (newAssets: MediaAsset[]) => void
  customTrigger?: (triggerUpload: () => void, isUploading: boolean) => React.ReactNode
}

export const MediaDropzone: React.FC<MediaDropzoneProps> = ({
  onUploadSuccess,
  customTrigger,
}) => {
  const [isDragOver, setIsDragOver] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [currentFileName, setCurrentFileName] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Listen for global drag over window to trigger full-screen dropzone overlay
  useEffect(() => {
    let dragCounter = 0

    const handleDragEnter = (e: DragEvent) => {
      e.preventDefault()
      dragCounter++
      if (e.dataTransfer?.items && e.dataTransfer.items.length > 0) {
        setIsDragOver(true)
      }
    }

    const handleDragLeave = (e: DragEvent) => {
      e.preventDefault()
      dragCounter--
      if (dragCounter === 0) {
        setIsDragOver(false)
      }
    }

    const handleDragOver = (e: DragEvent) => {
      e.preventDefault()
    }

    const handleDrop = (e: DragEvent) => {
      e.preventDefault()
      dragCounter = 0
      setIsDragOver(false)
      if (e.dataTransfer?.files && e.dataTransfer.files.length > 0) {
        handleFiles(Array.from(e.dataTransfer.files))
      }
    }

    window.addEventListener("dragenter", handleDragEnter)
    window.addEventListener("dragleave", handleDragLeave)
    window.addEventListener("dragover", handleDragOver)
    window.addEventListener("drop", handleDrop)

    return () => {
      window.removeEventListener("dragenter", handleDragEnter)
      window.removeEventListener("dragleave", handleDragLeave)
      window.removeEventListener("dragover", handleDragOver)
      window.removeEventListener("drop", handleDrop)
    }
  }, [])

  const handleFiles = async (files: File[]) => {
    if (files.length === 0) return

    // Requirement 7: Client-side safeguard against images exceeding 30MB
    const MAX_IMAGE_SIZE = 30 * 1024 * 1024
    for (const f of files) {
      if (f.type.startsWith("image/") && f.size > MAX_IMAGE_SIZE) {
        toast.error(`"${f.name}" (${(f.size / (1024 * 1024)).toFixed(1)}MB) exceeds the 30MB maximum image upload limit.`)
        return
      }
    }

    setIsUploading(true)
    setUploadProgress(0)
    setCurrentFileName(files[0]?.name || "Preparing...")

    try {
      const { assets, existingCount, newlyUploadedCount } = await mediaService.uploadFiles(
        files,
        (percent, name) => {
          setUploadProgress(percent)
          setCurrentFileName(name)
        }
      )

      if (existingCount > 0 && newlyUploadedCount === 0) {
        toast.success(
          `All ${existingCount} file(s) already exist on server (0 bytes transferred, reused instantly)`
        )
      } else if (existingCount > 0 && newlyUploadedCount > 0) {
        toast.success(
          `Uploaded ${newlyUploadedCount} new file(s); ${existingCount} duplicate(s) reused from library`
        )
      } else {
        toast.success(`Successfully uploaded ${newlyUploadedCount} new media asset(s)`)
      }

      onUploadSuccess(assets)
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to upload files")
    } finally {
      setIsUploading(false)
      setUploadProgress(0)
      setCurrentFileName("")
      if (fileInputRef.current) fileInputRef.current.value = ""
    }
  }

  return (
    <>
      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        multiple
        accept="image/*,video/*"
        onChange={(e) => {
          if (e.target.files) handleFiles(Array.from(e.target.files))
        }}
        className="hidden"
      />

      {/* Upload Trigger Button */}
      {customTrigger ? (
        customTrigger(() => fileInputRef.current?.click(), isUploading)
      ) : (
        <Button
          size="sm"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className="text-xs h-8 gap-1.5 shadow-xs font-medium"
        >
          {isUploading ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <FileUp className="h-3.5 w-3.5" />
          )}
          {isUploading ? "Uploading..." : "Upload Media"}
        </Button>
      )}

      {/* Global Drag-and-Drop Overlay */}
      {isDragOver && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-md flex flex-col items-center justify-center p-8 pointer-events-none border-4 border-dashed border-primary animate-in fade-in duration-150">
          <div className="h-20 w-20 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-4 animate-bounce">
            <UploadCloud className="h-10 w-10 stroke-[1.8]" />
          </div>
          <h2 className="text-2xl font-bold text-foreground">Drop files anywhere to upload</h2>
          <p className="text-sm text-muted-foreground mt-2 max-w-md text-center">
            Images (max 30MB) and videos (max 200MB) will be instantly verified with client-side SHA-256 deduplication and added to your central library.
          </p>
        </div>
      )}

      {/* Active Upload Progress Toast Widget */}
      {isUploading && (
        <div className="fixed bottom-6 right-6 z-50 bg-card border border-border/80 shadow-2xl rounded-xl p-4 w-80 backdrop-blur-xl animate-in slide-in-from-bottom-4 duration-200">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin text-primary" />
              <span className="text-xs font-semibold text-foreground truncate max-w-[180px]">
                {currentFileName}
              </span>
            </div>
            <span className="text-xs font-mono font-bold text-primary">{uploadProgress}%</span>
          </div>
          <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-200 rounded-full"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
          <p className="text-[11px] text-muted-foreground mt-2 flex items-center gap-1">
            <Sparkles className="h-3 w-3 text-primary" /> Instant SHA-256 zero-byte check active
          </p>
        </div>
      )}
    </>
  )
}
