import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Edit2, Trash2, Plus, Shield } from "lucide-react"
import { cn } from "@/lib/utils"
import { Pagination } from "@/components/shared/Pagination"
import { useListingPagination } from "@/hooks/ui/useListingPagination"
import { useGetRoles, type RoleItem } from "@/hooks/role/useRoles"
import RoleFormModal from "./RoleFormModal"
import DeleteRoleModal from "./DeleteRoleModal"

export interface RolesTableProps {
  showCreateModal?: boolean
  setShowCreateModal?: (show: boolean) => void
}

export default function RolesTable({
  showCreateModal: externalShowCreateModal,
  setShowCreateModal: externalSetShowCreateModal,
}: RolesTableProps = {}) {
  const [selectedRoleForEdit, setSelectedRoleForEdit] = useState<RoleItem | null>(null)
  const [selectedRoleForDelete, setSelectedRoleForDelete] = useState<RoleItem | null>(null)
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
    displayItems: roles,
    hasMore,
    isLoadingMore,
    handleLoadMore,
    setIncomingData,
  } = useListingPagination<RoleItem>({
    mode: "infinite",
    initialTargetItems: 10,
    isGrid: false,
    keyExtractor: (r) => r.id,
  })

  const { data, isLoading, isFetching, isError } = useGetRoles(currentPage, effectiveLimit)

  useEffect(() => {
    if (data) {
      setIncomingData(data.data, data.meta?.total)
    }
  }, [data, setIncomingData])

  const totalPages = data?.meta?.totalPages || 1

  const formatDate = (dateString?: string) => {
    if (!dateString) return "—"
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  return (
    <>
      {/* Create Role Button (rendered only if not controlled by parent FilterToolbar) */}
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
            Create Role
          </button>
        </div>
      )}

      {/* Canonical Table Container */}
      <div className="overflow-hidden rounded-md border border-border/60 bg-card/60 shadow-xs backdrop-blur-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead className="border-b border-border/60 bg-muted/40 text-xs font-semibold uppercase tracking-wider text-muted-foreground select-none">
              <tr>
                <th className="px-5 py-3.5 font-semibold">Role</th>
                <th className="px-5 py-3.5 font-semibold">Permissions</th>
                <th className="px-5 py-3.5 font-semibold">Created</th>
                <th className="px-5 py-3.5 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40 text-foreground">
              {isLoading && currentPage === 1 && roles.length === 0 ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-md bg-muted/60" />
                        <div className="flex flex-col gap-1.5">
                          <div className="h-4 w-28 rounded bg-muted/60" />
                          <div className="h-3 w-40 rounded bg-muted/40" />
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex gap-1.5">
                        <div className="h-6 w-16 rounded-full bg-muted/60" />
                        <div className="h-6 w-20 rounded-full bg-muted/60" />
                      </div>
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
                    Failed to load roles.
                  </td>
                </tr>
              ) : roles.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-5 py-12 text-center text-muted-foreground">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Shield className="h-8 w-8 text-muted-foreground/40" />
                      <p className="text-sm font-medium text-foreground">No roles found</p>
                      <p className="text-xs text-muted-foreground">Create your first role to get started.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                <>
                  {roles.map((role, idx) => (
                    <motion.tr
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05, duration: 0.3 }}
                      key={role.id}
                      className="group transition-colors hover:bg-muted/30"
                    >
                      {/* Role Name + Description */}
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                            <Shield className="h-4 w-4" />
                          </div>
                          <div className="flex flex-col">
                            <span className="font-semibold text-sm text-foreground transition-colors group-hover:text-primary">
                              {role.name}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Permissions */}
                      <td className="px-5 py-3.5">
                        <div className="flex flex-wrap gap-1.5">
                          {role.permissions?.length > 0 ? (
                            <>
                              {role.permissions.slice(0, 3).map((perm: any) => {
                                const label =
                                  typeof perm === "string"
                                    ? perm
                                    : perm.action
                                      ? `${perm.action}${perm.resource ? `:${perm.resource}` : ""}`
                                      : perm.name || perm.id
                                const key =
                                  typeof perm === "string" ? perm : perm.id

                                return (
                                  <span
                                    key={key}
                                    className="inline-flex items-center rounded-full border border-border/50 bg-muted/40 px-2.5 py-0.5 text-xs font-medium text-muted-foreground"
                                  >
                                    {label}
                                  </span>
                                )
                              })}
                              {role.permissions.length > 3 && (
                                <span className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
                                  +{role.permissions.length - 3} more
                                </span>
                              )}
                            </>
                          ) : (
                            <span className="text-xs text-muted-foreground/50">
                              No permissions
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Created At */}
                      <td className="px-5 py-3.5 whitespace-nowrap text-sm text-muted-foreground">
                        {formatDate(role.createdAt)}
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-3.5 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Edit */}
                          <button
                            type="button"
                            onClick={() => setSelectedRoleForEdit(role)}
                            className="cursor-pointer rounded-sm p-1.5 text-muted-foreground transition-colors hover:bg-primary/10 hover:text-primary"
                            title="Edit Role"
                          >
                            <Edit2 className="h-4 w-4" />
                          </button>

                          {/* Delete */}
                          <button
                            type="button"
                            onClick={() => setSelectedRoleForDelete(role)}
                            className="cursor-pointer rounded-sm p-1.5 text-muted-foreground transition-colors hover:bg-rose-500/10 hover:text-rose-500"
                            title="Delete Role"
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
                      <td className="px-5 py-3.5">
                        <div className="flex gap-1.5">
                          <div className="h-6 w-16 rounded-full bg-muted/60" />
                          <div className="h-6 w-20 rounded-full bg-muted/60" />
                        </div>
                      </td>
                      <td className="px-5 py-3.5"><div className="h-4 w-24 rounded bg-muted/60" /></td>
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
          loadedCount={roles.length}
        />
      )}

      {/* Create Modal */}
      <RoleFormModal
        open={showCreate}
        role={null}
        onClose={() => setShowCreate(false)}
      />

      {/* Edit Modal */}
      <RoleFormModal
        open={!!selectedRoleForEdit}
        role={selectedRoleForEdit}
        onClose={() => setSelectedRoleForEdit(null)}
      />

      {/* Delete Modal */}
      <DeleteRoleModal
        role={selectedRoleForDelete}
        onClose={() => setSelectedRoleForDelete(null)}
      />
    </>
  )
}
