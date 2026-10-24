import { apiPrivate, apiUpload } from "@/lib/api-client"
import { computeFileSha256 } from "@/lib/fileHash"

export interface MediaAsset {
  id: string
  fileName: string
  originalName?: string | null
  storagePath: string
  url: string
  mimeType: string
  size: number
  hash?: string | null
  width?: number | null
  height?: number | null
  title?: string | null
  altText?: string | null
  caption?: string | null
  status: "ACTIVE" | "IN_TRASH" | "DELETING" | "DELETED"
  deletedAt?: string | null
  createdAt: string
  updatedAt: string
  usageCount: number
}

export interface PopulatedMediaReference {
  id: string
  mediaId: string
  entityType: string
  entityId: string
  fieldPath: string
  entityTitle: string
  entitySlug?: string
  editUrl?: string
  createdAt: string
}

export interface MediaUsageReport {
  mediaId: string
  usageCount: number
  references: PopulatedMediaReference[]
}

export interface MediaStats {
  totalCount: number
  totalSizeBytes: number
  totalSizeFormatted: string
  imageCount: number
  videoCount: number
  trashCount: number
  unusedCount: number
}

export interface WorkerStatus {
  isRunning: boolean
  lastRunAt: string | null
  nextRunAt: string | null
  pendingJobsCount: number
  processingJobsCount: number
  failedJobsCount: number
  lastResult: {
    processedCount: number
    deletedCount: number
    restoredCount: number
    failedCount: number
    freedBytes: number
    nextRunAt: string | null
    errors: Array<{ jobId: string; error: string }>
  } | null
}

export interface StorageOptimizerAssetUsage {
  entityType: string
  entityId: string
  entityTitle: string
  fieldPath: string
  editUrl?: string
}

export interface StorageOptimizerAsset {
  id: string
  fileName: string
  url: string
  mimeType: string
  size: number
  usageCount: number
  createdAt: string
  references: StorageOptimizerAssetUsage[]
}

export interface StorageOptimizerGroup {
  hash: string
  mimeType: string
  fileSize: number
  fileSizeFormatted: string
  reclaimableBytes: number
  reclaimableFormatted: string
  masterCandidate: StorageOptimizerAsset
  duplicates: StorageOptimizerAsset[]
}

export interface StorageOptimizerScanResult {
  totalDuplicateGroups: number
  totalDuplicateAssets: number
  reclaimableBytes: number
  reclaimableFormatted: string
  groups: StorageOptimizerGroup[]
}

export interface ExecuteStorageOptimizationPayload {
  overrides?: Array<{
    hash: string
    masterId: string
  }>
}

export interface ExecuteStorageOptimizationResult {
  success: boolean
  groupsProcessed: number
  referencesMigrated: number
  assetsMovedToTrash: number
  freedBytes: number
  freedFormatted: string
  trashedAssetNames: string[]
}

export interface MediaGalleryParams {
  page?: number
  limit?: number
  search?: string
  type?: "all" | "image" | "video"
  status?: "ACTIVE" | "IN_TRASH"
  inUse?: "all" | "true" | "false"
  sortBy?: "newest" | "oldest" | "size_desc" | "size_asc" | "usage_desc"
}

