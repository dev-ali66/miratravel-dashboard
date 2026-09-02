/* =====================================================
   FILE UPLOAD SERVICE
   Talks to the generic POST /file-upload endpoint (see
   backend/src/modules/fileUpload). Response shape is
   confirmed from source:
     { success, code, message, data: { [fieldName]: string[] } }
   Fixed to use the shared apiPrivate client (auth header +
   correct base URL per environment) instead of a bare axios
   import hardcoded to localhost.
===================================================== */

import { apiPrivate } from "@/lib/api-client"

export interface FileUploadResponse {
    success: boolean
    code: number
    message: string
    data: Record<string, string[]>
}

export async function uploadFile(
    file: File,
    fieldName: string
): Promise<string> {
    const formData = new FormData()

    formData.append(fieldName, file)

    const { data } = await apiPrivate.post<FileUploadResponse>(
        "/file-upload",
        formData,
        {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        }
    )

    const url = data?.data?.[fieldName]?.[0]

    if (!url) {
        throw new Error(
            "Upload successful but file URL was not returned."
        )
    }

    return url
}

export async function removeFiles(urls: string[]) {
    if (!urls.length) return

    const formData = new FormData()

    formData.append("fileRemove", JSON.stringify(urls))

    return apiPrivate.post(
        "/file-upload",
        formData,
        {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        }
    )
}
