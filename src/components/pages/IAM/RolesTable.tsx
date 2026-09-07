import { useState } from "react"
import { motion } from "framer-motion"
import { Edit2, Trash2, Plus, Shield } from "lucide-react"
import { cn } from "@/lib/utils"
import Pagination from "@/components/pages/UserList/Pagination"
import { useGetRoles, type RoleItem } from "@/hooks/role/useRoles"
import RoleFormModal from "./RoleFormModal"
import DeleteRoleModal from "./DeleteRoleModal"

export default function RolesTable() {
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedRoleForEdit, setSelectedRoleForEdit] = useState<RoleItem | null>(null)
  const [selectedRoleForDelete, setSelectedRoleForDelete] = useState<RoleItem | null>(null)
  const [showCreateModal, setShowCreateModal] = useState(false)

  const limit = 10
  const { data, isLoading, isError } = useGetRoles(currentPage, limit)

  const roles = data?.data || []
  const totalPages = data?.meta?.totalPages || 1

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

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
      {/* Create Role Button */}
      <div className="mb-5 flex items-center justify-end">
        <button
          type="button"
          onClick={() => setShowCreateModal(true)}
          className={cn(
            "inline-flex cursor-pointer items-center gap-2 rounded-xl px-5 py-2.5",
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

      {/* Table Container */}
      <div className="min-h-[400px] overflow-hidden rounded-2xl border border-border/60 bg-background/50 backdrop-blur-xl">
        {/* Loading */}
        {isLoading ? (
          <div className="w-full">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-border/60 bg-muted/40 text-xs text-muted-foreground uppercase">
                  <tr>
                    <th className="px-6 py-4 font-semibold tracking-wider">Role</th>
                    <th className="px-6 py-4 font-semibold tracking-wider">Permissions</th>
                    <th className="px-6 py-4 font-semibold tracking-wider">Created</th>
                    <th className="px-6 py-4 text-right font-semibold tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {[1, 2, 3, 4, 5].map((i) => (
                    <tr key={i} className="border-b border-border/40">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-9 w-9 animate-pulse rounded-lg bg-muted/60" />
                          <div className="flex flex-col gap-2">
                            <div className="h-4 w-28 animate-pulse rounded bg-muted/60" />
                            <div className="h-3 w-44 animate-pulse rounded bg-muted/40" />
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-1.5">
                          <div className="h-6 w-16 animate-pulse rounded-full bg-muted/60" />
                          <div className="h-6 w-20 animate-pulse rounded-full bg-muted/60" />
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="h-4 w-24 animate-pulse rounded bg-muted/60" />
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <div className="h-8 w-8 animate-pulse rounded-md bg-muted/60" />
                          <div className="h-8 w-8 animate-pulse rounded-md bg-muted/60" />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : isError ? (
          <div className="flex h-64 items-center justify-center text-rose-500">
            Failed to load roles.
          </div>
        ) : roles.length === 0 ? (
          <div className="flex h-64 flex-col items-center justify-center gap-3 text-muted-foreground">
            <Shield className="h-10 w-10 opacity-40" />
            <p>No roles found. Create your first role to get started.</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full overflow-hidden text-left text-sm">
                {/* Header */}
                <thead className="border-b border-border/60 bg-muted/40 text-xs text-muted-foreground uppercase">
                  <tr>
                    <th className="px-6 py-4 font-semibold tracking-wider">Role</th>
                    <th className="px-6 py-4 font-semibold tracking-wider">Permissions</th>
                    <th className="px-6 py-4 font-semibold tracking-wider">Created</th>
                    <th className="px-6 py-4 text-right font-semibold tracking-wider">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {roles.map((role, idx) => (
                    <motion.tr
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05, duration: 0.3 }}
                      key={role.id}
                      className="group border-b border-border/40 transition-colors last:border-0 hover:bg-muted/30"
                    >
                      {/* Role Name + Description */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                            <Shield className="h-4 w-4" />
                          </div>
                          <div className="flex flex-col">
                            <span className="font-semibold text-foreground transition-colors group-hover:text-primary">
                              {role.name}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Permissions */}
                      <td className="px-6 py-4">
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
                      <td className="px-6 py-4 whitespace-nowrap text-muted-foreground">
                        {formatDate(role.createdAt)}
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                          {/* Edit */}
                          <button
                            type="button"
                            onClick={() => setSelectedRoleForEdit(role)}
                            className="cursor-pointer rounded-lg p-2 text-muted-foreground transition-colors hover:bg-primary/10 hover:text-primary"
                            title="Edit Role"
                          >
                            <Edit2 className="h-4 w-4" />
                          </button>

                          {/* Delete */}
                          <button
                            type="button"
                            onClick={() => setSelectedRoleForDelete(role)}
                            className="cursor-pointer rounded-lg p-2 text-muted-foreground transition-colors hover:bg-rose-500/10 hover:text-rose-500"
                            title="Delete Role"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="border-t border-border/60 bg-background/50 p-5 backdrop-blur-xl">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              </div>
            )}
          </>
        )}
      </div>

      {/* Create Modal */}
      <RoleFormModal
        open={showCreateModal}
        role={null}
        onClose={() => setShowCreateModal(false)}
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
