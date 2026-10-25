import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Edit2, Trash2, Plus, Key } from "lucide-react"
import { cn } from "@/lib/utils"
import { Pagination } from "@/components/shared/Pagination"
import { useListingPagination } from "@/hooks/ui/useListingPagination"
import {
  useGetPermissions,
  type PermissionItem,
} from "@/hooks/permission/usePermissions"
import PermissionFormModal from "./PermissionFormModal"
import DeletePermissionModal from "./DeletePermissionModal"

export interface PermissionsTableProps {
  showCreateModal?: boolean
  setShowCreateModal?: (show: boolean) => void
}

export default function PermissionsTable({
  showCreateModal: externalShowCreateModal,
  setShowCreateModal: externalSetShowCreateModal,
}: PermissionsTableProps = {}) {
  const [selectedPermForEdit, setSelectedPermForEdit] =
    useState<PermissionItem | null>(null)
  const [selectedPermForDelete, setSelectedPermForDelete] =
    useState<PermissionItem | null>(null)
  const [internalShowCreateModal, setInternalShowCreateModal] = useState(false)

  const isControlled = externalShowCreateModal !== undefined
  const showCreate = isControlled ? externalShowCreateModal : internalShowCreateModal
  const setShowCreate = externalSetShowCreateModal || setInternalShowCreateModal

  const {
    mode,
    currentPage,
    setCurrentPage,
    setTargetItems,
    effectiveLimit,
    pageSizeOptions,
    displayItems: permissions,
    hasMore,
    isLoadingMore,
    handleLoadMore,
    setIncomingData,
  } = useListingPagination<PermissionItem>({
    mode: "infinite",
    initialTargetItems: 10,
    isGrid: false,
    keyExtractor: (p) => p.id,
  })

  const { data, isLoading, isFetching, isError } = useGetPermissions(currentPage, effectiveLimit)

  useEffect(() => {
    if (data) {
      setIncomingData(data.data, data.meta?.total)
    }
  }, [data, setIncomingData])

  const totalPages = data?.meta?.totalPages || 1

  return (
    <>
      {/* Create Permission Button (rendered only if not controlled by parent FilterToolbar) */}
      {!isControlled && (
        <div className="mb-5 flex items-center justify-end">
          <button
            type="button"
            onClick={() => setShowCreate(true)}
            className={cn(
              "inline-flex cursor-pointer items-center gap-2 rounded-md px-5 py-2.5",
              "bg-primary text-primary-foreground text-sm font-semibold",
              "shadow-lg shadow-primary/20",
              "transition-all duration-200 hover:shadow-xl hover:shadow-primary/30 hover:brightness-110",
              "active:scale-[0.97]"
            )}
          >
            <Plus className="h-4 w-4" />
            Create Permission
          </button>
        </div>
      )}

      {/* Canonical Table Container */}
      <div className="overflow-hidden rounded-md border border-border/60 bg-card/60 shadow-xs backdrop-blur-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead className="border-b border-border/60 bg-muted/40 text-xs font-semibold uppercase tracking-wider text-muted-foreground select-none">
              <tr>
                <th className="px-5 py-3.5 font-semibold">Action</th>
                <th className="px-5 py-3.5 font-semibold">Resource</th>
                <th className="px-5 py-3.5 font-semibold">Scope</th>
                <th className="px-5 py-3.5 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40 text-foreground">
              {isLoading && currentPage === 1 && permissions.length === 0 ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-md bg-muted/60" />
                        <div className="flex flex-col gap-1.5">
                          <div className="h-4 w-32 rounded bg-muted/60" />
                          <div className="h-3 w-48 rounded bg-muted/40" />
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="h-6 w-20 rounded-full bg-muted/60" />
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="h-4 w-24 rounded bg-muted/60" />
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <div className="h-8 w-8 rounded-sm bg-muted/60" />
                        <div className="h-8 w-8 rounded-sm bg-muted/60" />
                      </div>
                    </td>
                  </tr>
                ))
              ) : isError ? (
                <tr>
                  <td colSpan={4} className="px-5 py-12 text-center text-rose-500">
                    Failed to load permissions.
                  </td>
                </tr>
              ) : permissions.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-5 py-12 text-center text-muted-foreground">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Key className="h-8 w-8 text-muted-foreground/40" />
                      <p className="text-sm font-medium text-foreground">No permissions found</p>
                      <p className="text-xs text-muted-foreground">Create your first permission to get started.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                <>
                  {permissions.map((perm, idx) => (
                    <motion.tr
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05, duration: 0.3 }}
                      key={perm.id}
                      className="group transition-colors hover:bg-muted/30"
                    >
                      {/* Action */}
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-amber-500/10 text-amber-500">
                            <Key className="h-4 w-4" />
                          </div>
                          <span className="font-semibold text-sm text-foreground transition-colors group-hover:text-primary">
                            {perm.action}
                          </span>
                        </div>
                      </td>

                      {/* Resource */}
                      <td className="px-5 py-3.5">
                        {perm.resource ? (
                          <span className="inline-flex items-center rounded-full border border-border/50 bg-muted/40 px-2.5 py-0.5 text-xs font-medium text-muted-foreground capitalize">
                            {perm.resource}
                          </span>
                        ) : (
                          <span className="text-xs text-muted-foreground/50">
                            —
                          </span>
                        )}
                      </td>

                      {/* Scope */}
                      <td className="px-5 py-3.5 whitespace-nowrap text-sm text-muted-foreground">
                        <span className="inline-flex items-center rounded border border-border/40 bg-background px-2 py-0.5 text-xs font-semibold text-muted-foreground">
                          {perm.scope}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-3.5 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Edit */}
                          <button
                            type="button"
                            onClick={() => setSelectedPermForEdit(perm)}
                            className="cursor-pointer rounded-sm p-1.5 text-muted-foreground transition-colors hover:bg-primary/10 hover:text-primary"
                            title="Edit Permission"
                          >
                            <Edit2 className="h-4 w-4" />
                          </button>

                          {/* Delete */}
                          <button
                            type="button"
                            onClick={() => setSelectedPermForDelete(perm)}
                            className="cursor-pointer rounded-sm p-1.5 text-muted-foreground transition-colors hover:bg-rose-500/10 hover:text-rose-500"
                            title="Delete Permission"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}

                  {/* Subtle inline skeleton row during background fetch */}
                  {Boolean(isLoadingMore || (isFetching && currentPage > 1)) && (
                    <tr className="animate-pulse bg-muted/20 border-b border-border/40">
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="h-9 w-9 rounded-md bg-muted/60" />
                          <div className="h-4 w-28 rounded bg-muted/60" />
                        </div>
                      </td>
                      <td className="px-5 py-3.5"><div className="h-4 w-24 rounded bg-muted/60" /></td>
                      <td className="px-5 py-3.5"><div className="h-6 w-16 rounded-full bg-muted/60" /></td>
                      <td className="px-5 py-3.5 text-right"><div className="h-8 w-16 rounded-sm bg-muted/60 ml-auto" /></td>
                    </tr>
                  )}
                </>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Universal Pagination */}
      {(data?.meta?.total ?? 0) > 0 && (
        <Pagination
          mode={mode}
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={data?.meta?.total}
          pageSize={effectiveLimit}
          pageSizeOptions={pageSizeOptions}
          onPageChange={setCurrentPage}
          onPageSizeChange={setTargetItems}
          hasMore={hasMore}
          isLoadingMore={isLoadingMore || (isFetching && currentPage > 1)}
          onLoadMore={handleLoadMore}
          loadedCount={permissions.length}
        />
      )}

      {/* Create Modal */}
      <PermissionFormModal
        open={showCreate}
        permission={null}
        onClose={() => setShowCreate(false)}
      />

      {/* Edit Modal */}
      <PermissionFormModal
        open={!!selectedPermForEdit}
        permission={selectedPermForEdit}
        onClose={() => setSelectedPermForEdit(null)}
      />

      {/* Delete Modal */}
      <DeletePermissionModal
        permission={selectedPermForDelete}
        onClose={() => setSelectedPermForDelete(null)}
      />
    </>
  )
}
