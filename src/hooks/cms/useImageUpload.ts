import { useMutation } from "@tanstack/react-query"
import { apiUpload } from "@/lib/api-client"
import { getApiErrorMessage } from "@/lib/api-error"
import { computeFileSha256 } from "@/lib/fileHash"
import { toast } from "sonner"

type ImageUploadResponse = {
  success: boolean
  message: string
  code: number
  meta: any
  data: Record<string, string[]>
}

export function useImageUpload() {
  return useMutation({
    mutationKey: ["image-upload"],

    mutationFn: async ({
      file,
      fieldName,
      fileRemove: _fileRemove = [],
    }: {
      file: File
      fieldName: string
      fileRemove?: string[]
    }) => {
      // 1. Instant Pre-check: Compute SHA-256 in browser to skip upload if file already exists
      try {
        const hash = await computeFileSha256(file)
        const { data: checkRes } = await apiUpload.get<{
          data: { exists: boolean; url: string | null }
        }>(`/file-upload/check-hash/${hash}`)

        if (checkRes?.data?.exists && checkRes.data.url) {
          return {
            success: true,
            message: "Image already exists on server (reused from library)",
            code: 200,
            meta: { deduplicated: true },
            data: {
              [fieldName]: [checkRes.data.url],
            },
          }
        }
      } catch {
        // Fallback to standard upload
      }

      // 2. Standard upload for new unique files
      const formData = new FormData()

      // Dynamic image field
      formData.append(fieldName, file)

      // Note: Client-side file unlinking is disabled to protect shared assets
      // (Managed safely by backend reference tracker)

      const res = await apiUpload.post<ImageUploadResponse>(
        "/file-upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      )

      return res.data
    },

    onSuccess: (res) => {
      if (res.success !== false) {
        toast.success(res.message || "Image uploaded successfully")
      } else {
        toast.error(res.message || "Failed to upload image")
      }
    },

    onError: (error) => {
      toast.error(getApiErrorMessage(error))
    },
  })
}
