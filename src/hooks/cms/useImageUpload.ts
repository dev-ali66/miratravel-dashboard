import { useMutation } from "@tanstack/react-query"
import { apiPrivate } from "@/lib/api-client"
import { getApiErrorMessage } from "@/lib/api-error"
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
      fileRemove = [],
    }: {
      file: File
      fieldName: string
      fileRemove?: string[]
    }) => {
      const formData = new FormData()

      // Dynamic image field
      formData.append(fieldName, file)

      // Old images to remove
      fileRemove.forEach((path) => {
        formData.append("fileRemove", path)
      })

      const res = await apiPrivate.post<ImageUploadResponse>(
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
