import { useMutation } from "@tanstack/react-query"
import { apiPrivate } from "@/lib/api-client"
import { getApiErrorMessage } from "@/lib/api-error"
import { toast } from "sonner"

type VideoUploadResponse = {
    success: boolean
    message: string
    code: number
    meta: any
    data: Record<string, string[]>
}

export function useVideoUpload() {
    return useMutation({
        mutationKey: ["video-upload"],

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

            // Dynamic video field
            formData.append(fieldName, file)

            // Old videos to remove
            fileRemove.forEach((path) => {
                formData.append("fileRemove", path)
            })

            const res =
                await apiPrivate.post<VideoUploadResponse>(
                    "/file-upload",
                    formData,
                    {
                        headers: {
                            "Content-Type":
                                "multipart/form-data",
                        },
                    }
                )

            return res.data
        },

        onSuccess: (res) => {
            if (res.success !== false) {
                toast.success(
                    res.message ||
                        "Video uploaded successfully"
                )
            } else {
                toast.error(
                    res.message ||
                        "Failed to upload video"
                )
            }
        },

        onError: (error) => {
            toast.error(
                getApiErrorMessage(error)
            )
        },
    })
}