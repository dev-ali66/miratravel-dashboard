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

import { apiUpload } from "@/lib/api-client"
import { computeFileSha256 } from "@/lib/fileHash"

export interface FileUploadResponse {
  success: boolean
  code: number
  message: string
  data: Record<string, string[]>
}

export interface CheckHashResponse {
  success: boolean
  code: number
  message: string
  data: {
    exists: boolean
    id?: string
    url?: string | null
    fileName?: string
    mimeType?: string
    size?: number
    title?: string
  }
}

export async function uploadFile(
  file: File,
  fieldName: string
): Promise<string> {
  // 1. Instant Pre-check: If file already exists on server, skip upload completely!
  try {
    const hash = await computeFileSha256(file)
    const { data: checkRes } = await apiUpload.get<CheckHashResponse>(
      `/file-upload/check-hash/${hash}`
    )

    if (checkRes?.data?.exists && checkRes.data.url) {
      return checkRes.data.url
    }
  } catch {
    // If pre-check fails or endpoint unavailable, proceed with standard upload
  }

  // 2. Standard Upload for new unique files
  const formData = new FormData()

  formData.append(fieldName, file)

  const { data } = await apiUpload.post<FileUploadResponse>(
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
    throw new Error("Upload successful but file URL was not returned.")
  }

  return url
}

/**
 * Media files are safely managed by backend Central Media Reference Tracking.
 * Client-side premature unlinking is disabled to prevent destroying shared assets.
 */
export async function removeFiles(_urls: string[]): Promise<void> {
  return Promise.resolve()
}
