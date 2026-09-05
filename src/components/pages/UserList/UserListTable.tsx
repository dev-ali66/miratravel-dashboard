import Dropdown01 from "@/components/shared/Dropdown01"
import { useState } from "react"
import { motion } from "framer-motion"
import { Edit2, Trash2, CheckCircle2, XCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import Pagination from "./Pagination"
import { useGetUsers, type UserItem } from "@/hooks/users/useGetUsers"
import { useEditUser } from "@/hooks/users/useEditUser"
import { useGetInstructorFreeLeadUsed } from "@/hooks/instructor/useGetInstructorFreeLeadUsed"
import { useEditInstructorFreeLeadUsed } from "@/hooks/instructor/useEditInstructorFreeLeadUsed"
import EditUserModal from "./EditUserModal"
import DeleteUserModal from "./DeleteUserModal"

const statusStyles: Record<string, string> = {
  ACTIVE: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
  INACTIVE: "bg-amber-500/10 text-amber-500 border-amber-500/20",
  DEACTIVE: "bg-zinc-500/10 text-zinc-400 border-zinc-500/20",
  BLOCKED: "bg-red-500/10 text-red-500 border-red-500/20",
  SUSPENDED: "bg-orange-500/10 text-orange-500 border-orange-500/20",
  PENDING: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  DELETED: "bg-rose-500/10 text-rose-500 border-rose-500/20",
  ARCHIVED: "bg-slate-500/10 text-slate-400 border-slate-500/20",
}

const roleStyles: Record<string, string> = {
  ADMIN: "bg-purple-500/10 text-purple-500 border-purple-500/20",
  MODERATOR: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  INSTRUCTOR: "bg-cyan-500/10 text-cyan-500 border-cyan-500/20",
  USER: "bg-zinc-500/10 text-zinc-400 border-zinc-500/20",
}

export default function UserListTable() {
  const [currentPage, setCurrentPage] = useState(1)

  const [selectedUserForEdit, setSelectedUserForEdit] =
    useState<UserItem | null>(null)

  const [selectedUserForDelete, setSelectedUserForDelete] =
    useState<UserItem | null>(null)

  const limit = 10

  // Users
  const { data, isLoading, isError } = useGetUsers(currentPage, limit)

  // Edit single user
  const { mutate: editUser } = useEditUser()

  // Global instructor free lead status
  const { data: freeLeadData, isLoading: isFreeLeadLoading } =
    useGetInstructorFreeLeadUsed()

  // Update all instructors free lead status
  const { mutate: editFreeLeadUsed, isPending: isUpdatingFreeLead } =
    useEditInstructorFreeLeadUsed()

  const currentUsers = data?.data || []
  const totalPages = data?.meta?.totalPages || 1

  /**
   * Global free lead status.
   *
   * API returns:
   * data: true  -> all instructors have free_lead_used = true
   * data: false -> at least one instructor has false
   */
  const freeLeadUsed = freeLeadData?.data ?? false

  const handleStatusChange = (userId: string, newStatus: string) => {
    editUser({
      id: userId,
      status: newStatus,
    })
  }

  const handleEditUser = (user: UserItem) => {
    setSelectedUserForEdit(user)
  }

  const handleDeleteUser = (user: UserItem) => {
    setSelectedUserForDelete(user)
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  /**
   * Toggle free lead status for ALL instructors.
   */
  const handleFreeLeadToggle = () => {
    editFreeLeadUsed({
      free_lead_used: !freeLeadUsed,
    })
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Never"

    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className="w-full animate-in pt-2 duration-700 fade-in slide-in-from-bottom-4">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        {/* Title */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            User Management
          </h1>

          <p className="mt-1 text-sm text-muted-foreground">
            Manage your team members and their account permissions.
          </p>
        </div>

        {/* Free Lead Control */}
        <div className="flex items-center gap-4 rounded-xl border border-border/60 bg-background/60 px-4 py-3 backdrop-blur-xl">
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-foreground">
              Free Lead Access
            </span>

            <span className="text-xs text-muted-foreground">
              {isFreeLeadLoading
                ? "Checking free lead status..."
                : freeLeadUsed
                  ? "Free lead is currently enabled"
                  : "Free lead is currently disabled"}
            </span>
          </div>

          {/* Switch */}
          <button
            type="button"
            role="switch"
            aria-checked={freeLeadUsed}
            aria-label="Toggle free lead access for all instructors"
            disabled={isFreeLeadLoading || isUpdatingFreeLead}
            onClick={handleFreeLeadToggle}
            className={cn(
              "relative inline-flex h-6 w-11 shrink-0 items-center rounded-full",
              "transition-colors duration-200",
              "focus:ring-2 focus:ring-primary/30 focus:outline-none",
              "disabled:cursor-not-allowed disabled:opacity-50",
              freeLeadUsed ? "bg-primary" : "bg-muted"
            )}
          >
            <span
              className={cn(
                "inline-block h-4 w-4 rounded-full bg-white shadow-sm",
                "transition-transform duration-200",
                freeLeadUsed ? "translate-x-6" : "translate-x-1"
              )}
            />
          </button>
        </div>
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
                      User
                    </th>

                    <th className="px-6 py-4 font-semibold tracking-wider">
                      Role
                    </th>

                    <th className="px-6 py-4 font-semibold tracking-wider">
                      Verified
                    </th>

                    <th className="px-6 py-4 font-semibold tracking-wider">
                      Status
                    </th>

                    <th className="px-6 py-4 font-semibold tracking-wider">
                      Last Active
                    </th>

                    <th className="px-6 py-4 text-right font-semibold tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {[1, 2, 3, 4, 5].map((i) => (
                    <tr key={i} className="border-b border-border/40">
                      {/* User */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className="h-10 w-10 shrink-0 animate-pulse rounded-full bg-muted/60" />

                          <div className="flex w-full flex-col gap-2">
                            <div className="h-4 w-32 animate-pulse rounded bg-muted/60" />
                            <div className="h-3 w-48 animate-pulse rounded bg-muted/40" />
                          </div>
                        </div>
                      </td>

                      {/* Role */}
                      <td className="px-6 py-4">
                        <div className="h-6 w-20 animate-pulse rounded-full bg-muted/60" />
                      </td>

                      {/* Verified */}
                      <td className="px-6 py-4">
                        <div className="h-6 w-20 animate-pulse rounded-full bg-muted/60" />
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4">
                        <div className="h-9 w-28 animate-pulse rounded-full bg-muted/60" />
                      </td>

                      {/* Last Active */}
                      <td className="px-6 py-4">
                        <div className="h-4 w-24 animate-pulse rounded bg-muted/60" />
                      </td>

                      {/* Actions */}
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
            Failed to load users.
          </div>
        ) : currentUsers.length === 0 ? (
          <div className="flex h-64 items-center justify-center text-muted-foreground">
            No users found.
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full overflow-hidden text-left text-sm">
                {/* Header */}
                <thead className="border-b border-border/60 bg-muted/40 text-xs text-muted-foreground uppercase">
                  <tr>
                    <th className="px-6 py-4 font-semibold tracking-wider">
                      User
                    </th>

                    <th className="px-6 py-4 font-semibold tracking-wider">
                      Role
                    </th>

                    <th className="px-6 py-4 font-semibold tracking-wider">
                      Verified
                    </th>

                    <th className="px-6 py-4 font-semibold tracking-wider">
                      Status
                    </th>

                    <th className="px-6 py-4 font-semibold tracking-wider">
                      Last Active
                    </th>

                    <th className="px-6 py-4 text-right font-semibold tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {currentUsers.map((user, idx) => {
                    const name = user.firstName
                      ? `${user.firstName} ${user.lastName || ""}`.trim()
                      : user.email.split("@")[0]

                    const avatar =
                      user.photoUrl ||
                      `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
                        name
                      )}`

                    const role = user.roles?.toUpperCase() || "USER"

                    const status = user.status?.toUpperCase() || "ACTIVE"

                    return (
                      <motion.tr
                        initial={{
                          opacity: 0,
                          y: 10,
                        }}
                        animate={{
                          opacity: 1,
                          y: 0,
                        }}
                        transition={{
                          delay: idx * 0.05,
                          duration: 0.3,
                        }}
                        key={user.id}
                        className="group border-b border-border/40 transition-colors last:border-0 hover:bg-muted/30"
                      >
                        {/* User */}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-4">
                            <div className="relative h-10 w-10 overflow-hidden rounded-full ring-2 ring-transparent transition-all duration-300 group-hover:ring-primary/20">
                              <img
                                src={avatar}
                                alt={name}
                                className="h-full w-full object-cover"
                              />
                            </div>

                            <div className="flex flex-col">
                              <span className="font-semibold text-foreground transition-colors group-hover:text-primary">
                                {name}
                              </span>

                              <span className="text-xs text-muted-foreground">
                                {user.email}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Role */}
                        <td className="px-6 py-4">
                          <span
                            className={cn(
                              "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold capitalize",
                              roleStyles[role] || roleStyles.USER
                            )}
                          >
                            {role.toLowerCase()}
                          </span>
                        </td>

                        {/* Verified */}
                        <td className="px-6 py-4">
                          {user.isVerified ? (
                            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 text-xs font-semibold text-emerald-500">
                              <CheckCircle2 className="h-3.5 w-3.5" />
                              Verified
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 rounded-full border border-rose-500/20 bg-rose-500/10 px-2.5 py-1 text-xs font-semibold text-rose-500">
                              <XCircle className="h-3.5 w-3.5" />
                              Unverified
                            </span>
                          )}
                        </td>

                        {/* Status */}
                        <td className="px-6 py-4">
                          <Dropdown01
                            options={[
                              {
                                label: "Active",
                                value: "ACTIVE",
                              },
                              {
                                label: "Inactive",
                                value: "INACTIVE",
                              },
                              {
                                label: "Deactive",
                                value: "DEACTIVE",
                              },
                              {
                                label: "Blocked",
                                value: "BLOCKED",
                              },
                              {
                                label: "Suspended",
                                value: "SUSPENDED",
                              },
                              {
                                label: "Pending",
                                value: "PENDING",
                              },
                              {
                                label: "Deleted",
                                value: "DELETED",
                              },
                              {
                                label: "Archived",
                                value: "ARCHIVED",
                              },
                            ]}
                            value={status}
                            onChange={(val) => handleStatusChange(user.id, val)}
                            triggerClassName={cn(
                              statusStyles[status] || statusStyles.ACTIVE
                            )}
                          />
                        </td>

                        {/* Last Active */}
                        <td className="px-6 py-4 whitespace-nowrap text-muted-foreground">
                          {formatDate(user.lastLoginAt)}
                        </td>

                        {/* Actions */}
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                            {/* Edit */}
                            <button
                              type="button"
                              onClick={() => handleEditUser(user)}
                              className="cursor-pointer rounded-lg p-2 text-muted-foreground transition-colors hover:bg-primary/10 hover:text-primary"
                              title="Edit User"
                            >
                              <Edit2 className="h-4 w-4" />
                            </button>

                            {/* Delete */}
                            <button
                              type="button"
                              onClick={() => handleDeleteUser(user)}
                              className="cursor-pointer rounded-lg p-2 text-muted-foreground transition-colors hover:bg-rose-500/10 hover:text-rose-500"
                              title="Delete User"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    )
                  })}
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

      {/* Edit Modal */}
      <EditUserModal
        user={selectedUserForEdit}
        onClose={() => setSelectedUserForEdit(null)}
      />

      {/* Delete Modal */}
      <DeleteUserModal
        user={selectedUserForDelete}
        onClose={() => setSelectedUserForDelete(null)}
      />
    </div>
  )
}