export interface MediaGalleryResponse {
  data: MediaAsset[]
  meta: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export interface ApiResponse<T> {
  success: boolean
  code: number
  message: string
  data: T
  meta?: any
}

export const mediaService = {
  /**
   * Fetch paginated media assets with full filter & search capabilities
   */
  async getGallery(params: MediaGalleryParams = {}): Promise<MediaGalleryResponse> {
    const queryParams = new URLSearchParams()
    if (params.page) queryParams.set("page", String(params.page))
    if (params.limit) queryParams.set("limit", String(params.limit))
    if (params.search) queryParams.set("search", params.search)
    if (params.type && params.type !== "all") queryParams.set("type", params.type)
    if (params.status) queryParams.set("status", params.status)
    if (params.inUse && params.inUse !== "all") queryParams.set("inUse", params.inUse)
    if (params.sortBy) queryParams.set("sortBy", params.sortBy)

    const url = `/media${queryParams.toString() ? `?${queryParams.toString()}` : ""}`
    const { data } = await apiPrivate.get<ApiResponse<MediaAsset[]>>(url)

    return {
      data: data.data || [],
      meta: data.meta || { page: 1, limit: 30, total: 0, totalPages: 1 },
    }
  },

  /**
   * Fetch media library KPI stats (total count, storage used, images vs videos, trash count)
   */
  async getStats(): Promise<MediaStats> {
    const { data } = await apiPrivate.get<ApiResponse<any>>("/media/stats")
    const d = data?.data || {}
    const totalCount = d.totalCount ?? d.activeAssets ?? d.totalAssets ?? 0
    const unusedCount = d.unusedCount ?? d.unusedAssets ?? 0
    const totalSizeBytes = d.totalSizeBytes ?? 0
    const totalSizeMB = d.totalSizeMB ?? (totalSizeBytes / (1024 * 1024)).toFixed(2)
    const totalSizeFormatted =
      d.totalSizeFormatted ??
      (totalSizeBytes >= 1024 * 1024 * 1024
        ? `${(totalSizeBytes / (1024 * 1024 * 1024)).toFixed(2)} GB`
        : `${totalSizeMB} MB`)

    return {
      totalCount,
      totalSizeBytes,
      totalSizeFormatted,
      imageCount: d.imageCount ?? d.totalImages ?? 0,
      videoCount: d.videoCount ?? d.totalVideos ?? 0,
      trashCount: d.trashCount ?? d.trashedAssets ?? 0,
      unusedCount,
    }
  },

  /**
   * Get single asset by ID
   */
  async getById(id: string): Promise<MediaAsset> {
    const { data } = await apiPrivate.get<ApiResponse<MediaAsset>>(`/media/${id}`)
    return data.data
  },

  /**
   * Fetch detailed referencing entities for an asset ("Used in X places")
   */
  async getUsage(id: string): Promise<MediaUsageReport> {
    const { data } = await apiPrivate.get<ApiResponse<MediaUsageReport>>(`/media/${id}/usage`)
    return data.data
  },

  /**
   * Update metadata (title, altText for SEO, caption)
   */
  async updateMetadata(
    id: string,
    metadata: { title?: string | null; altText?: string | null; caption?: string | null }
  ): Promise<MediaAsset> {
    const { data } = await apiPrivate.patch<ApiResponse<MediaAsset>>(`/media/${id}`, metadata)
    return data.data
  },

  /**
   * Upload single or bulk files with client-side SHA-256 pre-check
   */
  async uploadFiles(
    files: File[],
    onProgress?: (progress: number, fileName: string) => void
  ): Promise<{ assets: MediaAsset[]; existingCount: number; newlyUploadedCount: number }> {
    const assets: MediaAsset[] = []
    let existingCount = 0
    let newlyUploadedCount = 0

    const newFilesToUpload: File[] = []

    // 1. Instant Client-Side SHA-256 Pre-check
    for (const file of files) {
      try {
        const hash = await computeFileSha256(file)
        const { data: checkRes } = await apiPrivate.get<ApiResponse<{ exists: boolean; id?: string; url?: string }>>(
          `/media/check-hash/${hash}`
        )

        if (checkRes?.data?.exists && checkRes.data.id) {
          const existingAsset = await this.getById(checkRes.data.id)
          assets.push(existingAsset)
          existingCount++
          continue
        }
      } catch {
        // Fallback to standard upload if pre-check fails
      }

      newFilesToUpload.push(file)
    }

    // 2. Upload genuinely new files
    if (newFilesToUpload.length > 0) {
      const formData = new FormData()
      for (const file of newFilesToUpload) {
        formData.append("files", file)
      }

      const { data } = await apiUpload.post<ApiResponse<MediaAsset[]>>("/media/upload", formData, {
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total && onProgress) {
            const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total)
            onProgress(percent, newFilesToUpload[0]?.name || "Uploading...")
          }
        },
      })

