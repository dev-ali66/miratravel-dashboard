import { useState } from "react"
import { motion } from "framer-motion"
import { Edit2, Trash2, Plus, Key } from "lucide-react"
import { cn } from "@/lib/utils"
import Pagination from "@/components/pages/UserList/Pagination"
import {
  useGetPermissions,
  type PermissionItem,
} from "@/hooks/permission/usePermissions"
import PermissionFormModal from "./PermissionFormModal"
import DeletePermissionModal from "./DeletePermissionModal"

export default function PermissionsTable() {
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedPermForEdit, setSelectedPermForEdit] =
    useState<PermissionItem | null>(null)
  const [selectedPermForDelete, setSelectedPermForDelete] =
    useState<PermissionItem | null>(null)
  const [showCreateModal, setShowCreateModal] = useState(false)

  const limit = 10
  const { data, isLoading, isError } = useGetPermissions(currentPage, limit)

  const permissions = data?.data || []
  const totalPages = data?.meta?.totalPages || 1

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  return (
    <>
      {/* Create Permission Button */}
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
          Create Permission
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
                    <th className="px-6 py-4 font-semibold tracking-wider">
                      Action
                    </th>
                    <th className="px-6 py-4 font-semibold tracking-wider">
                      Resource
                    </th>
                    <th className="px-6 py-4 font-semibold tracking-wider">
                      Scope
                    </th>
                    <th className="px-6 py-4 text-right font-semibold tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {[1, 2, 3, 4, 5].map((i) => (
                    <tr key={i} className="border-b border-border/40">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-9 w-9 animate-pulse rounded-lg bg-muted/60" />
                          <div className="flex flex-col gap-2">
                            <div className="h-4 w-32 animate-pulse rounded bg-muted/60" />
                            <div className="h-3 w-48 animate-pulse rounded bg-muted/40" />
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="h-6 w-20 animate-pulse rounded-full bg-muted/60" />
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
            Failed to load permissions.
          </div>
        ) : permissions.length === 0 ? (
          <div className="flex h-64 flex-col items-center justify-center gap-3 text-muted-foreground">
            <Key className="h-10 w-10 opacity-40" />
            <p>
              No permissions found. Create your first permission to get started.
            </p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full overflow-hidden text-left text-sm">
                {/* Header */}
                <thead className="border-b border-border/60 bg-muted/40 text-xs text-muted-foreground uppercase">
                  <tr>
                    <th className="px-6 py-4 font-semibold tracking-wider">
                      Action
                    </th>
                    <th className="px-6 py-4 font-semibold tracking-wider">
                      Resource
                    </th>
                    <th className="px-6 py-4 font-semibold tracking-wider">
                      Scope
                    </th>
                    <th className="px-6 py-4 text-right font-semibold tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {permissions.map((perm, idx) => (
                    <motion.tr
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05, duration: 0.3 }}
                      key={perm.id}
                      className="group border-b border-border/40 transition-colors last:border-0 hover:bg-muted/30"
                    >
                      {/* Action */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-500/10 text-amber-500">
                            <Key className="h-4 w-4" />
                          </div>
                          <span className="font-semibold text-foreground transition-colors group-hover:text-primary">
                            {perm.action}
                          </span>
                        </div>
                      </td>

                      {/* Resource */}
                      <td className="px-6 py-4">
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
                      <td className="px-6 py-4 whitespace-nowrap text-muted-foreground">
                        <span className="inline-flex items-center rounded border border-border/40 bg-background px-2 py-0.5 text-[11px] font-semibold text-muted-foreground">
                          {perm.scope}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                          {/* Edit */}
                          <button
                            type="button"
                            onClick={() => setSelectedPermForEdit(perm)}
                            className="cursor-pointer rounded-lg p-2 text-muted-foreground transition-colors hover:bg-primary/10 hover:text-primary"
                            title="Edit Permission"
                          >
                            <Edit2 className="h-4 w-4" />
                          </button>

                          {/* Delete */}
                          <button
                            type="button"
                            onClick={() => setSelectedPermForDelete(perm)}
                            className="cursor-pointer rounded-lg p-2 text-muted-foreground transition-colors hover:bg-rose-500/10 hover:text-rose-500"
                            title="Delete Permission"
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
      <PermissionFormModal
        open={showCreateModal}
        permission={null}
        onClose={() => setShowCreateModal(false)}
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
