import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import {
  mediaService,
  type MediaGalleryParams,
  type MediaStats,
  type MediaUsageReport,
  type WorkerStatus,
  type ExecuteStorageOptimizationPayload,
} from "@/services/mediaService"

export const MEDIA_QUERY_KEYS = {
  all: ["media"] as const,
  gallery: (params: MediaGalleryParams) => ["media", "gallery", params] as const,
  stats: () => ["media", "stats"] as const,
  usage: (id: string) => ["media", "usage", id] as const,
  workerStatus: () => ["media", "worker-status"] as const,
  optimizerScan: () => ["media", "optimizer-scan"] as const,
}

/**
 * Fetch paginated media assets
 */
export function useMediaGallery(params: MediaGalleryParams = {}) {
  return useQuery({
    queryKey: MEDIA_QUERY_KEYS.gallery(params),
    queryFn: () => mediaService.getGallery(params),
    placeholderData: (previousData) => previousData,
    staleTime: 1000 * 30, // 30s
  })
}

/**
 * Fetch media library KPI stats
 */
export function useMediaStats() {
  return useQuery<MediaStats>({
    queryKey: MEDIA_QUERY_KEYS.stats(),
    queryFn: () => mediaService.getStats(),
    staleTime: 1000 * 60,
  })
}

/**
 * Fetch usage details for an asset ("Used in X places")
 */
export function useMediaUsage(id?: string | null) {
  return useQuery<MediaUsageReport>({
    queryKey: MEDIA_QUERY_KEYS.usage(id || ""),
    queryFn: () => (id ? mediaService.getUsage(id) : Promise.reject("No ID")),
    enabled: Boolean(id),
    staleTime: 1000 * 30,
  })
}

/**
 * Fetch outbox cleanup worker status
 */
export function useMediaWorkerStatus() {
  return useQuery<WorkerStatus>({
    queryKey: MEDIA_QUERY_KEYS.workerStatus(),
    queryFn: () => mediaService.getWorkerStatus(),
    refetchInterval: 1000 * 60, // Refresh every 60s
  })
}

/**
 * Update media metadata (Title, Alt Text, Caption)
 */
export function useUpdateMediaMetadata() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      id,
      metadata,
    }: {
      id: string
      metadata: { title?: string | null; altText?: string | null; caption?: string | null }
    }) => mediaService.updateMetadata(id, metadata),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MEDIA_QUERY_KEYS.all })
      toast.success("Metadata saved successfully")
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "Failed to update metadata")
    },
  })
}

/**
 * Soft delete an asset (move to trash)
 */
export function useSoftDeleteMedia() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => mediaService.softDelete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MEDIA_QUERY_KEYS.all })
      toast.success("Asset moved to trash (30-day grace period)")
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "Failed to move asset to trash")
    },
  })
}

/**
 * Restore an asset from trash back to active
 */
export function useRestoreMedia() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => mediaService.restore(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MEDIA_QUERY_KEYS.all })
      toast.success("Asset restored to library")
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "Failed to restore asset")
    },
  })
}

/**
 * Bulk move to trash
 */
export function useBulkSoftDelete() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (ids: string[]) => mediaService.bulkSoftDelete(ids),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: MEDIA_QUERY_KEYS.all })
      toast.success(`${res.count} asset(s) moved to trash`)
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "Bulk trash operation failed")
    },
  })
}

/**
 * Bulk restore from trash
 */
export function useBulkRestore() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (ids: string[]) => mediaService.bulkRestore(ids),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: MEDIA_QUERY_KEYS.all })
      toast.success(`${res.count} asset(s) restored`)
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "Bulk restore operation failed")
    },
  })
}

/**
 * Permanent single delete
 */
export function usePermanentDelete() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => mediaService.permanentDelete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MEDIA_QUERY_KEYS.all })
      toast.success("Asset permanently purged from disk and database")
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "Failed to permanently delete asset")
    },
  })
}

/**
 * Empty trash
 */
export function useEmptyTrash() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => mediaService.emptyTrash(),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: MEDIA_QUERY_KEYS.all })
      toast.success(`Trash emptied: ${res.deletedCount} asset(s) purged`)
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "Failed to empty trash")
    },
  })
}

/**
 * Trigger outbox cleanup worker
 */
export function useTriggerMediaWorker() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => mediaService.triggerWorker(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MEDIA_QUERY_KEYS.all })
      toast.success("Outbox cleanup cycle completed")
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "Worker trigger failed")
    },
  })
}

/**
 * Scan for duplicate storage optimization
 */
export function useStorageOptimizerScan(enabled = true) {
  return useQuery({
    queryKey: MEDIA_QUERY_KEYS.optimizerScan(),
    queryFn: () => mediaService.scanStorageOptimization(),
    enabled,
    staleTime: 1000 * 60, // 60s
  })
}

/**
 * Execute storage optimization (re-link to master, move unlinked duplicates to trash)
 */
export function useExecuteStorageOptimization() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: ExecuteStorageOptimizationPayload = {}) =>
      mediaService.executeStorageOptimization(payload),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: MEDIA_QUERY_KEYS.all })
      toast.success(
        `Optimization complete! Migrated ${res.referencesMigrated} references and moved ${res.assetsMovedToTrash} duplicate files to trash (${res.freedFormatted} storage reclaimed).`
      )
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "Storage optimization failed")
    },
  })
}