      if (data?.data) {
        assets.push(...data.data)
        newlyUploadedCount += data.data.length
      }
    }

    return { assets, existingCount, newlyUploadedCount }
  },

  /**
   * Move asset to 30-day trash
   */
  async softDelete(id: string): Promise<MediaAsset> {
    const { data } = await apiPrivate.delete<ApiResponse<MediaAsset>>(`/media/${id}`)
    return data.data
  },

  /**
   * Restore asset from trash back to active
   */
  async restore(id: string): Promise<MediaAsset> {
    const { data } = await apiPrivate.post<ApiResponse<MediaAsset>>(`/media/${id}/restore`)
    return data.data
  },

  /**
   * Bulk move to trash
   */
  async bulkSoftDelete(ids: string[]): Promise<{ count: number }> {
    const { data } = await apiPrivate.post<ApiResponse<{ count: number }>>("/media/bulk-trash", { ids })
    return data.data
  },

  /**
   * Bulk restore from trash
   */
  async bulkRestore(ids: string[]): Promise<{ count: number }> {
    const { data } = await apiPrivate.post<ApiResponse<{ count: number }>>("/media/bulk-restore", { ids })
    return data.data
  },

  /**
   * Permanently purge single asset from disk & DB
   */
  async permanentDelete(id: string): Promise<void> {
    await apiPrivate.delete(`/media/${id}/permanent`)
  },

  /**
   * Empty trash: permanently purges all unreferenced assets in trash
   */
  async emptyTrash(): Promise<{ deletedCount: number; totalAttempted: number }> {
    const { data } = await apiPrivate.post<ApiResponse<{ deletedCount: number; totalAttempted: number }>>(
      "/media/trash/empty"
    )
    return data.data
  },

  /**
   * Get outbox worker status & metrics
   */
  async getWorkerStatus(): Promise<WorkerStatus> {
    const { data } = await apiPrivate.get<ApiResponse<WorkerStatus>>("/media/worker/status")
    return data.data
  },

  /**
   * Manually trigger an outbox cleanup run
   */
  async triggerWorker(): Promise<any> {
    const { data } = await apiPrivate.post<ApiResponse<any>>("/media/worker/trigger")
    return data.data
  },

  /**
   * Scan library for identical duplicate assets by SHA-256 hash
   */
  async scanStorageOptimization(): Promise<StorageOptimizerScanResult> {
    const { data } = await apiPrivate.get<ApiResponse<StorageOptimizerScanResult>>(
      "/media/optimizer/scan"
    )
    return data.data
  },

  /**
   * Execute atomic storage optimization: re-links references to master and moves unlinked duplicates to 30d trash
   */
  async executeStorageOptimization(
    payload: ExecuteStorageOptimizationPayload = {}
  ): Promise<ExecuteStorageOptimizationResult> {
    const { data } = await apiPrivate.post<ApiResponse<ExecuteStorageOptimizationResult>>(
      "/media/optimizer/execute",
      payload
    )
    return data.data
  },

  /**
   * Universal 1-click single media download helper.
   * Downloads directly via Blob and falls back to server Content-Disposition attachment endpoint.
   */
  async downloadAsset(
    asset: Pick<MediaAsset, "id" | "url" | "fileName" | "originalName">
  ): Promise<void> {
    const fileName = asset.originalName || asset.fileName || "download"

    // Strategy 1: Client-side fetch blob (instant, silent, preserves filename)
    try {
      const response = await fetch(asset.url, { mode: "cors" })
      if (!response.ok) throw new Error(`HTTP ${response.status}`)
      const blob = await response.blob()
      const blobUrl = window.URL.createObjectURL(blob)

      const link = document.createElement("a")
      link.style.display = "none"
      link.href = blobUrl
      link.download = fileName
      document.body.appendChild(link)
      link.click()

      setTimeout(() => {
        document.body.removeChild(link)
        window.URL.revokeObjectURL(blobUrl)
      }, 300)
      return
    } catch (err) {
      console.warn("Direct blob download failed, falling back to server download endpoint:", err)
    }

    // Strategy 2: Server download route with Content-Disposition
    const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5010/api/v1"
    const serverUrl = `${BASE_URL}/media/${asset.id}/download`
    const link = document.createElement("a")
    link.style.display = "none"
    link.href = serverUrl
    link.download = fileName
    document.body.appendChild(link)
    link.click()
    setTimeout(() => {
      document.body.removeChild(link)
    }, 300)
  },
}
