import React, { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Zap,
  Sparkles,
  Trash2,
  CheckCircle2,
  Loader2,
  HardDrive,
  Star,
  Info,
} from "lucide-react"
import {
  useStorageOptimizerScan,
  useExecuteStorageOptimization,
} from "@/hooks/media/useMediaLibrary"

interface StorageOptimizerModalProps {
  isOpen: boolean
  onClose: () => void
}

export const StorageOptimizerModal: React.FC<StorageOptimizerModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { data: scanData, isLoading: isScanning, refetch } = useStorageOptimizerScan(isOpen)
  const executeMutation = useExecuteStorageOptimization()

  // Track user-chosen master overrides: { [hash]: chosenMasterId }
  const [selectedMasters, setSelectedMasters] = useState<Record<string, string>>({})
  const [completedResult, setCompletedResult] = useState<any>(null)

  const handleSelectMaster = (hash: string, masterId: string) => {
    setSelectedMasters((prev) => ({
      ...prev,
      [hash]: masterId,
    }))
  }

  const handleExecute = () => {
    if (!scanData || scanData.groups.length === 0) return

    const overrides = Object.entries(selectedMasters).map(([hash, masterId]) => ({
      hash,
      masterId,
    }))

    executeMutation.mutate(
      { overrides },
      {
        onSuccess: (result) => {
          setCompletedResult(result)
        },
      }
    )
  }

  const handleClose = () => {
    setCompletedResult(null)
    setSelectedMasters({})
    onClose()
  }

  const groups = scanData?.groups || []
  const hasDuplicates = groups.length > 0

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="max-w-4xl max-h-[85vh] flex flex-col p-0 gap-0 overflow-hidden bg-background border-border/80 shadow-2xl">
        {/* Header */}
        <DialogHeader className="p-5 border-b border-border/60 bg-muted/20 shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="h-9 w-9 rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                <Zap className="h-5 w-5 fill-amber-500/30" />
              </div>
              <div>
                <DialogTitle className="text-lg font-bold text-foreground flex items-center gap-2">
                  Universal Storage Optimizer
                  {scanData && hasDuplicates && (
                    <Badge variant="outline" className="text-xs bg-amber-500/10 text-amber-600 border-amber-500/30">
                      {scanData.totalDuplicateGroups} Duplicate Groups
                    </Badge>
                  )}
                </DialogTitle>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Consolidate identical SHA-256 files into single masters, re-link entity usages, and move unlinked files to trash.
                </p>
              </div>
            </div>
          </div>
        </DialogHeader>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {/* State 1: Loading Scan */}
          {isScanning && !completedResult && (
            <div className="flex flex-col items-center justify-center py-20 text-center space-y-3">
              <Loader2 className="h-9 w-9 animate-spin text-primary" />
              <h4 className="text-sm font-semibold text-foreground">
                Analyzing Multimedia Catalog & Cryptographic Hashes...
              </h4>
              <p className="text-xs text-muted-foreground max-w-sm">
                Scanning all images and videos for identical binary contents across Journeys, Locations, Experiences, and Stories.
              </p>
            </div>
          )}

          {/* State 2: Execution Completed Success View */}
          {completedResult && (
            <div className="py-8 text-center space-y-5">
              <div className="h-16 w-16 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-sm">
                <CheckCircle2 className="h-9 w-9" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-foreground">Storage Successfully Optimized!</h3>
                <p className="text-sm text-muted-foreground mt-1 max-w-md mx-auto">
                  All redundant media references have been seamlessly transferred to your master files, and unlinked duplicates were safely sent to the Trash Bin.
                </p>
              </div>

              {/* Metrics Highlights */}
              <div className="grid grid-cols-3 gap-3.5 max-w-lg mx-auto pt-2">
                <div className="p-3.5 rounded-md border border-border/60 bg-muted/30 text-center">
                  <span className="text-[11px] font-medium text-muted-foreground block">
                    References Migrated
                  </span>
                  <span className="text-xl font-bold text-foreground font-mono">
                    {completedResult.referencesMigrated}
                  </span>
                </div>
                <div className="p-3.5 rounded-md border border-border/60 bg-muted/30 text-center">
                  <span className="text-[11px] font-medium text-muted-foreground block">
                    Moved to Trash
                  </span>
                  <span className="text-xl font-bold text-amber-600 dark:text-amber-400 font-mono">
                    {completedResult.assetsMovedToTrash}
                  </span>
                </div>
                <div className="p-3.5 rounded-md border border-border/60 bg-muted/30 text-center">
                  <span className="text-[11px] font-medium text-muted-foreground block">
                    Storage Reclaimed
                  </span>
                  <span className="text-xl font-bold text-emerald-600 dark:text-emerald-400 font-mono">
                    {completedResult.freedFormatted}
                  </span>
                </div>
              </div>

              <div className="rounded-md border border-amber-500/30 bg-amber-500/5 p-3.5 max-w-lg mx-auto flex items-start gap-2.5 text-left text-xs text-muted-foreground">
                <Info className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                <span>
                  The {completedResult.assetsMovedToTrash} unlinked duplicate files are safely retained in the <strong>Trash Bin</strong> with a 30-day grace period. You can review or restore them at any time from the Trash tab.
                </span>
              </div>
            </div>
          )}

          {/* State 3: Clean Library (0 Duplicates) */}
          {!isScanning && !completedResult && !hasDuplicates && (
            <div className="flex flex-col items-center justify-center py-16 text-center space-y-3">
              <div className="h-14 w-14 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center shadow-xs">
                <Sparkles className="h-7 w-7" />
              </div>
              <h4 className="text-base font-semibold text-foreground">
                Zero Redundant Duplicates Found!
              </h4>
              <p className="text-xs text-muted-foreground max-w-md">
                Your media library is perfectly optimized. Every active image and video has a unique content hash, and all entity references are cleanly consolidated.
              </p>
              <Button variant="outline" size="sm" onClick={() => refetch()} className="text-xs mt-2">
                Re-scan Library
              </Button>
            </div>
          )}

          {/* State 4: Duplicate Groups Available to Consolidate */}
          {!isScanning && !completedResult && hasDuplicates && (
            <>
              {/* Savings Overview Banner */}
              <div className="rounded-md border border-emerald-500/30 bg-emerald-500/5 p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 shrink-0">
                    <HardDrive className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-foreground">
                      Potential Storage Savings:{" "}
                      <span className="text-emerald-600 dark:text-emerald-400 font-mono font-bold">
                        {scanData?.reclaimableFormatted}
                      </span>
                    </h4>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Found {scanData?.totalDuplicateAssets} redundant duplicate files across {scanData?.totalDuplicateGroups} content groups.
                    </p>
                  </div>
                </div>
                <div className="text-xs text-muted-foreground font-mono bg-background px-3 py-1.5 rounded-lg border border-border/60 shrink-0">
                  {scanData?.totalDuplicateAssets} duplicates ➔ Trash Bin
                </div>
              </div>

              {/* Group List */}
              <div className="space-y-4">
                {groups.map((group, groupIdx) => {
                  const currentMasterId =
                    selectedMasters[group.hash] || group.masterCandidate.id
                  const allAssets = [group.masterCandidate, ...group.duplicates]
                  const masterAsset =
                    allAssets.find((a) => a.id === currentMasterId) || group.masterCandidate
                  const duplicateAssets = allAssets.filter((a) => a.id !== currentMasterId)

                  return (
                    <div
                      key={group.hash}
                      className="rounded-md border border-border/70 bg-card overflow-hidden shadow-xs space-y-3 p-4"
                    >
                      {/* Group Header */}
                      <div className="flex items-center justify-between border-b border-border/40 pb-2.5">
                        <div className="flex items-center gap-2">
                          <span className="h-6 w-6 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center">
                            {groupIdx + 1}
                          </span>
                          <span className="text-xs font-semibold text-foreground">
                            Group #{groupIdx + 1} ({allAssets.length} Identical Files)
                          </span>
                          <Badge variant="secondary" className="text-[10px] font-mono">
                            {group.fileSizeFormatted} each
                          </Badge>
                        </div>
                        <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
                          Reclaim {group.reclaimableFormatted}
                        </span>
                      </div>

                      {/* Side-by-Side: Designated Master vs Duplicates to Trash */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                        {/* Column 1: Designated Master File */}
                        <div className="rounded-lg border-2 border-primary/40 bg-primary/5 p-3 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-primary flex items-center gap-1.5">
                              <Star className="h-3.5 w-3.5 fill-primary" />
                              Designated Master (Keep)
                            </span>
                            <Badge variant="outline" className="text-[10px] bg-background">
                              {masterAsset.usageCount} active usage(s)
                            </Badge>
                          </div>

                          <div className="flex items-start gap-3">
                            <img
                              src={masterAsset.url}
                              alt={masterAsset.fileName}
                              className="h-16 w-16 rounded-sm object-cover border border-border/60 shrink-0 bg-muted"
                            />
                            <div className="truncate flex-1">
                              <p className="text-xs font-medium text-foreground truncate" title={masterAsset.fileName}>
                                {masterAsset.fileName}
                              </p>
                              <p className="text-[11px] text-muted-foreground font-mono">
                                ID: {masterAsset.id.slice(0, 10)}...
                              </p>

                              {/* Master Candidate Dropdown Switcher */}
                              <div className="mt-1.5">
                                <label className="text-[10px] text-muted-foreground block mb-0.5">
                                  Switch master file:
                                </label>
                                <select
                                  value={currentMasterId}
                                  onChange={(e) => handleSelectMaster(group.hash, e.target.value)}
                                  className="w-full text-[11px] h-6 px-1.5 rounded border border-border/60 bg-background text-foreground"
                                >
                                  {allAssets.map((a) => (
                                    <option key={a.id} value={a.id}>
                                      {a.fileName} ({a.usageCount} uses)
                                    </option>
                                  ))}
                                </select>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Column 2: Redundant Duplicates (Will Be Unlinked & Sent to Trash) */}
                        <div className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-3 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-amber-700 dark:text-amber-400 flex items-center gap-1.5">
                              <Trash2 className="h-3.5 w-3.5 text-amber-600" />
                              Unlink & Send to Trash ({duplicateAssets.length} files)
                            </span>
                            <span className="text-[10px] text-muted-foreground">30-day grace period</span>
                          </div>

                          <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                            {duplicateAssets.map((dup) => (
                              <div
                                key={dup.id}
                                className="flex items-center justify-between text-xs p-1.5 rounded bg-background/80 border border-border/40"
                              >
                                <div className="flex items-center gap-2 truncate mr-2">
                                  <img
                                    src={dup.url}
                                    alt={dup.fileName}
                                    className="h-7 w-7 rounded object-cover border border-border/40 shrink-0"
                                  />
                                  <div className="truncate">
                                    <p className="text-[11px] font-medium text-foreground truncate" title={dup.fileName}>
                                      {dup.fileName}
                                    </p>
                                    <p className="text-[10px] text-muted-foreground">
                                      {dup.usageCount === 0
                                        ? "0 usages (Unused)"
                                        : `${dup.usageCount} usage(s) ➔ Re-links to Master`}
                                    </p>
                                  </div>
                                </div>
                                <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-700 dark:text-amber-300 font-mono shrink-0">
                                  To Trash
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <DialogFooter className="p-4 border-t border-border/60 bg-muted/20 flex items-center justify-between sm:justify-between shrink-0">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClose}
            disabled={executeMutation.isPending}
            className="text-xs"
          >
            {completedResult ? "Close" : "Cancel"}
          </Button>

          {!completedResult && hasDuplicates && (
            <Button
              size="sm"
              onClick={handleExecute}
              disabled={executeMutation.isPending}
              className="text-xs gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs font-semibold px-4"
            >
              {executeMutation.isPending ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  Consolidating & Moving to Trash...
                </>
              ) : (
                <>
                  <Zap className="h-3.5 w-3.5 fill-white" />
                  Consolidate & Move {scanData?.totalDuplicateAssets} Files to Trash
                </>
              )}
            </Button>
          )}

          {completedResult && (
            <Button size="sm" onClick={handleClose} className="text-xs px-4">
              Done
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default StorageOptimizerModal
